import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ValueItem {
  title: string;
  desc: string;
}

export const VisiMisiSection: React.FC = () => {
  const [vision, setVision] = useState<string>('');
  const [missions, setMissions] = useState<string[]>([]);
  const [values, setValues] = useState<ValueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchVisiMisi = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('jm_center_pages')
          .select('*')
          .eq('slug', 'visi-misi')
          .maybeSingle();

        if (data && isMounted) {
          const extra = (data.extra_data as any) || {};
          if (extra.vision) setVision(extra.vision);
          else if (data.content) setVision(data.content);

          if (Array.isArray(extra.missions)) setMissions(extra.missions);
          if (Array.isArray(extra.values)) setValues(extra.values);
        }
      } catch (err) {
        console.warn('Error fetching visi-misi from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVisiMisi();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-zinc-400 animate-pulse">
        Memuat visi dan misi pesantren...
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* Visi: Banner Statement Besar Glassmorphism */}
      {vision && (
        <div className="relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 overflow-hidden bg-gradient-to-br from-emerald-950 via-[#07361f] to-emerald-950 border border-emerald-800/40 text-white shadow-xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl space-y-2 sm:space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Visi Utama Lembaga</span>
            </span>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-relaxed text-zinc-100">
              &ldquo;{vision}&rdquo;
            </h2>
          </div>
        </div>
      )}

      {/* Misi: Grid Kartu Bernomor dengan Hover-Lift Effect */}
      {missions.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
              Misi Strategis Pendidikan Pesantren
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {missions.map((misi, idx) => (
              <div
                key={idx}
                className="group p-3.5 sm:p-4.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
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

      {/* Nilai-Nilai Dasar (Core Values) */}
      {values.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
              Nilai Luhur Karakter Santri Jauharul Maknuun
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5 shadow-2xs"
              >
                <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                  {val.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
