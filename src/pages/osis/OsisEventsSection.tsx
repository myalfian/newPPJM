import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Share2,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Newspaper,
  Tag,
  Clock,
  BookOpen,
  Quote
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { OsisArticleEvent } from './types';
import { OSIS_EVENTS as INITIAL_EVENTS } from './osisData';

export const OsisEventsSection: React.FC = () => {
  const [events, setEvents] = useState<OsisArticleEvent[]>(INITIAL_EVENTS);
  const [selectedArticle, setSelectedArticle] = useState<OsisArticleEvent | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('osis_events')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data && data.length > 0) {
          const dynamicEvents: OsisArticleEvent[] = data.map((row: any) => ({
            id: row.id,
            slug: row.slug || `event-${row.id}`,
            title: row.title,
            date: row.date || 'Oktober 2026',
            bannerUrl: row.image_url || row.banner_url || INITIAL_EVENTS[0].bannerUrl,
            summary: row.description || row.summary || row.title,
            author: row.author || 'Tim Humas & OSIS SMP Plus JM',
            category: row.category || 'Warta & Agenda',
            tags: row.tags ? (Array.isArray(row.tags) ? row.tags : [row.tags]) : ['OSIS', 'Kegiatan Santri'],
            content: row.content || row.description || ''
          }));

          // Merge without duplicate titles
          const existingTitles = new Set(INITIAL_EVENTS.map((e) => e.title.toLowerCase()));
          const newEntries = dynamicEvents.filter((e) => !existingTitles.has(e.title.toLowerCase()));
          setEvents([...INITIAL_EVENTS, ...newEntries]);
        }
      } catch (err) {
        console.warn('Failed to load osis_events:', err);
      }
    };
    fetchEvents();

    const channel = supabase
      .channel('public-osis-events-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'osis_events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleShareArticle = async (article: OsisArticleEvent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href
        });
        return;
      } catch (err) {
        // User cancelled or unsupported, fallback to copy clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const categories = ['all', ...Array.from(new Set(events.map((e) => e.category)))];

  const filteredEvents =
    activeCategoryFilter === 'all'
      ? events
      : events.filter((e) => e.category === activeCategoryFilter);

  return (
    <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-1.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <Newspaper className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Dokumentasi &amp; Berita Terkini Masa Bakti 2026/2027</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Agenda Kegiatan &amp; Dokumentasi OSIS
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs text-zinc-500 max-w-md">
          Liputan resmi, siaran pers, dan dokumentasi visual peristiwa penting kepengurusan OSIS SMP Plus Jauharul Maknuun.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar select-none">
        {categories.map((cat) => {
          const isSelected = activeCategoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[32px] flex items-center gap-1.5 active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-zinc-50'
              }`}
            >
              <span>{cat === 'all' ? 'Semua Warta & Dokumentasi' : cat}</span>
              <span className="text-[10px] opacity-75">
                ({cat === 'all' ? events.length : events.filter((e) => e.category === cat).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Event Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
        {filteredEvents.map((event) => (
          <article
            key={event.id}
            onClick={() => setSelectedArticle(event)}
            className="group bg-white/95 dark:bg-zinc-900/90 rounded-xl sm:rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#0E7A4C]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99] select-none"
          >
            <div>
              {/* Photo Banner with Aspect 16/9 */}
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Category Pill Tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-[#C8A951] border border-[#C8A951]/40 backdrop-blur-md shadow-2xs">
                    {event.category}
                  </span>
                </div>

                {/* Date Tag */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-[11px] text-white/90 font-medium drop-shadow-md">
                  <Calendar className="w-3 h-3 text-[#C8A951]" />
                  <span>{event.date}</span>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="p-2.5 sm:p-3.5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-[#0E7A4C] dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-[11.5px] sm:text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {event.summary}
                </p>

                {event.sloganQuote && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-[11px] font-semibold text-amber-900 dark:text-amber-200 italic">
                    &quot;{event.sloganQuote}&quot;
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <User className="w-3 h-3 text-[#0E7A4C]" />
                  <span className="truncate">{event.author}</span>
                </div>
              </div>
            </div>

            {/* Read More Action */}
            <div className="p-2.5 sm:p-3.5 pt-0">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0E7A4C] dark:text-emerald-400 group-hover:underline">
                <span>Baca Dokumentasi Lengkap</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* READING MODAL: EDITORIAL FULL ARTICLE VIEW */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain select-none"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Bar */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0E7A4C] dark:text-emerald-400 uppercase tracking-wider">
                {selectedArticle.category} • Dokumentasi OSIS 2026/2027
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareArticle(selectedArticle)}
                  className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer"
                  title="Bagikan Warta"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Tutup Warta"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Article Content */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-5 text-zinc-800 dark:text-zinc-200 select-text">
              {/* Banner Photo */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                <img
                  src={selectedArticle.bannerUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0E7A4C]" />
                    <span>{selectedArticle.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0E7A4C]" />
                    <span>Oleh: {selectedArticle.author}</span>
                  </span>
                </div>
              </div>

              {/* Slogan Quote or Summary Banner */}
              {selectedArticle.sloganQuote ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border-l-4 border-[#C8A951] text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed italic">
                  &quot;{selectedArticle.sloganQuote}&quot;
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed italic">
                  &quot;{selectedArticle.summary}&quot;
                </div>
              )}

              {/* Full Content Body */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
                {selectedArticle.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
