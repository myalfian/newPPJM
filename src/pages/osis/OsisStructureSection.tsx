import React, { useEffect, useState } from 'react';
import { Crown, Sparkles, Users } from 'lucide-react';
import { OSIS_METADATA_2026 } from './osisData';
import { OsisHtmlOrganogram } from './OsisHtmlOrganogram';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface DbOsisMember {
  id: string;
  name: string;
  position: string;
  class?: string | null;
  level?: number | string | null;
  period?: string | null;
  motto?: string | null;
  photo_url?: string | null;
}

export const OsisStructureSection: React.FC = () => {
  const [dbMembers, setDbMembers] = useState<DbOsisMember[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let mounted = true;

    const loadMembers = async () => {
      const { data, error } = await supabase
        .from('osis_structure')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (!error && data && mounted) {
        setDbMembers(data.filter((r: any) => r.is_active !== false));
      }
    };

    loadMembers();

    const channel = supabase
      .channel('public-osis-structure-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'osis_structure' }, loadMembers)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-300">
      {/* 1. Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-1.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Kabinet Khidmah Santri Masa Bakti 2026/2027</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Bagan &amp; Struktur Pengurus OSIS
          </h2>
        </div>

        {/* Quick Metrics Badges for Mobile & Desktop */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[9.5px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
            {dbMembers.length > 0 ? `${dbMembers.length} Pengurus Terdaftar` : '35 Pengurus Santri'}
          </span>
          <span className="text-[9.5px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
            4 Divisi Sekbid
          </span>
          <span className="text-[9.5px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
            3 Pembina Madrasah
          </span>
        </div>
      </div>

      {/* 2. Slogan & Semboyan Card */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0E7A4C] via-emerald-800 to-[#09482c] text-white p-2.5 sm:p-3.5 shadow-xs border border-[#C8A951]/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-[#C8A951]/40 text-[#C8A951] text-[10px] font-bold tracking-wide">
            <Sparkles className="w-3 h-3" />
            <span>Slogan &amp; Semboyan Resmi OSIS 2026/2027</span>
          </div>
          <blockquote className="text-xs sm:text-base font-bold text-white leading-relaxed italic border-l-3 sm:border-l-4 border-[#C8A951] pl-2 sm:pl-3">
            &quot;{OSIS_METADATA_2026.slogan}&quot;
          </blockquote>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-0.5">
            <p className="text-[10.5px] sm:text-xs text-emerald-100/90 font-medium">
              ✨ {OSIS_METADATA_2026.motto}
            </p>
            <div className="inline-block self-start sm:self-auto px-2 py-0.5 rounded-md bg-emerald-950/70 text-[#C8A951] font-mono font-bold text-[10px]">
              {OSIS_METADATA_2026.mottoShort}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Pengurus OSIS from Supabase (when added via Admin) */}
      {dbMembers.length > 0 && (
        <section className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Daftar Pengurus OSIS Aktif</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {dbMembers.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs"
              >
                {m.photo_url ? (
                  <img
                    src={m.photo_url}
                    alt={m.name}
                    className="w-11 h-11 rounded-xl object-cover border border-emerald-200 dark:border-emerald-800 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">{m.name}</div>
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                    {m.position}
                  </div>
                  {(m.class || m.period) && (
                    <div className="text-[10px] text-zinc-500 truncate">
                      {[m.class, m.period].filter(Boolean).join(' • ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Official Structure Organogram (Bagan Interaktif HTML) */}
      <section className="space-y-1.5">
        <OsisHtmlOrganogram />
      </section>
    </div>
  );
};
