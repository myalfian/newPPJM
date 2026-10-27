import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  Globe,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Send,
  MessageSquareHeart,
  ChevronRight,
  Shield,
  Activity,
  Flame,
  Check,
  Star,
  Layers3
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface PengurusItem {
  id: string;
  nama: string;
  jabatan: string;
  divisi: string;
  kelas: string;
  foto: string;
  motto: string;
  lencana: string;
}

interface DivisiProgram {
  id: string;
  nama: string;
  namaArab: string;
  icon: React.ComponentType<{ className?: string }>;
  warna: string;
  koordinator: string;
  deskripsi: string;
  programKerja: string[];
}

const DAFTAR_PENGURUS: PengurusItem[] = [
  {
    id: 'bph-1',
    nama: 'Ahmad Faizur Rahman',
    jabatan: 'Ketua Umum OSIS Putra',
    divisi: 'Badan Pengurus Harian (BPH)',
    kelas: 'Kelas XII Madrasah Aliyah',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    motto: 'Memimpin dengan keteladanan akhlaq, mengabdi untuk barokah kiai.',
    lencana: 'Mandat Utama'
  },
  {
    id: 'bph-2',
    nama: 'Nabila Zahra Al-Munawwarah',
    jabatan: 'Ketua Umum OSIS Putri',
    divisi: 'Badan Pengurus Harian (BPH)',
    kelas: 'Kelas XII Madrasah Aliyah',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    motto: 'Santriwati tangguh, berilmu amaliyah, dan berakhlakul karimah.',
    lencana: 'Mandat Utama'
  },
  {
    id: 'bph-3',
    nama: 'M. Rizqi Syaifullah',
    jabatan: 'Sekretaris Jenderal',
    divisi: 'Sekretariat & Administrasi',
    kelas: 'Kelas XI Madrasah Aliyah',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    motto: 'Tertib administrasi wujud amanah khidmah santri.',
    lencana: 'Administrasi'
  },
  {
    id: 'bph-4',
    nama: 'Fatimah Az-Zahra',
    jabatan: 'Bendahara Umum',
    divisi: 'Kebendaharaan & Kas Pondok',
    kelas: 'Kelas XI Madrasah Aliyah',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    motto: 'Amanah, transparan, dan barokah dalam setiap rupiah perjuangan.',
    lencana: 'Keuangan'
  }
];

const DIVISI_PROGRAM: DivisiProgram[] = [
  {
    id: 'div-bahasa',
    nama: 'Pengembangan Bahasa Asing',
    namaArab: 'Qismul Lughah al-Ajnabiyyah',
    icon: Globe,
    warna: 'from-sky-500 to-blue-600',
    koordinator: 'Ust. Daniar & Akhina Hilmi',
    deskripsi: 'Menumbuhkan budaya percakapan harian aktif dalam bahasa Arab, Mandarin (STEM Lab), dan Inggris bagi seluruh santri asrama.',
    programKerja: [
      'Muhadharah 3 Bahasa mingguan di mimbar utama santri',
      'Daily Vocabulary & Pinyin Hanzi Morning Clinic',
      'JM Language Week (Pekan Bahasa & Debat Santri)',
      'Bimbingan Lomba Pidato & Storytelling Nasional'
    ]
  },
  {
    id: 'div-taklim',
    nama: 'Keilmuan & Kajian Turats',
    namaArab: "Qismu Ta'lim wa Kutubut Turats",
    icon: BookOpen,
    warna: 'from-emerald-600 to-teal-700',
    koordinator: 'Ust. M. Ridlwan & Akhina Zaki',
    deskripsi: 'Mengawal tradisi sorogan, bandongan maknani gandul, penguatan hafalan nadzom Alfiyah & Imrithi, serta musabaqah qiraatul kutub.',
    programKerja: [
      'Musabaqah Hifdzil Nadzom (Alfiyah & Aqidatul Awam)',
      'Halaqah Mudzakarah Bahtsul Masail Santri Wustha',
      'Karantina Intensif Peserta MQK Jawa Timur',
      'Pelatihan Penulisan Kaligrafi Islam Kontemporer'
    ]
  },
  {
    id: 'div-keamanan',
    nama: 'Kedisiplinan & Ketertiban Santri',
    namaArab: 'Qismul Amni wal Inzhbat',
    icon: ShieldCheck,
    warna: 'from-indigo-600 to-violet-700',
    koordinator: 'Akhina Wildan & Ukhtina Sarah',
    deskripsi: 'Menjaga tata tertib asrama, ketepatan waktu sholat fardhu berjamaah di masjid, dan kenyamanan lingkungan belajar santri.',
    programKerja: [
      'Piketan ronda malam & kontrol lampu asrama',
      'Pemeriksaan absensi sholat subuh & maghrib berjamaah',
      'Bimbingan santri teladan & penghargaan kedisiplinan',
      'Penyuluhan anti-bullying & persaudaraan ukhuwah islamiyah'
    ]
  },
  {
    id: 'div-lingkungan',
    nama: 'Kebersihan & Pesantren Hijau',
    namaArab: "Qismun Nazhafah wal Bi'ah",
    icon: Sparkles,
    warna: 'from-teal-500 to-emerald-600',
    koordinator: 'Akhina Rian & Ukhtina Dina',
    deskripsi: 'Mengupayakan kebersihan lingkungan asrama santri, program eco-pesantren, pemilahan sampah mandiri, dan taman asri.',
    programKerja: [
      'Roan Akbar (Jumat Bersih & Operasi Semut Sanitasi)',
      'Lomba Asrama & Kamar Santri Paling Bersih dan Wangi',
      'Pemberdayaan Eco-brick & Daur Ulang Kreatif Santri',
      'Perawatan Green-House & Hidroponik Otomasi Laboratorium'
    ]
  },
  {
    id: 'div-olahraga',
    nama: 'Olahraga & Seni Bela Diri',
    namaArab: 'Qismur Riyadhah wal Fushul',
    icon: Activity,
    warna: 'from-amber-500 to-orange-600',
    koordinator: 'Akhina Fadhil & Pendekar Pagar Nusa',
    deskripsi: 'Menyalurkan bakat jasmani santri melalui latihan rutin bela diri tradisional Pagar Nusa, turnamen futsal, badminton, dan tenis meja.',
    programKerja: [
      'Liga Santri Jauharul Maknuun Futsal Championship',
      'Ujian Kenaikan Tingkat (UKT) Pencak Silat Pagar Nusa',
      'Senam Pagi Santri Sehat Sepekan Sekali',
      'Pengiriman Delegasi Santri ke POSPEDA & PORSENI'
    ]
  },
  {
    id: 'div-media',
    nama: 'Media Dakwah & Jurnalistik',
    namaArab: "Qismul I'lam was Shihofah",
    icon: Flame,
    warna: 'from-rose-500 to-pink-600',
    koordinator: 'Akhina Arga & Tim Multimedia',
    deskripsi: 'Mempublikasikan warta kegiatan santri, mengelola mading digital, dokumentasi video kreatif dakwah, dan buletin santri.',
    programKerja: [
      'Penerbitan Buletin Triwulan "Gema Jauharul Maknuun"',
      'Pelatihan Fotografi & Desain Grafis Santriwati',
      'Podcast Santri Inspiratif bersama Tokoh Alumni',
      'Pengelolaan Mading Fisik & Majalah Dinding Digital'
    ]
  }
];

export const Osis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'struktur' | 'divisi' | 'aspirasi'>('struktur');
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Program Belajar',
    pesan: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pesan.trim()) return;

    const record = {
      id: `asp-${Date.now()}`,
      nama: formData.nama || 'Anonim',
      kategori: formData.kategori,
      pesan: formData.pesan,
      created_at: new Date().toISOString()
    };

    // 1. Local persistence backup
    try {
      const stored = JSON.parse(localStorage.getItem('ppjm_student_aspirations') || '[]');
      stored.unshift(record);
      localStorage.setItem('ppjm_student_aspirations', JSON.stringify(stored.slice(0, 50)));
    } catch (err) {
      console.warn('Failed to store aspiration locally:', err);
    }

    // 2. Supabase persistence
    if (isSupabaseConfigured()) {
      try {
        await (supabase as any).from('aspirations').insert({
          name: record.nama,
          category: record.kategori,
          message: record.pesan,
          created_at: record.created_at
        });
      } catch (err) {
        console.warn('Supabase aspirations table sync note:', err);
      }
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Universal Hub Breadcrumb Tabs */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 pt-2 pb-1">
        <NavBarTabs />
      </div>

      {/* 1. HERO HEADER SECTION */}
      <section className="relative bg-gradient-to-br from-[#07361d] via-[#0f5132] to-[#126b3c] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
        {/* Subtle Sacred Gold Ambient Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3.5">
          {/* Official OSIS Emblem Badge */}
          <div className="flex justify-center mb-1">
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-center group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#ffd700]/25 rounded-2xl blur-lg pointer-events-none" />
              <img
                src="/logo-osis.png"
                alt="Lambang Resmi OSIS"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-md select-none"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#d4af37]/40 text-[#ffd700] text-xs font-black tracking-wider uppercase shadow-xs">
            <img src="/logo-osis.png" alt="OSIS" className="w-4 h-4 object-contain inline-block" />
            <span>Organisasi Santri Intra Ma'had (OPJM / OSIS)</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Kepemimpinan Santri yang Berakhlak, <br className="hidden sm:inline" />
            <span className="text-[#ffd700]">Tangguh, Kreatif &amp; Berwawasan Global</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
            Wadah pengabdian, kepengurusan, dan penempaan integritas santri Pondok Pesantren Jauharul Maknuun Lasem Sidayu dalam mewujudkan generasi mandiri dan berilmu amaliyah.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xl sm:text-2xl font-black text-[#ffd700]">48+</p>
              <p className="text-[11px] font-bold text-emerald-100">Pengurus Terpilih</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xl sm:text-2xl font-black text-white">6</p>
              <p className="text-[11px] font-bold text-emerald-100">Divisi Unggulan</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xl sm:text-2xl font-black text-[#ffd700]">24</p>
              <p className="text-[11px] font-bold text-emerald-100">Program Kerja Aktif</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xl sm:text-2xl font-black text-white">100%</p>
              <p className="text-[11px] font-bold text-emerald-100">Khidmah Santri</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-slate-200/90 max-w-xl mx-auto flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('struktur')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'struktur'
                ? 'bg-[#0f5132] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Bagan BPH</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('divisi')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'divisi'
                ? 'bg-[#0f5132] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers3 className="w-4 h-4" />
            <span>6 Divisi &amp; Proker</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aspirasi')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'aspirasi'
                ? 'bg-[#0f5132] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Kotak Aspirasi</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT TABS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AnimatePresence mode="wait">
          {/* TAB 1: STRUKTUR PENGURUS BPH */}
          {activeTab === 'struktur' && (
            <motion.div
              key="struktur"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  Masa Bakti 2025 / 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Badan Pengurus Harian (BPH) OSIS
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Teladan santri terpilih yang diamanahi mengomandani roda kepengurusan santri di asrama putra dan putri.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DAFTAR_PENGURUS.map((pengurus) => (
                  <div
                    key={pengurus.id}
                    className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md border border-slate-200/90 transition-all duration-300 flex flex-col items-center text-center group"
                  >
                    {/* Portrait Avatar */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-3 border-2 border-emerald-500/30 group-hover:border-emerald-600 transition-colors shadow-inner">
                      <img
                        src={pengurus.foto}
                        alt={pengurus.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-800 text-[#ffd700] text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        {pengurus.lencana}
                      </span>
                    </div>

                    {/* Information */}
                    <div className="space-y-1 w-full">
                      <h3 className="font-black text-base text-slate-900 tracking-tight line-clamp-1 group-hover:text-emerald-800 transition-colors">
                        {pengurus.nama}
                      </h3>
                      <p className="text-xs font-black text-emerald-700">{pengurus.jabatan}</p>
                      <p className="text-[11px] font-semibold text-slate-400">{pengurus.kelas}</p>
                    </div>

                    {/* Motto */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 w-full">
                      <p className="text-[11px] text-slate-600 italic line-clamp-2">
                        &quot;{pengurus.motto}&quot;
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visi & Misi Kabinet Banner */}
              <div className="mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                      Nawa Cita Kabinet OSIS PPJM
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Visi &amp; Misi Kepengurusan Santri
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                      <div className="flex items-center gap-2 mb-2 text-emerald-800 font-black text-sm">
                        <Star className="w-4 h-4 text-[#d4af37]" />
                        <span>Visi Utama</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        Mewujudkan santri Jauharul Maknuun yang mandiri, teguh memegang akhlaq salaf, cakap berbahasa internasional, dan terampil dalam kepemimpinan berwawasan digital.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                      <div className="flex items-center gap-2 mb-2 text-emerald-800 font-black text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Misi Pokok</span>
                      </div>
                      <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-medium list-disc list-inside">
                        <li>Menggalakkan kedisiplinan sholat dan pengajian kitab kuning.</li>
                        <li>Menghidupkan lingkungan asrama dwi-bahasa (Arab &amp; Mandarin).</li>
                        <li>Memupuk ukhuwah islamiyah dan kebersihan asri pondok.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DIVISI & PROGRAM KERJA */}
          {activeTab === 'divisi' && (
            <motion.div
              key="divisi"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  Struktur Departemen
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  6 Divisi Penggerak Santri
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Setiap divisi bertanggung jawab penuh atas dinamika kegiatan harian, keilmuan, dan pengembangan minat santri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {DIVISI_PROGRAM.map((divisi) => {
                  const Icon = divisi.icon;
                  return (
                    <div
                      key={divisi.id}
                      className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        {/* Header Divisi */}
                        <div className="flex items-start justify-between gap-3">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${divisi.warna} text-white flex items-center justify-center shadow-md shrink-0`}>
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-bold text-slate-400 block font-arabic">
                              {divisi.namaArab}
                            </span>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-block mt-0.5">
                              Aktif Berjalan
                            </span>
                          </div>
                        </div>

                        {/* Title & Koordinator */}
                        <div>
                          <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {divisi.nama}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">
                            Koord: <span className="text-slate-700">{divisi.koordinator}</span>
                          </p>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {divisi.deskripsi}
                        </p>

                        {/* Program Kerja List */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                            Program Kerja Unggulan:
                          </p>
                          <ul className="space-y-1">
                            {divisi.programKerja.map((proker, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{proker}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: KOTAK ASPIRASI SANTRI */}
          {activeTab === 'aspirasi' && (
            <motion.div
              key="aspirasi"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-5">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200/80 mb-2">
                    <MessageSquareHeart className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Kotak Suara &amp; Aspirasi Santri
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    Punya ide kegiatan, kritik membangun, atau usulan inovasi untuk kemajuan asrama dan pondok? Sampaikan kepada pengurus OSIS di sini.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                    <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto animate-bounce" />
                    <h3 className="font-black text-base text-emerald-950">Aspirasi Berhasil Terkirim!</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                      Jazakumullah khairan. Usulan Anda tersimpan aman dan akan dibahas dalam sidang pleno mingguan BPH OSIS bersama ustadz pembina.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ nama: '', kategori: 'Program Belajar', pesan: '' });
                          setIsSubmitted(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Kirim Aspirasi Lainnya
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Santri / Kamar (Opsional / Boleh Anonim)
                      </label>
                      <input
                        type="text"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Contoh: Hamba Allah / Santri Kamar Al-Fath 03"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kategori Aspirasi
                      </label>
                      <select
                        value={formData.kategori}
                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                      >
                        <option value="Program Belajar">Program Belajar &amp; Kajian Kitab</option>
                        <option value="Kegiatan Ekstrakurikuler">Kegiatan Ekstrakurikuler &amp; Olahraga</option>
                        <option value="Kebersihan & Asrama">Kebersihan, Asrama &amp; Fasilitas</option>
                        <option value="Pengembangan Bahasa">Pengembangan Bahasa Arab &amp; Mandarin</option>
                        <option value="Lainnya">Usulan Umum / Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pesan &amp; Usulan Konkret <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.pesan}
                        onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                        placeholder="Tuliskan gagasan, masukan, atau usulan program kerja yang ingin Anda sampaikan..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0f5132] hover:bg-[#07361d] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirimkan Aspirasi ke Pengurus OSIS</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
export default Osis;
