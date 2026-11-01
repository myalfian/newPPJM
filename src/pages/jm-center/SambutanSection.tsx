import React, { useState, useEffect } from 'react';
import {
  Quote,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Video,
  X,
  Copy,
  Check,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Play,
  GraduationCap,
  School,
  BookMarked,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { SafeRichContent } from '../../components/common/SafeRichContent';
import { stripHtmlToPlainText } from '../../utils/richContentUtils';

export const SambutanSection: React.FC = () => {
  const [sambutans, setSambutans] = useState<SambutanPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Expandable state for each person
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [modalPerson, setModalPerson] = useState<SambutanPerson | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLiveSambutanList = async () => {
    if (!isSupabaseConfigured()) {
      setError('Koneksi Supabase belum terkonfigurasi pada sistem.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Fetch HANYA sambutan yang aktif (is_active = true) dan urutkan berurutan sesuai order_index yang di-set editor
      const { data, error: err } = await supabase
        .from('sambutan_persons')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('is_featured', { ascending: false });

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
      `*Kalam Sambutan: ${person.name}*\n_${person.title}_\n\n"${person.quote || person.message_short}"\n\nBaca selengkapnya di: ${window.location.origin}/jm-center/sambutan`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyQuote = (person: SambutanPerson) => {
    const textToCopy = `"${person.quote || person.message_short}" — ${person.name} (${person.title})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(person.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const getUnitBadge = (roleType: string, title: string, index: number) => {
    const lowerTitle = (title || '').toLowerCase();
    const num = String(index + 1).padStart(2, '0');

    if (roleType === 'pengasuh' || lowerTitle.includes('mudir') || lowerTitle.includes('pengasuh')) {
      return {
        num,
        category: 'Kepengasuhan & Pesantren',
        badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60',
        borderAccent: 'border-emerald-600',
        icon: GraduationCap
      };
    }
    if (lowerTitle.includes('smp') || lowerTitle.includes('sekolah')) {
      return {
        num,
        category: 'Pendidikan Formal SMP Plus',
        badgeClass: 'bg-sky-50 text-sky-900 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800/60',
        borderAccent: 'border-sky-600',
        icon: School
      };
    }
    if (lowerTitle.includes('madin') || lowerTitle.includes('diniyah')) {
      return {
        num,
        category: 'Madrasah Diniyah Takmiliyah',
        badgeClass: 'bg-purple-50 text-purple-900 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800/60',
        borderAccent: 'border-purple-600',
        icon: BookMarked
      };
    }
    return {
      num,
      category: 'Badan Pengurus & Dewan Yayasan',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/60',
      borderAccent: 'border-amber-600',
      icon: Landmark
    };
  };

  // 1. Loading Pulse Skeleton
  if (loading && sambutans.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-xs aspect-[4/5] rounded-2xl bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="lg:col-span-8 space-y-3">
                <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full" />
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
                <div className="h-16 w-full bg-slate-200 dark:bg-zinc-800 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error Display
  if (error && sambutans.length === 0) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-2xl">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
            Gagal Memuat Naskah Sambutan Pimpinan
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 max-w-md mx-auto">
            {error}. Periksa koneksi internet atau hak akses policy (RLS) pada Supabase.
          </p>
        </div>
        <button
          onClick={fetchLiveSambutanList}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Empty Result */}
      {sambutans.length === 0 ? (
        <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-6 text-center space-y-1.5">
          <div className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200">
            Belum Ada Naskah Sambutan Aktif
          </div>
          <p className="text-xs text-zinc-500">
            Pastikan administrator telah mencentang &quot;Aktif Tayang&quot; pada salah satu pimpinan di menu Kelola Sambutan.
          </p>
        </div>
      ) : (
        /* Render SELURUH Section Sambutan Pimpinan berurutan dari atas ke bawah */
        sambutans.map((person, index) => {
          const isExpanded = expandedIds.includes(person.id);
          const meta = getUnitBadge(person.role_type, person.title, index);
          const IconUnit = meta.icon;
          const isLongContent = (person.message_full || '').length > 380;

          return (
            <article
              key={person.id}
              id={`sambutan-${person.id}`}
              className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all overflow-hidden space-y-3.5 sm:space-y-4 scroll-mt-28"
            >
              {/* Header Top Meta Bar: Sequential Number, Role Pill & Official Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Sequential Number + Unit Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${meta.badgeClass}`}>
                    <IconUnit className="w-3.5 h-3.5" />
                    <span>{meta.num} • {meta.category}</span>
                  </span>

                  {/* Featured Badge */}
                  {person.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gold-400 text-emerald-950 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Pimpinan Utama</span>
                    </span>
                  )}
                </div>

                {/* Credentials / Academic Titles Pills */}
                {person.credentials && person.credentials.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {person.credentials.map((cr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                      >
                        {cr}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Article Content Grid: Portrait on Left, Kalam & Full Article on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                {/* 1. Portrait Frame & Visual Identity */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-3">
                  <div className="relative w-full max-w-[280px] sm:max-w-xs mx-auto lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border-2 border-emerald-600/25 shadow-md bg-slate-100 dark:bg-zinc-800 group">
                    <img
                      src={person.photo_url || '/logo-ppjm.svg'}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Bottom Card Title Overlay */}
                    <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 inline-block mb-1">
                        {person.title}
                      </span>
                      <h4 className="text-sm sm:text-base font-black tracking-tight leading-snug">
                        {person.name}
                      </h4>
                    </div>
                  </div>

                  {/* Verification Pill & Media Button */}
                  <div className="w-full flex flex-col items-center sm:items-start gap-2 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pimpinan Resmi Terverifikasi</span>
                    </div>

                    {person.video_url && (
                      <button
                        onClick={() => setModalPerson(person)}
                        className="w-full max-w-[280px] sm:max-w-xs inline-flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-xs font-bold transition border border-rose-200 dark:border-rose-900/50 cursor-pointer shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-rose-600" />
                        <span>Tonton Video Kalam Sambutan</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Article Kalam Sambutan & SafeRichContent */}
                <div className="lg:col-span-8 space-y-3 sm:space-y-3.5">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                      {person.title}
                    </span>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-0.5">
                      {person.name}
                    </h2>
                  </div>

                  {/* Kalam Mutiara (Quote Box) */}
                  {person.quote && (
                    <blockquote className="relative pl-4 sm:pl-5 py-2.5 sm:py-3 pr-4 rounded-r-xl sm:rounded-r-2xl border-l-4 border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/25 italic font-serif text-slate-800 dark:text-zinc-200 text-xs sm:text-sm lg:text-[15px] leading-relaxed shadow-2xs">
                      <Quote className="w-4 h-4 text-emerald-600/50 mb-1 inline-block mr-1" />
                      &ldquo;{person.quote}&rdquo;
                    </blockquote>
                  )}

                  {/* Article Naskah Sambutan Body */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Naskah Sambutan Resmi</span>
                    </div>

                    {/* Jika teks panjang dan sedang dalam status collapsed, berikan cuplikan rapi dengan opsi buka */}
                    {isLongContent && !isExpanded ? (
                      <div className="relative space-y-2">
                        <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                          <p className="line-clamp-4 leading-relaxed">
                            {stripHtmlToPlainText(person.message_full || person.message_short || '', 380)}
                          </p>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => toggleExpand(person.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 transition cursor-pointer underline underline-offset-4"
                          >
                            <span>Baca Naskah Lengkap</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal bg-slate-50/50 dark:bg-zinc-800/30 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-zinc-800/60">
                          <SafeRichContent content={person.message_full || person.message_short || ''} />
                        </div>

                        {isLongContent && isExpanded && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => toggleExpand(person.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                            >
                              <span>Ciutkan Naskah</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Toolbar per Tokoh */}
                  <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* WhatsApp Share Button */}
                      <button
                        type="button"
                        onClick={() => handleShareWa(person)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                        title="Bagikan naskah sambutan ke WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Bagikan ke WhatsApp</span>
                      </button>

                      {/* Copy Quote Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyQuote(person)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-xs font-bold transition cursor-pointer"
                        title="Salin kutipan mutiara"
                      >
                        {copiedId === person.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kutipan Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Kutipan</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Open Biographical Detail Modal */}
                    <button
                      type="button"
                      onClick={() => setModalPerson(person)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Biografi &amp; Rekam Jejak</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })
      )}

      {/* 3. MODAL DETAIL BIOGRAFI, REKAM JEJAK & VIDEO */}
      {modalPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto modal-smooth-backdrop">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] modal-smooth-dialog">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0 shadow-2xs">
                  <img
                    src={modalPerson.photo_url || '/logo-ppjm.svg'}
                    alt={modalPerson.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                    {modalPerson.name}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    {modalPerson.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalPerson(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
              {/* Quote */}
              {modalPerson.quote && (
                <blockquote className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-500 text-zinc-800 dark:text-amber-200 italic font-serif text-xs sm:text-sm">
                  &ldquo;{modalPerson.quote}&rdquo;
                </blockquote>
              )}

              {/* YouTube Video Embed if available */}
              {modalPerson.video_url && modalPerson.video_url.includes('youtube') && (
                <div className="aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-xs">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${
                      modalPerson.video_url.split('v=')[1]?.split('&')[0] ||
                      modalPerson.video_url.split('/').pop()
                    }`}
                    title="Video Sambutan Pimpinan"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Full Message */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Naskah Sambutan Lengkap:
                </h4>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal bg-zinc-50 dark:bg-zinc-800/40 p-3 sm:p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <SafeRichContent content={modalPerson.message_full || ''} />
                </div>
              </div>

              {/* Achievements / Track Record */}
              {modalPerson.achievements && modalPerson.achievements.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Rekam Jejak &amp; Pengabdian:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modalPerson.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareWa(modalPerson)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Bagikan WA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyQuote(modalPerson)}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === modalPerson.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kutipan</span>
                    </>
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setModalPerson(null)}
                className="px-4 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-bold transition cursor-pointer"
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
