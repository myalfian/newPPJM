import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Moon,
  Sun,
  Heart,
  Calendar,
  X,
  Maximize2,
  Languages,
  Users2,
  GraduationCap
} from 'lucide-react';
import {
  PondokProgramItem,
  PondokActivityPhoto,
  DailyScheduleItem
} from './types';

// ========================
// MOCK DATA: PONDOK
// ========================
const PONDOK_PROGRAMS: PondokProgramItem[] = [
  {
    id: 'prog-tahfidz',
    title: "Tahfidzul Qur'an 30 Juz Bersanad",
    category: 'Unggulan Qur’ani',
    badge: 'Sanad Muttashil',
    description:
      "Program takhassus dan reguler penghafal Al-Qur'an dengan bimbingan ustadz/ustadzah hafidz-hafidzah bersanad, setoran ziyadah harian, serta muraja’ah berkala.",
    iconName: 'Award',
    keyFeatures: [
      'Metode talaqqi & musyafahah langsung',
      'Target hafalan terukur per semester',
      'Ujian tasmi’ 5, 10, dan 30 juz sekali duduk',
      'Ijazah tahfidz resmi bersanad ke Rasulullah SAW'
    ]
  },
  {
    id: 'prog-turats',
    title: 'Kajian Kitab Turats Salafiyah',
    category: 'Keilmuan Islam',
    badge: 'Metode Gandul',
    description:
      'Pendalaman khazanah keilmuan Islam klasik melalui sistem sorogan dan bandongan dengan makna gandul Pegon Jawa, menjaga transmisi sanad keilmuan ulama Nusantara.',
    iconName: 'BookOpen',
    keyFeatures: [
      'Kajian Fiqih madzhab Syafi’i secara mendalam',
      'Gramatika Nahwu-Shorof (Jurumiyah, Imrithi, Alfiyah)',
      'Forum musyawarah Bahtsul Masail santri',
      'Ijazahan sanad kitab dan hizib mu’tabarah'
    ]
  },
  {
    id: 'prog-karakter',
    title: 'Pembinaan Karakter Santri Mandiri',
    category: 'Tarbiyah Akhlaq',
    badge: 'Kemandirian 24 Jam',
    description:
      'Penanaman adab kesantrian, kepemimpinan, kepedulian sosial, dan kemandirian hidup melalui kedisiplinan asrama serta keteladanan para pengasuh dan asatidz.',
    iconName: 'Users2',
    keyFeatures: [
      'Pembiasaan sholat berjamaah & wirid harian',
      'Budaya roan (gotong royong) dan kebersihan lingkungan',
      'Latihan kepemimpinan khidmah pesantren',
      'Pendidikan adab ta’lim muta’allim aplikatif'
    ]
  },
  {
    id: 'prog-bahasa',
    title: 'Penguasaan Bahasa Arab & Inggris Aktif',
    category: 'Wawasan Global',
    badge: 'Bilingual Santri',
    description:
      'Pengembangan kecakapan komunikasi internasional melalui program muhadatsah harian, public speaking (muhadharah 3 bahasa), serta penguasaan kosa kata tematik.',
    iconName: 'Languages',
    keyFeatures: [
      'Zona wajib berbahasa Arab & Inggris berkala',
      'Pelatihan pidato mingguan di hadapan seluruh santri',
      'Klub debat dan penulisan artikel ilmiah',
      'Bimbingan beasiswa ke Timur Tengah & luar negeri'
    ]
  }
];

const PONDOK_PHOTOS: PondokActivityPhoto[] = [
  {
    id: 'photo-1',
    title: 'Halaqah Tahfidz & Setoran Ziyadah Subuh',
    description:
      'Santri melantunkan ayat suci Al-Qur’an dalam halaqah shubuh dengan bimbingan asatidz pengampu tahfidz di serambi masjid pesantren.',
    imageUrl:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=80',
    timeTag: '05.00 WIB',
    location: 'Masjid Jami’ PPJM'
  },
  {
    id: 'photo-2',
    title: 'Mujahadah & Pembacaan Ratibul Haddad',
    description:
      'Suasana syahdu pembacaan dzikir rutin Ratibul Haddad dan wiridul lathif setiap malam ba’da Maghrib untuk mengasah kelembutan rohani.',
    imageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    timeTag: '18.30 WIB',
    location: 'Masjid Jami’ PPJM'
  },
  {
    id: 'photo-3',
    title: 'Roan Akbar & Kerja Bakti Asrama',
    description:
      'Budaya gotong royong santri putra dan putri menjaga keasrian, kebersihan, dan kesehatan lingkungan pesantren setiap Ahad pagi.',
    imageUrl:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
    timeTag: '07.30 WIB',
    location: 'Kawasan Asrama & Taman'
  },
  {
    id: 'photo-4',
    title: 'Sorogan Kitab Kuning Bersama Asatidz',
    description:
      'Metode belajar privat di mana santri membaca dan mengurai makna kitab gundul secara langsung di hadapan dewan asatidz.',
    imageUrl:
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=1000&q=80',
    timeTag: '16.00 WIB',
    location: 'Zawiyah Madrasah Diniyah'
  },
  {
    id: 'photo-5',
    title: 'Forum Musyawarah Bahtsul Masail Santri',
    description:
      'Ajang adu argumentasi ilmiah santri dalam membedah persoalan hukum Islam kontemporer merujuk pada teks-teks maraji’ salafiyah.',
    imageUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    timeTag: '20.15 WIB',
    location: 'Aula Ma’had Ali PPJM'
  },
  {
    id: 'photo-6',
    title: 'Rihlah Dakwah & Outbound Kepemimpinan',
    description:
      'Aktivitas tadabbur alam, ketangkasan fisik, dan pembekalan dakwah kemasyarakatan yang mempererat ukhuwah antar-santri.',
    imageUrl:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
    timeTag: 'Akhir Semester',
    location: 'Alam Terbuka & Lapangan'
  }
];

const DAILY_SCHEDULES: DailyScheduleItem[] = [
  {
    id: 'sch-1',
    time: '03.30 - 04.30 WIB',
    title: 'Qiyamul Lail & Mujahadah Asmaul Husna',
    description:
      'Bangun sepertiga malam untuk Shalat Tahajjud, Shalat Tasbih/Hajat, serta dzikir Asmaul Husna bersama di masjid jami’.',
    category: 'ibadah',
    iconName: 'Moon'
  },
  {
    id: 'sch-2',
    time: '04.30 - 06.00 WIB',
    title: 'Shalat Shubuh Berjamaah & Ziyadah Tahfidz',
    description:
      'Shalat Shubuh berjamaah, pembacaan Wiridul Lathif Al-Haddad, dan setoran hafalan Al-Qur’an baru kepada asatidz.',
    category: 'ibadah',
    iconName: 'Sun'
  },
  {
    id: 'sch-3',
    time: '06.00 - 07.00 WIB',
    title: 'Mandi Pagi, Sarapan Bergizi & Persiapan Sekolah',
    description:
      'Pembersihan kamar santri, sarapan bersama di kantin halal, dan persiapan menuju gedung pembelajaran formal.',
    category: 'istirahat',
    iconName: 'Clock'
  },
  {
    id: 'sch-4',
    time: '07.00 - 13.00 WIB',
    title: 'KBM Sekolah Formal Terpadu (SMP Plus JM)',
    description:
      'Pembelajaran kurikulum nasional terakreditasi A dengan muatan unggulan sains STEM, komputer koding, dan bahasa asing.',
    category: 'akademik',
    iconName: 'GraduationCap'
  },
  {
    id: 'sch-5',
    time: '13.00 - 15.30 WIB',
    title: 'Shalat Dzuhur, Makan Siang & Qailulah (Istirahat)',
    description:
      'Shalat Dzuhur berjamaah, santap siang asrama, dan istirahat sejenak (tidur siang sunnah) untuk memulihkan kebugaran tubuh.',
    category: 'istirahat',
    iconName: 'Heart'
  },
  {
    id: 'sch-6',
    time: '15.30 - 17.00 WIB',
    title: 'Shalat Ashar & Madrasah Diniyah Salafiyah',
    description:
      'Kajian kitab kuning turats bersanad dengan metode sorogan dan bandongan (Jurumiyah, Imrithi, Safinah, dan Tijan).',
    category: 'diniyah',
    iconName: 'BookOpen'
  },
  {
    id: 'sch-7',
    time: '17.30 - 19.30 WIB',
    title: 'Shalat Maghrib Berjamaah & Ratibul Haddad',
    description:
      'Istighotsah bersama, pembacaan Ratib Al-Haddad, shalat Isya berjamaah, dan pendalaman tahsin Al-Qur’an takhassus.',
    category: 'ibadah',
    iconName: 'Moon'
  },
  {
    id: 'sch-8',
    time: '20.00 - 21.45 WIB',
    title: 'Mudzakarah Malam, Bahtsul Masail & Belajar Mandiri',
    description:
      'Pengulangan materi pelajaran, musyawarah santri, persiapan hafalan esok hari, serta bimbingan tugas sekolah.',
    category: 'diniyah',
    iconName: 'Sparkles'
  },
  {
    id: 'sch-9',
    time: '22.00 WIB',
    title: 'Adab Tidur Malam & Istirahat Penuh',
    description:
      'Lampu kamar dipadamkan, membaca doa sebelum tidur, dan santri beristirahat penuh guna menyambut ibadah malam hari.',
    category: 'istirahat',
    iconName: 'Moon'
  }
];

export const PondokProgramSection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PondokActivityPhoto | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<string>('semua');

  const filteredSchedules = DAILY_SCHEDULES.filter((item) => {
    if (scheduleFilter === 'semua') return true;
    return item.category === scheduleFilter;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ========================================================= */}
      {/* SEKSI 1: PROGRAM UNGGULAN PONDOK (Minimalist Grid Cards) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pilar Kepesantrenan Salafiyah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Program Unggulan Pesantren
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Mencetak santri berakhlak mulia, mutafaqqih fiddin, hafizhul Qur’an, serta memiliki daya saing berwawasan global.
          </p>
        </div>

        {/* 4 Cards Grid with subtle icon, hairline border & hover lift */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
          {PONDOK_PROGRAMS.map((prog) => {
            const Icon =
              prog.iconName === 'Award'
                ? Award
                : prog.iconName === 'BookOpen'
                ? BookOpen
                : prog.iconName === 'Users2'
                ? Users2
                : Languages;

            return (
              <div
                key={prog.id}
                className="group relative bg-white/90 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      {prog.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {prog.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Key features checklist */}
                <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Fokus Pembinaan:
                  </div>
                  <ul className="space-y-1.5">
                    {prog.keyFeatures.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SEKSI 2: FOTO KEGIATAN HARIAN SANTRI (aspect-[4/3] + Lightbox) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Dokumentasi Dinamis Santri</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Foto Kegiatan Santri
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Klik foto untuk memperbesar tampilan dan melihat detail kegiatan harian.
          </p>
        </div>

        {/* 6 Photo Grid: aspect-[4/3], rounded-xl, zoom on hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {PONDOK_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Ambient Overlay & Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                    {photo.timeTag}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-medium text-emerald-300 block">
                    {photo.location}
                  </span>
                  <h4 className="text-sm font-bold leading-tight drop-shadow-sm">
                    {photo.title}
                  </h4>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-white dark:bg-zinc-900">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SEKSI 3: JADWAL AMALIYAH 24 JAM (Timetable & Interactive Card) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Rutinitas Harian & Disiplin Ibadah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Jadwal Amaliyah 24 Jam Santri
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {[
              { id: 'semua', label: 'Semua Rutinitas' },
              { id: 'ibadah', label: 'Ibadah & Wirid' },
              { id: 'akademik', label: 'Sekolah' },
              { id: 'diniyah', label: 'Kajian Diniyah' },
              { id: 'istirahat', label: 'Kemandirian' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setScheduleFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[32px] active:scale-[0.98] ${
                  scheduleFilter === f.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Interactive Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredSchedules.map((item) => {
            const Icon =
              item.iconName === 'Moon'
                ? Moon
                : item.iconName === 'Sun'
                ? Sun
                : item.iconName === 'GraduationCap'
                ? GraduationCap
                : item.iconName === 'BookOpen'
                ? BookOpen
                : item.iconName === 'Heart'
                ? Heart
                : item.iconName === 'Sparkles'
                ? Sparkles
                : Clock;

            const categoryBg =
              item.category === 'ibadah'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : item.category === 'akademik'
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : item.category === 'diniyah'
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';

            return (
              <div
                key={item.id}
                className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-tight text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {item.time}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryBg}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Kedisiplinan 24 Jam
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL: FULLSCREEN PHOTO PREVIEW */}
      {/* ========================================================= */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Caption & Metadata */}
            <div className="p-5 sm:p-6 bg-zinc-900 border-t border-zinc-800 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                  {selectedPhoto.timeTag}
                </span>
                <span className="text-xs text-zinc-400">• {selectedPhoto.location}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

