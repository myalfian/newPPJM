import React, { useState, useEffect } from 'react';
import { Quote, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { SafeRichContent } from '../../components/common/SafeRichContent';

export const SambutanSection: React.FC = () => {
  const [sambutans, setSambutans] = useState<SambutanPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeSambutan = async () => {
    if (!isSupabaseConfigured()) {
      setError('Koneksi Supabase belum terkonfigurasi pada sistem.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('sambutan_persons')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('order_index', { ascending: true });

      if (err) {
        console.error('[SambutanSection] Error fetching sambutan:', err);
        setError(`Gagal memuat: ${err.message} (Code: ${err.code || 'ERR'})`);
        setSambutans([]);
      } else {
        setSambutans((data as SambutanPerson[]) || []);
      }
    } catch (e: any) {
      console.error('[SambutanSection] Unexpected error:', e);
      setError(`Gagal memuat data sambutan: ${e.message || 'Koneksi terputus'}`);
      setSambutans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeSambutan();

    // Subscribe to realtime updates on sambutan_persons
    const channel = supabase
      .channel('public-home-sambutan')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        () => {
          fetchHomeSambutan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 1. Loading Pulse Skeleton
  if (loading && sambutans.length === 0) {
    return (
      <div className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xs animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm aspect-[4/5] rounded-3xl bg-slate-200 dark:bg-zinc-800" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-9 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-16 w-full bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-4/6 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error Display (Jangan fallback seed!)
  if (error && sambutans.length === 0) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-8 text-center space-y-4">
        <div className="inline-flex p-3 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-2xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
            Gagal Memuat Naskah Sambutan
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 max-w-md mx-auto">
            {error}. Periksa koneksi internet atau hak akses policy (RLS) pada Supabase.
          </p>
        </div>
        <button
          onClick={fetchHomeSambutan}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  // 3. Empty State (Jangan fallback seed!)
  if (sambutans.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-3">
        <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-2xl">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Belum Ada Naskah Sambutan
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Naskah sambutan pengasuh belum tersedia. Silakan hubungi administrator pesantren melalui CMS.
        </p>
      </div>
    );
  }

  // 4. Render Live Featured Sambutan
  const featured = sambutans.find((s) => s.is_featured) || sambutans[0];
  const photoUrl = featured.photo_url || '/logo-ppjm.svg';
  const shortQuote = featured.message_short || (featured.message_full ? featured.message_full.slice(0, 240) + '...' : '');

  return (
    <div className="space-y-6">
      <section className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-8 lg:p-10 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Foto Resmi Pengasuh */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-700/20 shadow-xl shadow-emerald-950/15 group bg-slate-100 dark:bg-zinc-800">
              <img
                src={photoUrl}
                alt={featured.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  {featured.title}
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
                  {featured.name}
                </h3>
                <p className="text-xs text-emerald-100/80">
                  {featured.role_type === 'pengasuh' ? 'Pimpinan & Pengasuh Pesantren' : 'Dewan Asatidz & Pengurus'}
                </p>
              </div>
            </div>
          </div>

          {/* Narasi Sambutan */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5" />
              <span>Pesan Pimpinan Pondok Pesantren</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
              Mendidik dengan Adab, Membina dengan Al-Qur&apos;an, Menjawab Tantangan Zaman
            </h2>

            {/* Styling Quote */}
            {shortQuote && (
              <blockquote className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 py-1 italic text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-serif bg-amber-50/40 dark:bg-amber-950/20 rounded-r-2xl">
                &ldquo;{shortQuote}&rdquo;
              </blockquote>
            )}

            {/* Full Message Rich Content */}
            {featured.message_full ? (
              <SafeRichContent
                content={featured.message_full}
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal space-y-3"
              />
            ) : (
              <p className="text-xs sm:text-sm text-zinc-500 italic">
                Naskah lengkap belum dicantumkan.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SambutanSection;
