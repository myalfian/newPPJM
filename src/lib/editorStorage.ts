import { PageEditorState, INITIAL_EDITOR_STATE } from '../types/EditorState';

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

export const saveEditorDraft = (state: PageEditorState): void => {
  try {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[EditorStorage] Error saving draft:', err);
  }
};

export const publishEditorState = (state: PageEditorState): { success: boolean; timestamp: string } => {
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

    // Dispatch custom event so public website can react in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ppjm-editor-published', { detail: updatedState }));
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

