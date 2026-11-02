import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Palette,
  Music,
  Heart,
  Sparkles,
  ExternalLink,
  Play,
  X,
  Search,
  Filter,
  Layers,
  Tag,
  Calendar,
  Share2,
  CheckCircle2,
  Download,
  Info
} from 'lucide-react';
import { KARYA_SISWA_ITEMS, KaryaSiswaItem } from '../data/karyaSiswaData';
import { SafeRichContent } from '../components/common/SafeRichContent';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import '../components/common/NavBarTabs.css';

type CategoryFilter = 'buku' | 'batik' | 'video-lagu-batik' | 'video-lagu-ustad' | 'showroom';

const CATEGORY_TABS: {
  id: CategoryFilter;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'buku', label: 'Flyer Buku Santri', shortLabel: 'Buku Santri', icon: BookOpen },
  { id: 'batik', label: 'Katalog Batik', shortLabel: 'Katalog Batik', icon: Palette },
  { id: 'video-lagu-batik', label: 'Video Lagu Batik', shortLabel: 'Lagu Batik', icon: Music },
  { id: 'video-lagu-ustad', label: 'Lagu Ustadz Shobirin', shortLabel: 'Lagu Ustadz', icon: Heart },
  { id: 'showroom', label: 'Show Room Santri', shortLabel: 'Show Room', icon: Sparkles },
];

export const KaryaSiswa: React.FC = () => {
  const [items, setItems] = useState<KaryaSiswaItem[]>(() => {
    try {
      const cached = localStorage.getItem('ppjm_karya_siswa_cache');
      if (cached) return JSON.parse(cached);
    } catch {}
    return KARYA_SISWA_ITEMS;
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as CategoryFilter | null;

  const validTabs: CategoryFilter[] = ['buku', 'batik', 'video-lagu-batik', 'video-lagu-ustad', 'showroom'];
  const initialCategory: CategoryFilter = urlTab && validTabs.includes(urlTab) ? urlTab : 'buku';

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<KaryaSiswaItem | null>(null);

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Sync state if URL query param changes
  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab)) {
      setSelectedCategory(urlTab);
    } else if (!urlTab) {
      setSelectedCategory('buku');
    }
  }, [urlTab]);

  const handleSelectCategory = (cat: CategoryFilter) => {
    setSelectedCategory(cat);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (cat === 'buku') {
          next.delete('tab');
        } else {
          next.set('tab', cat);
        }
        return next;
      },
      { replace: true }
    );
  };

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

  // Sync with Supabase & localStorage
  useEffect(() => {
    const fetchCloud = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'karya_siswa')
          .maybeSingle();

        if (!error && data && data.value && Array.isArray(data.value)) {
          setItems(data.value as unknown as KaryaSiswaItem[]);
          localStorage.setItem('ppjm_karya_siswa_cache', JSON.stringify(data.value));
        }
      } catch (err) {
        console.warn('Error fetching live karya_siswa:', err);
      }
    };
    fetchCloud();

    const handleLocalUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItems(e.detail);
      }
    };
    window.addEventListener('ppjm-karya-siswa-updated', handleLocalUpdate);

    const channel = supabase
      .channel('public-karya-siswa-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings', filter: 'key=eq.karya_siswa' },
        (payload: any) => {
          if (payload.new && payload.new.value && Array.isArray(payload.new.value)) {
            setItems(payload.new.value);
            localStorage.setItem('ppjm_karya_siswa_cache', JSON.stringify(payload.new.value));
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('ppjm-karya-siswa-updated', handleLocalUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Counts per tab
  const getCount = (cat: CategoryFilter) => {
    return items.filter((i) => i.category === cat).length;
  };

  const handleShare = (item: KaryaSiswaItem) => {
    const text = `Lihat Karya Siswa Santri PPJM Lasem: "${item.title}" oleh ${item.author} (${item.authorRole}) - https://ppjauharulmaknuun.sch.id/karya-siswa`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-8">
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-6 sm:py-8 px-3 sm:px-5 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-2.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-[11px] font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A951]" />
            <span>Kreativitas, Vokasi &amp; Mahabbah Santri</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-2xs">
            Galeri &amp; Etalase Karya Siswa
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Etalase dedikasi santri Pondok Pesantren Jauharul Maknuun: mulai dari penerbitan buku literatur, karya kriya batik tulis Lasem, video lagu orisinal, persembahan khidmat untuk asatidz, hingga pameran riset inovasi santri.
          </p>

          {/* Search Bar Input */}
          <div className="pt-2 max-w-lg mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari karya buku, batik, lagu, atau nama santri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-slate-800 placeholder-slate-400 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8A951] text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY CHIP TABS - NAVBAR TABS LUXURY STYLE & ANIMATION */}
      <section className="max-w-6xl mx-auto px-2.5 sm:px-4 -mt-4 relative z-20 select-none">
        <nav aria-label="Kategori Karya Siswa" className="curved-navbar-wrapper w-full">
          <div className="curved-navbar-bar w-full">
            <div
              ref={tabListRef}
              className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-1.5 sm:px-2"
            >
              <ul className="curved-tab-list flex items-center justify-start w-full gap-1 sm:gap-2">
                {CATEGORY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;

                  return (
                    <li
                      key={tab.id}
                      className="curved-tab-col flex-none h-full flex items-center justify-center shrink-0 snap-start"
                    >
                      <button
                        ref={isActive ? activeTabRef : null}
                        type="button"
                        onClick={() => handleSelectCategory(tab.id)}
                        className={`curved-tab-link bg-transparent border-0 relative flex items-center justify-center cursor-pointer ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel */}
                        {isActive && (
                          <motion.div
                            layoutId="karyaSiswaCurvedPointer"
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
                                <radialGradient id="karyaNotchDotGrad" cx="35%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#ffffff" />
                                  <stop offset="60%" stopColor="#ffffff" />
                                  <stop offset="85%" stopColor="#f8fafc" />
                                  <stop offset="100%" stopColor="#e2e8f0" />
                                </radialGradient>
                                <filter id="karyaWhiteDotShadow" x="-30%" y="-30%" width="160%" height="160%">
                                  <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000000" floodOpacity="0.4" />
                                </filter>
                              </defs>
                              {/* Notch Surface matching hero background tone */}
                              <path
                                d="M 0 0 C 16 0, 22 18, 37 18 C 52 18, 58 0, 74 0 Z"
                                className="curved-notch-surface"
                                style={{ fill: '#042818' }}
                                stroke="none"
                              />
                              {/* High-Contrast Luminous White Floating Sphere */}
                              <circle
                                cx="37"
                                cy="6"
                                r="4.8"
                                fill="url(#karyaNotchDotGrad)"
                                filter="url(#karyaWhiteDotShadow)"
                                className="curved-notch-dot"
                                stroke="#ffffff"
                                strokeWidth="0.3"
                              />
                              {/* Specular Highlight Reflection */}
                              <circle
                                cx="35.5"
                                cy="4.5"
                                r="1.5"
                                fill="#ffffff"
                                opacity="0.95"
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

      {/* 4. MAIN CONTENT CARDS GRID */}
      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 pt-4 sm:pt-6">
        {filteredItems.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada karya yang sesuai dengan pencarian</h3>
            <p className="text-xs text-slate-400">Coba gunakan kata kunci lain atau pilih tab kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredItems.map((item) => {
              const isVideo = item.category === 'video-lagu-batik' || item.category === 'video-lagu-ustad';

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between group"
                >
                  <div>
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                      {/* Category Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#C8A951] border border-white/20 shadow-xs">
                        {item.category === 'buku' && 'Flyer Buku Santri'}
                        {item.category === 'batik' && 'Katalog Batik Lasem'}
                        {item.category === 'video-lagu-batik' && 'Video Lagu Batik'}
                        {item.category === 'video-lagu-ustad' && 'Lagu Ustadz Shobirin'}
                        {item.category === 'showroom' && 'Show Room Inovasi'}
                      </span>

                      {/* Play Button Overlay for Videos */}
                      {isVideo && (
                        <button
                          onClick={() => setActiveModalItem(item)}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-red-600 transition-all cursor-pointer"
                          title="Putar Video Lagu"
                        >
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </button>
                      )}

                      {/* Year pill */}
                      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                        Tahun {item.year}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 sm:p-3.5 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase block">
                          {item.authorRole}
                        </span>
                        <h2 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-0.5">
                          {item.title}
                        </h2>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[9.5px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            <Tag className="w-2.5 h-2.5 text-emerald-600" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-3.5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Bagikan ke WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-3 py-1.5 bg-[#0E7A4C] hover:bg-[#095736] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Lihat Rincian</span>
                      <ExternalLink className="w-3 h-3 text-[#C8A951]" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. MODAL DETAIL POPUP */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto modal-smooth-backdrop">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl lg:max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden modal-smooth-dialog">
            {/* Modal Header */}
            <div className="p-3 sm:p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  {activeModalItem.category === 'buku' && <BookOpen className="w-4 h-4" />}
                  {activeModalItem.category === 'batik' && <Palette className="w-4 h-4" />}
                  {activeModalItem.category === 'video-lagu-batik' && <Music className="w-4 h-4" />}
                  {activeModalItem.category === 'video-lagu-ustad' && <Heart className="w-4 h-4" />}
                  {activeModalItem.category === 'showroom' && <Sparkles className="w-4 h-4" />}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                    Detail Karya Siswa
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                    {activeModalItem.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4">
              {/* Media Player or Large Image */}
              {activeModalItem.videoUrl ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-black">
                  <iframe
                    src={activeModalItem.videoUrl}
                    title={activeModalItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : activeModalItem.imageUrl ? (
                <div className="w-full max-h-72 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              {/* Title & Author Info */}
              <div className="space-y-1 border-b border-slate-100 pb-2.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {activeModalItem.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Oleh: {activeModalItem.author}
                  </span>
                  <span>({activeModalItem.authorRole})</span>
                  <span>•</span>
                  <span>Tahun Pembuatan: {activeModalItem.year}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi &amp; Makna Karya</h4>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <SafeRichContent content={activeModalItem.description} />
                </div>
              </div>

              {/* Specifications / Detail Teknis */}
              {activeModalItem.specs && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Spesifikasi &amp; Detail Teknis Karya</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(activeModalItem.specs).map(([key, value]) => (
                      <div key={key} className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-slate-400 block text-[9.5px] font-semibold uppercase">{key}</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 sm:p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleShare(activeModalItem)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Karya (WA)</span>
              </button>

              <button
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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

export default KaryaSiswa;

