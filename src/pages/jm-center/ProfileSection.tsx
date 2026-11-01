import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Quote,
  Landmark,
  Star,
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';

interface ProfileSectionProps {
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'all';
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ defaultSection = 'all' }) => {
  const location = useLocation();
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'sambutan' | 'sejarah' | 'visi-misi'>(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah' || defaultSection === 'sejarah') return 'sejarah';
    if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi' || defaultSection === 'visi-misi') return 'visi-misi';
    if (hash.includes('sambutan') || path.includes('sambutan') || secParam === 'sambutan' || defaultSection === 'sambutan') return 'sambutan';
    return 'all';
  });

  // Handle smooth scroll when navigating via hash or tab click
  const scrollToId = (id: string) => {
    setActiveSubTab(id as any);
    if (typeof window === 'undefined') return;
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    let targetId = '';
    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah' || defaultSection === 'sejarah') {
      targetId = 'sejarah';
    } else if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi' || defaultSection === 'visi-misi') {
      targetId = 'visi-misi';
    } else if (hash.includes('sambutan') || path.includes('sambutan') || secParam === 'sambutan' || defaultSection === 'sambutan') {
      targetId = 'sambutan';
    }

    if (targetId) {
      setActiveSubTab(targetId as any);
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const yOffset = -90;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash, location.search, defaultSection]);

  const subNavItems = [
    { id: 'all', label: 'Semua Profil', icon: Sparkles },
    { id: 'sambutan', label: 'Sambutan Pimpinan', icon: Quote },
    { id: 'sejarah', label: 'Sejarah & Linimasa', icon: Landmark },
    { id: 'visi-misi', label: 'Visi & Misi Lembaga', icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Sub-Navigator Pill Bar: Fast Jump to Sections */}
      <div className="sticky top-16 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md py-2.5 px-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          {subNavItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-emerald-600" />
          <span>Profil Lengkap PPJM</span>
        </div>
      </div>

      {/* 2. Sambutan Pimpinan & Pengasuh Section */}
      <section id="sambutan" className="scroll-mt-28">
        <SambutanSection />
      </section>

      {/* Separator Accent */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-emerald-300/40 dark:border-emerald-800/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-zinc-900 px-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 py-0.5">
            <Landmark className="w-3 h-3 text-amber-500" />
            Napak Tilas Dakwah
          </span>
        </div>
      </div>

      {/* 3. Sejarah & Linimasa Pesantren */}
      <section id="sejarah" className="scroll-mt-28">
        <SejarahSection />
      </section>

      {/* Separator Accent */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-emerald-300/40 dark:border-emerald-800/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-zinc-900 px-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 py-0.5">
            <Star className="w-3 h-3 text-amber-500" />
            Visi, Misi &amp; Nilai
          </span>
        </div>
      </div>

      {/* 4. Visi & Misi Lembaga */}
      <section id="visi-misi" className="scroll-mt-28">
        <VisiMisiSection />
      </section>
    </div>
  );
};

export default ProfileSection;
