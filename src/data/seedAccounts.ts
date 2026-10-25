import { UserRole } from '../lib/supabase';

export interface SeedAccount {
  role: UserRole;
  roleLabel: string;
  badgeColor: {
    bg: string;
    text: string;
    border: string;
    dot: string;
    accent: string;
  };
  email: string;
  password: string;
  fullName: string;
  department: string;
  nisOrNip: string;
  phone: string;
  avatarUrl: string;
  bio: string;
  permissions: string[];
  responsibilities: string[];
  securityLevel: string;
}

export const SEED_ACCOUNTS: Record<UserRole, SeedAccount> = {
  super_admin: {
    role: 'super_admin',
    roleLabel: 'Super Admin (Pimpinan & IT)',
    badgeColor: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300/60 dark:border-amber-500/30',
      dot: 'bg-amber-500',
      accent: '#d4af37'
    },
    email: 'admin@ppjauharulmaknuun.sch.id',
    password: 'PPJM_SuperAdmin2026!',
    fullName: 'KH. Jauharul Maknuun, M.Pd.',
    department: 'Pengasuh Pondok & IT Administrator',
    nisOrNip: 'PPJM-ADM-001',
    phone: '+62 812-3456-7801',
    avatarUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    bio: 'Mudir Pesantren Jauharul Maknuun Lasem Sidayu Gresik. Memegang wewenang tertinggi tata kelola pesantren, keamanan siber, dan otorisasi sistem informasi terpadu.',
    permissions: [
      'Full Access: Baca, Tulis, Hapus seluruh tabel database Supabase',
      'Manajemen Pengguna & Pengaturan RBAC (Super Admin, Konten, Guru, User)',
      'Eksekusi Migrasi SQL & Seed Data Otentik Pesantren',
      'Audit Log Keamanan, Rate Limiting & Pengawasan Sesi Aktif',
      'Konfigurasi Hero Slider, Kebijakan Privasi & Profil Kelembagaan'
    ],
    responsibilities: [
      'Persetujuan rilis kurikulum dan warta resmi pesantren',
      'Pengawasan server dan database PostgreSQL 17',
      'Audit otentikasi zero-trust dan sanitasi API'
    ],
    securityLevel: 'Level 4 (Full Clearance • Root Authority)'
  },
  pengurus_konten: {
    role: 'pengurus_konten',
    roleLabel: 'Pengurus Konten & Media',
    badgeColor: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300/60 dark:border-emerald-500/30',
      dot: 'bg-emerald-500',
      accent: '#059669'
    },
    email: 'konten@ppjauharulmaknuun.sch.id',
    password: 'PPJM_KontenMedia2026!',
    fullName: 'Ustadz M. Ridlwan, S.Kom.',
    department: 'Biro Humas & Publikasi Media PPJM',
    nisOrNip: 'PPJM-KNT-002',
    phone: '+62 812-3456-7802',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Koordinator Publikasi Media, Pengelolaan Dokumentasi Berita, Broadcast WhatsApp Santri, Galeri Foto/Video & Agenda Kegiatan Bulanan PPJM.',
    permissions: [
      'Kelola Berita & Warta Resmi Pesantren (WA Ready Broadcast)',
      'Kelola Galeri Dokumentasi Foto & Video YouTube',
      'Kelola Slider Hero Banner Beranda (Coverflow)',
      'Kelola Agenda Bulanan Santri (Historical, Current, Future)',
      'Kelola Ekstrakurikuler Santri & Naskah Profil Lembaga'
    ],
    responsibilities: [
      'Publikasi kabar harian dan prestasi pondok ke wali santri',
      'Kurasi dokumentasi visual kegiatan asrama dan madin',
      'Sinkronisasi kalender agenda pesantren bulanan'
    ],
    securityLevel: 'Level 3 (Media Manager • Editor-in-Chief)'
  },
  guru_akademik: {
    role: 'guru_akademik',
    roleLabel: 'Guru Akademik & Riset',
    badgeColor: {
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
      text: 'text-sky-800 dark:text-sky-300',
      border: 'border-sky-300/60 dark:border-sky-500/30',
      dot: 'bg-sky-500',
      accent: '#0284c7'
    },
    email: 'akademik@ppjauharulmaknuun.sch.id',
    password: 'PPJM_GuruAkademik2026!',
    fullName: 'Ustadz Riski, S.T.',
    department: 'Divisi Laboratorium STEM & Bahasa Asing',
    nisOrNip: 'PPJM-GUR-003',
    phone: '+62 812-3456-7803',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Pembina Laboratorium Inovasi STEM, Instruktur IoT Mikrokontroler Arduino/ESP32, Pengajar Bahasa Mandarin Santri, dan Penilai Hafalan Tahfidz.',
    permissions: [
      'Kelola Silabus & Penugasan STEM (IoT & Robotika)',
      'Kurasi & Publikasi Portofolio Proyek Sains Santri',
      'Kelola Kosakata & Materi Audio Pinyin Mandarin',
      'Kelola Bank Soal & Kuis Interaktif Mandarin Class',
      'Evaluasi Rekaman Murojaah & Catatan Target Tahfidz Al-Qur’an'
    ],
    responsibilities: [
      'Bimbingan riset sains santri berbasis teknologi terapan',
      'Evaluasi capaian hafalan kosakata dan tajwid quran',
      'Penyusunan modul kuis interaktif santri tiap jenjang'
    ],
    securityLevel: 'Level 2 (Academic Supervisor • STEM Lead)'
  },
  user: {
    role: 'user',
    roleLabel: 'Santri / Wali Santri / Alumni',
    badgeColor: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-300/60 dark:border-purple-500/30',
      dot: 'bg-purple-500',
      accent: '#9333ea'
    },
    email: 'santri@ppjauharulmaknuun.sch.id',
    password: 'PPJM_SantriMaju2026!',
    fullName: 'Ahmad Zaki Al-Maknuuni',
    department: 'Santriwan Kelas XII - Markaz Tahfidz 30 Juz',
    nisOrNip: 'SAN-2024-089',
    phone: '+62 812-3456-7804',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    bio: 'Santriwan Takhassus Tahfidzul Qur’an 30 Juz dan Ketua Tim Riset Robotika IoT Hidroponik Santri Pondok Pesantren Jauharul Maknuun Lasem.',
    permissions: [
      'Akses Portal Personal Santri & Profil Diri',
      'Mengerjakan Kuis Interaktif Bahasa Mandarin & Lihat Skor',
      'Menyimak Silabus & Unggah Portofolio Proyek STEM',
      'Membaca Al-Qur’an 30 Juz & Mengirimkan Rekaman Murojaah',
      'Melihat Agenda Terjadwal & Pengumuman Resmi Pesantren'
    ],
    responsibilities: [
      'Menjaga kelancaran hafalan Al-Qur’an 30 Juz mutqin',
      'Menyelesaikan tugas proyek robotika & modul Mandarin',
      'Mengikuti seluruh amaliyah dan kegiatan asrama'
    ],
    securityLevel: 'Level 1 (Member • Student Personal Portal)'
  },
  visitor: {
    role: 'visitor',
    roleLabel: 'Tamu / Pengunjung',
    badgeColor: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300/60 dark:border-emerald-500/30',
      dot: 'bg-emerald-500',
      accent: '#059669'
    },
    email: 'visitor@ppjauharulmaknuun.sch.id',
    password: '',
    fullName: 'Tamu / Pengunjung',
    department: 'Masyarakat & Pengunjung Publik',
    nisOrNip: 'VISITOR',
    phone: '-',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bio: 'Pengunjung umum portal resmi Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.',
    permissions: [
      'Akses Informasi Publik & Berita Resmi Pesantren',
      'Membaca Al-Qur’an Digital 30 Juz & Audio Murottal',
      'Melihat Kalender Agenda Bulanan (Historical, Current, Future)',
      'Akses Dokumentasi Galeri Foto & Profil Video Sinematik'
    ],
    responsibilities: [
      'Menjelajahi konten publik PPJM dengan adab dan tata tertib'
    ],
    securityLevel: 'Akses Publik (Visitor / Guest)'
  }
};

