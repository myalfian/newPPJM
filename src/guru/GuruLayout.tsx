import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BookOpen,
  CheckSquare,
  Users,
  BarChart3,
  BookOpenCheck,
  Newspaper,
  UserCircle2,
  Bell,
  Sparkles,
  Home,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Lock,
  GraduationCap,
} from 'lucide-react';
import { GuruProvider, useGuru } from './GuruContext';

const GuruShell: React.FC = () => {
  const {
    guruProfile,
    tugasList,
    submissionsList,
    notifications,
    toasts,
    dismissToast,
    markAllNotificationsRead,
    isAuthenticatedGuru,
    loading,
    loginAsGuru,
    logoutGuru,
  } = useGuru();

  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Count submissions that need grading (status === 'dikumpulkan')
  const needGradingCount = useMemo(() => {
    return submissionsList.filter((s) => s.status === 'dikumpulkan').length;
  }, [submissionsList]);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const firstTugasId = tugasList[0]?.id || 'a1111111-1111-4111-8111-111111111101';

  const currentBreadcrumb = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/guru/profile')) return 'Profil & Jadwal Mengajar Guru';
    if (p.startsWith('/guru/tugas/create')) return 'Posting Tugas Baru';
    if (p.includes('/submissions')) return 'Penilaian Submissions & Update Tugas';
    if (p.startsWith('/guru/tugas')) return 'Daftar Tugas Saya & Bank Soal';
    if (p.startsWith('/guru/performance')) return 'Performance Kelas & Hafalan Santri';
    if (p.startsWith('/guru/content')) return 'Buat Berita & Materi Pembelajaran';
    return 'Dashboard Guru & Musyrif';
  }, [location.pathname]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    const res = await loginAsGuru(loginEmail, loginPassword);
    setLoggingIn(false);
    if (!res.ok && res.error) setLoginError(res.error);
  };

  const sidebarGroups = [
    {
      title: 'MENGAJAR',
      items: [
        {
          to: '/guru',
          end: true,
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          to: '/guru/tugas',
          end: true,
          label: 'Tugas Saya',
          icon: ClipboardList,
        },
        {
          to: '/guru/tugas/create',
          end: true,
          label: 'Posting Tugas Baru',
          icon: PlusCircle,
        },
        {
          to: '/guru/tugas?mode=bank',
          end: false,
          label: 'Bank Soal & Modul',
          icon: BookOpen,
          isBankSoal: true,
        },
        {
          to: `/guru/tugas/${firstTugasId}/submissions`,
          end: false,
          label: 'Submissions',
          icon: CheckSquare,
          redBadge: needGradingCount > 0 ? needGradingCount : undefined,
          matchSubmissions: true,
        },
      ],
    },
    {
      title: 'SANTRI',
      items: [
        {
          to: '/guru/performance/Semua?view=santri',
          end: false,
          label: 'Daftar Santri',
          icon: Users,
          matchView: 'santri',
        },
        {
          to: '/guru/performance/VIII-A%20Tahfidz',
          end: false,
          label: 'Performance Kelas',
          icon: BarChart3,
          matchPerfDefault: true,
        },
        {
          to: '/guru/performance/Semua?view=hafalan',
          end: false,
          label: 'Setoran Hafalan',
          icon: BookOpenCheck,
          matchView: 'hafalan',
        },
      ],
    },
    {
      title: 'KONTEN & PROFIL',
      items: [
        {
          to: '/guru/content',
          end: false,
          label: 'Buat Berita & Materi',
          icon: Newspaper,
        },
        {
          to: '/guru/profile',
          end: false,
          label: 'Profil Guru',
          icon: UserCircle2,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* ─── SIDEBAR GURU (Schudio Grouped 280px) ─── */}
      <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/80 z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/guru" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#115E59] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                SMP Plus JM
              </div>
              <div className="text-sm font-black text-slate-900 tracking-tight">
                Portal Guru &amp; Musyrif
              </div>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#115E59] border border-emerald-200">
            Asatidz
          </span>
        </div>

        {/* Grouped Menu Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {sidebarGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <nav className="space-y-1">
                {group.items.map((item: any) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => {
                        let active = isActive;
                        if (item.isBankSoal) {
                          active =
                            location.pathname === '/guru/tugas' &&
                            location.search.includes('mode=bank');
                        } else if (item.to === '/guru/tugas') {
                          active =
                            location.pathname === '/guru/tugas' &&
                            !location.search.includes('mode=bank');
                        } else if (item.matchSubmissions) {
                          active = location.pathname.includes('/submissions');
                        } else if (item.matchView) {
                          active =
                            location.pathname.startsWith('/guru/performance') &&
                            location.search.includes(`view=${item.matchView}`);
                        } else if (item.matchPerfDefault) {
                          active =
                            location.pathname.startsWith('/guru/performance') &&
                            !location.search.includes('view=');
                        }

                        return `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                          active
                            ? 'bg-[#115E59] text-white shadow-sm'
                            : 'text-slate-600 hover:bg-emerald-50/70 hover:text-[#115E59]'
                        }`;
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </span>
                      {item.redBadge !== undefined && (
                        <span className="px-2 py-0.5 text-[11px] font-black rounded-full bg-rose-600 text-white shadow-2xs">
                          {item.redBadge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Guru Profile Card */}
        <div className="p-3.5 border-t border-slate-100 bg-[#FAF8F5]/60 space-y-2">
          <div
            onClick={() => navigate('/guru/profile')}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white transition-colors cursor-pointer"
          >
            <img
              src={
                guruProfile.foto_url ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
              }
              alt={guruProfile.full_name}
              className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold text-slate-900 truncate">
                {guruProfile.full_name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                NIP: {guruProfile.nip || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#115E59]" />
              <span>Web Publik</span>
            </Link>
            <button
              type="button"
              onClick={logoutGuru}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-rose-200/70 bg-rose-50/60 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 lg:pl-[280px] flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="lg:hidden w-9 h-9 rounded-xl bg-[#115E59] text-white flex items-center justify-center shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <span>Portal Guru &amp; Musyrif</span>
                  <span>/</span>
                  <span className="text-[#115E59] font-bold truncate">{currentBreadcrumb}</span>
                </div>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {guruProfile.full_name}
                </h1>
              </div>
            </div>

            {/* Right: Red Badge Perlu Dinilai, Realtime Bell & Quick Posting */}
            <div className="flex items-center gap-2.5">
              {/* Red Badge Perlu Dinilai */}
              <Link
                to={`/guru/tugas/${firstTugasId}/submissions`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span>Perlu Dinilai:</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[11px] font-black">
                  {needGradingCount}
                </span>
              </Link>

              {/* Realtime Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifDropdown((v) => !v);
                    if (!showNotifDropdown) markAllNotificationsRead();
                  }}
                  aria-label="Notifikasi Realtime Submission"
                  className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-[#115E59]" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3.5 z-50 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        Notifikasi Realtime ({notifications.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setShowNotifDropdown(false);
                            if (n.link) navigate(n.link);
                          }}
                          className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-emerald-50/70 border border-slate-200/70 cursor-pointer transition-colors"
                        >
                          <div className="text-xs font-extrabold text-[#115E59]">{n.title}</div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{n.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/guru/tugas/create"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Posting Tugas</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Login Card when Explicitly Logged Out */}
        {!loading && !isAuthenticatedGuru && (
          <div className="max-w-xl mx-auto w-full px-4 pt-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#115E59] text-white flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Masuk ke Portal Guru &amp; Musyrif SMP Plus JM
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gunakan akun Ustadz/Ustadzah untuk mengelola tugas, nilai santri, dan konten website.
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Guru / Musyrif
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loggingIn ? 'Memverifikasi Sesi Guru…' : 'Masuk Portal Guru'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Outlet */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ─── MOBILE BOTTOM NAVIGATION BAR ─── */}
      <nav
        aria-label="Navigasi Mobile Guru"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around"
      >
        {[
          { to: '/guru', end: true, label: 'Dashboard', icon: LayoutDashboard },
          { to: '/guru/tugas', end: false, label: 'Tugas', icon: ClipboardList },
          {
            to: `/guru/tugas/${firstTugasId}/submissions`,
            end: false,
            label: 'Nilai',
            icon: CheckSquare,
            badge: needGradingCount > 0 ? needGradingCount : undefined,
          },
          { to: '/guru/performance/VIII-A%20Tahfidz', end: false, label: 'Santri', icon: BarChart3 },
          { to: '/guru/content', end: false, label: 'Konten', icon: Newspaper },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <NavLink
              key={m.label}
              to={m.to}
              end={m.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-bold ${
                  isActive ? 'text-[#115E59]' : 'text-slate-400'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{m.label}</span>
              {m.badge !== undefined && (
                <span className="absolute top-0.5 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9.5px] font-black flex items-center justify-center">
                  {m.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ─── TOAST NOTIFICATIONS ─── */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg backdrop-blur-md ${
              t.type === 'error'
                ? 'bg-rose-950/95 border-rose-700 text-white'
                : t.type === 'info'
                ? 'bg-slate-900/95 border-slate-700 text-white'
                : 'bg-[#115E59]/95 border-emerald-600 text-white'
            }`}
          >
            {t.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            ) : t.type === 'info' ? (
              <Info className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold">{t.title}</div>
              {t.message && <div className="text-[11px] text-white/85 mt-0.5">{t.message}</div>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GuruLayout: React.FC = () => (
  <GuruProvider>
    <GuruShell />
  </GuruProvider>
);
export default GuruLayout;

