import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import { OFFICIAL_ORGANOGRAM_2026, OSIS_METADATA_2026 } from './osisData';

export const OsisHtmlOrganogram: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'tree' | 'cards'>('tree');
  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLegend, setShowLegend] = useState(true);

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

  return (
    <div className="space-y-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-[#0E7A4C] to-[#042818] text-white flex flex-col md:flex-row md:items-center justify-between gap-3.5 border-b border-[#C8A951]/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-[#C8A951]/40 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#C8A951]" />
            <span>Dokumen Tata Kelola Resmi • Garis Komando &amp; Koordinasi</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Bagan Struktur Organisasi OSIS</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#C8A951] text-[#042818] font-bold font-mono">
              2026/2027
            </span>
          </h3>
          <p className="text-xs text-emerald-100/85">
            SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik • Total {totalMembersCount} Pengurus &amp; Pembina
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'tree'
                  ? 'bg-[#C8A951] text-[#042818] shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Bagan Pohon (Tree)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'cards'
                  ? 'bg-[#C8A951] text-[#042818] shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu Rinci (Grid)</span>
            </button>
          </div>

          {/* Zoom controls for Tree View */}
          {activeViewMode === 'tree' && (
            <div className="hidden lg:flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
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
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="p-1.5 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Reset Ukuran"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Button to view stamped archival scan */}
          <button
            type="button"
            onClick={() => setShowFlyerModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#C8A951]" />
            <span className="hidden sm:inline">Pindai Arsip Cetak</span>
            <span className="sm:hidden">Arsip Asli</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Search Box & Quick Legend Toggle */}
      <div className="px-4 sm:px-6 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative max-w-md flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pengurus (misal: Afif, Yumma, Ofat, Desta, Ghazy...)"
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0E7A4C]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-[#0E7A4C] dark:hover:text-emerald-400 font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showLegend ? 'Sembunyikan Legenda' : 'Petunjuk Garis Komando'}</span>
        </button>
      </div>

      {/* Legenda Garis Komando & Koordinasi */}
      {showLegend && (
        <div className="mx-4 sm:mx-6 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-1 bg-[#0E7A4C] rounded-full inline-block" />
            <span className="flex items-center gap-1 font-bold text-zinc-800 dark:text-zinc-200">
              <span>Garis Komando (Instruksi Resmi)</span>
              <span className="text-[#0E7A4C] font-mono">↓</span>
            </span>
            <span className="text-[11px] text-zinc-500">: Alur mandat tugas &amp; instruksi hierarkis langsung</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-7 h-0 border-t-2 border-dashed border-amber-500 inline-block" />
            <span className="flex items-center gap-1 font-bold text-zinc-800 dark:text-zinc-200">
              <span>Garis Pembinaan &amp; Bimbingan</span>
              <span className="text-amber-600 font-mono">↓</span>
            </span>
            <span className="text-[11px] text-zinc-500">: Pendampingan teknis &amp; konsultasi berkala</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-7 h-0 border-t-2 border-dotted border-blue-500 inline-block" />
            <span className="flex items-center gap-1 font-bold text-zinc-800 dark:text-zinc-200">
              <span>Garis Koordinasi</span>
              <span className="text-blue-600 font-mono">↔</span>
            </span>
            <span className="text-[11px] text-zinc-500">: Kerja sama kemitraan antardivisi &amp; BPH</span>
          </div>
        </div>
      )}

      {/* 3. MAIN ORGANOGRAM CONTENT */}
      {activeViewMode === 'tree' ? (
        <div className="p-4 sm:p-6 overflow-x-auto select-none no-scrollbar">
          <div
            className="min-w-[880px] mx-auto space-y-7 transition-transform origin-top duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* ======================================================== */}
            {/* TINGKAT 1: KEPALA SEKOLAH, WAKA & PEMBINA OSIS */}
            {/* ======================================================== */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[10.5px] font-black uppercase tracking-widest text-[#0E7A4C] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Tingkat I: Pimpinan Madrasah &amp; Garis Pembinaan
                </span>
              </div>

              {/* Node Kepala Sekolah (Top Center) */}
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

              {/* Waka Kesiswaan (Left) & Pembina OSIS (Right) */}
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto pt-1">
                {/* Waka Kesiswaan */}
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

                {/* Pembina OSIS */}
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

            {/* ======================================================== */}
            {/* TINGKAT 2: KETUA & WAKIL KETUA OSIS */}
            {/* ======================================================== */}
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

            {/* ======================================================== */}
            {/* TINGKAT 3: SEKRETARIS & BENDAHARA (BPH INTI) */}
            {/* ======================================================== */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[10.5px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-3.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  Tingkat III: Badan Pengurus Harian (BPH Inti)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Sekretaris */}
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

                {/* Bendahara */}
                <div
                  className={`p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border transition-all text-center space-y-1.5 shadow-xs ${
                    OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.some(isMatch)
                      ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/60'
                      : 'border-amber-200 dark:border-amber-800/80'
                  }`}
                >
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    Bendahara OSIS (1 &amp; 2)
                  </span>
                  <div className="space-y-0.5">
                    {OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.map((tName, i) => (
                      <h5 key={i} className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                        {i + 1}. {tName}
                      </h5>
                    ))}
                  </div>
                  <span className="inline-block text-[9.5px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/60">
                    Tata Kelola Dana Kas &amp; Anggaran Kegiatan
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

                {/* Vertical Stem */}
                <div className="w-0.5 h-6 mx-auto bg-[#0E7A4C]" />

                {/* Horizontal Rail spanning 4 divisions with arrowheads */}
                <div className="w-[88%] mx-auto border-t-2 border-[#0E7A4C] relative flex justify-between">
                  {/* Branch 1: Divisi Pendidikan */}
                  <div className="flex flex-col items-center -ml-2 -mt-0.5">
                    <div className="w-0.5 h-6 bg-emerald-600" />
                    <ArrowDown className="w-4 h-4 text-emerald-600 -mt-1 stroke-[3]" />
                  </div>

                  {/* Branch 2: Divisi Bahasa */}
                  <div className="flex flex-col items-center -mt-0.5">
                    <div className="w-0.5 h-6 bg-blue-600" />
                    <ArrowDown className="w-4 h-4 text-blue-600 -mt-1 stroke-[3]" />
                  </div>

                  {/* Branch 3: Divisi Keamanan */}
                  <div className="flex flex-col items-center -mt-0.5">
                    <div className="w-0.5 h-6 bg-purple-600" />
                    <ArrowDown className="w-4 h-4 text-purple-600 -mt-1 stroke-[3]" />
                  </div>

                  {/* Branch 4: Divisi Kebersihan */}
                  <div className="flex flex-col items-center -mr-2 -mt-0.5">
                    <div className="w-0.5 h-6 bg-amber-600" />
                    <ArrowDown className="w-4 h-4 text-amber-600 -mt-1 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TINGKAT 4: 4 DIVISI SEKBID TEKNIS */}
            {/* ======================================================== */}
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
                      badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
                      iconColor: 'text-emerald-600',
                      number: 'bg-emerald-600 text-white'
                    },
                    blue: {
                      border: 'border-blue-500/50 hover:border-blue-500',
                      headerBg: 'bg-blue-50/70 dark:bg-blue-950/40',
                      badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
                      iconColor: 'text-blue-600',
                      number: 'bg-blue-600 text-white'
                    },
                    purple: {
                      border: 'border-purple-500/50 hover:border-purple-500',
                      headerBg: 'bg-purple-50/70 dark:bg-purple-950/40',
                      badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
                      iconColor: 'text-purple-600',
                      number: 'bg-purple-600 text-white'
                    },
                    amber: {
                      border: 'border-amber-500/50 hover:border-amber-500',
                      headerBg: 'bg-amber-50/70 dark:bg-amber-950/40',
                      badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
                      iconColor: 'text-amber-600',
                      number: 'bg-amber-600 text-white'
                    }
                  }[div.colorScheme];

                  return (
                    <div
                      key={div.id}
                      className={`rounded-2xl bg-white dark:bg-zinc-900 border p-3.5 shadow-sm space-y-3 transition-all ${colorStyles.border}`}
                    >
                      {/* Division Header */}
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

                      {/* Koordinator Box with Down Arrow into Anggota */}
                      <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs">
                        <span className="text-[9.5px] uppercase font-bold text-zinc-500 block">
                          Koordinator Divisi:
                        </span>
                        <p className="font-black text-zinc-900 dark:text-white">
                          {div.members[0]}
                        </p>
                      </div>

                      {/* Small Downward Arrow: Koordinator to Anggota */}
                      <div className="flex items-center justify-center gap-1 text-[9.5px] font-bold text-zinc-400">
                        <ArrowDown className="w-3 h-3 text-zinc-400" />
                        <span>Anggota Pelaksana:</span>
                      </div>

                      {/* Division Members List */}
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
                              <span
                                className="w-4 h-4 rounded-md text-[9.5px] font-bold flex items-center justify-center shrink-0 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                              >
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
      ) : (
        /* ======================================================== */
        /* MODE 2: KARTU RINCI (GRID HIERARKI RESPONSIF) */
        /* ======================================================== */
        <div className="p-4 sm:p-6 space-y-6">
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
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5"
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
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-amber-500/10 border border-emerald-500/30 space-y-1.5"
                >
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    {leader.role}
                  </span>
                  <h5 className="text-base font-black text-zinc-900 dark:text-white">
                    {leader.name}
                  </h5>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#0E7A4C] text-[#C8A951] font-bold">
                    {leader.badge}
                  </span>
                </div>
              ))}

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                  Sekretaris OSIS
                </span>
                <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                  {OFFICIAL_ORGANOGRAM_2026.secretariat.secretary.name}
                </h5>
                <p className="text-xs text-zinc-500">Administrasi &amp; Persuratan Sekolah</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Bendahara OSIS (1 &amp; 2)
                </span>
                <div className="space-y-0.5">
                  {OFFICIAL_ORGANOGRAM_2026.secretariat.treasurers.names.map((n, i) => (
                    <h5 key={i} className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                      {i + 1}. {n}
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
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block">{div.arabicName}</span>
                      <h5 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                        {div.name}
                      </h5>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {div.members.length} Santri
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

      {/* 4. Footer Note & Slogan */}
      <div className="p-3.5 sm:p-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500">
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

      {/* 5. MODAL ARSIP SCAN CETAK ASLI */}
      {showFlyerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-200 select-none">
          <div className="flex items-center justify-between pb-3 text-white border-b border-white/20">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#C8A951]">
                Pindai Dokumen Asli Bagan Struktur OSIS SMP Plus JM 2026-2027
              </h4>
              <p className="text-xs text-zinc-300">
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
          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
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
