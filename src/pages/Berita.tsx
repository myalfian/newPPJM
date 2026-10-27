import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Search,
  Share2,
  ChevronRight,
  Filter,
  ArrowRight,
  Sparkles,
  User
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';
import { NewsItem, INITIAL_NEWS } from '../data/newsData';
import { generateWhatsAppBroadcastUrl } from '../lib/waFormatter';

const CATEGORIES = [
  'Semua Kategori',
  'Warta Pondok',
  'Agenda Akbar',
  'Prestasi Santri',
  'Inovasi STEM',
  'Pengumuman PSB',
  'Kegiatan Diniyah'
];

const fetchPublicNews = async (): Promise<NewsItem[]> => {
  if (!isSupabaseConfigured()) {
    return INITIAL_NEWS;
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_NEWS;
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category || 'Warta Pondok',
      summary: row.summary || (row.content ? row.content.substring(0, 160) + '...' : ''),
      content: row.content,
      thumbnail: row.thumbnail || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      is_pinned: !!row.is_pinned,
      is_published: !!row.is_published,
      author: row.author || 'Humas PPJM',
      created_at: row.created_at,
      date_display: row.created_at
        ? new Date(row.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : 'Terbaru'
    }));
  } catch {
    return INITIAL_NEWS;
  }
};

export const Berita: React.FC = () => {
  const { data: newsItems = INITIAL_NEWS, isLoading } = useCachedQuery<NewsItem[]>(
    'public-news-list',
    fetchPublicNews
  );

  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchCat =
        selectedCategory === 'Semua Kategori' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [newsItems, selectedCategory, searchQuery]);

  const handleShareWA = (news: NewsItem) => {
    const url = generateWhatsAppBroadcastUrl({
      title: news.title,
      category: news.category,
      excerpt: news.summary,
      targetUrl: `${window.location.origin}/berita/${news.slug}`,
      tanggal: news.date_display
    });
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-4">
      {/* Navigation Tabs */}
      <NavBarTabs />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-4 sm:p-6 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Kabar & Publikasi Resmi Pesantren</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Warta Jauharul Maknuun
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
            Pusat berita resmi, kabar prestasi, agenda kegiatan akbar, dan pengumuman santri Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari berita atau agenda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada warta yang ditemukan</h3>
          <p className="text-xs text-slate-500">Coba kata kunci pencarian atau filter kategori lainnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={news.thumbnail}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-900/90 backdrop-blur-md text-gold-300 text-xs font-bold shadow">
                      {news.category}
                    </span>
                    {news.is_pinned && (
                      <span className="px-2.5 py-1 rounded-full bg-gold-500 text-emerald-950 text-[11px] font-black shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Utama</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{news.date_display || 'Terbaru'}</span>
                    </div>
                    {news.author && (
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{news.author}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/berita/${news.slug}`}>{news.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                <Link
                  to={`/berita/${news.slug}`}
                  className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleShareWA(news)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  title="Bagikan ke WhatsApp Wali Santri"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
