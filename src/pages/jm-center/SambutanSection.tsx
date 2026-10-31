import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, Landmark, RefreshCw } from 'lucide-react';
import { MOCK_PROFILE_DATA } from './ProfileSection';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';

interface GreetingData {
  name: string;
  title: string;
  role: string;
  image: string;
  quote: string;
  fullMessage: string[];
}

export const SambutanSection: React.FC = () => {
  const [greeting, setGreeting] = useState<GreetingData>(MOCK_PROFILE_DATA.greeting);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLiveSambutan = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch from sambutan_persons (Primary Dynamic Source)
      const { data: person, error: personError } = await supabase
        .from('sambutan_persons')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (person && !personError) {
        const fullMsg = person.message_full
          ? person.message_full.split('\n\n').filter(Boolean)
          : MOCK_PROFILE_DATA.greeting.fullMessage;

        setGreeting({
          name: person.name,
          title: person.title,
          role: 'Pimpinan & Pengasuh Pesantren',
          image: person.photo_url || MOCK_PROFILE_DATA.greeting.image,
          quote:
            person.message_short ||
            (person.message_full ? person.message_full.slice(0, 240) + '...' : MOCK_PROFILE_DATA.greeting.quote),
          fullMessage: fullMsg,
        });
        setLoading(false);
        return;
      }

      // 2. Fallback to jm_center_pages (slug: 'sambutan')
      const { data: pageData } = await supabase
        .from('jm_center_pages')
        .select('*')
        .eq('slug', 'sambutan')
        .maybeSingle();

      if (pageData) {
        const extra = (pageData.extra_data as any) || {};
        const fullMsg = pageData.content
          ? pageData.content.split('\n\n').filter(Boolean)
          : MOCK_PROFILE_DATA.greeting.fullMessage;

        setGreeting({
          name: pageData.quotes || extra.penceramah || MOCK_PROFILE_DATA.greeting.name,
          title: extra.jabatan || pageData.subtitle || MOCK_PROFILE_DATA.greeting.title,
          role: 'Pimpinan Yayasan Pondok Pesantren Jauharul Maknuun',
          image: pageData.banner_image || MOCK_PROFILE_DATA.greeting.image,
          quote: pageData.content ? pageData.content.slice(0, 240) + '...' : MOCK_PROFILE_DATA.greeting.quote,
          fullMessage: fullMsg,
        });
      }
    } catch (err) {
      console.warn('[SambutanSection] Error loading dynamic sambutan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSambutan();

    // Subscribe to realtime updates on sambutan_persons & jm_center_pages
    const channel = supabase
      .channel('public-sambutan-section-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        () => {
          fetchLiveSambutan();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jm_center_pages' },
        () => {
          fetchLiveSambutan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Seksi Sambutan Pimpinan / Pengasuh Pesantren */}
      <section className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-8 lg:p-10 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Foto Resmi Pengasuh */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-700/20 shadow-xl shadow-emerald-950/15 group">
              <img
                src={greeting.image}
                alt={greeting.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  {greeting.title}
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
                  {greeting.name}
                </h3>
                <p className="text-xs text-emerald-100/80">{greeting.role}</p>
              </div>
            </div>
          </div>

          {/* Narasi Sambutan */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5" />
              <span>Pesan Pimpinan Pondok Pesantren</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
              Mendidik dengan Adab, Membina dengan Al-Qur&apos;an, Menjawab Tantangan Zaman
            </h2>

            {/* Styling Quote dengan garis vertikal beraksen hairline emas */}
            <blockquote className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 py-1 italic text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-serif bg-amber-50/40 dark:bg-amber-950/20 rounded-r-2xl">
              &ldquo;{greeting.quote}&rdquo;
            </blockquote>

            {/* Full Message Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {greeting.fullMessage.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 1
                      ? 'first-letter:text-3xl first-letter:font-black first-letter:text-emerald-800 dark:first-letter:text-emerald-400 first-letter:float-left first-letter:mr-2'
                      : ''
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
