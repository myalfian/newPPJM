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
      // Backup to localStorage
      try {
        localStorage.setItem(EDITOR_PUBLISHED_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch (err) {
    console.warn('[EditorStorage] Failed to fetch remote published config, using local cache:', err);
  }

  return localFallback;
};

export const saveEditorDraft = (state: PageEditorState): void => {
  try {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[EditorStorage] Error saving draft:', err);
  }
};

export const publishEditorState = async (state: PageEditorState): Promise<{ success: boolean; timestamp: string }> => {
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

    // 2. Dispatch custom event so public website reacts immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ppjm-editor-published', { detail: updatedState }));
    }

    // 3. Save to Supabase site_settings with key 'home_sections_config'
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('site_settings')
          .upsert(
            {
              key: 'home_sections_config',
              value: updatedState as any,
              description: 'Konfigurasi visual layout beranda publik',
              updated_at: publishedAt
            },
            { onConflict: 'key' }
          );
      } catch (cloudErr) {
        console.warn('[EditorStorage] Supabase cloud sync failed, local persistence active:', cloudErr);
      }
    }

    return { success: true, timestamp: publishedAt };
  } catch (err) {
    console.error('[EditorStorage] Publish error:', err);
    return { success: false, timestamp: publishedAt };
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
