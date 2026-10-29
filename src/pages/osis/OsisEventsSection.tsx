import React, { useState } from 'react';
import {
  Calendar,
  User,
  Share2,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Newspaper,
  Tag,
  Clock,
  BookOpen
} from 'lucide-react';
import { OsisArticleEvent } from './types';

export const OSIS_EVENTS: OsisArticleEvent[] = [
  {
    id: 'evt-pelantikan-2026',
    slug: 'pelantikan-osis-2026',
    title: 'Pelantikan & Serah Terima Jabatan Pengurus OSIS Masa Bakti 2026/2027',
    date: '14 Oktober 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Prosesi khidmat ikrar kepengurusan OSIS baru di hadapan Pengasuh Pesantren dan Kepala SMP Plus Jauharul Maknuun, meneguhkan komitmen khidmah santri.',
    author: 'Departemen BPH & Humas OSIS',
    category: 'Kepemimpinan & Organisasi',
    tags: ['Pelantikan', 'OSIS', 'Khidmah Santri', 'BPH'],
    content: `Prosesi pelantikan dan serah terima jabatan pengurus Organisasi Siswa Intra Sekolah (OSIS) SMP Plus Jauharul Maknuun masa bakti 2026/2027 berlangsung dengan penuh khidmat di Aula Utama Ma’had Ali, dihadiri langsung oleh Pengasuh Pesantren, segenap dewan asatidz, serta seluruh santri.

Dalam sambutan taujihnya, Pengasuh berpesan bahwa amanah kepemimpinan di pesantren bukan sekadar jabatan struktural organisasi, melainkan ladang khidmah untuk menimba keberkahan ilmu dan melatih kerendahan hati.

Ketua OSIS terpilih, Muhammad Faizur Rahman, dalam pidato perdananya menyampaikan tekad kabinet baru untuk memperkuat kedisiplinan shalat berjamaah, memacu prestasi sains STEM santri, serta mewujudkan lingkungan asrama yang asri dan beradab luhur.`
  },
  {
    id: 'evt-bulan-bahasa-2026',
    slug: 'gebyar-bulan-bahasa',
    title: 'Pekan Gebyar Bulan Bahasa Santri: Pidato 3 Bahasa & Pameran Kaligrafi',
    date: '20 Oktober 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Ratusan santri unjuk kebolehan pidato tanpa teks dalam bahasa Arab, Inggris, dan Indonesia serta menggelar pameran lukisan kaligrafi kontemporer.',
    author: 'Departemen Bahasa & Seni Kaligrafi',
    category: 'Bahasa & Literasi',
    tags: ['Bulan Bahasa', 'Pidato 3 Bahasa', 'Kaligrafi', 'Sastra'],
    content: `Menyambut momentum Bulan Bahasa dan Hari Santri Nasional, Departemen Bahasa OSIS SMP Plus Jauharul Maknuun menyelenggarakan Pekan Gebyar Bahasa Santri. Ajang ini menghadirkan kompetisi pidato tiga bahasa (Arab Fusha, English, dan Bahasa Indonesia), debat ilmiah santri, serta pameran 45 lukisan kaligrafi karya santri sanggar seni.

Acara dibuka dengan penampilan drama musikal santri dwibahasa yang memukau penonton. Koordinator Sekbid Bahasa menegaskan bahwa penguasaan bahasa asing adalah jendela santri untuk berdakwah di pentas dunia global tanpa melupakan identitas kepesantrenan.`
  },
  {
    id: 'evt-penanaman-mangrove-2026',
    slug: 'aksi-hijau-mangrove',
    title: 'Aksi Hijau Santri: Penanaman 500 Bibit Pohon Mangrove di Pesisir Sidayu',
    date: '25 Oktober 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Wujud nyata kepedulian ekologis santri menjaga kelestarian ekosistem bahari pesisir utara Gresik dari ancaman abrasi pantai.',
    author: 'Departemen Kebersihan & Lingkungan',
    category: 'Sosial & Lingkungan',
    tags: ['Aksi Hijau', 'Mangrove', 'Konservasi', 'Lingkungan'],
    content: `Sebanyak 120 santri didampingi dewan pembina OSIS terjun langsung ke kawasan pesisir pantai Sidayu untuk menanam 500 bibit pohon mangrove jenis Rhizophora. Kegiatan ini merupakan realisasi dari program kerja unggulan Departemen Kebersihan dan Lingkungan Hidup OSIS PPJM.

Selain menanam bibit, santri juga membersihkan sampah plastik di sepanjang garis pantai. Kegiatan ini mendidik santri agar peka terhadap krisis iklim dan memahami kewajiban menjaga bumi sebagai amanah khalifah fil ardh.`
  },
  {
    id: 'evt-ldks-angkatan-vii',
    slug: 'ldks-angkatan-vii',
    title: 'Latihan Dasar Kepemimpinan Santri (LDKS) Angkatan VII di Bukit Surowiti',
    date: '02 November 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Penggemblengan mental tangguh, kepemimpinan organisatoris, dan ketangkasan survival alam terbuka bagi calon pengurus OSIS.',
    author: 'Departemen BPH & Pembina Kepanduan',
    category: 'Kaderisasi & Pelatihan',
    tags: ['LDKS', 'Kepemimpinan', 'Survival', 'Pramuka'],
    content: `Kegiatan LDKS Angkatan VII sukses digelar selama tiga hari dua malam di kawasan perbukitan alam Surowiti. Materi yang diberikan mencakup teknik problem solving, manajemen sidang organisasi, etika komunikasi publik, serta simulasi manajemen krisis kepengurusan.

Malam puncak diisi dengan perenungan spiritual muhasabah diri dan ikrar komitmen kepengurusan santri di bawah bimbingan para asatidz pembina.`
  }
];

export const OsisEventsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<OsisArticleEvent | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareArticle = async (article: OsisArticleEvent) => {
    const shareUrl = `${window.location.origin}/osis?tab=event#${article.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: shareUrl
        });
      } catch {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Newspaper className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Warta &amp; Press Release Organisasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Dokumentasi &amp; Event Kegiatan OSIS
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Liputan resmi ragam kegiatan, program sosial, dan unjuk kreativitas santri SMP Plus Jauharul Maknuun.
        </p>
      </div>

      {/* Editorial News Grid (1 Col Mobile, 2 Cols Tablet/Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-3.5">
        {OSIS_EVENTS.map((event) => (
          <article
            key={event.id}
            onClick={() => setSelectedArticle(event)}
            className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div>
              {/* Banner Container (aspect-[16/9], rounded-xl) */}
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-3.5 sm:p-4 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                  {event.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {event.summary}
                </p>

                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{event.author}</span>
                </div>
              </div>
            </div>

            {/* Read More Action */}
            <div className="p-3.5 sm:p-4 pt-0">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                <span>Baca Press Release Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ========================================================= */}
      {/* READING MODAL: EDITORIAL FULL ARTICLE VIEW */}
      {/* ========================================================= */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain select-none"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Bar */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {selectedArticle.category} • Warta OSIS
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareArticle(selectedArticle)}
                  className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer"
                  title="Bagikan Warta"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Tutup Warta"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-zinc-800 dark:text-zinc-200 select-text">
              {/* Banner Photo */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                <img
                  src={selectedArticle.bannerUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedArticle.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Oleh: {selectedArticle.author}</span>
                  </span>
                </div>
              </div>

              {/* Lead-In Summary Block */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed italic">
                &quot;{selectedArticle.summary}&quot;
              </div>

              {/* Full Content Body */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
                {selectedArticle.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

