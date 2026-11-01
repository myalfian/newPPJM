import React, { useState, useEffect } from 'react';
import {
  Quote,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Video,
  X,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { SafeRichContent } from '../../components/common/SafeRichContent';

export const SambutanSection: React.FC = () => {
  const [sambutans, setSambutans] = useState<SambutanPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Expandable state for each person
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [modalPerson, setModalPerson] = useState<SambutanPerson | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fetchLiveSambutanList = async () => {
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
        console.error('[SambutanSection] Error fetching:', err);
        setError(`Gagal memuat: ${err.message}`);
        setSambutans([]);
      } else {
        setSambutans((data as SambutanPerson[]) || []);
      }
    } catch (e: any) {
      console.error('[SambutanSection] Error:', e);
      setError(`Gagal memuat data sambutan: ${e.message || 'Koneksi terputus'}`);
      setSambutans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSambutanList();

    // Subscribe to realtime updates on sambutan_persons
    const channel = supabase
      .channel('public-jmcenter-sambutan')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        () => {
          fetchLiveSambutanList();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShareWa = (person: SambutanPerson) => {
    const text = encodeURIComponent(
      `*Kalam Sambutan: ${person.name}*\n_${person.title}_\n\n"${person.quote || person.message_short}"\n\nBaca selengkapnya di: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Active Sambutan List
  const featured = sambutans.find((s) => s.is_featured) || sambutans[0];
  const otherList = sambutans.filter((s) => s.id !== featured?.id);

  // 1. Loading Pulse Skeleton
  if (loading && sambutans.length === 0) {
    return (
      <div className="space-y-2.5 sm:space-y-3.5">
        <div className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm aspect-[4/5] rounded-3xl bg-slate-200 dark:bg-zinc-800" />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-9 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
              <div className="h-16 w-full bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error Display
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
          onClick={fetchLiveSambutanList}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* Empty Result */}
      {sambutans.length === 0 ? (
        <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center space-y-1.5">
          <div className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200">
            Belum Ada Naskah Sambutan
          </div>
          <p className="text-xs text-zinc-500">
            Naskah sambutan resmi pimpinan pondok pesantren sedang dipersiapkan.
          </p>
        </div>
      ) : (
        <>
          {/* 1. FEATURED TOKOH UTAMA (Mudir / Pimpinan Unggulan) */}
          {featured && (
            <section className="bg-white/95 dark:bg-zinc-900/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-4.5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs relative overflow-hidden card-hover-smooth">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 lg:gap-4 items-center">
                {/* Foto Resmi Tokoh */}
                <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
                  <div className="relative w-full max-w-sm aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-emerald-700/20 shadow-lg shadow-emerald-950/15 group bg-slate-100 dark:bg-zinc-800">
                    <img
                      src={featured.photo_url || '/logo-ppjm.svg'}
                      alt={featured.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                        {featured.title}
                      </span>
                      <h3 className="text-sm sm:text-base font-black tracking-tight mt-0.5">
                        {featured.name}
                      </h3>
                      <p className="text-[11px] text-emerald-100/80">
                        {featured.role_type === 'pengasuh'
                          ? 'Pimpinan & Pengasuh Pesantren'
                          : 'Dewan Asatidz & Pimpinan Lembaga'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Narasi Sambutan */}
                <div className="lg:col-span-7 space-y-2 sm:space-y-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                      <Quote className="w-3 h-3" />
                      <span>Kalam Pimpinan Pondok Pesantren</span>
                    </div>

                    {featured.credentials?.map((cr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {cr}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
                    {featured.name}
                  </h2>

                  {/* Styling Quote */}
                  {featured.quote && (
                    <blockquote className="border-l-3 border-amber-500 dark:border-amber-400 pl-3 py-1.5 italic text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-serif bg-amber-50/40 dark:bg-amber-950/20 rounded-r-xl">
                      &ldquo;{featured.quote}&rdquo;
                    </blockquote>
                  )}

                  {/* Full Message / Rich Content */}
                  <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal space-y-2">
                    <SafeRichContent
                      content={
                        expandedIds.includes(featured.id)
                          ? featured.message_full || ''
                          : (featured.message_full || '').slice(0, 320) +
                            ((featured.message_full || '').length > 320 ? '...' : '')
                      }
                    />
                  </div>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    {(featured.message_full || '').length > 320 && (
                      <button
                        onClick={() => toggleExpand(featured.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <span>
                          {expandedIds.includes(featured.id)
                            ? 'Ciutkan Naskah'
                            : 'Baca Naskah Lengkap'}
                        </span>
                        {expandedIds.includes(featured.id) ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setModalPerson(featured)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Detail Profil &amp; Rekam Jejak</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. GRID OTHER LEADERS */}
          {otherList.length > 0 && (
            <div className="space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                  Sambutan Pimpinan Unit &amp; Dewan Yayasan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                {otherList.map((person) => {
                  const isExpanded = expandedIds.includes(person.id);
                  return (
                    <div
                      key={person.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-2 hover:shadow-md card-hover-smooth flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Header Kartu */}
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-600/30 shadow-2xs bg-slate-100 dark:bg-zinc-800">
                            <img
                              src={person.photo_url || '/logo-ppjm.svg'}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9.5px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/40">
                              {person.title}
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white mt-0.5">
                              {person.name}
                            </h4>
                            {person.credentials && person.credentials.length > 0 && (
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                {person.credentials.map((cr, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                                  >
                                    {cr}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quote */}
                        {person.quote && (
                          <blockquote className="border-l-3 border-amber-500 pl-3 py-1 text-xs italic text-zinc-700 dark:text-zinc-300 font-serif bg-amber-50/40 dark:bg-amber-950/20 rounded-r-xl">
                            &ldquo;{person.quote}&rdquo;
                          </blockquote>
                        )}

                        {/* Message Preview or Full */}
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <SafeRichContent
                            content={
                              isExpanded
                                ? person.message_full || ''
                                : (person.message_full || '').slice(0, 200) +
                                  ((person.message_full || '').length > 200 ? '...' : '')
                            }
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                        <button
                          onClick={() => toggleExpand(person.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 transition cursor-pointer"
                        >
                          <span>{isExpanded ? 'Ciutkan' : 'Baca Naskah'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setModalPerson(person)}
                          className="text-[11px] font-semibold text-zinc-500 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <span>Detail Profil</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. MODAL DETAIL PROFIL & REKAM JEJAK */}
      {modalPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto modal-smooth-backdrop">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] modal-smooth-dialog">
            <div className="p-3 sm:p-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-emerald-600 shrink-0">
                  <img
                    src={modalPerson.photo_url || '/logo-ppjm.svg'}
                    alt={modalPerson.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    {modalPerson.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {modalPerson.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalPerson(null)}
                className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
              {modalPerson.quote && (
                <blockquote className="p-2 sm:p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border-l-3 border-amber-500 text-zinc-800 dark:text-amber-200 italic font-serif text-xs sm:text-sm">
                  &ldquo;{modalPerson.quote}&rdquo;
                </blockquote>
              )}

              {modalPerson.video_url && modalPerson.video_url.includes('youtube') && (
                <div className="aspect-video rounded-xl overflow-hidden border border-zinc-200">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${
                      modalPerson.video_url.split('v=')[1]?.split('&')[0] ||
                      modalPerson.video_url.split('/').pop()
                    }`}
                    title="Video Sambutan"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Naskah Sambutan Lengkap:
                </h4>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal bg-zinc-50 dark:bg-zinc-800/40 p-2.5 sm:p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <SafeRichContent content={modalPerson.message_full || ''} />
                </div>
              </div>

              {modalPerson.achievements && modalPerson.achievements.length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rekam Jejak &amp; Pengabdian:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {modalPerson.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-2.5 sm:p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleShareWa(modalPerson)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Bagikan WA</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Tersalin' : 'Salin Tautan'}</span>
                </button>
              </div>
              <button
                onClick={() => setModalPerson(null)}
                className="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SambutanSection;
