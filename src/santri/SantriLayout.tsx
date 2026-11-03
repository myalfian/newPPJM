import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpenCheck,
  BarChart3,
  UserCircle2,
  Sparkles,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  PlusCircle,
  ShieldCheck,
  Award,
  Home,
  Lock,
} from 'lucide-react';
import { SantriProvider, useSantri } from './SantriContext';

const SantriShell: React.FC = () => {
  const {
    profile,
    tugasList,
    submissionsMap,
    toasts,
    dismissToast,
    isAuthenticatedSantri,
    loading,
    loginAsSantri,
    logoutSantri,
    addHafalanSetoran,
  } = useSantri();

  const location = useLocation();
  const navigate = useNavigate();

  // Quick Setoran Hafalan Modal state
  const [showSetoranModal, setShowSetoranModal] = useState(false);
  const [surah, setSurah] = useState('Al-Mulk');
  const [ayatDari, setAyatDari] = useState(1);
  const [ayatSampai, setAyatSampai] = useState(15);
  const [juz, setJuz] = useState(29);
  const [statusSetoran, setStatusSetoran] = useState<'lancar' | 'kurang' | 'ulang'>('lancar');
  const [penyimakNama, setPenyimakNama] = useState('Ustadz Fadly, S.Pd.');
  const [catatanSetoran, setCatatanSetoran] = useState('');
  const [savingSetoran, setSavingSetoran] = useState(false);

  // Login form state (when logged out)
  const [loginEmail, setLoginEmail] = useState('santri@ppjauharulmaknuun.sch.id');
  const [loginPassword, setLoginPassword] = useState('PPJM_SantriMaju2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Count pending/unsubmitted tasks
  const pendingTugasCount = useMemo(() => {
    return tugasList.filter((t) => {
      const sub = submissionsMap[t.id];
      return !sub || sub.status === 'draft' || sub.status === 'revisi';
    }).length;
  }, [tugasList, submissionsMap]);

  const currentBreadcrumb = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/santri/profile')) return 'Profil & Biodata Santri';
    if (p.startsWith('/santri/tugas/')) return 'Detail & Pengumpulan Tugas';
    if (p.startsWith('/santri/tugas')) return 'Daftar Tugas Saya';
    if (p.startsWith('/santri/performance')) return 'Performance & Capaian Belajar';
    return 'Dashboard Utama Santri';
  }, [location.pathname]);

  const handleQuickSetoranSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSetoran(true);
    const res = await addHafalanSetoran({
      surah,
      ayat_dari: ayatDari,
      ayat_sampai: ayatSampai,
      juz,
      status: statusSetoran,
      penyimak_nama: penyimakNama,
      catatan: catatanSetoran,
    });
    setSavingSetoran(false);
    if (res.ok) {
      setShowSetoranModal(false);
      setCatatanSetoran('');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    const res = await loginAsSantri(loginEmail, loginPassword);
    setLoggingIn(false);
    if (!res.ok && res.error) {
      setLoginError(res.error);
    }
  };

  const navItems = [
    {
      to: '/santri',
      end: true,
      label: 'Dashboard',
      shortLabel: 'Beranda',
      icon: LayoutDashboard,
    },
    {
      to: '/santri/tugas',
      end: false,
      label: 'Tugas Saya',
      shortLabel: 'Tugas',
      icon: ClipboardCheck,
      badge: pendingTugasCount > 0 ? pendingTugasCount : undefined,
    },
    {
      to: '/santri/performance?tab=hafalan',
      end: false,
      label: 'Setoran Hafalan',
      shortLabel: 'Hafalan',
      icon: BookOpenCheck,
      isHafalanLink: true,
    },
    {
      to: '/santri/performance',
      end: true,
      label: 'Performance',
      shortLabel: 'Nilai',
      icon: BarChart3,
    },
    {
      to: '/santri/profile',
      end: false,
      label: 'Profile Santri',
      shortLabel: 'Profil',
      icon: UserCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* ─── SIDEBAR DESKTOP (Schudio Style 272px) ─── */}
      <aside className="hidden lg:flex lg:w-[272px] lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/80 z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/santri" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#115E59] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                SMP Plus JM
              </div>
              <div className="text-sm font-black text-slate-900 tracking-tight">
                Portal Santri
              </div>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#115E59] border border-emerald-200/70">
            Aktif
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Menu Utama Santri
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isHafalanTabActive =
                  item.isHafalanLink &&
                  location.pathname === '/santri/performance' &&
                  location.search.includes('tab=hafalan');
                const isPerfMainActive =
                  !item.isHafalanLink &&
                  item.to === '/santri/performance' &&
                  location.pathname === '/santri/performance' &&
                  !location.search.includes('tab=hafalan');

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => {
                      const active = item.isHafalanLink
                        ? isHafalanTabActive
                        : item.to === '/santri/performance'
                        ? isPerfMainActive
                        : isActive;
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
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-400 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Action Card */}
          <div className="px-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#115E59] to-emerald-900 text-white shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-200">
                  Target Tahfidz
                </span>
                <Award className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-lg font-black leading-tight">
                {profile.hafalan_juz} / 30 Juz
              </div>
              <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((profile.hafalan_juz / 30) * 100))}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSetoranModal(true)}
                className="w-full mt-1 py-2 px-3 rounded-xl bg-white/95 hover:bg-white text-[#115E59] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Catat Setoran Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Santri Profile Summary */}
        <div className="p-3.5 border-t border-slate-100 bg-[#FAF8F5]/60 space-y-2">
          <div
            onClick={() => navigate('/santri/profile')}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white transition-colors cursor-pointer"
          >
            <img
              src={
                profile.foto_url ||
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
              }
              alt={profile.full_name}
              className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold text-slate-900 truncate">
                {profile.full_name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                NIS: {profile.nis || '-'} • {profile.kamar_asrama || 'Asrama'}
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
              onClick={logoutSantri}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-rose-200/70 bg-rose-50/60 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 lg:pl-[272px] flex flex-col min-w-0">
        {/* TOPBAR (Schudio Clean Header with Kelas & Juz Badges) */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Left: Breadcrumb & Greeting */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="lg:hidden w-9 h-9 rounded-xl bg-[#115E59] text-white flex items-center justify-center shrink-0"
                title="Ke Beranda Web Publik"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <span>Portal Santri</span>
                  <span>/</span>
                  <span className="text-[#115E59] font-bold truncate">{currentBreadcrumb}</span>
                </div>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  Ahlan wa Sahlan, {profile.full_name}
                </h1>
              </div>
            </div>

            {/* Right: Info Kelas, Juz Hafalan, & Quick Setoran */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-[#115E59] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#115E59]" />
                <span>Kelas: {profile.kelas || 'VIII-A Tahfidz'}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Hafalan: {profile.hafalan_juz} Juz</span>
              </div>

              <button
                type="button"
                onClick={() => setShowSetoranModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Setor Hafalan</span>
              </button>
            </div>
          </div>
        </header>

        {/* Optional Login Banner if Explicitly Logged Out */}
        {!loading && !isAuthenticatedSantri && (
          <div className="max-w-xl mx-auto w-full px-4 pt-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#115E59] text-white flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Masuk ke Portal Santri SMP Plus JM
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gunakan akun santri Anda. Seluruh data dilindungi dengan Row-Level Security (`auth.uid() = santri_id`).
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
                    Email Santri
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
                  className="w-full py-2.5 px-4 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loggingIn ? 'Memverifikasi Sesi Santri…' : 'Masuk Portal Santri'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ─── MOBILE BOTTOM NAVIGATION BAR ─── */}
      <nav
        aria-label="Navigasi Bawah Santri"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-bold transition-colors ${
                  isActive ? 'text-[#115E59]' : 'text-slate-400 hover:text-slate-700'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.shortLabel}</span>
              {item.badge !== undefined && (
                <span className="absolute top-0.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9.5px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ─── MODAL CATAT SETORAN HAFALAN CEPAT ─── */}
      {showSetoranModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Buku Mutabaah Digital
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Catat Setoran Hafalan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSetoranModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickSetoranSubmit} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Surah
                  </label>
                  <input
                    type="text"
                    required
                    value={surah}
                    onChange={(e) => setSurah(e.target.value)}
                    placeholder="Contoh: Al-Mulk"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Juz (1–30)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={juz}
                    onChange={(e) => setJuz(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dari Ayat
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={ayatDari}
                    onChange={(e) => setAyatDari(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sampai Ayat
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={ayatSampai}
                    onChange={(e) => setAyatSampai(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Kelancaran Setoran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'lancar', label: 'Lancar (Mutqin)', cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                      { id: 'kurang', label: 'Kurang Lancar', cls: 'border-amber-500 bg-amber-50 text-amber-900' },
                      { id: 'ulang', label: 'Perlu Ulang', cls: 'border-rose-500 bg-rose-50 text-rose-900' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStatusSetoran(opt.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        statusSetoran === opt.id
                          ? opt.cls
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Musyrif / Ustadz Penyimak
                </label>
                <input
                  type="text"
                  value={penyimakNama}
                  onChange={(e) => setPenyimakNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tajwid / Murojaah (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={catatanSetoran}
                  onChange={(e) => setCatatanSetoran(e.target.value)}
                  placeholder="Contoh: Perhatikan mad wajib pada ayat 8..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSetoranModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingSetoran}
                  className="px-4 py-2 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingSetoran ? 'Menyimpan…' : 'Simpan Setoran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATIONS ─── */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
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

export const SantriLayout: React.FC = () => (
  <SantriProvider>
    <SantriShell />
  </SantriProvider>
);
export default SantriLayout;

