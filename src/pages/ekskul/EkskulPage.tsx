import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Search,
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

    if (error || !data || data.length === 0) {
      return EKSKUL_DATASET;
    }

    // Merge Supabase entries with default gallery dataset
    return data.map((item) => {
      const existing = EKSKUL_DATASET.find((d) => d.id === item.id || d.name === item.name);
      return {
        id: item.id,
        name: item.name,
        category: ((item as any).category as any) || existing?.category || 'Sains & Teknologi',
        schedule: item.schedule || existing?.schedule || 'Jadwal Mingguan',
        coach: item.mentor_name || existing?.coach || 'Pembina PPJM',
        description: item.description || existing?.description || '',
        featuredPhoto: item.cover_image || existing?.featuredPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        gallery: existing?.gallery || [],
        highlights: existing?.highlights || ['Latihan rutin terstruktur', 'Pembinaan karakter mandiri'],
        targetCapaian: existing?.targetCapaian,
        tempatLatihan: existing?.tempatLatihan
      };
    });
  } catch {
    return EKSKUL_DATASET;
  }
};

export const EkskulPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategoryParam = searchParams.get('kategori');

  const { data: ekskuls } = useCachedQuery<DetailedEkskulItem[]>(
    'ekskul_dataset_modular',
    fetchEkskulsData,
    EKSKUL_DATASET
  );

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
  const [searchQuery, setSearchQuery] = useState<string>('');
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

      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [ekskuls, selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 space-y-2.5 sm:space-y-3.5 overflow-x-hidden select-none">
      {/* 1. Folder-style Navigation Breadcrumb */}
      <NavBarTabs
        activeTabId={currentTabId}
        onChangeTab={handleNavBarTabChange}
      />

      {/* 2. Hero Header Banner (Modern Lux Royal Indigo & Violet Styling) */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#0f172a] border border-purple-500/30 p-3.5 sm:p-5 lg:p-6 text-white shadow-lg shadow-purple-950/20">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Katalog Pengembangan Minat &amp; Bakat Santri</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Ekstrakurikuler Unggulan Santri
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal">
              Wadah eksplorasi potensi santri PP &amp; SMP Plus Jauharul Maknuun dalam mengasah keahlian kepemimpinan, riset teknologi robotika, seni budaya Islam, kepanduan, hingga seni bela diri pencak silat.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 shrink-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-lg sm:text-xl font-black text-[#d4af37]">
                {ekskuls.length}
              </div>
              <div className="text-[10px] sm:text-xs text-purple-200 font-bold mt-0.5">
                Klub Ekskul
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-lg sm:text-xl font-black text-white">
                100%
              </div>
              <div className="text-[10px] sm:text-xs text-purple-200 font-bold mt-0.5">
                Pembina Ahli
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-lg sm:text-xl font-black text-purple-300">
                6 Bidang
              </div>
              <div className="text-[10px] sm:text-xs text-purple-200 font-bold mt-0.5">
                Kategori
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real-time Search Toolbar */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ekstrakurikuler, pembina, atau kegiatan..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 transition-all"
          />
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
          Menampilkan <span className="font-bold text-zinc-800 dark:text-zinc-200">{filteredEkskuls.length}</span> kegiatan ekskul
        </div>
      </div>

      {/* 4. Grid of Ekskul Cards */}
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
        <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h3 className="font-black text-base text-zinc-800 dark:text-zinc-200">
            Ekstrakurikuler Tidak Ditemukan
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Tidak ada kegiatan ekskul yang sesuai dengan kata kunci &quot;{searchQuery}&quot;. Silakan coba kata kunci lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Semua Kategori');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-purple-800 text-white font-bold text-xs hover:bg-purple-900 cursor-pointer"
          >
            Reset Pencarian
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
