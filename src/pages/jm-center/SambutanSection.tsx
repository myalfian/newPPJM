import React, { useState, useEffect } from 'react';
import {
  Quote,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Search,
  Filter,
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

  // Filters & Search
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Filtered List
  const filteredList = sambutans.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.quote && s.quote.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchLoc =
      selectedLocation === 'all' ||
      (Array.isArray(s.location) && s.location.includes(selectedLocation));

    return matchSearch && matchLoc;
  });

  const featured = filteredList.find((s) => s.is_featured) || filteredList[0];
  const otherList = filteredList.filter((s) => s.id !== featured?.id);

  // 1. Loading Pulse Skeleton
  if (loading && sambutans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xs animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="bg-white/90 dark:bg-zinc-900/80 p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-zinc-500 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Unit:
          </span>
          {[
            { id: 'all', label: 'Semua Unit' },
            { id: 'home', label: 'Pondok / Mudir' },
            { id: 'smp-plus', label: 'SMP Plus' },
            { id: 'madin', label: 'Madrasah Diniyah' },
            { id: 'yayasan', label: 'Yayasan' },
          ].map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedLocation(u.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedLocation === u.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pimpinan / amanah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-200"
          />
        </div>
      </div>

      {/* Empty Filter Result */}
      {filteredList.length === 0 ? (
        <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-2">
          <div className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            Tidak Ada Sambutan yang Cocok
          </div>
          <p className="text-xs text-zinc-500">
            Silakan pilih filter unit lain atau bersihkan kata kunci pencarian.
          </p>
        </div>
      ) : (
        <>
          {/* 1. FEATURED TOKOH UTAMA (Mudir / Pimpinan Unggulan) */}
          {featured && (
            <section className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-8 lg:p-10 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                {/* Foto Resmi Tokoh */}
                <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
                  <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-700/20 shadow-xl shadow-emerald-950/15 group bg-slate-100 dark:bg-zinc-800">
                    <img
                      src={featured.photo_url || '/logo-ppjm.svg'}
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
                        {featured.role_type === 'pengasuh'
                          ? 'Pimpinan & Pengasuh Pesantren'
                          : 'Dewan Asatidz & Pimpinan Lembaga'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Narasi Sambutan */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                      <Quote className="w-3.5 h-3.5" />
                      <span>Kalam Pimpinan Pondok Pesantren</span>
                    </div>

                    {featured.credentials?.map((cr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {cr}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
                    {featured.name}
                  </h2>

                  {/* Styling Quote */}
                  {featured.quote && (
                    <blockquote className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 py-2 italic text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-serif bg-amber-50/40 dark:bg-amber-950/20 rounded-r-2xl">
                      &ldquo;{featured.quote}&rdquo;
                    </blockquote>
                  )}

                  {/* Full Message / Rich Content */}
                  <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal space-y-3">
                    <SafeRichContent
                      content={
                        expandedIds.includes(featured.id)
                          ? featured.message_full || ''
                          : (featured.message_full || '').slice(0, 360) +
                            ((featured.message_full || '').length > 360 ? '...' : '')
                      }
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    {(featured.message_full || '').length > 360 && (
                      <button
                        onClick={() => toggleExpand(featured.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <span>
                          {expandedIds.includes(featured.id)
                            ? 'Ciutkan Naskah'
                            : 'Baca Naskah Lengkap'}
                        </span>
                        {expandedIds.includes(featured.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setModalPerson(featured)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Detail Profil & Rekam Jejak</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. GRID OTHER LEADERS */}
          {otherList.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Sambutan Pimpinan Unit & Dewan Yayasan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherList.map((person) => {
                  const isExpanded = expandedIds.includes(person.id);
                  return (
                    <div
                      key={person.id}
                      className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header Kartu */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-600/30 shadow-xs bg-slate-100 dark:bg-zinc-800">
                            <img
                              src={person.photo_url || '/logo-ppjm.svg'}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/40">
                              {person.title}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white mt-1">
                              {person.name}
                            </h4>
                            {person.credentials && person.credentials.length > 0 && (
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {person.credentials.map((cr, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0">
                  <img
                    src={modalPerson.photo_url || '/logo-ppjm.svg'}
                    alt={modalPerson.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                    {modalPerson.name}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    {modalPerson.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalPerson(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {modalPerson.quote && (
                <blockquote className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-500 text-zinc-800 dark:text-amber-200 italic font-serif text-sm">
                  &ldquo;{modalPerson.quote}&rdquo;
                </blockquote>
              )}

              {modalPerson.video_url && modalPerson.video_url.includes('youtube') && (
                <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-200">
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

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Naskah Sambutan Lengkap:
                </h4>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <SafeRichContent content={modalPerson.message_full || ''} />
                </div>
              </div>

              {modalPerson.achievements && modalPerson.achievements.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rekam Jejak & Pengabdian:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modalPerson.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWa(modalPerson)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Bagikan WA</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Tersalin' : 'Salin Tautan'}</span>
                </button>
              </div>
              <button
                onClick={() => setModalPerson(null)}
                className="px-4 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold transition"
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
