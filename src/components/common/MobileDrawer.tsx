import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  BookOpen,
  Sparkles,
  Award,
  Activity,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sections = [
    {
      title: 'JM Center',
      icon: Compass,
      items: [
        { label: 'Sambutan Pengasuh', to: '/jm-center/sambutan' },
        { label: 'Sejarah Pesantren', to: '/jm-center/sejarah' },
        { label: 'Visi & Misi', to: '/jm-center/visi-misi' },
        { label: 'Badan Otonom & Lembaga', to: '/jm-center/lembaga' },
      ],
    },
    {
      title: 'Program Unggulan',
      icon: BookOpen,
      items: [
        { label: 'Amaliyah & Wirid Pondok', to: '/program-unggulan/amaliyah-pondok' },
        { label: 'Program Pendidikan Formal', to: '/program-unggulan/program-sekolah' },
        { label: 'Madrasah Diniyah Salafiyah', to: '/program-unggulan/program-madin' },
      ],
    },
    {
      title: 'Smart JM (Interaktif)',
      icon: Sparkles,
      items: [
        { label: 'Mushaf Al-Qur’an 30 Juz', to: '/smart-jm/hafidz/read' },
        { label: 'Murojaah AI Santri', to: '/smart-jm/hafidz/murojaah' },
        { label: 'STEM Materi & Penugasan', to: '/smart-jm/stem/materi' },
        { label: 'STEM Portofolio Karya', to: '/smart-jm/stem/portofolio' },
        { label: 'Mandarin Materi & Audio', to: '/smart-jm/mandarin/materi' },
        { label: 'Mandarin Kuis Interaktif', to: '/smart-jm/mandarin/quiz' },
      ],
    },
    {
      title: 'Aktivitas & Prestasi',
      icon: Award,
      items: [
        { label: 'Prestasi Santri', to: '/prestasi' },
        { label: 'Ekstrakurikuler', to: '/ekskul' },
        { label: 'Galeri Foto Kegiatan', to: '/galeri/foto' },
        { label: 'Galeri Video Profil', to: '/galeri/video' },
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
                <img src="/logo-ppjm.svg" alt="PPJM Logo" className="w-10 h-10 object-contain rounded-full bg-white shadow-xs" />
                <div>
                  <h3 className="font-bold text-sm text-emerald-900 leading-tight">PP Jauharul Maknuun</h3>
                  <p className="text-xs text-gold-700 font-medium">Lasem Sidayu Gresik</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div key={sec.title} className="space-y-2">
                    <div className="flex items-center gap-2 px-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <Icon className="w-4 h-4 text-emerald-600" />
                      <span>{sec.title}</span>
                    </div>
                    <div className="space-y-1">
                      {sec.items.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={`flex items-center justify-between px-3.5 py-3 rounded-xl min-h-[48px] text-sm font-medium transition-colors ${
                              active
                                ? 'bg-emerald-800 text-white font-semibold'
                                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                            }`}
                          >
                            <span>{item.label}</span>
                            <ChevronRight className={`w-4 h-4 opacity-50 ${active ? 'text-white' : ''}`} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2 pb-safe">
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 min-h-[48px] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Masuk Portal Admin</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
