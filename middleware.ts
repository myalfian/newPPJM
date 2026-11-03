/**
 * Edge / Next.js Compatible Authentication & Guest Default Flow Middleware
 * -------------------------------------------------------------------------
 * - Default state for unauthenticated visitors (`auth.uid() == null`):
 *   sets cookie `role=guest` and allows access to all public routes without redirecting.
 * - Public routes (`/`, `/profil`, `/fasilitas`, `/prestasi`, `/ppdb`, `/berita/*`, `/galeri`, `/login`, etc.):
 *   accessible to `guest` and all authenticated roles.
 * - Protected routes:
 *   - `/santri/*` -> `santri`, `guru`, `musyrif`, `super_admin`
 *   - `/guru/*`   -> `guru`, `musyrif`, `kepsek`, `super_admin`
 *   - `/admin/*`  -> `super_admin`, `yayasan`, `kepsek`, `humas`, `ppdb`, `keuangan`
 * - When a `guest` requests a protected route, redirects to `/login?redirect=<pathname>#login-section`.
 */

import { createServerClient } from '@supabase/ssr';

export type MiddlewareRole =
  | 'guest'
  | 'super_admin'
  | 'yayasan'
  | 'kepsek'
  | 'guru'
  | 'musyrif'
  | 'santri'
  | 'ppdb'
  | 'keuangan'
  | 'humas';

export const PUBLIC_ROUTES: string[] = [
  '/',
  '/profil',
  '/fasilitas',
  '/prestasi',
  '/ppdb',
  '/spmb',
  '/berita',
  '/jm-news',
  '/galeri',
  '/jm-center',
  '/program',
  '/program-unggulan',
  '/smart-jm',
  '/ekstrakurikuler',
  '/osis',
  '/karya-siswa',
  '/agenda',
  '/login',
];

export const PROTECTED_ROUTE_RULES: {
  prefix: string;
  allowedRoles: MiddlewareRole[];
  defaultAs: 'santri' | 'guru' | 'admin';
}[] = [
  {
    prefix: '/santri',
    allowedRoles: ['santri', 'guru', 'musyrif', 'super_admin'],
    defaultAs: 'santri',
  },
  {
    prefix: '/guru',
    allowedRoles: ['guru', 'musyrif', 'kepsek', 'super_admin'],
    defaultAs: 'guru',
  },
  {
    prefix: '/admin',
    allowedRoles: ['super_admin', 'yayasan', 'kepsek', 'humas', 'ppdb', 'keuangan'],
    defaultAs: 'admin',
  },
];

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey) acc[rawKey] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function normalizeRoleName(raw?: string | null): MiddlewareRole {
  const key = (raw || '').toLowerCase().trim();
  if (key === 'super_admin' || key === 'superadmin' || key === 'admin') return 'super_admin';
  if (key === 'yayasan' || key === 'admin_yayasan') return 'yayasan';
  if (key === 'kepsek' || key === 'kepala_sekolah') return 'kepsek';
  if (key === 'guru' || key === 'guru_akademik' || key === 'ustadz') return 'guru';
  if (key === 'musyrif' || key === 'musyrifah') return 'musyrif';
  if (key === 'santri' || key === 'user' || key === 'student') return 'santri';
  if (key === 'ppdb' || key === 'staff_ppdb') return 'ppdb';
  if (key === 'keuangan') return 'keuangan';
  if (key === 'humas' || key === 'pengurus_konten') return 'humas';
  return 'guest';
}

export async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname, search } = url;

  // Skip static assets and API internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/avatars') ||
    pathname.includes('.')
  ) {
    return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } });
  }

  const incomingCookies = parseCookies(request.headers.get('cookie'));
  const responseHeaders = new Headers({ 'x-middleware-next': '1' });

  const supabaseUrl =
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    'https://gzijnybcmhectajfkdtd.supabase.co';
  const supabaseAnonKey =
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aWpueWJjbWhlY3RhamZrZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MTk5MDQsImV4cCI6MjEwODQ5NTkwNH0.bKAedWftgBt0dFnhUoTOM1dgmdwgeHvI4vc4AhsuMtY';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(incomingCookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          responseHeaders.append(
            'Set-Cookie',
            `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=2592000`,
          );
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let effectiveRole: MiddlewareRole = 'guest';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status_aktif')
      .eq('id', user.id)
      .maybeSingle();

    if (profile && profile.status_aktif !== false) {
      effectiveRole = normalizeRoleName(profile.role);
    } else {
      effectiveRole = normalizeRoleName(incomingCookies.role);
      if (effectiveRole === 'guest') effectiveRole = 'santri';
    }
  }

  // Always keep the `role` cookie synchronized (`role=guest` when unauthenticated)
  responseHeaders.append(
    'Set-Cookie',
    `role=${effectiveRole}; Path=/; SameSite=Lax; Max-Age=2592000`,
  );

  // Check if the requested route is a protected route
  const matchedProtected = PROTECTED_ROUTE_RULES.find(
    (rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`),
  );

  if (matchedProtected) {
    // 1. Guest attempting to open a protected route -> redirect to /login?redirect=<path>#login-section
    if (!user || effectiveRole === 'guest') {
      const loginUrl = new URL('/login', url.origin);
      loginUrl.searchParams.set('as', matchedProtected.defaultAs);
      loginUrl.searchParams.set('from', 'guard');
      loginUrl.searchParams.set('redirect', `${pathname}${search}`);
      loginUrl.hash = 'login-section';
      return Response.redirect(loginUrl.toString(), 307);
    }

    // 2. Authenticated user whose role is not permitted for this section -> redirect to their dashboard
    if (!matchedProtected.allowedRoles.includes(effectiveRole)) {
      const fallbackPath =
        effectiveRole === 'santri'
          ? '/santri'
          : effectiveRole === 'guru' || effectiveRole === 'musyrif'
            ? '/guru'
            : '/admin';
      return Response.redirect(new URL(fallbackPath, url.origin).toString(), 307);
    }
  }

  return new Response(null, { status: 200, headers: responseHeaders });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|avatars/).*)'],
};

