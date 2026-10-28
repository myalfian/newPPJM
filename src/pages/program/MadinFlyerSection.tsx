import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Sparkles,
  Maximize2,
  Download,
  Share2,
  X,
  Check,
  BookmarkCheck,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import {
  MadinFlyerItem,
  FlyerCategory,
  FlyerLevel
} from './types';

// ========================
// MOCK DATA: MADIN FLYERS
// ========================
const MADIN_FLYERS: MadinFlyerItem[] = [
  // --- KUMPULAN FLYER KITAB KUNING ---
  {
    id: 'flyer-kitab-1',
    title: 'Kurikulum Matan Al-Ajurumiyah',
    category: 'kitab',
    level: 'Ula',
    subject: 'Ilmu Nahwu Dasar & I’rob',
    description:
      'Pondasi kaidah gramatika bahasa Arab dasar bagi santri tahun pertama. Mempelajari tanda-tanda i’rob (Rofa’, Nashob, Khofad, Jazm) agar lurus dalam melafalkan kalam Arab.',
    imageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Nahwu', 'Tingkat Ula', 'I’rob Dasar', 'Kalam']
  },
  {
    id: 'flyer-kitab-2',
    title: 'Kurikulum Safinatun Najah & Sullamut Taufiq',
    category: 'kitab',
    level: 'Ula',
    subject: 'Fiqih Ibadah Dasar & Adab',
    description:
      'Kitab panduan praktis hukum bersuci, shalat fardhu, rukun jenazah, dan puasa ramadhan yang wajib dihafal dan diamalkan oleh setiap santri pemula.',
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    tags: ['Fiqih Syafi’i', 'Thaharah', 'Rukun Shalat']
  },
  {
    id: 'flyer-kitab-3',
    title: 'Kurikulum Nazham Al-Imrithi',
    category: 'kitab',
    level: 'Wustho',
    subject: 'Kaidah Nahwu Lanjutan (Bait Nazham)',
    description:
      'Gubahan bait-bait syi’ir nazham karya Syaikh Syarafuddin Yahya Al-Imrithi. Mengasah daya hafal dan ketajaman santri dalam mengurai bait gramatika Arab secara berirama.',
    imageUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    tags: ['Nazham', 'Tingkat Wustho', 'Syi’ir Nahwu']
  },
  {
    id: 'flyer-kitab-4',
    title: 'Kurikulum Fathul Qorib Al-Mujib',
    category: 'kitab',
    level: 'Wustho',
    subject: 'Fiqih Komprehensif Madzhab Syafi’i',
    description:
      'Syarah Matan Abu Syuja’ karya Al-Allamah Ibnu Qasim Al-Ghazi. Menjadi rujukan utama fiqih ibadah, muamalah jual-beli, munakahat pernikahan, dan jinayat.',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    tags: ['Fiqih Muamalah', 'Matan Taqrib', 'Madzhab Syafi’i']
  },
  {
    id: 'flyer-kitab-5',
    title: 'Kurikulum Alfiyah Ibnu Malik',
    category: 'kitab',
    level: 'Ulya',
    subject: '1.000 Bait Nahwu & Sharaf Takhassus',
    description:
      'Puncak kajian gramatika bahasa Arab klasik. Santri jenjang Ulya diuji menghafal dan memahami 1.000 bait nazham Ibnu Malik lengkap dengan dalil syawahid sastra Arab.',
    imageUrl:
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
    tags: ['Alfiyah', 'Tingkat Ulya', '1000 Bait', 'Takhassus']
  },
  {
    id: 'flyer-kitab-6',
    title: 'Kurikulum Fathul Mu’in & Al-Jauharul Maknuun',
    category: 'kitab',
    level: 'Ulya',
    subject: 'Fiqih Tingkat Lanjut & Sastra Balaghah',
    description:
      'Mempelajari kitab Fathul Mu’in karya Syaikh Zainuddin Al-Malibari dan Nazham Al-Jauharul Maknuun dalam ilmu Ma’ani, Bayan, dan Badi’ yang menjadi inspirasi nama ma’had kami.',
    imageUrl:
      'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
    tags: ['Fathul Mu’in', 'Balaghah', 'Jauharul Maknuun']
  },

  // --- KUMPULAN FLYER UBUDIYAH ---
  {
    id: 'flyer-ubudiyah-1',
    title: 'Panduan Tata Cara Thaharah & Wudhu Sempurna',
    category: 'ubudiyah',
    level: 'Umum',
    subject: 'Thaharah Sunnah & Fardhu',
    description:
      'Infografis lengkap rukun, sunnah, doa, dan syarat sah wudhu serta tayamum sesuai tuntunan Sunnah Nabi SAW untuk menyempurnakan kesucian ibadah santri.',
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    tags: ['Wudhu Sempurna', 'Thaharah', 'Sunnah Rasul']
  },
  {
    id: 'flyer-ubudiyah-2',
    title: 'Panduan Shalat Sunnah Rawatib, Dhuha & Tahajjud',
    category: 'ubudiyah',
    level: 'Umum',
    subject: 'Niat, Waktu & Keutamaan Shalat Sunnah',
    description:
      'Rangkuman niat, jumlah raka’at muakkad dan ghairu muakkad, bacaan surat pilihan, serta fadhilah keutamaan shalat malam penghapus kegelisahan hati.',
    imageUrl:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    tags: ['Shalat Sunnah', 'Tahajjud', 'Dhuha', 'Rawatib']
  },
  {
    id: 'flyer-ubudiyah-3',
    title: 'Adab Penuntut Ilmu & Doa Harian Santri',
    category: 'ubudiyah',
    level: 'Umum',
    subject: 'Akhlaqul Karimah & Mutiara Ta’lim',
    description:
      'Kumpulan doa mustajab pembuka kecerdasan, adab santri kepada guru/orang tua, serta etika berkawan di lingkungan pesantren demi meraih ilmu yang berkah manfaat.',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    tags: ['Adab Santri', 'Doa Cerdas', 'Ta’lim Muta’allim']
  },
  {
    id: 'flyer-ubudiyah-4',
    title: 'Dzikir Pagi Wiridul Lathif & Petang Ratibul Haddad',
    category: 'ubudiyah',
    level: 'Umum',
    subject: 'Hizib, Dzikir & Benteng Diri',
    description:
      'Teks matan wirid resmi Pondok Pesantren Jauharul Maknuun karya Imam Al-Haddad untuk dibaca setiap ba’da Shubuh dan ba’da Maghrib sebagai benteng ketenteraman hati.',
    imageUrl:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    tags: ['Ratibul Haddad', 'Wiridul Lathif', 'Dzikir Harian']
  }
];

export const MadinFlyerSection: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | FlyerCategory>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [activeFlyer, setActiveFlyer] = useState<MadinFlyerItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredFlyers = MADIN_FLYERS.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (levelFilter !== 'all') {
      if (item.level !== levelFilter) return false;
    }
    return true;
  });

  const handleShare = async (flyer: MadinFlyerItem) => {
    const shareUrl = `${window.location.origin}/program-unggulan/program-madin?flyer=${flyer.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: flyer.title,
          text: `${flyer.title} - ${flyer.subject} di PP Jauharul Maknuun`,
          url: shareUrl
        });
      } catch {
        // Fallback: Copy link
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

  const handleDownloadFlyer = (flyer: MadinFlyerItem) => {
    // Trigger download image directly
    const link = document.createElement('a');
    link.href = flyer.imageUrl;
    link.download = `Flyer-${flyer.title.replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ========================================================= */}
      {/* HEADER & FILTER SELECTOR */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Khazanah Turats & Ubudiyah Santri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Galeri Poster Kitab & Panduan Ubudiyah
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Kumpulan flyer kurikulum kitab kuning berjenjang dan poster edukasi ibadah harian santri yang dapat dipelajari, diperbesar, dan diunduh.
          </p>
        </div>

        {/* Filter Bar: Category & Level */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900/60 p-3 sm:p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          {/* Main Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Semua Poster' },
              { id: 'kitab', label: 'Kurikulum Kitab Kuning' },
              { id: 'ubudiyah', label: 'Panduan Ubudiyah' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(f.id as any);
                  if (f.id === 'ubudiyah') setLevelFilter('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[38px] active:scale-[0.98] ${
                  categoryFilter === f.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Level Filter (Only active if Kitab or All) */}
          {categoryFilter !== 'ubudiyah' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mr-1 hidden sm:inline">
                Jenjang:
              </span>
              {[
                { id: 'all', label: 'Semua Jenjang' },
                { id: 'Ula', label: 'Tingkat Ula' },
                { id: 'Wustho', label: 'Tingkat Wustho' },
                { id: 'Ulya', label: 'Tingkat Ulya' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevelFilter(lvl.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[32px] ${
                    levelFilter === lvl.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/70 dark:hover:bg-zinc-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* FLYER POSTER GRID (aspect-[3/4] / aspect-[4/5] + Ambient Overlay) */}
      {/* ========================================================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredFlyers.map((flyer) => {
            const isKitab = flyer.category === 'kitab';

            return (
              <div
                key={flyer.id}
                className="group relative bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Poster Display Container (aspect-[3/4]) */}
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-zinc-900 cursor-pointer"
                  onClick={() => setActiveFlyer(flyer)}
                >
                  <img
                    src={flyer.imageUrl}
                    alt={flyer.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Backing */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
                        isKitab
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-emerald-400 text-emerald-950'
                      }`}
                    >
                      {isKitab ? `Kitab ${flyer.level || ''}` : 'Ubudiyah'}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                      PP Jauharul Maknuun
                    </span>
                  </div>

                  {/* Ambient Overlay Action Buttons */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] p-4 pointer-events-none group-hover:pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFlyer(flyer);
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Perbesar Poster</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFlyer(flyer);
                        }}
                        className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs flex items-center gap-1.5 shadow-md border border-white/20 transition-all cursor-pointer"
                        title="Unduh Poster"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(flyer);
                        }}
                        className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs flex items-center gap-1.5 shadow-md border border-white/20 transition-all cursor-pointer"
                        title="Bagikan Poster"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Bagikan</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Subject & Title over Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <span className="text-[11px] font-semibold text-amber-300 block">
                      {flyer.subject}
                    </span>
                    <h3 className="text-base font-bold leading-tight drop-shadow-md">
                      {flyer.title}
                    </h3>
                  </div>
                </div>

                {/* Narrative & Tag Info Card */}
                <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 space-y-3">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {flyer.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {flyer.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL: FULLSCREEN FLYER VIEWER WITH ACTIONS */}
      {/* ========================================================= */}
      {activeFlyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveFlyer(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Mobile */}
            <button
              type="button"
              onClick={() => setActiveFlyer(null)}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Poster Preview on Left / Top */}
            <div className="md:w-1/2 bg-black flex items-center justify-center p-2 relative overflow-hidden">
              <img
                src={activeFlyer.imageUrl}
                alt={activeFlyer.title}
                className="max-h-[50vh] md:max-h-[80vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Poster Details & Action on Right / Bottom */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-zinc-900 text-white space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {activeFlyer.category === 'kitab' ? `Kitab ${activeFlyer.level}` : 'Ubudiyah'}
                  </span>
                  <span className="text-xs text-zinc-400">• PP Jauharul Maknuun</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {activeFlyer.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-amber-400 mt-1">
                    {activeFlyer.subject}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeFlyer.description}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-400">Kata Kunci Pembahasan:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFlyer.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadFlyer(activeFlyer)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Poster Resmi</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(activeFlyer)}
                  className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-zinc-700 transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Bagikan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

