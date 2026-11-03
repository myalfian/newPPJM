import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, GraduationCap, LayoutDashboard, LogIn, LogOut, ShieldCheck, User, UserCircle2, BookOpenCheck, Presentation } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { buildLoginUrl } from '../../lib/roles';

const DEFAULT_AVATAR = '/avatars/guest-avatar.svg';

interface GuestButtonProps {
  /** `pill` = navbar capsule + dropdown, `card` = full-width card (mobile drawer). */
  variant?: 'pill' | 'card';
  /** Called after any navigation (used to close the mobile drawer). */
  onNavigate?: () => void;
}

const shortName = (name?: string | null): string => {
  if (!name) return 'Akun';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).join(' ');
};

const itemCls =
  'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

const GuestMenu: React.FC<{ onPick: () => void }> = ({ onPick }) => (
  <div className="space-y-1">
    <div className="mb-1 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
      <div>
        <p className="text-[12px] font-extrabold text-emerald-900">Status: Guest</p>
        <p className="text-[11.5px] leading-snug text-emerald-800/80">Anda menjelajah sebagai Guest. Konten publik terbuka tanpa login.</p>
      </div>
    </div>
    <Link to={buildLoginUrl({ as: 'santri', from: 'guest' })} onClick={onPick} className={itemCls}>
      <GraduationCap className="h-4 w-4 text-emerald-700" aria-hidden /> Login sebagai Santri
    </Link>
    <Link to={buildLoginUrl({ as: 'guru', from: 'guest' })} onClick={onPick} className={itemCls}>
      <Presentation className="h-4 w-4 text-sky-700" aria-hidden /> Login sebagai Guru
    </Link>
    <Link to={buildLoginUrl({ as: 'admin', from: 'guest' })} onClick={onPick} className={itemCls}>
      <ShieldCheck className="h-4 w-4 text-slate-800" aria-hidden /> Login sebagai Admin
    </Link>
    <div className="my-1 h-px bg-slate-100" />
    <Link to="/ppdb" onClick={onPick} className={itemCls}>
      <BookOpenCheck className="h-4 w-4 text-amber-600" aria-hidden /> Cara Daftar PPDB
    </Link>
  </div>
);

export const GuestButton: React.FC<GuestButtonProps> = ({ variant = 'pill', onNavigate }) => {
  const { isGuest, loading, displayName, fotoUrl, roleLabel, homePath, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const done = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleLogout = async () => {
    done();
    await signOut();
    navigate('/', { replace: true });
  };

  // ---------------------------------------------------------------- card (drawer)
  if (variant === 'card') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" data-testid="guest-card">
        {isGuest ? (
          <>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500">
                <User className="h-5 w-5" aria-hidden />
              </span>
              <div className="leading-tight">
                <p className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                  Guest <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                </p>
                <p className="text-[11.5px] text-slate-500">Anda menjelajah sebagai Guest</p>
              </div>
            </div>
            <Link
              to={buildLoginUrl({ from: 'guest' })}
              onClick={done}
              className="mb-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4a28] py-2.5 text-[13px] font-bold text-white active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" aria-hidden /> Login
            </Link>
            <GuestMenu onPick={done} />
          </>
        ) : (
          <>
            <div className="mb-2 flex items-center gap-2.5">
              <img src={fotoUrl || DEFAULT_AVATAR} alt="" className="h-10 w-10 rounded-full border border-slate-200 object-cover" onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_AVATAR)} />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-extrabold text-slate-900">{displayName || 'Akun Saya'}</p>
                <p className="text-[11.5px] font-semibold text-emerald-700">{roleLabel}</p>
              </div>
            </div>
            <Link to={homePath} onClick={done} className={itemCls}><LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard</Link>
            <Link to="/profile" onClick={done} className={itemCls}><UserCircle2 className="h-4 w-4" aria-hidden /> Profil Saya</Link>
            <button type="button" onClick={handleLogout} className={`${itemCls} text-rose-700 hover:bg-rose-50 hover:text-rose-800`}><LogOut className="h-4 w-4" aria-hidden /> Keluar</button>
          </>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------- pill (navbar)
  const pillBase =
    'flex items-center rounded-full border border-slate-200/90 bg-white shadow-2xs h-8 xs:h-9 lg:h-10 select-none shrink-0';

  return (
    <div ref={rootRef} className="relative shrink-0">
      {isGuest ? (
        <div className={`${pillBase} ${loading ? 'opacity-70' : ''}`}>
          <Link
            to={buildLoginUrl({ from: 'guest' })}
            className="flex h-full items-center gap-1.5 rounded-l-full pl-2 pr-1 text-[12px] font-bold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:text-[13px]"
            aria-label="Guest - klik untuk login"
            title="Anda menjelajah sebagai Guest - klik untuk login"
          >
            <span className="relative grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-slate-600 lg:h-6 lg:w-6">
              <User className="h-3 w-3 lg:h-3.5 lg:w-3.5" aria-hidden />
              <span className="absolute -bottom-px -right-px h-2 w-2 rounded-full border border-white bg-emerald-500" aria-hidden />
            </span>
            Guest
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Menu Guest"
            className="grid h-full w-7 place-items-center rounded-r-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:w-8"
          >
            <ChevronDown className={`h-3 w-3 transition-transform lg:h-3.5 lg:w-3.5 ${open ? 'rotate-180' : ''}`} aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`${pillBase} gap-1.5 pl-0.5 pr-2 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:pr-3`}
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 lg:h-8 lg:w-8">
            <img src={fotoUrl || DEFAULT_AVATAR} alt="" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_AVATAR)} />
          </span>
          <span className="flex flex-col text-left leading-tight">
            <span className="max-w-[64px] truncate text-[11px] font-bold text-slate-800 xs:max-w-[84px] sm:max-w-[110px] lg:max-w-[130px] lg:text-[13px]">{shortName(displayName)}</span>
            <span className="text-[9px] font-semibold text-emerald-700 lg:text-[10px]">{roleLabel}</span>
          </span>
          <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      )}

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
        >
          {isGuest ? (
            <GuestMenu onPick={done} />
          ) : (
            <div className="space-y-1">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="truncate text-[13px] font-extrabold text-slate-900">{displayName || 'Akun Saya'}</p>
                <p className="text-[11.5px] font-semibold text-emerald-700">{roleLabel}</p>
              </div>
              <Link to={homePath} onClick={done} className={itemCls}><LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard</Link>
              <Link to="/profile" onClick={done} className={itemCls}><UserCircle2 className="h-4 w-4" aria-hidden /> Profil Saya</Link>
              <button type="button" onClick={handleLogout} className={`${itemCls} text-rose-700 hover:bg-rose-50 hover:text-rose-800`}><LogOut className="h-4 w-4" aria-hidden /> Keluar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

