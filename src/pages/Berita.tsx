import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Search,
  Share2,
  ChevronRight,
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
  const { data: newsItems = INITIAL_NEWS } = useCachedQuery<NewsItem[]>(
    'public-news-list',
    fetchPublicNews
  );

  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [newsItems, searchQuery]);

  const handleShareWA = (news: NewsItem) => {
    const url = generateWhatsAppBroadcastUrl({
      title: news.title,
      category: 'Press Release PPJM',
      excerpt: news.summary,
      targetUrl: `${window.location.origin}/jm-news/press-release/${news.slug}`,
      tanggal: news.date_display
    });
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-2 sm:space-y-2.5">
      {/* Navigation Tabs */}
      <NavBarTabs activeTabId="jm-news" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-3.5 sm:p-4.5 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Siaran Pers Resmi Pesantren</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Press Release PP Jauharul Maknuun
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
            Pusat siaran pers resmi, dokumentasi foto liputan kegiatan, dan deskripsi publikasi Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </div>

      {/* Search Bar Editorial */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari arsip siaran pers &amp; liputan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Menampilkan <span className="text-emerald-800">{filteredNews.length}</span> Siaran Pers Resmi
        </div>
      </div>

      {/* Press Release Grid (Foto & Deskripsi) */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada siaran pers yang ditemukan</h3>
          <p className="text-xs text-slate-500">Coba kata kunci pencarian lainnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-3.5">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* 1. Foto Dokumentasi Press Release */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={news.thumbnail}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-900/90 backdrop-blur-md text-gold-300 text-[11px] font-bold shadow">
                      Press Release
                    </span>
                    {news.is_pinned && (
                      <span className="px-2.5 py-1 rounded-full bg-gold-500 text-emerald-950 text-[11px] font-black shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Rilis Utama</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Tanggal, Judul & Deskripsi Narasi */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-1 text-emerald-800">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{news.date_display || 'Terbaru'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 truncate max-w-[150px]">
                      <User className="w-3.5 h-3.5" />
                      <span>{news.author || 'Humas & Publikasi PPJM'}</span>
                    </div>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/jm-news/press-release/${news.slug}`}>{news.title}</Link>
                  </h3>

                  {/* Deskripsi Lengkap Rilis Pers */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 leading-relaxed font-normal">
                    {news.summary}
                  </p>
                </div>
              </div>

              {/* 3. Aksi Baca & WhatsApp Broadcast */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                <Link
                  to={`/jm-news/press-release/${news.slug}`}
                  className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                >
                  <span>Baca Siaran Pers</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleShareWA(news)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                  title="Bagikan Siaran Pers ke WhatsApp"
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
