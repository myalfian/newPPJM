import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  FileText,
  Info,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Send,
  MessageCircle,
  HelpCircle,
  Building,
  ShieldCheck,
  User,
  Users,
  MapPin,
  Clock,
  Phone,
  School,
  ArrowRight
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { WhatsAppIcon } from '../components/common/SocialIcons';

interface FormData {
  namaLengkap: string;
  nisn: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  programPilihan: string;
  jalurPendaftaran: string;
  sekolahAsal: string;
  alamatSekolahAsal: string;
  namaAyah: string;
  namaIbu: string;
  noWhatsappWali: string;
  pekerjaanWali: string;
  alamatDomisili: string;
  prestasiSantri: string;
  motivasi: string;
}

const INITIAL_FORM: FormData = {
  namaLengkap: '',
  nisn: '',
  nik: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: 'Laki-laki',
  programPilihan: 'Pondok Pesantren + SMP Plus Jauharul Maknuun (Terpadu)',
  jalurPendaftaran: 'Jalur Tahfidz 30 Juz Bersanad',
  sekolahAsal: '',
  alamatSekolahAsal: '',
  namaAyah: '',
  namaIbu: '',
  noWhatsappWali: '',
  pekerjaanWali: '',
  alamatDomisili: '',
  prestasiSantri: '',
  motivasi: '',
};

export const Spmb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State: 'tentang' or 'formulir'
  const [activeTab, setActiveTab] = useState<'tentang' | 'formulir'>('tentang');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');

  // Handle URL hash / query param (e.g. /spmb#formulir)
  useEffect(() => {
    if (location.hash === '#formulir' || location.search.includes('tab=formulir')) {
      setActiveTab('formulir');
    } else {
      setActiveTab('tentang');
    }
  }, [location.hash, location.search]);

  const handleTabChange = (tab: 'tentang' | 'formulir') => {
    setActiveTab(tab);
    if (tab === 'formulir') {
      window.history.replaceState(null, '', '/spmb#formulir');
    } else {
      window.history.replaceState(null, '', '/spmb#tentang');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique registration code
    const randomCode = `SPMB-JM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegistrationCode(randomCode);
    setIsSubmitted(true);

    // Construct structured WhatsApp message for Admin SPMB
    const waMessage = `*FORMULIR PENDAFTARAN SPMB PP. JAUHARUL MAKNUUN TP 2026/2027*
----------------------------------------
*No. Registrasi:* ${randomCode}
*Tanggal:* ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}

*A. DATA CALON SANTRI/MURID*
* Nama Lengkap: ${formData.namaLengkap}
* Jenis Kelamin: ${formData.jenisKelamin}
* Tempat/Tgl Lahir: ${formData.tempatLahir}, ${formData.tanggalLahir}
* NISN: ${formData.nisn || '-'}
* NIK: ${formData.nik || '-'}
* Pilihan Program: ${formData.programPilihan}
* Jalur Pendaftaran: ${formData.jalurPendaftaran}

*B. DATA ASAL SEKOLAH*
* Asal Sekolah: ${formData.sekolahAsal}
* Alamat Sekolah: ${formData.alamatSekolahAsal || '-'}

*C. DATA ORANG TUA / WALI*
* Nama Ayah/Wali: ${formData.namaAyah}
* Nama Ibu: ${formData.namaIbu}
* No. WhatsApp: ${formData.noWhatsappWali}
* Pekerjaan Wali: ${formData.pekerjaanWali || '-'}
* Alamat Domisili: ${formData.alamatDomisili}

*D. PRESTASI & CATATAN*
* Prestasi: ${formData.prestasiSantri || '-'}
* Motivasi: ${formData.motivasi || '-'}
----------------------------------------
_Mohon konfirmasi dan arahan jadwal tes observasi SPMB selanjutnya. Terima kasih._`;

    // Target Admin SPMB Hotline
    const targetPhone = '6285646199273';
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 space-y-2.5 sm:space-y-3.5 overflow-x-hidden select-none">
      {/* Sub-Nav Tabs */}
      <NavBarTabs />

      {/* Hero Header Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#06331e] via-[#094729] to-[#042415] border border-emerald-800/40 shadow-xl p-3.5 sm:p-5 text-white">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Penerimaan Santri &amp; Murid Baru TP 2026/2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              SPMB - Sistem Penerimaan Murid Baru
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              Selamat datang di portal resmi SPMB Pondok Pesantren Jauharul Maknuun &amp; SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik. Terakreditasi &quot;A&quot; BAN-PDM, memadukan tradisi Salafiyah, Tahfidz 30 Juz Bersanad, dan Riset STEM.
            </p>
          </div>

          {/* Hotline Panitia Box */}
          <div className="bg-white/10 dark:bg-zinc-900/60 border border-white/20 rounded-2xl p-4 backdrop-blur-md shrink-0 space-y-2 self-start md:self-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Sekretariat Panitia SPMB</span>
            </div>
            <p className="text-xs text-white/90 font-medium">
              Senin - Ahad, Pukul 07.30 - 16.00 WIB
            </p>
            <a
              href="https://wa.me/6285646199273?text=Assalamu%27alaikum%20Panitia%20SPMB%20PPJM,%20saya%20ingin%20konsultasi%20pendaftaran%20santri%20baru."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat Panitia: 0856-4619-9273</span>
            </a>
          </div>
        </div>
      </div>

      {/* Segmented Control Pill Switcher */}
      <div className="flex justify-center sm:justify-start">
        <div className="inline-flex p-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/70 dark:border-zinc-700/70 backdrop-blur-md shadow-inner w-full sm:w-auto">
          {/* Tab 1: Tentang SPMB */}
          <button
            type="button"
            onClick={() => handleTabChange('tentang')}
            className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'tentang'
                ? 'text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {activeTab === 'tentang' && (
              <motion.div
                layoutId="spmbTabActivePill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 shadow-md shadow-emerald-950/20"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Info className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Tentang SPMB</span>
          </button>

          {/* Tab 2: Formulir SPMB */}
          <button
            type="button"
            onClick={() => handleTabChange('formulir')}
            className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'formulir'
                ? 'text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {activeTab === 'formulir' && (
              <motion.div
                layoutId="spmbTabActivePill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 shadow-md shadow-emerald-950/20"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <FileText className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Formulir Pendaftaran SPMB</span>
          </button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <AnimatePresence mode="wait">
        {/* =================================================================== */}
        {/* TAB 1: TENTANG SPMB (PANDUAN, JALUR, JADWAL, SYARAT, FAQ)          */}
        {/* =================================================================== */}
        {activeTab === 'tentang' ? (
          <motion.div
            key="tab-tentang"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >
            {/* 1. Alur 4 Langkah Mudah Pendaftaran */}
            <section className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-7 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Clock className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                  Alur Tahapan Pendaftaran SPMB
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: '01',
                    title: 'Pendaftaran Online / Offline',
                    desc: 'Mengisi Formulir SPMB di website ini atau hadir langsung di Sekretariat PPJM Lasem.',
                  },
                  {
                    step: '02',
                    title: 'Verifikasi Berkas',
                    desc: 'Konfirmasi bukti data dan kelengkapan administrasi oleh Tim Panitia Penerimaan.',
                  },
                  {
                    step: '03',
                    title: 'Uji Observasi & Wawancara',
                    desc: 'Tes baca Al-Qur’an, pemetaan minat bakat santri, dan wawancara kesiapan orang tua/wali.',
                  },
                  {
                    step: '04',
                    title: 'Pengumuman & Daftar Ulang',
                    desc: 'Penerbitan surat kelulusan resmi dan penyelesaian administrasi seragam serta asrama santri.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 relative overflow-hidden group hover:border-emerald-500/50 transition-all"
                  >
                    <span className="text-3xl font-black text-emerald-700/20 dark:text-emerald-400/20 absolute -right-1 -top-1">
                      {item.step}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 relative z-10">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed relative z-10">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Tiga Jalur Penerimaan */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                    Pilihan Jalur Masuk SPMB
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Jalur 1 */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Program Unggulan
                    </span>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                      Jalur Tahfidz 30 Juz Bersanad
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Ditujukan bagi calon santri yang memiliki hafalan Al-Qur’an atau komitmen tinggi menghafal 30 juz mutqin dengan bimbingan bersanad hingga Rasulullah SAW.
                    </p>
                    <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 pt-2">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Halaqah intensif tahfidz pagi dan petang</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Karantina tasmi’ hafalan berkala</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Ijazah sanad resmi saat khotmil Qur&apos;an</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, jalurPendaftaran: 'Jalur Tahfidz 30 Juz Bersanad' }));
                      handleTabChange('formulir');
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Daftar Jalur Tahfidz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Jalur 2 */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Beasiswa Prestasi
                    </span>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                      Jalur Prestasi Akademik &amp; STEM
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Jalur khusus siswa berprestasi di bidang sains, olimpiade matematika, robotika, coding, pidato bahasa, maupun seni kaligrafi dan qira’at.
                    </p>
                    <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 pt-2">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Keringanan biaya pendidikan/SPP</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Fasilitas riset di lab komputer &amp; robotika STEM</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Pendampingan lomba tingkat regional &amp; nasional</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, jalurPendaftaran: 'Jalur Prestasi Akademik & STEM' }));
                      handleTabChange('formulir');
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Daftar Jalur Prestasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Jalur 3 */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      Reguler Terpadu
                    </span>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                      Jalur Reguler Pesantren &amp; SMP
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Jalur umum pendidikan terpadu asrama santri, madrasah diniyah salafiyah maknani gandul, dan kurikulum formal berakreditasi &quot;A&quot;.
                    </p>
                    <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 pt-2">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Pendidikan akhlak mulia dan adab salafus sholih</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Pembiasaan sholat berjamaah &amp; amaliyah wirid</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Ekstrakurikuler kepanduan, beladiri &amp; bahasa</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, jalurPendaftaran: 'Jalur Reguler Pesantren & SMP' }));
                      handleTabChange('formulir');
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Daftar Jalur Reguler</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* 3. Jadwal Gelombang & Persyaratan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Jadwal Gelombang */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Jadwal Gelombang Pendaftaran TP 2026/2027
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300">
                        Gelombang I (Early Bird &amp; Beasiswa)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                        Dibuka
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      1 Oktober 2025 – 31 Desember 2025
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                      *Bebas biaya pendaftaran dan prioritas penempatan kamar asrama.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                        Gelombang II (Reguler)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        Mendatang
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      1 Januari 2026 – 31 Maret 2026
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                        Gelombang III (Kuota Sisa / Mutasi)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        Kondisional
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      1 April 2026 – Kuota Terpenuhi
                    </p>
                  </div>
                </div>
              </div>

              {/* Berkas Persyaratan */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Berkas Persyaratan Administrasi
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fotokopi Akta Kelahiran (2 Lembar)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fotokopi Kartu Keluarga / KK (2 Lembar)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fotokopi Rapor SD/MI Terakhir</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pas Foto 3x4 Santri Berbusana Muslim (4 Lembar)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Surat Keterangan Sehat dari Faskes/Dokter</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fotokopi Piagam/Sertifikat Prestasi (Jika Ada)</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleTabChange('formulir')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>Lanjut ke Formulir Pendaftaran SPMB</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* =================================================================== */
          /* TAB 2: FORMULIR SPMB (SISTEM PENERIMAAN MURID BARU ONLINE)         */
          /* =================================================================== */
          <motion.div
            key="tab-formulir"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >
            {isSubmitted ? (
              <div className="p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-emerald-500/40 shadow-xl max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                  Pendaftaran SPMB Berhasil Dikirim!
                </h3>
                <div className="inline-block px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-sm">
                  No. Registrasi: {registrationCode}
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto">
                  Alhamdulillah, data formulir santri baru atas nama{' '}
                  <strong className="text-zinc-900 dark:text-white">{formData.namaLengkap}</strong> telah siap diteruskan ke WhatsApp Panitia SPMB PPJM. Panitia akan segera menghubungi nomor wali santri ({formData.noWhatsappWali}) untuk verifikasi dan jadwal uji observasi.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData(INITIAL_FORM);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs transition-colors"
                  >
                    Isi Formulir Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('tentang')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                  >
                    Kembali ke Panduan SPMB
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitForm}
                className="bg-white/95 dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-8 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md space-y-6 max-w-4xl mx-auto"
              >
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                    Formulir Pendaftaran Online SPMB TP 2026/2027
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Silakan isi data calon santri dan orang tua/wali dengan benar dan lengkap.
                  </p>
                </div>

                {/* Bagian A: Data Calon Santri */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-1.5">
                    <User className="w-4 h-4" />
                    <span>A. DATA CALON SANTRI / MURID</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Nama Lengkap Calon Santri <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaLengkap"
                        required
                        value={formData.namaLengkap}
                        onChange={handleInputChange}
                        placeholder="Sesuai akta kelahiran / ijazah"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Laki-laki">Laki-laki (Santriwan)</option>
                        <option value="Perempuan">Perempuan (Santriwati)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        NISN (Nomor Induk Siswa Nasional)
                      </label>
                      <input
                        type="text"
                        name="nisn"
                        value={formData.nisn}
                        onChange={handleInputChange}
                        placeholder="10 digit nomor NISN"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tempatLahir"
                        required
                        value={formData.tempatLahir}
                        onChange={handleInputChange}
                        placeholder="Kota / Kabupaten kelahiran"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        required
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Pilihan Program Pendidikan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="programPilihan"
                        value={formData.programPilihan}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Pondok Pesantren + SMP Plus Jauharul Maknuun (Terpadu)">
                          Pondok Pesantren + SMP Plus Jauharul Maknuun (Terpadu)
                        </option>
                        <option value="Pondok Pesantren Tahfidz 30 Juz Khusus (Salafiyah)">
                          Pondok Pesantren Tahfidz 30 Juz Khusus (Salafiyah)
                        </option>
                        <option value="SMP Plus Jauharul Maknuun (Reguler / Non-Asrama)">
                          SMP Plus Jauharul Maknuun (Reguler / Non-Asrama)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Jalur Pendaftaran <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="jalurPendaftaran"
                        value={formData.jalurPendaftaran}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Jalur Tahfidz 30 Juz Bersanad">Jalur Tahfidz 30 Juz Bersanad</option>
                        <option value="Jalur Prestasi Akademik & STEM">Jalur Prestasi Akademik &amp; STEM</option>
                        <option value="Jalur Reguler Pesantren & SMP">Jalur Reguler Pesantren &amp; SMP</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bagian B: Data Asal Sekolah */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-1.5">
                    <School className="w-4 h-4" />
                    <span>B. DATA ASAL SEKOLAH SEBELUMNYA</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Nama SD / MI Asal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="sekolahAsal"
                        required
                        value={formData.sekolahAsal}
                        onChange={handleInputChange}
                        placeholder="Contoh: MI Tarbiyatul Islamiyah / SDN 1 Sidayu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Alamat / Kota Asal Sekolah
                      </label>
                      <input
                        type="text"
                        name="alamatSekolahAsal"
                        value={formData.alamatSekolahAsal}
                        onChange={handleInputChange}
                        placeholder="Kota / Kecamatan asal sekolah"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian C: Data Orang Tua / Wali */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-1.5">
                    <Users className="w-4 h-4" />
                    <span>C. DATA ORANG TUA / WALI SANTRI</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Nama Ayah / Wali <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaAyah"
                        required
                        value={formData.namaAyah}
                        onChange={handleInputChange}
                        placeholder="Nama lengkap ayah / wali"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Nama Ibu Kandung <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaIbu"
                        required
                        value={formData.namaIbu}
                        onChange={handleInputChange}
                        placeholder="Nama lengkap ibu kandung"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        No. WhatsApp Orang Tua / Wali <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="noWhatsappWali"
                        required
                        value={formData.noWhatsappWali}
                        onChange={handleInputChange}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Pekerjaan Orang Tua / Wali
                      </label>
                      <input
                        type="text"
                        name="pekerjaanWali"
                        value={formData.pekerjaanWali}
                        onChange={handleInputChange}
                        placeholder="Pekerjaan / Profesi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Alamat Lengkap Domisili <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="alamatDomisili"
                        required
                        rows={2}
                        value={formData.alamatDomisili}
                        onChange={handleInputChange}
                        placeholder="Jalan, RT/RW, Dusun, Desa, Kecamatan, Kabupaten/Kota, Provinsi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian D: Catatan Prestasi & Motivasi */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>D. PRESTASI &amp; MOTIVASI SANTRI (OPSIONAL)</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Prestasi / Hafalan Al-Qur&apos;an yang Pernah Diraih
                      </label>
                      <input
                        type="text"
                        name="prestasiSantri"
                        value={formData.prestasiSantri}
                        onChange={handleInputChange}
                        placeholder="Misal: Hafalan Juz 30, Juara 1 Pidato Bahasa Arab, Juara OSN Matematika"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Motivasi Mendaftar di Pondok Pesantren Jauharul Maknuun
                      </label>
                      <textarea
                        name="motivasi"
                        rows={2}
                        value={formData.motivasi}
                        onChange={handleInputChange}
                        placeholder="Harapan dan cita-cita selama menempuh pendidikan di pesantren"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    *Dengan menekan tombol kirim, formulir pendaftaran akan diformat dan dikirimkan langsung ke WhatsApp Panitia SPMB.
                  </p>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pendaftaran SPMB ke WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Spmb;

