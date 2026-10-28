import React, { useState } from 'react';
import {
  GraduationCap,
  Cpu,
  Trophy,
  Compass,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import {
  SekolahProgramItem,
  SekolahStoryActivity
} from './types';

// ========================
// MOCK DATA: SEKOLAH
// ========================
const SEKOLAH_PROGRAMS: SekolahProgramItem[] = [
  {
    id: 'sek-kurikulum',
    title: 'Kurikulum Nasional Terakreditasi "A" BAN-PDM',
    category: 'Pilar Akademik',
    badge: 'Akreditasi A Unggul',
    description:
      'Pendidikan tingkat menengah pertama berstandar nasional yang memadukan kedalaman literasi, numerasi, dan sains umum dengan nilai-nilai adab kesantrian.',
    highlights: [
      'Tenaga pendidik sarjana & magister profesional',
      'Pembelajaran berbasis project (Project-Based Learning)',
      'Ruang kelas multimedia ber-AC dengan smart projector',
      'Penilaian komprehensif kognitif, afektif, dan psikomotorik'
    ]
  },
  {
    id: 'sek-stem',
    title: 'Penguatan STEM & Laboratorium Robotika',
    category: 'Inovasi Teknologi',
    badge: 'Sains & Robotik',
    description:
      'Pengenalan sains terapan, logika pemrograman dasar (coding), sensor mikrokontroler (Arduino/ESP32), dan literasi digital sejak dini bagi santri.',
    highlights: [
      'Praktikum eksperimen laboratorium mandiri',
      'Pelatihan coding, IoT, dan perakitan robot mini',
      'Kurikulum Computational Thinking',
      'Pameran karya inovasi teknologi santri tahunan'
    ]
  },
  {
    id: 'sek-ekskul',
    title: 'Ekstrakurikuler Wajib & Minat Bakat',
    category: 'Pengembangan Diri',
    badge: 'Multitalenta',
    description:
      'Wadah eksplorasi potensi santri dalam bidang kepanduan, olahraga, seni Islam, dan komunikasi publik guna membentuk kepribadian yang sehat dan percaya diri.',
    highlights: [
      'Pramuka Gugus Depan Berpangkalan Pesantren',
      'Seni Kaligrafi Khat & Seni Musik Hadrah/Rebana',
      'Olahraga: Futsal, Bulutangkis, Tenis Meja, & Tapak Suci',
      'Klub Bahasa & Muhadharah (Public Speaking) 3 Bahasa'
    ]
  },
  {
    id: 'sek-olimpiade',
    title: 'Bimbingan Prestasi Olimpiade & Riset Ilmiah',
    category: 'Prestasi Juara',
    badge: 'Klinik Prestasi',
    description:
      'Pembinaan intensif bagi santri berbakat untuk mengikuti Kompetisi Sains Madrasah (KSM), Olimpiade Sains Nasional (OSN), dan Lomba Cerdas Cermat regional.',
    highlights: [
      'Bimbingan khusus mata pelajaran Matematika, IPA, dan IPS',
      'Klinik bedah soal olimpiade terstruktur',
      'Pelatihan karya tulis ilmiah remaja santri',
      'Rekam jejak juara tingkat kabupaten dan provinsi'
    ]
  }
];

const SEKOLAH_STORIES: SekolahStoryActivity[] = [
  {
    id: 'story-1',
    title: 'Praktikum Sains STEM & Coding IoT di Laboratorium Modern',
    categoryTag: 'Sains & Teknologi',
    subtitle: 'Membuka wawasan teknologi masa depan dengan eksperimen nyata',
    description:
      'Santri SMP Plus Jauharul Maknuun diajak memahami konsep elektronika dasar dan sensor otomatis melalui perangkat mikrokontroler. Melalui praktikum langsung di laboratorium komputer, santri belajar merancang alat penyiram tanaman otomatis berbasis sensor kelembaban tanah dan logika pemrograman visual.',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    achievements: [
      'Simulasi sensor IoT mikrokontroler mandiri',
      'Penguasaan logika coding dan pemecahan masalah',
      'Kolaborasi tim dalam pemecahan kasus praktikum'
    ],
    dateOrPeriod: 'Agenda Mingguan Lab STEM'
  },
  {
    id: 'story-2',
    title: 'Outing Class Literasi Alam & Studi Ekosistem Pesisir',
    categoryTag: 'Eksplorasi Lapangan',
    subtitle: 'Belajar langsung dari alam ciptaan Allah SWT',
    description:
      'Tidak hanya terpaku pada buku pelajaran di dalam kelas, santri melaksanakan observasi alam di pesisir utara Gresik untuk meneliti keanekaragaman mangrove, salinitas air laut, serta kehidupan biota pesisir. Kegiatan ini menanamkan kesadaran ekologis dan kekaguman atas keagungan sunnatullah di alam semesta.',
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    achievements: [
      'Pembuatan herbarium & laporan observasi lapangan',
      'Edukasi konservasi bakau & kebersihan pesisir',
      'Tadabbur ayat-ayat kauniyah Al-Qur’an'
    ],
    dateOrPeriod: 'Program Tengah Semester'
  },
  {
    id: 'story-3',
    title: 'Latihan Dasar Kepemimpinan Santri (LDKS) & OSIS SMP Plus JM',
    categoryTag: 'Kepemimpinan & Organisasi',
    subtitle: 'Membentuk kader pemimpin tangguh, berakhlak, dan solutif',
    description:
      'Pelatihan kepemimpinan berkala yang diselenggarakan untuk pengurus OSIS dan santri perwakilan kamar. Menggabungkan materi manajemen persidangan, kepemimpinan profetik Rasulullah SAW, ketangkasan fisik outbond, hingga simulasi penyusunan program kerja madrasah.',
    imageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    achievements: [
      'Sertifikasi kepemimpinan santri muda',
      'Simulasi public speaking & sidang musyawarah',
      'Pembentukan karakter disiplin & empati sosial'
    ],
    dateOrPeriod: 'Awal Tahun Pelajaran'
  },
  {
    id: 'story-4',
    title: 'Pekan Apresiasi Bahasa & Panggung Seni Budaya Islami',
    categoryTag: 'Kreativitas & Bahasa',
    subtitle: 'Gelar unjuk karya seni kaligrafi, pidato 3 bahasa, dan teater santri',
    description:
      'Ajang tahunan bagi seluruh siswa SMP Plus JM untuk mengekspresikan talenta berbahasa dan berkesenian. Mulai dari pidato bahasa Arab dan Inggris tanpa teks, pembacaan puisi religi, parade hadrah banjari, hingga pameran karya kaligrafi santri yang memikat.',
    imageUrl:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    achievements: [
      'Pentas pidato bahasa Arab, Inggris, & Indonesia',
      'Pameran karya kaligrafi kontemporer santri',
      'Apresiasi seni hadrah klasik dan kreasi santri'
    ],
    dateOrPeriod: 'Peringatan Hari Santri & Milad'
  }
];

export const SekolahProgramSection: React.FC = () => {
  const [selectedStoryImage, setSelectedStoryImage] = useState<string | null>(null);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ========================================================= */}
      {/* SEKSI 1: PILAR PROGRAM SEKOLAH (Cards Grid) */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>SMP Plus Jauharul Maknuun</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Program Akademik & Keunggulan Sekolah
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Harmoni kurikulum nasional berakreditasi A dengan pembinaan karakter kesantrian, sains STEM, dan prestasi olimpiade.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {SEKOLAH_PROGRAMS.map((prog) => {
            const Icon =
              prog.id === 'sek-kurikulum'
                ? GraduationCap
                : prog.id === 'sek-stem'
                ? Cpu
                : prog.id === 'sek-ekskul'
                ? Compass
                : Trophy;

            return (
              <div
                key={prog.id}
                className="group relative bg-white/90 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100/70 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-800 dark:text-blue-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                      {prog.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      {prog.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2.5">
                    Standar Capaian:
                  </div>
                  <ul className="space-y-2">
                    {prog.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
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
      {/* SEKSI 2: FOTO KEGIATAN & NARASI (Visual Story Cards) */}
      {/* Alternating split view: Desktop alternating, Stacked mobile */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Aktivitas Kontekstual Santri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Cerita & Dokumentasi Kegiatan Siswa
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Kombinasi pembelajaran praktis, kepemimpinan lapangan, dan penguatan bakat santri.
          </p>
        </div>

        {/* Visual Story Cards (Alternating Layout) */}
        <div className="space-y-8 sm:space-y-10">
          {SEKOLAH_STORIES.map((story, index) => {
            const isEven = index % 2 === 0;

            return (
              <article
                key={story.id}
                className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-0 items-center ${
                    !isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo Column */}
                  <div
                    className={`lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer ${
                      !isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                    onClick={() => setSelectedStoryImage(story.imageUrl)}
                    title="Klik untuk perbesar foto kegiatan"
                  >
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[260px] sm:min-h-[300px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white text-xs font-bold backdrop-blur-md shadow-xs">
                        {story.dateOrPeriod}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                        {story.categoryTag}
                      </span>
                      <span className="text-xs font-bold">
                        SMP Plus Jauharul Maknuun
                      </span>
                    </div>
                  </div>

                  {/* Story Narrative Column */}
                  <div
                    className={`lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 ${
                      !isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                          {story.categoryTag}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {story.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-1">
                        {story.subtitle}
                      </p>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {story.description}
                    </p>

                    {/* Achievements List */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Poin & Capaian Kegiatan:
                      </div>
                      <ul className="space-y-1.5">
                        {story.achievements.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL: FULLSCREEN STORY PHOTO PREVIEW */}
      {/* ========================================================= */}
      {selectedStoryImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedStoryImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStoryImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img
                src={selectedStoryImage}
                alt="Story Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

