/**
 * Single source of truth for role names + route access (the SPA equivalent of a
 * Next.js middleware matcher). "guest" is NOT stored in the database: it is the
 * state of a visitor that has no Supabase session.
 */
export type AppRole =
  | 'guest'
  | 'super_admin'
  | 'yayasan'
  | 'kepsek'
  | 'guru'
  | 'musyrif'
  | 'santri'
  | 'ppdb'
  | 'keuangan'
  | 'humas'
  | 'osis_pengurus';

export const ROLE_LABEL: Record<AppRole, string> = {
  guest: 'Guest',
  super_admin: 'Super Admin',
  yayasan: 'Yayasan',
  kepsek: 'Kepala Sekolah',
  guru: 'Guru',
  musyrif: 'Musyrif',
  santri: 'Santri',
  ppdb: 'Panitia PPDB',
  keuangan: 'Keuangan',
  humas: 'Humas',
  osis_pengurus: 'Pengurus OSIS',
};

const ALIASES: Record<string, AppRole> = {
  guest: 'guest',
  visitor: 'guest',
  super_admin: 'super_admin',
  superadmin: 'super_admin',
  admin: 'super_admin',
  yayasan: 'yayasan',
  admin_yayasan: 'yayasan',
  kepsek: 'kepsek',
  kepala_sekolah: 'kepsek',
  guru: 'guru',
  guru_akademik: 'guru',
  ustadz: 'guru',
  musyrif: 'musyrif',
  musyrifah: 'musyrif',
  santri: 'santri',
  user: 'santri',
  student: 'santri',
  ppdb: 'ppdb',
  staff_ppdb: 'ppdb',
  keuangan: 'keuangan',
  humas: 'humas',
  pengurus_konten: 'humas',
  osis_pengurus: 'osis_pengurus',
  osis: 'osis_pengurus',
  ketua_osis: 'osis_pengurus',
};

/** Returns null when the value is empty / unknown (so callers can fall back). */
export function parseAppRole(raw?: string | null): AppRole | null {
  const key = (raw || '').toLowerCase().trim();
  return ALIASES[key] ?? null;
}

const ADMIN_AREA_ROLES: AppRole[] = ['super_admin', 'yayasan', 'kepsek', 'humas', 'ppdb', 'keuangan', 'osis_pengurus'];

export interface ProtectedArea {
  prefix: string;
  allowed: AppRole[];
  label: string;
}

export const PROTECTED_AREAS: ProtectedArea[] = [
  { prefix: '/santri', allowed: ['santri', 'guru', 'musyrif', 'super_admin'], label: 'Portal Santri' },
  { prefix: '/guru', allowed: ['guru', 'musyrif', 'kepsek', 'super_admin'], label: 'Portal Guru' },
  { prefix: '/admin', allowed: ADMIN_AREA_ROLES, label: 'Panel Admin' },
];

export function matchProtectedArea(pathname: string): ProtectedArea | null {
  return (
    PROTECTED_AREAS.find((a) => pathname === a.prefix || pathname.startsWith(a.prefix + '/')) ?? null
  );
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  const area = matchProtectedArea(pathname);
  if (!area) return true; // public route
  return area.allowed.includes(role);
}

/** Default landing page after login. */
export function homeForRole(role: AppRole): string {
  switch (role) {
    case 'santri':
      return '/santri';
    case 'guru':
    case 'musyrif':
      return '/guru';
    case 'super_admin':
    case 'yayasan':
    case 'kepsek':
    case 'humas':
    case 'ppdb':
    case 'keuangan':
    case 'osis_pengurus':
      return '/admin';
    default:
      return '/';
  }
}

/** Only same-origin relative paths are accepted (prevents open-redirect). */
export function safeRedirectPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return null;
  if (/[\u0000-\u001f]/.test(raw)) return null;
  if (raw.startsWith('/login')) return null;
  return raw;
}

export const LOGIN_SECTION_ID = 'login-section';

export function buildLoginUrl(opts: { as?: string; redirect?: string; from?: string } = {}): string {
  const q = new URLSearchParams();
  if (opts.as) q.set('as', opts.as);
  if (opts.from) q.set('from', opts.from);
  const safe = safeRedirectPath(opts.redirect);
  if (safe) q.set('redirect', safe);
  const qs = q.toString();
  return `/login${qs ? `?${qs}` : ''}#${LOGIN_SECTION_ID}`;
}

