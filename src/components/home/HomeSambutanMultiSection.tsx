import React, { useState, useEffect } from 'react';
import {
  Quote,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Play,
  Award,
  Video,
  X,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Mail,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { SafeRichContent } from '../common/SafeRichContent';

export const HomeSambutanMultiSection: React.FC = () => {
  const [sambutans, setSambutans] = useState<SambutanPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Detail State
  const [activeModalPerson, setActiveModalPerson] = useState<SambutanPerson | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fetchHomeSambutanMulti = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchErr } = await supabase
        .from('sambutan_persons')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('order_index', { ascending: true });

      if (fetchErr) {
        console.error('[HomeSambutanMulti] Fetch error:', fetchErr);
        setError(`Gagal memuat: ${fetchErr.message}`);
        setSambutans([]);
      } else {
        const rows = (data || []) as SambutanPerson[];
        // Filter yang mencakup lokasi 'home' atau 'all', atau default ke semua jika kosong
        const homeList = rows.filter(
          (s) =>
            !s.location ||
            s.location.length === 0 ||
            s.location.includes('home') ||
            s.location.includes('all')
        );
        setSambutans(homeList.length > 0 ? homeList : rows);
      }
    } catch (err: any) {
      console.error('[HomeSambutanMulti] Error:', err);
      setError(err?.message || 'Gagal memuat data sambutan.');
      setSambutans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeSambutanMulti();

    // Realtime subscription
    const channel = supabase
      .channel('public-home-sambutan')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        () => {
          fetchHomeSambutanMulti();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleShareWa = (person: SambutanPerson) => {
    const text = encodeURIComponent(
      `*Kalam Hikmah & Sambutan: ${person.name}*\n_${person.title}_\n\n"${person.quote || person.message_short}"\n\nBaca selengkapnya di: ${window.location.origin}/jm-center/sambutan`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/jm-center/sambutan`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. Loading Pulse Skeleton
  if (loading && sambutans.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-0">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-m3-1 border border-slate-200/90 dark:border-zinc-800 animate-pulse flex flex-col md:flex-row items-center gap-6">
          <div className="w-40 h-52 rounded-2xl bg-slate-200 dark:bg-zinc-800 shrink-0" />
          <div className="space-y-3 flex-1 w-full">
            <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-8 w-64 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-16 w-full bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  // 2. Error State
  if (error && sambutans.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-0">
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 text-center text-xs text-rose-800 dark:text-rose-300">
          Gagal memuat naskah sambutan: {error}. Periksa RLS Supabase.
        </div>
      </section>
    );
  }

  // 3. Empty State
  if (sambutans.length === 0) {
    return null; // Tersembunyi rapi jika belum ada data aktif
  }

  const featured = sambutans.find((s) => s.is_featured) || sambutans[0];
  const otherLeaders = sambutans.filter((s) => s.id !== featured.id);

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-0 space-y-2 sm:space-y-2.5">
      {/* 1. FEATURED HERO (Tokoh Utama / Mudir) */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-4.5 shadow-sm border border-slate-200/90 dark:border-zinc-800 relative overflow-hidden card-hover-smooth">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-center">
          {/* Foto Tokoh Utama */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="w-36 h-48 sm:w-48 sm:h-60 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-50 dark:border-emerald-950 bg-slate-100 dark:bg-zinc-800">
                <img
                  src={featured.photo_url || '/logo-ppjm.svg'}
                  alt={featured.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-900 text-gold-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap border border-gold-400/20">
                {featured.title}
              </div>
            </div>
          </div>

          {/* Narasi & Konten Tokoh Utama */}
          <div className="lg:col-span-8 space-y-2 sm:space-y-2.5 text-center lg:text-left">
            <div className="flex items-center gap-1.5 justify-center lg:justify-start flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold text-gold-700 tracking-wider uppercase bg-gold-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-gold-200 dark:border-amber-800/60">
                Kalam Hikmah &amp; Ma'had Barokah
              </span>
              {featured.credentials && featured.credentials.length > 0 && (
                <div className="flex items-center gap-1">
                  {featured.credentials.map((cr, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50"
                    >
                      {cr}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 dark:text-white tracking-tight">
              {featured.name}
            </h2>

            <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400">
              {featured.title}
            </p>

            <blockquote className="text-xs sm:text-sm lg:text-base text-slate-800 dark:text-zinc-200 font-medium italic leading-relaxed border-l-0 lg:border-l-3 lg:border-emerald-700 lg:pl-3 bg-emerald-50/30 dark:bg-emerald-950/10 p-2 sm:p-0 rounded-lg">
              &ldquo;{featured.quote || featured.message_short}&rdquo;
            </blockquote>

            <div className="pt-1 flex items-center gap-2 justify-center lg:justify-start flex-wrap">
              <button
                onClick={() => setActiveModalPerson(featured)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <span>Baca Sambutan Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {featured.video_url && (
                <button
                  onClick={() => setActiveModalPerson(featured)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg text-xs font-bold transition border border-rose-200 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-rose-600" />
                  <span>Tonton Video</span>
                </button>
              )}

              <Link
                to="/jm-center/sambutan"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-emerald-800 transition underline underline-offset-4 ml-1"
              >
                <span>Daftar Seluruh Pimpinan</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID OTHER LEADERS (Jika terdapat lebih dari 1 tokoh) */}
      {otherLeaders.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sambutan Pimpinan Lembaga & Dewan Yayasan</span>
            </h3>
            <Link
              to="/jm-center/sambutan"
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Lihat Semua ({sambutans.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {otherLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-slate-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition flex items-center gap-3.5 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border-2 border-emerald-600/30 shadow-xs bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={leader.photo_url || '/logo-ppjm.svg'}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider truncate">
                    {leader.title}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {leader.name}
                  </h4>
                  {leader.quote && (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic line-clamp-1">
                      &ldquo;{leader.quote}&rdquo;
                    </p>
                  )}
                  <button
                    onClick={() => setActiveModalPerson(leader)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 transition cursor-pointer pt-0.5"
                  >
                    <span>Lihat Sambutan</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MODAL DETAIL POPUP */}
      {activeModalPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto modal-smooth-backdrop">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] modal-smooth-dialog">
            {/* Modal Header */}
            <div className="p-3 sm:p-3.5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-emerald-600 shrink-0">
                  <img
                    src={activeModalPerson.photo_url || '/logo-ppjm.svg'}
                    alt={activeModalPerson.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {activeModalPerson.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {activeModalPerson.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalPerson(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
              {/* Gelar Badges */}
              {activeModalPerson.credentials && activeModalPerson.credentials.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10.5px] font-bold text-slate-500">Gelar:</span>
                  {activeModalPerson.credentials.map((cr, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/50"
                    >
                      {cr}
                    </span>
                  ))}
                </div>
              )}

              {/* Quote Highlight */}
              {activeModalPerson.quote && (
                <blockquote className="p-2 sm:p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border-l-3 border-amber-500 text-slate-800 dark:text-amber-200 italic font-serif text-xs sm:text-sm">
                  &ldquo;{activeModalPerson.quote}&rdquo;
                </blockquote>
              )}

              {/* Video Embed jika ada */}
              {activeModalPerson.video_url && activeModalPerson.video_url.includes('youtube') && (
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${
                      activeModalPerson.video_url.split('v=')[1]?.split('&')[0] ||
                      activeModalPerson.video_url.split('/').pop()
                    }`}
                    title="Video Sambutan"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Full Message */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Naskah Sambutan Lengkap:
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal bg-slate-50 dark:bg-zinc-800/40 p-2.5 sm:p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <SafeRichContent
                    content={activeModalPerson.message_full || activeModalPerson.message_short || ''}
                  />
                </div>
              </div>

              {/* Prestasi / Achievements List */}
              {activeModalPerson.achievements && activeModalPerson.achievements.length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rekam Jejak &amp; Pengabdian:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeModalPerson.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-700 dark:text-zinc-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 sm:p-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleShareWa(activeModalPerson)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Bagikan</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
                </button>
              </div>
              <button
                onClick={() => setActiveModalPerson(null)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeSambutanMultiSection;

