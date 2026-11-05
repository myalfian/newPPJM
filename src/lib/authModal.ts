/**
 * Global Auth Modal event system.
 * Any component can call openAuthModal() to open the login/register modal
 * without navigating away from the current page.
 */

export const AUTH_MODAL_EVENT = 'jm:auth-modal';

export type AuthModalView = 'login' | 'register';
export type AuthModalTab = 'guest' | 'santri' | 'guru' | 'admin';

export interface AuthModalDetail {
  /** Which view to show: login form or register form. */
  view?: AuthModalView;
  /** Preselected login tab (guest | santri | guru | admin). */
  tab?: AuthModalTab;
  /** Where to redirect after login. */
  redirect?: string;
  /** Source of the open request (for analytics / UX hints). */
  from?: string;
}

/** Opens the global auth modal from anywhere in the app. */
export function openAuthModal(detail: AuthModalDetail = {}): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AuthModalDetail>(AUTH_MODAL_EVENT, { detail }));
}

