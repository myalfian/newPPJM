import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database, X, ChevronRight, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const EnvAlertBanner: React.FC = () => {
  const configured = isSupabaseConfigured();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!configured) {
      // Periksa apakah notifikasi telah ditutup dalam sesi browser ini
      const dismissed = sessionStorage.getItem('ppjm_dataset_alert_dismissed') === 'true';
      if (!dismissed) {
        setIsOpen(true);
      }
    }
  }, [configured]);

  if (configured) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('ppjm_dataset_alert_dismissed', 'true');
  };

  const handleCopyEnv = () => {
    const text = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <>
      {/* Floating Pill Trigger (Tampil di pojok bawah saat modal tertutup agar tetap bisa diakses kapan saja) */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="fixed bottom-24 md:bottom-6 left-4 z-40 pointer-events-auto select-none"
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 dark:bg-amber-400/15 dark:hover:bg-amber-400/25 border border-amber-500/40 dark:border-amber-400/30 backdrop-blur-md text-amber-900 dark:text-amber-200 text-xs font-bold shadow-lg transition-all duration-200 hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
            title="Klik untuk membuka informasi Mode Dataset Autentik"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <Database className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
            <span className="tracking-tight font-extrabold">Mode Dataset Autentik</span>
          </button>
        </motion.div>
      )}

      {/* Card Modal dengan Background Transparan & Efek Frosted Glass */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Transparent Frosted Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md cursor-pointer"
              aria-hidden="true"
            />

            {/* Glassmorphism Card Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className="relative w-full max-w-md sm:max-w-lg bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6.5 border border-amber-400/40 dark:border-amber-500/30 shadow-[0_25px_60px_-15px_rgba(217,119,6,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden z-10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="env-alert-title"
            >
              {/* Ambient Gold Radial Glow Background */}
              <div 
                className="absolute -top-24 -right-24 w-52 h-52 bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-transparent rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div 
                className="absolute -bottom-24 -left-24 w-52 h-52 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer z-10"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4 stroke-[2.4]" />
              </button>

              {/* Header with Icon Badge */}
              <div className="flex items-start gap-3.5 pr-8">
                <div className="relative shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
                  <Database className="w-5.5 h-5.5 stroke-[2.2]" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                  </span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300/70 dark:border-amber-700/50 text-[10.5px] font-extrabold text-amber-900 dark:text-amber-300 tracking-wide uppercase mb-1">
                    <ShieldCheck className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                    Kemandirian Data Aktif
                  </div>
                  <h2 id="env-alert-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                    Mode Dataset Autentik Aktif
                  </h2>
                </div>
              </div>

              {/* Content Description */}
              <div className="mt-3.5 space-y-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Platform berjalan lancar dengan dataset awal pesantren terpasang secara mandiri. Semua halaman informasi, kurikulum, galeri, dan modul STEM siap digunakan.
                </p>
                <p>
                  Untuk menghubungkan sinkronisasi database live (Supabase), pasang kredensial proyek Anda di file <code className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-bold">.env</code>:
                </p>
              </div>

              {/* Code Snippet Box with 1-Click Copy */}
              <div className="mt-3 relative rounded-2xl bg-slate-950/90 text-slate-200 p-3 font-mono text-[11px] leading-relaxed border border-slate-800 shadow-inner group">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800 font-sans">
                  <span>File: .env</span>
                  <button
                    type="button"
                    onClick={handleCopyEnv}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Format</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto text-amber-300/90 py-0.5">
                  <code>
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                  </code>
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-2.5">
                <Link
                  to="/admin"
                  onClick={handleClose}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-600/25 transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Panduan Setup Admin</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto sm:ml-0" />
                </Link>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup & Lanjutkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
