import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Moon,
  Sun,
  BookOpen,
  Users2,
  Heart,
  Flame,
  Award,
  RefreshCw
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { RoutineAgendaItem } from './types';

export const RoutineAgendaSection: React.FC = () => {
  const [routines, setRoutines] = useState<RoutineAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('agendas')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;

        const mapped: RoutineAgendaItem[] = (data || []).map((row: any) => {
          const period = (row.month || 'harian') as 'harian' | 'mingguan' | 'bulanan';
          const rundown = Array.isArray(row.rundown) ? row.rundown : [];
          return {
            id: row.id,
            title: row.title,
            period,
            scheduleTime: row.time_display || '-',
            category: row.category || 'umum',
            targetAudience: row.target_audience || 'Seluruh Santri',
            description: row.description || '',
            keyActivities: rundown.map((r: any) => String(r || '')).filter(Boolean),
            badge: row.badge,
            image: row.image,
            isActive: row.is_active !== false,
            isFeatured: row.is_featured === true,
            orderIndex: row.order_index,
            coordinator: row.coordinator,
            location: row.location,
            dateDisplay: row.date_display,
            year: row.year,
            timelineStatus: row.timeline_status
          };
        });
        setRoutines(mapped);
      } catch (err) {
        console.warn('Failed to load agendas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();

    const channel = supabase
      .channel('public-agendas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agendas' },
        () => fetchRoutines()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredRoutines = routines.filter((r) => r.period === selectedPeriod);

  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-zinc-400 animate-pulse">
        <RefreshCw className="w-5 h-5 mx-auto mb-2 text-zinc-400 animate-spin" />
        Memuat jadwal rutin...
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
      {/* Header & Sub-Switcher Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kedisiplinan Berkala Santri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Agenda Rutin Pesantren &amp; Sekolah
          </h2>
        </div>

        {/* Period Switcher Pills (Harian, Mingguan, Bulanan) */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
          {(['harian', 'mingguan', 'bulanan'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold capitalize transition-all cursor-pointer min-h-[34px] active:scale-[0.98] ${
                selectedPeriod === period
                  ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Agenda {period}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredRoutines.length === 0 && (
        <div className="p-6 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Calendar className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-900 dark:text-white">Belum ada agenda rutin</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Belum ada data jadwal rutin untuk periode {selectedPeriod}. Silakan tambah melalui halaman admin.
          </p>
        </div>
      )}

      {/* Routine Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
        {filteredRoutines.map((routine) => {
          return (
            <article
              key={routine.id}
              className={`bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-3.5 sm:p-4.5 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-3 ${routine.isFeatured ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''}`}
            >
              <div className="space-y-3">
                {/* Time & Period Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {routine.scheduleTime}
                  </span>
                  {routine.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {routine.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    {routine.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {routine.description}
                  </p>
                </div>

                {/* Key Activities Checklist */}
                {routine.keyActivities && routine.keyActivities.length > 0 && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block uppercase tracking-wider">
                      Aktivitas Kunci:
                    </span>
                    <ul className="space-y-1.5">
                      {routine.keyActivities.map((act, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] text-zinc-400 italic flex items-center justify-between">
                <span>Kedisiplinan & Tarbiyah Berkelanjutan PPJM</span>
                {routine.isFeatured && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Unggulan
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};