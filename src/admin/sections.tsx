import type { ElementType } from 'react';
import {
  Images, Zap, Share2, MessageSquareQuote, Newspaper, CalendarDays, Camera, Video, Trophy,
  BookOpen, GraduationCap, FileText, Users, Building, Languages, Type, FlaskConical, Rocket,
  ClipboardList, PartyPopper, Target, Network, Layers, HelpCircle,
} from 'lucide-react';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'select_array'
  | 'image'
  | 'gallery_photos'
  | 'url'
  | 'number'
  | 'bool'
  | 'date'
  | 'lines'
  | 'json'
  | 'rich';

export interface Field {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  required?: boolean;
  /** Ditaruh di bagian "Pengaturan lanjutan" supaya form utama tetap sederhana. */
  advanced?: boolean;
  help?: string;
  placeholder?: string;
  defaultValue?: unknown;
}

export type NavGroupKey = 'Content' | 'Akademik' | 'Publikasi' | 'Manajemen';

export interface CrudSection {
  /** Dipakai sebagai kunci izin (role_permissions.section) dan URL /admin/s/:key */
  key: string;
  table: string;
  label: string;
  group: NavGroupKey;
  icon: ElementType;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  badgeField?: string;
  /** Kolom urutan; jika ada, baris bisa digeser dengan drag. */
  orderField?: string;
  /** Kolom boolean yang menampilkan/menyembunyikan baris di website. */
  activeField?: string;
  sort: { col: string; asc: boolean };
  fields: Field[];
  /** Isi kolom slug otomatis dari field ini jika kosong. */
  slugFrom?: string;
  /** Isi kolom ini dengan id pengguna yang menambahkan data. */
  authorField?: string;
  /** Kolom timestamp yang diisi saat pertama kali diterbitkan. */
  publishedAtField?: string;
}

export const GALERI_CATEGORY_OPTIONS = [
  'Tahfidz & Wisuda',
  'Kajian Turats',
  'Inovasi STEM',
  'Peringatan Hari Besar',
  'Pengembangan Diri',
  'Akademik Salaf',
  'Kegiatan Pondok',
  'Fasilitas & Asrama',
  'Prestasi & Lomba',
  'Ekstrakurikuler',
  'Kunjungan & Tamu',
  'Umum',
];

export const GALERI_LOCATION_OPTIONS = [
  'Aula Utama PP. Jauharul Maknuun',
  'Masjid Jami\' Jauharul Maknuun',
  'Gedung SMP Plus Jauharul Maknuun',
  'Laboratorium Sains & Robotika STEM',
  'Asrama Putra & Putri PPJM',
  'Perpustakaan & Ruang Turats',
  'Lapangan Utama Pondok Pesantren',
  'Lingkungan Pondok Pesantren Lasem',
  'Beranda & Galeri (Utama)',
  'Halaman Galeri Foto',
  'Halaman Beranda (Home)',
];

export const BERITA_CATEGORY_OPTIONS = [
  'Berita Pondok',
  'Prestasi Santri',
  'Akademik & Kurikulum',
  'Tahfidz & Diniyah',
  'Inovasi STEM',
  'Pengumuman Resmi',
  'Kunjungan & Kerjasama',
  'Opini & Kajian',
];

export const CRUD_SECTIONS: CrudSection[] = [
  // ───────── CONTENT
  {
    key: 'sliders', table: 'sliders', label: 'Slider Beranda', group: 'Content', icon: Images,
    titleField: 'title', subtitleField: 'badge_tag', imageField: 'image_url',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true },
      { key: 'badge_tag', label: 'Label kecil', kind: 'text' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image', required: true },
      { key: 'cta_text', label: 'Teks tombol', kind: 'text' },
      { key: 'cta_link', label: 'Tautan tombol', kind: 'url' },
    ],
  },
  {
    key: 'quick_menus', table: 'quick_menus', label: 'Menu Cepat', group: 'Content', icon: Zap,
    titleField: 'label', subtitleField: 'link', orderField: 'order_index', activeField: 'is_active',
    sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'label', label: 'Nama menu', kind: 'text', required: true },
      { key: 'icon', label: 'Nama ikon', kind: 'text', help: 'Nama ikon yang sudah dipakai website, mis. BookOpen', defaultValue: 'BookOpen' },
      { key: 'link', label: 'Tautan', kind: 'url', required: true, defaultValue: '/' },
    ],
  },
  {
    key: 'kontak_medsos', table: 'kontak_medsos', label: 'Kontak & Media Sosial', group: 'Content', icon: Share2,
    titleField: 'label', subtitleField: 'url', imageField: 'icon_url', badgeField: 'type',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'label', label: 'Nama', kind: 'text', required: true },
      { key: 'type', label: 'Jenis', kind: 'select', options: ['whatsapp', 'instagram', 'youtube', 'facebook', 'tiktok', 'email', 'maps', 'website'], defaultValue: 'whatsapp' },
      { key: 'url', label: 'Tautan', kind: 'url', required: true },
      { key: 'icon_url', label: 'Ikon (opsional)', kind: 'image' },
      { key: 'bg_color', label: 'Warna latar', kind: 'text', placeholder: '#115E59', advanced: true },
    ],
  },
  {
    key: 'sambutan_persons', table: 'sambutan_persons', label: 'Sambutan', group: 'Content', icon: MessageSquareQuote,
    titleField: 'name', subtitleField: 'title', imageField: 'photo_url', badgeField: 'role_type',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'name', label: 'Nama', kind: 'text', required: true },
      { key: 'title', label: 'Jabatan', kind: 'text', required: true },
      { key: 'role_type', label: 'Jenis Jabatan', kind: 'select', options: ['pengasuh', 'kepala_sekolah', 'ketua_yayasan', 'mudir_madin'], defaultValue: 'pengasuh' },
      { key: 'location', label: 'Lokasi Tampil', kind: 'select_array', options: ['Beranda & JM Center', 'Halaman Beranda (Home)', 'Halaman Profil (JM Center)'] },
      { key: 'photo_url', label: 'Foto Pimpinan (Otomatis WebP)', kind: 'image' },
      { key: 'message_short', label: 'Sambutan singkat', kind: 'textarea' },
      { key: 'message_full', label: 'Sambutan lengkap', kind: 'rich' },
      { key: 'is_featured', label: 'Tampilkan sebagai utama', kind: 'bool' },
    ],
  },
  {
    key: 'sub_items', table: 'sub_items', label: 'Pilar Keunggulan & Kategori', group: 'Content', icon: Layers,
    titleField: 'title', subtitleField: 'description', imageField: 'image_url', badgeField: 'parent_module',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul item / keunggulan', kind: 'text', required: true },
      { key: 'parent_module', label: 'Modul induk', kind: 'select', options: ['keunggulan_items', 'facilities_categories'], required: true, help: 'Pilih keunggulan_items untuk 8 Pilar Keunggulan Beranda, atau facilities_categories untuk Kategori Fasilitas' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'icon', label: 'Nama ikon', kind: 'text', placeholder: 'BookOpen, Cpu, Globe, HeartHandshake…' },
      { key: 'color', label: 'Tema warna', kind: 'select', options: ['emerald', 'gold', 'teal', 'blue', 'amber', 'purple'], defaultValue: 'emerald' },
      { key: 'image_url', label: 'Gambar (opsional)', kind: 'image' },
      { key: 'data', label: 'Data tambahan (JSON)', kind: 'json', advanced: true },
    ],
  },
  // ───────── PUBLIKASI
  {
    key: 'berita', table: 'berita', label: 'Berita', group: 'Publikasi', icon: Newspaper,
    titleField: 'title', subtitleField: 'excerpt', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_published', sort: { col: 'created_at', asc: false },
    slugFrom: 'title', authorField: 'author_id', publishedAtField: 'published_at',
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: BERITA_CATEGORY_OPTIONS, defaultValue: 'Berita Pondok' },
      { key: 'location', label: 'Lokasi Penayangan', kind: 'select_array', options: ['Beranda & Berita (Utama)', 'Halaman Berita', 'Siaran Pers (Press Release)'] },
      { key: 'excerpt', label: 'Ringkasan', kind: 'textarea' },
      { key: 'image_url', label: 'Gambar utama (Otomatis WebP)', kind: 'image' },
      { key: 'content', label: 'Isi berita', kind: 'rich', required: true },
      { key: 'slug', label: 'Alamat (slug)', kind: 'text', advanced: true, help: 'Kosongkan agar dibuat otomatis dari judul' },
    ],
  },
  {
    key: 'agendas', table: 'agendas', label: 'Agenda', group: 'Publikasi', icon: CalendarDays,
    titleField: 'title', subtitleField: 'date_display', imageField: 'image', badgeField: 'category',
    sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Nama kegiatan', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kegiatan Akbar', 'Akademik & Ujian', 'Tahfidz & Haflah', 'Kajian Rutin', 'Peringatan Hari Besar', 'Lomba & Ekspo', 'Rapat & Wali Santri'], defaultValue: 'Kegiatan Akbar' },
      { key: 'badge', label: 'Label', kind: 'text', defaultValue: 'Agenda Resmi' },
      { key: 'date_display', label: 'Tanggal (teks tampilan)', kind: 'text', placeholder: '12 Januari 2026', defaultValue: '20 Juni 2026' },
      { key: 'time_display', label: 'Waktu', kind: 'text', defaultValue: '08.00 - 11.30 WIB' },
      { key: 'location', label: 'Lokasi Kegiatan', kind: 'select', options: GALERI_LOCATION_OPTIONS.slice(0, 8), defaultValue: 'Aula Utama PP. Jauharul Maknuun' },
      { key: 'coordinator', label: 'Penanggung jawab', kind: 'text', defaultValue: 'Panitia Pondok Pesantren' },
      { key: 'target_audience', label: 'Sasaran', kind: 'select', options: ['Seluruh Santri & Wali Santri', 'Santri Putra & Putri', 'Dewan Asatidz & Guru', 'Umum & Masyarakat'], defaultValue: 'Seluruh Santri & Wali Santri' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'image', label: 'Gambar (Otomatis WebP)', kind: 'image' },
      { key: 'month', label: 'Bulan', kind: 'text', advanced: true, defaultValue: 'Juni' },
      { key: 'year', label: 'Tahun', kind: 'text', advanced: true, defaultValue: '2026' },
      { key: 'timeline_status', label: 'Status', kind: 'select', options: ['upcoming', 'ongoing', 'completed'], advanced: true, defaultValue: 'upcoming' },
      { key: 'rundown', label: 'Rundown (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'galeri_foto', table: 'galeri_foto', label: 'Galeri Foto', group: 'Publikasi', icon: Camera,
    titleField: 'title', subtitleField: 'description', imageField: 'image_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul Kegiatan / Album', kind: 'text', required: true, placeholder: 'Mis: Haflah Akhirussanah & Wisuda Tahfidz 30 Juz' },
      {
        key: 'category',
        label: 'Kategori Kegiatan',
        kind: 'select',
        options: GALERI_CATEGORY_OPTIONS,
        required: true,
        defaultValue: 'Tahfidz & Wisuda',
        help: 'Pilih kategori dokumentasi untuk filter otomatis di halaman Galeri Foto',
      },
      {
        key: 'location',
        label: 'Lokasi Kegiatan & Penayangan',
        kind: 'select_array',
        options: GALERI_LOCATION_OPTIONS,
        required: true,
        defaultValue: ['Aula Utama PP. Jauharul Maknuun', 'home', 'galeri'],
        help: 'Pilih lokasi tempat kegiatan berlangsung / penayangan halaman',
      },
      { key: 'event_date', label: 'Tanggal Kegiatan', kind: 'text', placeholder: 'Mis: 20 Juni 2026' },
      { key: 'description', label: 'Keterangan / Deskripsi Dokumentasi', kind: 'textarea', placeholder: 'Tuliskan ringkasan suasana atau momen kegiatan…' },
      {
        key: 'image_url',
        label: 'Foto Utama / Sampul (Otomatis Convert WebP Light)',
        kind: 'image',
        required: true,
        help: 'Foto yang diunggah otomatis dikonversi ke format WebP ringan (hemat hingga 85% ukuran file).',
      },
      {
        key: 'photos',
        label: '3 Foto Slider Kegiatan (Slide 1, 2 & 3 - Otomatis WebP)',
        kind: 'gallery_photos',
        help: 'Unggah hingga 3 foto untuk animasi slider di halaman Galeri & Lightbox. Semua foto otomatis dioptimasi ke WebP.',
      },
      { key: 'is_featured', label: 'Tampilkan sebagai unggulan', kind: 'bool' },
    ],
  },
  {
    key: 'galeri_videos', table: 'galeri_videos', label: 'Galeri Video', group: 'Publikasi', icon: Video,
    titleField: 'title', subtitleField: 'youtube_url', imageField: 'thumbnail_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Profil Resmi', 'Tahfidz & Haflah', 'Kajian Kitab', 'Inovasi STEM', 'Kegiatan Santri', 'Dokumentasi'], defaultValue: 'Dokumentasi' },
      { key: 'description', label: 'Keterangan', kind: 'textarea' },
      { key: 'youtube_url', label: 'Tautan YouTube', kind: 'url', required: true },
      { key: 'thumbnail_url', label: 'Gambar sampul (Otomatis WebP)', kind: 'image' },
      { key: 'is_featured', label: 'Tampilkan unggulan', kind: 'bool' },
    ],
  },
  {
    key: 'prestasi', table: 'prestasi', label: 'Prestasi', group: 'Publikasi', icon: Trophy,
    titleField: 'title', subtitleField: 'santri_name', imageField: 'photo_url', badgeField: 'level',
    sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Nama prestasi', kind: 'text', required: true },
      { key: 'santri_name', label: 'Nama santri', kind: 'text', required: true },
      { key: 'category', label: 'Bidang', kind: 'select', options: ['Tahfidz & Tilawah', 'Kitab Kuning (MQK)', 'Sains & Robotik', 'Bahasa Arab & Inggris', 'Bahasa Mandarin', 'Olahraga & Seni'], defaultValue: 'Sains & Robotik' },
      { key: 'level', label: 'Tingkat', kind: 'select', options: ['Kabupaten', 'Karesidenan', 'Provinsi', 'Nasional', 'Internasional'], defaultValue: 'Nasional' },
      { key: 'location', label: 'Lokasi Penyelenggaraan', kind: 'select_array', options: ['Tingkat Nasional & Beranda', 'Tingkat Provinsi Jawa Tengah', 'Kabupaten Rembang - Lasem', 'Beranda & Halaman Prestasi'] },
      { key: 'organizer', label: 'Penyelenggara', kind: 'text' },
      { key: 'pembina_name', label: 'Pembina', kind: 'text' },
      { key: 'year', label: 'Tahun', kind: 'number', defaultValue: 2026 },
      { key: 'photo_url', label: 'Foto (Otomatis WebP)', kind: 'image' },
      { key: 'certificate_url', label: 'Sertifikat (Otomatis WebP)', kind: 'image' },
    ],
  },
  // ───────── AKADEMIK
  {
    key: 'programs_pondok', table: 'programs_pondok', label: 'Program Pondok', group: 'Akademik', icon: BookOpen,
    titleField: 'title', subtitleField: 'description', activeField: 'is_active', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'title', label: 'Nama program', kind: 'text', required: true },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'schedule', label: 'Jadwal (JSON Array)', kind: 'json', defaultValue: [] },
      { key: 'images', label: 'Foto (satu tautan per baris)', kind: 'lines' },
    ],
  },
  {
    key: 'programs_sekolah', table: 'programs_sekolah', label: 'Program Sekolah', group: 'Akademik', icon: GraduationCap,
    titleField: 'title', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'title', label: 'Nama program', kind: 'text', required: true },
      { key: 'curriculum', label: 'Kurikulum (JSON)', kind: 'json', advanced: true },
      { key: 'visual_story', label: 'Cerita visual (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'madin_flyers', table: 'madin_flyers', label: 'Flyer Madin', group: 'Akademik', icon: FileText,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', orderField: 'order_index',
    sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['kitab', 'tahfidz', 'kurikulum', 'jadwal', 'brosur'], defaultValue: 'kitab' },
      { key: 'image_url', label: 'Gambar flyer (Otomatis WebP)', kind: 'image', required: true },
      { key: 'pdf_url', label: 'Tautan PDF', kind: 'url' },
    ],
  },
  {
    key: 'ekskul', table: 'ekskul', label: 'Ekstrakurikuler', group: 'Akademik', icon: Users,
    titleField: 'name', subtitleField: 'instructor_name', badgeField: 'category', activeField: 'is_active',
    sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'name', label: 'Nama ekskul', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Sains & Teknologi', 'Seni Islami & Hadrah', 'Bahasa & Literasi', 'Olahraga & Bela Diri', 'Kewirausahaan & Media'], defaultValue: 'Sains & Teknologi' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'instructor_name', label: 'Pembina', kind: 'text' },
      { key: 'location', label: 'Lokasi Latihan', kind: 'select', options: GALERI_LOCATION_OPTIONS.slice(0, 8), defaultValue: 'Aula Utama PP. Jauharul Maknuun' },
      { key: 'schedule', label: 'Jadwal', kind: 'text' },
      { key: 'target', label: 'Sasaran', kind: 'text' },
      { key: 'images', label: 'Foto (satu tautan per baris)', kind: 'lines' },
      { key: 'syllabus', label: 'Silabus (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'institutions', table: 'institutions', label: 'Lembaga', group: 'Akademik', icon: Building,
    titleField: 'name', subtitleField: 'type', imageField: 'image_url', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'name', label: 'Nama lembaga', kind: 'text', required: true },
      { key: 'type', label: 'Jenis', kind: 'select', options: ['pondok', 'sekolah', 'madin', 'tahfidz'], defaultValue: 'pondok' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'curriculum', label: 'Kurikulum', kind: 'text' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image' },
    ],
  },
  {
    key: 'mandarin_lessons', table: 'mandarin_lessons', label: 'Materi Mandarin', group: 'Akademik', icon: Languages,
    titleField: 'topic', subtitleField: 'pinyin', imageField: 'cover_image', badgeField: 'level',
    orderField: 'order_index', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'topic', label: 'Topik', kind: 'text', required: true },
      { key: 'level', label: 'Level', kind: 'select', options: ['Dasar', 'Menengah', 'Lanjutan', 'HSK 1', 'HSK 2'], defaultValue: 'Dasar' },
      { key: 'hanzi', label: 'Hanzi', kind: 'text' },
      { key: 'pinyin', label: 'Pinyin', kind: 'text', defaultValue: '-' },
      { key: 'meaning_id', label: 'Arti (Indonesia)', kind: 'text', defaultValue: '-' },
      { key: 'cover_image', label: 'Gambar sampul (Otomatis WebP)', kind: 'image' },
      { key: 'audio_url', label: 'Tautan audio', kind: 'url' },
      { key: 'dialog_script', label: 'Dialog (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'mandarin_vocabularies', table: 'mandarin_vocabularies', label: 'Kosakata Mandarin', group: 'Akademik', icon: Type,
    titleField: 'hanzi', subtitleField: 'arti', badgeField: 'category', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'hanzi', label: 'Hanzi', kind: 'text', required: true },
      { key: 'pinyin', label: 'Pinyin', kind: 'text', required: true },
      { key: 'arti', label: 'Arti', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Salam & Sapaan', 'Kehidupan Asrama', 'Sekolah & Kelas', 'Angka & Waktu', 'Keluarga & Tokoh', 'Percakapan Harian'], defaultValue: 'Percakapan Harian' },
      { key: 'hsk_level', label: 'Level HSK', kind: 'select', options: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'], defaultValue: 'HSK 1' },
      { key: 'example_hanzi', label: 'Contoh kalimat (Hanzi)', kind: 'text' },
      { key: 'example_pinyin', label: 'Contoh kalimat (Pinyin)', kind: 'text' },
      { key: 'example_arti', label: 'Contoh kalimat (Arti)', kind: 'text' },
      { key: 'audio_url', label: 'Tautan audio', kind: 'url' },
    ],
  },
  {
    key: 'mandarin_quizzes', table: 'mandarin_quizzes', label: 'Kuis Mandarin', group: 'Akademik', icon: HelpCircle,
    titleField: 'question', subtitleField: 'explanation', badgeField: 'question_type', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'question', label: 'Pertanyaan kuis', kind: 'textarea', required: true },
      { key: 'question_type', label: 'Tipe / Topik', kind: 'select', options: ['Salam & Perkenalan', 'Kosakata HSK 1', 'Tata Bahasa Dasar', 'Percakapan Pesantren', 'Angka & Waktu'], defaultValue: 'Salam & Perkenalan' },
      { key: 'options', label: 'Pilihan jawaban (JSON array)', kind: 'json', required: true, defaultValue: ['A. Nǐ hǎo', 'B. Zàijiàn', 'C. Xièxie', 'D. Duìbuqǐ'], help: 'Contoh: ["A. Nǐ hǎo", "B. Zàijiàn", "C. Xièxie", "D. Duìbuqǐ"]' },
      { key: 'correct_index', label: 'Indeks jawaban benar (0-3)', kind: 'number', required: true, defaultValue: 0 },
      { key: 'explanation', label: 'Pembahasan jawaban', kind: 'textarea' },
    ],
  },
  {
    key: 'stem_worksheets', table: 'stem_worksheets', label: 'LKPD STEM', group: 'Akademik', icon: FlaskConical,
    titleField: 'title', subtitleField: 'level', imageField: 'image_url', badgeField: 'category',
    sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Robotika & IoT', 'Energi Terbarukan', 'Sains Terapan & Kimia', 'Pemrograman & AI', 'Biologi & Lingkungan'], defaultValue: 'Robotika & IoT' },
      { key: 'level', label: 'Kelas/Level', kind: 'select', options: ['Kelas 7 SMP', 'Kelas 8 SMP', 'Kelas 9 SMP', 'Semua Kelas SMP'], defaultValue: 'Semua Kelas SMP' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image' },
      { key: 'pdf_url', label: 'Tautan PDF', kind: 'url' },
      { key: 'goals', label: 'Tujuan (JSON)', kind: 'json', advanced: true },
      { key: 'tools', label: 'Alat & bahan (JSON)', kind: 'json', advanced: true },
      { key: 'steps', label: 'Langkah (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'stem_projects', table: 'stem_projects', label: 'Proyek STEM', group: 'Akademik', icon: Rocket,
    titleField: 'title', subtitleField: 'author_santri', imageField: 'cover_image', badgeField: 'category',
    sort: { col: 'created_at', asc: false }, slugFrom: 'title',
    fields: [
      { key: 'title', label: 'Judul proyek', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['IoT & Mikrokontroler', 'Energi Surya & Lingkungan', 'Robotika Otomasi', 'Aplikasi & Sains Data'], defaultValue: 'IoT & Mikrokontroler' },
      { key: 'author_santri', label: 'Nama santri', kind: 'text' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'cover_image', label: 'Gambar sampul (Otomatis WebP)', kind: 'image' },
      { key: 'is_portfolio', label: 'Masuk portofolio', kind: 'bool' },
      { key: 'assignment_doc_url', label: 'Tautan dokumen tugas', kind: 'url' },
      { key: 'syllabus_url', label: 'Tautan silabus', kind: 'url' },
      { key: 'slug', label: 'Alamat (slug)', kind: 'text', advanced: true },
      { key: 'specs', label: 'Spesifikasi (JSON)', kind: 'json', advanced: true },
    ],
  },
  // ───────── MANAJEMEN
  {
    key: 'spmb_info', table: 'spmb_info', label: 'Info SPMB/PPDB', group: 'Manajemen', icon: ClipboardList,
    titleField: 'tahun_ajaran', subtitleField: 'gelombang', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'tahun_ajaran', label: 'Tahun ajaran', kind: 'text', required: true, defaultValue: '2026/2027' },
      { key: 'gelombang', label: 'Gelombang', kind: 'select', options: ['Gelombang Inden', 'Gelombang 1', 'Gelombang 2', 'Gelombang 3'], defaultValue: 'Gelombang 1' },
      { key: 'kontak_wa', label: 'WhatsApp PPDB', kind: 'text', placeholder: '0821-3160-6535' },
      { key: 'biaya', label: 'Biaya (JSON)', kind: 'json', advanced: true },
      { key: 'persyaratan', label: 'Persyaratan (JSON)', kind: 'json', advanced: true },
      { key: 'alur', label: 'Alur pendaftaran (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'osis_events', table: 'osis_events', label: 'Kegiatan OSIS', group: 'Manajemen', icon: PartyPopper,
    titleField: 'title', subtitleField: 'date', imageField: 'image_url', badgeField: 'category',
    sort: { col: 'date', asc: false },
    fields: [
      { key: 'title', label: 'Nama kegiatan', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kepemimpinan & LDKS', 'Bakti Sosial', 'Lomba Classmeeting', 'Kajian & Rohis', 'Peringatan Hari Besar'], defaultValue: 'Kepemimpinan & LDKS' },
      { key: 'date', label: 'Tanggal', kind: 'date' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image' },
    ],
  },
  {
    key: 'osis_programs', table: 'osis_programs', label: 'Program OSIS', group: 'Manajemen', icon: Target,
    titleField: 'title', subtitleField: 'department', badgeField: 'frequency', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'title', label: 'Nama program', kind: 'text', required: true },
      { key: 'department', label: 'Bidang', kind: 'select', options: ['Departemen Keagamaan & Ubudiyah', 'Departemen Bahasa & Literasi', 'Departemen Sains & IPTEK', 'Departemen Olahraga & Kesehatan', 'Departemen Kebersihan & Lingkungan'], defaultValue: 'Departemen Keagamaan & Ubudiyah' },
      { key: 'frequency', label: 'Frekuensi', kind: 'select', options: ['Harian', 'Mingguan', 'Bulanan', 'Semesteran', 'Tahunan'], defaultValue: 'Mingguan' },
      { key: 'target', label: 'Sasaran', kind: 'text' },
      { key: 'output', label: 'Target hasil', kind: 'text' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea' },
    ],
  },
  {
    key: 'osis_structure', table: 'osis_structure', label: 'Struktur OSIS', group: 'Manajemen', icon: Network,
    titleField: 'name', subtitleField: 'position', imageField: 'photo_url', badgeField: 'period',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'name', label: 'Nama', kind: 'text', required: true },
      { key: 'position', label: 'Jabatan', kind: 'text', required: true },
      { key: 'class', label: 'Kelas', kind: 'select', options: ['Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B', 'Kelas 9A', 'Kelas 9B'], defaultValue: 'Kelas 8A' },
      { key: 'level', label: 'Tingkat (angka)', kind: 'number', defaultValue: 1 },
      { key: 'period', label: 'Periode', kind: 'text', placeholder: '2026-2027', defaultValue: '2026-2027' },
      { key: 'motto', label: 'Motto', kind: 'text' },
      { key: 'photo_url', label: 'Foto (Otomatis WebP)', kind: 'image' },
    ],
  },
];

export const crudByKey = (key: string | undefined) => CRUD_SECTIONS.find((s) => s.key === key);
