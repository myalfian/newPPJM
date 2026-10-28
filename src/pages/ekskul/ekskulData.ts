import { DetailedEkskulItem } from './types';

export const EKSKUL_DATASET: DetailedEkskulItem[] = [
  {
    id: 'robotik-stem',
    name: 'Klub Robotika & IoT Pesantren',
    category: 'Sains & Teknologi',
    schedule: 'Setiap Sabtu, 13.30 - 15.30 WIB',
    coach: 'Ustadz Riski, S.T. (Praktisi IoT & Embedded System)',
    tempatLatihan: 'Laboratorium Komputer & STEM Gedung Timur',
    targetCapaian: 'Mampu merakit robot autonomous line follower dan sistem IoT irigasi terprogram.',
    description:
      'Wadah eksplorasi sains modern dan rekayasa teknologi bagi santri. Mengintegrasikan pemrograman mikrokontroler (Arduino, ESP32), sensor cerdas, kecerdasan buatan dasar, dan perakitan mekanis untuk menghasilkan karya inovatif yang solutif bagi kehidupan pesantren.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Pemrograman visual & C++ mikrokontroler',
      'Desain sirkuit elektronika & perakitan sensor',
      'Persiapan delegasi Olimpiade Robotika Nasional',
      'Implementasi nyata Smart Greenhouse Pesantren'
    ],
    gallery: [
      {
        id: 'rob-1',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
        caption: 'Praktikum kalibrasi sensor kelembaban kapasitif pada sistem otomasi irigasi.',
        timeTag: 'Sesi Praktikum Lab'
      },
      {
        id: 'rob-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        caption: 'Santri melakukan pengujian jalur line follower robot berkecepatan tinggi.',
        timeTag: 'Uji Lintasan'
      },
      {
        id: 'rob-3',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
        caption: 'Diskusi kelompok santri merancang algoritma logika sensor pada papan sirkuit.',
        timeTag: 'Kolaborasi Tim'
      },
      {
        id: 'rob-4',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
        caption: 'Penyolderan modul solar cell dual-axis otomatis untuk suplai daya mandiri.',
        timeTag: 'Perakitan Mekanik'
      }
    ]
  },
  {
    id: 'tahfidz-tilawah',
    name: 'Seni Tilawatil Qur’an & Mujawwad',
    category: 'Kepanduan & Keagamaan',
    schedule: 'Setiap Malam Jumat, 20.00 - 21.45 WIB',
    coach: 'Ustadz H. Ahmad Syakir, S.Q. (Qari’ Tingkat Provinsi)',
    tempatLatihan: 'Serambi Masjid Jami’ Raudhatul Ulum PPJM',
    targetCapaian: 'Menguasai 7 maqam tilawah (Bayati, Shoba, Hijaz, Nahawand, Rast, Sika, Jiharkah).',
    description:
      'Pembinaan khusus bagi santri bertalenta suara merdu dalam melantunkan ayat suci Al-Qur’an dengan kaidah tajwid presisi, ketukan nafas teratur, serta variasi lagu maqamat klasik. Menggembleng qari dan qari’ah muda untuk ajang MTQ kabupaten dan provinsi.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Pelatihan teknik pernafasan diafragma dan intonasi',
      'Penguasaan 7 Maqam Tilawatil Qur’an klasik',
      'Bimbingan tajwid tahqiq dan fasahah lisan',
      'Kaderisasi kafilah MTQ & MHQ Jawa Timur'
    ],
    gallery: [
      {
        id: 'til-1',
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Halaqah tilawah malam di serambi masjid dengan bimbingan qari senior.',
        timeTag: 'Latihan Rutin'
      },
      {
        id: 'til-2',
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        caption: 'Simulasi tasmi’ tilawah panggung di hadapan seluruh santri asrama.',
        timeTag: 'Unjuk Kebolehan'
      },
      {
        id: 'til-3',
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
        caption: 'Pendalaman makharijul huruf dan shifatul huruf perorangan secara talaqqi.',
        timeTag: 'Talaqqi Intensif'
      }
    ]
  },
  {
    id: 'kaligrafi-islam',
    name: 'Sanggar Seni Kaligrafi & Khat Kontemporer',
    category: 'Seni & Bahasa',
    schedule: 'Setiap Ahad, 08.30 - 11.00 WIB',
    coach: 'Ustadz Ridwan Al-Khattat (Juara Kaligrafi Nasional)',
    tempatLatihan: 'Studio Seni Budaya Gedung Madrasah',
    targetCapaian: 'Menguasai kaidah pena bambu jenis Khat Naskhi, Tsuluts, Riq’ah, dan Lukisan Kontemporer.',
    description:
      'Menghidupkan keindahan khazanah seni tulis Arab klasik berlandaskan kaidah proporsi geometris (qawa’id al-khatt). Santri belajar meracik tinta tradisional, menyerut kalam bambu handam, hingga mengeksplorasi kanvas lukisan kaligrafi kontemporer bernilai estetika tinggi.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Kaidah rasio titik & goresan pena handam',
      'Penguasaan gaya Naskhi, Tsuluts, Diwani, dan Farisi',
      'Teknik pewarnaan kanvas lukis akrilik kaligrafi',
      'Pameran galeri seni tahunan Milad Pesantren'
    ],
    gallery: [
      {
        id: 'kal-1',
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Santri menggoreskan pena handam mengikuti kaidah titik pada mushaf naskhi.',
        timeTag: 'Latihan Dasar'
      },
      {
        id: 'kal-2',
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80',
        caption: 'Eksplorasi lukisan kaligrafi akrilik di atas kanvas bertema ayat semesta.',
        timeTag: 'Karya Kanvas'
      },
      {
        id: 'kal-3',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
        caption: 'Evaluasi hasil karya goresan huruf santri oleh dewan pembina sanggar.',
        timeTag: 'Review Karya'
      }
    ]
  },
  {
    id: 'pencak-silat',
    name: 'Pencak Silat Pagar Nusa Nahdlatul Ulama',
    category: 'Olahraga & Bela Diri',
    schedule: 'Jumat Pagi (06.00 WIB) & Selasa Sore (16.00 WIB)',
    coach: 'Pendekar Syamsul Hadi (Pelatih Utama IPSI & Pagar Nusa Cabang)',
    tempatLatihan: 'Lapangan Olahraga & Halaman Utama Pesantren',
    targetCapaian: 'Tingkat sabuk berjenjang, jurus baku IPSI, dan ketahanan mental fisik satria.',
    description:
      'Olahraga bela diri tradisi kebanggaan santri nahdliyyin yang menanamkan kesiapan fisik tangguh, kedisiplinan ksatria, olah pernafasan batin, dan adab tawadhu’. Dilandasi semboyan “Amar Ma’ruf Nahi Munkar” tanpa melupakan jati diri santri berakhlakul karimah.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Penguasaan jurus baku paket tunggal & ganda IPSI',
      'Latihan fisik aerobik & fleksibilitas otot',
      'Olah pernafasan tenaga dalam santri',
      'Kejuaraan tanding pencak silat antar-pesantren'
    ],
    gallery: [
      {
        id: 'sil-1',
        url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
        caption: 'Pemanasan fisik santri dan latihan kuda-kuda dasar di halaman pesantren.',
        timeTag: 'Latihan Pagi'
      },
      {
        id: 'sil-2',
        url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1000&q=80',
        caption: 'Aplikasi teknik tangkisan dan kuncian berpasangan antar pendekar santri.',
        timeTag: 'Simulasi Tanding'
      },
      {
        id: 'sil-3',
        url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80',
        caption: 'Atraksi unjuk jurus seni pencak silat pada pembukaan Dies Natalis PPJM.',
        timeTag: 'Pentas Seni'
      }
    ]
  },
  {
    id: 'hadrah-banjari',
    name: 'Korps Hadrah & Shalawat Al-Banjari PPJM',
    category: 'Seni & Bahasa',
    schedule: 'Malam Rabu & Malam Ahad, 20.00 - 21.45 WIB',
    coach: 'Ustadz M. Ridlwan & Tim Hadrah Ahbabul Musthofa Gresik',
    tempatLatihan: 'Aula Serbaguna Ma’had Ali Lantai 2',
    targetCapaian: 'Harmonisasi ketukan terbang banjari, backing vocal koor, dan aransemen qasidah kontemporer.',
    description:
      'Grup kesenian musik rebana islami santri yang mengkhususkan diri pada irama pukulan terbang Al-Banjari dan Habsyi. Menjadi duta syiar shalawat pesantren dalam berbagai tabligh akbar, peringatan hari besar Islam, dan festival banjari tingkat regional Jawa Timur.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Sinkronisasi pukulan terbang anakan dan babon',
      'Vokal cengkok shalawat klasik dan melayu',
      'Penguasaan kitab Maulid Simthudduror & Ad-Diba’i',
      'Juara Festival Banjari Antar-Pelajar Jawa Timur'
    ],
    gallery: [
      {
        id: 'had-1',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
        caption: 'Penampilan tim Hadrah PPJM dalam gelaran peringatan Maulid Nabi SAW.',
        timeTag: 'Panggung Sholawat'
      },
      {
        id: 'had-2',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
        caption: 'Latihan intensif harmonisasi vokal utama bersama grup penabuh terbang.',
        timeTag: 'Sesi Latihan Rutin'
      },
      {
        id: 'had-3',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
        caption: 'Dokumentasi penerimaan trofi juara festival banjari tingkat karesidenan.',
        timeTag: 'Penghargaan Prestasi'
      }
    ]
  },
  {
    id: 'pramuka',
    name: 'Gerakan Pramuka Gugus Depan Berpangkalan Pesantren',
    category: 'Kepanduan & Keagamaan',
    schedule: 'Setiap Sabtu Sore, 15.30 - 17.00 WIB',
    coach: 'Kak Ahmad Yani (Pembina Mahir Tingkat Lanjutan Kwarda Jatim)',
    tempatLatihan: 'Bumi Perkemahan & Kawasan Terbuka Pesantren',
    targetCapaian: 'Pramuka Penggalang Ramu, Rakit, Terap, hingga pencapaian Pramuka Garuda.',
    description:
      'Pendidikan kepanduan yang mengintegrasikan nilai-nilai Dasa Dharma Pramuka dengan akhlakul karimah pesantren. Mengasah kemandirian hidup di alam terbuka, keterampilan sandi morse, semaphore, tali temali pioneering, navigasi kompas, dan pertolongan pertama (P3K).',
    featuredPhoto:
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Pioneering tiang bendera & jembatan darurat tali temali',
      'Penjelajahan lintas alam (wide game) & kompas bidik',
      'Perkemahan sabtu-minggu (Persami) mandiri',
      'Kaderisasi Pramuka Garuda Penggalang Berprestasi'
    ],
    gallery: [
      {
        id: 'pra-1',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        caption: 'Aktivitas pioneering mendirikan menara pandang menggunakan tongkat dan tali ijuk.',
        timeTag: 'Pioneering Camp'
      },
      {
        id: 'pra-2',
        url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
        caption: 'Upacara pembukaan latihan mingguan dengan penghormatan bendera merah putih.',
        timeTag: 'Apel Pramuka'
      },
      {
        id: 'pra-3',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
        caption: 'Malam keakraban api unggun dan pentas kreativitas regu penggalang santri.',
        timeTag: 'Malam Api Unggun'
      }
    ]
  },
  {
    id: 'english-arabic-club',
    name: 'Language Development Club (Arab & English)',
    category: 'Seni & Bahasa',
    schedule: 'Senin & Kamis Malam, 20.00 - 21.30 WIB',
    coach: 'Ust. M. Fauzan, M.Pd. & Miss Sarah Larasati, S.Li.',
    tempatLatihan: 'Ruang Multimedia & Smart Classroom 1',
    targetCapaian: 'Percakapan aktif dwibahasa, pidato 3 bahasa, dan penulisan artikel esai santri.',
    description:
      'Klub pengasahan kecakapan komunikasi global santri dalam bahasa Arab (Fusha) dan bahasa Inggris internasional. Menggunakan metode interaktif debate club, storytelling, penyiaran podcast santri, dan pembiasaan percakapan harian di lingkungan ma’had.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Debate Club santri bertema sains & isu sosial kontemporer',
      'Muhadharah (Public Speaking) tiga bahasa bergilir',
      'Klinik persiapan tes TOEFL & TOAFL santri',
      'Penerbitan buletin berbahasa Arab & Inggris santri'
    ],
    gallery: [
      {
        id: 'lang-1',
        url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
        caption: 'Simulasi public speaking di hadapan audiens santri dengan gestur percaya diri.',
        timeTag: 'Speech Training'
      },
      {
        id: 'lang-2',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
        caption: 'Sesi bedah kosakata percakapan tematik di ruang smart classroom.',
        timeTag: 'Interactive Session'
      },
      {
        id: 'lang-3',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Diskusi kelompok menguraikan mosi debat ilmiah berbahasa Inggris.',
        timeTag: 'Debate Club'
      }
    ]
  },
  {
    id: 'futsal-olahraga',
    name: 'Klub Futsal & Kebugaran Santri PPJM',
    category: 'Olahraga & Bela Diri',
    schedule: 'Ahad Pagi (06.30 - 08.30 WIB) & Rabu Sore (16.00 WIB)',
    coach: 'Coach Danang Prasetyo (Lisensi Pelatih Futsal PSSI Jatim)',
    tempatLatihan: 'Lapangan Olahraga Serbaguna PPJM',
    targetCapaian: 'Kebugaran kardiovaskular prima, taktik passing positioning, dan sportifitas santri.',
    description:
      'Wadah kebugaran jasmani santri melalui olahraga futsal berstandar. Melatih kelincahan kaki, taktik permainan tim, kekompakan ukhuwah, serta mental pantang menyerah dalam turnamen futsal antar-pesantren se-Jawa Timur.',
    featuredPhoto:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Latihan dasar dribbling, passing akurat & shooting terarah',
      'Pola formasi pertahanan diamond & rotasi penyerangan',
      'Penguatan stamina fisik dan ketangkasan kardio',
      'Liga Futsal Santri Pesantren Terjadwal'
    ],
    gallery: [
      {
        id: 'fut-1',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
        caption: 'Pertandingan persahabatan futsal antar kamar santri di lapangan semen halus.',
        timeTag: 'Liga Internal'
      },
      {
        id: 'fut-2',
        url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
        caption: 'Sesi peregangan otot dan pengarahan taktik strategi oleh pelatih kepala.',
        timeTag: 'Briefing Taktik'
      },
      {
        id: 'fut-3',
        url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1000&q=80',
        caption: 'Momen selebrasi sportivitas tim futsal santri saat mencetak gol kemenangan.',
        timeTag: 'Selebrasi Tim'
      }
    ]
  }
];

