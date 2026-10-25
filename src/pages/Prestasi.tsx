import React, { useState } from 'react';
import { Award, Trophy, X, ExternalLink, ChevronRight } from 'lucide-react';
import { Achievement, supabase } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { BottomNavBarTabs } from '../components/common/BottomNavBarTabs';

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Juara 1 Musabaqah Qira’atil Kutub (MQK) Tingkat Provinsi Jawa Timur',
    category: 'Kitab Kuning / MQK',
    year: 2025,
    winner_name: 'Muhammad Hilman Syakir',
    medal_type: 'Emas / Juara 1',
    certificate_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    description: 'Meraih medali emas dalam cabang pembacaan dan pemahaman kitab Fathul Qorib wustho pada perhelatan akbar MQK se-Jawa Timur.'
  },
  {
    id: 'a2',
    title: 'Juara 2 Lomba Tahfidzul Qur’an 30 Juz Golongan Remaja',
    category: 'Tahfidz 30 Juz',
    year: 2025,
    winner_name: 'Fatimah Azzahra',
    medal_type: 'Perak / Juara 2',
    certificate_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    description: 'Prestasi membanggakan santriwati dalam melafalkan dan menguasai hafalan 30 juz mutqin dengan tajwid sempurna.'
  },
  {
    id: 'a3',
    title: 'Juara 1 Kontes Robotika & IoT Santri Nusantara',
    category: 'Robotika / STEM',
    year: 2024,
    winner_name: 'Tim Robotika Jauharul Maknuun',
    medal_type: 'Emas / Juara 1',
    certificate_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Inovasi robot pemilah sampah otomatis dan smart hydroponic garden di lingkungan pesantren.'
  },
  {
    id: 'a4',
    title: 'Medali Emas Kejurda Pencak Silat Pagar Nusa Tingkat Pelajar',
    category: 'Olahraga & Silat',
    year: 2024,
    winner_name: 'Rizki Aditya Pratama',
    medal_type: 'Emas / Juara 1',
    certificate_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80',
    description: 'Juara kategori tanding kelas D putra dalam ajang kejuaraan pencak silat pelajar se-Karisidenan Bojonegoro-Gresik.'
  }
];

const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_ACHIEVEMENTS;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      year: item.year,
      winner_name: item.winner_name,
      medal_type: item.medal_type,
      certificate_url: item.certificate_url || undefined,
      description: item.description || undefined,
    }));
  } catch {
    return SAMPLE_ACHIEVEMENTS;
  }
};

export const Prestasi: React.FC = () => {
  const { data: achievements } = useCachedQuery<Achievement[]>(
    'achievements_list',
    fetchAchievements,
    SAMPLE_ACHIEVEMENTS
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [activeModalItem, setActiveModalItem] = useState<Achievement | null>(null);

  const categories = ['Semua', 'Kitab Kuning / MQK', 'Tahfidz 30 Juz', 'Robotika / STEM', 'Olahraga & Silat'];
  const years = ['Semua', '2026', '2025', '2024'];

  const filtered = achievements.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchYr = selectedYear === 'Semua' || String(item.year) === selectedYear;
    return matchCat && matchYr;
  });

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Panggung Juara Santri</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Galeri Prestasi & Penghargaan Santri
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Bukti nyata dedikasi santri PP Jauharul Maknuun dalam mengukir karya gemilang di bidang turats, tahfidz, sains teknologi, dan olahraga.
          </p>
        </div>
      </div>

      {/* Category Navigation with Bottom Floating Animation */}
      <BottomNavBarTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        years={years}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        yearLabel="Tahun"
      />

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-32 sm:h-38 overflow-hidden bg-slate-100">
                <img
                  src={item.certificate_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-900/80 backdrop-blur-md text-gold-300 text-xs font-bold">
                  {item.category}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-500 text-emerald-950 text-xs font-extrabold shadow-sm">
                  {item.year}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 space-y-1">
                <div className="text-xs font-bold text-gold-700">
                  {item.medal_type}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Oleh: {item.winner_name}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800 mt-1.5">
              <span>Lihat Detail Sertifikat</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveModalItem(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gold-600 uppercase">
                  {activeModalItem.medal_type} ({activeModalItem.year})
                </span>
                <h3 className="text-xl font-bold text-emerald-950 mt-1">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pemenang: <strong>{activeModalItem.winner_name}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={activeModalItem.certificate_url}
                alt={activeModalItem.title}
                className="w-full h-64 object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeModalItem.description}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
