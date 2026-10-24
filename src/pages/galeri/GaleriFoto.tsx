import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, ChevronRight, Calendar, ChevronLeft, X } from 'lucide-react';
import { GalleryItem } from '../../lib/supabase';

const SAMPLE_GALLERIES: GalleryItem[] = [
  {
    id: 'g1',
    slug: 'haflah-akhirussanah-2025',
    title: 'Haflah Akhirussanah & Wisuda Khotmil Qur’an 30 Juz 2025',
    category: 'foto',
    event_date: '2025-06-20',
    description: 'Momen penuh haru dan kebahagiaan saat ratusan santriwan-santriwati diwisuda di hadapan para masyayikh, dewan pengasuh, dan ribuan wali santri yang hadir memadati halaman utama Pondok Pesantren Jauharul Maknuun.',
    cover_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', caption: 'Suasana khidmat panggung utama Haflah Akhirussanah PPJM' },
      { photo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', caption: 'Penyematan syahadah tahfidz 30 juz oleh Pengasuh KH. M. Jauharul Maknuun' },
      { photo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', caption: 'Kebersamaan para asatidz dan wisudawan purna studi' }
    ]
  },
  {
    id: 'g2',
    slug: 'jalsah-ilmiyah-turats',
    title: 'Jalsah Ilmiyah & Bedah Manuskrip Ulama Nusantara Pesisir',
    category: 'foto',
    event_date: '2025-03-12',
    description: 'Seminar akademik turats membahas warisan keilmuan para waliyullah dan ulama Sidayu-Gresik bersama filolog dan dewan pakar nahdlatul ulama.',
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80', caption: 'Pemaparan naskah kuno kitab oleh narasumber utama' },
      { photo_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=1200&q=80', caption: 'Antusiasme santri ulya menyimak dalil kajian ushul fiqih' }
    ]
  },
  {
    id: 'g3',
    slug: 'pameran-stem-santri',
    title: 'Ekspo Karya Inovasi STEM & Sains Terapan Santri PPJM',
    category: 'foto',
    event_date: '2024-11-18',
    description: 'Pameran alat otomasi irigasi kebun, robot line follower, dan alat purifier air minum hasil karya riset mandiri santri di laboratorium sains.',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', caption: 'Demonstrasi kerja alat IoT penyiram tanaman santri' },
      { photo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', caption: 'Uji coba ketepatan sensor robot mekatronika' }
    ]
  }
];

export const GaleriFoto: React.FC = () => {
  const [selectedAgenda, setSelectedAgenda] = useState<GalleryItem | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const openSlider = (agenda: GalleryItem) => {
    setSelectedAgenda(agenda);
    setCurrentSlideIndex(0);
  };

  const nextSlide = () => {
    if (!selectedAgenda?.photos) return;
    setCurrentSlideIndex((prev) => (prev + 1) % selectedAgenda.photos!.length);
  };

  const prevSlide = () => {
    if (!selectedAgenda?.photos) return;
    setCurrentSlideIndex((prev) => (prev - 1 + selectedAgenda.photos!.length) % selectedAgenda.photos!.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-800">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">Galeri Foto Agenda</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-m3-2 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Dokumentasi Agenda PPJM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Galeri Foto Agenda Kegiatan
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl">
            Rangkuman visual agenda-agenda bersejarah, peringatan hari besar islam, dan keceriaan aktivitas santri di pesantren.
          </p>
        </div>

        <Link
          to="/galeri/video"
          className="px-5 py-2.5 rounded-full text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50 transition-colors whitespace-nowrap self-start sm:self-center"
        >
          Lihat Galeri Video Profil
        </Link>
      </div>

      {/* Grid of Agenda Galleries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_GALLERIES.map((agenda) => (
          <div
            key={agenda.id}
            onClick={() => openSlider(agenda)}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={agenda.cover_image}
                  alt={agenda.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-gold-300 text-xs font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{agenda.event_date}</span>
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-xs">
                  {agenda.photos?.length || 1} Foto
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {agenda.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {agenda.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800 mt-4">
              <span>Buka Slider Foto</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Photo Slider Modal */}
      {selectedAgenda && selectedAgenda.photos && selectedAgenda.photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedAgenda(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden z-10 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 line-clamp-1">
                  {selectedAgenda.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Tanggal Acara: {selectedAgenda.event_date} • Foto {currentSlideIndex + 1} dari {selectedAgenda.photos.length}
                </p>
              </div>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Image Box */}
            <div className="relative bg-black flex-1 min-h-[300px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
              <img
                src={selectedAgenda.photos[currentSlideIndex].photo_url}
                alt={selectedAgenda.photos[currentSlideIndex].caption || selectedAgenda.title}
                className="max-h-[500px] w-full object-contain"
              />

              {/* Prev & Next Controls */}
              {selectedAgenda.photos.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-900 shadow-md transition-all"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-900 shadow-md transition-all"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Caption & Description */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-2">
              <p className="text-sm font-bold text-slate-800">
                {selectedAgenda.photos[currentSlideIndex].caption}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAgenda.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
