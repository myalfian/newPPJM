import React, { useState, useMemo, useEffect } from 'react';
import {
  Crown,
  GraduationCap,
  Shield,
  BookOpen,
  Languages,
  HeartPulse,
  Users,
  Search,
  Maximize2,
  FileText,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Award,
  CheckCircle2,
  Compass,
  ArrowDown,
  ArrowRight,
  HelpCircle,
  Smartphone,
  Monitor,
  Filter
} from 'lucide-react';
import { OFFICIAL_ORGANOGRAM_2026, OSIS_METADATA_2026 } from './osisData';

export const OsisHtmlOrganogram: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default to 'flow' (Alur Vertikal Mobile-Fit) on mobile screens, 'canvas' on larger screens
  const [activeViewMode, setActiveViewMode] = useState<'flow' | 'canvas' | 'cards'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'flow';
    }
    return 'canvas';
  });

  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');

  const query = searchQuery.trim().toLowerCase();

  const isMatch = (text: string) => {
    if (!query) return false;
    return text.toLowerCase().includes(query);
  };

  const totalMembersCount = useMemo(() => {
    const advisors = OFFICIAL_ORGANOGRAM_2026.advisors.length;
    const leaders = OFFICIAL_ORGANOGRAM_2026.leaders.length;
    const sec = 1 + OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.length;
    const divMembers = OFFICIAL_ORGANOGRAM_2026.divisions.reduce(
      (acc, d) => acc + d.members.length,
      0
    );
    return advisors + leaders + sec + divMembers;
  }, []);

  // Filtered divisions for mobile flow view
  const visibleDivisions = useMemo(() => {
    if (selectedDivisionFilter === 'all') {
      return OFFICIAL_ORGANOGRAM_2026.divisions;
    }
    return OFFICIAL_ORGANOGRAM_2026.divisions.filter(
      (d) => d.id === selectedDivisionFilter
    );
  }, [selectedDivisionFilter]);

  // Search match statistics
  const matchingMembers = useMemo(() => {
    if (!query) return [];
    const results: { name: string; role: string; tier: string }[] = [];

    OFFICIAL_ORGANOGRAM_2026.advisors.forEach((adv) => {
      if (isMatch(adv.name) || isMatch(adv.role)) {
        results.push({ name: adv.name, role: adv.role, tier: 'Pimpinan & Pembina' });
      }
    });

    OFFICIAL_ORGANOGRAM_2026.leaders.forEach((ldr) => {
      if (isMatch(ldr.name) || isMatch(ldr.role)) {
        results.push({ name: ldr.name, role: ldr.role, tier: 'Presidium Utama' });
      }
    });

    if (
      isMatch(OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name) ||
      isMatch(OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.role)
    ) {
      results.push({
        name: OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name,
        role: 'Sekretaris',
        tier: 'BPH Inti'
      });
    }

    OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.forEach((tName) => {
      if (isMatch(tName)) {
        results.push({ name: tName, role: 'Bendahara', tier: 'BPH Inti' });
      }
    });

    OFFICIAL_ORGANOGRAM_2026.divisions.forEach((div) => {
      div.members.forEach((m, idx) => {
        if (isMatch(m)) {
          results.push({
            name: m,
            role: idx === 0 ? `Koord. ${div.name}` : `Anggota ${div.name}`,
            tier: div.name
          });
        }
      });
    });

    return results;
  }, [query]);

  // Auto switch division filter to matching division if search is active
  useEffect(() => {
    if (query) {
      const matchedDiv = OFFICIAL_ORGANOGRAM_2026.divisions.find((div) =>
        div.members.some((m) => isMatch(m))
      );
      if (matchedDiv && selectedDivisionFilter !== 'all' && selectedDivisionFilter !== matchedDiv.id) {
        setSelectedDivisionFilter('all');
      }
    }
  }, [query]);

  const getDivisionIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Languages':
        return <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Users className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* ======================================================== */}
      {/* 1. HEADER TOOLBAR */}
      {/* ======================================================== */}
      <div className="p-3.5 sm:p-5 bg-gradient-to-r from-emerald-950 via-[#0E7A4C] to-[#042818] text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#C8A951]/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-[#C8A951]/40 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#C8A951]" />
            <span>Dokumen Tata Kelola Resmi • Garis Komando &amp; Koordinasi</span>
          </div>
          <h3 className="text-base sm:text-xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
            <span>Bagan Struktur Organisasi OSIS</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#C8A951] text-[#042818] font-bold font-mono">
              2026/2027
            </span>
          </h3>
          <p className="text-[11px] sm:text-xs text-emerald-100/85">
            SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik • Total {totalMembersCount} Pengurus &amp; Pembina
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => setActiveViewMode('flow')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeViewMode === 'flow'
                  ? 'bg-[#C8A951] text-[#042818] shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Tampilan Alur Vertikal (Mobile-Fit)"
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span>Vertikal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('canvas')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeViewMode === 'canvas'
                  ? 'bg-[#C8A951] text-[#042818] shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Tampilan Kanvas Pohon Meja (Desktop Canvas)"
            >
              <Monitor className="w-3.5 h-3.5 shrink-0" />
              <span>Kanvas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('cards')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeViewMode === 'cards'
                  ? 'bg-[#C8A951] text-[#042818] shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Tampilan Direktori Kartu Rinci"
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Kartu</span>
            </button>
          </div>

          {/* Zoom controls (Active for Canvas View) */}
          {activeViewMode === 'canvas' && (
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Perkecil Tampilan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 font-bold text-[#C8A951]">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Reset Ukuran (100%)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Button to view stamped archival scan */}
          <button
            type="button"
            onClick={() => setShowFlyerModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition cursor-pointer shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#C8A951]" />
            <span className="hidden sm:inline">Pindai Arsip Cetak</span>
            <span className="sm:hidden">Arsip Asli</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. INTERACTIVE SEARCH & QUICK LEGEND TOGGLE */}
      {/* ======================================================== */}
      <div className="px-3 sm:px-6 pt-1 sm:pt-2 space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pengurus (Afif, Yumma, Ofat, Desta, Ghazy...)"
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0E7A4C]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Toggle Legend Button */}
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-[#0E7A4C] dark:hover:text-emerald-400 font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer px-1 py-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{showLegend ? 'Tutup Petunjuk Garis' : 'Petunjuk Garis Komando'}</span>
            {showLegend ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Search Results Summary Banner */}
        {query && (
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-xs flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-bold">
                {matchingMembers.length > 0
                  ? `Ditemukan ${matchingMembers.length} pengurus cocok dengan "${searchQuery}"`
                  : `Tidak ditemukan pengurus dengan nama "${searchQuery}"`}
              </span>
            </div>
            {matchingMembers.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-black shrink-0">
                Sorotan Emas Aktif
              </span>
            )}
          </div>
        )}

        {/* Collapsible Legend Drawer */}
        {showLegend && (
          <div className="p-3 sm:p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <span className="w-5 h-1 bg-[#0E7A4C] rounded-full inline-block mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                  Garis Komando Resmi (↓)
                </span>
                <span className="text-[10.5px] text-zinc-500 leading-tight">
                  Alur mandat tugas pokok &amp; instruksi hierarkis langsung.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-0 border-t-2 border-dashed border-amber-500 inline-block mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                  Garis Pembinaan &amp; Bimbingan (↓)
                </span>
                <span className="text-[10.5px] text-zinc-500 leading-tight">
                  Pendampingan teknis kesiswaan, tata tertib, &amp; evaluasi berkala.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-0 border-t-2 border-dotted border-blue-500 inline-block mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                  Garis Koordinasi Presidium (↔)
                </span>
                <span className="text-[10.5px] text-zinc-500 leading-tight">
                  Kerja sama kemitraan antarketua, BPH, &amp; seksi bidang pelaksana.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT: MODE 1 - ALUR VERTIKAL (MOBILE-FIT)    */}
      {/* ======================================================== */}
      {activeViewMode === 'flow' && (
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Quick Notice on Mobile */}
          <div className="md:hidden flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Mode Alur Vertikal: Pas di layar ponsel tanpa geser kanan-kiri.</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveViewMode('canvas')}
              className="text-[#0E7A4C] dark:text-[#C8A951] font-bold underline shrink-0 cursor-pointer"
            >
              Lihat Kanvas
            </button>
          </div>

          {/* ---------------------------------------------------- */}
          {/* TINGKAT 1: KEPALA SEKOLAH & GARIS PENGARAH */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0E7A4C] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Tingkat I: Pimpinan Madrasah &amp; Pembina
              </span>
            </div>

            {/* Kepala Sekolah Card */}
            <div className="max-w-md mx-auto">
              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-center space-y-1 transition-all shadow-md relative ${
                  isMatch(OFFICIAL_ORGANOGRAM_2026.advisors[0].name)
                    ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/80 scale-[1.02]'
                    : 'bg-gradient-to-b from-amber-500/15 via-white to-white dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-900 border-2 border-[#C8A951]'
                }`}
              >
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-[9.5px] uppercase tracking-wider">
                  <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>{OFFICIAL_ORGANOGRAM_2026.advisors[0].role}</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-tight">
                  {OFFICIAL_ORGANOGRAM_2026.advisors[0].name}
                </h4>
                <p className="text-[11px] text-zinc-500 font-medium">
                  {OFFICIAL_ORGANOGRAM_2026.advisors[0].title}
                </p>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-md bg-[#0E7A4C] text-[#C8A951] font-bold">
                  Penanggung Jawab Tertinggi
                </span>
              </div>
            </div>

            {/* Connecting Command Arrow to Waka & Pembina */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-[9.5px] font-bold text-amber-800 dark:text-amber-300">
                <ArrowDown className="w-3 h-3 text-amber-600" />
                <span>Garis Pembinaan &amp; Bimbingan Teknis</span>
              </div>
              <div className="w-0.5 h-3.5 bg-amber-500" />
            </div>

            {/* Waka Kesiswaan & Pembina OSIS (2 Columns) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-xl mx-auto">
              {/* Waka Kesiswaan */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-center space-y-1 transition-all shadow-xs ${
                  isMatch(OFFICIAL_ORGANOGRAM_2026.advisors[1].name)
                    ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                    : 'bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700/60'
                }`}
              >
                <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <GraduationCap className="w-3 h-3" />
                  <span className="truncate">{OFFICIAL_ORGANOGRAM_2026.advisors[1].role}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white leading-tight">
                  {OFFICIAL_ORGANOGRAM_2026.advisors[1].name}
                </h4>
                <p className="text-[10px] text-zinc-500 hidden sm:block">
                  {OFFICIAL_ORGANOGRAM_2026.advisors[1].title}
                </p>
                <span className="inline-block text-[8.5px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                  Pengarah Kesiswaan
                </span>
              </div>

              {/* Pembina OSIS */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-center space-y-1 transition-all shadow-xs ${
                  isMatch(OFFICIAL_ORGANOGRAM_2026.advisors[2].name)
                    ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                    : 'bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700/60'
                }`}
              >
                <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <Shield className="w-3 h-3" />
                  <span className="truncate">{OFFICIAL_ORGANOGRAM_2026.advisors[2].role}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white leading-tight">
                  {OFFICIAL_ORGANOGRAM_2026.advisors[2].name}
                </h4>
                <p className="text-[10px] text-zinc-500 hidden sm:block">
                  {OFFICIAL_ORGANOGRAM_2026.advisors[2].title}
                </p>
                <span className="inline-block text-[8.5px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                  Pembina &amp; Evaluasi
                </span>
              </div>
            </div>
          </div>

          {/* Direct Command Flow Arrow to Level 2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-[#0E7A4C]/30 text-[9.5px] font-bold text-[#0E7A4C] dark:text-emerald-300">
              <ArrowDown className="w-3 h-3 text-[#0E7A4C] stroke-[3]" />
              <span>Mandat &amp; Instruksi Utama</span>
            </div>
            <div className="w-0.5 h-4 bg-[#0E7A4C]" />
          </div>

          {/* ---------------------------------------------------- */}
          {/* TINGKAT 2: KETUA & WAKIL KETUA OSIS */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Tingkat II: Presidium Pimpinan Utama OSIS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-xl mx-auto">
              {OFFICIAL_ORGANOGRAM_2026.leaders.map((leader, idx) => {
                const isChair = idx === 0;
                const highlighted = isMatch(leader.name) || isMatch(leader.role);

                return (
                  <div
                    key={idx}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-center space-y-1.5 shadow-sm ${
                      highlighted
                        ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60 scale-[1.02]'
                        : isChair
                        ? 'bg-gradient-to-br from-[#0E7A4C]/15 via-white to-white dark:from-emerald-950/50 dark:via-zinc-900 dark:to-zinc-900 border-2 border-[#0E7A4C]'
                        : 'bg-white dark:bg-zinc-900 border-2 border-emerald-600/40'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#0E7A4C] dark:text-emerald-400">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{leader.role}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight">
                      {leader.name}
                    </h4>
                    <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-[#0E7A4C] text-[#C8A951] font-bold">
                      {leader.badge}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coordination Line between Ketua & Wakil */}
            <div className="flex items-center justify-center gap-2 text-[9.5px] font-bold text-blue-700 dark:text-blue-300">
              <span className="w-8 sm:w-16 border-t-2 border-dotted border-blue-400" />
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                ↔ Garis Koordinasi Presidium
              </span>
              <span className="w-8 sm:w-16 border-t-2 border-dotted border-blue-400" />
            </div>
          </div>

          {/* Direct Command Flow Arrow to Level 3 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-400/40 text-[9.5px] font-bold text-blue-700 dark:text-blue-300">
              <ArrowDown className="w-3 h-3 text-blue-600 stroke-[3]" />
              <span>Instruksi Administrasi &amp; Anggaran</span>
            </div>
            <div className="w-0.5 h-4 bg-blue-600" />
          </div>

          {/* ---------------------------------------------------- */}
          {/* TINGKAT 3: SEKRETARIS & BENDAHARA (BPH INTI) */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-3 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Tingkat III: Badan Pengurus Harian (BPH Inti)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-xl mx-auto">
              {/* Sekretaris */}
              <div
                className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border transition-all text-center space-y-1 shadow-xs ${
                  isMatch(OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name)
                    ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                    : 'border-blue-200 dark:border-blue-800/80'
                }`}
              >
                <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                  Sekretaris OSIS
                </span>
                <h5 className="text-xs sm:text-base font-black text-zinc-900 dark:text-white leading-tight">
                  {OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name}
                </h5>
                <span className="inline-block text-[8.5px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60">
                  Administrasi &amp; Notula
                </span>
              </div>

              {/* Bendahara */}
              <div
                className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border transition-all text-center space-y-1 shadow-xs ${
                  OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.some(isMatch)
                    ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                    : 'border-amber-200 dark:border-amber-800/80'
                }`}
              >
                <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                  Bendahara OSIS
                </span>
                <div className="space-y-0.5">
                  {OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.map((tName, i) => (
                    <h5 key={i} className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white leading-tight">
                      {tName}
                    </h5>
                  ))}
                </div>
                <span className="inline-block text-[8.5px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/60">
                  Kas &amp; Anggaran
                </span>
              </div>
            </div>
          </div>

          {/* Direct Command Flow Arrow to Level 4 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[9.5px] font-bold text-zinc-700 dark:text-zinc-300">
              <ArrowDown className="w-3 h-3 text-[#0E7A4C]" />
              <span>Instruksi Pelaksanaan 4 Divisi Sekbid</span>
            </div>
            <div className="w-0.5 h-4 bg-[#0E7A4C]" />
          </div>

          {/* ---------------------------------------------------- */}
          {/* TINGKAT 4: 4 DIVISI SEKBID (MOBILE OPTIMIZED) */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                Tingkat IV: 4 Divisi Seksi Bidang (Sekbid)
              </span>

              {/* Division Quick Filter Pill Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedDivisionFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedDivisionFilter === 'all'
                      ? 'bg-[#0E7A4C] text-[#C8A951]'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  Semua (4 Divisi)
                </button>
                {OFFICIAL_ORGANOGRAM_2026.divisions.map((div) => {
                  const isSelected = selectedDivisionFilter === div.id;
                  const shortName = div.name.replace('Divisi ', '');
                  return (
                    <button
                      key={div.id}
                      type="button"
                      onClick={() => setSelectedDivisionFilter(div.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#0E7A4C] text-[#C8A951]'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                      }`}
                    >
                      <span>{shortName}</span>
                      <span className="text-[10px] opacity-75">({div.members.length})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Division Cards Stack (Responsive 1 or 2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {visibleDivisions.map((div) => {
                const colorStyles = {
                  emerald: {
                    border: 'border-emerald-500/40 hover:border-emerald-500',
                    headerBg: 'bg-emerald-50/80 dark:bg-emerald-950/50',
                    badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    icon: <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  },
                  blue: {
                    border: 'border-blue-500/40 hover:border-blue-500',
                    headerBg: 'bg-blue-50/80 dark:bg-blue-950/50',
                    badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    icon: <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  },
                  purple: {
                    border: 'border-purple-500/40 hover:border-purple-500',
                    headerBg: 'bg-purple-50/80 dark:bg-purple-950/50',
                    badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                    icon: <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  },
                  amber: {
                    border: 'border-amber-500/40 hover:border-amber-500',
                    headerBg: 'bg-amber-50/80 dark:bg-amber-950/50',
                    badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    icon: <HeartPulse className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  }
                }[div.colorScheme];

                const koordinatorName = div.members[0];
                const staffMembers = div.members.slice(1);

                return (
                  <div
                    key={div.id}
                    className={`rounded-2xl bg-white dark:bg-zinc-900 border p-3 sm:p-4 shadow-sm space-y-2.5 transition-all ${colorStyles.border}`}
                  >
                    {/* Header */}
                    <div className={`p-2.5 rounded-xl ${colorStyles.headerBg} flex items-center justify-between gap-2 border border-black/5 dark:border-white/5`}>
                      <div className="flex items-center gap-2">
                        {colorStyles.icon}
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 block leading-tight">
                            {div.arabicName}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white leading-tight">
                            {div.name}
                          </h4>
                        </div>
                      </div>
                      <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold border ${colorStyles.badge}`}>
                        {div.members.length} Santri
                      </span>
                    </div>

                    {/* Koordinator Divisi Box */}
                    <div
                      className={`p-2.5 rounded-xl transition-all ${
                        isMatch(koordinatorName)
                          ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/80'
                          : 'bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[9.5px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-500" />
                          <span>Koordinator Divisi:</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E7A4C] text-[#C8A951] font-bold">
                          Koord. Utama
                        </span>
                      </div>
                      <p className="font-black text-xs sm:text-sm text-zinc-900 dark:text-white mt-0.5">
                        {koordinatorName}
                      </p>
                    </div>

                    {/* Anggota Directional Arrow */}
                    <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-zinc-400 py-0.5">
                      <ArrowDown className="w-3 h-3 text-zinc-400" />
                      <span>Anggota Pelaksana ({staffMembers.length} Santri)</span>
                    </div>

                    {/* Anggota Members Mobile Grid (2 Columns, No internal scroll trap) */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {staffMembers.map((mName, mIdx) => {
                        const matched = isMatch(mName);
                        return (
                          <div
                            key={mIdx}
                            className={`p-1.5 sm:p-2 rounded-lg flex items-center gap-1.5 text-xs transition-all ${
                              matched
                                ? 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-bold ring-1 ring-amber-400 scale-[1.02]'
                                : 'bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-md text-[9px] font-bold flex items-center justify-center shrink-0 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                              {mIdx + 2}
                            </span>
                            <span className="truncate text-[11px] sm:text-xs font-medium">
                              {mName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT: MODE 2 - KANVAS POHON MEJA (CANVAS)     */}
      {/* ======================================================== */}
      {activeViewMode === 'canvas' && (
        <div className="space-y-2">
          {/* Mobile Pan Helper Banner */}
          <div className="mx-3 sm:mx-6 mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs">
                💡 Geser layar secara horizontal untuk menelusuri bagan hierarki penuh.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveViewMode('flow')}
              className="text-[#0E7A4C] dark:text-[#C8A951] font-bold underline text-[11px] shrink-0 cursor-pointer"
            >
              Mode Vertikal
            </button>
          </div>

          <div className="p-3 sm:p-6 overflow-x-auto select-none no-scrollbar touch-pan-x">
            <div
              className="min-w-[880px] mx-auto space-y-7 transition-transform origin-top duration-200 pb-4"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* TINGKAT 1: KEPALA SEKOLAH, WAKA & PEMBINA OSIS */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-[#0E7A4C] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Tingkat I: Pimpinan Madrasah &amp; Garis Pembinaan
                  </span>
                </div>

                {/* Node Kepala Sekolah */}
                <div className="max-w-md mx-auto">
                  <div
                    className={`p-4 rounded-2xl text-center space-y-1.5 transition-all shadow-md relative ${
                      isMatch(OFFICIAL_ORGANOGRAM_2026.advisors[0].name)
                        ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/80 scale-105'
                        : 'bg-gradient-to-b from-amber-500/15 via-white to-white dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-900 border-2 border-[#C8A951]'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-[10px] uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{OFFICIAL_ORGANOGRAM_2026.advisors[0].role}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-tight">
                      {OFFICIAL_ORGANOGRAM_2026.advisors[0].name}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium">
                      {OFFICIAL_ORGANOGRAM_2026.advisors[0].title}
                    </p>
                    <span className="inline-block text-[9.5px] px-2 py-0.5 rounded-md bg-[#0E7A4C] text-[#C8A951] font-bold">
                      Penanggung Jawab Tertinggi
                    </span>
                  </div>
                </div>

                {/* Branch Down to Waka & Pembina with Directional Arrow */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-[#C8A951]" />
                  <div className="w-3/5 border-t-2 border-dashed border-amber-500 relative flex justify-between">
                    {/* Left arrow down to Waka */}
                    <div className="flex flex-col items-center -ml-1 -mt-0.5">
                      <div className="w-0.5 h-4 bg-amber-500" />
                      <ArrowDown className="w-3.5 h-3.5 text-amber-600 -mt-1 stroke-[2.5]" />
                    </div>
                    {/* Center arrow directly to leaders */}
                    <div className="flex flex-col items-center -mt-0.5">
                      <div className="w-0.5 h-4 bg-[#0E7A4C]" />
                      <ArrowDown className="w-3.5 h-3.5 text-[#0E7A4C] -mt-1 stroke-[3]" />
                    </div>
                    {/* Right arrow down to Pembina */}
                    <div className="flex flex-col items-center -mr-1 -mt-0.5">
                      <div className="w-0.5 h-4 bg-amber-500" />
                      <ArrowDown className="w-3.5 h-3.5 text-amber-600 -mt-1 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Waka Kesiswaan & Pembina OSIS */}
                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto pt-1">
                  <div
                    className={`p-3.5 rounded-2xl text-center space-y-1 transition-all shadow-xs ${
                      isMatch(OFFICIAL_ORGANOGRAM_2026.advisors[1].name)
                        ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                        : 'bg-white dark:bg-zinc-900 border border-amber-400/60 dark:border-amber-700/60'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{OFFICIAL_ORGANOGRAM_2026.advisors[1].role}</span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white leading-tight">
                      {OFFICIAL_ORGANOGRAM_2026.advisors[1].name}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500">
                      {OFFICIAL_ORGANOGRAM_2026.advisors[1].title}
                    </p>
                    <span className="inline-block text-[9px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                      Garis Pengarah Kesiswaan
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-center space-y-1 transition-all shadow-xs ${
                      isMatch(OFFICIAL_ORGANOGRAM_2026.advisors[2].name)
                        ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                        : 'bg-white dark:bg-zinc-900 border border-amber-400/60 dark:border-amber-700/60'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{OFFICIAL_ORGANOGRAM_2026.advisors[2].role}</span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white leading-tight">
                      {OFFICIAL_ORGANOGRAM_2026.advisors[2].name}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500">
                      {OFFICIAL_ORGANOGRAM_2026.advisors[2].title}
                    </p>
                    <span className="inline-block text-[9px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                      Garis Pembinaan &amp; Evaluasi
                    </span>
                  </div>
                </div>

                {/* Main Downward Command Flow Arrow to Level 2 */}
                <div className="flex flex-col items-center pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-[#0E7A4C]/30 text-[10px] font-bold text-[#0E7A4C] dark:text-emerald-300">
                    <ArrowDown className="w-3 h-3 text-[#0E7A4C] stroke-[3]" />
                    <span>Mandat &amp; Instruksi Kepengurusan Utama</span>
                  </div>
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#0E7A4C] to-emerald-700" />
                  <ArrowDown className="w-4 h-4 text-emerald-700 -mt-1.5 stroke-[3]" />
                </div>
              </div>

              {/* TINGKAT 2: KETUA & WAKIL KETUA OSIS */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Tingkat II: Presidium Pimpinan Utama OSIS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {OFFICIAL_ORGANOGRAM_2026.leaders.map((leader, idx) => {
                    const isChair = idx === 0;
                    const highlighted = isMatch(leader.name) || isMatch(leader.role);

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl transition-all duration-300 text-center space-y-2 shadow-sm ${
                          highlighted
                            ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60 scale-105'
                            : isChair
                            ? 'bg-gradient-to-br from-[#0E7A4C]/15 via-white to-white dark:from-emerald-950/50 dark:via-zinc-900 dark:to-zinc-900 border-2 border-[#0E7A4C]'
                            : 'bg-white dark:bg-zinc-900 border-2 border-emerald-600/40 hover:border-emerald-600'
                        }`}
                      >
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#0E7A4C] dark:text-emerald-400">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>{leader.role}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-tight">
                          {leader.name}
                        </h4>
                        <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-[#0E7A4C] text-[#C8A951] font-bold">
                          {leader.badge}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Horizontal Coordination Line between Ketua & Wakil */}
                <div className="max-w-md mx-auto flex items-center justify-center gap-2 -mt-1 text-[10px] font-bold text-zinc-400">
                  <span className="w-16 border-t-2 border-dotted border-blue-400" />
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    ↔ Garis Koordinasi Presidium
                  </span>
                  <span className="w-16 border-t-2 border-dotted border-blue-400" />
                </div>

                {/* Downward Command Arrow to BPH Inti */}
                <div className="flex flex-col items-center pt-1">
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-400/40 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    <ArrowDown className="w-3 h-3 text-blue-600 stroke-[3]" />
                    <span>Instruksi Administrasi &amp; Anggaran</span>
                  </div>
                  <div className="w-0.5 h-6 bg-gradient-to-b from-blue-600 to-blue-700" />
                  <ArrowDown className="w-4 h-4 text-blue-700 -mt-1.5 stroke-[3]" />
                </div>
              </div>

              {/* TINGKAT 3: SEKRETARIS & BENDAHARA */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-3.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    Tingkat III: Badan Pengurus Harian (BPH Inti)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div
                    className={`p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border transition-all text-center space-y-1.5 shadow-xs ${
                      isMatch(OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name)
                        ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                        : 'border-blue-200 dark:border-blue-800/80'
                    }`}
                  >
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                      Sekretaris OSIS
                    </span>
                    <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                      {OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name}
                    </h5>
                    <span className="inline-block text-[9.5px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60">
                      Administrasi, Notula &amp; Arsip Surat
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border transition-all text-center space-y-1.5 shadow-xs ${
                      OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.some(isMatch)
                        ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                        : 'border-amber-200 dark:border-amber-800/80'
                    }`}
                  >
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      Bendahara OSIS
                    </span>
                    <div className="space-y-0.5">
                      {OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.map((tName, i) => (
                        <h5 key={i} className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                          {tName}
                        </h5>
                      ))}
                    </div>
                    <span className="inline-block text-[9.5px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/60">
                      Tata Kelola Dana Kas &amp; Anggaran
                    </span>
                  </div>
                </div>

                {/* 4-Way Branched Command Line with Arrows into 4 Divisions */}
                <div className="relative pt-2 pb-1">
                  <div className="flex items-center justify-center gap-1.5 pb-2">
                    <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                      <ArrowDown className="w-3 h-3 text-[#0E7A4C]" />
                      <span>Instruksi Pelaksanaan Program Kerja ke 4 Divisi Sekbid</span>
                    </span>
                  </div>

                  <div className="w-0.5 h-6 mx-auto bg-[#0E7A4C]" />

                  <div className="w-[88%] mx-auto border-t-2 border-[#0E7A4C] relative flex justify-between">
                    <div className="flex flex-col items-center -ml-2 -mt-0.5">
                      <div className="w-0.5 h-6 bg-emerald-600" />
                      <ArrowDown className="w-4 h-4 text-emerald-600 -mt-1 stroke-[3]" />
                    </div>

                    <div className="flex flex-col items-center -mt-0.5">
                      <div className="w-0.5 h-6 bg-blue-600" />
                      <ArrowDown className="w-4 h-4 text-blue-600 -mt-1 stroke-[3]" />
                    </div>

                    <div className="flex flex-col items-center -mt-0.5">
                      <div className="w-0.5 h-6 bg-purple-600" />
                      <ArrowDown className="w-4 h-4 text-purple-600 -mt-1 stroke-[3]" />
                    </div>

                    <div className="flex flex-col items-center -mr-2 -mt-0.5">
                      <div className="w-0.5 h-6 bg-amber-600" />
                      <ArrowDown className="w-4 h-4 text-amber-600 -mt-1 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TINGKAT 4: 4 DIVISI SEKBID TEKNIS */}
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
                    Tingkat IV: 4 Divisi Seksi Bidang (Sekbid) Pelaksana
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {OFFICIAL_ORGANOGRAM_2026.divisions.map((div) => {
                    const colorStyles = {
                      emerald: {
                        border: 'border-emerald-500/50 hover:border-emerald-500',
                        headerBg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
                        badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      },
                      blue: {
                        border: 'border-blue-500/50 hover:border-blue-500',
                        headerBg: 'bg-blue-50/70 dark:bg-blue-950/40',
                        badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                      },
                      purple: {
                        border: 'border-purple-500/50 hover:border-purple-500',
                        headerBg: 'bg-purple-50/70 dark:bg-purple-950/40',
                        badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                      },
                      amber: {
                        border: 'border-amber-500/50 hover:border-amber-500',
                        headerBg: 'bg-amber-50/70 dark:bg-amber-950/40',
                        badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }
                    }[div.colorScheme];

                    return (
                      <div
                        key={div.id}
                        className={`rounded-2xl bg-white dark:bg-zinc-900 border p-3.5 shadow-sm space-y-3 transition-all ${colorStyles.border}`}
                      >
                        <div className={`p-2 rounded-xl ${colorStyles.headerBg} space-y-1`}>
                          <span className="text-[10px] font-mono font-bold text-zinc-400 block truncate">
                            {div.arabicName}
                          </span>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white leading-tight">
                              {div.name}
                            </h4>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold shrink-0 ${colorStyles.badge}`}>
                              {div.members.length} Santri
                            </span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs">
                          <span className="text-[9.5px] uppercase font-bold text-zinc-500 block">
                            Koordinator Divisi:
                          </span>
                          <p className="font-black text-zinc-900 dark:text-white">
                            {div.members[0]}
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-[9.5px] font-bold text-zinc-400">
                          <ArrowDown className="w-3 h-3 text-zinc-400" />
                          <span>Anggota Pelaksana:</span>
                        </div>

                        <div className="space-y-1 max-h-64 overflow-y-auto no-scrollbar pr-0.5">
                          {div.members.slice(1).map((memberName, mIdx) => {
                            const matched = isMatch(memberName);

                            return (
                              <div
                                key={mIdx}
                                className={`p-1.5 rounded-lg flex items-center gap-2 text-xs transition-all ${
                                  matched
                                    ? 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-bold ring-1 ring-amber-400 scale-[1.02]'
                                    : 'bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                }`}
                              >
                                <span className="w-4 h-4 rounded-md text-[9.5px] font-bold flex items-center justify-center shrink-0 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                                  {mIdx + 2}
                                </span>
                                <span className="truncate leading-tight font-medium">
                                  {memberName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT: MODE 3 - KARTU RINCI (GRID HIERARKI)    */}
      {/* ======================================================== */}
      {activeViewMode === 'cards' && (
        <div className="p-3.5 sm:p-6 space-y-6">
          {/* Pimpinan & Pembina */}
          <section className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Tingkat I: Pimpinan Madrasah &amp; Garis Pengarah</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OFFICIAL_ORGANOGRAM_2026.advisors.map((adv, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border space-y-1.5 transition-all ${
                    isMatch(adv.name) || isMatch(adv.role)
                      ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/70 dark:bg-amber-950/60'
                      : 'border-zinc-200 dark:border-zinc-700/60'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    {adv.role}
                  </span>
                  <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                    {adv.name}
                  </h5>
                  <p className="text-xs text-zinc-500 leading-snug">{adv.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Presidium & BPH */}
          <section className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tingkat II &amp; III: Presidium &amp; Badan Pengurus Harian</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {OFFICIAL_ORGANOGRAM_2026.leaders.map((leader, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-amber-500/10 border space-y-1.5 transition-all ${
                    isMatch(leader.name) || isMatch(leader.role)
                      ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/70 dark:bg-amber-950/60'
                      : 'border-emerald-500/30'
                  }`}
                >
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    {leader.role}
                  </span>
                  <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                    {leader.name}
                  </h5>
                  <span className="inline-block text-[9.5px] px-2 py-0.5 rounded-full bg-[#0E7A4C] text-[#C8A951] font-bold">
                    {leader.badge}
                  </span>
                </div>
              ))}

              <div
                className={`p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border space-y-1.5 transition-all ${
                  isMatch(OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name)
                    ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/70 dark:bg-amber-950/60'
                    : 'border-zinc-200 dark:border-zinc-700/60'
                }`}
              >
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                  Sekretaris OSIS
                </span>
                <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                  {OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name}
                </h5>
                <p className="text-xs text-zinc-500">Administrasi &amp; Persuratan Sekolah</p>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border space-y-1.5 transition-all ${
                  OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.some(isMatch)
                    ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/70 dark:bg-amber-950/60'
                    : 'border-zinc-200 dark:border-zinc-700/60'
                }`}
              >
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Bendahara OSIS
                </span>
                <div className="space-y-0.5">
                  {OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.map((n, i) => (
                    <h5 key={i} className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                      {n}
                    </h5>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">Kebendaharaan &amp; Transparansi Kas</p>
              </div>
            </div>
          </section>

          {/* 4 Divisi Sekbid */}
          <section className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tingkat IV: 4 Divisi Seksi Bidang (Sekbid) Pelaksana</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OFFICIAL_ORGANOGRAM_2026.divisions.map((div) => (
                <div
                  key={div.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block">{div.arabicName}</span>
                      <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                        {div.name}
                      </h5>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {div.members.length} Santri
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {div.members.map((mName, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
                          i === 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                            : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 text-[9px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="truncate">{mName}</span>
                        {i === 0 && (
                          <span className="ml-auto text-[8.5px] px-1 py-0.2 rounded bg-emerald-700 text-white font-bold">
                            Koord
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FOOTER NOTE & SLOGAN                                  */}
      {/* ======================================================== */}
      <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] sm:text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Bagan resmi disahkan oleh Kepala Sekolah &amp; Pembina OSIS Masa Bakti 2026/2027.
          </span>
        </div>
        <span className="font-semibold text-emerald-800 dark:text-emerald-300 italic">
          &quot;{OSIS_METADATA_2026.mottoShort}&quot;
        </span>
      </div>

      {/* ======================================================== */}
      {/* 5. MODAL ARSIP SCAN CETAK ASLI                           */}
      {/* ======================================================== */}
      {showFlyerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2.5 sm:p-6 animate-in fade-in duration-200 select-none">
          <div className="flex items-center justify-between pb-2 text-white border-b border-white/20">
            <div>
              <h4 className="font-bold text-xs sm:text-base text-[#C8A951]">
                Pindai Dokumen Asli Bagan Struktur OSIS SMP Plus JM 2026-2027
              </h4>
              <p className="text-[10.5px] sm:text-xs text-zinc-300">
                Pindai arsip visual fisik resmi yang diterbitkan sekolah
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFlyerModal(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-1 sm:p-4">
            <img
              src={OSIS_METADATA_2026.chartImageUrl}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = OSIS_METADATA_2026.chartImageFallback;
              }}
              alt="Pindai Dokumen Asli Bagan Struktur OSIS"
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
