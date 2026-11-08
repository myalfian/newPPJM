import React, { useEffect, useRef, useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCircle2,
  ShieldCheck,
  User,
  GraduationCap,
  Presentation,
  UserPlus,
  BookOpenCheck,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { openAuthModal } from '../../lib/authModal';
import { getRoleMeta, normalizeCanonicalRole } from '../../admin/permissions';

export interface UserMenuProps {
  /**
   * 'pill' = kapsul navbar melayang + dropdown panel
   * 'card' = kartu penuh untuk mobile drawer
   * 'compact' = varian ramping untuk header portal admin/guru/santri
   */
  variant?: 'pill' | 'card' | 'compact';
  /** Dipanggil saat navigasi terjadi (misal menutup drawer mobile) */
  onNavigate?: () => void;
  className?: string;
}

const getInitials = (name?: string | null): string => {
  if (!name) return 'JM';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const UserMenu: React.FC<UserMenuProps> = ({
  variant = 'pill',
  onNavigate,
  className = '',
}) => {
  const { isGuest, loading, displayName, fotoUrl, role, roleLabel, homePath, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Reset imgError if fotoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [fotoUrl]);

  // Click outside & Escape key listeners
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
        if (items && items.length > 0) {
          const next = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
          setActiveIndex(next);
          items[next]?.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
        if (items && items.length > 0) {
          const prev = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
          setActiveIndex(prev);
          items[prev]?.focus();
        }
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, activeIndex]);

  const handleClose = () => {
    setOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
    navigate('/', { replace: true });
  };

  const canonicalRole = normalizeCanonicalRole(role);
  const meta = getRoleMeta(canonicalRole);
  const initials = getInitials(displayName);

  // ────────────────────────────────────────────────────────────────
  // VARIAN CARD (Untuk Mobile Drawer)
  // ────────────────────────────────────────────────────────────────
  if (variant === 'card') {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs ${className}`}>
        {isGuest ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                G
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                  Pengunjung (Guest)
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                </p>
                <p className="text-[11.5px] text-slate-500">Jelajahi informasi publik tanpa login</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClose();
                openAuthModal({ view: 'login', from: 'drawer' });
              }}
              className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0d4a28] hover:bg-[#09351d] py-2.5 px-4 text-xs font-bold text-white shadow-xs transition active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" aria-hidden /> Masuk / Login Portal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {fotoUrl && !imgError ? (
                <img
                  src={fotoUrl}
                  alt={displayName || 'Avatar'}
                  onError={() => setImgError(true)}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover border border-slate-200"
                />
              ) : (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0d4a28] text-white font-extrabold text-xs shadow-xs">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">{displayName || 'Akun Saya'}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[10.5px] font-bold ${meta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                  {roleLabel || meta.label}
                </span>
              </div>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2">
              <Link
                to={homePath}
                onClick={handleClose}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                <LayoutDashboard className="h-4 w-4 text-[#115E59]" aria-hidden />
                <span>Dashboard ({meta.shortLabel})</span>
              </Link>
              <Link
                to="/profile"
                onClick={handleClose}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                <UserCircle2 className="h-4 w-4 text-[#115E59]" aria-hidden />
                <span>Profil &amp; Biodata Saya</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50 transition"
              >
                <LogOut className="h-4 w-4 text-rose-600" aria-hidden />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // VARIAN PILL & COMPACT (Navbar & Portal Header)
  // ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={`relative inline-block text-left select-none ${className}`}>
      {isGuest ? (
        <div
          className={`flex items-center rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs transition-all hover:border-slate-300 min-h-[44px] h-[44px] ${
            loading ? 'opacity-70' : ''
          }`}
        >
          <button
            type="button"
            onClick={() => openAuthModal({ view: 'login', from: 'guest' })}
            className="flex h-full items-center gap-2 rounded-l-full pl-3 pr-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Mode Tamu - Masuk ke Portal"
          >
            <span className="relative grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <User className="h-3.5 w-3.5" aria-hidden />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-emerald-500" />
            </span>
            <span className="tracking-wide">Guest</span>
          </button>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label="Pilihan Peran Mode Tamu"
            className="grid h-full w-9 place-items-center rounded-r-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180 text-emerald-800' : ''}`}
              aria-hidden
            />
          </button>
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={`Menu Akun: ${displayName || 'User'} (${roleLabel})`}
          className={`group flex items-center min-h-[44px] h-[44px] rounded-full border border-slate-200/90 bg-white shadow-2xs transition-all hover:bg-slate-50/90 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 pl-1 pr-3 sm:pr-3.5 gap-2 shrink-0 ${
            open ? 'ring-2 ring-emerald-500/20 border-emerald-600' : ''
          }`}
        >
          {/* Avatar bulat dengan initial fallback */}
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
            {fotoUrl && !imgError ? (
              <img
                src={fotoUrl}
                alt=""
                onError={() => setImgError(true)}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="h-full w-full bg-[#0d4a28] text-white font-extrabold text-[11px] grid place-items-center">
                {initials}
              </span>
            )}
          </span>

          {/* Teks Nama & Badge Role (Full di Desktop tanpa terpotong) */}
          <span className="flex flex-col text-left leading-tight min-w-0">
            <span
              title={displayName || 'Pengguna'}
              className="max-w-[80px] xs:max-w-[110px] sm:max-w-[140px] md:max-w-[190px] lg:max-w-[260px] xl:max-w-none text-xs font-bold text-slate-800 tracking-tight whitespace-nowrap truncate xl:overflow-visible"
            >
              {displayName || 'Pengguna'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 tracking-wide whitespace-nowrap">
              {meta.shortLabel}
            </span>
          </span>

          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
              open ? 'rotate-180 text-emerald-800' : ''
            }`}
            aria-hidden
          />
        </button>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DROPDOWN MENU PANEL (Floating & Cerdas terhadap Viewport) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {open && (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={triggerRef.current?.id}
          className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-[290px] sm:max-w-[310px] rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.14),0_1px_3px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-none"
        >
          {isGuest ? (
            /* Menu Khusus Pengunjung (Guest) */
            <div className="space-y-1">
              <div className="mb-2 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/80 p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-xs font-extrabold text-emerald-950">Mode Penjelajah Publik</p>
                  <p className="text-[11px] leading-snug text-emerald-800/90 mt-0.5">
                    Anda sedang mengakses sebagai Tamu. Masuk ke akun Anda untuk fitur lengkap.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  handleClose();
                  openAuthModal({ view: 'login', tab: 'santri', from: 'guest-menu' });
                }}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition focus:outline-none focus:bg-emerald-50"
              >
                <GraduationCap className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden />
                <span>Masuk sebagai Santri</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  handleClose();
                  openAuthModal({ view: 'login', tab: 'guru', from: 'guest-menu' });
                }}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition focus:outline-none focus:bg-emerald-50"
              >
                <Presentation className="h-4 w-4 text-sky-700 shrink-0" aria-hidden />
                <span>Masuk sebagai Guru &amp; Musyrif</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  handleClose();
                  openAuthModal({ view: 'login', tab: 'admin', from: 'guest-menu' });
                }}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition focus:outline-none focus:bg-emerald-50"
              >
                <ShieldCheck className="h-4 w-4 text-slate-800 shrink-0" aria-hidden />
                <span>Masuk sebagai Pengelola / Admin</span>
              </button>

              <div className="my-1.5 h-px bg-slate-100" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  handleClose();
                  openAuthModal({ view: 'register', from: 'guest-menu' });
                }}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition focus:outline-none focus:bg-emerald-50"
              >
                <UserPlus className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden />
                <span>Daftar Akun Baru (Permohonan)</span>
              </button>
            </div>
          ) : (
            /* Menu Pengguna Terotentikasi */
            <div className="space-y-1">
              {/* Header Kartu Profil di Dalam Panel (Menampilkan Nama Lengkap Penuh) */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-50/90 border border-slate-100 p-3 mb-1.5">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {fotoUrl && !imgError ? (
                    <img
                      src={fotoUrl}
                      alt=""
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="h-full w-full bg-[#0d4a28] text-white font-extrabold text-xs grid place-items-center">
                      {initials}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-900 leading-snug break-words">
                    {displayName || 'Pengguna'}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 mt-0.5 text-[10px] font-bold ${meta.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                    {roleLabel || meta.label}
                  </span>
                </div>
              </div>

              {/* Tautan Menu Terstruktur */}
              <Link
                to={homePath}
                role="menuitem"
                onClick={handleClose}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition focus:outline-none focus:bg-emerald-50"
              >
                <LayoutDashboard className="h-4 w-4 text-[#115E59] shrink-0" aria-hidden />
                <span>Dashboard ({meta.shortLabel})</span>
              </Link>

              <Link
                to="/profile"
                role="menuitem"
                onClick={handleClose}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition focus:outline-none focus:bg-emerald-50"
              >
                <UserCircle2 className="h-4 w-4 text-[#115E59] shrink-0" aria-hidden />
                <span>Profil &amp; Biodata Saya</span>
              </Link>

              <div className="my-1.5 h-px bg-slate-100" />

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50 transition focus:outline-none focus:bg-rose-50"
              >
                <LogOut className="h-4 w-4 text-rose-600 shrink-0" aria-hidden />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

