import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Trophy,
  Award,
  Activity,
  Palette,
  BookOpen,
  Sparkles,
  Layers,
  Medal,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { PrestasiFilterPills } from './PrestasiFilterPills';
import { PrestasiCard } from './PrestasiCard';
import { PrestasiLightboxModal } from './PrestasiLightboxModal';
import { PRESTASI_DATASET } from './prestasiData';
import { PrestasiItem, PrestasiCategory, PrestasiTingkat } from './types';
import { supabase } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

const fetchAchievementsFromDb = async (): Promise<PrestasiItem[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });

    if (error || !data || data.length === 0) {
      return PRESTASI_DATASET;
    }

    // Merge database rows with default dataset
    return data.map((item) => {
      const existing = PRESTASI_DATASET.find((d) => d.id === item.id || d.title === item.title);
      // Map category
      let category: PrestasiCategory = 'Umum';
      const catLower = (item.category || '').toLowerCase();
      if (catLower.includes('olimpiade') || catLower.includes('stem') || catLower.includes('robotika')) category = 'Olimpiade';
      else if (catLower.includes('olahraga') || catLower.includes('silat') || catLower.includes('futsal')) category = 'Olahraga';
      else if (catLower.includes('seni') || catLower.includes('kaligrafi') || catLower.includes('hadrah') || catLower.includes('bahasa')) category = 'Seni';
      else if (catLower.includes('kitab') || catLower.includes('mqk') || catLower.includes('tahfidz') || catLower.includes('quran') || catLower.includes('agama')) category = 'Keagamaan';

      // Map tingkat
      let tingkat: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten' = existing?.tingkat || 'Provinsi';
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes('nasional')) tingkat = 'Nasional';
      else if (titleLower.includes('provinsi') || titleLower.includes('jawa timur') || titleLower.includes('jatim')) tingkat = 'Provinsi';
      else if (titleLower.includes('kabupaten') || titleLower.includes('gresik')) tingkat = 'Kabupaten';

      return {
        id: item.id,
        title: item.title,
        category,
        tingkat,
        year: item.year || 2025,
        winner_name: item.winner_name || 'Santri Berprestasi',
        winner_class: existing?.winner_class || 'SMP Plus JM',
        medal_type: item.medal_type || 'Juara 1',
        event_name: existing?.event_name || 'Kompetisi Resmi Santri',
        organizer: existing?.organizer || 'Kemenag / Puspresnas',
        certificate_url: item.certificate_url || existing?.certificate_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
        photo_url: existing?.photo_url,
        description: item.description || existing?.description || '',
        tags: existing?.tags || [category, tingkat],
      };
    });
  } catch {
    return PRESTASI_DATASET;
  }
};

export const PrestasiPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('kategori');

  const { data: achievements } = useCachedQuery<PrestasiItem[]>(
    'prestasi_modular_dataset',
    fetchAchievementsFromDb,
    PRESTASI_DATASET
  );

  // Synchronize category with URL params
  const initialCategory: PrestasiCategory = useMemo(() => {
    if (!urlCategory) return 'Semua';
    const found = ['Olimpiade', 'Olahraga', 'Seni', 'Keagamaan', 'Umum'].find(
      (c) => c.toLowerCase() === urlCategory.toLowerCase()
    );
    return (found as PrestasiCategory) || 'Semua';
  }, [urlCategory]);

  const [selectedCategory, setSelectedCategory] = useState<PrestasiCategory>(initialCategory);
  const [selectedTingkat, setSelectedTingkat] = useState<PrestasiTingkat>('Semua Tingkat');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<PrestasiItem | null>(null);

  // Sync state when URL param changes externally
  useEffect(() => {
    if (urlCategory) {
      const match = ['Olimpiade', 'Olahraga', 'Seni', 'Keagamaan', 'Umum'].find(
        (c) => c.toLowerCase() === urlCategory.toLowerCase()
      );
      if (match) setSelectedCategory(match as PrestasiCategory);
    } else {
      setSelectedCategory('Semua');
    }
  }, [urlCategory]);

  const handleSelectCategory = (cat: PrestasiCategory) => {
    setSelectedCategory(cat);
    if (cat === 'Semua') {
      searchParams.delete('kategori');
    } else {
      searchParams.set('kategori', cat);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Extract unique available years
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    achievements.forEach((item) => yearsSet.add(String(item.year)));
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [achievements]);

  // Compute category counts
  const categoryDefinitions = useMemo(() => {
    const counts: Record<PrestasiCategory, number> = {
      Semua: achievements.length,
      Olimpiade: 0,
      Olahraga: 0,
      Seni: 0,
      Keagamaan: 0,
      Umum: 0,
    };

    achievements.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return [
      { id: 'Semua' as PrestasiCategory, label: 'Semua Prestasi', icon: Trophy, count: counts.Semua },
      { id: 'Olimpiade' as PrestasiCategory, label: 'Olimpiade & Sains', icon: Award, count: counts.Olimpiade },
      { id: 'Olahraga' as PrestasiCategory, label: 'Olahraga & Silat', icon: Activity, count: counts.Olahraga },
      { id: 'Seni' as PrestasiCategory, label: 'Seni & Bahasa', icon: Palette, count: counts.Seni },
      { id: 'Keagamaan' as PrestasiCategory, label: 'Keagamaan & MQK', icon: BookOpen, count: counts.Keagamaan },
      { id: 'Umum' as PrestasiCategory, label: 'Umum & Riset', icon: Sparkles, count: counts.Umum },
    ];
  }, [achievements]);

  // Filtered dataset
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;

      const matchTingkat =
        selectedTingkat === 'Semua Tingkat' || item.tingkat === selectedTingkat;

      const matchYear =
        selectedYear === 'Semua' || String(item.year) === selectedYear;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.winner_name.toLowerCase().includes(q) ||
        item.event_name.toLowerCase().includes(q) ||
        item.medal_type.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchCategory && matchTingkat && matchYear && matchSearch;
    });
  }, [achievements, selectedCategory, selectedTingkat, selectedYear, searchQuery]);

  // Overview statistics
  const goldMedalCount = useMemo(() => {
    return achievements.filter((item) =>
      item.medal_type.toLowerCase().includes('emas') || item.medal_type.toLowerCase().includes('juara 1')
    ).length;
  }, [achievements]);

  const nationalCount = useMemo(() => {
    return achievements.filter((item) => item.tingkat === 'Nasional').length;
  }, [achievements]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-8 overflow-x-hidden select-none">
      {/* 1. Folder-style Breadcrumb Sub-Navigation */}
      <NavBarTabs />

      {/* 2. Hero Header Banner (Modern Lux Emerald & Gold Styling) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07361d] via-[#0f5132] to-[#0a2717] border border-emerald-700/40 p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-emerald-950/20">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Etalase Juara &amp; Prestasi Santri</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Rekam Jejak Prestasi &amp; Kejuaraan Santri
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Dedikasi santri Pondok Pesantren &amp; SMP Plus Jauharul Maknuun dalam menorehkan tinta emas di bidang Musabaqah Qira’atil Kutub, Tahfidzul Qur’an, Olimpiade Sains STEM, Seni Budaya, dan Olahraga.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#d4af37]">
                {achievements.length}+
              </div>
              <div className="text-[10.5px] sm:text-xs text-emerald-200 font-bold mt-0.5">
                Total Prestasi
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                {goldMedalCount}
              </div>
              <div className="text-[10.5px] sm:text-xs text-emerald-200 font-bold mt-0.5">
                Medali Emas
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#d4af37]">
                {nationalCount}
              </div>
              <div className="text-[10.5px] sm:text-xs text-emerald-200 font-bold mt-0.5">
                Tk. Nasional
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-filter Navigation & Search Bar */}
      <PrestasiFilterPills
        selectedTingkat={selectedTingkat}
        onSelectTingkat={setSelectedTingkat}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        availableYears={availableYears}
      />

      {/* 4. Grid of Achievements */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAchievements.map((item) => (
            <PrestasiCard
              key={item.id}
              item={item}
              onOpenModal={setActiveModalItem}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Trophy className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h3 className="font-black text-base text-zinc-800 dark:text-zinc-200">
            Tidak Ada Prestasi yang Cocok
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Tidak ditemukan data prestasi dengan kriteria atau kata kunci pencarian tersebut. Silakan pilih kategori atau filter lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Semua');
              setSelectedTingkat('Semua Tingkat');
              setSelectedYear('Semua');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* 5. Detail & Certificate Lightbox Modal */}
      <PrestasiLightboxModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
};

