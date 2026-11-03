import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Share2,
  ArrowLeft,
  Newspaper,
  Sparkles,
  ChevronRight,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';
import { NewsItem, INITIAL_NEWS } from '../data/newsData';
import { generateWhatsAppBroadcastUrl } from '../lib/waFormatter';
import { SafeRichContent } from '../components/common/SafeRichContent';
import { estimateReadingTime, stripHtmlToPlainText } from '../utils/richContentUtils';

const fetchNewsBySlug = async (slug?: string): Promise<{ article: NewsItem | null; related: NewsItem[] }> => {
  if (!slug) return { article: null, related: [] };

  if (!isSupabaseConfigured()) {
    const found = INITIAL_NEWS.find((n) => n.slug === slug) || null;
    const related = INITIAL_NEWS.filter((n) => n.slug !== slug).slice(0, 3);
    return { article: found, related };
  }

  try {
    const { data, error } = await (supabase.from('berita' as any) as any)
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
        summary: data.summary || data.excerpt || '',
        content: data.content,
        thumbnail: data.thumbnail || data.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
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
    const { data: relatedData } = await (supabase.from('berita' as any) as any)
      .select('*')
      .neq('slug', slug)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    let related: NewsItem[] = [];
    if (relatedData && relatedData.length > 0) {
      related = relatedData.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category || 'Warta Pondok',
        summary: row.summary || row.excerpt || '',
        content: row.content,
        thumbnail: row.thumbnail || row.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
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
  const [copied, setCopied] = useState(false);

  const readingTime = article?.content ? estimateReadingTime(article.content) : 1;

  const handleShareWA = () => {
    if (!article) return;
    const url = generateWhatsAppBroadcastUrl({
      title: article.title,
      category: article.category,
      excerpt: stripHtmlToPlainText(article.summary || article.content || '', 150),
      targetUrl: window.location.href,
      tanggal: article.date_display
    });
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
    <div className="max-w-5xl mx-auto px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 space-y-2 sm:space-y-2.5">
      <NavBarTabs activeTabId="jm-news" />

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
        <article className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200 shadow-xs space-y-3.5 sm:space-y-4">
          {/* Header Metadata */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
              {article.is_pinned && (
                <span className="px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Berita Utama</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-500 font-semibold">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{article.date_display}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{article.author || 'Humas PPJM'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>~{readingTime} menit baca</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                  title="Salin tautan berita ini"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                </button>

                <button
                  onClick={handleShareWA}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bagikan ke WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="rounded-xl overflow-hidden max-h-[460px] bg-slate-100 shadow-2xs">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Executive Summary / Lead Paragraph (jika tersedia) */}
          {article.summary && (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border-l-4 border-emerald-600 p-3 sm:p-4 rounded-r-xl text-slate-800 dark:text-zinc-200 text-xs sm:text-sm font-medium italic leading-relaxed">
              {stripHtmlToPlainText(article.summary)}
            </div>
          )}

          {/* Article Body dengan SafeRichContent yang telah dinormalkan */}
          <div className="py-1">
            <SafeRichContent content={article.content} />
          </div>

          {/* Bottom WhatsApp Broadcast Card */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                Bagikan Kabar Pesantren Ini
              </h4>
              <p className="text-xs text-slate-600">
                Teruskan pengumuman resmi ini ke grup wali santri atau media sosial keluarga pesantren.
              </p>
            </div>
            <button
              onClick={handleShareWA}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </article>
      )}

      {/* Related News */}
      {related.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-base sm:text-lg font-black text-emerald-950">Warta Pesantren Terkait</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/berita/${item.slug}`}
                className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-xs card-hover-smooth flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="h-28 sm:h-32 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gold-700">{item.category}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950 group-hover:text-emerald-700 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {stripHtmlToPlainText(item.summary || item.content || '', 90)}
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span>Baca Rincian</span>
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
