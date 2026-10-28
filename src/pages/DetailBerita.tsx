import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Share2,
  ArrowLeft,
  Newspaper,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';
import { NewsItem, INITIAL_NEWS } from '../data/newsData';
import { generateWhatsAppBroadcastUrl } from '../lib/waFormatter';
import { SafeRichContent } from '../components/common/SafeRichContent';

const fetchNewsBySlug = async (slug?: string): Promise<{ article: NewsItem | null; related: NewsItem[] }> => {
  if (!slug) return { article: null, related: [] };

  if (!isSupabaseConfigured()) {
    const found = INITIAL_NEWS.find((n) => n.slug === slug) || null;
    const related = INITIAL_NEWS.filter((n) => n.slug !== slug).slice(0, 3);
    return { article: found, related };
  }

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    let article: NewsItem | null = null;
    if (data && !error) {
      article = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        category: data.category || 'Warta Pondok',
        summary: data.summary || '',
        content: data.content,
        thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        is_pinned: !!data.is_pinned,
        is_published: !!data.is_published,
        author: data.author || 'Humas PPJM',
        created_at: data.created_at,
        date_display: data.created_at
          ? new Date(data.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          : 'Terbaru'
      };
    } else {
      article = INITIAL_NEWS.find((n) => n.slug === slug) || null;
    }

    // Fetch related
    const { data: relatedData } = await supabase
      .from('news')
      .select('*')
      .neq('slug', slug)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    let related: NewsItem[] = [];
    if (relatedData && relatedData.length > 0) {
      related = relatedData.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        summary: row.summary || '',
        content: row.content,
        thumbnail: row.thumbnail || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        date_display: row.created_at
          ? new Date(row.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          : 'Terbaru'
      }));
    } else {
      related = INITIAL_NEWS.filter((n) => n.slug !== slug).slice(0, 3);
    }

    return { article, related };
  } catch {
    const found = INITIAL_NEWS.find((n) => n.slug === slug) || null;
    const related = INITIAL_NEWS.filter((n) => n.slug !== slug).slice(0, 3);
    return { article: found, related };
  }
};

export const DetailBerita: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useCachedQuery(
    `news-detail-${slug}`,
    () => fetchNewsBySlug(slug)
  );

  const article = data?.article;
  const related = data?.related || [];

  const handleShareWA = () => {
    if (!article) return;
    const url = generateWhatsAppBroadcastUrl({
      title: article.title,
      category: article.category,
      excerpt: article.summary,
      targetUrl: window.location.href,
      tanggal: article.date_display
    });
    window.open(url, '_blank');
  };

  if (!article && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Newspaper className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Warta Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">
          Berita atau pengumuman yang Anda tuju mungkin telah diperbarui atau dipindahkan.
        </p>
        <Link
          to="/jm-news/press-release"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-800 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Press Release</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2 space-y-6">
      <NavBarTabs />

      {/* Back button */}
      <div>
        <Link
          to="/jm-news/press-release"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Press Release Resmi</span>
        </Link>
      </div>

      {article && (
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          {/* Header Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
              {article.is_pinned && (
                <span className="px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Berita Utama</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-950 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-500 font-semibold">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{article.date_display}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{article.author || 'Humas PPJM'}</span>
                </div>
              </div>

              <button
                onClick={handleShareWA}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bagikan ke WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="rounded-2xl overflow-hidden max-h-[500px] bg-slate-100">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-emerald max-w-none text-slate-800 leading-relaxed sm:leading-loose text-base sm:text-lg">
            <SafeRichContent content={article.content} />
          </div>

          {/* Bottom WhatsApp Broadcast Card */}
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-emerald-950">
                Bagikan Kabar Pesantren Ini
              </h4>
              <p className="text-xs text-slate-600">
                Teruskan pengumuman ini ke grup wali santri atau media sosial keluarga pesantren.
              </p>
            </div>
            <button
              onClick={handleShareWA}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm transition-all whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </article>
      )}

      {/* Related News */}
      {related.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-lg font-black text-emerald-950">Warta Pesantren Terkait</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/berita/${item.slug}`}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-m3-1 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gold-700">{item.category}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950 group-hover:text-emerald-700 line-clamp-2">
                    {item.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span>Baca</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
