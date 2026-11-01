/**
 * Utility to wipe legacy hardcoded seed and mock localStorage/sessionStorage/cache
 * Ensuring live data always comes fresh from Supabase Database.
 */
export function clearOldSeedCache(): void {
  const keysToRemove = [
    'sambutan',
    'sliders',
    'initialSections',
    'cms_sections',
    'facilities',
    'berita',
    'seed',
    'ppjm_seed',
    'ppjm_published_public_state_v1',
    'ppjm_live_editor_state_v1',
    'ppjm_legacy_sambutan_cache',
    'ppjm_legacy_news_cache'
  ];

  keysToRemove.forEach((k) => {
    try {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    } catch {
      // Ignore security errors in restricted environments
    }
  });

  // Clear PWA / Service Worker caches if present
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes('ppjm') || name.includes('seed') || name.includes('workbox')) {
            caches.delete(name);
          }
        });
      });
    } catch {
      // Ignore cache API errors
    }
  }

  console.log('✅ [PPJM] Old seed cache and mock localStorage cleared successfully.');
}

export default clearOldSeedCache;

