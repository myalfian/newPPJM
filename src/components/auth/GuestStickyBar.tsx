import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, User, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { buildLoginUrl } from '../../lib/roles';

const DISMISS_KEY = 'jm_guest_bar_dismissed';

/** Mobile-only sticky strip: "Anda sebagai Guest - Login". Sits above the bottom nav. */
export const GuestStickyBar: React.FC = () => {
  const { isGuest, loading } = useAuth();
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!isGuest) setDismissed(false);
  }, [isGuest]);

  if (loading || !isGuest || dismissed || pathname.startsWith('/login')) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] z-30 px-3 md:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white/95 py-1.5 pl-3 pr-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.18)] backdrop-blur">
        <span className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
          <User className="h-3.5 w-3.5" aria-hidden />
          <span className="absolute -bottom-px -right-px h-2 w-2 rounded-full border border-white bg-emerald-500" aria-hidden />
        </span>
        <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-700">Anda sebagai Guest</p>
        <Link
          to={buildLoginUrl({ from: 'guest' })}
          className="flex shrink-0 items-center gap-1 rounded-full bg-[#0d4a28] px-3 py-1.5 text-[12px] font-bold text-white active:scale-95"
        >
          <LogIn className="h-3.5 w-3.5" aria-hidden /> Login
        </Link>
        <button
          type="button"
          aria-label="Sembunyikan"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, '1');
            } catch {
              /* ignore */
            }
          }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

