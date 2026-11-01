export interface KaryaSiswaItem {
  id: string;
  title: string;
  category: 'buku' | 'batik' | 'video-lagu-batik' | 'video-lagu-ustad' | 'showroom';
  author: string;
  authorRole: string; // e.g. "Santri Kelas IX SMP Plus JM", "Divisi Seni & Budaya PPJM"
  year: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string; // YouTube embed URL
  specs?: Record<string, string>;
  tags: string[];
  pdfUrl?: string;
  orderIndex: number;
}

export const KARYA_SISWA_ITEMS: KaryaSiswaItem[] = [
  // 1. Flyer Buku buatan Santri
  {
    id: 'karya-buku-1',
    title: 'Buku Bunga Rampai: Mengakar di Salaf, Menjulang di Sains',
    category: 'buku',
    author: 'Ahmad Zaki, Hilmi Abdullah & Tim Penulis Santri',
    authorRole: 'Santri SMP Plus & Madrasah Diniyah PPJM',
    year: '2026',
    description: 'Kumpulan antologi esai, refleksi pemikiran kitab turats, dan riset sains terapan yang ditulis orisinal oleh santri PP. Jauharul Maknuun Lasem. Diterbitkan dengan standar tata cetak ber-ISBN.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Tebal Halaman': '220 Halaman Bookpaper',
      'Penerbit': 'Maknuun Press Publisher',
      'ISBN': '978-623-00-1452-9',
      'Kurasi': 'Dewan Asatidz & Tim Literasi Santri'
    },
    tags: ['Buku Santri', 'Antologi Esai', 'Literasi Pesantren', 'Karya Cetak'],
    orderIndex: 1
  },
  {
    id: 'karya-buku-2',
    title: 'Risalah Fiqh Kontemporer & Etika Digital Santri',
    category: 'buku',
    author: 'Keluarga Santri Diniyah Tingkat Ulya',
    authorRole: 'Madrasah Diniyah Jauharul Maknuun',
    year: '2025',
    description: 'Panduan fiqh tematik dalam menavigasi etika bersosial media, adab digital santri, serta telaah hukum modern disarikan langsung dari rujukan kitab-kitab muktabarah.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Tebal Halaman': '165 Halaman',
      'Format': 'Buku Saku & E-Book',
      'Bahasa': 'Indonesia & Arab Pegon'
    },
    tags: ['Fiqh Digital', 'Buku Saku', 'Karya Santri'],
    orderIndex: 2
  },

  // 2. Katalog Batik buatan Santri
  {
    id: 'karya-batik-1',
    title: 'Katalog Batik Tulis Lasem: Motif "Sekar Jagad Maknuun"',
    category: 'batik',
    author: 'Klub Kriya & Batik Santri Putri PPJM',
    authorRole: 'Sanggar Seni Budaya & Kriya Pesantren',
    year: '2026',
    description: 'Karya batik tulis canting halus khas pesisir Lasem yang memadukan ornamen flora lokal, kaligrafi kufi doa keselamatan, dan warna klasik khas tanah pesisiran (merah getih pitik dan hijau tosca).',
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Bahan Kain': 'Katun Primissima Halus 100%',
      'Pewarnaan': 'Pewarna Alami Ekstrak Kulit Kayu & Daun',
      'Teknik': 'Batik Tulis Canting Halus 2 Muka',
      'Ukuran': '240 cm x 115 cm'
    },
    tags: ['Batik Tulis Lasem', 'Kriya Tradisional', 'Produk Santri', 'Batik Halus'],
    orderIndex: 3
  },
  {
    id: 'karya-batik-2',
    title: 'Katalog Selendang Sutra Batik: Motif "Kuping Gajah Salafy"',
    category: 'batik',
    author: 'Santri Ekstrakurikuler Membatik',
    authorRole: 'Divisi Vokasi & Keterampilan Santri',
    year: '2025',
    description: 'Selendang sutra premium dengan guratan canting motif pesisiran Lasem berpadu sentuhan modern, merepresentasikan identitas santri yang luwes dan anggun.',
    imageUrl: 'https://images.unsplash.com/photo-1528458876885-5b6eeb83d128?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Bahan': 'Sutra ATBM Halus',
      'Teknik': 'Kombinasi Cap & Canting Tulis',
      'Ukuran': '200 cm x 60 cm'
    },
    tags: ['Batik Tulis', 'Selendang Sutra', 'Karya Santri'],
    orderIndex: 4
  },

  // 3. Video Lagu Batik
  {
    id: 'karya-video-batik',
    title: 'Video Klip Lagu Resmi: Harmoni Canting Lasem (Kidung Batik Santri)',
    category: 'video-lagu-batik',
    author: 'Paduan Suara & Orkestra Musik Akustik Santri PPJM',
    authorRole: 'Unit Kesenian Musik Religi & Hadroh PPJM',
    year: '2026',
    description: 'Lagu ciptaan santri yang mendendangkan filosofi ketekunan membatik di bumi Lasem. Setiap bait sarat akan doa, tawadhu, dan ketelitian melukis malam di atas lembaran kain mori.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Komposer': 'Tim Musik Santri PPJM',
      'Arrangement': 'Akustik Tradisional & Gambus Modern',
      'Durasi': '04:18 Menit',
      'Kualitas Audio': 'Stereo Studio Master 24-bit'
    },
    tags: ['Lagu Batik', 'Video Klip', 'Musik Religi', 'Lagu Orisinal Santri'],
    orderIndex: 5
  },

  // 4. Video Lagu untuk Ustad Shobirin
  {
    id: 'karya-video-ustad',
    title: 'Gita Mahabbah: Dedikasi & Doa Santri untuk Ustadz Shobirin',
    category: 'video-lagu-ustad',
    author: 'Seluruh Santri & Alumni PP. Jauharul Maknuun',
    authorRole: 'Persembahan Khidmat Takzim Santri',
    year: '2026',
    description: 'Karya lagu persembahan penuh rasa syukur, takzim, dan cinta santri kepada Ustadz Shobirin atas bimbingan keteladanan akhlak, ketulusan ilmu, dan kesabaran membina ruhani para santri.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Dedikasi': 'Ustadz Shobirin (Pembina & Asatidz PPJM)',
      'Lirik': 'Perwakilan Santriwati & Santriwan',
      'Format': 'Video Musik Sinematik 4K',
      'Durasi': '05:05 Menit'
    },
    tags: ['Lagu Ustadz Shobirin', 'Gita Mahabbah', 'Takzim Guru', 'Lagu Persembahan'],
    orderIndex: 6
  },

  // 5. Show Room Santri Lainnya (Robotik STEM, Kaligrafi, Riset & Seni)
  {
    id: 'karya-showroom-1',
    title: 'Prototipe STEM: Smart Greenhouse Irigasi Otomatis ESP32',
    category: 'showroom',
    author: 'Tim Laboratorium Sains & Robotik SMP Plus JM',
    authorRole: 'Klub STEM Inovasi Santri',
    year: '2026',
    description: 'Prototipe otomatisasi penyiraman dan pemantauan suhu rumah hijau pesantren terintegrasi sensor kelembaban tanah dan dashboard seluler mandiri.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Mikrokontroler': 'ESP32 38-Pin Wi-Fi/Bluetooth',
      'Sensor': 'Capacitive Soil Moisture + DHT22',
      'Prestasi': 'Juara 1 Lomba Inovasi Sains Terapan Jawa Tengah'
    },
    tags: ['Showroom STEM', 'Robotik', 'IoT Santri', 'Inovasi Teknologi'],
    orderIndex: 7
  },
  {
    id: 'karya-showroom-2',
    title: 'Koleksi Kaligrafi Kontemporer: Khath Tsuluts & Diwani Jali',
    category: 'showroom',
    author: 'Muhammad Farhan & Sanggar Khaththathun PPJM',
    authorRole: 'Divisi Kaligrafi Al-Qur\'an',
    year: '2025',
    description: 'Gubahan lukisan kaligrafi ayat suci Al-Qur\'an pada kanvas akrilik tekstur emas dengan kaidah murni Tsuluts dan Diwani Jali yang presisi.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Media': 'Kanvas Linen 120 x 80 cm',
      'Bahan Pewarna': 'Tinta Emas Jepang & Akrilik Premium',
      'Kaidah': 'Tsuluts Mutarokib & Diwani Jali'
    },
    tags: ['Kaligrafi Arab', 'Seni Islam', 'Karya Seni Santri'],
    orderIndex: 8
  },
  {
    id: 'karya-showroom-3',
    title: 'Miniatur Maket Pesantren Berkelanjutan Ramah Lingkungan',
    category: 'showroom',
    author: 'Santriwan Arsitektur & Lingkungan Hidup',
    authorRole: 'Proyek Kolaboratif Santri',
    year: '2025',
    description: 'Desain rancang bangun kompleks pondok pesantren mandiri energi dengan instalasi panel surya mikro, biopori resapan air hujan, dan pengolahan limbah organik santri.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    specs: {
      'Skala Maket': '1:100 Bahan Akrilik & Daur Ulang',
      'Fokus Riset': 'Eco-Pesantren & Green Boarding School'
    },
    tags: ['Maket Arsitektur', 'Eco-Pesantren', 'Showroom Santri'],
    orderIndex: 9
  }
];

