import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SafeRichContent } from '../../components/common/SafeRichContent';

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
          if (extra.vision) {
            setVision(extra.vision);
          } else if (data.content) {
            const parts = data.content.split('\n\n');
            setVision(parts[0] || data.content);
          }

          if (Array.isArray(extra.missions) && extra.missions.length > 0) {
            setMissions(extra.missions);
          } else if (data.content) {
            const parts = data.content.split('\n\n');
            if (parts.length > 1) {
              const lines = parts.slice(1).join('\n').split('\n').map((l: string) => l.trim()).filter(Boolean);
              if (lines.length > 0) setMissions(lines);
            }
          }

          if (Array.isArray(extra.values)) setValues(extra.values);
        }
      } catch (err) {
        console.warn('Error fetching visi-misi from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVisiMisi();

    // Subscribe to realtime updates on jm_center_pages
    const channel = supabase
      .channel('public-visimisi-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jm_center_pages' }, () => {
        fetchVisiMisi();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
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
    <div className="space-y-3 sm:space-y-4">
      {/* Visi: Banner Statement Besar Glassmorphism */}
      {vision && (
        <div className="relative rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 overflow-hidden bg-gradient-to-br from-[#06331c] via-[#0b4d2a] to-[#042013] border border-emerald-700/50 text-white shadow-lg card-hover-smooth">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Visi Utama Lembaga</span>
            </span>
            <div className="text-base sm:text-lg lg:text-xl font-bold tracking-tight leading-relaxed text-zinc-100">
              <SafeRichContent content={vision} className="text-zinc-100 [&_p]:text-zinc-100 [&_span]:!text-zinc-100 [&_strong]:text-amber-300 [&_strong]:font-extrabold [&_em]:italic" />
            </div>
          </div>
        </div>
      )}

      {/* 5 Pilar Misi Utama Pesantren */}
      {missions.length > 0 && (
        <div className="space-y-2 sm:space-y-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              5 Pilar Misi Utama Pesantren
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {missions.map((misi, idx) => {
              // Extract prefix (e.g. "Pilar 1:") if present
              const match = misi.match(/^(?:Pilar\s*(\d+)|\s*(\d+)\.)\s*:\s*(.*)$/i);
              const pilarNum = match ? (match[1] || match[2]) : String(idx + 1);
              const pilarText = match ? match[3] : misi;

              return (
                <div
                  key={idx}
                  className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-black text-xs flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        0{pilarNum}
                      </div>
                      <span className="text-[10.5px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                        Pilar 0{pilarNum}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-semibold">
                      {pilarText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nilai-Nilai Dasar (Core Values) */}
      {values.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2 sm:space-y-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
              Nilai Luhur Karakter Santri Jauharul Maknuun
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1 shadow-2xs card-hover-smooth"
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
