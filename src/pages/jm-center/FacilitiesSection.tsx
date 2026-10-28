import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Maximize2,
  X,
  Users,
  CheckCircle2,
  Tag,
  Sparkles,
  Info
} from 'lucide-react';
import { FacilityItem } from './types';

export const MOCK_FACILITIES: FacilityItem[] = [
  {
    id: 'fac-1',
    name: 'Masjid Jami’ Baitul Maknuun',
    category: 'Ibadah',
    capacity: 'Kapasitas 1.000+ Jamaah',
    description: 'Pusat spiritual pesantren, sarana sholat lima waktu berjamaah, pembacaan ratib wirid harian, dan halaqah takhassus tahfidzul Qur’an santri.',
    image: 'https://images.unsplash.com/photo-1512632570417-a6032a69792d?auto=format&fit=crop&w=1200&q=80',
    features: ['Sound system akustik jernih', 'Kran wudhu mengalir bersih', 'Kubah artistik bermotif kaligrafi'],
  },
  {
    id: 'fac-2',
    name: 'Gedung Asrama Santri Modern (Putra & Putri)',
    category: 'Hunian',
    capacity: 'Daya Tampung 400 Santri',
    description: 'Kamar asrama berlantai keramik higienis dilengkapi tempat tidur tingkat kokoh, loker pribadi, ventilasi udara alami, dan penjagaan asatidz 24 jam.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    features: ['Pengawasan kamar oleh musyrif', 'Area jemur pakaian terlindung', 'Jadwal kebersihan kamar harian'],
  },
  {
    id: 'fac-3',
    name: 'Ruang Kelas Multimedia SMP Plus JM',
    category: 'Pendidikan',
    capacity: '30 Siswa per Kelas',
    description: 'Ruang belajar ber-AC dengan proyektor interaktif, meja kursi ergonomis, pencahayaan sejuk, dan suasana kondusif untuk kurikulum nasional & kepesantrenan.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    features: ['Smart digital projector', 'AC pendingin ruangan', 'Papan tulis ganda'],
  },
  {
    id: 'fac-4',
    name: 'Laboratorium Riset Komputer & Inovasi STEM',
    category: 'Pendidikan',
    capacity: '36 Workstation PC',
    description: 'Laboratorium teknologi canggih untuk praktikum coding, riset mikrokontroler IoT, simulasi robotika, serta literasi digital santri.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    features: ['Jaringan internet fiber optik', 'Kit sensor robotika Arduino & ESP32', 'Modul pembelajaran kecerdasan buatan'],
  },
  {
    id: 'fac-5',
    name: 'Perpustakaan & Pojok Literasi Turats',
    category: 'Pendidikan',
    capacity: 'Koleksi 5.000+ Judul Buku',
    description: 'Pusat referensi keilmuan yang memadukan khasanah kitab kuning salafiyah turots, buku ensiklopedia sains modern, jurnal, dan ruang baca hening.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    features: ['Katalog kitab kuning klasik', 'Buku sains & teknologi', 'Sudut baca lesehan nyaman'],
  },
  {
    id: 'fac-6',
    name: 'Lapangan Olahraga & Aktivitas Serbaguna',
    category: 'Olahraga',
    capacity: 'Fasilitas Terbuka Luas',
    description: 'Arena aktivitas fisik santri untuk futsal, bola voli, bulutangkis, bela diri pencak silat, latihan baris-berbaris, dan perkemahan pramuka.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    features: ['Lapangan semen halus anti-slip', 'Tiang gawang & net standar', 'Lampu sorot penerangan malam'],
  },
  {
    id: 'fac-7',
    name: 'Dapur Umum & Ruang Makan Higienis',
    category: 'Penunjang',
    capacity: 'Kapasitas Serentak 300 Santri',
    description: 'Penyediaan konsumsi santri 3 kali sehari dengan menu gizi seimbang, diawasi kebersihan proses memasaknya, serta ruang makan bersih tertib.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    features: ['Menu variatif bergizi halal', 'Penyaringan air minum higienis', 'Wastafel cuci tangan memadai'],
  },
  {
    id: 'fac-8',
    name: 'Kompleks Sanitasi & Kamar Mandi Bersih',
    category: 'Hunian',
    capacity: '60+ Pintu Kamar Mandi',
    description: 'Kamar mandi dan toilet terpisah putra-putri dengan suplai air bersih melimpah, sirkulasi udara lancar, dan perawatan desinfeksi berkala.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    features: ['Air sumur bor jernih', 'Kran wudhu banyak & lancar', 'Drainase lancar bebas bau'],
  },
];

export const FacilitiesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxFacility, setLightboxFacility] = useState<FacilityItem | null>(null);

  const categories = ['Semua', 'Pendidikan', 'Ibadah', 'Hunian', 'Olahraga', 'Penunjang'];

  const filteredFacilities = selectedCategory === 'Semua'
    ? MOCK_FACILITIES
    : MOCK_FACILITIES.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Info & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Sarana &amp; Prasarana Representatif</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Fasilitas Penunjang Santri &amp; Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Dirancang secara higienis, aman, dan modern untuk mendukung kenyamanan belajar, beribadah, dan bertempat tinggal.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Kartu Fasilitas Modern Lux (aspect-[16/10], zoom-on-hover) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredFacilities.map((fac) => (
          <article
            key={fac.id}
            className="group flex flex-col justify-between bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300"
          >
            <div>
              {/* Photo Container */}
              <div
                onClick={() => setLightboxFacility(fac)}
                className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                title="Klik untuk perbesar foto"
              >
                <img
                  src={fac.image}
                  alt={fac.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                    {fac.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <div className="p-2.5 rounded-full bg-white/80 text-zinc-900 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    onClick={() => setLightboxFacility(fac)}
                    className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {fac.name}
                  </h3>
                </div>

                {fac.capacity && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/40">
                    <Users className="w-3.5 h-3.5" />
                    <span>{fac.capacity}</span>
                  </div>
                )}

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {fac.description}
                </p>

                {/* Features Bullets */}
                {fac.features && fac.features.length > 0 && (
                  <ul className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                    {fac.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => setLightboxFacility(fac)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-50 hover:bg-emerald-50 dark:bg-zinc-800/60 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Lihat Foto Fasilitas</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {lightboxFacility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxFacility(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-zinc-950 text-white rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-zinc-800"
            >
              <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {lightboxFacility.category} {lightboxFacility.capacity ? `• ${lightboxFacility.capacity}` : ''}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {lightboxFacility.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxFacility(null)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={lightboxFacility.image}
                  alt={lightboxFacility.name}
                  className="w-full h-auto max-h-[65vh] object-contain"
                />
              </div>

              <div className="p-4 sm:p-5 bg-zinc-900/90 border-t border-zinc-800 text-xs sm:text-sm text-zinc-300">
                <p>{lightboxFacility.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
