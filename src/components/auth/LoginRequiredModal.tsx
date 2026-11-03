import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import { LOGIN_REQUIRED_EVENT, LoginRequiredDetail } from '../../lib/loginPrompt';
import { buildLoginUrl } from '../../lib/roles';

/**
 * Global dialog shown when a guest clicks a feature that needs an account
 * (see `promptLogin()` in lib/loginPrompt). Mount once, inside the Router.
 */
export const LoginRequiredModal: React.FC = () => {
  const [detail, setDetail] = useState<LoginRequiredDetail | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setDetail((e as CustomEvent<LoginRequiredDetail>).detail ?? {});
    window.addEventListener(LOGIN_REQUIRED_EVENT, onOpen);
    return () => window.removeEventListener(LOGIN_REQUIRED_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!detail) return;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDetail(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [detail]);

  if (!detail) return null;

  const audience = detail.audience ?? 'Santri';
  const goLogin = () => {
    const target = buildLoginUrl({ as: detail.as ?? 'santri', redirect: location.pathname + location.search, from: 'guest' });
    setDetail(null);
    navigate(target);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="presentation">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setDetail(null)}
          aria-label="Tutup"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Lock className="h-6 w-6" aria-hidden />
        </div>
        <h2 id="login-required-title" className="text-base font-extrabold text-slate-900">
          {detail.feature ? `${detail.feature}` : 'Fitur Khusus Akun Terdaftar'}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          Fitur ini hanya untuk {audience}. Login sebagai Guest?
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            ref={primaryRef}
            type="button"
            onClick={goLogin}
            className="flex-1 rounded-xl bg-[#0d4a28] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0a3a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Login Sekarang
          </button>
          <button
            type="button"
            onClick={() => setDetail(null)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
};

