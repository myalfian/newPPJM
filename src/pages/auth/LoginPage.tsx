import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { openAuthModal, type AuthModalTab, type AuthModalView } from '../../lib/authModal';
import { safeRedirectPath } from '../../lib/roles';

/**
 * LoginPage is now a thin redirect wrapper.
 * When /login is visited (from a bookmark, RouteGuard redirect, or deep link),
 * it opens the AuthModal on top of the home page instead of rendering a full page.
 */
export const LoginPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const asParam = params.get('as') as AuthModalTab | null;
    const from = params.get('from');
    const redirect = safeRedirectPath(params.get('redirect'));
    const viewParam = params.get('view') as AuthModalView | null;

    // Navigate to root so the modal sits on top of the public site
    navigate('/', { replace: true });

    // Open the modal after navigation settles
    const t = window.setTimeout(() => {
      openAuthModal({
        view: viewParam === 'register' ? 'register' : 'login',
        tab: asParam === 'santri' || asParam === 'guru' || asParam === 'admin' ? asParam : 'guest',
        redirect: redirect ?? undefined,
        from: from ?? undefined,
      });
    }, 80);

    return () => window.clearTimeout(t);
  }, [params, navigate]);

  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        Memuat halaman login…
      </div>
    </div>
  );
};
