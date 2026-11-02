import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Layers,
  Tag,
  Share2,
  Info
} from 'lucide-react';
import { NavBarTabs, NavTabItem } from '../components/common/NavBarTabs';
import { KARYA_SISWA_ITEMS, KaryaSiswaItem } from '../data/karyaSiswaData';
import { SafeRichContent } from '../components/common/SafeRichContent';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type CategoryFilter = 'buku' | 'batik' | 'video-lagu-batik' | 'video-lagu-ustad' | 'showroom';

const VALID_CATEGORIES: CategoryFilter[] = [
  'buku',
  'batik',
  'video-lagu-batik',
  'video-lagu-ustad',
  'showroom'
];

export const KaryaSiswa: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as CategoryFilter | null;

  // Active Category synced with URL search params (defaults to 'buku' since 'Semua Karya' is removed)
  const selectedCategory: CategoryFilter = useMemo(() => {
    if (urlTab && VALID_CATEGORIES.includes(urlTab)) {
      return urlTab;
    }
    return 'buku';
  }, [urlTab]);

  const [items, setItems] = useState<KaryaSiswaItem[]>(() => {
    try {
      const cached = localStorage.getItem('ppjm_karya_siswa_cache');
      if (cached) return JSON.parse(cached);
    } catch {}
    return KARYA_SISWA_ITEMS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<KaryaSiswaItem | null>(null);

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

  // Tab switch handler
  const handleTabChange = (tab: NavTabItem) => {
    const nextCat = tab.id as CategoryFilter;
    if (VALID_CATEGORIES.includes(nextCat)) {
      setSearchParams({ tab: nextCat }, { replace: true });
    }
  };

  // Dynamic Navigation Tabs configured with authentic counts & icons
  const navTabs: NavTabItem[] = useMemo(() => {
    return [
      {
        id: 'buku',
        label: 'Flyer Buku Santri',
        shortLabel: 'Buku',
        href: '/karya-siswa?tab=buku',
        icon: BookOpen,
        badge: items.filter((i) => i.category === 'buku').length,
      },
      {
        id: 'batik',
        label: 'Katalog Batik',
        shortLabel: 'Batik',
        href: '/karya-siswa?tab=batik',
        icon: Palette,
        badge: items.filter((i) => i.category === 'batik').length,
      },
      {
        id: 'video-lagu-batik',
        label: 'Video Lagu Batik',
        shortLabel: 'Lagu Batik',
        href: '/karya-siswa?tab=video-lagu-batik',
        icon: Music,
        badge: items.filter((i) => i.category === 'video-lagu-batik').length,
      },
      {
        id: 'video-lagu-ustad',
        label: 'Lagu Ustadz Shobirin',
        shortLabel: 'Lagu Ustadz',
        href: '/karya-siswa?tab=video-lagu-ustad',
        icon: Heart,
        badge: items.filter((i) => i.category === 'video-lagu-ustad').length,
      },
      {
        id: 'showroom',
        label: 'Show Room Santri',
        shortLabel: 'Show Room',
        href: '/karya-siswa?tab=showroom',
        icon: Sparkles,
        badge: items.filter((i) => i.category === 'showroom').length,
      },
    ];
  }, [items]);

  // Filtered items strictly by selected category
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

  const handleShare = (item: KaryaSiswaItem) => {
    const text = `Lihat Karya Siswa Santri PPJM Lasem: "${item.title}" oleh ${item.author} (${item.authorRole}) - https://ppjauharulmaknuun.sch.id/karya-siswa?tab=${item.category}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 space-y-2 sm:space-y-2.5 overflow-x-hidden select-none">
      {/* 1. Curved Emerald Notch Sub-Navigation (Exact NavBarTabs style & animation) */}
      <NavBarTabs
        activeTabId={selectedCategory}
        tabs={navTabs}
        onChangeTab={handleTabChange}
      />

      {/* 2. HERO HEADER SECTION */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#07361d] via-[#0f5132] to-[#0a2717] border border-emerald-700/40 p-2.5 sm:p-4 lg:p-4.5 text-white shadow-md shadow-emerald-950/20 card-hover-smooth">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 sm:space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10.5px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kreativitas, Vokasi &amp; Mahabbah Santri</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                Galeri &amp; Etalase Karya Siswa
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                Etalase dedikasi santri Pondok Pesantren Jauharul Maknuun: mulai dari penerbitan buku literatur, karya kriya batik tulis Lasem, video lagu orisinal, persembahan khidmat untuk asatidz, hingga pameran riset inovasi santri.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <div className="text-sm sm:text-base font-black text-[#d4af37]">
                  {items.length}
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-200 font-bold">
                  Total Karya
                </div>
              </div>
              <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <div className="text-sm sm:text-base font-black text-white">
                  5
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-200 font-bold">
                  Kategori
                </div>
              </div>
              <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <div className="text-sm sm:text-base font-black text-[#d4af37]">
                  100%
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-200 font-bold">
                  Karya Santri
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Search Bar */}
          <div className="pt-1 max-w-md">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul karya, penulis, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-white/95 text-slate-800 placeholder-slate-400 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C8A951] text-xs font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CARDS GRID */}
      <main className="pt-1">
        {filteredItems.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <Layers className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
              Tidak ada karya yang sesuai dengan pencarian
            </h3>
            <p className="text-xs text-zinc-400">
              Coba gunakan kata kunci lain atau pilih tab kategori karya yang berbeda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredItems.map((item) => {
              const isVideo = item.category === 'video-lagu-batik' || item.category === 'video-lagu-ustad';

              return (
                <article
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between group transition-all"
                >
                  <div>
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                      {/* Category Badge */}
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#C8A951] border border-white/20 shadow-xs">
                        {item.category === 'buku' && 'Flyer Buku Santri'}
                        {item.category === 'batik' && 'Katalog Batik Lasem'}
                        {item.category === 'video-lagu-batik' && 'Video Lagu Batik'}
                        {item.category === 'video-lagu-ustad' && 'Lagu Ustadz Shobirin'}
                        {item.category === 'showroom' && 'Show Room Inovasi'}
                      </span>

                      {/* Play Button Overlay for Videos */}
                      {isVideo && (
                        <button
                          type="button"
                          onClick={() => setActiveModalItem(item)}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-red-600 transition-all cursor-pointer"
                          title="Putar Video Lagu"
                        >
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </button>
                      )}

                      {/* Year pill */}
                      <span className="absolute bottom-2 right-2 text-[9.5px] font-bold text-white/90 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                        Tahun {item.year}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 sm:p-3.5 space-y-1.5">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 tracking-wider uppercase block">
                          {item.authorRole}
                        </span>
                        <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mt-0.5">
                          {item.title}
                        </h2>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                          >
                            <Tag className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleShare(item)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer"
                      title="Bagikan ke WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
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

      {/* 4. MODAL DETAIL POPUP */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto modal-smooth-backdrop">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl max-w-2xl lg:max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden modal-smooth-dialog">
            {/* Modal Header */}
            <div className="p-3 sm:p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg">
                  {activeModalItem.category === 'buku' && <BookOpen className="w-4 h-4" />}
                  {activeModalItem.category === 'batik' && <Palette className="w-4 h-4" />}
                  {activeModalItem.category === 'video-lagu-batik' && <Music className="w-4 h-4" />}
                  {activeModalItem.category === 'video-lagu-ustad' && <Heart className="w-4 h-4" />}
                  {activeModalItem.category === 'showroom' && <Sparkles className="w-4 h-4" />}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
                    Detail Karya Siswa
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
                    {activeModalItem.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4">
              {/* Media Player or Large Image */}
              {activeModalItem.videoUrl ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm bg-black">
                  <iframe
                    src={activeModalItem.videoUrl}
                    title={activeModalItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : activeModalItem.imageUrl ? (
                <div className="w-full max-h-72 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              {/* Title & Author Info */}
              <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {activeModalItem.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Oleh: {activeModalItem.author}
                  </span>
                  <span>({activeModalItem.authorRole})</span>
                  <span>•</span>
                  <span>Tahun Pembuatan: {activeModalItem.year}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Deskripsi &amp; Makna Karya</h4>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <SafeRichContent content={activeModalItem.description} />
                </div>
              </div>

              {/* Specifications / Detail Teknis */}
              {activeModalItem.specs && (
                <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <h4 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Spesifikasi &amp; Detail Teknis Karya</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(activeModalItem.specs).map(([key, value]) => (
                      <div key={key} className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                        <span className="text-zinc-400 block text-[9.5px] font-semibold uppercase">{key}</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs mt-0.5 block">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 sm:p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleShare(activeModalItem)}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Karya (WA)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
