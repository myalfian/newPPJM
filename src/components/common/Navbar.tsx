import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Landmark, 
  BookOpenCheck, 
  Images, 
  Sparkles,
  Search,
  Atom,
  Trophy,
  Menu,
  ChevronDown
} from 'lucide-react';
import { SearchModal } from './SearchModal';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

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

  const jmCenterItems = [
    { title: 'Sambutan Pengasuh', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok' },
    { title: 'Visi & Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga' },
    { title: 'Sejarah Pesantren', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu' },
    { title: 'Badan Otonom & Lembaga', href: '/jm-center/lembaga', desc: 'Struktur kepengurusan & asrama' },
  ];

  const programItems = [
    { title: 'Tahfidz 30 Juz Bersanad', href: '/smart-jm/hafidz/read', desc: 'Mutaba\'ah harian & sanad mutqin' },
    { title: 'Kurikulum Terpadu & Terakreditasi "A"', href: '/program-unggulan/program-sekolah', desc: 'Pendidikan formal unggulan' },
    { title: 'Madrasah Diniyah Salafiyah', href: '/program-unggulan/program-madin', desc: 'Metode maknani gandul kitab turats' },
    { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Wirid, ratib & sholat berjamaah' },
  ];

  const stemItems = [
    { title: 'Silabus STEM Santri', href: '/smart-jm/stem/materi', desc: 'Modul robotika, IoT & sains digital' },
    { title: 'Portofolio Riset Santri', href: '/smart-jm/stem/portofolio', desc: 'Karya teknologi dan otomasi praktis' },
    { title: 'Murojaah AI Santri', href: '/smart-jm/hafidz/murojaah', desc: 'Evaluasi lafadz suara AI' },
    { title: 'Mandarin Class', href: '/smart-jm/mandarin/materi', desc: 'Pinyin audio & percakapan' },
  ];

  const galeriItems = [
    { title: 'Galeri Foto Kegiatan', href: '/galeri/foto', desc: 'Dokumentasi asrama & halaqah' },
    { title: 'Galeri Video Profil', href: '/galeri/video', desc: 'Dokumenter resmi & hadrah' },
  ];

  return (
    <>
      {/* 1. TOP NEWS TICKER (Light Matcha/Gold Tone matching screenshot) */}
      <div className="bg-[#d4af37]/15 border-b border-[#d4af37]/30 py-1.5 px-4 overflow-hidden hidden md:flex items-center text-xs">
        <div className="bg-[#1a6b3c] text-white font-bold px-3 py-1 rounded-md text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span>INFO TERKINI</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-ticker text-[#0d4a28] font-medium inline-block space-x-6">
            <span>✨ Pendaftaran PPDB Santri Baru Pondok Pesantren Jauharul Maknuun TP 2026/2027 telah dibuka!</span>
            <span>|</span>
            <span>🏆 Pondok Pesantren Jauharul Maknuun Resmi Meraih Akreditasi "A" BAN-PDM</span>
            <span>|</span>
            <span>📖 Program Unggulan: Tahfidz 30 Juz Bersanad, Madrasah Diniyah Salafiyah, & Pendidikan Terpadu</span>
            <span>|</span>
            <span>🔬 Laboratorium Komputer Modern & Kurikulum Riset STEM Santri Terpadu</span>
            <span>|</span>
            <span>📲 Narahubung Sekretariat & Konsultasi Asrama: 0812-3456-7890</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Clean White, Official Logo & Links) */}
      <header id="mainHeader" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 sm:py-2 min-h-[3.75rem] sm:min-h-[4.25rem]">
            
            {/* Brand Logo & Title */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0" 
              aria-label="Beranda Pondok Pesantren Jauharul Maknuun"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-md border-2 border-[#1a6b3c]/20 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center shrink-0">
                <img 
                  src="/logo.jpg" 
                  alt="Logo Pondok Pesantren Jauharul Maknuun" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to SVG if logo.jpg fails
                    (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[10px] sm:text-xs tracking-wider text-[#0d4a28] uppercase leading-tight">
                  PONDOK PESANTREN
                </span>
                <span className="font-black text-xs sm:text-base lg:text-lg tracking-tight text-[#d4af37] leading-tight">
                  JAUHARUL MAKNUUN
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                  Lasem Sidayu Gresik - Jawa Timur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Icons */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-gray-700">
              
              {/* 1. JM Center Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('jm-center')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${
                    location.pathname.startsWith('/jm-center')
                      ? 'text-[#1a6b3c] bg-emerald-50'
                      : 'text-gray-700 hover:text-[#1a6b3c] hover:bg-emerald-50/80'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-[#1a6b3c]" />
                  <span>JM Center</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {activeDropdown === 'jm-center' && (
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {jmCenterItems.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                      >
                        <div className="text-xs font-bold text-gray-800 group-hover:text-[#1a6b3c]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Program Unggulan Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('programs')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${
                    location.pathname.startsWith('/program-unggulan')
                      ? 'text-[#1a6b3c] bg-emerald-50'
                      : 'text-gray-700 hover:text-[#1a6b3c] hover:bg-emerald-50/80'
                  }`}
                >
                  <BookOpenCheck className="w-4 h-4 text-[#1a6b3c]" />
                  <span>Program Unggulan</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {activeDropdown === 'programs' && (
                  <div className="absolute left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {programItems.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                      >
                        <div className="text-xs font-bold text-gray-800 group-hover:text-[#1a6b3c]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Ekstrakurikuler */}
              <Link
                to="/ekskul"
                className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${
                  location.pathname === '/ekskul'
                    ? 'text-[#1a6b3c] bg-emerald-50'
                    : 'text-gray-700 hover:text-[#1a6b3c] hover:bg-emerald-50/80'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#1a6b3c]" />
                <span>Ekstrakurikuler</span>
              </Link>

              {/* 4. Prestasi */}
              <Link
                to="/prestasi"
                className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${
                  location.pathname === '/prestasi'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50/80'
                }`}
              >
                <Trophy className="w-4 h-4 text-[#d4af37] stroke-[2.2]" />
                <span>Prestasi</span>
              </Link>

              {/* 5. STEM Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('stem')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${
                    location.pathname.includes('/stem') || location.pathname.includes('/mandarin')
                      ? 'text-[#1a6b3c] bg-emerald-50'
                      : 'text-gray-700 hover:text-[#1a6b3c] hover:bg-emerald-50/80'
                  }`}
                >
                  <Atom className="w-4 h-4 text-[#1a6b3c]" />
                  <span>STEM</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {activeDropdown === 'stem' && (
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {stemItems.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                      >
                        <div className="text-xs font-bold text-gray-800 group-hover:text-[#1a6b3c]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Galeri Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('galeri')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${
                    location.pathname.startsWith('/galeri')
                      ? 'text-[#1a6b3c] bg-emerald-50'
                      : 'text-gray-700 hover:text-[#1a6b3c] hover:bg-emerald-50/80'
                  }`}
                >
                  <Images className="w-4 h-4 text-[#1a6b3c]" />
                  <span>Galeri</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {activeDropdown === 'galeri' && (
                  <div className="absolute right-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {galeriItems.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                      >
                        <div className="text-xs font-bold text-gray-800 group-hover:text-[#1a6b3c]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </nav>

            {/* Right Side: Global Search Pill Button & Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Global Search Pill Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold text-gray-700 bg-gray-100/90 hover:bg-[#1a6b3c]/10 hover:text-[#1a6b3c] border border-gray-200 transition-all btn-spring cursor-pointer shadow-2xs"
                title="Cari Berita, Hafidz, STEM, Galeri (Ctrl+K)"
                aria-label="Cari Informasi Portal"
              >
                <Search className="w-3.5 h-3.5 text-[#1a6b3c]" />
                <span className="font-semibold">Cari</span>
                <kbd className="hidden sm:inline-block text-[9px] bg-white border border-gray-300 rounded px-1.5 py-0.5 text-gray-400 font-sans shadow-xs font-normal">
                  ⌘K
                </kbd>
              </button>

              {/* Admin shortcut */}
              <Link
                to="/admin"
                className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition shadow-2xs"
                title="Masuk ke Panel Admin Zero-IT"
              >
                Admin
              </Link>

              {/* Mobile Hamburger Button */}
              <div className="flex lg:hidden items-center">
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="p-2 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-[#1a6b3c] transition-colors cursor-pointer"
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
