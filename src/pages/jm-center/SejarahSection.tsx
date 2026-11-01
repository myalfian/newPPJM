import React, { useState, useEffect } from 'react';
import { Landmark } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { HistoryMilestone } from './types';

export const SejarahSection: React.FC = () => {
  const [history, setHistory] = useState<HistoryMilestone[]>([]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('jm_center_pages')
          .select('*')
          .eq('slug', 'sejarah')
          .maybeSingle();

        if (data && isMounted) {
          const extra = (data.extra_data as any) || {};
          if (Array.isArray(extra.timeline)) {
            setHistory(extra.timeline);
          }
          if (data.content) {
            setContent(data.content);
          }
        }
      } catch (err) {
        console.warn('Error fetching sejarah from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Seksi Sejarah Kronologis (Timeline Modern Lux) */}
      <section className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-8 lg:p-10 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Napak Tilas Dakwah</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Sejarah &amp; Tonggak Berdirinya Pesantren
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Perjalanan bertahap berlandaskan keikhlasan untuk menegakkan syiar Islam di bumi Lasem, Sidayu, Gresik.
          </p>
        </div>

        {content && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 whitespace-pre-line">
            {content}
          </div>
        )}

        {/* Timeline Vertikal Modern */}
        {loading ? (
          <div className="py-8 text-center text-xs text-zinc-400 animate-pulse">
            Memuat linimasa sejarah pesantren...
          </div>
        ) : history.length > 0 ? (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-6 sm:space-y-8 my-4">
            {history.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Glowing Node Dot */}
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
        ) : (
          <div className="py-6 text-center text-xs text-zinc-400">
            Linimasa sejarah belum diinputkan.
          </div>
        )}
      </section>
    </div>
  );
};
