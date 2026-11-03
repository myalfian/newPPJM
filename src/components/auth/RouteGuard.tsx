import React from 'react';
import { Navigate, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABEL, buildLoginUrl, canAccessPath, matchProtectedArea } from '../../lib/roles';

/**
 * Route-level access control (SPA equivalent of Next.js middleware):
 *   - no session            -> /login?redirect=<path>#login-section   (guest never sees a blank page)
 *   - session, wrong role   -> "Akses ditolak" panel with a way back
 * Real data protection is still enforced by Supabase RLS; this is the UX layer.
 */
export const RouteGuard: React.FC = () => {
  const { isGuest, role, loading, roleLoading, homePath, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading || roleLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          Memeriksa akses…
        </div>
      </div>
    );
  }

  const area = matchProtectedArea(location.pathname);

  if (isGuest) {
    const as = area?.prefix === '/santri' ? 'santri' : area?.prefix === '/guru' ? 'guru' : area?.prefix === '/admin' ? 'admin' : undefined;
    return <Navigate to={buildLoginUrl({ as, from: 'guard', redirect: location.pathname + location.search })} replace />;
  }

  if (!canAccessPath(role, location.pathname)) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-4">
        <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <Lock className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="text-base font-extrabold text-slate-900">Akses ditolak</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Akun Anda ({ROLE_LABEL[role]}) tidak memiliki izin untuk membuka {area?.label ?? 'halaman ini'}.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link to={homePath} className="rounded-xl bg-[#0d4a28] px-4 py-2.5 text-sm font-bold text-white">
              Ke dashboard saya
            </Link>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate(buildLoginUrl({ redirect: location.pathname }), { replace: true });
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Ganti akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

