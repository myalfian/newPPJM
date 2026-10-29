import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Moon,
  Sun,
  BookOpen,
  Users2,
  Heart,
  Flame,
  Award
} from 'lucide-react';
import { RoutineAgendaItem } from './types';

const ROUTINE_DATA: RoutineAgendaItem[] = [
  // --- HARIAN ---
  {
    id: 'rh-1',
    title: 'Murojaah & Ziyadah Tahfidz Ba’da Shubuh',
    period: 'harian',
    scheduleTime: 'Pukul 04.45 - 06.00 WIB',
    category: 'ibadah',
    targetAudience: 'Seluruh Santri Mukim PPJM',
    description: 'Setoran hafalan Al-Qur’an baru serta pengulangan hafalan mutqin langsung di hadapan asatidz pembina halaqah.',
    keyActivities: [
      'Pembacaan Dzikir Pagi Wiridul Lathif',
      'Setoran ziyadah hafalan 1/2 hingga 1 halaman',
      'Tasmi’ berpasangan antar santri (Tadarus bil-Qalb)'
    ]
  },
  {
    id: 'rh-2',
    title: 'Apel Pagi & Pembiasaan Karakter Disiplin',
    period: 'harian',
    scheduleTime: 'Pukul 06.45 - 07.00 WIB',
    category: 'akademik',
    targetAudience: 'Siswa SMP Plus Jauharul Maknuun',
    description: 'Pengecekan kerapian seragam, menyanyikan lagu Indonesia Raya & Mars Pesantren, serta amanat singkat budi pekerti.',
    keyActivities: [
      'Pemeriksaan adab & atribut santri',
      'Ikrar santri & doa pembuka belajar',
      'Briefing target harian KBM sekolah'
    ]
  },
  {
    id: 'rh-3',
    title: 'Kajian Kitab Kuning Sorogan & Bandongan Sore',
    period: 'harian',
    scheduleTime: 'Pukul 15.30 - 17.00 WIB',
    category: 'ibadah',
    targetAudience: 'Santri Tingkat Ula, Wustho & Ulya',
    description: 'Pendalaman kitab turats salafiyah dengan sistem makna gandul Pegon (Matan Jurumiyah, Tijan Darori, Safinatun Najah).',
    keyActivities: [
      'Pembacaan matan kitab secara sorogan',
      'Tanya jawab pemaknaan dan i’rob kalimat',
      'Doa penutup majelis taklim'
    ]
  },
  {
    id: 'rh-4',
    title: 'Belajar Mandiri Malam & Mudzakarah Kamar',
    period: 'harian',
    scheduleTime: 'Pukul 20.00 - 21.30 WIB',
    category: 'akademik',
    targetAudience: 'Seluruh Penghuni Asrama Santri',
    description: 'Pengerjaan tugas sekolah formal, pengulangan kosa kata bahasa Arab/Mandarin, dan persiapan ujian esok hari.',
    keyActivities: [
      'Pendampingan belajar oleh wali asrama',
      'Musyawarah materi pelajaran yang sulit',
      'Persiapan tas dan buku pelajaran esok hari'
    ]
  },

  // --- MINGGUAN ---
  {
    id: 'rm-1',
    title: 'Roan Akbar & Gerakan Pesantren Hijau Bersih',
    period: 'mingguan',
    scheduleTime: 'Setiap Jumat Pagi, 06.00 - 08.00 WIB',
    category: 'kebersihan',
    targetAudience: 'Seluruh Santri Putra & Putri',
    description: 'Kerja bakti massal membersihkan kamar asrama, serambi masjid, taman, dan saluran sanitasi pondok.',
    keyActivities: [
      'Pembersihan menyeluruh lemari & lantai kamar',
      'Perapian jemuran pakaian dan sanitasi lingkungan',
      'Pemilahan sampah organik & anorganik santri'
    ]
  },
  {
    id: 'rm-2',
    title: 'Muhadharah Khitobah 3 Bahasa Santri',
    period: 'mingguan',
    scheduleTime: 'Setiap Kamis Malam, 20.00 - 21.45 WIB',
    category: 'akademik',
    targetAudience: 'Santri Menengah & Pengurus OSIS',
    description: 'Latihan orasi dan public speaking santri bergantian membawakan pidato dalam bahasa Arab, Inggris, dan Indonesia.',
    keyActivities: [
      'Penampilan pidato tanpa naskah perwakilan kamar',
      'Evaluasi vokal, artikulasi & tata bahasa asatidz',
      'Penyerahan predikat Mutakallim Terbaik pekanan'
    ]
  },
  {
    id: 'rm-3',
    title: 'Latihan Gabungan Ekstrakurikuler Wajib & Minat Bakat',
    period: 'mingguan',
    scheduleTime: 'Setiap Sabtu, 13.30 - 17.00 WIB',
    category: 'sosial',
    targetAudience: 'Siswa Kelas VII, VIII, dan IX SMP Plus',
    description: 'Sesi latihan intensif mekatronika robotik STEM, seni hadrah banjari, kaligrafi Islam, silat Pagar Nusa, dan Pramuka.',
    keyActivities: [
      'Pembinaan terfokus sesuai minat bakat santri',
      'Praktikum eksperimen laboratorium mandiri',
      'Persiapan unjuk gelar dan perlombaan regional'
    ]
  },
  {
    id: 'rm-4',
    title: 'Musyawarah Bahtsul Masail Fiqhiyyah Santri',
    period: 'mingguan',
    scheduleTime: 'Setiap Malam Ahad, 20.00 - 22.00 WIB',
    category: 'ibadah',
    targetAudience: 'Santri Tingkat Wustho & Ulya',
    description: 'Forum musyawarah ilmiah santri membedah ibarat kitab fikih klasik dalam merespon persoalan sosial masa kini.',
    keyActivities: [
      'Pembacaan rumusan as’ilah (pertanyaan hukum)',
      'Adu dalil maraji’ mu’tabarah antar musyawirin',
      'Tashih (pengesahan) keputusan oleh Majelis Masyayikh'
    ]
  },

  // --- BULANAN ---
  {
    id: 'rb-1',
    title: 'Khotmil Qur’an Akbar & Mujahadah Syahriyyah',
    period: 'bulanan',
    scheduleTime: 'Jumat Legi (Awal Bulan Hijriyah)',
    category: 'ibadah',
    targetAudience: 'Santri, Asatidz & Masyarakat Sekitar',
    description: 'Mengkhatamkan Al-Qur’an 30 juz secara serentak bil-ghaib dan binnazhar, dilanjutkan istighotsah doa bersama.',
    keyActivities: [
      'Tadarus 30 juz dibagi 30 kelompok santri',
      'Doa Khotmil Qur’an & Tahlil bersama',
      'Santap bersama berkat tasyakuran pondok'
    ]
  },
  {
    id: 'rb-2',
    title: 'Santunan Yatim Piatu & Bhakti Sosial Pesantren',
    period: 'bulanan',
    scheduleTime: 'Pekan Pertama Setiap Bulan',
    category: 'sosial',
    targetAudience: 'Keluarga Besar PPJM & Warga Dhuafa',
    description: 'Penyaluran bingkisan sembako dan santunan tunai kepada warga pra-sejahtera di sekitar kawasan Sidayu Gresik.',
    keyActivities: [
      'Pengumpulan infaq santri dan wali santri',
      'Penyaluran langsung oleh perwakilan santri',
      'Edukasi penanaman empati dan kepedulian sosial'
    ]
  },
  {
    id: 'rb-3',
    title: 'Evaluasi Syahriyyah Akademik & Pembinaan Santri',
    period: 'bulanan',
    scheduleTime: 'Ahad Akhir Bulan, 08.00 - 12.00 WIB',
    category: 'akademik',
    targetAudience: 'Dewan Guru, Asatidz & Pengurus Kamar',
    description: 'Rapat pleno berkala meninjau kedisiplinan santri, progress hafalan juz, prestasi akademik, dan kebersihan asrama.',
    keyActivities: [
      'Laporan statistik kehadiran KBM dan sholat jamaah',
      'Monitoring kesehatan dan gizi santri di asrama',
      'Penyusunan rencana perbaikan bulan berikutnya'
    ]
  }
];

export const RoutineAgendaSection: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');

  const filteredRoutines = ROUTINE_DATA.filter((r) => r.period === selectedPeriod);

  return (
    <div className="space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-300">
      {/* Header & Sub-Switcher Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kedisiplinan Berkala Santri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Agenda Rutin Pesantren &amp; Sekolah
          </h2>
        </div>

        {/* Period Switcher Pills (Harian, Mingguan, Bulanan) */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
          {(['harian', 'mingguan', 'bulanan'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold capitalize transition-all cursor-pointer min-h-[34px] active:scale-[0.98] ${
                selectedPeriod === period
                  ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Agenda {period}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
        {filteredRoutines.map((routine) => {
          return (
            <article
              key={routine.id}
              className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-3.5 sm:p-4.5 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Time & Period Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {routine.scheduleTime}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {routine.targetAudience}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    {routine.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {routine.description}
                  </p>
                </div>

                {/* Key Activities Checklist */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block uppercase tracking-wider">
                    Aktivitas Kunci:
                  </span>
                  <ul className="space-y-1.5">
                    {routine.keyActivities.map((act, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-zinc-400 italic">
                Kedisiplinan & Tarbiyah Berkelanjutan PPJM
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

