import React from 'react';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MOCK_PROFILE_DATA } from './ProfileSection';

export const VisiMisiSection: React.FC = () => {
  const { vision, missions, values } = MOCK_PROFILE_DATA;

  return (
    <div className="space-y-6">
      {/* Visi: Banner Statement Besar Glassmorphism */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-emerald-950 via-[#07361f] to-emerald-950 border border-emerald-800/40 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Visi Utama Lembaga</span>
          </span>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-relaxed text-zinc-100">
            &ldquo;{vision}&rdquo;
          </h2>
        </div>
      </div>

      {/* Misi: Grid Kartu Bernomor dengan Hover-Lift Effect */}
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

      {/* Nilai-Nilai Dasar (Core Values) */}
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
    </div>
  );
};

