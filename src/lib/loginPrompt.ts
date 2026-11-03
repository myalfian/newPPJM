export const LOGIN_REQUIRED_EVENT = 'jm:login-required';

export interface LoginRequiredDetail {
  /** Human readable name of the blocked feature, e.g. "Kumpulkan Tugas". */
  feature?: string;
  /** Who the feature is for, e.g. "Santri". */
  audience?: string;
  /** Preselected tab on /login (santri | guru | admin). */
  as?: 'santri' | 'guru' | 'admin';
}

/** Opens the global "login required" dialog (mounted once in RootLayout). */
export function promptLogin(detail: LoginRequiredDetail = {}): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<LoginRequiredDetail>(LOGIN_REQUIRED_EVENT, { detail }));
}

