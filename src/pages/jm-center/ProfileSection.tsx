import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Quote,
  Sparkles,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Star
} from 'lucide-react';
import { LeaderGreeting, HistoryMilestone } from './types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ValueItem {
  title: string;
  desc: string;
}

const DEFAULT_GREETING: LeaderGreeting = {
  name: 'KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I.',
  title: 'Pengasuh & Pendiri Pondok Pesantren',
  role: 'Pimpinan & Pengasuh Pesantren',
  image: '/logo-ppjm.svg',
  quote: 'Pondok Pesantren Jauharul Maknuun didirikan atas niat suci melahirkan generasi yang mutafaqqih fiddin, memegang sanad keilmuan salaf, dan cakap dalam inovasi sains teknologi.',
  fullMessage: [
    'Assalamu’alaikum Warahmatullahi Wabarakatuh.',
    'Pondok Pesantren Jauharul Maknuun bersama SMP Plus Jauharul Maknuun hadir di Lasem, Sidayu, Gresik sebagai kawah candradimuka peradaban.',
    'Wassalamu’alaikum Warahmatullahi Wabarakatuh.'
  ]
};

export const ProfileSection: React.FC = () => {
  const location = useLocation();
  const [greeting, setGreeting] = useState<LeaderGreeting>(DEFAULT_GREETING);
  const [history, setHistory] = useState<HistoryMilestone[]>([]);
  const [vision, setVision] = useState<string>('');
  const [missions, setMissions] = useState<string[]>([]);
  const [values, setValues] = useState<ValueItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveProfil = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        // 1. Fetch Greeting from sambutan_persons
        const { data: person } = await supabase
          .from('sambutan_persons')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (person && isMounted) {
          const fullMsg = person.message_full
            ? person.message_full.split('\n\n').filter(Boolean)
            : DEFAULT_GREETING.fullMessage;

          setGreeting({
            name: person.name,
            title: person.title,
            role: 'Pimpinan & Pengasuh Pesantren',
            image: person.photo_url || DEFAULT_GREETING.image,
            quote: person.message_short || (person.message_full ? person.message_full.slice(0, 240) + '...' : DEFAULT_GREETING.quote),
            fullMessage: fullMsg,
          });
        }

        // 2. Fetch History & Visi-Misi from jm_center_pages
        const { data: pages } = await supabase
          .from('jm_center_pages')
          .select('*');

        if (pages && isMounted) {
          const sejarahPage = pages.find((p) => p.slug === 'sejarah');
          if (sejarahPage) {
            const extra = (sejarahPage.extra_data as any) || {};
            if (Array.isArray(extra.timeline)) setHistory(extra.timeline);
          }

          const visiPage = pages.find((p) => p.slug === 'visi-misi');
          if (visiPage) {
            const extra = (visiPage.extra_data as any) || {};
            if (extra.vision) setVision(extra.vision);
            else if (visiPage.content) setVision(visiPage.content);
            if (Array.isArray(extra.missions)) setMissions(extra.missions);
            if (Array.isArray(extra.values)) setValues(extra.values);
          }
        }
      } catch (err) {
        console.warn('Error loading dynamic profile data:', err);
      }
    };

    fetchLiveProfil();

    const channel = supabase
      .channel('public-profile-section-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        () => fetchLiveProfil()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jm_center_pages' },
        () => fetchLiveProfil()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = location.pathname.toLowerCase();
      let targetId = '';
      if (path.includes('sejarah')) targetId = 'sejarah';
      else if (path.includes('visi-misi')) targetId = 'visi-misi';
      else if (path.includes('sambutan')) targetId = 'sambutan';

      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            const yOffset = -90;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          }
        }, 120);
      }
    }
  }, [location.pathname]);

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* 1. SEKSI SAMBUTAN PIMPINAN / PENGASUH */}
      <section id="sambutan" className="scroll-mt-24 bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-center">
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

            {greeting.quote && (
              <blockquote className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 py-1 italic text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-serif bg-amber-50/40 dark:bg-amber-950/20 rounded-r-2xl">
                &ldquo;{greeting.quote}&rdquo;
              </blockquote>
            )}

            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {greeting.fullMessage.map((p, idx) => (
                <p
                  key={idx}
                  className={idx === 1 ? 'first-letter:text-3xl first-letter:font-black first-letter:text-emerald-800 dark:first-letter:text-emerald-400 first-letter:float-left first-letter:mr-2' : ''}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEKSI SEJARAH KRONOLOGIS (TIMELINE MODERN LUX) */}
      {history.length > 0 && (
        <section id="sejarah" className="scroll-mt-24 bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>Napak Tilas Dakwah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Sejarah &amp; Tonggak Berdirinya Pesantren
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Perjalanan bertahap berlandaskan keikhlasan untuk menegakkan syiar Islam di bumi Lasem, Sidayu, Gresik.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-3 sm:space-y-4 my-2">
            {history.map((item, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                    item.highlight
                      ? 'bg-amber-400 border-emerald-900 shadow-md shadow-amber-400/50'
                      : 'bg-emerald-700 border-white dark:border-zinc-900'
                  }`}
                />

                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-zinc-100 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700">
                    Tahun {item.year}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. SEKSI VISI & MISI */}
      {(vision || missions.length > 0) && (
        <section id="visi-misi" className="scroll-mt-24 space-y-3">
          {vision && (
            <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-emerald-950 via-[#07361f] to-emerald-950 border border-emerald-800/40 text-white shadow-lg">
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-4xl space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Visi Utama Lembaga</span>
                </span>
                <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight leading-relaxed text-zinc-100">
                  &ldquo;{vision}&rdquo;
                </h2>
              </div>
            </div>
          )}

          {missions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Misi Strategis Pendidikan Pesantren
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.map((misi, idx) => (
                  <div
                    key={idx}
                    className="group p-5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-black text-sm flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        0{idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                        {misi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {values.length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-5 sm:p-7 border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                  Nilai Luhur Karakter Santri Jauharul Maknuun
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {values.map((v, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60">
                    <h4 className="text-xs sm:text-sm font-extrabold text-emerald-900 dark:text-emerald-300">
                      {v.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
