import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Sparkles, Trophy, Award, Compass, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  title: string;
  category: string;
  desc: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchableItems: SearchResult[] = [
    { title: 'Sambutan Pengasuh', category: 'Profil', desc: 'Amanat dan falsafah perjuangan KH. M. Jauharul Maknuun', route: '/jm-center/sambutan', icon: Compass },
    { title: 'Visi & Misi Lembaga', category: 'Profil', desc: 'Arah strategis tarbiyah, kurikulum & nilai luhur', route: '/jm-center/visi-misi', icon: Compass },
    { title: 'Sejarah Pesantren', category: 'Profil', desc: 'Napak tilas dakwah di Lasem Sidayu Gresik', route: '/jm-center/sejarah', icon: Compass },
    { title: 'Hafidz Quran 30 Juz', category: 'Smart JM', desc: 'Baca Al-Quran digital 30 juz dan dengarkan murottal per ayat', route: '/smart-jm/hafidz/read', icon: Sparkles },
    { title: 'Murojaah AI Santri', category: 'Smart JM', desc: 'Evaluasi pelafalan dan hafalan santri dengan speech recognition AI', route: '/smart-jm/hafidz/murojaah', icon: Sparkles },
    { title: 'Laboratorium STEM & Sains', category: 'STEM', desc: 'Silabus kurikulum dan riset teknologi terpadu santri', route: '/smart-jm/stem/materi', icon: Sparkles },
    { title: 'Portofolio STEM & Coding', category: 'STEM', desc: 'Showcase karya inovasi sains, robotika & IoT santri', route: '/smart-jm/stem/portofolio', icon: Sparkles },
    { title: 'Mandarin Class Santri', category: 'Bahasa', desc: 'Audio Pinyin, kosa kata dan latihan percakapan Mandarin', route: '/smart-jm/mandarin/materi', icon: BookOpen },
    { title: 'Kuis Interaktif Mandarin', category: 'Bahasa', desc: 'Uji kemampuan Hanzi dan Pinyin dengan penilaian langsung', route: '/smart-jm/mandarin/quiz', icon: BookOpen },
    { title: 'Ekstrakurikuler Santri', category: 'Kesiswaan', desc: 'Banjari, Silat Pagar Nusa, Robotika, Pramuka & Qiroah', route: '/ekskul', icon: Trophy },
    { title: 'Prestasi & Kejuaraan', category: 'Capaian', desc: 'Daftar raihan juara MHQ 30 Juz, MQK, Sains & Pidato', route: '/prestasi', icon: Award },
    { title: 'Galeri Foto & Dokumentasi', category: 'Media', desc: 'Arsip foto kegiatan, halaqah dan fasilitas asrama', route: '/galeri/foto', icon: BookOpen },
    { title: 'Portal Zero-IT Admin CMS', category: 'Admin', desc: 'Pusat manajemen konten, berita, nilai, santri & STEM', route: '/admin', icon: Compass },
  ];

  const results = query.trim() === ''
    ? searchableItems.slice(0, 6)
    : searchableItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 gap-3">
          <Search className="w-5 h-5 text-[#1a6b3c]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci (misal: Tahfidz, STEM, Prestasi, Ekskul)..."
            className="flex-1 text-sm sm:text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {query.trim() === '' ? 'Pintasan Rekomendasi' : `Ditemukan (${results.length})`}
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          ) : (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    navigate(item.route);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-emerald-50/80 text-left transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-[#1a6b3c]/15 text-[#1a6b3c] flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#1a6b3c] transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1a6b3c] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
