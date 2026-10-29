import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  BookOpenCheck
} from 'lucide-react';
import { InstitutionItem } from './types';

export const MOCK_INSTITUTIONS: InstitutionItem[] = [
  {
    id: 'inst-pondok',
    name: 'Pondok Pesantren Jauharul Maknuun',
    shortName: 'Pondok Pesantren (PPJM)',
    categoryTag: 'Lembaga Kepesantrenan',
    tagline: 'Kawah Candradimuka Santri Mukim, Tahfidz 30 Juz Bersanad & Karakter Salaf',
    description:
      'Pondok Pesantren Jauharul Maknuun menaungi seluruh aktivitas santri mukim dalam bingkai tarbiyah asrama 24 jam. Santri dibina secara intensif dalam hafalan Al-Qur’an 30 juz mutqin dengan sanad keilmuan yang bersambung, pembiasaan qiyamul lail, sholat berjamaah, wirid rotibul haddad, serta adab akhlakul karimah.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    curriculumHighlight: 'Takhassus Tahfidzul Qur’an Bersanad, Halaqah Tajwid & Tahsin, Tarbiyah Ruhiyah Asrama 24 Jam',
    features: [
      'Bimbingan talaqqi musyafahah tahfidz bersanad muttashil',
      'Pengasuhan asrama penuh disiplin, asri, dan berbasis kekeluargaan',
      'Pembiasaan bahasa Arab & bahasa Inggris dalam percakapan harian',
      'Evaluasi tasmi’ hafalan terbuka dan wisuda haflah berkala',
    ],
    stats: [
      { label: 'Target Hafalan', value: '30 Juz Mutqin' },
      { label: 'Sistem Asrama', value: 'Mukim 24 Jam' },
      { label: 'Sanad Keilmuan', value: 'Muttashil' },
    ],
  },
  {
    id: 'inst-smp',
    name: 'SMP Plus Jauharul Maknuun',
    shortName: 'SMP Plus JM',
    categoryTag: 'Lembaga Pendidikan Formal',
    tagline: 'Terakreditasi "A" BAN-PDM, Unggul Akademik & Inovasi Sains Teknologi STEM',
    description:
      'Sekolah Menengah Pertama formal terpadu yang memadukan Kurikulum Merdeka Nasional dengan kurikulum kepesantrenan. Didukung tenaga pendidik profesional linier, sarana kelas multimedia ber-AC, dan kurikulum riset terapan STEM (Sains, Teknologi, Rekayasa, dan Matematika) yang membekali santri menjadi inovator masa depan.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    curriculumHighlight: 'Kurikulum Merdeka BAN-PDM Akreditasi "A", Laboratorium Riset STEM Komputer, Bimbingan Olimpiade Sains',
    features: [
      'Akreditasi "A" BAN-PDM dengan predikat Unggul Nasional',
      'Laboratorium komputer modern dengan riset IoT & mikrokontroler',
      'Bilingual learning assistance (Bahasa Inggris & Bahasa Mandarin dasar)',
      'Ekstrakurikuler sains club, robotika, jurnalistik & seni bela diri',
    ],
    stats: [
      { label: 'Status Akreditasi', value: 'Terakreditasi "A"' },
      { label: 'Fasilitas Lab', value: 'STEM & Robotika' },
      { label: 'Lulusan', value: '100% Lulus PTN/SLTA Favorit' },
    ],
  },
  {
    id: 'inst-madin',
    name: 'Madrasah Diniyah Salafiyah (Madin)',
    shortName: 'Madin Salafiyah',
    categoryTag: 'Lembaga Keilmuan Turats',
    tagline: 'Mengkaji Khazanah Kitab Kuning Turats Salaf dengan Metode Pemaknaan Gandul',
    description:
      'Madrasah Diniyah berjenjang (Ula, Wustho, Ulya) yang diselenggarakan setiap sore dan malam hari untuk memperdalam khazanah ilmu alat (Nahwu-Shorof), Fiqih Fathul Qorib, Ushul Fiqih, Aqidah Akhlak, Hadits Arbain & Riyadhis Shalihin di bawah bimbingan para Masyayikh pesantren.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    curriculumHighlight: 'Kajian Kitab Turots Berjenjang, Metode Maknani Gandul Pegon Jawa, Sorogan & Bandongan Mandiri',
    features: [
      'Metode pemaknaan gandul aksara pegon menjaga keotentikan salaf',
      'Penjenjangan kelas diniyah terstruktur dari dasar hingga tingkat tinggi',
      'Ujian sorogan terbuka qira’atul kutub di hadapan mushohih',
      'Kajian rutin akhlaq lil banin/banat dan kitab tasawuf penyejuk jiwa',
    ],
    stats: [
      { label: 'Penjenjangan', value: 'Ula - Wustho - Ulya' },
      { label: 'Metode', value: 'Sorogan & Bandongan' },
      { label: 'Kurikulum', value: 'Turats Pesantren Salaf' },
    ],
  },
];

export const InstitutionsSection: React.FC = () => {
  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* Header Description */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Tritunggal Lembaga Terpadu</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          Tiga Unit Entitas Pendidikan Terintegrasi
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Sinergi harmonis antara Pesantren Salafiyah, Sekolah Menengah Pertama Formal, dan Madrasah Diniyah untuk mewujudkan insan kamil.
        </p>
      </div>

      {/* Split Card Display Adaptif (Bergantian Foto-Kiri Teks-Kanan di Desktop, Stacked di Mobile) */}
      <div className="space-y-2.5 sm:space-y-3.5">
        {MOCK_INSTITUTIONS.map((inst, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <article
              key={inst.id}
              className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 sm:p-5 lg:p-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Media Image Column */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200/70 dark:border-zinc-700/60 shadow-lg group">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                        {inst.shortName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-7 space-y-3.5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/50">
                      {inst.categoryTag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight pt-1">
                      {inst.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 italic">
                      {inst.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {inst.description}
                  </p>

                  {/* Curriculum Highlight Box */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 text-xs">
                    <strong className="text-zinc-800 dark:text-zinc-200 block text-[11px] uppercase tracking-wider mb-0.5">
                      Fokus Kurikulum:
                    </strong>
                    <span className="text-emerald-800 dark:text-emerald-400 font-medium">
                      {inst.curriculumHighlight}
                    </span>
                  </div>

                  {/* Bullet Points */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300 pt-1">
                    {inst.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats Pill Badges */}
                  {inst.stats && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {inst.stats.map((stat, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-3 py-1 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs"
                        >
                          <span className="text-zinc-500 dark:text-zinc-400 text-[10px] block">
                            {stat.label}
                          </span>
                          <span className="font-extrabold text-emerald-900 dark:text-emerald-300">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

