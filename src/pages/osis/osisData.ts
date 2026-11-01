import { OsisDepartment, OsisArticleEvent } from './types';

export interface OsisGoal {
  id: number;
  title: string;
  description: string;
}

export const OSIS_METADATA_2026 = {
  academicYear: 'Masa Bakti 2026/2027',
  slogan: 'Membangun Jiwa Kepemimpinan, Menumbuhkan Tanggung Jawab, dan Mewujudkan Generasi Berakhlak Mulia.',
  motto: 'Satu Organisasi, Sejuta Inspirasi. Bersama Bergerak, Bersama Berkarya, Bersama Mengukir Prestasi.',
  mottoShort: 'Siap Memimpin, Siap Mengabdi, Siap Menginspirasi!',
  chartImageUrl: 'https://gzijnybcmhectajfkdtd.supabase.co/storage/v1/object/public/cms-images/osis/struktur-osis-2026-2027.webp',
  chartImageFallback: '/images/osis/struktur-osis-2026-2027.webp',
  goals: [
    {
      id: 1,
      title: 'Mengembangkan Jiwa Kepemimpinan',
      description: 'Melatih siswa agar mampu menjadi pemimpin yang amanah, disiplin, bertanggung jawab, dan dapat menjadi teladan bagi sesama.'
    },
    {
      id: 2,
      title: 'Meningkatkan Keimanan dan Ketakwaan',
      description: 'Membentuk karakter siswa yang berlandaskan nilai-nilai Islam serta memiliki akhlak mulia dalam kehidupan sehari-hari.'
    },
    {
      id: 3,
      title: 'Mengembangkan Bakat dan Potensi Siswa',
      description: 'Memberikan ruang bagi siswa untuk menyalurkan minat, bakat, kreativitas, serta kemampuan dalam bidang akademik maupun nonakademik.'
    },
    {
      id: 4,
      title: 'Menumbuhkan Rasa Persatuan dan Kebersamaan',
      description: 'Mempererat hubungan antarsiswa serta membangun semangat kerja sama, kepedulian, dan solidaritas.'
    },
    {
      id: 5,
      title: 'Meningkatkan Kedisiplinan dan Tanggung Jawab',
      description: 'Membiasakan siswa untuk menghargai waktu, menaati peraturan sekolah, dan melaksanakan tugas dengan penuh tanggung jawab.'
    },
    {
      id: 6,
      title: 'Menjadi Wadah Aspirasi Siswa',
      description: 'Menampung serta menyampaikan ide, saran, dan aspirasi siswa untuk mendukung kemajuan sekolah.'
    },
    {
      id: 7,
      title: 'Mewujudkan Lingkungan Sekolah yang Positif',
      description: 'Menciptakan suasana sekolah yang nyaman, bersih, tertib, religius, dan penuh semangat belajar.'
    }
  ] as OsisGoal[]
};

export const OSIS_DEPARTMENTS: OsisDepartment[] = [
  {
    "id": "ph",
    "name": "Pengurus Harian",
    "shortName": "BPH / PH",
    "arabicName": "هيئة الإدارة اليومية",
    "iconName": "Users",
    "coordinator": "Presidium Inti OSIS",
    "description": "Pilar sentral manajemen organisasi yang memandu koordinasi seluruh divisi, inventarisasi sekretariat, pengelolaan arus kas, dan penyerapan aspirasi warga sekolah.",
    "programs": [
      {
        "id": "pr-1-1",
        "title": "Jadwal piket OSIS",
        "target": "BPH / PH",
        "frequency": "Rutin Harian",
        "description": "Penugasan rutin harian bagi pengurus OSIS untuk menjaga kebersihan, kerapian, dan kesiapan sekretariat OSIS, serta memberikan pelayanan informasi bagi warga sekolah yang membutuhkan.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-2",
        "title": "Kotak Saran",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Wadah penampungan aspirasi, kritik, dan saran dari seluruh siswa/guru yang dipasang di titik strategis sekolah untuk meningkatkan kualitas fasilitas dan kegiatan sekolah.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-3",
        "title": "Bendahara: Laporan keuangan",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Pencatatan dan pembukuan seluruh arus kas masuk dan keluar OSIS secara transparan, akuntabel, dan berkala.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-4",
        "title": "Sekretaris : Surat menyurat",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Pembuatan, pengarsipan, dan pendistribusian surat resmi (surat undangan, proposal, surat izin, dan permohonan) untuk kegiatan internal maupun eksternal.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-5",
        "title": "Rapat pengurus OSIS per divisi",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Pertemuan internal anggota divisi untuk mendiskusikan rincian teknis, pembagian tugas, dan kendala program kerja yang ada di bawah naungan divisi masing-masing.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-6",
        "title": "Rapat pengurus OSIS",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Pertemuan seluruh pengurus OSIS beserta Pembina untuk menyelaraskan agenda, memantau progress kerja, dan mengambil keputusan strategis organisasi.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-7",
        "title": "Progress I Love JM",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Membuat ecobrick dan dibentuk I Love JM",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-8",
        "title": "Bisnis PH",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Kegiatan kewirausahaan (fundraising) pengurus OSIS melalui penjualan merchandise, makanan, atau barang di momen peringatan hari besar untuk menambah kas OSIS.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-9",
        "title": "Kas OSIS",
        "target": "BPH / PH",
        "frequency": "Mingguan",
        "description": "Pengumpulan iuran wajib mingguan/bulanan dari seluruh pengurus OSIS guna pendanaan operasional ringan dan dana darurat organisasi.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-10",
        "title": "Program membaca Al-qur'an",
        "target": "BPH / PH",
        "frequency": "Rutin Harian",
        "description": "Membaca Al-Qur'an setiap menunggu waktu sholat",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-11",
        "title": "PHBN",
        "target": "BPH / PH",
        "frequency": "Tahunan",
        "description": "Peringatan Hari Kemerdekaan RI melalui berbagai perlombaan antar-kelas (classmeeting) guna memupuk rasa nasionalisme dan kebersamaan.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-12",
        "title": "Rangkaian Pesta demokrasi",
        "target": "BPH / PH",
        "frequency": "Tahunan",
        "description": "Seluruh tahapan pemilihan umum Ketua dan Wakil Ketua OSIS baru (Pemilos), mulai dari orasi kampanye, debat kandidat, hingga pemungutan suara secara demokratis.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-1-13",
        "title": "Evaluasi setiap divisi",
        "target": "BPH / PH",
        "frequency": "Insidental",
        "description": "Sesi pementoran dan pemaparan Laporan Pertanggungjawaban (LPJ) dari tiap sekbid/divisi untuk menilai ketercapaian program kerja, masalah teknis, dan catatan perbaikan ke depan.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      }
    ]
  },
  {
    "id": "pendidikan",
    "name": "Divisi Pendidikan",
    "shortName": "Pendidikan",
    "arabicName": "قسم التربية والتعليم",
    "iconName": "BookOpen",
    "coordinator": "Divisi Pendidikan & Literasi",
    "description": "Mengawal penguatan wawasan keislaman, tadarus Al-Qur’an, nadhaman, kajian ilmiah, literasi mading, publikasi buku karya siswa, dan kompetisi akademik santri.",
    "programs": [
      {
        "id": "pr-2-1",
        "title": "Nadhaman",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan melantunkan nadham secara rutin setelah salat Dhuha sesuai jadwal yang telah ditentukan untuk membantu santri menghafal materi pelajaran, memperkuat pemahaman ilmu agama, serta menumbuhkan kedisiplinan dan kecintaan terhadap tradisi keilmuan pesantren",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-2",
        "title": "Tadarus quran",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan membaca Al-Qur’an secara rutin dan bersama-sama sebelum salat Dhuha sesuai jadwal yang telah ditentukan. Kegiatan ini bertujuan meningkatkan kelancaran bacaan, memperbaiki penerapan tajwid, serta menumbuhkan kedisiplinan dan kecintaan santri terhadap Al-Qur’an.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-3",
        "title": "Penertiban sholat 5 waktu, Dzikir, dan tahfidz",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan pembiasaan dan pendampingan santri dalam melaksanakan salat lima waktu secara tertib dan membiasakan dzikir setelah salat",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-4",
        "title": "Kajian Jauhar",
        "target": "Pendidikan",
        "frequency": "Mingguan",
        "description": "Kegiatan kajian keislaman yang bertujuan memperluas wawasan keagamaan, memperdalam pemahaman ajaran Islam, serta membentuk karakter santri yang berakhlak mulia dalam kehidupan sehari-hari. dilaksanakan 1 minggu sekali di Hari Selasa",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-5",
        "title": "Keputrian",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan pembinaan khusus bagi santriwati yang membahas fikih wanita, kesehatan dan perawatan diri, adab pergaulan, serta pengembangan karakter dan keterampilan yang mendukung pembentukan muslimah berakhlak mulia.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-6",
        "title": "Mencari info lomba",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan pencarian, pengumpulan, mengenai berbagai kompetisi akademik maupun nonakademik untuk memperluas kesempatan santri dalam mengembangkan potensi, bakat, minat, dan prestasi.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-7",
        "title": "Mading",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan pengelolaan majalah dinding sebagai media kreativitas, literasi, dan komunikasi santri melalui publikasi karya tulis, puisi, ilustrasi, informasi edukatif",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-8",
        "title": "Muhadhoroh Kubro",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan latihan dan penampilan pidato dalam skala besar bagi penampil muhadhoroh minguguan untuk melatih kemampuan berbicara di depan umum, menyampaikan dakwah, meningkatkan kepercayaan diri, serta mengembangkan keterampilan komunikasi santri.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-9",
        "title": "Jalsah Ilmiah",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan kajian ilmiah yang memberikan ruang bagi santri untuk bertukar gagasan, mengembangkan kemampuan berpikir kritis, memperluas wawasan dengan pemateri dari luar negeri",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-10",
        "title": "Penerbitan Buku Karya siswa",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan menghimpun, menyunting, dan menerbitkan karya tulis siswa dalam bentuk buku sebagai wadah pengembangan literasi, kreativitas, dan kemampuan menulis sekaligus sebagai bentuk apresiasi terhadap karya siswa",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-11",
        "title": "Bazar buku",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan pameran dan penjualan buku, gantungan kunci karakter, dan kebutuhan santri yang bertujuan meningkatkan minat baca, memperluas akses terhadap bahan bacaan yang edukatif, serta menumbuhkan budaya literasi dan kecintaan terhadap ilmu pengetahuan di lingkungan pesantren",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-12",
        "title": "Lomba museum gallery walk 3D sejarah hidup Nabi Muhammad SAW",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan lomba berbasis pameran dan gallery walk yang mengajak santri menyajikan informasi mengenai perjalanan hidup Nabi Muhammad SAW melalui media visual, poster, miniatur, atau instalasi edukatif. Kegiatan ini bertujuan meningkatkan pemahaman sejarah Islam, kreativitas, kemampuan presentasi, dan keteladanan terhadap akhlak Rasulullah SAW.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-2-13",
        "title": "Lomba kebersihan kelas",
        "target": "Pendidikan",
        "frequency": "Insidental",
        "description": "Kegiatan kompetisi antarkelas dalam menjaga kebersihan, kerapian, dan kenyamanan ruang belajar. Kegiatan ini bertujuan menumbuhkan kesadaran akan pentingnya kebersihan, tanggung jawab bersama, kedisiplinan, serta budaya hidup bersih dan sehat. kegiatan ini merupakan kolaborasi dengan divisi kebersihan",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      }
    ]
  },
  {
    "id": "keamanan",
    "name": "Divisi Keamanan",
    "shortName": "Keamanan",
    "arabicName": "قسم الأمن والانضباط",
    "iconName": "Shield",
    "coordinator": "Divisi Keamanan & Kedisiplinan",
    "description": "Menegakkan kedisiplinan asrama dan sekolah, penertiban sholat berjamaah (Tahajud, Subuh, Duha), pengawasan belajar malam, dan kepatuhan atribut santri.",
    "programs": [
      {
        "id": "pr-3-1",
        "title": "Pelaksanaan Kartu Izin",
        "target": "Keamanan",
        "frequency": "Insidental",
        "description": "Melaksanakan pemeriksaan dan memberikan pengawasan melalui kartu izin bagi siswa yang izin keluar kelas.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-3-2",
        "title": "Pemeriksaan Atribut, Kuku, Rambut, dan Aksesoris",
        "target": "Keamanan",
        "frequency": "Insidental",
        "description": "Memeriksa kelengkapan atribut, kebersihan kuku, kerapian rambut, serta penggunaan aksesori yang berlebihan",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-3-3",
        "title": "Pengawasan dan Penertiban Saat Upacara",
        "target": "Keamanan",
        "frequency": "Mingguan",
        "description": "Mengawasi kedisiplinan siswa, mengatur barisan, dan memastikan siswa tertib saat upacara hari Senin.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-3-4",
        "title": "Pengamanan Barang-Barang yang Diletakkan Sembarangan",
        "target": "Keamanan",
        "frequency": "Rutin Harian",
        "description": "Mengamankan barang-barang siswa yang diletakkan tidak pada tempatnya setiap hari.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-3-5",
        "title": "Pengawasan di Kelas Saat Pembelajaran",
        "target": "Keamanan",
        "frequency": "Insidental",
        "description": "Mengawasi kedisiplinan siswa selama pembelajaran agar tetap tertib, memperhatikan guru, dan tidak tidur di kelas maupun makan saat pembelajaran.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-3-6",
        "title": "Penertiban Salat Tahajud, Subuh, dan Dhuha",
        "target": "Keamanan",
        "frequency": "Rutin Harian",
        "description": "Mengawasi kedisiplinan siswa dalam mengikuti salat Tahajud, Subuh, dan Duha setiap hari.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-3-7",
        "title": "Pengamanan Saat Belajar Malam",
        "target": "Keamanan",
        "frequency": "Rutin Harian",
        "description": "Mengawasi ketertiban dan kedisiplinan siswa selama kegiatan belajar malam setiap hari.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      }
    ]
  },
  {
    "id": "bahasa",
    "name": "Divisi Bahasa",
    "shortName": "Bahasa",
    "arabicName": "قسم ترقية اللغة",
    "iconName": "Languages",
    "coordinator": "Divisi Bahasa Asing (Arab & Inggris)",
    "description": "Membangun bi’ah lughawiyyah (lingkungan dwibahasa aktif) melalui English Vibe, English in Application, mading English Corner, dan panggung seni KSJM.",
    "programs": [
      {
        "id": "pr-4-1",
        "title": "English Drilling Program",
        "target": "Bahasa",
        "frequency": "Mingguan",
        "description": "Kegiatan pemberian sentences yang dilaksanakan secara rutin setiap Selasa dan Kamis malam untuk di setorkan para santri",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-4-2",
        "title": "Morning Password",
        "target": "Bahasa",
        "frequency": "Insidental",
        "description": "Program pembisaan berbahasa inggris yang dilaksanakan setiap pagi sebelum santri memasuki kelas. Dalam kegiatan ini santri diwajibkan menghafal dan mengucapkan english sentence yang telah ditentukan sebagai syarat sebelum diperbolehkan masuk kelas",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-4-3",
        "title": "English Vibe",
        "target": "Bahasa",
        "frequency": "Mingguan",
        "description": "Program pembelajaran bahasa inggris yang dialaksanakan secara rutin di hari Selasa untuk meningkatkan kemampuan berkomunikasi santri menggunakan bahasa inggris dalam kehidupan sehari hari yang didampingi langsung oleh tutor grup.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-4-4",
        "title": "English In Application",
        "target": "Bahasa",
        "frequency": "Insidental",
        "description": "Program pembelajaran bahasa inggris yang dikemas secara kreatif, interaktif, dan menyenangkan dilingkungan boarding. Dalam pelaksanaannya, kegiatan EIA diisi dengan berbagai aktivitas menarik, seperti english games,daily conversation,vocabulary building, speaking practice, english quiz, serta tantangan berbahasa yang mendorongsantri untuk berani berbicara dan berinteraksi menggunakan bahasa inggris",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-4-5",
        "title": "Pengawasan Penggunaan Bahasa",
        "target": "Bahasa",
        "frequency": "Insidental",
        "description": "Kegiatan pemantauan dan pembinaan kebiasaan berbahasa santri dilingkungan boarding school untuk membangun buudaya komunikasi yang aktif,displin, dan konsisten menggunakan bahasa yang telah ditetapka, khususnya bahasa inggris dan bahasa arab",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-4-6",
        "title": "English Corner",
        "target": "Bahasa",
        "frequency": "Insidental",
        "description": "Program pengembangan kemampuan bahasa inggris melalui media majalah dinding (mading) yang disediakan dilingkungan boarding school sebagai sarana belajar yang kreatif, interaktif, dan menyenangkan. Program ini berisi berbagai tantangan bahasa inggris seperti kosa kata, teka teki, dan penyusunan kalimat. santri dapat berpartisipasi dengan menuliskan jawaban dan memasukkannya kedalam kotak jawaban yang tersedia. setiap tantangan memiliki pemenang sebagai bentuk apresiasi atas kemampuan dan partisipasi santri.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      },
      {
        "id": "pr-4-7",
        "title": "KSJM",
        "target": "Bahasa",
        "frequency": "Insidental",
        "description": "kegiatan pengembangan kreativitas dan keterampilan berbahasa santri melalui pagelaran seni yang ditampilkan oleh setiap kelompok di lingkungan boarding school. Setiap kelompok menampilkan berbagai pertunjukan seni berbahasa menggunakan bahasa Inggris atau bahasa Arab. Kegiatan ini bertujuan untuk meningkatkan kemampuan berbahasa, melatih kepercayaan diri, mengembangkan kreativitas, serta memperkuat kerja sama dan kekompakan ant santri dalam suasana yang edukatif dan menghibur.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      }
    ]
  },
  {
    "id": "kebersihan-kesehatan",
    "name": "Divisi Kebersihan dan Kesehatan",
    "shortName": "Kesehatan & Kebersihan",
    "arabicName": "قسم الصحة والنظافة",
    "iconName": "HeartPulse",
    "coordinator": "Divisi Kebersihan & Kesehatan Santri",
    "description": "Menjaga kesehatan fisik santri melalui pemeriksaan rutin tensi/BB, piket lingkungan, kerja bakti Roan Akbar, pengelolaan ecobrick & daur ulang sampah botol plastik.",
    "programs": [
      {
        "id": "pr-5-1",
        "title": "Menyusun Jadwal Piket Perpustakaan (1 minggu Perkamar)",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Mingguan",
        "description": "Membuat jadwal piket untuk perpustakaan yang dilakukan setiap kamar satu minggu sekali. PJ banin: Bayu, PJ banat: Qori,",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "banin: Bayu, PJ banat: Qori,"
      },
      {
        "id": "pr-5-2",
        "title": "Roan Akbar",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Bulanan",
        "description": "Kerja bakti yang dilakukan setiap satu bulan sekali. PJ akan membagi tugas untuk setiap anak untuk membersikan area yang telah ditentukan. PJ banin: Bayu, PJ banat: Putri & Kayla.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "akan membagi tugas untuk setiap anak untuk membersikan area yang telah ditentukan"
      },
      {
        "id": "pr-5-3",
        "title": "Cek Alat Kebersihan Kelas",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Rutin Harian",
        "description": "PJ melakukan pemeriksaan kelengkapan dan kondisi alat kebersihan setiap hari senin (1 minggu sekali) yang tersedia di setiap kelas untuk memastikan semuanya tersedia, layak digunakan, serta tersimpan dengan rapi pada tempatnya. PJ banin: Alim, PJ banat: Qori'",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "melakukan pemeriksaan kelengkapan dan kondisi alat kebersihan setiap hari senin (1 minggu sekali) yang tersedia di setiap kelas untuk memastikan semuanya tersedia, layak digunakan, serta tersimpan dengan rapi pada tempatnya"
      },
      {
        "id": "pr-5-4",
        "title": "Membersihkan Sajadah Imam Sholat 5 waktu dan Sholat Jumat",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Insidental",
        "description": "Kegiatan ini meliputi membersihkan dan menyiapkan sajadah dari debu dan kotoran, merapikan posisi sajadah untuk imam saat pelaksanaan salat lima waktu maupun salat Jumat. PJ: Ghazy",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "Ghazy"
      },
      {
        "id": "pr-5-5",
        "title": "Cek Sampah Botol Plastik",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Insidental",
        "description": "PJ bertugas memastikan botol plastik yang terkumpul sudah dikosongkan dari sisa air atau cairan lainnya serta dipisahkan dari jenis sampah lain agar pengelolaan sampah berjalan dengan baik dan lingkungan tetap bersih. PJ banin: Irsyad, PJ banat: Qori' & Putri.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "bertugas memastikan botol plastik yang terkumpul sudah dikosongkan dari sisa air atau cairan lainnya serta dipisahkan dari jenis sampah lain agar pengelolaan sampah berjalan dengan baik dan lingkungan tetap bersih"
      },
      {
        "id": "pr-5-6",
        "title": "Jual Sampah Botol Plastik",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Insidental",
        "description": "kegiatan pengumpulan sampah botol plastik dan kardus yang masih memiliki nilai jual untuk kemudian dijual kepada pengepul atau pihak yang menerima barang bekas. PJ banin: Irsyad, PJ banat : Qori'",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "banin: Irsyad, PJ banat : Qori'"
      },
      {
        "id": "pr-5-7",
        "title": "Laporan Keuangan (internal)",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Insidental",
        "description": "Kegiatan penyusunan dan rekapitulasi laporan keuangan yang berasal dari hasil penjualan sampah botol plastik dan kardus. PJ : Putri",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "Putri"
      },
      {
        "id": "pr-5-8",
        "title": "Chek Kerapian Sandal Ketika Sholat 5 Waktu",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Insidental",
        "description": "PJ bertugas memastikan sandal tertata dengan rapi ketika sholat 5 waktu. PJ banin: Alim, PJ banat: Putri",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "bertugas memastikan sandal tertata dengan rapi ketika sholat 5 waktu"
      },
      {
        "id": "pr-5-9",
        "title": "Cheking Kerapian Rak Sepatu",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Insidental",
        "description": "kegiatan pengecekan dan penataan sepatu siswa-siswi pada rak yang telah disediakan. PJ bertugas memastikan sepatu tersusun dengan rapi, diletakkan sesuai tempatnya, serta tidak berserakan. PJ banin: Alim, PJ banat : Kayla.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "bertugas memastikan sepatu tersusun dengan rapi, diletakkan sesuai tempatnya, serta tidak berserakan"
      },
      {
        "id": "pr-5-10",
        "title": "Jogging/Senam",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Mingguan",
        "description": "Kegiatan ini dapat berupa jogging atau senam bersama setiap satu bulan sekali bergantian di hari minggu. PJ banin: Ghazy, PJ banat: qori'",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "banin: Ghazy, PJ banat: qori'"
      },
      {
        "id": "pr-5-11",
        "title": "Cheking Diri (TB, BB, Tensi)",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Bulanan",
        "description": "kegiatan pemeriksaan kondisi fisik siswa-siswi yang meliputi pengukuran tinggi badan (TB), berat badan (BB), dan tekanan darah (tensi). kegiatan ini dilakukan setiap bulan yang dipandu oleh semua anggota kebersihan. PJ banin: Ghazy, PJ banat: Kayla",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri.",
        "personInCharge": "banin: Ghazy, PJ banat: Kayla"
      },
      {
        "id": "pr-5-12",
        "title": "Lomba menghias kelas (Devisi pendidikan & Kebersihan)",
        "target": "Kesehatan & Kebersihan",
        "frequency": "Semesteran",
        "description": "Program kerja kolaborasi antara Divisi Pendidikan dan Divisi Kebersihan. Dalam kegiatan ini, setiap kelas berpartisipasi menghias dan menata ruang kelas secara kreatif dengan tetap memperhatikan kebersihan, kerapian, serta fungsi fasilitas kelas. Kegiatan dilaksanakan di akhir semester.",
        "expectedOutput": "Program terlaksana secara konsisten, amanah, dan berdampak positif bagi seluruh santri."
      }
    ]
  }
];

export const OSIS_EVENTS: OsisArticleEvent[] = [
  {
    "id": "evt-pemilihan-ketua-osis-2026",
    "slug": "pemilihan-ketua-osis-2026",
    "title": "Pemilihan Ketua OSIS SMP Plus Jauharul Maknuun Masa Bakti 2026/2027",
    "date": "13 Oktober 2026",
    "bannerUrl": "https://gzijnybcmhectajfkdtd.supabase.co/storage/v1/object/public/cms-images/osis/pemilihan-ketua-osis-2026.webp",
    "summary": "Pesta demokrasi santri dalam menentukan nahkoda baru OSIS masa bakti 2026/2027 yang jujur, amanah, dan berakhlakul karimah.",
    "author": "Panitia Pemilos & Humas OSIS",
    "category": "Demokrasi & Kepemimpinan",
    "tags": [
      "Pemilihan Ketua OSIS",
      "Demokrasi Santri",
      "Kepemimpinan",
      "SMP Plus JM"
    ],
    "sloganQuote": "Pemimpin yang amanah bukanlah yang menuntut ditaati, melainkan yang memberi keteladanan dengan kerendahan hati.",
    "content": "Pemilihan Ketua Organisasi Siswa Intra Sekolah (OSIS) SMP Plus Jauharul Maknuun masa bakti 2026/2027 merupakan salah satu kegiatan penting dalam menumbuhkan jiwa kepemimpinan, tanggung jawab, serta nilai-nilai demokrasi di lingkungan sekolah.\n\nKegiatan yang dilaksanakan pada tanggal 13 Oktober 2026 ini diikuti oleh seluruh siswa-siswi, dewan guru, serta karyawan SMP Plus Jauharul Maknuun yang turut berpartisipasi dalam menyukseskan proses pemilihan ketua OSIS.\n\nMelalui kegiatan ini, seluruh warga sekolah diberikan kesempatan untuk menggunakan hak pilihnya dalam menentukan sosok pemimpin yang diharapkan mampu membawa OSIS menjadi organisasi yang lebih aktif, kreatif, inovatif, dan bertanggung jawab.\n\nPemilihan ketua OSIS bukan hanya sekadar menentukan seorang pemimpin, tetapi juga menjadi sarana pembelajaran demokrasi secara langsung. Para siswa diajarkan untuk menghargai perbedaan pendapat, menjunjung tinggi kejujuran, serta menerima hasil keputusan dengan sikap sportif dan penuh tanggung jawab.\n\nDengan penuh semangat dan antusiasme, seluruh warga sekolah berpartisipasi aktif dalam kegiatan ini sebagai bentuk dukungan terhadap keberlangsungan organisasi OSIS di SMP Plus Jauharul Maknuun.\n\nSiapa pun yang terpilih nantinya, diharapkan mampu menjalankan amanah dengan penuh keikhlasan, mengutamakan kepentingan bersama, serta menjadikan OSIS sebagai wadah yang membawa inspirasi dan kemajuan nyata bagi civitas akademika SMP Plus Jauharul Maknuun."
  },
  {
    "id": "evt-pelantikan-pengurus-osis-2026",
    "slug": "pelantikan-pengurus-osis-2026",
    "title": "Pelantikan Pengurus OSIS Masa Bakti 2026/2027 & Penyerahan Kenang-Kenangan",
    "date": "Oktober 2026",
    "bannerUrl": "https://gzijnybcmhectajfkdtd.supabase.co/storage/v1/object/public/cms-images/osis/pelantikan-pengurus-osis-2026.webp",
    "summary": "Prosesi khidmat serah terima jabatan pengurus OSIS 2026/2027 serta penyerahan cinderamata tanda khidmah kepada Kepala Sekolah.",
    "author": "Presidium Inti & Dewan Pembina OSIS",
    "category": "Serah Terima Jabatan",
    "tags": [
      "Pelantikan OSIS",
      "Masa Bakti 2026/2027",
      "Serah Terima Jabatan",
      "Khidmah Santri"
    ],
    "sloganQuote": "Setiap Masa Ada Pemimpinnya, Setiap Pemimpin Ada Masanya. Namun, Semangat Pengabdian dan Kebersamaan Akan Selalu Abadi.",
    "content": "Pelantikan Pengurus OSIS SMP Plus Jauharul Maknuun masa bakti 2026/2027 menjadi penanda resmi dimulainya estafet kepemimpinan baru di lingkungan sekolah.\n\nDalam prosesi khidmat yang disaksikan oleh segenap dewan guru dan seluruh santri, pengurus OSIS masa bakti 2025/2026 menyerahkan kenang-kenangan dan cinderamata kepada Kepala SMP Plus Jauharul Maknuun, Ustadzah Ferany Ardiana, S.S., M.Pd.\n\nPenyerahan kenang-kenangan ini merupakan bentuk rasa terima kasih, penghormatan, dan apresiasi mendalam dari pengurus demisioner kepada pihak sekolah, dewan guru, dan pembina yang telah membimbing selama satu tahun masa kepengurusan.\n\nMomen ini bukan sekadar penyerahan simbolis, melainkan wujud rasa syukur atas kebersamaan, persaudaraan, dan pengabdian yang telah terukir indah. Berakhirnya masa bakti bukan berarti berakhir pula semangat untuk berkarya, melainkan menjadi bekal berharga untuk terus berkontribusi di masa depan.\n\nKepada pengurus OSIS masa bakti 2026/2027, selamat mengemban amanah baru. Semoga mampu melanjutkan program-program unggulan, menghadirkan inovasi, serta membawa OSIS SMP Plus Jauharul Maknuun semakin berprestasi di kancah regional dan nasional."
  },
  {
    "id": "evt-cek-kesehatan-berkala-2026",
    "slug": "cek-kesehatan-berkala-2026",
    "title": "Program Kerja Cek Kesehatan Berkala OSIS SMP Plus Jauharul Maknuun",
    "date": "Rutin Awal Bulan",
    "bannerUrl": "https://gzijnybcmhectajfkdtd.supabase.co/storage/v1/object/public/cms-images/osis/proker-cek-kesehatan-2026.webp",
    "summary": "Pemeriksaan rutin tekanan darah (tensi) dan penimbangan berat badan santri untuk menjaga kebugaran jasmani dan ketenangan belajar.",
    "author": "Divisi Kebersihan dan Kesehatan OSIS",
    "category": "Kesehatan & Lingkungan",
    "tags": [
      "Cek Kesehatan",
      "Kebugaran Santri",
      "Tensi & Berat Badan",
      "Pencegahan Dini"
    ],
    "sloganQuote": "Sehat Tubuhnya, Semangat Belajarnya, Cerah Masa Depannya.",
    "content": "Kesehatan merupakan salah satu aspek paling fundamental dalam menunjang keberhasilan belajar dan aktivitas sehari-hari santri di lingkungan pesantren dan sekolah.\n\nOleh karena itu, Divisi Kebersihan dan Kesehatan OSIS SMP Plus Jauharul Maknuun menghadirkan program kerja Cek Kesehatan Berkala yang dilaksanakan secara disiplin setiap awal bulan.\n\nProgram ini mencakup pemeriksaan tekanan darah (tensi) serta penimbangan berat badan bagi seluruh siswa-siswi. Kegiatan ini bertujuan untuk meningkatkan kesadaran akan pentingnya menjaga kebugaran tubuh, memantau kondisi fisik secara berkala, serta menumbuhkan kebiasaan hidup bersih dan sehat (PHBS) sejak dini.\n\nMelalui pemeriksaan rutin ini, para santri diajak untuk lebih peka terhadap kondisi tubuhnya, menjaga pola makan bergizi seimbang, cukup beristirahat, dan rutin berolahraga.\n\nOSIS berkomitmen bahwa menjaga kesehatan bukan hanya saat tubuh merasa lelah atau sakit, melainkan melalui langkah preventif dan pemantauan berkala yang berkesinambungan demi mendukung kenyamanan ibadah dan belajar."
  },
  {
    "id": "evt-jm-got-talent-2026",
    "slug": "jm-got-talent-2026",
    "title": "JM Got Talent - Wadah Unjuk Kreativitas & Prestasi Santri (Hari Santri Nasional)",
    "date": "22 Oktober 2026",
    "bannerUrl": "https://gzijnybcmhectajfkdtd.supabase.co/storage/v1/object/public/cms-images/osis/jm-got-talent-2026.webp",
    "summary": "Panggung akbar eksplorasi minat, bakat seni, sastra, sains, dan kebolehan santri memperingati Hari Santri Nasional.",
    "author": "Divisi Pendidikan & Kreativitas OSIS",
    "category": "Pentas Seni & Bakat",
    "tags": [
      "JM Got Talent",
      "Hari Santri Nasional",
      "Kreativitas",
      "Pentas Seni"
    ],
    "sloganQuote": "Wadah Berkarya, Tempat Berprestasi, Ruang untuk Bersinar!",
    "content": "JM Got Talent merupakan program kerja unggulan OSIS SMP Plus Jauharul Maknuun yang hadir sebagai panggung inspiratif bagi seluruh santri untuk mengenali, mengasah, dan menampilkan bakat terbaiknya.\n\nDiselenggarakan bertepatan dengan momentum peringatan Hari Santri Nasional pada tanggal 22 Oktober 2026, ajang ini memberikan ruang ekspresi yang luas di bidang seni Islam, musik hadrah, sastra puisi, pidato multibahasa, ketangkasan bela diri, serta kreasi sains terapan.\n\nKegiatan ini bukan semata-mata tentang kompetisi memperebutkan juara, melainkan tentang membangun rasa percaya diri santri untuk berani tampil di depan publik, memupuk sportivitas, serta menumbuhkan sikap saling mengapresiasi karya antarsaudara santri.\n\nMelalui JM Got Talent, OSIS meyakini bahwa setiap santri memiliki keunikan dan potensi emas yang patut dirawat dan disinari. Ajang ini menjadi bukti nyata bahwa santri pesantren tidak hanya tangguh dalam membaca kitab kuning dan tahfidz Al-Qur'an, tetapi juga kreatif, adaptif, dan berdaya saing tinggi dalam karya-karya seni bernilai luhur."
  }
];
