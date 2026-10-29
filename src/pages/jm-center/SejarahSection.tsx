import React from 'react';
import { Landmark } from 'lucide-react';
import { MOCK_PROFILE_DATA } from './ProfileSection';

export const SejarahSection: React.FC = () => {
  const { history } = MOCK_PROFILE_DATA;

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

        {/* Timeline Vertikal Modern */}
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
      </section>
    </div>
  );
};

