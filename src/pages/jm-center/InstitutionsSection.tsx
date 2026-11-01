import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Sparkles,
  ShieldCheck,
  Building2,
  Clock,
  Flame,
  FileCheck2,
  ScrollText,
  Compass,
  ArrowRight,
  ChevronRight,
  School,
  Check
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SafeRichContent } from '../../components/common/SafeRichContent';

export interface InstitutionsSectionProps {
  initialFilter?: 'all' | 'pesantren' | 'formal' | 'madin';
}

/* =========================================================================
   1. DEDICATED SECTION COMPONENT: PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM)
   ========================================================================= */
interface PondokPesantrenSectionProps {
  data?: any;
}

export const PondokPesantrenSection: React.FC<PondokPesantrenSectionProps> = ({ data }) => {
  const defaultDesc = `Pondok Pesantren Jauharul Maknuun menaungi seluruh aktivitas santri mukim dalam bingkai tarbiyah asrama 24 jam. Santri dibina secara intensif dalam hafalan Al-Qur’an 30 juz mutqin dengan sanad keilmuan yang bersambung (*muttashil*), pembiasaan qiyamul lail, sholat fardhu lima waktu berjamaah, wirid *Rotibul Haddad*, serta adab dan akhlakul karimah.

Pondok Pesantren menjadi kawah candradimuka bagi pembentukan karakter pribadi muslim sejati yang teguh memegang tradisi salaf namun siap menjawab tantangan peradaban modern.`;

  const description = data?.description || defaultDesc;
  const imageUrl =
    data?.image_url ||
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';

  const pillars = [
    {
      title: 'Tahfidzul Qur’an 30 Juz Bersanad',
      desc: 'Bimbingan talaqqi intensif dari para huffadz bersanad muttashil, ujian tasmi’ hafalan terbuka, hingga wisuda mutqin.',
      icon: BookOpen,
      badge: '30 Juz Mutqin',
    },
    {
      title: 'Halaqah Tajwid & Qira’ah',
      desc: 'Penguatan makharijul huruf, kaidah tajwid terstandarisasi, dan pengantar kitab-kitab dasar keislaman.',
      icon: Sparkles,
      badge: 'Tartil & Sanad',
    },
    {
      title: 'Tarbiyah Ruhiyah Asrama 24 Jam',
      desc: 'Pembiasaan sholat berjamaah di masjid, qiyamul lail, puasa sunnah, serta istiqamah membaca wirid Rotibul Haddad.',
      icon: Clock,
      badge: 'Mukim Terpadu',
    },
    {
      title: 'Adab Santri & Karakter Salaf',
      desc: 'Penanaman keteladanan budi pekerti, tawadhu’, khidmah santri, ketaatan kepada asatidz, dan kemandirian hidup mukim.',
      icon: ShieldCheck,
      badge: 'Akhlakul Karimah',
    },
  ];

  const features = [
    'Bimbingan talaqqi dan sanad keilmuan muttashil 30 Juz Al-Qur’an',
    'Pengasuhan asrama penuh disiplin, asri, dan berbasis kekeluargaan',
    'Pembiasaan bahasa Arab & bahasa Inggris percakapan harian santri',
    'Evaluasi tasmi’ hafalan terbuka di hadapan wali santri dan masyayikh',
    'Rutinitas amaliyah Ahlussunnah wal Jama’ah dan wirid Rotibul Haddad',
    'Bimbingan kemandirian, kepemimpinan, dan khidmah kemasyarakatan',
  ];

  const stats = [
    { label: 'Sistem Pembelajaran', value: 'Terpadu 24 Jam Mukim' },
    { label: 'Sanad Keilmuan', value: 'Muttashil (Bersambung)' },
    { label: 'Target Utama', value: 'Tahfidz 30 Juz Mutqin' },
    { label: 'Amaliyah Khas', value: 'Rotibul Haddad & Qiyam' },
  ];

  return (
    <article
      id="section-pondok-pesantren"
      className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-emerald-900/20 dark:border-emerald-700/30 p-3.5 sm:p-6 lg:p-7 shadow-md relative overflow-hidden space-y-5"
    >
      {/* Ambient Islamic Ornament Backing */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-emerald-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300/50 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Lembaga Kepesantrenan Mukim 24 Jam</span>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Pondok Pesantren Jauharul Maknuun (PPJM)
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 italic">
            Kawah Candradimuka Santri Mukim, Tahfidzul Qur’an 30 Juz Bersanad &amp; Karakter Salaf
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-1.5 self-start md:self-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            Sanad Tahfidz Muttashil
          </span>
        </div>
      </div>

      {/* 2. Main Two-Column Media & Narrative */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Featured Image with Badge */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-900/15 dark:border-emerald-600/30 shadow-lg group">
            <img
              src={imageUrl}
              alt="Pondok Pesantren Jauharul Maknuun"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full inline-block">
                Pusat Tarbiyah Asrama Santri
              </span>
              <p className="text-xs font-semibold text-zinc-100 line-clamp-1">
                Kawasan Pesantren Asri &amp; Berdisiplin Tinggi di Lasem, Sidayu, Gresik
              </p>
            </div>
          </div>
        </div>

        {/* Right: Rich Narrative & Quick Facts */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
            <SafeRichContent content={description} />
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {stats.map((st, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-center"
              >
                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block">
                  {st.label}
                </span>
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 4 Pilar Kepesantrenan Cards */}
      <div className="relative z-10 pt-2 space-y-2.5">
        <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>4 Pilar Keunggulan Kepesantrenan PPJM</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 p-3 hover:border-emerald-500/50 transition-all duration-300 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
                    {pil.badge}
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white leading-snug">
                    {pil.title}
                  </h5>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal mt-1">
                    {pil.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Checklist Program & Fasilitas Asrama */}
      <div className="relative z-10 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/60 via-zinc-50 to-emerald-50/60 dark:from-emerald-950/30 dark:via-zinc-900/50 dark:to-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 space-y-2">
        <strong className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider block">
          Karakteristik &amp; Keistimewaan Pengasuhan PP. Jauharul Maknuun:
        </strong>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300">
          {features.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

/* =========================================================================
   2. DEDICATED SECTION COMPONENT: SMP PLUS JAUHARUL MAKNUUN (SEKOLAH)
   ========================================================================= */
interface SmpPlusSectionProps {
  data?: any;
}

export const SmpPlusSection: React.FC<SmpPlusSectionProps> = ({ data }) => {
  const defaultDesc = `SMP Plus Jauharul Maknuun Islamic Boarding School merupakan unit lembaga pendidikan jenjang SMP di bawah naungan Pondok pesantren Jauharul Maknuun dan Yayasan Al Jauharul Al Maknuun Lasem. Sekolah ini berada di Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik. Gedung sekolah dan pesantren berdiri di atas tanah seluas 1.188 m² dan diresmikan langsung oleh Wakil Bupati Kab. Gresik, Ibu Hj. Aminatun Habibah, M.Pd. pada tanggal 21 Agustus 2022. Dan pada hari itu pula kegiatan keislaman di Pondok Pesantren Jauharul Maknuun berjalan, dengan diawali kajian dan belajar baca tulis Al-Qur'an untuk anak-anak usia dini di sekitar wilayah Desa Lasem.

SMP Plus Jauharul Maknuun Islamic Boarding School mengawali kegiatan belajar mengajar pada tahun ajaran 2023/2024 yang diikuti oleh 16 peserta didik (10 laki-laki dan 6 perempuan) dari berbagai daerah di sekitar wilayah Kabupaten Gresik.

Yayasan Al Jauharu Al Maknuun Lasem Gresik juga merupakan salah satu yayasan yang mempunyai sekolah swasta SMP berbasis boarding school yang dikelola oleh satu manajemen terpadu dengan SD IRADA “Full Day Education” Gresik, yang menjadi salah satu ikon level pendidikan dasar modern di Kabupaten Gresik.`;

  const description = data?.description || defaultDesc;
  const imageUrl =
    data?.image_url ||
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';

  const fourSyntheses = [
    {
      source: 'Pondok Modern Darussalam Gontor Ponorogo',
      aspect: 'Kedisiplinan, Bahasa (Arab & Inggris), dan Kepemimpinan Organisasi',
      badge: 'Disiplin & Leadership',
      color: 'border-blue-400/40 bg-blue-50/50 dark:bg-blue-950/30',
    },
    {
      source: 'PP. Yanbu’ul Qur’an Kudus',
      aspect: 'Tahfidzul Qur’an, Fashahah Makharijul Huruf, dan Sanad Mutqin',
      badge: 'Tahfidz Mutqin',
      color: 'border-emerald-400/40 bg-emerald-50/50 dark:bg-emerald-950/30',
    },
    {
      source: 'PP. Mambaus Sholihin Gresik',
      aspect: 'Dirosah Islamiyah, Penguasaan Kutubut Turats & Akidah Salaf',
      badge: 'Turats & Salaf',
      color: 'border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/30',
    },
    {
      source: 'SD IRADA “Full Day Education” Gresik',
      aspect: 'Sains Modern, Matematika Penalaran, Budaya Literasi & Riset STEM',
      badge: 'Sains & Literasi',
      color: 'border-purple-400/40 bg-purple-50/50 dark:bg-purple-950/30',
    },
  ];

  const flagshipPrograms = [
    'Tahfidzul Qur’an 30 Juz',
    'JM Camp (Kemah Kepemimpinan Santri)',
    'Pembinaan Super Quantum (SQ)',
    'Student Exchange (Pertukaran Pelajar)',
    'Kelas Bilingual (Active English & Arabic)',
    'English Week & Usbu’ul Arabiy',
    'Entrepreneurship Class (Kewirausahaan)',
    'Kelas Olimpiade & Riset STEM Komputer',
    'Joyful Learning & Multimedia Class',
    'Kelas Keputrian Terarah',
    'Pembinaan Lifeskill & Kemandirian',
    'Kajian Kitab Jauharul Maknuun',
    'Muhadhoroh 3 Bahasa (Arab, Inggris, Indo)',
    'Rihlah Iqtishodiyah wat Tarbawiyah',
  ];

  const extracurriculars = [
    'Robotika STEM & Coding',
    'Perisai Diri (Bela Diri)',
    'Panahan Sunnah',
    'Futsal & Mini Soccer',
    'Badminton',
    'Kaligrafi Islam',
    'Seni Tilawah Al-Qur’an',
    'Pramuka Penggalang',
    'Hadrah Al-Banjari',
    'Bahasa Mandarin Interaktif',
    'Literasi & Jurnalistik Santri',
  ];

  const stats = [
    { label: 'Akreditasi BAN-PDM', value: 'A (Unggul)' },
    { label: 'NPSN Resmi', value: '70045189' },
    { label: 'Kepala Sekolah', value: 'Ferany Ardiana, S.S., M.Pd.' },
    { label: 'Kontak Kasek', value: '085850868616' },
    { label: 'Peserta Didik', value: '128 Santri' },
    { label: 'Tenaga Pendidik', value: '27 Dewan Guru' },
    { label: 'Kontak Resmi', value: '082131606535' },
    { label: 'Email Resmi', value: 'smpplusjauharulmaknuun@gmail.com' },
  ];

  return (
    <article
      id="section-smp-plus"
      className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 sm:p-6 lg:p-7 shadow-md relative overflow-hidden space-y-5"
    >
      {/* 1. Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300/50 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <School className="w-3.5 h-3.5" />
            <span>Pendidikan Formal &amp; Riset Modern</span>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            SMP Plus Jauharul Maknuun “Islamic Boarding School”
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 italic">
            Memadukan Kurikulum Nasional, Pesantren Salaf-Modern &amp; Riset Sains Berbasis Karakter
          </p>
        </div>

        {/* Akreditasi Badge */}
        <div className="flex items-center gap-2 bg-amber-50/90 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-700/60 rounded-xl px-3 py-1.5 self-start md:self-center shrink-0">
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
              Akreditasi BAN-PDM
            </span>
            <span className="text-xs font-black text-amber-900 dark:text-amber-300">
              Grade &quot;A&quot; (Unggul) • NPSN 70045189
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Media & Sejarah Berdiri */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Featured Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg group">
            <img
              src={imageUrl}
              alt="SMP Plus Jauharul Maknuun"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full inline-block">
                Gedung &amp; Kampus Terpadu 1.188 m²
              </span>
              <p className="text-xs font-semibold text-zinc-100 line-clamp-1">
                Diresmikan oleh Wakil Bupati Gresik Hj. Aminatun Habibah, M.Pd. (21 Agustus 2022)
              </p>
            </div>
          </div>
        </div>

        {/* Narrative & History */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Sejarah &amp; Rekam Jejak Pendirian</span>
          </h4>
          <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
            <SafeRichContent content={description} />
          </div>
        </div>
      </div>

      {/* 3. 4 SINTESA KURIKULUM - The Core Educational Compass */}
      <div className="relative z-10 pt-2 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>4 Sintesa Kurikulum Unggulan (Kiblat Satuan Pendidikan)</span>
          </h4>
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider hidden sm:inline-block">
            Sinergi Lembaga Pesantren &amp; Sains
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fourSyntheses.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 transition-all duration-300 space-y-2 ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-black text-zinc-900 dark:text-white bg-white/70 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md shadow-2xs">
                  Sintesa 0{idx + 1}
                </span>
                <span className="text-[9.5px] font-bold text-emerald-800 dark:text-emerald-300">
                  {item.badge}
                </span>
              </div>
              <div>
                <h5 className="text-xs font-black text-zinc-900 dark:text-white leading-snug">
                  {item.source}
                </h5>
                <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-normal mt-1">
                  {item.aspect}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 14 PROGRAM UNGGULAN & EKSTRAKURIKULER */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        {/* Left: Program Unggulan */}
        <div className="lg:col-span-7 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 p-3.5 space-y-2.5">
          <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>14 Program Unggulan Terpadu</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            {flagshipPrograms.map((prog, idx) => (
              <div key={idx} className="flex items-center gap-1.5 py-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="font-medium">{prog}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ekstrakurikuler Pilihan */}
        <div className="lg:col-span-5 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 p-3.5 space-y-2.5">
          <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekstrakurikuler Pilihan Santri</span>
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {extracurriculars.map((ekskul, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {ekskul}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. TABEL IDENTITAS RESMI SEKOLAH */}
      <div className="relative z-10 pt-2 space-y-2">
        <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tabel Identitas Resmi &amp; Kontak Kelembagaan</span>
        </h5>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {stats.map((st, i) => (
            <div
              key={i}
              className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40"
            >
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">
                {st.label}
              </span>
              <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 break-words">
                {st.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

/* =========================================================================
   3. DEDICATED SECTION COMPONENT: MADRASAH DINIYAH TAKMILIYAH WUSTHO (MDT)
   ========================================================================= */
interface MadinSectionProps {
  data?: any;
}

export const MadinSection: React.FC<MadinSectionProps> = ({ data }) => {
  const defaultDesc = `Di samping memiliki unit Pendidikan SMP Plus Jauharul Maknuun “Islamic Boarding School”, Yayasan Al Jauharu Al Maknuun Lasem juga memiliki lembaga pendidikan formal keagamaan yaitu unit Pendidikan Madrasah Diniyah Takmiliyah Wustho Jauharul Maknuun yang terfokuskan dalam memberikan pembelajaran agama serta tata bahasa arab sebagai pengantar memahami ilmu-ilmu agama, terutama Al-Qur’an dan hadis.

Dalam kurikulumnya, madrasah diniyah ini mengikuti kurikulum pesantren salaf dengan pembelajaran yang terpusatkan dalam materi materi keagamaan dan dengan sistem pesantren klasik yaitu maknani jawa. Mata pelajaran satu dengan yang lain sangat berkaitan, meliputi: fikih, nahwu, shorof, hadits, akhlak, tauhid, faraidh, tarikh, bahasa arab.

Lembaga pendidikan Madrasah Diniyah ini juga sudah terdaftar resmi di Kantor Kementerian Agama Republik Indonesia.`;

  const description = data?.description || defaultDesc;
  const imageUrl =
    data?.image_url ||
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80';

  const nineSubjects = [
    {
      name: 'Fikih',
      arabic: 'الفقه',
      desc: 'Hukum syariat islam, tata cara ibadah yaumiyyah, thaharah, muamalah, dan munakahat.',
    },
    {
      name: 'Nahwu',
      arabic: 'النحو',
      desc: 'Tata bahasa Arab sintaksis, baris akhir kalimat (*i’rab*), dan struktur kalam fi’il-isim.',
    },
    {
      name: 'Shorof',
      arabic: 'الصرف',
      desc: 'Morfologi pembentukan kata, wazan tasrif lughawi & istilahi pengantar makna kosa kata.',
    },
    {
      name: 'Hadits',
      arabic: 'الحديث',
      desc: 'Penelusuran sabda, perbuatan, serta ketetapan Rasulullah saw. dan adab perawi.',
    },
    {
      name: 'Akhlak',
      arabic: 'الأخلاق',
      desc: 'Tazkiyatun nafs (penyucian hati), adab menuntut ilmu, dan keluhuran budi pekerti salaf.',
    },
    {
      name: 'Tauhid',
      arabic: 'التوحيد',
      desc: 'Akidah dasar keimanan, sifat wajib Allah & Rasul, berasaskan Ahlussunnah wal Jama’ah.',
    },
    {
      name: 'Faraidh',
      arabic: 'الفرائض',
      desc: 'Kaidah pembagian harta waris Islam secara presisi sesuai dalil Al-Qur’an dan Sunnah.',
    },
    {
      name: 'Tarikh',
      arabic: 'التاريخ',
      desc: 'Sejarah peradaban Islam, sirah Nabawiyah, dan keteladanan Khulafaur Rasyidin.',
    },
    {
      name: 'Bahasa Arab',
      arabic: 'اللغة العربية',
      desc: 'Penguasaan kosakata (*mufradat*), muthola’ah, kalam, dan insya’ aplikatif santri.',
    },
  ];

  const officialProfileRows = [
    { label: 'Nama Lembaga', value: 'MDT Wustho Jauharul Maknuun' },
    { label: 'Tingkat Pendidikan', value: 'Wustho (Setingkat Menengah)' },
    { label: 'Nomor Statistik (NSDT)', value: '322235251146' },
    { label: 'Status Legalitas', value: 'Terdaftar Resmi Kemenag RI' },
    { label: 'Tahun Berdiri', value: '21 – 08 – 2022' },
    { label: 'Nama Yayasan', value: 'Al Jauharu Al Maknuun' },
    {
      label: 'Alamat Lengkap',
      value: 'Jl. Raya Dukun – Lasem RT 01 RW 01 Lasem – Sidayu – Gresik – Jawa Timur',
    },
  ];

  return (
    <article
      id="section-madrasah-diniyah"
      className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-amber-900/20 dark:border-amber-700/30 p-3.5 sm:p-6 lg:p-7 shadow-md relative overflow-hidden space-y-5"
    >
      {/* Ambient Turats Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-300/50 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <ScrollText className="w-3.5 h-3.5" />
            <span>Pendidikan Formal Keagamaan &amp; Salafiyah</span>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Madrasah Diniyah Takmiliyah Wustho Jauharul Maknuun
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 italic">
            Pembelajaran Agama &amp; Tata Bahasa Arab Pengantar Turats Berizin Resmi Kemenag RI
          </p>
        </div>

        {/* Legalitas Kemenag Badge */}
        <div className="flex items-center gap-2 bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-700/60 rounded-xl px-3 py-1.5 self-start md:self-center shrink-0">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
              Legalitas Kemenag RI
            </span>
            <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">
              NSDT: 322235251146
            </span>
          </div>
        </div>
      </div>

      {/* 2. Media Image & Narrative */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Featured Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-900/15 dark:border-amber-600/30 shadow-lg group">
            <img
              src={imageUrl}
              alt="Madrasah Diniyah Wustho Jauharul Maknuun"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full inline-block">
                Tradisi Salaf Maknani Jawa
              </span>
              <p className="text-xs font-semibold text-zinc-100 line-clamp-1">
                Kajian Kitab Kuning Berjenjang dan Terintegrasi Ilmu Agama
              </p>
            </div>
          </div>
        </div>

        {/* Right: Narrative Description */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Profil &amp; Sistem Pembelajaran Salaf</span>
          </h4>
          <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
            <SafeRichContent content={description} />
          </div>
        </div>
      </div>

      {/* 3. 9 MATA PELAJARAN TURATS SALAF (3x3 Grid) */}
      <div className="relative z-10 pt-2 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>9 Mata Pelajaran Turats Salaf Terintegrasi (Maknani Jawa)</span>
          </h4>
          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider hidden sm:inline-block">
            Kurikulum Salafiyah Berkesinambungan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {nineSubjects.map((sub, idx) => (
            <div
              key={idx}
              className="bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 p-3 hover:border-amber-500/50 transition-all duration-300 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-900 dark:text-white">
                  0{idx + 1}. {sub.name}
                </span>
                <span className="font-arabic text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  {sub.arabic}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                {sub.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TABEL IDENTITAS RESMI MADRASAH DINIYAH */}
      <div className="relative z-10 pt-2 space-y-2">
        <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
          <span>Profil Resmi MDT Wustho Jauharul Maknuun</span>
        </h5>

        <div className="overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60">
          <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
            <tbody>
              {officialProfileRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-b-0 ${
                    idx % 2 === 0
                      ? 'bg-transparent'
                      : 'bg-emerald-50/30 dark:bg-emerald-950/20'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-zinc-900 dark:text-zinc-200 w-1/3 sm:w-1/4">
                    {row.label}
                  </td>
                  <td className="py-2 px-3 font-semibold text-emerald-950 dark:text-emerald-300">
                    : {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
};

/* =========================================================================
   4. MAIN ORCHESTRATOR: INSTITUTIONS SECTION WITH FILTER TABS
   ========================================================================= */
export const InstitutionsSection: React.FC<InstitutionsSectionProps> = ({ initialFilter = 'all' }) => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pesantren' | 'formal' | 'madin'>(initialFilter);

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    let isMounted = true;
    const fetchInstitutions = async () => {
      if (!isSupabaseConfigured()) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          setInstitutions(data);
        }
      } catch (err) {
        console.warn('Failed to load institutions from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInstitutions();
    return () => {
      isMounted = false;
    };
  }, []);

  const pesantrenData = institutions.find(
    (item) =>
      item.type === 'pesantren' ||
      item.name?.toLowerCase().includes('pondok') ||
      item.name?.toLowerCase().includes('ppjm')
  );

  const smpData = institutions.find(
    (item) =>
      item.type === 'formal' ||
      item.name?.toLowerCase().includes('smp') ||
      item.name?.toLowerCase().includes('sekolah')
  );

  const madinData = institutions.find(
    (item) =>
      item.type === 'diniyah' ||
      item.type === 'madin' ||
      item.name?.toLowerCase().includes('mdt') ||
      item.name?.toLowerCase().includes('diniyah') ||
      item.name?.toLowerCase().includes('madrasah')
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Top Bar: Title & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Tritunggal Lembaga Terpadu</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Tiga Unit Entitas Pendidikan Terintegrasi
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Sinergi harmonis antara Pesantren Salafiyah, Sekolah Menengah Pertama Formal, dan Madrasah Diniyah untuk mewujudkan insan kamil.
          </p>
        </div>

        {/* Filter Pills (Matches Attached Image Style Exactly) */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/60 text-xs overflow-x-auto shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            Semua Unit
          </button>
          <button
            type="button"
            onClick={() => setFilter('pesantren')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs whitespace-nowrap cursor-pointer ${
              filter === 'pesantren'
                ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            Pondok Pesantren
          </button>
          <button
            type="button"
            onClick={() => setFilter('formal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs whitespace-nowrap cursor-pointer ${
              filter === 'formal'
                ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            SMP Plus (Sekolah)
          </button>
          <button
            type="button"
            onClick={() => setFilter('madin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs whitespace-nowrap cursor-pointer ${
              filter === 'madin'
                ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            Madrasah Diniyah
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/60 dark:border-zinc-700/60"
            />
          ))}
        </div>
      )}

      {/* Dynamic Content Rendering based on Tab Filter */}
      {!loading && (
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            {/* VIEW 1: SEMUA UNIT (Sequential View of All 3 Dedicated Sections) */}
            {filter === 'all' && (
              <motion.div
                key="view-all-units"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* 1. Pondok Pesantren Section */}
                <PondokPesantrenSection data={pesantrenData} />

                {/* Section Separator */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-50 dark:bg-zinc-950 px-3 text-zinc-400 font-bold tracking-widest">
                      Unit Pendidikan Formal
                    </span>
                  </div>
                </div>

                {/* 2. SMP Plus Section */}
                <SmpPlusSection data={smpData} />

                {/* Section Separator */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-50 dark:bg-zinc-950 px-3 text-zinc-400 font-bold tracking-widest">
                      Unit Pendidikan Keagamaan Salaf
                    </span>
                  </div>
                </div>

                {/* 3. Madrasah Diniyah Section */}
                <MadinSection data={madinData} />
              </motion.div>
            )}

            {/* VIEW 2: PONDOK PESANTREN ONLY */}
            {filter === 'pesantren' && (
              <motion.div
                key="view-pesantren-only"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PondokPesantrenSection data={pesantrenData} />
              </motion.div>
            )}

            {/* VIEW 3: SMP PLUS (SEKOLAH) ONLY */}
            {filter === 'formal' && (
              <motion.div
                key="view-smp-only"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SmpPlusSection data={smpData} />
              </motion.div>
            )}

            {/* VIEW 4: MADRASAH DINIYAH ONLY */}
            {filter === 'madin' && (
              <motion.div
                key="view-madin-only"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MadinSection data={madinData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default InstitutionsSection;
