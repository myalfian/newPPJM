import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database, AlertCircle, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EnvAlertBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const configured = isSupabaseConfigured();

  if (configured || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 text-emerald-950 px-4 py-2 text-xs font-semibold shadow-sm flex items-center justify-between border-b border-amber-600/20">
      <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1 justify-center sm:justify-start">
        <Database className="w-4 h-4 text-emerald-950 flex-shrink-0 animate-pulse" />
        <span>
          <strong>Mode Dataset Autentik Aktif:</strong> Platform berjalan dengan data awal pesantren terpasang. Sambungkan kredensial Supabase live Anda di file <code className="bg-white/40 px-1 py-0.5 rounded font-mono">.env</code> untuk sinkronisasi database penuh.
        </span>
        <Link
          to="/admin"
          className="hidden md:inline-flex items-center gap-0.5 underline font-bold hover:text-white transition-colors"
        >
          <span>Panduan Setup Admin</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
