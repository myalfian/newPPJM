import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { OSIS_METADATA_2026 } from './osisData';
import { OsisHtmlOrganogram } from './OsisHtmlOrganogram';

export const OsisStructureSection: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* 1. Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Kabinet Khidmah Santri Masa Bakti 2026/2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Bagan &amp; Struktur Pengurus OSIS
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Kepengurusan OSIS SMP Plus Jauharul Maknuun mengemban amanah penegakan kedisiplinan dan pengembangan potensi santri.
        </p>
      </div>

      {/* 2. Slogan & Semboyan Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E7A4C] via-emerald-800 to-[#09482c] text-white p-4 sm:p-6 shadow-md border border-[#C8A951]/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-[#C8A951]/40 text-[#C8A951] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Slogan &amp; Semboyan Resmi OSIS 2026/2027</span>
          </div>
          <blockquote className="text-base sm:text-xl font-bold text-white leading-relaxed italic border-l-4 border-[#C8A951] pl-3 sm:pl-4">
            &quot;{OSIS_METADATA_2026.slogan}&quot;
          </blockquote>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            ✨ {OSIS_METADATA_2026.motto}
          </p>
          <div className="inline-block px-3 py-1 rounded-lg bg-emerald-950/60 text-[#C8A951] font-mono font-bold text-xs">
            {OSIS_METADATA_2026.mottoShort}
          </div>
        </div>
      </div>

      {/* 3. Official Structure Organogram (Bagan Interaktif HTML) */}
      <section className="space-y-2">
        <OsisHtmlOrganogram />
      </section>
    </div>
  );
};
