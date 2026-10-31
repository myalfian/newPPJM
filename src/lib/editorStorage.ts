import { PageEditorState, INITIAL_EDITOR_STATE } from '../types/EditorState';
import { supabase, isSupabaseConfigured } from './supabase';

const EDITOR_STORAGE_KEY = 'ppjm_live_editor_state_v1';
const EDITOR_PUBLISHED_KEY = 'ppjm_published_public_state_v1';

export const loadEditorState = (): PageEditorState => {
  try {
    const raw = localStorage.getItem(EDITOR_STORAGE_KEY);
    if (!raw) return INITIAL_EDITOR_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_EDITOR_STATE,
      ...parsed,
      meta: {
        ...INITIAL_EDITOR_STATE.meta,
        ...(parsed.meta || {})
      },
      sections: {
        ...INITIAL_EDITOR_STATE.sections,
        ...(parsed.sections || {})
      }
    };
  } catch (err) {
    console.warn('[EditorStorage] Failed to parse local editor state, using defaults', err);
    return INITIAL_EDITOR_STATE;
  }
};

export const getPublishedEditorState = (): PageEditorState => {
  try {
    const raw = localStorage.getItem(EDITOR_PUBLISHED_KEY);
    if (!raw) return loadEditorState();
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_EDITOR_STATE,
      ...parsed,
      meta: {
        ...INITIAL_EDITOR_STATE.meta,
        ...(parsed.meta || {})
      },
      sections: {
        ...INITIAL_EDITOR_STATE.sections,
        ...(parsed.sections || {})
      }
    };
  } catch {
    return INITIAL_EDITOR_STATE;
  }
};

/**
 * Fetch published configuration from remote Supabase cloud.
 * Falls back to local storage cache only if network fails.
 */
export const fetchPublishedEditorState = async (): Promise<PageEditorState> => {
  const localFallback = getPublishedEditorState();

  if (!isSupabaseConfigured()) {
    return localFallback;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'home_sections_config')
      .maybeSingle();

    if (!error && data && data.value) {
      const remoteVal = data.value as any;
      const merged: PageEditorState = {
        ...INITIAL_EDITOR_STATE,
        ...remoteVal,
        meta: {
          ...INITIAL_EDITOR_STATE.meta,
          ...(remoteVal.meta || {})
        },
        sections: {
          ...INITIAL_EDITOR_STATE.sections,
          ...(remoteVal.sections || {})
        }
      };
      
      // Update local storage cache
      try {
        localStorage.setItem(EDITOR_PUBLISHED_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }

    // If cloud is empty, seed initial state so subsequent visits load from cloud
    if (!error && (!data || !data.value)) {
      console.log('[EditorStorage] Cloud site_settings empty, seeding INITIAL_EDITOR_STATE...');
      await supabase.from('site_settings').upsert({
        key: 'home_sections_config',
        value: INITIAL_EDITOR_STATE as any,
        description: 'Konfigurasi visual layout beranda publik',
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
    }
  } catch (err) {
    console.warn('[EditorStorage] Failed to fetch remote published config, using local cache:', err);
  }

  return localFallback;
};

/**
 * Asynchronously persist local draft to browser and cloud draft if configured
 */
export const saveEditorDraft = async (state: PageEditorState): Promise<void> => {
  try {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[EditorStorage] Error saving draft locally:', err);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'home_sections_draft',
            value: state as any,
            description: 'Draft kerja visual editor',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );
    } catch (err) {
      // Non-blocking draft sync
    }
  }
};

/**
 * Publish editor state to Supabase production site_settings AND individual cms_sections table
 */
export const publishEditorState = async (
  state: PageEditorState
): Promise<{ success: boolean; timestamp: string; error?: string }> => {
  const publishedAt = new Date().toISOString();
  const updatedState: PageEditorState = {
    ...state,
    meta: {
      ...state.meta,
      lastPublishedAt: publishedAt
    }
  };

  try {
    // 1. Save to local storage draft & public published cache
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(updatedState));
    localStorage.setItem(EDITOR_PUBLISHED_KEY, JSON.stringify(updatedState));

    // 2. Dispatch custom event for immediate same-window reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ppjm-editor-published', { detail: updatedState }));
    }

    // 3. Save to Supabase site_settings
    if (isSupabaseConfigured()) {
      const { data, error: siteErr } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'home_sections_config',
            value: updatedState as any,
            description: 'Konfigurasi visual layout beranda publik',
            updated_at: publishedAt
          },
          { onConflict: 'key' }
        )
        .select();

      if (siteErr) {
        console.error('[EditorStorage] Failed to save site_settings:', siteErr);
        return { success: false, timestamp: publishedAt, error: `${siteErr.message} (${siteErr.code})` };
      }

      // 4. Synchronize individual sections to cms_sections table
      try {
        const sectionEntries = Object.entries(updatedState.sections);
        const sectionRows = sectionEntries.map(([secKey, sec]) => ({
          id: sec.id || secKey,
          type: sec.id || secKey,
          data: sec.data || {},
          visible: sec.isVisible !== false,
          order_index: sec.order || 0,
          updated_at: publishedAt
        }));

        await supabase
          .from('cms_sections')
          .upsert(sectionRows, { onConflict: 'id' });
      } catch (secSyncErr) {
        console.warn('[EditorStorage] Non-critical: cms_sections batch sync notice:', secSyncErr);
      }
    }

    return { success: true, timestamp: publishedAt };
  } catch (err: any) {
    console.error('[EditorStorage] Publish error:', err);
    return { success: false, timestamp: publishedAt, error: err?.message || 'Unknown publish error' };
  }
};

export const resetEditorStateToDefault = (): PageEditorState => {
  try {
    localStorage.removeItem(EDITOR_STORAGE_KEY);
    localStorage.removeItem(EDITOR_PUBLISHED_KEY);
  } catch (err) {
    console.warn('[EditorStorage] Reset warning:', err);
  }
  return INITIAL_EDITOR_STATE;
};
