import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Activity,
  Cpu,
  Palette,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import '../../components/common/NavBarTabs.css';
import { EkskulCard } from './EkskulCard';
import { EkskulDetailModal } from './EkskulDetailModal';
import { DetailedEkskulItem, EkskulCategory } from './types';
import { supabase } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

const EKSKUL_TABS: {
  id: EkskulCategory;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'Semua Kategori', label: 'Semua Ekskul', shortLabel: 'Semua', icon: Layers },
  { id: 'Sains & Teknologi', label: 'Sains & Robotik', shortLabel: 'Sains', icon: Cpu },
  { id: 'Olahraga & Bela Diri', label: 'Olahraga & Silat', shortLabel: 'Olahraga', icon: Activity },
  { id: 'Seni & Bahasa', label: 'Seni & Bahasa', shortLabel: 'Seni', icon: Palette },
  { id: 'Agama', label: 'Keagamaan & Tilawah', shortLabel: 'Agama', icon: BookOpen },
  { id: 'Pramuka', label: 'Pramuka & Kepanduan', shortLabel: 'Pramuka', icon: ShieldCheck },
];

const fetchEkskulsData = async (): Promise<DetailedEkskulItem[]> => {
  try {
    const { data, error } = await supabase
      .from('extracurriculars')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.warn('Error fetching extracurriculars:', error);
      return [];
    }

    return data.map((rawItem: any) => {
      const item = rawItem;
      let category: EkskulCategory = 'Sains & Teknologi';
      const catLower = (item.category || '').toLowerCase();
      const nameLower = (item.name || '').toLowerCase();

      if (catLower.includes('olahraga') || nameLower.includes('silat') || nameLower.includes('olahraga') || nameLower.includes('futsal')) {
        category = 'Olahraga & Bela Diri';
      } else if (catLower.includes('seni') || nameLower.includes('hadrah') || nameLower.includes('banjari') || nameLower.includes('bahasa') || nameLower.includes('mandarin') || nameLower.includes('arab')) {
        category = 'Seni & Bahasa';
      } else if (catLower.includes('agama') || nameLower.includes('quran') || nameLower.includes('tahfidz')) {
        category = 'Agama';
      } else if (catLower.includes('pramuka') || nameLower.includes('pramuka') || nameLower.includes('pmr') || nameLower.includes('palang merah')) {
        category = 'Pramuka';
      } else if (catLower.includes('sains') || nameLower.includes('stem') || nameLower.includes('robot')) {
        category = 'Sains & Teknologi';
      }

      return {
        id: item.id,
        name: item.name,
        category,
        schedule: item.schedule || 'Jadwal Mingguan',
        coach: item.coach || item.mentor_name || 'Pembina PPJM',
        description: item.description || '',
        featuredPhoto: item.cover_image || item.photo_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        highlights: ['Pembinaan rutin terstruktur', 'Karakter santri mandiri & berprestasi'],
        targetCapaian: 'Penguasaan keterampilan & partisipasi lomba resmi',
        tempatLatihan: item.location || 'Area Kampus PPJM'
      };
    });
  } catch (err) {
    console.warn('Failed to fetch extracurriculars:', err);
    return [];
  }
};

export const EkskulPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategoryParam = searchParams.get('kategori');

  const { data: ekskuls = [], refetch } = useCachedQuery<DetailedEkskulItem[]>(
    'ekskul_dataset_modular',
    fetchEkskulsData,
    []
  );

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };
    window.addEventListener('ppjm-content-updated', handleUpdate);

    const channel = supabase
      .channel('public-ekskul-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'extracurriculars' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ekskul' }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      window.removeEventListener('ppjm-content-updated', handleUpdate);
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Map URL param to category
  const parseCategoryParam = (param: string | null): EkskulCategory => {
    if (!param) return 'Semua Kategori';
    const p = param.toLowerCase();
    if (p.includes('sains') || p.includes('robotik') || p.includes('stem')) return 'Sains & Teknologi';
    if (p.includes('olahraga') || p.includes('silat') || p.includes('bela diri')) return 'Olahraga & Bela Diri';
    if (p.includes('seni') || p.includes('bahasa') || p.includes('arab') || p.includes('mandarin')) return 'Seni & Bahasa';
    if (p.includes('agama') || p.includes('keagamaan') || p.includes('tilawah') || p.includes('tahfidz')) return 'Agama';
    if (p.includes('pramuka') || p.includes('kepanduan')) return 'Pramuka';
    return 'Semua Kategori';
  };

  const [selectedCategory, setSelectedCategory] = useState<EkskulCategory>(() =>
    parseCategoryParam(urlCategoryParam)
  );
  const [activeDetailItem, setActiveDetailItem] = useState<DetailedEkskulItem | null>(null);

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(parseCategoryParam(urlCategoryParam));
  }, [urlCategoryParam]);

  // Auto-center active tab on mobile viewport
  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const container = tabListRef.current;
      const activeEl = activeTabRef.current;
      const scrollLeft =
        activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [selectedCategory]);

  const handleSelectCategory = (cat: EkskulCategory) => {
    setSelectedCategory(cat);
    if (cat === 'Semua Kategori') {
      searchParams.delete('kategori');
    } else if (cat === 'Sains & Teknologi') {
      searchParams.set('kategori', 'sains');
    } else if (cat === 'Olahraga & Bela Diri') {
      searchParams.set('kategori', 'olahraga');
    } else if (cat === 'Seni & Bahasa') {
      searchParams.set('kategori', 'seni');
    } else if (cat === 'Agama') {
      searchParams.set('kategori', 'agama');
    } else if (cat === 'Pramuka') {
      searchParams.set('kategori', 'pramuka');
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Filtered ekskuls
  const filteredEkskuls = useMemo(() => {
    return ekskuls.filter((item) => {
      let matchCategory = selectedCategory === 'Semua Kategori';
      if (!matchCategory) {
        if (selectedCategory === 'Agama') {
          matchCategory = item.id === 'tahfidz-tilawah' || item.name.toLowerCase().includes('qur') || item.category === 'Agama' || (item.category === 'Kepanduan & Keagamaan' && item.id !== 'pramuka');
        } else if (selectedCategory === 'Pramuka') {
          matchCategory = item.id === 'pramuka' || item.name.toLowerCase().includes('pramuka') || item.category === 'Pramuka';
        } else {
          matchCategory = item.category === selectedCategory;
        }
      }

      return matchCategory;
    });
  }, [ekskuls, selectedCategory]);

  return (
    <div className="bg-slate-50 min-h-screen pb-4">
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-3.5 sm:py-5 px-3 sm:px-4 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#C8A951]" />
            <span>Pengembangan Bakat, Minat &amp; Kepemimpinan Santri</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xs">
            Ekstrakurikuler (Ekskul) Santri
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Wadah eksplorasi bakat, minat, dan kepemimpinan santri Pondok Pesantren &amp; SMP Plus Jauharul Maknuun: mulai dari riset sains STEM &amp; robotika, pencak silat, seni budaya Islam, bahasa internasional, hingga kepanduan.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY CHIP TABS - HORIZONTALLY DISTRIBUTED WITH WHITE NOTCH BACKGROUND */}
      <section className="max-w-6xl mx-auto px-2.5 sm:px-4 -mt-3.5 sm:-mt-4 relative z-20 select-none">
        <nav aria-label="Kategori Ekstrakurikuler" className="curved-navbar-wrapper w-full">
          <div className="curved-navbar-bar w-full">
            <div
              ref={tabListRef}
              className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-1 sm:px-2"
            >
              <ul className="curved-tab-list flex items-center justify-between w-full gap-1 sm:gap-1.5">
                {EKSKUL_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;

                  return (
                    <li
                      key={tab.id}
                      className="curved-tab-col flex-1 h-full flex items-center justify-center min-w-[110px] sm:min-w-0 snap-start"
                    >
                      <button
                        ref={isActive ? activeTabRef : null}
                        type="button"
                        onClick={() => handleSelectCategory(tab.id)}
                        className={`curved-tab-link w-full bg-transparent border-0 relative flex items-center justify-center cursor-pointer px-1.5 sm:px-2 ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        {/* Animated Sliding Notch Pointer with Pristine White Cutout Notch & Radiant Gold Jewel */}
                        {isActive && (
                          <motion.div
                            layoutId="ekskulCurvedPointer"
                            className="curved-pointer"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 28,
                              mass: 0.58,
                            }}
                          >
                            <svg
                              viewBox="0 0 74 22"
                              className="curved-notch-svg"
                              width="74"
                              height="22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <defs>
                                <radialGradient id="ekskulNotchDotGrad" cx="35%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#fffbeb" />
                                  <stop offset="35%" stopColor="#fde047" />
                                  <stop offset="75%" stopColor="#d97706" />
                                  <stop offset="100%" stopColor="#92400e" />
                                </radialGradient>
                              </defs>
                              {/* Pristine White Cutout Notch Surface matching page background tone */}
                              <path
                                d="M 0 0 C 16 0, 22 18, 37 18 C 52 18, 58 0, 74 0 Z"
                                className="curved-notch-surface"
                                style={{ fill: '#ffffff' }}
                                stroke="none"
                              />
                              {/* Radiant Jewel Gold Floating Indicator */}
                              <circle
                                cx="37"
                                cy="6"
                                r="4.8"
                                fill="url(#ekskulNotchDotGrad)"
                                className="curved-notch-dot"
                                stroke="none"
                              />
                              {/* Specular Gem Reflection */}
                              <circle
                                cx="35.5"
                                cy="4.5"
                                r="1.4"
                                fill="#ffffff"
                                opacity="0.85"
                                stroke="none"
                              />
                            </svg>
                          </motion.div>
                        )}

                        <span className="curved-tab-text !flex-row items-center gap-1.5 whitespace-nowrap font-bold tracking-tight">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isActive ? 'text-[#facc15]' : 'text-emerald-200/80'
                            }`}
                          />
                          <span className="sm:hidden font-extrabold">{tab.shortLabel || tab.label}</span>
                          <span className="hidden sm:inline font-bold">{tab.label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </section>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 pt-2.5 sm:pt-3">
        {filteredEkskuls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredEkskuls.map((item) => (
              <EkskulCard
                key={item.id}
                item={item}
                onOpenDetail={setActiveDetailItem}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Ekstrakurikuler Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400">Tidak ada kegiatan ekskul untuk kategori ini. Silakan pilih kategori ekskul lainnya.</p>
            <button
              type="button"
              onClick={() => handleSelectCategory('Semua Kategori')}
              className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#0E7A4C] text-white font-bold text-xs hover:bg-[#095736] cursor-pointer"
            >
              Tampilkan Semua Kategori
            </button>
          </div>
        )}
      </main>

      {/* 4. Detail Modal */}
      <EkskulDetailModal
        item={activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
      />
    </div>
  );
};

export default EkskulPage;
