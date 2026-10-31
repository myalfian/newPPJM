import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Cpu,
  Globe,
  ImageIcon,
  Gauge,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpRight,
  Monitor,
  Columns2,
  Smartphone,
  Tablet,
  RotateCw,
  Eye,
  Pencil,
  HeartHandshake,
  Users,
  CalendarDays,
  Landmark,
  BookOpen,
  Trophy,
  Maximize2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { UserRole } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { EnvAlertBanner } from '../components/common/EnvAlertBanner';
import { RoleBadge, MODULE_ACCESS, ModuleKey } from '../components/auth/RoleGuard';

// -------------------------------------------------------------
// NAVIGATION GROUPING SESUAI SPESIFIKASI PPJM
// -------------------------------------------------------------

export interface NavItemConfig {
  id: string;
  moduleKey: ModuleKey;
  label: string;
  href: string;
  publicHref: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavGroupConfig {
  groupTitle: string;
  items: NavItemConfig[];
}

export const ADMIN_SIDEBAR_GROUPS: NavGroupConfig[] = [
  // 1. Pusat Kendali
  {
    groupTitle: 'Pusat Kendali',
    items: [
      {
        id: 'dashboard',
        moduleKey: 'dashboard',
        label: 'Dashboard Metrik',
        href: '/admin/dashboard',
        publicHref: '/',
        icon: LayoutDashboard,
        badge: 'Live'
      }
    ]
  },
  // 2. Beranda Navigasi
  {
    groupTitle: 'Beranda Navigasi',
    items: [
      {
        id: 'webVisualEditor',
        moduleKey: 'webVisualEditor',
        label: 'Web Visual Editor',
        href: '/admin/editor',
        publicHref: '/',
        icon: Monitor,
        badge: 'WYSIWYG'
      },
      {
        id: 'slider',
        moduleKey: 'slider',
        label: 'Kelola Slider Poster',
        href: '/admin/slider',
        publicHref: '/',
        icon: Gauge,
        badge: '5 Flyer'
      }
    ]
  },
  // 3. JM Center
  {
    groupTitle: 'JM Center',
    items: [
      {
        id: 'profil',
        moduleKey: 'profil',
        label: 'Profil, Sejarah & Fasilitas',
        href: '/admin/profil',
        publicHref: '/jm-center/sambutan',
        icon: Landmark
      }
    ]
  },
  // 4. Program
  {
    groupTitle: 'Program',
    items: [
      {
        id: 'program',
        moduleKey: 'profil',
        label: 'Amaliyah 24 Jam & Madin',
        href: '/admin/profil?tab=amaliyah',
        publicHref: '/program/pondok',
        icon: Layers,
        badge: 'Kitab'
      }
    ]
  },
  // 5. SMART JM
  {
    groupTitle: 'SMART JM',
    items: [
      {
        id: 'stem',
        moduleKey: 'stem',
        label: 'Lab Inovasi STEM',
        href: '/admin/stem',
        publicHref: '/smart-jm/stem/materi',
        icon: Cpu,
        badge: 'IoT'
      },
      {
        id: 'mandarin',
        moduleKey: 'mandarin',
        label: 'Kelas Mandarin HSK',
        href: '/admin/mandarin',
        publicHref: '/smart-jm/mandarin/materi',
        icon: Globe,
        badge: 'Quiz'
      },
      {
        id: 'hafidz',
        moduleKey: 'hafidz',
        label: 'Dewan Tahfidz Al-Qur\'an',
        href: '/admin/hafidz',
        publicHref: '/smart-jm/hafidz/read',
        icon: BookOpen,
        badge: '114 Surat'
      }
    ]
  },
  // 6. Konten Publik
  {
    groupTitle: 'Konten Publik',
    items: [
      {
        id: 'berita',
        moduleKey: 'berita',
        label: 'Warta & Siaran Pers',
        href: '/admin/berita',
        publicHref: '/jm-news/press-release',
        icon: Newspaper,
        badge: 'Warta'
      },
      {
        id: 'galeri',
        moduleKey: 'galeri',
        label: 'Galeri Foto & Video',
        href: '/admin/galeri',
        publicHref: '/galeri/foto',
        icon: ImageIcon
      },
      {
        id: 'prestasi',
        moduleKey: 'prestasi',
        label: 'Prestasi Juara Santri',
        href: '/admin/prestasi',
        publicHref: '/prestasi',
        icon: Trophy,
        badge: 'Juara'
      },
      {
        id: 'ekskul',
        moduleKey: 'ekskul',
        label: 'Ekstrakurikuler',
        href: '/admin/ekskul',
        publicHref: '/ekstrakurikuler',
        icon: Sparkles
      },
      {
        id: 'osis',
        moduleKey: 'osis',
        label: 'Portal Kabinet OSIS',
        href: '/admin/osis',
        publicHref: '/osis',
        icon: Users
      },
      {
        id: 'agenda',
        moduleKey: 'agenda',
        label: 'Kalender & Agenda',
        href: '/admin/agenda',
        publicHref: '/agenda',
        icon: CalendarDays,
        badge: 'H-J-M-D'
      }
    ]
  },
  // 7. Sistem
  {
    groupTitle: 'Sistem',
    items: [
      {
        id: 'kontak',
        moduleKey: 'kontak',
        label: 'Kontak Hotline & Medsos',
        href: '/admin/kontak',
        publicHref: '/',
        icon: HeartHandshake,
        badge: '7 Kanal'
      },
      {
        id: 'akunRbac',
        moduleKey: 'akunRbac',
        label: 'Akun RBAC & Akses',
        href: '/admin/akun',
        publicHref: '/profil',
        icon: ShieldCheck,
        badge: 'Root'
      }
    ]
  }
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role: activeRole, profile, signOut, switchMockRole } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Split-Preview states
  const [isSplitPreview, setIsSplitPreview] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [previewReloadKey, setPreviewReloadKey] = useState<number>(0);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  // Helper cek izin modul per role
  const isModuleAllowed = (moduleKey: ModuleKey): boolean => {
    if (activeRole === 'super_admin') return true;
    const allowed = MODULE_ACCESS[moduleKey] || [];
    return allowed.includes(activeRole);
  };

  // Find active item
  const currentItem = ADMIN_SIDEBAR_GROUPS.flatMap((g) => g.items).find((item) => {
    if (item.href === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(item.href);
  }) || ADMIN_SIDEBAR_GROUPS[0].items[0];

  const previewPath = currentItem.publicHref || '/';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVBAR ADMIN                                              */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A2116]/95 backdrop-blur-md border-b border-slate-200 dark:border-emerald-900/40 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/30 md:hidden"
            title="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 dark:hover:bg-emerald-900/30"
            title={sidebarCollapsed ? 'Perluas sidebar' : 'Persempit sidebar'}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-gold-400 to-emerald-400 p-0.5 shadow-xs shrink-0">
              <img
                src="/logo-ppjm.svg"
                alt="PPJM"
                className="w-full h-full object-contain rounded-full bg-white"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-black text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                <span>PPJM Zero-IT CMS</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  v2026
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Pondok Pesantren Jauharul Maknuun</div>
            </div>
          </Link>
        </div>

        {/* Center: Search Filter */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari modul atau menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-emerald-950/40 border border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all"
          />
        </div>

        {/* Right: Quick Role Switcher, Split Preview Toggle, Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Mock Role Switcher (Praktis untuk Evaluator & Pengurus) */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-900/40">
            <span className="text-[10px] font-bold text-slate-400 px-1.5">Uji Role:</span>
            {(['super_admin', 'pengurus_konten', 'guru_akademik'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchMockRole(r)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                  activeRole === r
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
                title={`Beralih ke peran ${r}`}
              >
                {r === 'super_admin' ? 'Root' : r === 'pengurus_konten' ? 'Media' : 'Akademik'}
              </button>
            ))}
          </div>

          {/* Toggle Live Preview Split Screen */}
          <button
            onClick={() => setIsSplitPreview(!isSplitPreview)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all hidden xl:flex items-center gap-1.5 border ${
              isSplitPreview
                ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                : 'bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-50'
            }`}
            title="Buka simulasi live split screen preview website santri"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Split Preview</span>
          </button>

          {/* Tautan ke Beranda Website Publik */}
          <Link
            to="/"
            target="_blank"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 dark:hover:bg-emerald-900/30"
            title="Buka Website Santri di Tab Baru"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Logout Quick Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title="Keluar dari Panel Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* BODY LAYOUT: SIDEBAR + MAIN WORKSPACE + OPTIONAL PREVIEW      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* =========================================================== */}
        {/* SIDEBAR NAVIGASI (DESKTOP & MOBILE DRAWER)                  */}
        {/* =========================================================== */}
        <aside
          className={`${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${
            sidebarCollapsed ? 'md:w-20' : 'md:w-72'
          } fixed md:static inset-y-0 left-0 z-30 w-72 bg-white dark:bg-[#0A2116] border-r border-slate-200 dark:border-emerald-900/40 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl md:shadow-none pt-16 md:pt-0`}
        >
          {/* Scrollable Nav Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {ADMIN_SIDEBAR_GROUPS.map((group) => {
              // Filter modul sesuai pencarian jika ada query
              const filteredItems = group.items.filter((item) => {
                if (!searchQuery) return true;
                return (
                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  group.groupTitle.toLowerCase().includes(searchQuery.toLowerCase())
                );
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.groupTitle} className="space-y-1.5">
                  {!sidebarCollapsed && (
                    <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-emerald-400/60">
                      {group.groupTitle}
                    </div>
                  )}

                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const IconComp = item.icon;
                      const isAllowed = isModuleAllowed(item.moduleKey);
                      const isActive =
                        item.href === '/admin/dashboard'
                          ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                          : location.pathname.startsWith(item.href);

                      if (!isAllowed) {
                        // Jika role tidak memiliki hak akses, tampilkan dalam kondisi locked/disabled
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 dark:text-zinc-700 cursor-not-allowed select-none text-xs font-semibold ${
                              sidebarCollapsed ? 'justify-center' : ''
                            }`}
                            title={`Peran Anda (${activeRole}) tidak memiliki izin untuk modul ${item.label}`}
                          >
                            <IconComp className="w-4 h-4 shrink-0 opacity-40" />
                            {!sidebarCollapsed && (
                              <>
                                <span className="truncate flex-1">{item.label}</span>
                                <Lock className="w-3 h-3 text-slate-300 dark:text-zinc-700 shrink-0" />
                              </>
                            )}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.id}
                          to={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                          } ${sidebarCollapsed ? 'justify-center' : ''}`}
                          title={item.label}
                        >
                          <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold-300' : 'text-slate-500'}`} />
                          {!sidebarCollapsed && (
                            <>
                              <span className="truncate flex-1">{item.label}</span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                                    isActive
                                      ? 'bg-gold-400 text-slate-950 font-black'
                                      : 'bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-emerald-800'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================================== */}
          {/* PROFILE CARD & ROLE BADGE DI BAGIAN BAWAH SIDEBAR           */}
          {/* =========================================================== */}
          <div className="p-3 border-t border-slate-200 dark:border-emerald-900/40 bg-slate-50/70 dark:bg-black/20">
            {!sidebarCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-800 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                    {profile?.full_name ? profile.full_name.charAt(0) : 'P'}
                  </div>
                  <div className="leading-tight truncate flex-1">
                    <div className="font-black text-xs text-slate-900 dark:text-white truncate">
                      {profile?.full_name || 'Pengurus PPJM'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {profile?.nis_or_nip || 'PPJM-ADM-001'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <RoleBadge role={activeRole} />
                  <button
                    onClick={handleLogout}
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <span>Keluar</span>
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* =========================================================== */}
        {/* WORKSPACE AREA (OUTLET CONTENT)                             */}
        {/* =========================================================== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* =========================================================== */}
        {/* OPTIONAL LIVE SPLIT PREVIEW (DESKTOP / TABLET / MOBILE)     */}
        {/* =========================================================== */}
        {isSplitPreview && (
          <aside className="hidden xl:flex flex-col w-[420px] 2xl:w-[480px] border-l border-slate-200 dark:border-emerald-900/40 bg-white dark:bg-[#0A2116] overflow-hidden">
            
            {/* Split Screen Device Controls */}
            <div className="p-3 border-b border-slate-200 dark:border-emerald-900/40 bg-slate-50 dark:bg-black/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Live Preview Santri</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg ${
                    previewDevice === 'mobile' ? 'bg-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Tampilan Smartphone (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg ${
                    previewDevice === 'tablet' ? 'bg-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Tampilan Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewReloadKey((k) => k + 1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                  title="Refresh Tampilan Iframe"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsSplitPreview(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                  title="Tutup Split Preview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Iframe Website Santri */}
            <div className="flex-1 bg-slate-200 dark:bg-slate-900 flex items-center justify-center p-3 overflow-hidden">
              <div
                className={`h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 transition-all ${
                  previewDevice === 'mobile' ? 'w-[375px]' : 'w-full'
                }`}
              >
                <iframe
                  key={previewReloadKey}
                  src={previewPath}
                  title="Website Santri Preview"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* Dataset Warning Modal Banner */}
      <EnvAlertBanner />
    </div>
  );
};
export default AdminLayout;
