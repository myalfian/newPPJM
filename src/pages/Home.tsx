import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Globe,
  ChevronRight,
  Share2,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { QuickMenu } from '../components/QuickMenu';
import { generateWhatsAppBroadcastUrl } from '../lib/waFormatter';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';
import { INITIAL_NEWS } from '../data/newsData';
import { fetchPublishedEditorState, getPublishedEditorState } from '../lib/editorStorage';
import { PageEditorState } from '../types/EditorState';
import { SafeRichContent } from '../components/common/SafeRichContent';
import { HomeSambutanMultiSection } from '../components/home/HomeSambutanMultiSection';
import { HomeKeunggulanMultiSection } from '../components/home/HomeKeunggulanMultiSection';
import { stripHtmlToPlainText } from '../utils/richContentUtils';

export interface HomeNewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  link: string;
}

const fetchHomeNews = async (): Promise<HomeNewsItem[]> => {
  if (!isSupabaseConfigured()) {
    return INITIAL_NEWS.map((n) => ({
      id: n.id,
      title: n.title,
      date: n.date_display || 'Terbaru',
      category: n.category,
      excerpt: n.summary,
      image: n.thumbnail,
      link: `/berita/${n.slug}`
    }));
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !data || data.length === 0) {
      return INITIAL_NEWS.map((n) => ({
        id: n.id,
        title: n.title,
        date: n.date_display || 'Terbaru',
        category: n.category,
        excerpt: n.summary,
        image: n.thumbnail,
        link: `/berita/${n.slug}`
      }));
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.created_at
        ? new Date(row.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : 'Terbaru',
      category: row.category || 'Warta Pondok',
      excerpt: stripHtmlToPlainText(row.summary || row.content || '', 150),
      image: row.thumbnail || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      link: `/berita/${row.slug}`
    }));
  } catch {
    return INITIAL_NEWS.map((n) => ({
      id: n.id,
      title: n.title,
      date: n.date_display || 'Terbaru',
      category: n.category,
      excerpt: n.summary,
      image: n.thumbnail,
      link: `/berita/${n.slug}`
    }));
  }
};

export const Home: React.FC = () => {
  const [editorConfig, setEditorConfig] = useState<PageEditorState>(getPublishedEditorState);
  const [liveSambutan, setLiveSambutan] = useState<SambutanPerson | null>(null);
  const [loadingSambutan, setLoadingSambutan] = useState<boolean>(true);
  const [sambutanError, setSambutanError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch live sambutan person directly from Supabase (Tanpa fallback seed!)
    const fetchSambutanPerson = async () => {
      if (!isSupabaseConfigured()) {
        if (isMounted) setLoadingSambutan(false);
        return;
      }
      try {
        if (isMounted) {
          setLoadingSambutan(true);
          setSambutanError(null);
        }
        const { data, error } = await supabase
          .from('sambutan_persons')
          .select('*')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('order_index', { ascending: true });

        if (error) {
          console.warn('Error fetching live sambutan for Home:', error);
          if (isMounted) {
            setSambutanError(`Gagal memuat: ${error.message}`);
            setLiveSambutan(null);
          }
        } else if (data && data.length > 0 && isMounted) {
          const rows = data as SambutanPerson[];
          const featured = rows.find((s) => s.is_featured) || rows[0];
          setLiveSambutan(featured);
        } else if (isMounted) {
          setLiveSambutan(null);
        }
      } catch (err: any) {
        console.warn('Error fetching live sambutan for Home:', err);
        if (isMounted) {
          setSambutanError(`Gagal memuat: ${err?.message || 'Koneksi terputus'}`);
          setLiveSambutan(null);
        }
      } finally {
        if (isMounted) setLoadingSambutan(false);
      }
    };

    fetchSambutanPerson();

    // 1. Fetch remote published config from Supabase site_settings if available
    fetchPublishedEditorState().then((cfg) => {
      setEditorConfig(cfg);
    });

    // 2. Listen to real-time custom event dispatched from WebVisualEditor
    const handlePublished = (e: CustomEvent<PageEditorState>) => {
      if (e.detail) {
        setEditorConfig(e.detail);
      }
    };

    window.addEventListener('ppjm-editor-published', handlePublished as EventListener);

    // 3. Supabase Realtime Channel Subscription for live sync across visitors
    const channel = supabase
      .channel('public-home-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        () => {
          fetchSambutanPerson();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          fetchPublishedEditorState().then(setEditorConfig);
          fetchSambutanPerson();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cms_sections' },
        () => {
          fetchPublishedEditorState().then(setEditorConfig);
          fetchSambutanPerson();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      window.removeEventListener('ppjm-editor-published', handlePublished as EventListener);
      supabase.removeChannel(channel);
    };
  }, []);

  const { data: newsItems = [] } = useCachedQuery<HomeNewsItem[]>(
    'home-news-items',
    fetchHomeNews
  );

  const handleShareWA = (news: HomeNewsItem) => {
    const url = generateWhatsAppBroadcastUrl({
      title: news.title,
      category: news.category,
      excerpt: news.excerpt,
      targetUrl: window.location.origin + news.link,
      tanggal: news.date
    });
    window.open(url, '_blank');
  };

  const sambutan = editorConfig.sections.sambutan;
  const programUnggulan = editorConfig.sections.programUnggulan;
  const visiblePilarItems = programUnggulan?.data?.items?.filter((it) => it.isVisible !== false) || [];

  return (
    <div className="space-y-1.5 sm:space-y-2 pb-2">
      {/* 1. HERO SLIDER (3D Coverflow Carousel) */}
      {editorConfig.sections.heroSlider?.isVisible !== false && <HeroSlider />}

      {/* 2. QUICK MENU (Hanya tampil di Mobile & Tablet, tersembunyi di Desktop) */}
      {editorConfig.sections.quickMenu?.isVisible !== false && <QuickMenu />}

      {/* Divider Spacing Halus untuk Desktop */}
      <div className="hidden lg:block h-0.5" />

      {/* 2. SAMBUTAN MULTI PEMBERI SAMBUTAN */}
      {sambutan?.isVisible !== false && <HomeSambutanMultiSection />}

      {/* 3. PILAR KEUNGGULAN PESANTREN (MULTI-ITEM DARI SUPABASE) */}
      {programUnggulan?.isVisible !== false && <HomeKeunggulanMultiSection />}

      {/* 4. WARTA & BERITA TERKINI DENGAN 1-KLIK WHATSAPP WALI SANTRI */}
      {editorConfig.sections.beritaTerkini?.isVisible !== false && (
        <section id="warta-berita" className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 space-y-1.5 sm:space-y-2 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-slate-200 pb-1.5">
            <div>
              <span className="text-xs sm:text-sm font-bold text-gold-700 uppercase tracking-widest">
                Kabar Pesantren
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950">
                {editorConfig.sections.beritaTerkini?.data?.headline || 'Warta & Agenda Terkini'}
              </h2>
            </div>
            <Link
              to="/berita"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950"
            >
              <span>Semua Warta Berita</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200 card-hover-smooth flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-100">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-900/90 backdrop-blur-md text-gold-300 text-xs font-bold shadow">
                      {news.category}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-semibold">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      <span>{news.date}</span>
                    </div>

                    <h3 className="font-black text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      <Link to={news.link}>{news.title}</Link>
                    </h3>

                    <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed font-normal">
                      {stripHtmlToPlainText(news.excerpt, 150)}
                    </p>
                  </div>
                </div>

                {/* 1-Click WhatsApp Broadcast Button */}
                <div className="p-2.5 sm:p-3.5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-1.5">
                  <Link
                    to={news.link}
                    className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                  >
                    <span>Baca Rincian</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleShareWA(news)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    title="Bagikan Teks Pengumuman ke WhatsApp Wali Santri"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Kirim ke WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. CTA PENERIMAAN SANTRI BARU */}
      <section className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-4.5 text-white shadow-m3-3 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs sm:text-sm font-bold text-gold-400 uppercase tracking-widest">
              Penerimaan Santri Baru (PSB)
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Mari Bergabung Menjadi Bagian Dari Keluarga Santri PPJM
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
              Membuka pendaftaran santri baru program Tahfidz, Madrasah Diniyah Salafiyah, dan Pendidikan Formal Terpadu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Panitia%20PSB%20PP%20Jauharul%20Maknuun"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full text-sm sm:text-base font-extrabold text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-glow-gold transition-all text-center"
            >
              Hubungi Sekretariat PSB (WhatsApp)
            </a>
            <Link
              to="/jm-center/lembaga"
              className="px-5 py-3 rounded-full text-sm sm:text-base font-extrabold text-white bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600 transition-all text-center"
            >
              Profil Lembaga Pondok
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
