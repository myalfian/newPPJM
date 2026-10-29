import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Landmark,
  BookOpenCheck,
  Cpu,
  Trophy,
  Award,
  Palette,
  Activity,
  Sparkles,
  Images,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  User,
  Users,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Globe,
  Camera,
  Video,
  Layers,
  HeartHandshake,
  Compass,
  CheckCircle2,
  Volume2,
  Newspaper,
  ShieldCheck,
  Building2,
  School
} from 'lucide-react';
import { OsisIcon } from '../../data/navigationData';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DrawerCategory {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    badgeBg: string;
    iconColor: string;
    border: string;
    activeBg: string;
  };
  items?: { title: string; href: string; desc?: string; icon: React.ComponentType<{ className?: string }> }[];
  groups?: {
    groupTitle: string;
    icon: React.ComponentType<{ className?: string }>;
    items: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
  }[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const categories: DrawerCategory[] = [
    {
      id: 'jm-center',
      title: 'JM Center',
      subtitle: 'Tentang & Profil Pondok',
      href: '/jm-center',
      icon: Landmark,
      color: {
        badgeBg: 'bg-emerald-50',
        iconColor: 'text-emerald-700',
        border: 'border-emerald-200/80',
        activeBg: 'bg-emerald-700',
      },
      groups: [
        {
          groupTitle: '1. Profil',
          icon: Compass,
          items: [
            { title: 'Sambutan Pimpinan', href: '/jm-center/sambutan', icon: Compass },
            { title: 'Sejarah Pesantren', href: '/jm-center/sejarah', icon: Landmark },
            { title: 'Visi dan Misi', href: '/jm-center/visi-misi', icon: HeartHandshake },
          ],
        },
        {
          groupTitle: '2. Fasilitas',
          icon: Building2,
          items: [
            { title: 'Fasilitas', href: '/jm-center/fasilitas', icon: Building2 },
          ],
        },
        {
          groupTitle: '3. Lembaga',
          icon: Layers,
          items: [
            { title: 'Lembaga', href: '/jm-center/lembaga', icon: Layers },
          ],
        },
      ],
    },
    {
      id: 'programs',
      title: 'Program Unggulan',
      subtitle: 'Kurikulum Terpadu & Salaf',
      href: '/program-unggulan',
      icon: BookOpenCheck,
      color: {
        badgeBg: 'bg-blue-50',
        iconColor: 'text-blue-700',
        border: 'border-blue-200/80',
        activeBg: 'bg-blue-700',
      },
      items: [
        { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Wirid, ratib & sholat berjamaah', icon: HeartHandshake },
        { title: 'Program Sekolah', href: '/program-unggulan/program-sekolah', desc: 'Formal terakreditasi "A" BAN-PDM', icon: GraduationCap },
        { title: 'Program Madin', href: '/program-unggulan/program-madin', desc: 'Madrasah Diniyah maknani turats', icon: BookOpenCheck },
      ],
    },
    {
      id: 'smart-jm',
      title: 'SMART JM',
      subtitle: 'Sains, Bahasa & Al-Qur\'an',
      href: '/smart-jm',
      icon: Cpu,
      color: {
        badgeBg: 'bg-teal-50',
        iconColor: 'text-teal-700',
        border: 'border-teal-200/80',
        activeBg: 'bg-teal-700',
      },
      groups: [
        {
          groupTitle: 'STEM Area',
          icon: Cpu,
          items: [
            { title: 'Materi & Penugasan', href: '/smart-jm/stem/materi', icon: Cpu },
            { title: 'Portofolio Santri', href: '/smart-jm/stem/portofolio', icon: Sparkles },
          ],
        },
        {
          groupTitle: 'Mandarin Class',
          icon: Globe,
          items: [
            { title: 'Materi & Audio', href: '/smart-jm/mandarin/materi', icon: Globe },
            { title: 'Quiz Interaktif', href: '/smart-jm/mandarin/quiz', icon: CheckCircle2 },
          ],
        },
        {
          groupTitle: 'Hafidz Qur\'an',
          icon: BookOpen,
          items: [
            { title: 'Read Qur\'an (30 Juz)', href: '/smart-jm/hafidz/read', icon: BookOpen },
            { title: 'Murojaah Hafalan', href: '/smart-jm/hafidz/murojaah', icon: Volume2 },
          ],
        },
      ],
    },
    {
      id: 'prestasi',
      title: 'Prestasi Santri',
      subtitle: 'Rekam Jejak Kejuaraan',
      href: '/prestasi',
      icon: Trophy,
      color: {
        badgeBg: 'bg-amber-50',
        iconColor: 'text-amber-700',
        border: 'border-amber-200/80',
        activeBg: 'bg-amber-600',
      },
      items: [
        { title: 'Semua Prestasi Santri', href: '/prestasi', desc: 'Galeri panggung juara lengkap', icon: Trophy },
        { title: 'Olimpiade & Sains', href: '/prestasi?kategori=Olimpiade', desc: 'Kompetisi sains & robotika', icon: Award },
        { title: 'Olahraga & Silat', href: '/prestasi?kategori=Olahraga', desc: 'Pencak silat, futsal & panahan', icon: Activity },
        { title: 'Seni & Bahasa', href: '/prestasi?kategori=Seni', desc: 'Kaligrafi, hadrah & pidato santri', icon: Palette },
        { title: 'Keagamaan & MQK', href: '/prestasi?kategori=Keagamaan', desc: 'Musabaqah Kitab Kuning & Tahfidz', icon: BookOpen },
        { title: 'Umum & Riset', href: '/prestasi?kategori=Umum', desc: 'Karya inovatif & penghargaan umum', icon: Sparkles },
      ],
    },
    {
      id: 'ekskul',
      title: 'Ekstrakurikuler',
      subtitle: 'Minat, Bakat & Kepribadian',
      href: '/ekstrakurikuler',
      icon: Sparkles,
      color: {
        badgeBg: 'bg-purple-50',
        iconColor: 'text-purple-700',
        border: 'border-purple-200/80',
        activeBg: 'bg-purple-700',
      },
      items: [
        { title: 'Katalog Semua Ekskul', href: '/ekstrakurikuler', desc: 'Pengembangan minat bakat santri', icon: Sparkles },
        { title: 'Sains & Robotik', href: '/ekstrakurikuler?kategori=sains', desc: 'Robotika, IoT & sains club', icon: Cpu },
        { title: 'Seni & Bahasa', href: '/ekstrakurikuler?kategori=seni', desc: 'Hadrah banjari, kaligrafi, bahasa asing', icon: Palette },
        { title: 'Olahraga & Bela Diri', href: '/ekstrakurikuler?kategori=olahraga', desc: 'Pencak Silat Pagar Nusa & futsal', icon: Activity },
        { title: 'Kepanduan & Agama', href: '/ekstrakurikuler?kategori=kepanduan', desc: 'Pramuka santri & kajian tilawah', icon: Users },
      ],
    },
    {
      id: 'osis',
      title: 'OSIS Santri',
      subtitle: 'Organisasi Kepemimpinan Santri',
      href: '/osis',
      icon: OsisIcon,
      color: {
        badgeBg: 'bg-amber-50',
        iconColor: 'text-amber-700',
        border: 'border-amber-200/80',
        activeBg: 'bg-amber-500',
      },
      items: [
        { title: 'Struktur Pengurus', href: '/osis', desc: 'Bagan & hierarki kabinet santri', icon: Users },
        { title: 'Program Kerja', href: '/osis?tab=program', desc: '5 departemen & program kerja terpadu', icon: Sparkles },
        { title: 'Event & Berita', href: '/osis?tab=event', desc: 'Press release & warta kegiatan OSIS', icon: CalendarDays },
      ],
    },
    {
      id: 'jm-news',
      title: 'JM News',
      subtitle: 'Warta & Siaran Pers Resmi',
      href: '/jm-news',
      icon: Newspaper,
      color: {
        badgeBg: 'bg-sky-50',
        iconColor: 'text-sky-700',
        border: 'border-sky-200/80',
        activeBg: 'bg-sky-600',
      },
      items: [
        { title: 'JM News', href: '/jm-news', desc: 'Siaran pers resmi, foto & deskripsi liputan', icon: Newspaper },
      ],
    },
    {
      id: 'galeri',
      title: 'Galeri Multimedia',
      subtitle: 'Dokumentasi Foto & Video',
      href: '/galeri',
      icon: Images,
      color: {
        badgeBg: 'bg-rose-50',
        iconColor: 'text-rose-700',
        border: 'border-rose-200/80',
        activeBg: 'bg-rose-700',
      },
      items: [
        { title: 'Galeri Foto Kegiatan', href: '/galeri/foto', desc: 'Asrama & aktivitas santri', icon: Camera },
        { title: 'Video Dokumenter Resmi', href: '/galeri/video', desc: 'Liputan profil & acara pondok', icon: Video },
      ],
    },
    {
      id: 'agenda',
      title: 'Karya Siswa',
      subtitle: 'Inovasi, Riset & Portofolio',
      href: '/karya-siswa',
      icon: Sparkles,
      color: {
        badgeBg: 'bg-emerald-50',
        iconColor: 'text-[#0d4a28]',
        border: 'border-emerald-300/80',
        activeBg: 'bg-[#0f5132]',
      },
      items: [
        { title: 'Karya & Portofolio Santri', href: '/karya-siswa', desc: 'Inovasi teknologi, literasi & seni kreatif', icon: Sparkles },
      ],
    },
  ];

  const isCurrentActive = (categoryHref: string) => {
    if (categoryHref === '/agenda' || categoryHref === '/karya-siswa') {
      return location.pathname.startsWith('/agenda') || location.pathname.startsWith('/karya-siswa');
    }
    if (categoryHref === '/prestasi') return location.pathname === '/prestasi';
    if (categoryHref === '/ekskul') return location.pathname === '/ekskul';
    if (categoryHref === '/osis') return location.pathname === '/osis';
    if (categoryHref === '/jm-news' || categoryHref === '/jm-news/agenda-bulanan' || categoryHref === '/berita' || categoryHref === '/#warta-berita') {
      return location.pathname.startsWith('/jm-news') || location.pathname.startsWith('/berita') || location.hash === '#warta-berita';
    }
    if (categoryHref === '/galeri') return location.pathname.startsWith('/galeri');
    if (categoryHref === '/jm-center') return location.pathname.startsWith('/jm-center');
    if (categoryHref === '/program-unggulan') return location.pathname.startsWith('/program-unggulan');
    if (categoryHref === '/smart-jm') return location.pathname.startsWith('/smart-jm') || location.pathname.startsWith('/stem');
    return location.pathname === categoryHref;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Sidebar Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-[320px] xs:max-w-[340px] sm:max-w-sm bg-white h-full shadow-[0_25px_60px_rgba(0,0,0,0.35)] flex flex-col z-10 overflow-hidden"
          >
            {/* Header: Royal Emerald & Gold Gradient */}
            <div className="relative p-4 sm:p-5 bg-gradient-to-br from-[#0a4825] via-[#0f5132] to-[#126b3c] text-white overflow-hidden shrink-0">
              {/* Subtle Islamic Motif Glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#d4af37]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-[#d4af37] via-white to-[#d4af37] shadow-md shrink-0">
                    <img
                      src="/logo.jpg"
                      alt="Logo Pondok Pesantren Jauharul Maknuun"
                      className="w-full h-full object-cover rounded-full bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                      }}
                    />
                  </div>
                  <div className="leading-tight">
                    <h3 className="font-black text-sm text-white tracking-tight uppercase">
                      Jauharul Maknuun
                    </h3>
                    <p className="text-[11px] text-[#ffdd6b] font-bold">
                      Lasem Sidayu Gresik
                    </p>
                  </div>
                </div>

                {/* Close Button: 44x44px Touch Target */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5 stroke-[2.4]" />
                </button>
              </div>

              {/* Status Pill */}
              <div className="mt-3.5 flex items-center justify-between text-[11px] font-semibold text-emerald-100/90 pt-2 border-t border-emerald-600/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffcc00] animate-pulse" />
                  Menu Navigasi Portal
                </span>
                <span className="text-[10px] uppercase font-bold text-[#ffd700] tracking-wider">
                  9 Pilar Terpadu
                </span>
              </div>
            </div>

            {/* Menu List: 9 Harmonized Pillars */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = isCurrentActive(cat.href);
                const hasSub = !!cat.items || !!cat.groups;
                const isExpanded = expandedId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isActive
                        ? 'border-emerald-600/60 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Category Header Row */}
                    <div className="flex items-center justify-between p-2">
                      <Link
                        to={cat.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 flex-1 min-w-0 py-1 px-1 rounded-xl group"
                      >
                        {/* Colorful Android Badge */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                            isActive
                              ? `${cat.color.activeBg} text-white shadow-xs`
                              : `${cat.color.badgeBg} ${cat.color.iconColor} ${cat.color.border}`
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                        </div>

                        {/* Title and Subtitle */}
                        <div className="min-w-0 flex-1 leading-snug">
                          <p
                            className={`text-[13.5px] xs:text-[14px] font-black tracking-tight truncate ${
                              isActive ? 'text-emerald-900' : 'text-slate-800 group-hover:text-emerald-800'
                            }`}
                          >
                            {cat.title}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-medium truncate">
                            {cat.subtitle}
                          </p>
                        </div>
                      </Link>

                      {/* Expand Toggle Button if Sub-items exist */}
                      {hasSub ? (
                        <button
                          type="button"
                          onClick={() => toggleExpand(cat.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                          aria-label={`Buka Sub-menu ${cat.title}`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-emerald-700' : ''
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          to={cat.href}
                          onClick={onClose}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-700 shrink-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>

                    {/* Sub-menu Accordion (Collapsible) */}
                    <AnimatePresence>
                      {hasSub && isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-2.5 pb-2.5 pt-0.5 space-y-1 border-t border-slate-100 bg-slate-50/60"
                        >
                          {/* Standard Items */}
                          {cat.items &&
                            cat.items.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = location.pathname === sub.href;

                              return (
                                <Link
                                  key={sub.href}
                                  to={sub.href}
                                  onClick={onClose}
                                  className={`flex items-center justify-between p-2 rounded-xl text-[12.5px] xs:text-[13px] font-bold transition-all ${
                                    isSubActive
                                      ? 'bg-emerald-700 text-white shadow-xs'
                                      : 'text-slate-700 hover:bg-white hover:text-emerald-900 shadow-2xs hover:shadow-xs'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <SubIcon
                                      className={`w-3.5 h-3.5 shrink-0 ${
                                        isSubActive ? 'text-white' : 'text-slate-400'
                                      }`}
                                    />
                                    <span className="truncate">{sub.title}</span>
                                  </div>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 shrink-0 opacity-60 ${
                                      isSubActive ? 'text-white' : ''
                                    }`}
                                  />
                                </Link>
                              );
                            })}

                          {/* Grouped Items (SMART JM) */}
                          {cat.groups && (
                            <div className="space-y-2 pt-1">
                              {cat.groups.map((group) => {
                                const GroupIcon = group.icon;
                                return (
                                  <div
                                    key={group.groupTitle}
                                    className="p-2 rounded-xl bg-white border border-slate-200/70 space-y-1"
                                  >
                                    <div className="flex items-center gap-1.5 px-1 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                                      <GroupIcon className="w-3 h-3 text-emerald-600" />
                                      <span>{group.groupTitle}</span>
                                    </div>
                                    {group.items.map((item) => {
                                      const isGroupItemActive = location.pathname === item.href;
                                      return (
                                        <Link
                                          key={item.href}
                                          to={item.href}
                                          onClick={onClose}
                                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold transition-colors ${
                                            isGroupItemActive
                                              ? 'bg-emerald-700 text-white'
                                              : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-900'
                                          }`}
                                        >
                                          <span className="truncate">{item.title}</span>
                                          <ChevronRight
                                            className={`w-3 h-3 opacity-50 ${
                                              isGroupItemActive ? 'text-white' : ''
                                            }`}
                                          />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer Action Links: WhatsApp, Medsos, SPMB, Admin */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50 space-y-2 shrink-0 pb-safe">
              <Link
                to="/spmb"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs min-h-[40px] transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>SPMB - Penerimaan Murid Baru 2026/2027</span>
              </Link>

              <a
                href="https://wa.me/6285646199273?text=Assalamualaikum,%20saya%20ingin%20konsultasi%20mengenai%20Pondok%20Pesantren%20Jauharul%20Maknuun."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 min-h-[40px] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-800" />
                <span>WhatsApp Admin (+62 856-4619-9273)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('open-medsos-modal'));
                }}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/60 min-h-[40px] transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>Kanal Komunikasi &amp; Medsos Resmi (7 Kanal)</span>
              </button>

              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 min-h-[40px] transition-colors"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Panel Pengurus &amp; Admin</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
