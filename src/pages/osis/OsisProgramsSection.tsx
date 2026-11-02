import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Users,
  Languages,
  BookOpen,
  Shield,
  HeartPulse,
  CheckCircle2,
  Calendar,
  Target,
  ArrowRight,
  Search,
  User,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { OsisDepartment, OsisProgram } from './types';
import { OSIS_DEPARTMENTS as INITIAL_DEPARTMENTS, OSIS_METADATA_2026 } from './osisData';

export const OsisProgramsSection: React.FC = () => {
  const [departments, setDepartments] = useState<OsisDepartment[]>(INITIAL_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGoals, setShowGoals] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('osis_programs')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          // Dynamically enrich or merge programs from Supabase
          setDepartments((prev) =>
            prev.map((dept) => {
              const matched = data.filter(
                (p: any) =>
                  p.department &&
                  (p.department.toLowerCase().includes(dept.shortName.toLowerCase()) ||
                    p.department.toLowerCase().includes(dept.id.toLowerCase()) ||
                    p.department.toLowerCase().includes(dept.name.toLowerCase()))
              );
              if (matched.length > 0) {
                const dynamicProgs: OsisProgram[] = matched.map((m: any) => ({
                  id: m.id,
                  title: m.title,
                  target: m.target || 'Seluruh Santri',
                  frequency: m.frequency || 'Mingguan',
                  description: m.description,
                  expectedOutput: m.output || 'Output Terverifikasi',
                  personInCharge: m.person_in_charge || m.pj || undefined
                }));
                // Filter out duplicates by title
                const existingTitles = new Set(dept.programs.map((p) => p.title.toLowerCase()));
                const nonDuplicates = dynamicProgs.filter((dp) => !existingTitles.has(dp.title.toLowerCase()));
                return {
                  ...dept,
                  programs: [...dept.programs, ...nonDuplicates]
                };
              }
              return dept;
            })
          );
        }
      } catch (err) {
        console.warn('Failed to load osis_programs:', err);
      }
    };
    fetchPrograms();

    const channel = supabase
      .channel('public-osis-programs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'osis_programs' }, () => {
        fetchPrograms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalProgramsCount = useMemo(() => {
    return departments.reduce((acc, curr) => acc + curr.programs.length, 0);
  }, [departments]);

  // Filtered Programs based on selected tab and search query
  const filteredDepts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return departments
      .filter((dept) => selectedDeptId === 'all' || dept.id === selectedDeptId)
      .map((dept) => {
        if (!query) return dept;
        const matchingPrograms = dept.programs.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.personInCharge && p.personInCharge.toLowerCase().includes(query)) ||
            (p.target && p.target.toLowerCase().includes(query))
        );
        return {
          ...dept,
          programs: matchingPrograms
        };
      })
      .filter((dept) => dept.programs.length > 0);
  }, [departments, selectedDeptId, searchQuery]);

  const getFrequencyBadge = (freq: string) => {
    switch (freq) {
      case 'Rutin Harian':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-700/60';
      case 'Mingguan':
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300/70 dark:border-blue-700/60';
      case 'Bulanan':
        return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-300/70 dark:border-indigo-700/60';
      case 'Semesteran':
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300/70 dark:border-purple-700/60';
      case 'Tahunan':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300/70 dark:border-amber-700/60';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300/70 dark:border-zinc-700/60';
    }
  };

  return (
    <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-1.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Pilar Program Kerja Khidmah 2026/2027</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Program Kerja 5 Divisi OSIS ({totalProgramsCount} Program)
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs text-zinc-500 max-w-md">
          Rancangan program kerja resmi terpadu untuk penguatan karakter, prestasi sains, kedisiplinan, bahasa, dan kebersihan santri.
        </p>
      </div>

      {/* 7 TUJUAN UTAMA OSIS (STRATEGIC FOUNDATION FOR WORK PROGRAMS) */}
      <section className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/20 border border-emerald-600/20 dark:border-emerald-500/20 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950/10 dark:border-emerald-500/10 pb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0E7A4C] to-[#0A2116] text-[#C8A951] flex items-center justify-center shadow-2xs border border-[#C8A951]/40 shrink-0">
              <Target className="w-4 h-4 text-[#C8A951]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#C8A951]" />
                <span>Landasan Filosofis &amp; Orientasi Strategis</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white tracking-tight">
                7 Tujuan Utama OSIS SMP Plus Jauharul Maknuun
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGoals(!showGoals)}
            className="self-start sm:self-auto px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-zinc-700 transition flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>{showGoals ? 'Ringkas Tujuan' : 'Buka 7 Tujuan'}</span>
            {showGoals ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showGoals && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 animate-in fade-in duration-200">
            {OSIS_METADATA_2026.goals.map((g) => (
              <div
                key={g.id}
                className="group relative p-2.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#0E7A4C]/60 hover:shadow-xs transition-all flex flex-col justify-between space-y-1.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#0E7A4C] to-[#0A2116] text-[#C8A951] font-black text-[11px] flex items-center justify-center shadow-2xs border border-[#C8A951]/30">
                      {String(g.id).padStart(2, '0')}
                    </span>
                    <span className="text-[9.5px] font-mono text-zinc-400 group-hover:text-[#0E7A4C] dark:group-hover:text-emerald-400 transition-colors">
                      Pilar {g.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-[#0E7A4C] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {g.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Control Bar: Division Pills & Search Input */}
      <div className="space-y-1.5">
        {/* Division Switcher Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar select-none">
          <button
            type="button"
            onClick={() => setSelectedDeptId('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[32px] flex items-center gap-1.5 active:scale-[0.98] ${
              selectedDeptId === 'all'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-zinc-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Divisi</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
              {totalProgramsCount}
            </span>
          </button>

          {departments.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDeptId(dept.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[32px] flex items-center gap-1.5 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-zinc-50'
                }`}
              >
                <span>{dept.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
                  {dept.programs.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program kerja, kata kunci, sasaran, atau penanggung jawab..."
            className="w-full pl-8 pr-4 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#0E7A4C] focus:ring-1 focus:ring-[#0E7A4C] transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Program Cards Listed by Departments */}
      {filteredDepts.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 space-y-1.5">
          <Filter className="w-6 h-6 text-zinc-400 mx-auto" />
          <h4 className="font-bold text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            Tidak ada program kerja yang cocok
          </h4>
          <p className="text-[11px] text-zinc-500">
            Coba gunakan kata kunci pencarian yang berbeda.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3.5">
          {filteredDepts.map((dept) => (
            <section
              key={dept.id}
              className="bg-white/95 dark:bg-zinc-900/90 rounded-xl sm:rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-2.5 sm:p-3.5 shadow-2xs space-y-2.5"
            >
              {/* Department Header */}
              <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {dept.arabicName}
                  </span>
                  <span className="text-[10.5px] text-zinc-400 font-medium">
                    Koordinator: {dept.coordinator}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    {dept.name}
                  </h3>
                  <span className="text-[11px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#0E7A4C] dark:text-emerald-300 font-bold">
                    {dept.programs.length} Proker
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              {/* Work Programs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                {dept.programs.map((proker, idx) => (
                  <div
                    key={proker.id || idx}
                    className="group p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/70 shadow-2xs hover:border-[#0E7A4C]/50 hover:bg-white dark:hover:bg-zinc-800 transition-all flex flex-col justify-between space-y-1.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span
                          className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full border shadow-2xs ${getFrequencyBadge(
                            proker.frequency
                          )}`}
                        >
                          {proker.frequency}
                        </span>
                        {proker.personInCharge && (
                          <div className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                            <User className="w-3 h-3" />
                            <span>PJ: {proker.personInCharge}</span>
                          </div>
                        )}
                      </div>

                      <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {proker.title}
                      </h5>

                      <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {proker.description}
                      </p>
                    </div>

                    <div className="space-y-0.5 pt-1.5 border-t border-zinc-200/50 dark:border-zinc-700/50 text-[10.5px]">
                      {proker.target && (
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                          <Target className="w-3 h-3 text-[#0E7A4C] dark:text-emerald-400 shrink-0" />
                          <span>Sasaran: <strong className="text-zinc-700 dark:text-zinc-300">{proker.target}</strong></span>
                        </div>
                      )}
                      {proker.expectedOutput && (
                        <div className="flex items-start gap-1.5 text-zinc-700 dark:text-zinc-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>Target: {proker.expectedOutput}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
