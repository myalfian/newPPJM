import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Award,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface NavDropdownProps {
  label: string;
  items: Array<{ title: string; href: string; desc?: string }>;
  icon?: React.ReactNode;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, items, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = items.some((item) => location.pathname.startsWith(item.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-emerald-800 text-white shadow-sm'
            : 'text-onyx hover:bg-emerald-50 hover:text-emerald-800'
        }`}
        aria-expanded={isOpen}
      >
        {icon}
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute left-0 mt-1 w-64 rounded-2xl glass-card shadow-m3-3 p-2 z-50 border border-emerald-100"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
              >
                <div className="font-semibold text-sm text-onyx group-hover:text-emerald-800">
                  {item.title}
                </div>
                {item.desc && (
                  <div className="text-xs text-onyx-muted group-hover:text-emerald-600 line-clamp-1">
                    {item.desc}
                  </div>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const location = useLocation();

  const jmCenterItems = [
    { title: 'Sambutan Pengasuh', href: '/jm-center/sambutan', desc: 'Kalam hikmah Mudir KH. M. Jauharul Maknuun' },
    { title: 'Sejarah Pesantren', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu' },
    { title: 'Visi & Misi', href: '/jm-center/visi-misi', desc: 'Falsafah dan arah strategis tarbiyah' },
    { title: 'Badan Otonom & Lembaga', href: '/jm-center/lembaga', desc: 'Madrasah, Asrama & Pusat Riset' },
  ];

  const programItems = [
    { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Ratib, wirid harian & qiyamul lail' },
    { title: 'Program Sekolah', href: '/program-unggulan/program-sekolah', desc: 'Kurikulum formal berkarakter islami' },
    { title: 'Madrasah Diniyah (Madin)', href: '/program-unggulan/program-madin', desc: 'Kajian kitab turats berjenjang' },
  ];

  const smartJmItems = [
    { title: 'Hafidz Quran 30 Juz', href: '/smart-jm/hafidz/read', desc: 'Mushaf digital online & murottal per ayat' },
    { title: 'Murojaah AI Santri', href: '/smart-jm/hafidz/murojaah', desc: 'Evaluasi lafadz suara kecerdasan buatan' },
    { title: 'STEM Area (Materi)', href: '/smart-jm/stem/materi', desc: 'Silabus sains & lembar tugas santri' },
    { title: 'STEM Area (Portofolio)', href: '/smart-jm/stem/portofolio', desc: 'Showcase karya teknologi inovasi santri' },
    { title: 'Mandarin Class (Materi)', href: '/smart-jm/mandarin/materi', desc: 'Audio Pinyin & percakapan santri' },
    { title: 'Mandarin Class (Quiz)', href: '/smart-jm/mandarin/quiz', desc: 'Kuis interaktif Hanzi & skor instan' },
  ];

  const galeriItems = [
    { title: 'Galeri Foto Agenda', href: '/galeri/foto', desc: 'Dokumentasi kegiatan santri & pondok' },
    { title: 'Galeri Video Profil', href: '/galeri/video', desc: 'Video dokumenter & YouTube PPJM' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-600 via-gold-500 to-emerald-400 shadow-sm group-hover:shadow-glow-emerald transition-all duration-300 flex-shrink-0">
              <img
                src="/logo-ppjm.svg"
                alt="Logo PP Jauharul Maknuun"
                className="w-full h-full object-contain rounded-full bg-white"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg text-emerald-900 leading-tight tracking-tight group-hover:text-emerald-700 transition-colors">
                PP JAUHARUL MAKNUUN
              </span>
              <span className="text-xs font-semibold text-gold-700 tracking-wider uppercase">
                Lasem - Sidayu - Gresik
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                location.pathname === '/'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-onyx hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              Beranda
            </Link>

            <NavDropdown label="JM Center" items={jmCenterItems} icon={<Compass className="w-4 h-4 text-emerald-600" />} />
            <NavDropdown label="Program Unggulan" items={programItems} icon={<BookOpen className="w-4 h-4 text-emerald-600" />} />
            <NavDropdown label="Smart JM" items={smartJmItems} icon={<Sparkles className="w-4 h-4 text-gold-600" />} />

            <Link
              to="/prestasi"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                location.pathname.startsWith('/prestasi')
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-onyx hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Prestasi</span>
            </Link>

            <Link
              to="/ekskul"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                location.pathname.startsWith('/ekskul')
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-onyx hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <span>Ekskul</span>
            </Link>

            <NavDropdown label="Galeri" items={galeriItems} icon={<ImageIcon className="w-4 h-4 text-emerald-600" />} />
          </nav>

          {/* Right CTA / Admin Link */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-sm hover:shadow"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Portal Admin</span>
            </Link>

            <Link
              to="/smart-jm/hafidz/read"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 shadow-sm hover:shadow-glow-emerald transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Buka Smart JM</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={onOpenMobileMenu}
              className="p-2.5 rounded-2xl text-onyx hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
