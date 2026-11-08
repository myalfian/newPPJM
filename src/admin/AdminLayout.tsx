import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Layout, Landmark, History, Building2, ShieldCheck, Users, UserCircle2, ChevronsLeft, ChevronsRight,
  ExternalLink, LogOut, Menu, X, ChevronRight, ChevronDown, Layers, SlidersHorizontal, BookOpen, MoreHorizontal, Sparkles,
} from 'lucide-react';
import { useAdminSession, type AdminSession } from './useAdminSession';
import { STAFF_ROLES } from './permissions';
import { CRUD_SECTIONS, type NavGroupKey } from './sections';
import { UserMenu } from '../components/common/UserMenu';

type NavItem = { to: string; label: string; icon: React.ElementType; section?: string };
type NavGroup = { title: string; items: NavItem[] };

const sectionItem = (key: string): NavItem => {
  const s = CRUD_SECTIONS.find((sec) => sec.key === key);
  if (!s) return { to: `/admin/s/${key}`, label: key, icon: Layers, section: key };
  return { to: `/admin/s/${s.key}`, label: s.label, icon: s.icon, section: s.key };
};

const GROUPS: NavGroup[] = [
  {
    title: 'Pusat Kendali & Beranda',
    items: [
      { to: '/admin', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
      { to: '/admin/bulk', label: 'Bulk Upload & Konten', icon: Layers, section: 'galeri_foto' },
      { to: '/admin/readme', label: 'Panduan & Read Me', icon: BookOpen },
      sectionItem('sliders'),
      sectionItem('quick_menus'),
      sectionItem('kontak_medsos'),
      sectionItem('sambutan_persons'),
      { to: '/admin/profile', label: 'Profil Saya', icon: UserCircle2 },
    ],
  },
  {
    title: 'Profil & Kelembagaan',
    items: [
      sectionItem('institutions'),
      { to: '/admin/visi-misi', label: 'Visi, Misi & Tujuan', icon: Landmark, section: 'visi_misi' },
      { to: '/admin/sejarah', label: 'Sejarah & Biografi', icon: History, section: 'sejarah' },
      sectionItem('sub_items'),
      { to: '/admin/fasilitas', label: 'Sarana & Fasilitas', icon: Building2, section: 'fasilitas' },
    ],
  },
  {
    title: 'Akademik, Diniyah & STEM',
    items: [
      sectionItem('programs_pondok'),
      sectionItem('programs_sekolah'),
      sectionItem('program_photos'),
      sectionItem('madin_flyers'),
      sectionItem('ekskul'),
      sectionItem('mandarin_lessons'),
      sectionItem('mandarin_vocabularies'),
      sectionItem('mandarin_quizzes'),
      sectionItem('stem_worksheets'),
      sectionItem('stem_projects'),
    ],
  },
  {
    title: 'Kesiswaan, Prestasi & OSIS',
    items: [
      sectionItem('prestasi'),
      sectionItem('osis_events'),
      sectionItem('osis_programs'),
      sectionItem('osis_structure'),
      sectionItem('osis_foto'),
      sectionItem('osis_video'),
      sectionItem('osis_dokumen'),
      sectionItem('osis_naskah'),
    ],
  },
  {
    title: 'Publikasi & Media Santri',
    items: [
      sectionItem('berita'),
      sectionItem('info_terkini'),
      sectionItem('agendas'),
      sectionItem('karya_siswa'),
      sectionItem('galeri_foto'),
      sectionItem('galeri_videos'),
    ],
  },
  {
    title: 'Pengaturan & Hak Akses',
    items: [
      { to: '/admin/slider-settings', label: 'Pengaturan Slider & Info Terkini', icon: SlidersHorizontal, section: 'slider_settings' },
      sectionItem('user_approvals'),
      sectionItem('password_requests'),
      sectionItem('spmb_info'),
      sectionItem('master_data'),
      sectionItem('master_jabatan'),
      sectionItem('master_mapel'),
      sectionItem('master_kategori'),
      sectionItem('master_sasaran'),
      sectionItem('master_lokasi'),
      { to: '/admin/users', label: 'Kelola Pengguna', icon: Users, section: 'users' },
      { to: '/admin/roles', label: 'Matriks Hak Akses', icon: ShieldCheck, section: 'roles' },
    ],
  },
];

const CRUMBS: Record<string, string> = {
  '/admin': 'Pusat Kendali / Ringkasan Dashboard',
  '/admin/bulk': 'Pusat Kendali / Bulk Upload & Konten',
  '/admin/readme': 'Pusat Kendali / Panduan & Read Me',
  '/admin/visi-misi': 'Profil & Kelembagaan / Visi, Misi & Tujuan',
  '/admin/sejarah': 'Profil & Kelembagaan / Sejarah & Biografi',
  '/admin/fasilitas': 'Profil & Kelembagaan / Sarana & Fasilitas',
  '/admin/users': 'Pengaturan & Hak Akses / Kelola Pengguna',
  '/admin/roles': 'Pengaturan & Hak Akses / Matriks Hak Akses',
  '/admin/slider-settings': 'Pengaturan & Hak Akses / Pengaturan Slider & Info Terkini',
  '/admin/ticker-settings': 'Pengaturan & Hak Akses / Pengaturan Slider & Info Terkini',
  '/admin/profile': 'Pusat Kendali / Profil Saya',
  ...Object.fromEntries(CRUD_SECTIONS.map((s) => [`/admin/s/${s.key}`, `${s.group} / ${s.label}`])),
};

export type AdminOutletContext = AdminSession;

export const AdminLayout: React.FC = () => {
  const admin = useAdminSession();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  if (admin.loading) {
    return <div className="min-h-screen grid place-items-center bg-[#FAF7F0] text-sm text-teal-900">Memuat…</div>;
  }
  if (!admin.session) return <Navigate to="/login?as=admin&from=guard&redirect=%2Fadmin#login-section" replace />;
  if (!admin.isStaff) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FAF7F0] p-6">
        <div className="max-w-sm rounded-2xl border border-teal-900/10 bg-white p-6 text-center shadow-sm space-y-3">
          <h1 className="text-lg font-bold text-teal-900">Akses ditolak</h1>
          <p className="text-sm text-zinc-600">Akun ini tidak terdaftar sebagai pengelola website.</p>
          <button onClick={admin.signOut} className="rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white">
            Keluar
          </button>
        </div>
      </div>
    );
  }

  const roleLabel = STAFF_ROLES.find((r) => r.value === admin.profile?.role)?.label ?? admin.profile?.role;
  const visible = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.section || admin.can(i.section, 'view')),
  })).filter((g) => g.items.length > 0);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const Nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
      {visible.map((g) => {
        const isGroupCollapsed = collapsedGroups[g.title] === true;
        return (
          <div key={g.title} className="space-y-1">
            {!collapsed && (
              <button
                type="button"
                onClick={() => toggleGroup(g.title)}
                className="w-full flex items-center justify-between px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-teal-900/60 hover:text-teal-950 transition-colors cursor-pointer select-none"
                aria-expanded={!isGroupCollapsed}
              >
                <span>{g.title}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 text-teal-800/50 ${
                    isGroupCollapsed ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {!isGroupCollapsed && (
              <div className="space-y-0.5">
                {g.items.map((i) => (
                  <NavLink
                    key={i.to}
                    to={i.to}
                    end={i.to === '/admin'}
                    onClick={() => setDrawer(false)}
                    title={i.label}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        isActive ? 'bg-[#115E59] text-white shadow-sm' : 'text-teal-950/80 hover:bg-teal-900/5'
                      }`
                    }
                  >
                    <i.icon className="h-4.5 w-4.5 shrink-0" size={17} />
                    {!collapsed && <span className="truncate">{i.label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  const Brand = (
    <div className="flex h-16 items-center gap-2.5 px-5 border-b border-teal-900/10">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#115E59] text-xs font-black text-white">JM</div>
      {!collapsed && <span className="text-sm font-bold text-teal-950">Admin PP Jauharul Maknuun</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-zinc-900">
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-teal-900/10 bg-white ${
          collapsed ? 'w-[76px]' : 'w-[280px]'
        } transition-[width]`}
      >
        {Brand}
        {Nav}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="m-3 flex items-center justify-center gap-2 rounded-xl border border-teal-900/10 py-2 text-xs text-teal-900 hover:bg-teal-900/5"
          aria-label="Ciutkan sidebar"
        >
          {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Ciutkan</>}
        </button>
      </aside>

      {/* Mobile Drawer (Left Sidebar) */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-2xl">
            <button className="absolute right-3 top-4 p-1 rounded-lg hover:bg-zinc-100 text-zinc-500" onClick={() => setDrawer(false)} aria-label="Tutup menu">
              <X size={18} />
            </button>
            {Brand}
            {Nav}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]'} transition-[padding]`}>
        {/* Top App Bar (56px Material Design on Mobile, 64px on Desktop) */}
        <header className="sticky top-0 z-20 flex h-14 sm:h-16 items-center gap-2.5 sm:gap-3 border-b border-teal-900/10 bg-white/95 px-3.5 sm:px-4 backdrop-blur shadow-xs">
          <button
            className="lg:hidden p-1.5 -ml-1 text-teal-950 hover:bg-teal-900/5 rounded-xl cursor-pointer"
            onClick={() => setDrawer(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu size={20} />
          </button>

          {/* Android Monogram Badge on Mobile */}
          <div className="lg:hidden grid h-8 w-8 place-items-center rounded-xl bg-[#115E59] text-[11px] font-black text-white shrink-0 shadow-xs">
            JM
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs sm:text-sm text-teal-900/70">
            <span className="hidden sm:inline">Admin</span>
            <ChevronRight size={14} className="hidden sm:block" />
            <h1 className="truncate font-extrabold text-teal-950 text-xs sm:text-sm">
              {CRUMBS[pathname] ?? 'Admin'}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden xs:inline-flex items-center gap-1.5 rounded-xl border border-teal-900/15 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-900/5 transition-colors"
            >
              <ExternalLink size={13} /> <span className="hidden sm:inline">Lihat Web</span>
            </Link>
            <UserMenu variant="compact" />
          </div>
        </header>

        {/* Content Body with Safe Bottom Spacing for Mobile Bottom Nav */}
        <main className="p-3.5 sm:p-6 pb-[calc(env(safe-area-inset-bottom)+84px)] lg:pb-8 max-w-[1920px] mx-auto min-w-0 overflow-x-hidden">
          <Outlet context={admin satisfies AdminOutletContext} />
        </main>
      </div>

      {/* Modern Android Bottom Navigation Bar (< 1024px) */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-teal-900/10 bg-white/95 backdrop-blur-md px-1 py-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {/* Item 1: Ringkasan */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              isActive ? 'text-[#115E59]' : 'text-zinc-500 hover:text-zinc-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-[#115E59]/10' : ''}`}>
                <LayoutDashboard size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="truncate max-w-[64px]">Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Item 2: Bulk Konten */}
        <NavLink
          to="/admin/bulk"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              isActive ? 'text-[#115E59]' : 'text-zinc-500 hover:text-zinc-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-[#115E59]/10' : ''}`}>
                <Layers size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="truncate max-w-[64px]">Konten</span>
            </>
          )}
        </NavLink>

        {/* Item 3: Sliders / Readme */}
        <NavLink
          to={admin.profile?.role === 'super_admin' ? '/admin/slider-settings' : '/admin/readme'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              isActive ? 'text-[#115E59]' : 'text-zinc-500 hover:text-zinc-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-[#115E59]/10' : ''}`}>
                {admin.profile?.role === 'super_admin' ? (
                  <SlidersHorizontal size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                ) : (
                  <BookOpen size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                )}
              </div>
              <span className="truncate max-w-[64px]">
                {admin.profile?.role === 'super_admin' ? 'Slider' : 'Panduan'}
              </span>
            </>
          )}
        </NavLink>

        {/* Item 4: Profil Saya */}
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              isActive ? 'text-[#115E59]' : 'text-zinc-500 hover:text-zinc-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-[#115E59]/10' : ''}`}>
                <UserCircle2 size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="truncate max-w-[64px]">Profil</span>
            </>
          )}
        </NavLink>

        {/* Item 5: Tombol "Lainnya" (Android Bottom Sheet Trigger) */}
        <button
          type="button"
          onClick={() => setBottomSheetOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 cursor-pointer ${
            bottomSheetOpen ? 'text-[#115E59]' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${bottomSheetOpen ? 'bg-[#115E59]/10' : ''}`}>
            <MoreHorizontal size={19} className={bottomSheetOpen ? 'stroke-[2.5]' : 'stroke-2'} />
          </div>
          <span className="truncate max-w-[64px]">Lainnya</span>
        </button>
      </nav>

      {/* Android Slide-Up Bottom Sheet for Full Modules */}
      <AnimatePresence>
        {bottomSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setBottomSheetOpen(false)}
            />

            {/* Slide-Up Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="absolute inset-x-0 bottom-0 max-h-[82vh] bg-white rounded-t-3xl shadow-2xl flex flex-col border-t border-teal-900/10"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1.5 rounded-full bg-zinc-300 mx-auto my-3 shrink-0 cursor-pointer" onClick={() => setBottomSheetOpen(false)} />

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#115E59] text-white flex items-center justify-center font-bold text-xs">
                    JM
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-zinc-900">Semua Modul &amp; Menu</h2>
                    <p className="text-[11px] text-zinc-500">Akses modul sesuai hak: <strong>{roleLabel}</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => setBottomSheetOpen(false)}
                  className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                  aria-label="Tutup panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sheet Body (Categorized Scrollable Modules) */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
                {/* Quick Utilities */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/"
                    target="_blank"
                    onClick={() => setBottomSheetOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-teal-900/15 bg-teal-50/50 text-xs font-bold text-teal-900 hover:bg-teal-100/50 transition-colors"
                  >
                    <ExternalLink size={15} />
                    <span>Lihat Web Publik</span>
                  </Link>
                  <NavLink
                    to="/admin/readme"
                    onClick={() => setBottomSheetOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-900/15 bg-amber-50/50 text-xs font-bold text-amber-950 hover:bg-amber-100/50 transition-colors"
                  >
                    <BookOpen size={15} />
                    <span>Panduan Read Me</span>
                  </NavLink>
                </div>

                {visible.map((group) => (
                  <div key={group.title} className="space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-teal-900/60 px-2">
                      {group.title}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === '/admin'}
                          onClick={() => setBottomSheetOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                              isActive
                                ? 'bg-[#115E59] text-white shadow-xs'
                                : 'text-zinc-700 bg-zinc-50/80 hover:bg-teal-900/5'
                            }`
                          }
                        >
                          <item.icon size={16} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

