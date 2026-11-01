import React, { useState, useMemo } from 'react';
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

type CategoryFilter = 'all' | 'buku' | 'batik' | 'video-lagu-batik' | 'video-lagu-ustad' | 'showroom';

const CATEGORY_TABS: { id: CategoryFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Semua Karya', icon: Layers },
  { id: 'buku', label: 'Flyer Buku Santri', icon: BookOpen },
  { id: 'batik', label: 'Katalog Batik', icon: Palette },
  { id: 'video-lagu-batik', label: 'Video Lagu Batik', icon: Music },
  { id: 'video-lagu-ustad', label: 'Lagu Ustadz Shobirin', icon: Heart },
  { id: 'showroom', label: 'Show Room Santri', icon: Sparkles },
];

export const KaryaSiswa: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<KaryaSiswaItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return KARYA_SISWA_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Counts per tab
  const getCount = (cat: CategoryFilter) => {
    if (cat === 'all') return KARYA_SISWA_ITEMS.length;
    return KARYA_SISWA_ITEMS.filter((i) => i.category === cat).length;
  };

  const handleShare = (item: KaryaSiswaItem) => {
    const text = `Lihat Karya Siswa Santri PPJM Lasem: "${item.title}" oleh ${item.author} (${item.authorRole}) - https://ppjauharulmaknuun.sch.id/karya-siswa`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A951]" />
            <span>Kreativitas, Vokasi &amp; Mahabbah Santri</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-xs">
            Galeri &amp; Etalase Karya Siswa
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Etalase dedikasi santri Pondok Pesantren Jauharul Maknuun: mulai dari penerbitan buku literatur, karya kriya batik tulis Lasem, video lagu orisinal, persembahan khidmat untuk asatidz, hingga pameran riset inovasi santri.
          </p>

          {/* Search Bar Input */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari karya buku, batik, lagu, atau nama santri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white text-slate-800 placeholder-slate-400 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951] text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY CHIP TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            const count = getCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0E7A4C] text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8A951]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN CONTENT CARDS GRID */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Tidak ada karya yang sesuai dengan pencarian</h3>
            <p className="text-xs text-slate-400">Coba gunakan kata kunci lain atau pilih tab kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isVideo = item.category === 'video-lagu-batik' || item.category === 'video-lagu-ustad';

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
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
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#C8A951] border border-white/20 shadow-xs">
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
                          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all cursor-pointer"
                          title="Putar Video Lagu"
                        >
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </button>
                      )}

                      {/* Year pill */}
                      <span className="absolute bottom-3 right-3 text-[11px] font-bold text-white/90 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                        Tahun {item.year}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase block">
                          {item.authorRole}
                        </span>
                        <h2 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-0.5">
                          {item.title}
                        </h2>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            <Tag className="w-2.5 h-2.5 text-emerald-600" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleShare(item)}
                      className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                      title="Bagikan ke WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-4 py-2 bg-[#0E7A4C] hover:bg-[#095736] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Lihat Rincian</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#C8A951]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  {activeModalItem.category === 'buku' && <BookOpen className="w-5 h-5" />}
                  {activeModalItem.category === 'batik' && <Palette className="w-5 h-5" />}
                  {activeModalItem.category === 'video-lagu-batik' && <Music className="w-5 h-5" />}
                  {activeModalItem.category === 'video-lagu-ustad' && <Heart className="w-5 h-5" />}
                  {activeModalItem.category === 'showroom' && <Sparkles className="w-5 h-5" />}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                    Detail Karya Siswa
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                    {activeModalItem.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Media Player or Large Image */}
              {activeModalItem.videoUrl ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-black">
                  <iframe
                    src={activeModalItem.videoUrl}
                    title={activeModalItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : activeModalItem.imageUrl ? (
                <div className="w-full max-h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              {/* Title & Author Info */}
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeModalItem.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    Oleh: {activeModalItem.author}
                  </span>
                  <span>({activeModalItem.authorRole})</span>
                  <span>•</span>
                  <span>Tahun Pembuatan: {activeModalItem.year}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi &amp; Makna Karya</h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              {/* Specifications / Detail Teknis */}
              {activeModalItem.specs && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-700" />
                    <span>Spesifikasi &amp; Detail Teknis Karya</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(activeModalItem.specs).map(([key, value]) => (
                      <div key={key} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                        <span className="text-slate-400 block text-[10px] font-semibold uppercase">{key}</span>
                        <span className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5 block">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleShare(activeModalItem)}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan Karya (WA)</span>
              </button>

              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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

