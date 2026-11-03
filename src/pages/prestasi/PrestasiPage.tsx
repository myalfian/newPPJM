import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Activity,
  Palette,
  BookOpen,
  Sparkles
} from 'lucide-react';
import '../../components/common/NavBarTabs.css';
import { PrestasiCard } from './PrestasiCard';
import { PrestasiLightboxModal } from './PrestasiLightboxModal';
import { PRESTASI_DATASET } from './prestasiData';
import { PrestasiItem, PrestasiCategory } from './types';
import { supabase } from '../../lib/supabase';
import { useCachedQuery, invalidateCache } from '../../lib/queryCache';

const PRESTASI_TABS: {
  id: PrestasiCategory;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'Olimpiade', label: 'Sains & Olimpiade', shortLabel: 'Sains', icon: Award },
  { id: 'Olahraga', label: 'Olahraga & Silat', shortLabel: 'Olahraga', icon: Activity },
  { id: 'Seni', label: 'Seni & Kaligrafi', shortLabel: 'Seni', icon: Palette },
  { id: 'Keagamaan', label: 'MQK & Tahfidz', shortLabel: 'Keagamaan', icon: BookOpen },
  { id: 'Umum', label: 'Prestasi Umum', shortLabel: 'Umum', icon: Sparkles },
];

const fetchAchievementsFromDb = async (): Promise<PrestasiItem[]> => {
  try {
    const { data, error } = await (supabase.from('prestasi' as any) as any)
      .select('*')
      .order('order_index', { ascending: true })
      .order('year', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Error fetching prestasi, fallback to local dataset:', error);
      return PRESTASI_DATASET;
    }

    return data
      .filter((item: any) => item.is_active !== false && item.is_published !== false)
      .map((item: any) => {
        let category: PrestasiCategory = 'Umum';
        const catLower = (item.category || '').toLowerCase();
        if (catLower.includes('olimpiade') || catLower.includes('stem') || catLower.includes('robotika') || catLower.includes('sains')) category = 'Olimpiade';
        else if (catLower.includes('olahraga') || catLower.includes('silat') || catLower.includes('futsal')) category = 'Olahraga';
        else if (catLower.includes('seni') || catLower.includes('kaligrafi') || catLower.includes('hadrah') || catLower.includes('banjari') || catLower.includes('singing') || catLower.includes('bahasa')) category = 'Seni';
        else if (catLower.includes('kitab') || catLower.includes('mqk') || catLower.includes('tahfidz') || catLower.includes('quran') || catLower.includes('agama') || catLower.includes('dakwah') || catLower.includes("da'i") || catLower.includes('ceramah')) category = 'Keagamaan';

        let tingkat: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten' = 'Provinsi';
        const levelLower = `${item.level || ''} ${item.title || ''}`.toLowerCase();
        if (levelLower.includes('internasional')) tingkat = 'Internasional';
        else if (levelLower.includes('nasional') || levelLower.includes('nusantara')) tingkat = 'Nasional';
        else if (levelLower.includes('provinsi') || levelLower.includes('jawa timur') || levelLower.includes('jatim')) tingkat = 'Provinsi';
        else if (levelLower.includes('kabupaten') || levelLower.includes('gresik') || levelLower.includes('surabaya')) tingkat = 'Kabupaten';

        return {
          id: item.id,
          title: item.title,
          category,
          tingkat,
          year: Number(item.year) || new Date().getFullYear(),
          winner_name: item.santri_name || item.winner_name || 'Santri Berprestasi',
          winner_class: item.pembina_name ? `Pembina: ${item.pembina_name}` : 'SMP Plus JM',
          medal_type: item.level ? `Tingkat ${item.level}` : 'Prestasi Santri',
          event_name: item.organizer || 'Kompetisi Resmi Santri',
          organizer: item.organizer || 'Kemenag / Puspresnas / Panitia Resmi',
          certificate_url: item.certificate_url || item.photo_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
          photo_url: item.photo_url || item.certificate_url || undefined,
          description: item.description || '',
          tags: [category, tingkat],
        };
      });
  } catch (err) {
    console.warn('Failed to fetch prestasi, fallback to local dataset:', err);
    return PRESTASI_DATASET;
  }
};

export const PrestasiPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('kategori');

  const { data: achievements = [], refetch } = useCachedQuery<PrestasiItem[]>(
    'prestasi_modular_dataset',
    fetchAchievementsFromDb,
    []
  );

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      invalidateCache('prestasi_modular_dataset');
      refetch();
    };
    window.addEventListener('ppjm-content-updated', handleUpdate);

    const channel = supabase
      .channel('public-prestasi-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prestasi' }, () => {
        invalidateCache('prestasi_modular_dataset');
        refetch();
      })
      .subscribe();

    return () => {
      window.removeEventListener('ppjm-content-updated', handleUpdate);
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const mapUrlToCategory = (val: string | null): PrestasiCategory => {
    if (!val) return 'Olimpiade';
    const lower = val.toLowerCase();
    if (lower === 'sains' || lower === 'olimpiade') return 'Olimpiade';
    if (lower === 'olaraga' || lower === 'olahraga') return 'Olahraga';
    if (lower === 'seni') return 'Seni';
    if (lower === 'agama' || lower === 'keagamaan') return 'Keagamaan';
    if (lower === 'umum') return 'Umum';
    return 'Olimpiade';
  };

  const initialCategory: PrestasiCategory = useMemo(() => {
    return mapUrlToCategory(urlCategory);
  }, [urlCategory]);

  const [selectedCategory, setSelectedCategory] = useState<PrestasiCategory>(initialCategory);
  const [activeModalItem, setActiveModalItem] = useState<PrestasiItem | null>(null);

  useEffect(() => {
    setSelectedCategory(mapUrlToCategory(urlCategory));
  }, [urlCategory]);

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

  const handleSelectCategory = (cat: PrestasiCategory) => {
    setSelectedCategory(cat);
    if (cat === 'Semua') {
      searchParams.delete('kategori');
    } else {
      const queryMap: Record<PrestasiCategory, string> = {
        Semua: '',
        Olimpiade: 'Sains',
        Olahraga: 'Olahraga',
        Seni: 'Seni',
        Keagamaan: 'Agama',
        Umum: 'Umum',
      };
      searchParams.set('kategori', queryMap[cat] || cat);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Filtered dataset by category
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      return selectedCategory === 'Semua' || item.category === selectedCategory;
    });
  }, [achievements, selectedCategory]);

  return (
    <div className="bg-slate-50 min-h-screen pb-4">
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-3.5 sm:py-5 px-3 sm:px-4 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-widest shadow-2xs">
            <Trophy className="w-3 h-3 text-[#C8A951]" />
            <span>Etalase Juara &amp; Rekam Prestasi Santri</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xs">
            Rekam Jejak Prestasi &amp; Kejuaraan Santri
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Dedikasi santri Pondok Pesantren &amp; SMP Plus Jauharul Maknuun dalam menorehkan tinta emas di bidang Musabaqah Qira’atil Kutub, Tahfidzul Qur’an, Olimpiade Sains STEM, Seni Budaya, dan Olahraga.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY CHIP TABS - 25% OVERLAP WITH HERO CONTAINER ABOVE */}
      <section className="max-w-6xl mx-auto px-2.5 sm:px-4 -mt-[11px] sm:-mt-[11.5px] relative z-20 select-none">
        <nav aria-label="Kategori Prestasi" className="curved-navbar-wrapper w-full">
          <div className="curved-navbar-bar w-full">
            <div
              ref={tabListRef}
              className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-1 sm:px-2"
            >
              <ul className="curved-tab-list flex items-center justify-between w-full gap-1 sm:gap-1.5">
                {PRESTASI_TABS.map((tab) => {
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
                            layoutId="prestasiCurvedPointer"
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
                                <radialGradient id="prestasiNotchDotGrad" cx="35%" cy="35%" r="65%">
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
                                fill="url(#prestasiNotchDotGrad)"
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
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredAchievements.map((item) => (
              <PrestasiCard
                key={item.id}
                item={item}
                onOpenModal={setActiveModalItem}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Tidak Ada Prestasi yang Cocok</h3>
            <p className="text-xs text-slate-400">Tidak ditemukan data prestasi untuk kategori ini. Silakan pilih kategori prestasi lainnya.</p>
            <button
              type="button"
              onClick={() => handleSelectCategory('Olimpiade')}
              className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#0E7A4C] text-white font-bold text-xs hover:bg-[#095736] cursor-pointer"
            >
              Tampilkan Sains &amp; Olimpiade
            </button>
          </div>
        )}
      </main>

      {/* 4. Detail Modal */}
      <PrestasiLightboxModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
};

export default PrestasiPage;
