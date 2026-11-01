import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Users2,
  Calendar,
  Layers,
  Activity,
  Cpu,
  Palette,
  ShieldCheck,
  Building
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { EkskulCard } from './EkskulCard';
import { EkskulDetailModal } from './EkskulDetailModal';
import { EKSKUL_DATASET } from './ekskulData';
import { DetailedEkskulItem, EkskulCategory } from './types';
import { supabase } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

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

  useEffect(() => {
    // Listen for custom window event when admin updates ekskul
    const handleUpdate = () => {
      refetch();
    };
    window.addEventListener('ppjm-content-updated', handleUpdate);

    // Subscribe to realtime Supabase changes
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

  // Map selected category to exact NavBarTabs tab ID
  const currentTabId = useMemo(() => {
    switch (selectedCategory) {
      case 'Sains & Teknologi':
        return 'ekskul-sains';
      case 'Olahraga & Bela Diri':
        return 'ekskul-olahraga';
      case 'Seni & Bahasa':
        return 'ekskul-seni';
      case 'Agama':
        return 'ekskul-agama';
      case 'Pramuka':
        return 'ekskul-pramuka';
      case 'Semua Kategori':
      default:
        return 'ekskul-semua';
    }
  }, [selectedCategory]);

  const handleNavBarTabChange = (tab: { id: string }) => {
    switch (tab.id) {
      case 'ekskul-sains':
        handleSelectCategory('Sains & Teknologi');
        break;
      case 'ekskul-olahraga':
        handleSelectCategory('Olahraga & Bela Diri');
        break;
      case 'ekskul-seni':
        handleSelectCategory('Seni & Bahasa');
        break;
      case 'ekskul-agama':
        handleSelectCategory('Agama');
        break;
      case 'ekskul-pramuka':
        handleSelectCategory('Pramuka');
        break;
      case 'ekskul-semua':
      default:
        handleSelectCategory('Semua Kategori');
        break;
    }
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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 space-y-2 sm:space-y-2.5 overflow-x-hidden select-none">
      {/* 1. Folder-style Navigation Breadcrumb */}
      <NavBarTabs
        activeTabId={currentTabId}
        onChangeTab={handleNavBarTabChange}
      />

      {/* 2. Hero Header Banner (Modern Lux Royal Indigo & Violet Styling) */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#0f172a] border border-purple-500/30 p-2.5 sm:p-4 lg:p-4.5 text-white shadow-md shadow-purple-950/20 card-hover-smooth">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3.5">
          <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[10.5px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Program Pengembangan Bakat, Minat, dan Kepemimpinan Santri</span>
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Ekstrakurikuler (Ekskul) Santri
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal">
              Wadah eksplorasi bakat, minat, dan kepemimpinan santri PP &amp; SMP Plus Jauharul Maknuun dalam mengasah keahlian riset teknologi robotika, seni budaya Islam, bahasa internasional, kepanduan, hingga seni bela diri pencak silat.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 shrink-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-base sm:text-lg font-black text-[#d4af37]">
                {ekskuls.length}
              </div>
              <div className="text-[9.5px] sm:text-[10px] text-purple-200 font-bold mt-0.5">
                Klub Kegiatan
              </div>
            </div>

            <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-base sm:text-lg font-black text-white">
                100%
              </div>
              <div className="text-[9.5px] sm:text-[10px] text-purple-200 font-bold mt-0.5">
                Pembina Ahli
              </div>
            </div>

            <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-base sm:text-lg font-black text-purple-300">
                6 Bidang
              </div>
              <div className="text-[9.5px] sm:text-[10px] text-purple-200 font-bold mt-0.5">
                Kategori
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grid of Ekskul Cards */}
      {filteredEkskuls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
          {filteredEkskuls.map((item) => (
            <EkskulCard
              key={item.id}
              item={item}
              onOpenDetail={setActiveDetailItem}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h3 className="font-black text-base text-zinc-800 dark:text-zinc-200">
            Ekstrakurikuler Tidak Ditemukan
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Tidak ada kegiatan ekskul untuk kategori ini. Silakan pilih kategori ekskul lainnya.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory('Semua Kategori')}
            className="px-4 py-2 rounded-xl bg-purple-800 text-white font-bold text-xs hover:bg-purple-900 cursor-pointer"
          >
            Tampilkan Semua Kategori
          </button>
        </div>
      )}

      {/* 5. Detail & Multi-Photo Gallery Modal */}
      <EkskulDetailModal
        item={activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
      />
    </div>
  );
};
