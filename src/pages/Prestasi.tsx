import React, { useState } from 'react';
import { Award, Filter, Calendar, Trophy, X, ExternalLink, ChevronRight } from 'lucide-react';
import { Achievement } from '../lib/supabase';
import { FolderBreadcrumbTabs } from '../components/common/FolderBreadcrumbTabs';

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

export const Prestasi: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [activeModalItem, setActiveModalItem] = useState<Achievement | null>(null);

  const categories = ['Semua', 'Kitab Kuning / MQK', 'Tahfidz 30 Juz', 'Robotika / STEM', 'Olahraga & Silat'];
  const years = ['Semua', '2025', '2024'];

  const filtered = SAMPLE_ACHIEVEMENTS.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchYr = selectedYear === 'Semua' || String(item.year) === selectedYear;
    return matchCat && matchYr;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <FolderBreadcrumbTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Panggung Juara Santri</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Galeri Prestasi & Penghargaan Santri
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl">
            Bukti nyata dedikasi santri PP Jauharul Maknuun dalam mengukir karya gemilang di bidang turats, tahfidz, sains teknologi, dan olahraga.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-400 uppercase">Tahun:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y === 'Semua' ? 'Semua Tahun' : y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={item.certificate_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md text-gold-300 text-xs font-bold">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold-500 text-emerald-950 text-xs font-extrabold shadow-sm">
                  {item.year}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="text-xs font-bold text-gold-700">
                  {item.medal_type}
                </div>
                <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Oleh: {item.winner_name}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800 mt-4">
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
