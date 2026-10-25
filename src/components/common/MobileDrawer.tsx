import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  BookOpen,
  Sparkles,
  Trophy,
  Images,
  User,
  ChevronRight,
  Cpu,
  Layers,
  GraduationCap,
  Calendar
} from 'lucide-react';

interface DrawerSubGroup {
  groupTitle: string;
  items: { label: string; to: string }[];
}

interface DrawerSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: { label: string; to: string }[];
  groups?: DrawerSubGroup[];
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sections: DrawerSection[] = [
    {
      title: '1. JM Center',
      icon: Compass,
      items: [
        { label: 'Sambutan', to: '/jm-center/sambutan' },
        { label: 'Sejarah', to: '/jm-center/sejarah' },
        { label: 'Visi Misi', to: '/jm-center/visi-misi' },
        { label: 'Lembaga', to: '/jm-center/lembaga' },
      ],
    },
    {
      title: '2. Program',
      icon: GraduationCap,
      items: [
        { label: 'Amaliyah Pondok', to: '/program-unggulan/amaliyah-pondok' },
        { label: 'Program Sekolah', to: '/program-unggulan/program-sekolah' },
        { label: 'Program Madin', to: '/program-unggulan/program-madin' },
      ],
    },
    {
      title: '3. SMART JM',
      icon: Cpu,
      groups: [
        {
          groupTitle: 'STEM Area',
          items: [
            { label: 'Materi dan Penugasan', to: '/smart-jm/stem/materi' },
            { label: 'Portofolio Siswa', to: '/smart-jm/stem/portofolio' },
          ],
        },
        {
          groupTitle: 'Mandarin Class',
          items: [
            { label: 'Materi', to: '/smart-jm/mandarin/materi' },
            { label: 'Quiz', to: '/smart-jm/mandarin/quiz' },
          ],
        },
        {
          groupTitle: 'Hafidz Quran',
          items: [
            { label: 'Read Quran', to: '/smart-jm/hafidz/read' },
            { label: 'Murojaah', to: '/smart-jm/hafidz/murojaah' },
          ],
        },
      ],
    },
    {
      title: '4. Prestasi & 5. Ekskul',
      icon: Trophy,
      items: [
        { label: 'Prestasi', to: '/prestasi' },
        { label: 'Ekskul', to: '/ekskul' },
      ],
    },
    {
      title: '6. Galeri',
      icon: Images,
      items: [
        { label: 'Foto', to: '/galeri/foto' },
        { label: 'Video', to: '/galeri/video' },
      ],
    },
    {
      title: '7. Agenda Program',
      icon: Calendar,
      items: [
        { label: 'Jadwal Agenda Bulanan', to: '/agenda' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="PPJM Logo" 
                  className="w-10 h-10 object-cover rounded-full bg-white shadow-xs border border-emerald-500/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                  }} 
                />
                <div>
                  <h3 className="font-extrabold text-sm text-[#0d4a28] leading-tight">PP Jauharul Maknuun</h3>
                  <p className="text-[11px] text-[#d4af37] font-bold">Lasem Sidayu Gresik</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div key={sec.title} className="space-y-2">
                    <div className="flex items-center gap-2 px-2 text-xs font-black text-emerald-800 uppercase tracking-wider">
                      <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{sec.title}</span>
                    </div>

                    {/* Standard Items */}
                    {sec.items && (
                      <div className="space-y-1">
                        {sec.items.map((item) => {
                          const active = location.pathname === item.to;
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={onClose}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl min-h-[44px] text-xs font-bold transition-colors ${
                                active
                                  ? 'bg-[#0f5132] text-white shadow-sm'
                                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                              }`}
                            >
                              <span>{item.label}</span>
                              <ChevronRight className={`w-4 h-4 opacity-50 ${active ? 'text-white' : ''}`} />
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Sub-group Accordion (for SMART JM) */}
                    {sec.groups && (
                      <div className="space-y-2 pl-2">
                        {sec.groups.map((group) => (
                          <div key={group.groupTitle} className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-200/60 space-y-1">
                            <div className="text-[10.5px] font-extrabold uppercase text-slate-500 tracking-wider px-2 pt-0.5">
                              {group.groupTitle}
                            </div>
                            <div className="space-y-1">
                              {group.items.map((subItem) => {
                                const active = location.pathname === subItem.to;
                                return (
                                  <Link
                                    key={subItem.to}
                                    to={subItem.to}
                                    onClick={onClose}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                                      active
                                        ? 'bg-[#0f5132] text-white shadow-xs'
                                        : 'text-slate-700 hover:bg-white hover:text-emerald-800'
                                    }`}
                                  >
                                    <span>{subItem.label}</span>
                                    <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${active ? 'text-white' : ''}`} />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2 pb-safe">
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 min-h-[44px] transition-colors"
              >
                <User className="w-4 h-4 text-emerald-800" />
                <span>Panel Admin Pesantren</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
