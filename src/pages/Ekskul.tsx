import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sparkles,
  Search,
  Award,
  Users2,
  Calendar,
  Layers
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { EkskulCategoryFilter } from './ekskul/EkskulCategoryFilter';
import { EkskulCard } from './ekskul/EkskulCard';
import { EkskulDetailModal } from './ekskul/EkskulDetailModal';
import { EKSKUL_DATASET } from './ekskul/ekskulData';
import { DetailedEkskulItem, EkskulCategory } from './ekskul/types';
import { supabase } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';

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

export const Ekskul: React.FC = () => {
  const { data: ekskuls } = useCachedQuery<DetailedEkskulItem[]>(
    'ekskul_dataset_v2',
    fetchEkskulsData,
    EKSKUL_DATASET
  );

  const [selectedCategory, setSelectedCategory] = useState<EkskulCategory>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailItem, setActiveDetailItem] = useState<DetailedEkskulItem | null>(null);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<EkskulCategory, number> = {
      'Semua Kategori': ekskuls.length,
      'Sains & Teknologi': 0,
      'Seni & Bahasa': 0,
      'Olahraga & Bela Diri': 0,
      'Kepanduan & Keagamaan': 0
    };

    ekskuls.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [ekskuls]);

  // Filtered ekskuls
  const filteredEkskuls = useMemo(() => {
    return ekskuls.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [ekskuls, selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-8 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs />

      {/* ========================================================= */}
      {/* HEADER BANNER: MODERN LUXURY PPJM */}
      {/* ========================================================= */}
      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Katalog Minat, Bakat & Kepanduan Santri</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ekstrakurikuler & Talenta Santri
            </h1>
            <p className="mt-2.5 text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Ruang aktualisasi minat, bakat, kebugaran jasmani, dan kreativitas santri Pondok Pesantren Jauharul Maknuun: mulai dari riset sains robotika, seni hadrah banjari, kaligrafi, pencak silat Pagar Nusa, hingga diplomasi bahasa asing.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{ekskuls.length} Pilihan Ekstrakurikuler</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Users2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Pembina Profesional & Berlisensi</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Calendar className="w-4 h-4 text-blue-300 shrink-0" />
              <span>Jadwal Latihan Terstruktur</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SEARCH BOX & STICKY CATEGORY CONTROLLER */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari ekskul, pembina, atau kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Menampilkan <strong>{filteredEkskuls.length}</strong> kegiatan
          </span>
        </div>

        {/* Sticky Category Filter Pills */}
        <EkskulCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* ========================================================= */}
      {/* OVERVIEW SHOWCASE: ADAPTIVE GRID (1 COL MOB, 2 TAB, 3 DSK) */}
      {/* ========================================================= */}
      <main className="min-h-[400px]">
        {filteredEkskuls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredEkskuls.map((item) => (
              <EkskulCard
                key={item.id}
                item={item}
                onOpenDetail={setActiveDetailItem}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <Activity className="w-8 h-8 mx-auto text-zinc-400" />
            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300">
              Tidak ada ekstrakurikuler yang sesuai kriteria pencarian
            </h3>
            <p className="text-xs text-zinc-400">
              Coba kata kunci lain atau pilih &quot;Semua Kategori&quot; pada tombol filter di atas.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Semua Kategori');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer hover:bg-emerald-600 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* DETAIL MODAL & MULTI-PHOTO GALLERY WITH LIGHTBOX */}
      {/* ========================================================= */}
      <EkskulDetailModal
        item={activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
      />
    </div>
  );
};

export default Ekskul;
