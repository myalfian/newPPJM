import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  BookOpenCheck, 
  Images, 
  Sparkles, 
  Search, 
  Atom, 
  Trophy, 
  Menu, 
  ChevronDown, 
  User,
  ArrowRight,
  Compass,
  GraduationCap,
  Layers,
  HeartHandshake,
  BookOpen,
  Cpu,
  Video,
  Camera
} from 'lucide-react';
import { SearchModal } from './SearchModal';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

interface NavSubItem {
  title: string;
  href: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isDropdown: boolean;
  items?: NavSubItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Graceful dropdown dismiss timeout
  const clearDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const closeDropdownWithDelay = () => {
    clearDropdownTimeout();
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => clearDropdownTimeout();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mainHeader')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation Items with Icons & Submenus
  const navTabs: NavTabItem[] = [
    {
      id: 'jm-center',
      label: 'JM Center',
      icon: Landmark,
      href: '/jm-center',
      isDropdown: true,
      items: [
        { title: 'Sambutan Pengasuh', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok', icon: Compass },
        { title: 'Visi & Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga', icon: HeartHandshake },
        { title: 'Sejarah Pesantren', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu', icon: Landmark },
        { title: 'Badan Otonom & Lembaga', href: '/jm-center/lembaga', desc: 'Struktur kepengurusan & asrama', icon: Layers },
      ]
    },
    {
      id: 'programs',
      label: 'Program Unggulan',
      icon: BookOpenCheck,
      href: '/program-unggulan',
      isDropdown: true,
      items: [
        { title: 'Tahfidz 30 Juz Bersanad', href: '/smart-jm/hafidz/read', desc: "Mutaba'ah harian & sanad mutqin", icon: BookOpen },
        { title: 'Kurikulum Terpadu & Terakreditasi "A"', href: '/program-unggulan/program-sekolah', desc: 'Pendidikan formal unggulan', icon: GraduationCap },
        { title: 'Madrasah Diniyah Salafiyah', href: '/program-unggulan/program-madin', desc: 'Metode maknani gandul kitab turats', icon: BookOpenCheck },
        { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Wirid, ratib & sholat berjamaah', icon: HeartHandshake },
      ]
    },
    {
      id: 'ekskul',
      label: 'Ekstrakurikuler',
      icon: Sparkles,
      href: '/ekskul',
      isDropdown: false,
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      icon: Trophy,
      href: '/prestasi',
      isDropdown: false,
    },
    {
      id: 'stem',
      label: 'STEM & Smart JM',
      icon: Atom,
      href: '/smart-jm',
      isDropdown: true,
      items: [
        { title: 'Silabus STEM Santri', href: '/smart-jm/stem/materi', desc: 'Modul robotika, IoT & sains digital', icon: Cpu },
        { title: 'Portofolio Riset Santri', href: '/smart-jm/stem/portofolio', desc: 'Karya teknologi dan otomasi praktis', icon: Sparkles },
        { title: 'Murojaah AI Santri', href: '/smart-jm/hafidz/murojaah', desc: 'Evaluasi lafadz suara AI', icon: BookOpen },
        { title: 'Mandarin Class', href: '/smart-jm/mandarin/materi', desc: 'Pinyin audio & percakapan interaktif', icon: GraduationCap },
      ]
    },
    {
      id: 'galeri',
      label: 'Galeri',
      icon: Images,
      href: '/galeri',
      isDropdown: true,
      items: [
        { title: 'Galeri Foto Kegiatan', href: '/galeri/foto', desc: 'Dokumentasi asrama & halaqah santri', icon: Camera },
        { title: 'Galeri Video Profil', href: '/galeri/video', desc: 'Dokumenter resmi & kegiatan hadrah', icon: Video },
      ]
    },
  ];

  const isTabActive = (tab: NavTabItem) => {
    if (tab.id === 'jm-center') return location.pathname.startsWith('/jm-center');
    if (tab.id === 'programs') return location.pathname.startsWith('/program-unggulan') || location.pathname.startsWith('/smart-jm/hafidz/read');
    if (tab.id === 'ekskul') return location.pathname === '/ekskul';
    if (tab.id === 'prestasi') return location.pathname === '/prestasi';
    if (tab.id === 'stem') return location.pathname.includes('/stem') || location.pathname.includes('/mandarin') || location.pathname.includes('/hafidz/murojaah');
    if (tab.id === 'galeri') return location.pathname.startsWith('/galeri');
    return false;
  };

  return (
    <>
      {/* 1. TOP NEWS TICKER (Light Matcha/Gold Tone matching screenshot) */}
      <div id="topNewsTicker" className="bg-[#d4af37]/15 border-b border-[#d4af37]/30 py-1.5 px-4 overflow-hidden hidden md:flex items-center text-xs">
        <div className="bg-[#1a6b3c] text-white font-bold px-3 py-1 rounded-md text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span>INFO TERKINI</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-ticker text-[#0d4a28] font-medium inline-block space-x-6">
            <span>✨ Pendaftaran PPDB Santri Baru Pondok Pesantren Jauharul Maknuun TP 2026/2027 telah dibuka!</span>
            <span>|</span>
            <span>🏆 Pondok Pesantren Jauharul Maknuun Resmi Meraih Akreditasi &quot;A&quot; BAN-PDM</span>
            <span>|</span>
            <span>📖 Program Unggulan: Tahfidz 30 Juz Bersanad, Madrasah Diniyah Salafiyah, &amp; Pendidikan Terpadu</span>
            <span>|</span>
            <span>🔬 Laboratorium Komputer Modern &amp; Kurikulum Riset STEM Santri Terpadu</span>
            <span>|</span>
            <span>📲 Narahubung Sekretariat &amp; Konsultasi Asrama: 0812-3456-7890</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Dribbble Modern Floating Pill Animation Bar) */}
      <header 
        id="mainHeader" 
        className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-2.5 min-h-[4rem] sm:min-h-[4.5rem]">
            
            {/* Brand Logo & Title */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0" 
              aria-label="Beranda Pondok Pesantren Jauharul Maknuun"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-[#d4af37]/40 group-hover:ring-[#d4af37] group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
                <img 
                  src="/logo.jpg" 
                  alt="Logo Pondok Pesantren Jauharul Maknuun" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[9px] sm:text-[10px] tracking-widest text-[#0d4a28] uppercase leading-tight">
                  PONDOK PESANTREN
                </span>
                <span className="font-black text-xs sm:text-base lg:text-lg tracking-tight text-[#d4af37] leading-tight">
                  JAUHARUL MAKNUUN
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  Lasem Sidayu Gresik - Jawa Timur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation: Single Horizontal Line with Icon on Top & Label on Bottom */}
            <nav 
              className="hidden lg:flex items-center p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.03)] relative gap-0.5"
              onMouseLeave={() => {
                setHoveredTab(null);
                closeDropdownWithDelay();
              }}
            >
              {navTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = isTabActive(tab);
                const isHovered = hoveredTab === tab.id;
                const isOpen = activeDropdown === tab.id;

                return (
                  <div
                    key={tab.id}
                    className="relative"
                    onMouseEnter={() => {
                      setHoveredTab(tab.id);
                      if (tab.isDropdown) {
                        clearDropdownTimeout();
                        setActiveDropdown(tab.id);
                      } else {
                        setActiveDropdown(null);
                      }
                    }}
                  >
                    {/* Trigger Button / Link (Icon on top, Name below) */}
                    {tab.isDropdown ? (
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(isOpen ? null : tab.id)}
                        className={`relative z-10 px-2.5 sm:px-3 py-1.5 rounded-xl flex flex-col items-center justify-center transition-colors duration-200 select-none cursor-pointer group min-w-[62px] sm:min-w-[68px] ${
                          isActive 
                            ? 'text-[#0d4a28]' 
                            : isHovered 
                              ? 'text-[#1a6b3c]' 
                              : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div className="relative flex items-center justify-center h-4.5">
                          <TabIcon className={`w-4 h-4 transition-all duration-200 group-hover:scale-115 group-hover:-translate-y-0.5 ${
                            isActive 
                              ? 'text-[#1a6b3c]' 
                              : isHovered 
                                ? 'text-[#1a6b3c]' 
                                : 'text-slate-500 group-hover:text-[#1a6b3c]'
                          }`} />
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <span className="text-[10px] xl:text-[10.5px] font-bold tracking-tight whitespace-nowrap leading-tight">
                            {tab.label}
                          </span>
                          <ChevronDown className={`w-2.5 h-2.5 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#1a6b3c]' : 'group-hover:text-slate-600'
                          }`} />
                        </div>
                        {isActive && (
                          <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#1a6b3c]" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={tab.href}
                        className={`relative z-10 px-2.5 sm:px-3 py-1.5 rounded-xl flex flex-col items-center justify-center transition-colors duration-200 select-none cursor-pointer group min-w-[62px] sm:min-w-[68px] ${
                          isActive 
                            ? 'text-[#0d4a28]' 
                            : isHovered 
                              ? 'text-[#1a6b3c]' 
                              : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div className="relative flex items-center justify-center h-4.5">
                          <TabIcon className={`w-4 h-4 transition-all duration-200 group-hover:scale-115 group-hover:-translate-y-0.5 ${
                            isActive 
                              ? 'text-[#1a6b3c]' 
                              : isHovered 
                                ? 'text-[#1a6b3c]' 
                                : 'text-slate-500 group-hover:text-[#1a6b3c]'
                          }`} />
                        </div>
                        <span className="text-[10px] xl:text-[10.5px] font-bold tracking-tight whitespace-nowrap leading-tight mt-0.5">
                          {tab.label}
                        </span>
                        {isActive && (
                          <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#1a6b3c]" />
                        )}
                      </Link>
                    )}

                    {/* Fluid Sliding Pill Indicator (Active or Hovered) */}
                    {isHovered && (
                      <motion.div
                        layoutId="nav-capsule-indicator"
                        className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/90 z-0 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}

                    {isActive && !isHovered && !hoveredTab && (
                      <motion.div
                        layoutId="nav-capsule-indicator"
                        className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_10px_rgba(26,107,60,0.1)] border border-emerald-600/30 z-0 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}

                    {/* Interactive Dropdown Menu Card */}
                    <AnimatePresence>
                      {isOpen && tab.items && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute top-full mt-2.5 z-50 bg-white/95 backdrop-blur-2xl rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.14),0_0_0_1px_rgba(26,107,60,0.08)] border border-emerald-100/90 overflow-hidden ${
                            tab.id === 'galeri' ? 'right-0 w-72' : 'left-0 w-80'
                          }`}
                          onMouseEnter={() => {
                            clearDropdownTimeout();
                            setActiveDropdown(tab.id);
                          }}
                          onMouseLeave={() => {
                            closeDropdownWithDelay();
                          }}
                        >
                          {/* Top Golden Accent Trim */}
                          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

                          <div className="space-y-1">
                            {tab.items.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.href}
                                  to={subItem.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-emerald-50/80 transition-all duration-180 group relative overflow-hidden"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-emerald-50/90 group-hover:bg-[#1a6b3c] text-[#1a6b3c] group-hover:text-white border border-emerald-200/60 flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs group-hover:scale-105">
                                    <SubIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-6" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#0d4a28] flex items-center justify-between">
                                      <span>{subItem.title}</span>
                                      <ArrowRight className="w-3 h-3 text-[#d4af37] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                    </div>
                                    <div className="text-[10px] text-slate-500 group-hover:text-slate-600 truncate">
                                      {subItem.desc}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right Side: Search Pill Button, Admin CTA & Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Global Search Pill Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-100/90 hover:bg-emerald-50 hover:text-[#0d4a28] border border-slate-200/90 hover:border-emerald-300 transition-all duration-200 shadow-2xs cursor-pointer active:scale-95"
                title="Cari Berita, Hafidz, STEM, Galeri (Ctrl+K)"
                aria-label="Cari Informasi Portal"
              >
                <Search className="w-3.5 h-3.5 text-[#1a6b3c] group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs">Cari</span>
                <kbd className="hidden sm:inline-flex items-center text-[9px] bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-slate-500 font-mono shadow-xs font-medium group-hover:border-emerald-300">
                  ⌘K
                </kbd>
              </button>

              {/* Profile shortcut with Live Status Pulse */}
              <Link
                to="/admin"
                className="relative group inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold text-emerald-950 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/80 hover:from-emerald-100 hover:to-emerald-100 border border-emerald-300/80 hover:border-emerald-400 transition-all duration-200 shadow-xs active:scale-95 overflow-hidden"
                title="Profil Pengguna & Portal"
              >
                <div className="relative flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                  </span>
                </div>
                <span className="tracking-tight">Profile</span>
              </Link>

              {/* Mobile Hamburger Button */}
              <div className="flex lg:hidden items-center">
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-[#1a6b3c] border border-slate-200 transition-all cursor-pointer active:scale-95"
                  aria-label="Buka Menu Navigasi"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 3. SEARCH MODAL */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
