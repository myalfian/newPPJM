import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  Share2,
  ChevronRight,
  Sparkles,
  User,
  Search,
  X,
  Award,
  BookOpen,
  Cpu,
  FileText
} from 'lucide-react';
import '../components/common/NavBarTabs.css';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useCachedQuery, invalidateCache } from '../lib/queryCache';
import { NewsItem, INITIAL_NEWS } from '../data/newsData';
import { generateWhatsAppBroadcastUrl } from '../lib/waFormatter';
import { stripHtmlToPlainText } from '../utils/richContentUtils';

const NEWS_TABS: {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'berita-utama', label: 'Berita Utama', shortLabel: 'Utama', icon: Sparkles },
  { id: 'siaran-pers', label: 'Siaran Pers', shortLabel: 'Rilis Pers', icon: FileText },
  { id: 'prestasi', label: 'Prestasi Santri', shortLabel: 'Prestasi', icon: Award },
  { id: 'pesantren', label: 'Warta Pesantren', shortLabel: 'Pesantren', icon: BookOpen },
  { id: 'stem', label: 'Inovasi STEM', shortLabel: 'STEM', icon: Cpu },
];

const fetchPublicNews = async (): Promise<NewsItem[]> => {
  if (!isSupabaseConfigured()) {
    return INITIAL_NEWS;
  }
  try {
    const { data: bData, error } = await (supabase.from('berita' as any) as any)
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    const rows: any[] = (!error && Array.isArray(bData)) ? bData : [];

    if (rows.length === 0) {
      return INITIAL_NEWS;
    }

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category || 'Warta Pondok',
      summary: stripHtmlToPlainText(row.summary || row.excerpt || row.content || '', 180),
      content: row.content,
      thumbnail: row.thumbnail || row.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const defaultCategory = useMemo(() => {
    if (urlTab && urlTab !== 'semua') return urlTab;
    if (location.pathname.includes('press-release')) return 'siaran-pers';
    return 'berita-utama';
  }, [urlTab, location.pathname]);

  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const { data: newsItems = INITIAL_NEWS, refetch } = useCachedQuery<NewsItem[]>(
    'public-news-list',
    fetchPublicNews
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('public-news-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'berita' },
        () => {
          invalidateCache('public-news-list');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Sync state if URL query param changes
  useEffect(() => {
    if (urlTab && urlTab !== 'semua') {
      setSelectedCategory(urlTab);
    } else if (location.pathname.includes('press-release')) {
      setSelectedCategory('siaran-pers');
    } else {
      setSelectedCategory('berita-utama');
    }
  }, [urlTab, location.pathname]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (catId === 'berita-utama') {
          next.delete('tab');
        } else {
          next.set('tab', catId);
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

  const matchCategoryFilter = (item: NewsItem, tabId: string): boolean => {
    if (tabId === 'semua') return true;
    const cat = (item.category || '').toLowerCase();
    if (tabId === 'berita-utama') {
      return (
        item.is_pinned ||
        cat.includes('utama') ||
        cat.includes('headline') ||
        cat.includes('berita') ||
        cat.includes('warta')
      );
    }
    if (tabId === 'siaran-pers') return cat.includes('pers') || cat.includes('release');
    if (tabId === 'prestasi') return cat.includes('prestasi') || cat.includes('juara');
    if (tabId === 'pesantren') return cat.includes('pesantren') || cat.includes('pondok') || cat.includes('diniyah') || cat.includes('akbar');
    if (tabId === 'stem') return cat.includes('stem') || cat.includes('robotik') || cat.includes('inovasi') || cat.includes('akademik');
    return false;
  };

  const filteredNews = useMemo(() => {
    const matched = newsItems.filter((item) => {
      const matchCategory = matchCategoryFilter(item, selectedCategory);
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(q) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
    if (matched.length === 0 && selectedCategory === 'berita-utama' && !searchQuery) {
      return newsItems;
    }
    return matched;
  }, [newsItems, selectedCategory, searchQuery]);

  // Counts per tab
  const getTabCount = (tabId: string): number => {
    if (tabId === 'semua') return newsItems.length;
    return newsItems.filter((item) => matchCategoryFilter(item, tabId)).length;
  };

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
    <div className="bg-slate-50 min-h-screen pb-4">
      {/* 1. HERO HEADER SECTION - COMPACT VERTICAL SPACING (SEARCH REMOVED) */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-3.5 sm:py-5 px-3 sm:px-4 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-widest shadow-2xs">
            <Newspaper className="w-3 h-3 text-[#C8A951]" />
            <span>Warta Resmi &amp; Siaran Pers PPJM</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xs">
            JM News &amp; Warta Pesantren
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Pusat warta terpercaya, siaran pers resmi, dokumentasi liputan kegiatan, dan dinamika Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY CHIP TABS - 25% OVERLAP WITH HERO CONTAINER ABOVE */}
      <section className="max-w-6xl mx-auto px-2.5 sm:px-4 -mt-[11px] sm:-mt-[11.5px] relative z-20 select-none">
        <nav aria-label="Kategori Berita" className="curved-navbar-wrapper w-full">
          <div className="curved-navbar-bar w-full">
            <div
              ref={tabListRef}
              className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-1 sm:px-2"
            >
              <ul className="curved-tab-list flex items-center justify-between w-full gap-1 sm:gap-1.5">
                {NEWS_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;

                  return (
                    <li
                      key={tab.id}
                      className="curved-tab-col flex-1 h-full flex items-center justify-center min-w-[100px] sm:min-w-0 snap-start"
                    >
                      <button
                        ref={isActive ? activeTabRef : null}
                        type="button"
                        onClick={() => handleSelectCategory(tab.id)}
                        className={`curved-tab-link w-full bg-transparent border-0 relative flex items-center justify-center cursor-pointer px-1.5 sm:px-2 ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        {/* Animated Sliding Notch Pointer with Pristine White Cutout Notch & Radiant Gold Jewel */}
                        {isActive && (
                          <motion.div
                            layoutId="jmNewsCurvedPointer"
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
                                <radialGradient id="jmNewsNotchDotGrad" cx="35%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#fffbeb" />
                                  <stop offset="35%" stopColor="#fde047" />
                                  <stop offset="75%" stopColor="#d97706" />
                                  <stop offset="100%" stopColor="#92400e" />
                                </radialGradient>
                              </defs>
                              {/* Pristine White Cutout Notch Surface matching page background tone */}
                              <path
                                d="M 0 0 C 16 0, 22 18, 37 18 C 52 18, 58 0, 74 0 Z"
                                className="curved-notch-surface"
                                style={{ fill: '#ffffff' }}
                                stroke="none"
                              />
                              {/* Radiant Jewel Gold Floating Indicator */}
                              <circle
                                cx="37"
                                cy="6"
                                r="4.8"
                                fill="url(#jmNewsNotchDotGrad)"
                                className="curved-notch-dot"
                                stroke="none"
                              />
                              {/* Specular Gem Reflection */}
                              <circle
                                cx="35.5"
                                cy="4.5"
                                r="1.4"
                                fill="#ffffff"
                                opacity="0.85"
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

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 pt-2.5 sm:pt-3">
        {filteredNews.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada warta yang sesuai dengan pencarian</h3>
            <p className="text-xs text-slate-400">Coba gunakan kata kunci lain atau pilih tab kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between group"
              >
                <div>
                  {/* 1. Foto Dokumentasi Press Release */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={news.thumbnail}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-[#fde047] text-[10px] font-bold shadow-xs">
                        {news.category || 'Press Release'}
                      </span>
                      {news.is_pinned && (
                        <span className="px-2 py-0.5 rounded-full bg-[#fbbf24] text-[#064e3b] text-[10px] font-black shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Utama</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Tanggal, Judul & Deskripsi Narasi */}
                  <div className="p-3.5 sm:p-4 space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1 text-[#0E7A4C]">
                        <Calendar className="w-3.5 h-3.5 text-[#0E7A4C]" />
                        <span>{news.date_display || 'Terbaru'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 truncate max-w-[150px]">
                        <User className="w-3.5 h-3.5" />
                        <span>{news.author || 'Humas & Publikasi PPJM'}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#0E7A4C] transition-colors line-clamp-2 leading-snug">
                      <Link to={`/jm-news/press-release/${news.slug}`}>{news.title}</Link>
                    </h3>

                    {/* Deskripsi Lengkap Rilis Pers */}
                    <p className="text-xs text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
                      {stripHtmlToPlainText(news.summary, 180)}
                    </p>
                  </div>
                </div>

                {/* 3. Aksi Baca & WhatsApp Broadcast */}
                <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <Link
                    to={`/jm-news/press-release/${news.slug}`}
                    className="text-xs font-bold text-[#0E7A4C] hover:text-emerald-950 hover:underline flex items-center gap-1"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleShareWA(news)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    title="Bagikan Warta ke WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline text-[11px]">WhatsApp</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Berita;
