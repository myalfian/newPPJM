export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  thumbnail: string;
  is_pinned?: boolean;
  is_published?: boolean;
  author?: string;
  created_at?: string;
  date_display?: string;
}

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Haflah Khotmil Qur’an 30 Juz & Wisuda Purna Studi PPJM 2025',
    slug: 'haflah-khotmil-quran-30-juz-wisuda-purna-studi-ppjm-2025',
    category: 'Agenda Akbar',
    summary: 'Momen khidmat pelepasan santri purna studi dan wisuda khotmil qur’an 30 juz dihadiri para masyayikh dan ribuan wali santri di halaman utama pesantren.',
    content: `Alhamdulillah, Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik telah sukses menyelenggarakan Haflah Khotmil Qur'an 30 Juz dan Wisuda Purna Studi Santri.

Acara yang berlangsung khidmat di halaman utama pesantren ini dihadiri oleh para masyayikh, dewan asatidz, serta ribuan wali santri yang datang dari berbagai penjuru tanah air.

Rangkaian acara diawali dengan simaan bil ghoib 30 juz oleh para calon wisudawan tahfidz, dilanjutkan prosesi penyerahan syahadah sanad muttashil Al-Qur'an dan pengalungan medali kelulusan.

Dalam mauidhoh hasanahnya, Pengasuh berpesan agar para santri senantiasa menjaga hafalan Al-Qur'an dan mengamalkan ilmu syariat dalam kehidupan bermasyarakat dengan mengedepankan akhlakul karimah.`,
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    is_pinned: true,
    is_published: true,
    author: 'Humas PPJM',
    created_at: '2025-06-20T08:00:00Z',
    date_display: '20 Juni 2025'
  },
  {
    id: 'news-2',
    title: 'Santri PPJM Juara 1 Musabaqah Qira’atil Kutub Tingkat Provinsi',
    slug: 'santri-ppjm-juara-1-musabaqah-qiraatil-kutub-tingkat-provinsi',
    category: 'Prestasi Santri',
    summary: 'Prestasi membanggakan diraih santri PPJM dalam membaca dan memahami kitab kuning Fathul Qorib pada ajang MQK se-Jawa Timur.',
    content: `Keluarga besar Pondok Pesantren Jauharul Maknuun kembali menorehkan prestasi gemilang di kancah keilmuan Islam. Santri delegasi PPJM berhasil meraih Juara 1 pada ajang Musabaqah Qira'atil Kutub (MQK) Tingkat Provinsi Jawa Timur untuk marhalah Wustho bidang Fiqih kitab Fathul Qorib.

Keberhasilan ini membuktikan komitmen PPJM dalam melestarikan tradisi keilmuan turats pesantren salaf dengan sanad keilmuan yang bersambung dan penguasaan gramatika nahwu-shorof yang mendalam.

Semoga prestasi ini membawa keberkahan dan memotivasi seluruh santri untuk semakin tekun dalam mengkaji ilmu syariat.`,
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    is_pinned: false,
    is_published: true,
    author: 'Bagian Akademik & Litbang PPJM',
    created_at: '2025-03-12T09:30:00Z',
    date_display: '12 Maret 2025'
  },
  {
    id: 'news-3',
    title: 'Peluncuran Laboratorium Robotika & Otomasi IoT Santri Lasem',
    slug: 'peluncuran-laboratorium-robotika-otomasi-iot-santri-lasem',
    category: 'Inovasi STEM',
    summary: 'Pesantren meresmikan pusat riset teknologi aplikatif guna melatih santri menciptakan solusi otomasi hidroponik dan sistem tenaga surya.',
    content: `Sebagai langkah strategis mempersiapkan santri menghadapi era kecerdasan buatan dan industri masa depan, PPJM secara resmi meresmikan Laboratorium Robotika & Otomasi IoT Santri.

Fasilitas baru ini dilengkapi mikrokontroler ESP32, sensor-sensor agrikultur canggih, modul panel surya mini, serta perangkat praktikum elektronika ramah santri.

Melalui program integrasi STEM ini, para santri diajarkan merancang sistem penyiraman otomatis untuk pertanian hidroponik pesantren dan pemantauan kualitas air kolam bioflok secara real-time.`,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    is_pinned: false,
    is_published: true,
    author: 'Tim Riset & STEM PPJM',
    created_at: '2025-01-10T10:15:00Z',
    date_display: '10 Januari 2025'
  }
];
