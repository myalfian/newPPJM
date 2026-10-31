import { ReactNode } from 'react';

export interface VisibilityConfig {
  isVisible: boolean;
  order: number;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnail: string;
  summary: string;
  link?: string;
  isVisible: boolean; // Item-level toggle
  isPinned?: boolean;
}

export interface ProgramItem {
  id: string;
  name: string;
  desc: string;
  iconName: string;
  tag: string;
  isVisible: boolean;
}

export interface EkskulItem {
  id: string;
  nama: string;
  kategori: string;
  jadwal: string;
  pembimbing: string;
  isVisible: boolean;
}

export interface PrestasiItem {
  id: string;
  juara: string;
  kejuaraan: string;
  tingkat: string;
  tahun: string;
  santri: string;
  isVisible: boolean;
}

export interface QuickMenuItem {
  id: string;
  label: string;
  route: string;
  theme: string;
  isVisible: boolean;
}

export interface OsisMemberItem {
  id: string;
  nama: string;
  jabatan: string;
  divisi: string;
  lencana: string;
  isVisible: boolean;
}

export interface GaleriItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isVisible: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  isVisible: boolean;
}

export interface SectionMeta<T = any> {
  id: string;
  title: string;
  description: string;
  isVisible: boolean; // Section-level toggle
  order: number;
  data: T;
}

export interface PageEditorState {
  meta: {
    siteTitle: string;
    tagline: string;
    lastPublishedAt?: string;
  };
  sections: {
    [key: string]: SectionMeta<any>;
    navbar: SectionMeta<{ showProfile: boolean; showTopBanner: boolean; bannerText: string }>;
    heroSlider: SectionMeta<{ autoplay: boolean; interval: number; showBadge: boolean }>;
    quickMenu: SectionMeta<{ items: QuickMenuItem[] }>;
    sambutan: SectionMeta<{
      pengasuhName: string;
      title: string;
      kalam: string;
      quote: string;
      imageUrl: string;
    }>;
    programUnggulan: SectionMeta<{
      headline: string;
      subheadline: string;
      items: ProgramItem[];
    }>;
    beritaTerkini: SectionMeta<{
      headline: string;
      subheadline: string;
      items: NewsItem[];
    }>;
    prestasi: SectionMeta<{
      headline: string;
      items: PrestasiItem[];
    }>;
    ekskul: SectionMeta<{
      headline: string;
      items: EkskulItem[];
    }>;
    osis: SectionMeta<{
      headline: string;
      subheadline: string;
      kabinetName: string;
      items: OsisMemberItem[];
    }>;
    agenda: SectionMeta<{
      headline: string;
      subheadline: string;
      items: AgendaItem[];
    }>;
    galeri: SectionMeta<{
      headline: string;
      subheadline: string;
      items: GaleriItem[];
    }>;
    footer: SectionMeta<{
      alamat: string;
      whatsapp: string;
      telepon: string;
      email: string;
      copyright: string;
    }>;
  };
}

export const INITIAL_EDITOR_STATE: PageEditorState = {
  meta: {
    siteTitle: 'Pondok Pesantren Jauharul Maknuun Lasem',
    tagline: 'Mencetak Generasi Qurani, Saintis & Berakhlak Mulia',
    lastPublishedAt: new Date().toISOString()
  },
  sections: {
    navbar: {
      id: 'navbar',
      title: 'Navigation Header',
      description: 'Header utama website, logo pesantren, menu navigasi & profil pill',
      isVisible: true,
      order: 1,
      data: {
        showProfile: true,
        showTopBanner: true,
        bannerText: '✨ Pendaftaran Santri Baru (PPDB) TP 2026/2027 telah dibuka! Informasi hubungi Panitia PPDB.'
      }
    },
    heroSlider: {
      id: 'heroSlider',
      title: 'Hero Coverflow Carousel',
      description: 'Banner interaktif 3D coverflow di bagian teratas beranda',
      isVisible: true,
      order: 2,
      data: {
        autoplay: true,
        interval: 5,
        showBadge: true
      }
    },
    quickMenu: {
      id: 'quickMenu',
      title: 'Quick Menu Mobile (2x4 Grid)',
      description: 'Menu pintas 8 kartu kompak di viewport mobile dan tablet',
      isVisible: true,
      order: 3,
      data: {
        items: [
          { id: 'jm-center', label: 'JM Center', route: '/jm-center', theme: 'blue', isVisible: true },
          { id: 'program-unggulan', label: 'Program', route: '/program-unggulan', theme: 'violet', isVisible: true },
          { id: 'smart-jm', label: 'SMART JM', route: '/smart-jm/hafidz/read', theme: 'emerald', isVisible: true },
          { id: 'prestasi', label: 'Prestasi', route: '/prestasi', theme: 'amber', isVisible: true },
          { id: 'ekskul', label: 'Ekstrakurikuler', route: '/ekskul', theme: 'orange', isVisible: true },
          { id: 'osis', label: 'OSIS', route: '/osis', theme: 'indigo', isVisible: true },
          { id: 'agenda-pesantren', label: 'Agenda', route: '/agenda', theme: 'emerald', isVisible: true },
          { id: 'galeri-sekolah', label: 'Galeri', route: '/galeri/foto', theme: 'rose', isVisible: true }
        ]
      }
    },
    sambutan: {
      id: 'sambutan',
      title: 'Kalam & Sambutan Pengasuh',
      description: 'Pesan keteladanan dari Pengasuh KH. M. Jauharul Maknuun',
      isVisible: true,
      order: 4,
      data: {
        pengasuhName: 'KH. M. Jauharul Maknuun',
        title: 'Pengasuh Pondok Pesantren Jauharul Maknuun',
        kalam: 'Pesantren bukan sekadar tempat menimba ilmu agama secara teoritis, melainkan kawah candradimuka pembentukan akhlaqul karimah, ketajaman sains teknologi, dan kemandirian hidup yang berakar pada tawadhu kepada para Masyayikh.',
        quote: 'Ilmu Amaliyah, Amal Ilmiyah, Khidmah Lil-Ummah.',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
      }
    },
    programUnggulan: {
      id: 'programUnggulan',
      title: 'Program Unggulan Pesantren',
      description: '3 pilar utama: Amaliyah Pondok, Madrasah Diniyah & Kurikulum Formal',
      isVisible: true,
      order: 5,
      data: {
        headline: 'Pilar Pendidikan Holistik',
        subheadline: 'Mengintegrasikan Khazanah Turats Salaf dan Modernitas',
        items: [
          {
            id: 'prog-1',
            name: 'Amaliyah & Khazanah Salaf',
            desc: 'Pengajian kitab kuning sorogan & bandongan, sholat berjamaah lima waktu, dan riyadhoh batiniyah.',
            iconName: 'BookOpen',
            tag: 'Tradisi Salaf',
            isVisible: true
          },
          {
            id: 'prog-2',
            name: 'Madrasah Diniyah Takmiliyah',
            desc: 'Kurikulum berjenjang Ula, Wustho, dan Ulya dengan evaluasi baca kitab dan nahwu shorof terukur.',
            iconName: 'Sparkles',
            tag: 'Diniyah',
            isVisible: true
          },
          {
            id: 'prog-3',
            name: 'Pendidikan Sains & STEM Terpadu',
            desc: 'Penguasaan otomasi mikrokontroler, laboratorium IoT, riset sains, dan bahasa asing terapan.',
            iconName: 'Cpu',
            tag: 'Teknologi',
            isVisible: true
          }
        ]
      }
    },
    beritaTerkini: {
      id: 'beritaTerkini',
      title: 'Warta & Berita Santri Terkini',
      description: 'Publikasi warta kegiatan, agenda dan pengumuman resmi pondok',
      isVisible: true,
      order: 6,
      data: {
        headline: 'Warta & Berita Pesantren',
        subheadline: 'Kabar aktual, liputan kajian, dan dokumentasi agenda santri',
        items: [
          {
            id: 'news-1',
            title: 'Haflah Khotmil Qur’an 30 Juz & Wisuda Purna Studi PPJM 2026',
            category: 'Agenda Akbar',
            date: '20 Juni 2026',
            thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
            summary: 'Momen khidmat pelepasan santri purna studi dan wisuda khotmil qur’an 30 juz dihadiri para masyayikh dan ribuan wali santri di halaman utama pesantren.',
            link: '/agenda',
            isVisible: true,
            isPinned: true
          },
          {
            id: 'news-2',
            title: 'Santri PPJM Juara 1 Musabaqah Qira’atil Kutub Tingkat Provinsi Jawa Timur',
            category: 'Prestasi',
            date: '12 Maret 2026',
            thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
            summary: 'Prestasi membanggakan diraih santri PPJM dalam membaca dan memahami kitab kuning Fathul Qorib pada ajang MQK se-Jawa Timur.',
            link: '/prestasi',
            isVisible: true
          },
          {
            id: 'news-3',
            title: 'Peluncuran Laboratorium Robotika & Otomasi IoT Santri Lasem',
            category: 'Inovasi STEM',
            date: '10 Januari 2026',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            summary: 'Pesantren meresmikan pusat riset teknologi aplikatif guna melatih santri menciptakan solusi otomasi hidroponik dan sistem tenaga surya.',
            link: '/smart-jm/stem/portofolio',
            isVisible: true
          },
          {
            id: 'news-4',
            title: 'Bimbingan Khusus Pengecekan Makharijul Huruf Berbasis AI Digital',
            category: 'Tahfidz AI',
            date: '02 Februari 2026',
            thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
            summary: 'Integrasi teknologi asisten pendengar tajwid otomatis membantu santri melancarkan murojaah harian 30 juz secara mandiri di asrama.',
            link: '/smart-jm/hafidz/read',
            isVisible: false // default draft/hidden example to showcase granular item controls
          }
        ]
      }
    },
    prestasi: {
      id: 'prestasi',
      title: 'Prestasi & Kejuaraan Santri',
      description: 'Penghargaan akademik, kitab kuning, MTQ dan olimpiade',
      isVisible: true,
      order: 7,
      data: {
        headline: 'Prestasi Gemilang Santri',
        items: [
          {
            id: 'pres-1',
            juara: 'Juara 1',
            kejuaraan: 'Musabaqah Qiraatil Kutub Fathul Qorib',
            tingkat: 'Tingkat Provinsi',
            tahun: '2026',
            santri: 'Ahmad Faizur Rahman (Kls XII)',
            isVisible: true
          },
          {
            id: 'pres-2',
            juara: 'Medali Emas',
            kejuaraan: 'Olimpiade Robotika Nasional IoT Pertanian',
            tingkat: 'Tingkat Nasional',
            tahun: '2025',
            santri: 'Tim Riset STEM Santri Lasem',
            isVisible: true
          },
          {
            id: 'pres-3',
            juara: 'Juara 2',
            kejuaraan: 'Hifdzil Qur’an 30 Juz Golongan Remaja',
            tingkat: 'Tingkat Karesidenan',
            tahun: '2025',
            santri: 'Muhammad Bilal Zulkarnain',
            isVisible: true
          }
        ]
      }
    },
    ekskul: {
      id: 'ekskul',
      title: 'Ekstrakurikuler & Bakat Santri',
      description: 'Pagar Nusa, Robotika, Hadroh, Desain Grafis & Olahraga',
      isVisible: true,
      order: 8,
      data: {
        headline: 'Eksplorasi Bakat & Karakter Santri',
        items: [
          { id: 'ex-1', nama: 'Pencak Silat Pagar Nusa', kategori: 'Bela Diri', jadwal: 'Ahad Malam', pembimbing: 'Pendekar Senior', isVisible: true },
          { id: 'ex-2', nama: 'Klub Robotika & IoT', kategori: 'Sains Terapan', jadwal: 'Selasa Sore', pembimbing: 'Ust. Riski ST', isVisible: true },
          { id: 'ex-3', nama: 'Seni Hadroh & Sholawat', kategori: 'Seni Islami', jadwal: 'Kamis Malam', pembimbing: 'Ust. Ridlwan', isVisible: true },
          { id: 'ex-4', nama: 'Multimedia & Fotografi', kategori: 'Kreatif', jadwal: 'Sabtu Pagi', pembimbing: 'Tim Media PPJM', isVisible: true }
        ]
      }
    },
    osis: {
      id: 'osis',
      title: 'Organisasi Santri (OSIS / OPJM)',
      description: 'Struktur kepengurusan santri putra & putri dan 6 divisi kerja',
      isVisible: true,
      order: 9,
      data: {
        headline: 'Kepemimpinan Santri (OSIS / OPJM)',
        subheadline: 'Wadah Pengabdian, Disiplin, dan Karakter Santri Mandiri',
        kabinetName: 'Kabinet Al-Fatih 2026/2027',
        items: [
          { id: 'osis-1', nama: 'Ahmad Faizur Rahman', jabatan: 'Ketua Umum OSIS Putra', divisi: 'BPH Inti', lencana: 'Presidium', isVisible: true },
          { id: 'osis-2', nama: 'Fatimah Az-Zahra', jabatan: 'Ketua Umum OSIS Putri', divisi: 'BPH Inti', lencana: 'Presidium', isVisible: true },
          { id: 'osis-3', nama: 'M. Zaidan Al-Farisi', jabatan: 'Koordinator Qismul Amni', divisi: 'Kedisiplinan & Keamanan', lencana: 'Keamanan', isVisible: true },
          { id: 'osis-4', nama: 'Rian Hidayatullah', jabatan: 'Koordinator Eco-Pesantren', divisi: 'Kebersihan & Lingkungan', lencana: 'Lingkungan', isVisible: true }
        ]
      }
    },
    agenda: {
      id: 'agenda',
      title: 'Agenda & Kalender Pesantren',
      description: 'Jadwal pengajian akbar, wisuda tahfidz, dan kalender pendidikan',
      isVisible: true,
      order: 10,
      data: {
        headline: 'Agenda & Kalender Kegiatan',
        subheadline: 'Jadwal Terjadwal Santri & Khidmah Ma\'had Barokah',
        items: [
          { id: 'ag-1', title: 'Haflah Khotmil Qur\'an 30 Juz & Wisuda Purna Studi', date: '20 Juni 2026', location: 'Halaman Utama PPJM', category: 'Akbar', isVisible: true },
          { id: 'ag-2', title: 'Roan Akbar & Kerja Bakti Kebersihan Pesantren', date: 'Tiap Jumat Pagi', location: 'Komplek Asrama Santri', category: 'Rutin', isVisible: true },
          { id: 'ag-3', title: 'Kajian Rutin Ihya Ulumiddin Bersama Pengasuh', date: 'Malam Ahad Kliwon', location: 'Masjid Jauharul Maknuun', category: 'Kajian', isVisible: true }
        ]
      }
    },
    galeri: {
      id: 'galeri',
      title: 'Galeri Dokumentasi & Video Santri',
      description: 'Dokumentasi foto kegiatan asrama, laboratorium & video liputan',
      isVisible: true,
      order: 11,
      data: {
        headline: 'Dokumentasi Visual & Kegiatan',
        subheadline: 'Rekaman Momen Inspiratif Aktivitas Harian Santri',
        items: [
          { id: 'gal-1', title: 'Khotmil Qur\'an Bil Ghoib 30 Juz', category: 'Tahfidz', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', isVisible: true },
          { id: 'gal-2', title: 'Praktikum Robotika IoT Pertanian Santri', category: 'Lab STEM', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', isVisible: true },
          { id: 'gal-3', title: 'Sorogan Kitab Kuning Bersama Ustadz', category: 'Diniyah', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', isVisible: true }
        ]
      }
    },
    footer: {
      id: 'footer',
      title: 'Footer & Informasi Kontak',
      description: 'Alamat resmi, call center, tautan cepat dan hak cipta',
      isVisible: true,
      order: 12,
      data: {
        alamat: 'Desa Lasem, Kec. Sidayu, Kabupaten Gresik, Jawa Timur 61153',
        whatsapp: '+62 812-3456-7890',
        telepon: '031-3949xxx',
        email: 'info@ppjauharulmaknuun.sch.id',
        copyright: '© 2026 Pondok Pesantren Jauharul Maknuun. All rights reserved.'
      }
    }
  }
};

