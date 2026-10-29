import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Languages,
  BookOpen,
  Shield,
  HeartPulse,
  CheckCircle2,
  Calendar,
  Target,
  ArrowRight
} from 'lucide-react';
import { OsisDepartment } from './types';

export const OSIS_DEPARTMENTS: OsisDepartment[] = [
  {
    id: 'bph',
    name: 'Badan Pengurus Harian (BPH)',
    shortName: 'BPH',
    arabicName: 'هيئة الإدارة اليومية (Hai’ah al-Idarah)',
    iconName: 'Users',
    coordinator: 'Muhammad Faizur Rahman & Nabila Zahra',
    description:
      'Pilar sentral kepemimpinan OSIS yang bertugas memandu koordinasi seluruh departemen, menyusun kalender kegiatan terpadu, serta menjadi jembatan aspirasi santri dengan pihak madrasah dan asatidz.',
    programs: [
      {
        id: 'bph-1',
        title: 'Latihan Dasar Kepemimpinan Santri (LDKS)',
        target: 'Pengurus OSIS baru & perwakilan kelas VII-VIII',
        frequency: 'Tahunan',
        description: 'Pembekalan kepemimpinan profetik Rasulullah SAW, manajemen persidangan, dan outbond ketangkasan di alam terbuka.',
        expectedOutput: 'Kader pemimpin muda yang berintegritas, percaya diri, dan berakhlakul karimah.'
      },
      {
        id: 'bph-2',
        title: 'Rapat Pleno & Evaluasi Kinerja Bulanan',
        target: 'Seluruh pengurus OSIS & dewan pembina',
        frequency: 'Mingguan',
        description: 'Musyawarah pleno setiap akhir bulan meninjau realisasi program kerja dan kendala lapangan tiap departemen.',
        expectedOutput: 'Laporan pertanggungjawaban teratur dan perbaikan taktis program kerja.'
      },
      {
        id: 'bph-3',
        title: 'Kotak Suara Aspirasi Santri & Siswa',
        target: 'Seluruh santri dan siswa SMP Plus JM',
        frequency: 'Rutin Harian',
        description: 'Menyerap saran, kritik membangun, dan gagasan kreatif santri melalui kotak fisik dan formulir digital terenkripsi.',
        expectedOutput: 'Solusi cepat atas persoalan kenyamanan fasilitas dan ketertiban asrama.'
      }
    ]
  },
  {
    id: 'bahasa',
    name: 'Departemen Pengembangan Bahasa Asing',
    shortName: 'Bahasa',
    arabicName: 'قسم ترقية اللغة (Qismu Tarqiyatil Lughah)',
    iconName: 'Languages',
    coordinator: 'Hilmi Mubarok',
    description:
      'Mendorong lingkungan berbahasa Arab (Fusha) dan Inggris aktif di asrama dan sekolah melalui pembiasaan kosakata harian, mading berkala, dan kompetisi public speaking.',
    programs: [
      {
        id: 'lang-1',
        title: 'Arabic & English Bi-Weekly Zone',
        target: 'Seluruh santri mukim di asrama putra-putri',
        frequency: 'Mingguan',
        description: 'Pemberlakuan zona wajib berbahasa Arab selama dua pekan pertama dan bahasa Inggris dua pekan berikutnya.',
        expectedOutput: 'Kelancaran spontanitas berbicara (muhadatsah) santri tanpa rasa canggung.'
      },
      {
        id: 'lang-2',
        title: 'Vocabulary Daily Drop & Muhadatsah Shubuh',
        target: 'Seluruh kamar santri',
        frequency: 'Rutin Harian',
        description: 'Pembagian 3 kosa kata tematik setiap pagi ba’da sholat Shubuh untuk dihafalkan dan dipraktikkan.',
        expectedOutput: 'Penguasaan minimal 90 kosa kata baru per bulan oleh setiap santri.'
      },
      {
        id: 'lang-3',
        title: 'Majalah Dinding (Mading) Dwi-Bahasa Edukatif',
        target: 'Santri penulis & pembaca madrasah',
        frequency: 'Mingguan',
        description: 'Penerbitan artikel, esai opini, komik islami, dan puisi karya santri berbahasa Arab dan Inggris.',
        expectedOutput: 'Media literasi bahasa yang artistik dan sarana unjuk karya santri muda.'
      },
      {
        id: 'lang-4',
        title: 'Public Speaking Contest & Khitobah Akbar',
        target: 'Perwakilan santri tiap angkatan',
        frequency: 'Insidental',
        description: 'Perlombaan pidato tiga bahasa menyongsong Hari Santri Nasional dan Milad Pondok.',
        expectedOutput: 'Lahirnya orator ulung santri yang siap berdiplomasi di tingkat regional.'
      }
    ]
  },
  {
    id: 'pendidikan',
    name: 'Departemen Pendidikan, Riset & STEM',
    shortName: 'Pendidikan',
    arabicName: 'قسم التعليم والبحوث (Qismut Ta’lim wal Buhuts)',
    iconName: 'BookOpen',
    coordinator: 'Daniar Pratama',
    description:
      'Meningkatkan mutu literasi akademik, membimbing kelompok belajar teman sebaya, serta mengawal kegiatan praktikum inovasi di laboratorium robotika dan STEM.',
    programs: [
      {
        id: 'edu-1',
        title: 'Kelompok Belajar Mandiri Teman Sebaya (Peer Tutoring)',
        target: 'Santri yang membutuhkan pendampingan mata pelajaran',
        frequency: 'Mingguan',
        description: 'Pendampingan belajar privat oleh santri berprestasi olimpiade untuk mata pelajaran Matematika dan IPA.',
        expectedOutput: 'Pemerataan pemahaman materi KBM sekolah dan penurunan angka remedial.'
      },
      {
        id: 'edu-2',
        title: 'Klinik Persiapan Olimpiade Sains & KSM Santri',
        target: 'Kafilah santri delegasi OSN & KSM',
        frequency: 'Mingguan',
        description: 'Bedah soal-soal kompetisi sains madrasah tingkat kabupaten dan provinsi bersama guru pembimbing.',
        expectedOutput: 'Raihan medali emas dan prestasi akademik di ajang resmi Kemenag & Kemdikbud.'
      },
      {
        id: 'edu-3',
        title: 'Kuis Cerdas Cermat Sains & PAI Mingguan',
        target: 'Seluruh rombongan belajar kelas VII - IX',
        frequency: 'Mingguan',
        description: 'Ajang adu ketangkasan wawasan keislaman dan sains umum pada hari Sabtu ceria.',
        expectedOutput: 'Suasana kompetisi akademik yang sehat, semarak, dan menyenangkan.'
      }
    ]
  },
  {
    id: 'kebersihan',
    name: 'Departemen Kebersihan, Lingkungan & UKS',
    shortName: 'Kebersihan',
    arabicName: 'قسم النظافة والصحة (Qismun Nazhafah)',
    iconName: 'HeartPulse',
    coordinator: 'Salman Al-Farisi',
    description:
      'Menjaga keasrian, kebersihan, dan kesehatan lingkungan pesantren sesuai prinsip kesucian Islam melalui operasi semut berkala dan penyuluhan gizi.',
    programs: [
      {
        id: 'cl-1',
        title: 'Operasi Semut & Roan Akbar Jumat Bersih',
        target: 'Kawasan asrama, masjid, dan gedung sekolah',
        frequency: 'Mingguan',
        description: 'Gotong royong massal setiap Jumat pagi membersihkan saluran air, merapikan taman, dan mengecat dinding asrama.',
        expectedOutput: 'Lingkungan pesantren yang bebas sampah plastik, asri, dan sehat.'
      },
      {
        id: 'cl-2',
        title: 'Inspeksi Sanitasi Kamar Santri Harian',
        target: 'Seluruh kamar santri putra dan putri',
        frequency: 'Rutin Harian',
        description: 'Pemeriksaan kerapian kasur, sirkulasi udara kamar, kebersihan loker, dan kebersihan kamar mandi.',
        expectedOutput: 'Budaya hidup bersih dan tertib asrama yang terjaga 24 jam.'
      },
      {
        id: 'cl-3',
        title: 'Pemberdayaan Pos Kesehatan Pesantren (UKS/Poskestren)',
        target: 'Santri yang mengalami keluhan kesehatan',
        frequency: 'Rutin Harian',
        description: 'Pelayanan P3K cepat, pemeriksaan suhu berkala, serta edukasi pola istirahat dan gizi halal bergizi.',
        expectedOutput: 'Penanganan cepat keluhan santri dan pencegahan penularan penyakit di asrama.'
      }
    ]
  },
  {
    id: 'keamanan',
    name: 'Departemen Kedisiplinan & Tata Tertib',
    shortName: 'Keamanan',
    arabicName: 'قسم الأمن والنظام (Qismul Amni wan Nizham)',
    iconName: 'Shield',
    coordinator: 'Fikri Ramadhan',
    description:
      'Menegakkan tata tertib kepesantrenan, memantau kedisiplinan shalat berjamaah 5 waktu, apel pagi santri, dan menjaga kekhidmatan jam belajar malam.',
    programs: [
      {
        id: 'sec-1',
        title: 'Pengawalan Shalat Berjamaah 5 Waktu & Wirid',
        target: 'Seluruh santri mukim PPJM',
        frequency: 'Rutin Harian',
        description: 'Penertiban santri 10 menit sebelum adzan berkumandang untuk segera berwudhu dan mengisi shaf terdepan masjid.',
        expectedOutput: 'Kedisiplinan ibadah shalat berjamaah 100% tepat waktu tanpa masbuq.'
      },
      {
        id: 'sec-2',
        title: 'Piket Apel Santri & Jam Tertib Malam (Jam Malam)',
        target: 'Penghuni asrama putra dan putri',
        frequency: 'Rutin Harian',
        description: 'Pengecekan absensi santri pukul 22.00 WIB untuk memastikan seluruh santri telah berada di kamar dan beristirahat.',
        expectedOutput: 'Keamanan asrama terjamin dan santri memiliki waktu istirahat yang cukup.'
      },
      {
        id: 'sec-3',
        title: 'Sosialisasi Tata Tertib & Penegakan Disiplin Positif',
        target: 'Santri baru & pelanggar tata tertib',
        frequency: 'Insidental',
        description: 'Bimbingan persuasif dan pemberian sanksi edukatif (menghafal mufrodat atau membaca Al-Qur’an) bagi santri terlambat.',
        expectedOutput: 'Kesadaran disiplin internal tanpa kekerasan fisik, mencerminkan akhlaqul karimah.'
      }
    ]
  }
];

export const OsisProgramsSection: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('bph');

  const activeDept =
    OSIS_DEPARTMENTS.find((d) => d.id === selectedDeptId) || OSIS_DEPARTMENTS[0];

  const getFrequencyBadge = (freq: string) => {
    switch (freq) {
      case 'Rutin Harian':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
      case 'Mingguan':
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60';
      case 'Tahunan':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300/60 dark:border-amber-700/60';
      default:
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Pilar Program Kerja Khidmah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Program Kerja 5 Departemen OSIS
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Rancangan program kerja terpadu untuk penguatan karakter, prestasi sains, kedisiplinan, dan kebersihan santri.
        </p>
      </div>

      {/* Departemen Switcher Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
        {OSIS_DEPARTMENTS.map((dept) => {
          const isSelected = selectedDeptId === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDeptId(dept.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] flex items-center gap-1.5 active:scale-[0.98] ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-zinc-50'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span>{dept.shortName}</span>
              <span className="text-[10px] opacity-75">
                ({dept.programs.length} Proker)
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Department Overview Banner */}
      <div className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-3.5 sm:p-5 shadow-xs space-y-3">
        <div className="space-y-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              {activeDept.arabicName}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              Koordinator: {activeDept.coordinator}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {activeDept.name}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {activeDept.description}
          </p>
        </div>

        {/* Work Programs Grid */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
            Daftar Program Kerja Departemen:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {activeDept.programs.map((proker) => (
              <div
                key={proker.id}
                className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs hover:border-emerald-500/40 hover:bg-white dark:hover:bg-zinc-800 transition-all flex flex-col justify-between space-y-2"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getFrequencyBadge(
                        proker.frequency
                      )}`}
                    >
                      {proker.frequency}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Sasaran: {proker.target}
                    </span>
                  </div>

                  <h5 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {proker.title}
                  </h5>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {proker.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/40 dark:border-zinc-700/50 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Output: {proker.expectedOutput}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

