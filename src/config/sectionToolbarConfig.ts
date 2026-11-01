/**
 * Konfigurasi Toolbar Word-Like Kontekstual per Section (24 Section)
 * Pondok Pesantren Jauharul Maknuun (PPJM)
 */

export type SectionType =
  | 'sambutan'
  | 'slider'
  | 'quickmenu'
  | 'keunggulan'
  | 'fasilitas'
  | 'lembaga'
  | 'program_pondok'
  | 'program_smp'
  | 'program_madin'
  | 'stem'
  | 'mandarin'
  | 'hafidz'
  | 'prestasi'
  | 'ekskul'
  | 'osis'
  | 'berita'
  | 'galeri'
  | 'agenda'
  | 'testimoni'
  | 'stats'
  | 'kontak'
  | 'navbar'
  | 'bottomnav'
  | 'spmb'
  | 'default';

export type SupabaseBucket = 'avatars' | 'cms-images' | 'berita-images' | 'galeri-foto';

export interface FieldToolbarConfig {
  label: string;
  placeholder?: string;
  bucket: SupabaseBucket;
  minHeight: string;
  maxLength?: number;
  defaultStyle: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    paragraphSpacing?: {
      before?: number;
      after?: number;
    };
    letterSpacing?: string;
    wordSpacing?: string;
  };
  toolbar: {
    tabs: Array<'Home' | 'Insert' | 'Layout'>;
    font: {
      fontFamily: boolean;
      fontSize: boolean;
      fontSizeStep: boolean;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      strike: boolean;
      superscript: boolean;
      subscript: boolean;
      clearFormatting: boolean;
      color: boolean;
      highlight: boolean;
    };
    paragraph: {
      heading: boolean;
      headingsList?: Array<'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'code'>;
      align: boolean;
      alignments?: Array<'left' | 'center' | 'right' | 'justify'>;
      lineHeight: boolean;
      lineHeights?: string[];
      letterSpacing: boolean;
      wordSpacing: boolean;
      paragraphSpacing: boolean;
      textIndent: boolean;
      bulletList: boolean;
      numberedList: boolean;
      checklist: boolean;
      indent: boolean;
    };
    insert: {
      link: boolean;
      image: boolean;
      table: boolean;
      youtube: boolean;
      hr: boolean;
      emoji: boolean;
      fullscreen: boolean;
    };
    status: {
      wordCount: boolean;
      readingTime: boolean;
    };
  };
}

export interface SectionConfig {
  sectionName: string;
  fields: Record<string, FieldToolbarConfig>;
}

// Preset Toolbar Tiers untuk konsistensi & kecepatan konfigurasi
const FULL_WORD_TOOLBAR = {
  tabs: ['Home', 'Insert', 'Layout'] as Array<'Home' | 'Insert' | 'Layout'>,
  font: {
    fontFamily: true,
    fontSize: true,
    fontSizeStep: true,
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    superscript: true,
    subscript: true,
    clearFormatting: true,
    color: true,
    highlight: true,
  },
  paragraph: {
    heading: true,
    headingsList: ['p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'code'] as Array<'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'code'>,
    align: true,
    alignments: ['left', 'center', 'right', 'justify'] as Array<'left' | 'center' | 'right' | 'justify'>,
    lineHeight: true,
    lineHeights: ['1.0', '1.15', '1.5', '1.8', '2.0', '2.5'],
    letterSpacing: true,
    wordSpacing: true,
    paragraphSpacing: true,
    textIndent: true,
    bulletList: true,
    numberedList: true,
    checklist: true,
    indent: true,
  },
  insert: {
    link: true,
    image: true,
    table: true,
    youtube: true,
    hr: true,
    emoji: true,
    fullscreen: true,
  },
  status: {
    wordCount: true,
    readingTime: true,
  },
};

const MEDIUM_CONTENT_TOOLBAR = {
  tabs: ['Home', 'Insert', 'Layout'] as Array<'Home' | 'Insert' | 'Layout'>,
  font: {
    fontFamily: true,
    fontSize: true,
    fontSizeStep: true,
    bold: true,
    italic: true,
    underline: true,
    strike: false,
    superscript: false,
    subscript: false,
    clearFormatting: true,
    color: true,
    highlight: true,
  },
  paragraph: {
    heading: true,
    headingsList: ['p', 'h2', 'h3', 'blockquote'] as Array<'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'code'>,
    align: true,
    alignments: ['left', 'center', 'right', 'justify'] as Array<'left' | 'center' | 'right' | 'justify'>,
    lineHeight: true,
    lineHeights: ['1.15', '1.5', '1.8', '2.0'],
    letterSpacing: true,
    wordSpacing: true,
    paragraphSpacing: true,
    textIndent: true,
    bulletList: true,
    numberedList: true,
    checklist: false,
    indent: true,
  },
  insert: {
    link: true,
    image: true,
    table: false,
    youtube: true,
    hr: true,
    emoji: true,
    fullscreen: true,
  },
  status: {
    wordCount: true,
    readingTime: false,
  },
};

const MINIMAL_FORMATTING_TOOLBAR = {
  tabs: ['Home'] as Array<'Home' | 'Insert' | 'Layout'>,
  font: {
    fontFamily: false,
    fontSize: true,
    fontSizeStep: false,
    bold: true,
    italic: true,
    underline: true,
    strike: false,
    superscript: false,
    subscript: false,
    clearFormatting: true,
    color: true,
    highlight: false,
  },
  paragraph: {
    heading: false,
    align: true,
    alignments: ['left', 'center', 'right'] as Array<'left' | 'center' | 'right' | 'justify'>,
    lineHeight: false,
    letterSpacing: false,
    wordSpacing: false,
    paragraphSpacing: false,
    textIndent: false,
    bulletList: false,
    numberedList: false,
    checklist: false,
    indent: false,
  },
  insert: {
    link: true,
    image: false,
    table: false,
    youtube: false,
    hr: false,
    emoji: true,
    fullscreen: false,
  },
  status: {
    wordCount: false,
    readingTime: false,
  },
};

export const SECTION_TOOLBAR_CONFIGS: Record<SectionType, SectionConfig> = {
  // 1. SAMBUTAN MUDIR & PENDIRI
  sambutan: {
    sectionName: 'Sambutan Mudir & Pimpinan',
    fields: {
      message_full: {
        label: 'Naskah Lengkap Sambutan Mudir',
        placeholder: 'Tuliskan amanat dan kalam santri secara lengkap...',
        bucket: 'avatars',
        minHeight: '340px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '1.8',
          textAlign: 'justify',
          paragraphSpacing: { after: 12 },
          letterSpacing: 'normal',
          wordSpacing: 'normal',
        },
        toolbar: {
          tabs: ['Home', 'Insert', 'Layout'],
          font: {
            fontFamily: true,
            fontSize: true,
            fontSizeStep: true,
            bold: true,
            italic: true,
            underline: true,
            strike: false,
            superscript: false,
            subscript: false,
            clearFormatting: true,
            color: true,
            highlight: true,
          },
          paragraph: {
            heading: true,
            headingsList: ['p', 'h2', 'h3', 'blockquote'],
            align: true,
            alignments: ['left', 'center', 'justify'],
            lineHeight: true,
            lineHeights: ['1.0', '1.5', '1.8', '2.0'],
            letterSpacing: true,
            wordSpacing: true,
            paragraphSpacing: true,
            textIndent: true,
            bulletList: true,
            numberedList: true,
            checklist: false,
            indent: true,
          },
          insert: {
            link: true,
            image: true,
            table: false,
            youtube: true,
            hr: true,
            emoji: true,
            fullscreen: true,
          },
          status: {
            wordCount: true,
            readingTime: true,
          },
        },
      },
      message_short: {
        label: 'Ringkasan Sambutan Beranda',
        placeholder: 'Cuplikan singkat pengantar di halaman utama...',
        bucket: 'avatars',
        minHeight: '140px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.6',
          textAlign: 'left',
          paragraphSpacing: { after: 8 },
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      quote: {
        label: 'Kutipan / Motto Pengasuh',
        placeholder: '"Mencetak generasi rabbani berjiwa santri..."',
        bucket: 'avatars',
        minHeight: '90px',
        defaultStyle: {
          fontFamily: 'Amiri',
          fontSize: '18px',
          lineHeight: '1.5',
          textAlign: 'center',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            fontFamily: true,
            italic: true,
            color: true,
          },
        },
      },
      name: {
        label: 'Nama Lengkap Pengasuh & Gelar',
        placeholder: 'KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I.',
        bucket: 'avatars',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '1.2',
          textAlign: 'left',
        },
        toolbar: {
          tabs: ['Home'],
          font: {
            fontFamily: false,
            fontSize: false,
            fontSizeStep: false,
            bold: true,
            italic: false,
            underline: false,
            strike: false,
            superscript: true,
            subscript: false,
            clearFormatting: true,
            color: true,
            highlight: false,
          },
          paragraph: {
            heading: false,
            align: false,
            lineHeight: false,
            letterSpacing: false,
            wordSpacing: false,
            paragraphSpacing: false,
            textIndent: false,
            bulletList: false,
            numberedList: false,
            checklist: false,
            indent: false,
          },
          insert: {
            link: false,
            image: false,
            table: false,
            youtube: false,
            hr: false,
            emoji: true,
            fullscreen: false,
          },
          status: {
            wordCount: false,
            readingTime: false,
          },
        },
      },
      title: {
        label: 'Jabatan & Amanah',
        placeholder: 'Pengasuh & Pendiri PP Jauharul Maknuun',
        bucket: 'avatars',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.2',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 2. HERO SLIDER
  slider: {
    sectionName: 'Hero Slider Beranda',
    fields: {
      title: {
        label: 'Judul Utama Flyer Slide',
        placeholder: 'Pondok Modern Lasem Berkarakter Rabbani',
        bucket: 'cms-images',
        minHeight: '70px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '22px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            fontFamily: true,
            fontSize: true,
            color: true,
          },
        },
      },
      description: {
        label: 'Keterangan Singkat Slide',
        placeholder: 'Menyelenggarakan pendidikan pesantren salafiyah dipadukan kurikulum modern...',
        bucket: 'cms-images',
        minHeight: '120px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },

  // 3. QUICK MENU
  quickmenu: {
    sectionName: 'Navigasi Cepat (Quick Menu)',
    fields: {
      label: {
        label: 'Label Menu Cepat',
        placeholder: 'Tahfidz Qur\'an',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '13px',
          lineHeight: '1.2',
          textAlign: 'center',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 4. KEUNGGULAN 4 PILAR
  keunggulan: {
    sectionName: 'Keunggulan & Karakteristik Santri',
    fields: {
      title: {
        label: 'Judul Keunggulan',
        placeholder: 'Bilingual Mandarin & Bahasa Arab Aktif',
        bucket: 'cms-images',
        minHeight: '70px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '18px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Uraian Komparatif Keunggulan',
        placeholder: 'Santri dibekali kemampuan percakapan harian dan sertifikasi resmi HSK...',
        bucket: 'cms-images',
        minHeight: '130px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },

  // 5. FASILITAS PESANTREN
  fasilitas: {
    sectionName: 'Sarana & Fasilitas Kampus',
    fields: {
      name: {
        label: 'Nama Fasilitas',
        placeholder: 'Laboratorium Komputer & STEM IoT ESP32',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Deskripsi & Spesifikasi Fasilitas',
        placeholder: 'Daftar kelengkapan alat, kapasitas ruangan, dan jadwal penggunaan...',
        bucket: 'cms-images',
        minHeight: '200px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...MEDIUM_CONTENT_TOOLBAR,
          insert: {
            ...MEDIUM_CONTENT_TOOLBAR.insert,
            table: true,
          },
        },
      },
    },
  },

  // 6. LEMBAGA / PROFIL
  lembaga: {
    sectionName: 'Lembaga Naungan & Sejarah',
    fields: {
      name: {
        label: 'Nama Lembaga',
        placeholder: 'SMP Plus Jauharul Maknuun',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '18px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Profil & Karakteristik Lembaga',
        placeholder: 'Uraian visi akademik, kurikulum terakreditasi, dan capaian kelulusan...',
        bucket: 'cms-images',
        minHeight: '240px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.7',
          textAlign: 'justify',
        },
        toolbar: FULL_WORD_TOOLBAR,
      },
      history: {
        label: 'Naskah Sejarah Berdiri',
        placeholder: 'Kronologi rintisan pesantren dari tahun ke tahun...',
        bucket: 'cms-images',
        minHeight: '280px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.8',
          textAlign: 'justify',
          paragraphSpacing: { after: 12 },
        },
        toolbar: FULL_WORD_TOOLBAR,
      },
    },
  },

  // 7. PROGRAM PONDOK
  program_pondok: {
    sectionName: 'Kurikulum & Program Kepesantrenan',
    fields: {
      title: {
        label: 'Nama Program Kepesantrenan',
        placeholder: 'Kajian Kitab Kuning Bersanad',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Penjelasan & Target Amaliyah Santri',
        placeholder: 'Rincian jenjang kitab, muallim pengampu, dan target hafalan nadzom...',
        bucket: 'cms-images',
        minHeight: '220px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.7',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      curriculum: {
        label: 'Silabus & Jadwal Harian Pondok 24 Jam',
        placeholder: 'Tabel alur kegiatan santri dari Shubuh hingga Mudzakarah malam...',
        bucket: 'cms-images',
        minHeight: '260px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...FULL_WORD_TOOLBAR,
          insert: {
            ...FULL_WORD_TOOLBAR.insert,
            table: true,
          },
        },
      },
    },
  },

  // 8. PROGRAM SMP PLUS
  program_smp: {
    sectionName: 'Akademik SMP Plus JM',
    fields: {
      title: {
        label: 'Program Akademik Unggulan',
        placeholder: 'Sains Robotik & Coding Berbasis Proyek',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Deskripsi Kurikulum Formal BAN-PDM',
        placeholder: 'Penyelarasan standar kurikulum nasional dengan muatan riset santri...',
        bucket: 'cms-images',
        minHeight: '200px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.7',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      highlights: {
        label: 'Poin-Poin Capaian Lulusan',
        placeholder: '1. Penguasaan bahasa aktif\n2. Portofolio riset mandiri...',
        bucket: 'cms-images',
        minHeight: '160px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },

  // 9. PROGRAM MADIN
  program_madin: {
    sectionName: 'Madrasah Diniyah & Flyer Kitab',
    fields: {
      title: {
        label: 'Nama Jenjang / Kelas Madin',
        placeholder: 'Ula, Wustho, Ulya',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Uraian Jenjang Kajian',
        placeholder: 'Penyampaian ilmu fiqih, nahwu, shorof, dan akhlaq...',
        bucket: 'cms-images',
        minHeight: '180px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      kitab: {
        label: 'Daftar Kitab Rujukan',
        placeholder: 'Fathul Qorib, Jurumiyah, Taqrib, Imrithi...',
        bucket: 'cms-images',
        minHeight: '140px',
        defaultStyle: {
          fontFamily: 'Amiri',
          fontSize: '16px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            fontFamily: true,
          },
          paragraph: {
            ...MINIMAL_FORMATTING_TOOLBAR.paragraph,
            bulletList: true,
          },
        },
      },
    },
  },

  // 10. STEM AREA
  stem: {
    sectionName: 'Laboratorium STEM & Riset Santri',
    fields: {
      title: {
        label: 'Judul Proyek Inovasi STEM',
        placeholder: 'Stasiun Cuaca Cerdas IoT ESP32',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Uraian Sains & Cara Kerja',
        placeholder: 'Penjelasan sensor DHT22, koneksi MQTT ke cloud dashboard, dan logika mikrokontroler...',
        bucket: 'cms-images',
        minHeight: '220px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: FULL_WORD_TOOLBAR,
      },
      goals: {
        label: 'Target Capaian & Kompetensi Santri',
        placeholder: 'Menumbuhkan nalar analitis, pemecahan masalah algoritmis...',
        bucket: 'cms-images',
        minHeight: '150px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      steps: {
        label: 'Langkah Kerja Worksheet Eksperimen',
        placeholder: 'Tahap 1: Perakitan sirkuit breadboard\nTahap 2: Flashing firmware C++...',
        bucket: 'cms-images',
        minHeight: '220px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...MEDIUM_CONTENT_TOOLBAR,
          paragraph: {
            ...MEDIUM_CONTENT_TOOLBAR.paragraph,
            numberedList: true,
            checklist: true,
          },
        },
      },
    },
  },

  // 11. MANDARIN CORNER
  mandarin: {
    sectionName: 'Mandarin Center (HSK & Percakapan)',
    fields: {
      vocab: {
        label: 'Kosakata & Pinyin',
        placeholder: '你好 (Nǐ hǎo) - Halo / Salam',
        bucket: 'cms-images',
        minHeight: '70px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '18px',
          lineHeight: '1.4',
          textAlign: 'left',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            color: true,
            bold: true,
          },
        },
      },
      example: {
        label: 'Contoh Dialog Percakapan Santri',
        placeholder: 'A: 老师好！(Lǎoshī hǎo!)\nB: 同学们好！(Tóngxuémen hǎo!)',
        bucket: 'cms-images',
        minHeight: '160px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.7',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      description: {
        label: 'Ulasan Grammar & Budaya',
        placeholder: 'Penggunaan partikel salam dan etika sopan santun santri...',
        bucket: 'cms-images',
        minHeight: '180px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },

  // 12. HAFIDZ QUR'AN
  hafidz: {
    sectionName: 'Tahfidz Qur\'an & Sanad',
    fields: {
      title: {
        label: 'Judul Halaqah / Jenjang Tahfidz',
        placeholder: 'Halaqah Mutqin Juz 30',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      content: {
        label: 'Naskah Metode Murojaah & Syarat Ujian Tasmi',
        placeholder: 'Alur setoran hafalan, mutabaah harian, serta sanad qiraat...',
        bucket: 'cms-images',
        minHeight: '260px',
        defaultStyle: {
          fontFamily: 'Amiri',
          fontSize: '18px',
          lineHeight: '1.8',
          textAlign: 'justify',
          paragraphSpacing: { after: 12 },
        },
        toolbar: {
          ...FULL_WORD_TOOLBAR,
          font: {
            ...FULL_WORD_TOOLBAR.font,
            fontFamily: true,
          },
        },
      },
      motto: {
        label: 'Kalam Hikmah Qurani',
        placeholder: '"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"',
        bucket: 'cms-images',
        minHeight: '80px',
        defaultStyle: {
          fontFamily: 'Amiri',
          fontSize: '20px',
          lineHeight: '1.5',
          textAlign: 'center',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            fontFamily: true,
            color: true,
            bold: true,
          },
        },
      },
    },
  },

  // 13. PRESTASI SANTRI
  prestasi: {
    sectionName: 'Galeri Prestasi & Kejuaraan',
    fields: {
      title: {
        label: 'Nama Kejuaraan & Prestasi',
        placeholder: 'Juara 1 Lomba Robotika Nasional Kemenag 2026',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            bold: true,
            color: true,
          },
        },
      },
      description: {
        label: 'Catatan Perjuangan & Deskripsi Lomba',
        placeholder: 'Perjalanan tim santri dalam menyisihkan puluhan peserta dari berbagai provinsi...',
        bucket: 'cms-images',
        minHeight: '160px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },

  // 14. EKSTRAKURIKULER
  ekskul: {
    sectionName: 'Ekstrakurikuler & Pengembangan Bakat',
    fields: {
      name: {
        label: 'Nama Ekstrakurikuler',
        placeholder: 'Pagar Nusa & Seni Bela Diri Santri',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Deskripsi & Manfaat Kegiatan',
        placeholder: 'Membentuk ketangkasan fisik, disiplin spiritual, dan sportivitas...',
        bucket: 'cms-images',
        minHeight: '180px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      syllabus: {
        label: 'Jadwal Latihan & Silabus Tingkatan',
        placeholder: 'Tingkat Sabuk Hijau, Putih, Kuning serta agenda latihan mingguan...',
        bucket: 'cms-images',
        minHeight: '200px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...MEDIUM_CONTENT_TOOLBAR,
          insert: {
            ...MEDIUM_CONTENT_TOOLBAR.insert,
            table: true,
          },
        },
      },
    },
  },

  // 15. OSIS SANTRI
  osis: {
    sectionName: 'Organisasi Santri (OSIS SMP Plus)',
    fields: {
      name: {
        label: 'Nama Departemen / Jabatan',
        placeholder: 'Departemen Riset STEM & Keilmuan',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '15px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      motto: {
        label: 'Motto Kepemimpinan',
        placeholder: '"Memimpin dengan keteladanan akhlaqul karimah"',
        bucket: 'cms-images',
        minHeight: '80px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.4',
          textAlign: 'center',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            italic: true,
            color: true,
          },
        },
      },
      program: {
        label: 'Program Kerja Unggulan (Proker)',
        placeholder: 'Rincian program kerja bulanan dan tahunan santri...',
        bucket: 'cms-images',
        minHeight: '220px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: {
          ...MEDIUM_CONTENT_TOOLBAR,
          paragraph: {
            ...MEDIUM_CONTENT_TOOLBAR.paragraph,
            checklist: true,
            bulletList: true,
            numberedList: true,
          },
        },
      },
      target: {
        label: 'Sasaran & Evaluasi Kinerja',
        placeholder: 'Target ketercapaian kedisiplinan dan partisipasi santri...',
        bucket: 'cms-images',
        minHeight: '140px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 16. BERITA & WARTA (PALING LENGKAP)
  berita: {
    sectionName: 'Portal Warta & Berita Resmi',
    fields: {
      content: {
        label: 'Naskah Lengkap Berita (Full Word Editor)',
        placeholder: 'Tuliskan liputan warta santri secara lengkap, tambahkan gambar, tabel, dan video...',
        bucket: 'berita-images',
        minHeight: '420px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '1.8',
          textAlign: 'justify',
          paragraphSpacing: { before: 0, after: 12 },
          letterSpacing: 'normal',
          wordSpacing: 'normal',
        },
        toolbar: FULL_WORD_TOOLBAR,
      },
      excerpt: {
        label: 'Ringkasan Siaran Pers (Lead Paragraph)',
        placeholder: 'Ringkasan 2-3 kalimat pembuka untuk preview di katalog dan broadcast...',
        bucket: 'berita-images',
        minHeight: '110px',
        maxLength: 280,
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      title: {
        label: 'Judul Utama Berita',
        placeholder: 'Pondok Pesantren Jauharul Maknuun Raih Penghargaan Madrasah Inovatif 2026',
        bucket: 'berita-images',
        minHeight: '70px',
        maxLength: 140,
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '20px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            bold: true,
            color: true,
          },
        },
      },
    },
  },

  // 17. GALERI MULTIMEDIA
  galeri: {
    sectionName: 'Galeri Foto & Video Kegiatan',
    fields: {
      title: {
        label: 'Judul Agenda Galeri',
        placeholder: 'Haflah Khotmil Qur\'an 30 Juz & Wisuda Santri',
        bucket: 'galeri-foto',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Deskripsi Suasana & Dokumentasi',
        placeholder: 'Liputan dokumentasi momen khidmat disaksikan para kyai dan wali santri...',
        bucket: 'galeri-foto',
        minHeight: '160px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },

  // 18. AGENDA PESANTREN
  agenda: {
    sectionName: 'Kalender & Agenda Bulanan',
    fields: {
      title: {
        label: 'Nama Agenda / Event Akbar',
        placeholder: 'Peringatan Hari Santri Nasional & Pameran Riset',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Keterangan Agenda & Susunan Acara',
        placeholder: 'Waktu pelaksanaan, pembicara tamu, serta petunjuk kehadiran wali santri...',
        bucket: 'cms-images',
        minHeight: '180px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'justify',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      location_text: {
        label: 'Lokasi & Keterangan Tempat',
        placeholder: 'Masjid Jami\' Pesantren / Aula Utama Al-Maknuun',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '13px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 19. TESTIMONI WALI / SANTRI
  testimoni: {
    sectionName: 'Testimoni Wali & Alumni',
    fields: {
      name: {
        label: 'Nama Pemberi Testimoni',
        placeholder: 'H. Ahmad Supriyadi (Wali Santri Angkatan VII)',
        bucket: 'avatars',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '15px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      role: {
        label: 'Profesi / Asal Kota',
        placeholder: 'Praktisi Teknologi • Surabaya',
        bucket: 'avatars',
        minHeight: '55px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '13px',
          lineHeight: '1.2',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      message: {
        label: 'Isi Kesan & Pengalaman',
        placeholder: '"Alhamdulillah anak kami kini mandiri, fasih membaca kitab kuning, dan mahir coding..."',
        bucket: 'avatars',
        minHeight: '150px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.7',
          textAlign: 'justify',
        },
        toolbar: {
          ...MINIMAL_FORMATTING_TOOLBAR,
          font: {
            ...MINIMAL_FORMATTING_TOOLBAR.font,
            italic: true,
            color: true,
          },
        },
      },
    },
  },

  // 20. STATISTIK PONDOK
  stats: {
    sectionName: 'Angka & Statistik Pesantren',
    fields: {
      label: {
        label: 'Keterangan Statistik',
        placeholder: 'Santri Mukim Aktif',
        bucket: 'cms-images',
        minHeight: '55px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.2',
          textAlign: 'center',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Keterangan Metrik',
        placeholder: 'Berasal dari 14 provinsi di seluruh penjuru nusantara',
        bucket: 'cms-images',
        minHeight: '80px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '13px',
          lineHeight: '1.4',
          textAlign: 'center',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 21. KONTAK & LAYANAN
  kontak: {
    sectionName: 'Kontak Hotline & Media Sosial',
    fields: {
      label: {
        label: 'Label Kanal Kontak',
        placeholder: 'WhatsApp Hotline Pendaftaran Santri Baru',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      address: {
        label: 'Alamat Lengkap Pesantren',
        placeholder: 'Jl. Raya Lasem, Sidayu, Kabupaten Gresik, Jawa Timur 61153',
        bucket: 'cms-images',
        minHeight: '90px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.5',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      greeting: {
        label: 'Template Pesan WhatsApp',
        placeholder: 'Assalamu\'alaikum Admin PPJM, saya ingin berkonsultasi mengenai pendaftaran...',
        bucket: 'cms-images',
        minHeight: '100px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '13px',
          lineHeight: '1.5',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 22. NAVBAR 9 PILAR
  navbar: {
    sectionName: 'Navigasi Atas (Navbar)',
    fields: {
      label: {
        label: 'Judul Tautan Navigasi',
        placeholder: 'Program Unggulan',
        bucket: 'cms-images',
        minHeight: '55px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '13px',
          lineHeight: '1.2',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 23. BOTTOM NAV 5 HUB
  bottomnav: {
    sectionName: 'Navigasi Bawah Mobile (BottomNav)',
    fields: {
      label: {
        label: 'Label Ikon Tab',
        placeholder: 'Smart JM',
        bucket: 'cms-images',
        minHeight: '55px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '12px',
          lineHeight: '1.2',
          textAlign: 'center',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
    },
  },

  // 24. SPMB (PENDAFTARAN SANTRI BARU)
  spmb: {
    sectionName: 'SPMB & Penerimaan Santri Baru',
    fields: {
      title: {
        label: 'Judul Gelombang SPMB',
        placeholder: 'Pendaftaran Santri Baru Tahun Ajaran 2026/2027',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '18px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      alur: {
        label: 'Alur & Prosedur Pendaftaran',
        placeholder: 'Tahap 1: Pengisian formulir online\nTahap 2: Tes baca Al-Qur\'an...',
        bucket: 'cms-images',
        minHeight: '220px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.7',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      persyaratan: {
        label: 'Syarat Berkas & Dokumen',
        placeholder: '1. Fotokopi Akta Kelahiran & Kartu Keluarga\n2. Ijazah legalisir...',
        bucket: 'cms-images',
        minHeight: '200px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...MEDIUM_CONTENT_TOOLBAR,
          paragraph: {
            ...MEDIUM_CONTENT_TOOLBAR.paragraph,
            bulletList: true,
            checklist: true,
          },
        },
      },
      biaya: {
        label: 'Rincian Biaya & Infaq Pendidikan',
        placeholder: 'Tabel biaya pendaftaran, uang pangkal, asrama, dan syahriyah bulanan...',
        bucket: 'cms-images',
        minHeight: '240px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: {
          ...FULL_WORD_TOOLBAR,
          insert: {
            ...FULL_WORD_TOOLBAR.insert,
            table: true,
          },
        },
      },
    },
  },

  // FALLBACK DEFAULT
  default: {
    sectionName: 'Section Umum',
    fields: {
      content: {
        label: 'Konten Teks',
        placeholder: 'Tuliskan teks di sini...',
        bucket: 'cms-images',
        minHeight: '180px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '15px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
      title: {
        label: 'Judul',
        placeholder: 'Judul konten...',
        bucket: 'cms-images',
        minHeight: '60px',
        defaultStyle: {
          fontFamily: 'Poppins',
          fontSize: '16px',
          lineHeight: '1.3',
          textAlign: 'left',
        },
        toolbar: MINIMAL_FORMATTING_TOOLBAR,
      },
      description: {
        label: 'Deskripsi',
        placeholder: 'Deskripsi penjelasan...',
        bucket: 'cms-images',
        minHeight: '140px',
        defaultStyle: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '1.6',
          textAlign: 'left',
        },
        toolbar: MEDIUM_CONTENT_TOOLBAR,
      },
    },
  },
};

/**
 * Helper untuk mengambil konfigurasi toolbar per section dan field
 */
export function getSectionToolbarConfig(
  sectionType: string,
  fieldName: string = 'content'
): FieldToolbarConfig {
  const normalizedSec = (sectionType || '').toLowerCase().replace(/-/g, '_') as SectionType;
  const sectionConfig = SECTION_TOOLBAR_CONFIGS[normalizedSec] || SECTION_TOOLBAR_CONFIGS.default;
  
  if (sectionConfig.fields[fieldName]) {
    return sectionConfig.fields[fieldName];
  }

  // Fallback field match
  if (fieldName.includes('name') || fieldName.includes('title') || fieldName.includes('label')) {
    return sectionConfig.fields.title || sectionConfig.fields.name || sectionConfig.fields.label || SECTION_TOOLBAR_CONFIGS.default.fields.title;
  }

  if (fieldName.includes('desc') || fieldName.includes('excerpt') || fieldName.includes('summary')) {
    return sectionConfig.fields.description || sectionConfig.fields.excerpt || SECTION_TOOLBAR_CONFIGS.default.fields.description;
  }

  return sectionConfig.fields.content || SECTION_TOOLBAR_CONFIGS.default.fields.content;
}

