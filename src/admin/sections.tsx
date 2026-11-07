import type { ElementType } from 'react';
import {
  Images, Share2, MessageSquareQuote, Newspaper, CalendarDays, Camera, Video, Trophy,
  BookOpen, GraduationCap, FileText, Users, Building, Languages, Type, FlaskConical, Rocket,
  ClipboardList, PartyPopper, Target, Network, Layers, HelpCircle,
  LayoutDashboard, UserPlus, RotateCcw, MapPin, Zap, Database, Image, Sparkles,
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

export type NavGroupKey = 'Content' | 'Akademik' | 'Publikasi' | 'Manajemen' | 'Pengaturan';

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

export const KELAS_OPTIONS = ['7A', '7B', '8A', '8B', '9A', '9B', 'Semua Kelas'];

export const JABATAN_OPTIONS = [
  'Kepala Sekolah',
  'Wakil Kepala Sekolah',
  'Guru Pengampu',
  'Musyrif Asrama',
  'Pembina Halaqah',
  'Staf Administrasi',
  'Bendahara',
  'Panitia PPDB',
  'Humas',
  'Panitia Ekskul',
  'Lainnya',
];

export const MAPEL_OPTIONS = [
  'Agama Islam',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Bahasa Arab',
  'Bahasa Mandarin',
  'Matematika',
  'IPA',
  'IPS',
  'Tahfidz Al-Qur\'an',
  'Tilawah',
  'FIqh',
  'Aqidah Akhlak',
  'Sejarah Kebudayaan Islam',
  'Seni Budaya',
  'Olahraga & Kesehatan',
  'TIK / Komputer',
  'Prakarya',
  'Bahasa Daerah',
  'Umum',
];

export const KATEGORI_OPTIONS = ['Akademik', 'Keagamaan', 'Ekskul', 'Publikasi', 'Manajemen', 'Umum'];

export const SASARAN_OPTIONS = ['Seluruh Santri', 'Santri Putra', 'Santri Putri', 'Kelas Tertentu', 'Umum', 'Wali Santri'];

export const LOKASI_OPTIONS = [...GALERI_LOCATION_OPTIONS];

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
      { key: 'title', label: 'Judul', kind: 'text', required: true, placeholder: 'Masukkan judul yang deskriptif dan singkat' },
      { key: 'badge_tag', label: 'Label kecil', kind: 'text', placeholder: 'Mis: Baru, Populer, Gratis' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi singkat tentang slider ini' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image', required: true },
      { key: 'cta_text', label: 'Teks tombol', kind: 'text', placeholder: 'Mis: Lihat Selengkapnya' },
      { key: 'cta_link', label: 'Tautan tombol', kind: 'url', placeholder: 'https://contoh.com' },
    ],
  },
  {
    key: 'quick_menus', table: 'quick_menus', label: 'Menu Cepat', group: 'Content', icon: Zap,
    titleField: 'label', subtitleField: 'link', orderField: 'order_index', activeField: 'is_active',
    sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'label', label: 'Nama menu', kind: 'text', required: true, placeholder: 'Mis: Galeri Foto, Kontak Kami' },
      { key: 'icon', label: 'Nama ikon', kind: 'text', help: 'Nama ikon yang sudah dipakai website, mis. BookOpen', defaultValue: 'BookOpen' },
      { key: 'link', label: 'Tautan', kind: 'url', required: true, defaultValue: '/', placeholder: 'https://contoh.com' },
    ],
  },
  {
    key: 'kontak_medsos', table: 'kontak_medsos', label: 'Kontak & Media Sosial', group: 'Content', icon: Share2,
    titleField: 'label', subtitleField: 'url', imageField: 'icon_url', badgeField: 'type',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'label', label: 'Nama', kind: 'text', required: true, placeholder: 'Mis: Kontak Utama Pondok' },
      { key: 'type', label: 'Jenis', kind: 'select', options: ['whatsapp', 'instagram', 'youtube', 'facebook', 'tiktok', 'email', 'maps', 'website'], defaultValue: 'whatsapp' },
      { key: 'url', label: 'Tautan', kind: 'url', required: true, placeholder: 'https://wa.me/6281234567890' },
      { key: 'icon_url', label: 'Ikon (opsional)', kind: 'image' },
      { key: 'bg_color', label: 'Warna latar', kind: 'text', placeholder: '#115E59', advanced: true },
    ],
  },
  {
    key: 'sambutan_persons', table: 'sambutan_persons', label: 'Sambutan', group: 'Content', icon: MessageSquareQuote,
    titleField: 'name', subtitleField: 'title', imageField: 'photo_url', badgeField: 'role_type',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'name', label: 'Nama', kind: 'text', required: true, placeholder: 'Mis: Ustadz Ahmad Fauzi' },
      { key: 'title', label: 'Jabatan', kind: 'text', required: true, placeholder: 'Mis: Kepala Madrasah' },
      { key: 'role_type', label: 'Jenis Jabatan', kind: 'select', options: ['pengasuh', 'kepala_sekolah', 'ketua_yayasan', 'mudir_madin'], defaultValue: 'pengasuh' },
      { key: 'location', label: 'Lokasi Tampil', kind: 'select_array', options: ['Beranda & JM Center', 'Halaman Beranda (Home)', 'Halaman Profil (JM Center)'] },
      { key: 'photo_url', label: 'Foto Pimpinan (Otomatis WebP)', kind: 'image' },
      { key: 'message_short', label: 'Sambutan singkat', kind: 'textarea', placeholder: 'Tulis sambutan singkat…' },
      { key: 'message_full', label: 'Sambutan lengkap', kind: 'rich' },
      { key: 'is_featured', label: 'Tampilkan sebagai utama', kind: 'bool' },
    ],
  },
  {
    key: 'sub_items', table: 'sub_items', label: 'Pilar Keunggulan & Kategori', group: 'Content', icon: Layers,
    titleField: 'title', subtitleField: 'description', imageField: 'image_url', badgeField: 'parent_module',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul item / keunggulan', kind: 'text', required: true, placeholder: 'Mis: Teknologi Informasi & Komunikasi' },
      { key: 'parent_module', label: 'Modul induk', kind: 'select', options: ['keunggulan_items', 'facilities_categories'], required: true, help: 'Pilih keunggulan_items untuk 8 Pilar Keunggulan Beranda, atau facilities_categories untuk Kategori Fasilitas' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi singkat tentang keunggulan ini' },
      { key: 'icon', label: 'Nama ikon', kind: 'text', placeholder: 'BookOpen, Cpu, Globe, HeartHandshake…' },
      { key: 'color', label: 'Tema warna', kind: 'select', options: ['emerald', 'gold', 'teal', 'blue', 'amber', 'purple'], defaultValue: 'emerald' },
      { key: 'image_url', label: 'Gambar (opsional)', kind: 'image' },
      { key: 'data', label: 'Data tambahan (JSON)', kind: 'json', advanced: true },
    ],
  },
  // ───────── MASTER DATA SUPERADMIN
  {
    key: 'kelas', table: 'master_kelas', label: 'Data Kelas', group: 'Pengaturan', icon: LayoutDashboard,
    titleField: 'nama_kelas', activeField: 'is_active', sort: { col: 'nama_kelas', asc: true },
    fields: [
      { key: 'nama_kelas', label: 'Nama Kelas', kind: 'text', required: true, placeholder: 'Mis: Kelas 7A' },
      { key: 'tingkat', label: 'Tingkat', kind: 'select', options: ['7', '8', '9'], required: true },
      { key: 'keterangan', label: 'Keterangan', kind: 'textarea', placeholder: 'Tulis keterangan tambahan…' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'jabatan', table: 'master_jabatan', label: 'Data Jabatan', group: 'Pengaturan', icon: Users,
    titleField: 'nama_jabatan', activeField: 'is_active', sort: { col: 'nama_jabatan', asc: true },
    fields: [
      { key: 'nama_jabatan', label: 'Nama Jabatan', kind: 'text', required: true, placeholder: 'Mis: Kepala Sekolah' },
      { key: 'singkatan', label: 'Singkatan', kind: 'text', placeholder: 'Mis: KS' },
      { key: 'tingkat_kewenangan', label: 'Tingkat Kewenangan', kind: 'select', options: ['Tinggi', 'Sedang', 'Rendah'], defaultValue: 'Sedang' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'mapel', table: 'master_mapel', label: 'Data Mata Pelajaran', group: 'Pengaturan', icon: BookOpen,
    titleField: 'nama_mapel', activeField: 'is_active', sort: { col: 'nama_mapel', asc: true },
    fields: [
      { key: 'nama_mapel', label: 'Nama Mata Pelajaran', kind: 'text', required: true, placeholder: 'Mis: Agama Islam' },
      { key: 'kode_mapel', label: 'Kode Mapel', kind: 'text', placeholder: 'Mis: AGM-101' },
      { key: 'jenjang', label: 'Jenjang', kind: 'select', options: ['SMP', 'SMA', 'Diniyah'], defaultValue: 'SMP' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'kategori', table: 'master_kategori', label: 'Data Kategori', group: 'Pengaturan', icon: Layers,
    titleField: 'nama_kategori', activeField: 'is_active', sort: { col: 'nama_kategori', asc: true },
    fields: [
      { key: 'nama_kategori', label: 'Nama Kategori', kind: 'text', required: true, placeholder: 'Mis: Akademik' },
      { key: 'deskripsi', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi kategori…' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'sasaran', table: 'master_sasaran', label: 'Data Sasaran', group: 'Pengaturan', icon: Target,
    titleField: 'nama_sasaran', activeField: 'is_active', sort: { col: 'nama_sasaran', asc: true },
    fields: [
      { key: 'nama_sasaran', label: 'Nama Sasaran', kind: 'text', required: true, placeholder: 'Mis: Seluruh Santri' },
      { key: 'deskripsi', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi sasaran…' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'lokasi', table: 'master_lokasi', label: 'Data Lokasi', group: 'Pengaturan', icon: MapPin,
    titleField: 'nama_lokasi', activeField: 'is_active', sort: { col: 'nama_lokasi', asc: true },
    fields: [
      { key: 'nama_lokasi', label: 'Nama Lokasi', kind: 'text', required: true, placeholder: 'Mis: Aula Utama' },
      { key: 'gedung', label: 'Gedung', kind: 'text', placeholder: 'Mis: Gedung Utama' },
      { key: 'kapasitas', label: 'Kapasitas', kind: 'text', placeholder: 'Mis: 500 orang' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'user_approvals', table: 'user_registrations', label: 'Approval User Baru', group: 'Manajemen', icon: UserPlus,
    titleField: 'full_name', subtitleField: 'status', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'full_name', label: 'Nama Lengkap', kind: 'text', placeholder: 'Masukkan nama lengkap pendaftar' },
      { key: 'phone', label: 'No. Telepon', kind: 'text', placeholder: '081234567890' },
      { key: 'email', label: 'Email', kind: 'text', placeholder: 'contoh@email.com' },
      { key: 'requested_role', label: 'Role yang Diminta', kind: 'text', placeholder: 'Mis: Guru Bahasa Inggris' },
      { key: 'status', label: 'Status', kind: 'select', options: ['pending', 'approved', 'rejected'], defaultValue: 'pending' },
      { key: 'alasan', label: 'Alasan', kind: 'textarea', placeholder: 'Tulis alasan pendaftaran…' },
      { key: 'rejection_reason', label: 'Alasan Penolakan', kind: 'textarea', placeholder: 'Tulis alasan penolakan jika ditolak…' },
    ],
  },
  {
    key: 'password_requests', table: 'password_reset_requests', label: 'Approval Ganti Password', group: 'Manajemen', icon: RotateCcw,
    titleField: 'email', subtitleField: 'status', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'email', label: 'Email Pengguna', kind: 'text', placeholder: 'contoh@email.com' },
      { key: 'status', label: 'Status', kind: 'select', options: ['pending', 'approved', 'rejected'], defaultValue: 'pending' },
      { key: 'alasan', label: 'Alasan Permintaan', kind: 'textarea', placeholder: 'Tulis alasan permintaan ganti password…' },
      { key: 'admin_notes', label: 'Catatan Admin', kind: 'textarea', placeholder: 'Catatan internal admin…' },
    ],
  },
  // ───────── PUBLIKASI
  {
    key: 'berita', table: 'berita', label: 'Berita', group: 'Publikasi', icon: Newspaper,
    titleField: 'title', subtitleField: 'excerpt', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_published', sort: { col: 'created_at', asc: false },
    slugFrom: 'title', authorField: 'author_id', publishedAtField: 'published_at',
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true, placeholder: 'Masukkan judul berita…' },
      { key: 'category', label: 'Kategori', kind: 'select', options: BERITA_CATEGORY_OPTIONS, defaultValue: 'Berita Pondok' },
      { key: 'location', label: 'Lokasi Penayangan', kind: 'select_array', options: ['Beranda & Berita (Utama)', 'Halaman Berita', 'Siaran Pers (Press Release)'] },
      { key: 'excerpt', label: 'Ringkasan', kind: 'textarea', placeholder: 'Tulis ringkasan berita…' },
      { key: 'image_url', label: 'Gambar utama (Otomatis WebP)', kind: 'image' },
      { key: 'content', label: 'Isi berita', kind: 'rich', required: true },
      { key: 'slug', label: 'Alamat (slug)', kind: 'text', advanced: true, help: 'Kosongkan agar dibuat otomatis dari judul' },
    ],
  },
  {
    key: 'info_terkini', table: 'info_terkini', label: 'Info Terkini (Ticker)', group: 'Publikasi', icon: Zap,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_published', sort: { col: 'created_at', asc: false },
    slugFrom: 'title', authorField: 'author_id', publishedAtField: 'created_at',
    fields: [
      {
        key: 'title',
        label: 'Teks Warta Berjalan (Ticker Bar)',
        kind: 'text',
        required: true,
        placeholder: 'Contoh: ✨ Pendaftaran SPMB telah dibuka!',
        help: 'Teks warta berjalan yang langsung tayang pada baris Info Terkini di atas header website.',
      },
      {
        key: 'category',
        label: 'Kategori Warta',
        kind: 'select',
        options: ['Pengumuman', 'Prestasi', 'Akademik', 'Keagamaan', 'Pondok', 'Kegiatan', 'Kontak', 'Umum'],
        defaultValue: 'Pengumuman',
      },
      {
        key: 'excerpt',
        label: 'Target Tautan / URL (Opsional)',
        kind: 'text',
        placeholder: 'Contoh: /spmb, /jm-center, https://..., atau medsos-modal',
        help: 'Jika diisi rute internal (/spmb, /stem), link luar, atau "medsos-modal", teks ticker dapat diklik oleh pengunjung.',
      },
      {
        key: 'is_featured',
        label: 'Sorot Utama (Tampil Prioritas di Depan)',
        kind: 'bool',
        defaultValue: false,
      },
      {
        key: 'image_url',
        label: 'Gambar / Brosur Pendukung (Opsional WebP)',
        kind: 'image',
      },
      {
        key: 'content',
        label: 'Isi / Narasi Detail (Opsional)',
        kind: 'rich',
        placeholder: 'Tuliskan informasi atau rilis berita lengkap jika memiliki artikel detail…',
      },
      {
        key: 'slug',
        label: 'Alamat URL (Slug)',
        kind: 'text',
        advanced: true,
        help: 'Kosongkan agar dibuat otomatis dari judul',
      },
    ],
  },
  {
    key: 'agendas', table: 'agendas', label: 'Agenda', group: 'Publikasi', icon: CalendarDays,
    titleField: 'title', subtitleField: 'date_display', imageField: 'image', badgeField: 'category',
    activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Nama kegiatan', kind: 'text', required: true, placeholder: 'Masukkan nama kegiatan…' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kegiatan Akbar', 'Akademik & Ujian', 'Tahfidz & Haflah', 'Kajian Rutin', 'Peringatan Hari Besar', 'Lomba & Ekspo', 'Rapat & Wali Santri', 'Sekolah', 'Pondok', 'Event Akbar', 'Diniyah', 'Libur', 'Umum'], defaultValue: 'Kegiatan Akbar' },
      { key: 'badge', label: 'Label', kind: 'text', defaultValue: 'Agenda Resmi', placeholder: 'Mis: Agenda Resmi' },
      { key: 'date_display', label: 'Tanggal (teks tampilan)', kind: 'text', placeholder: '12 - 19 Oktober 2026', defaultValue: '12 - 19 Oktober 2026' },
      { key: 'time_display', label: 'Waktu', kind: 'text', placeholder: '08.00 - 11.30 WIB', defaultValue: '08.00 - 11.30 WIB' },
      { key: 'location', label: 'Lokasi Kegiatan', kind: 'select', options: GALERI_LOCATION_OPTIONS.slice(0, 8), defaultValue: 'Aula Utama PP. Jauharul Maknuun' },
      { key: 'coordinator', label: 'Penanggung jawab', kind: 'text', defaultValue: 'Panitia Pondok Pesantren', placeholder: 'Mis: Panitia Pondok Pesantren' },
      { key: 'target_audience', label: 'Sasaran', kind: 'select', options: ['Seluruh Santri & Wali Santri', 'Santri Putra & Putri', 'Dewan Asatidz & Guru', 'Umum & Masyarakat', 'Santri SMP', 'Santri Tahfidz'], defaultValue: 'Seluruh Santri & Wali Santri' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi kegiatan…' },
      { key: 'image', label: 'Gambar (Otomatis WebP)', kind: 'image' },
      { key: 'month', label: 'Bulan Kegiatan', kind: 'select', options: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'], defaultValue: 'Oktober' },
      { key: 'year', label: 'Tahun', kind: 'text', defaultValue: '2026', placeholder: 'Mis: 2026' },
      { key: 'timeline_status', label: 'Status Jadwal', kind: 'select', options: ['upcoming', 'ongoing', 'completed'], defaultValue: 'upcoming' },
      { key: 'rundown', label: 'Rundown (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'karya_siswa', table: 'karya_siswa', label: 'Karya Siswa', group: 'Publikasi', icon: Sparkles,
    titleField: 'title', subtitleField: 'author', imageField: 'image_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul Karya', kind: 'text', required: true, placeholder: 'Mis: Buku Bunga Rampai Santri' },
      {
        key: 'category',
        label: 'Kategori Karya',
        kind: 'select',
        options: ['buku', 'batik', 'video-lagu-batik', 'video-lagu-ustad', 'showroom'],
        required: true,
        defaultValue: 'buku',
        help: 'Pilih kategori penayangan pada tab Karya Siswa (buku, batik, video lagu batik, video lagu ustadz, atau showroom).',
      },
      { key: 'author', label: 'Penulis / Pembuat Karya', kind: 'text', required: true, placeholder: 'Mis: Ahmad Zaki & Tim Literasi' },
      { key: 'author_role', label: 'Peran / Kelas Santri', kind: 'text', placeholder: 'Mis: Santri Kelas IX SMP Plus JM' },
      { key: 'year', label: 'Tahun Pembuatan', kind: 'text', defaultValue: '2026' },
      { key: 'description', label: 'Deskripsi / Ulasan Karya', kind: 'textarea', placeholder: 'Tuliskan deskripsi orisinalitas karya santri…' },
      { key: 'image_url', label: 'Foto Sampul / Brosur / Flyer (Otomatis WebP)', kind: 'image' },
      { key: 'video_url', label: 'Tautan Video YouTube (Untuk Kategori Video)', kind: 'url', placeholder: 'https://www.youtube.com/watch?v=... atau embed' },
      { key: 'pdf_url', label: 'Tautan Berkas PDF / Katalog', kind: 'url', placeholder: 'https://...pdf' },
      { key: 'specs', label: 'Spesifikasi / Detail Teknis (JSON)', kind: 'json', advanced: true },
      { key: 'order_index', label: 'Urutan Tampil', kind: 'number', defaultValue: 0 },
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
      { key: 'title', label: 'Judul', kind: 'text', required: true, placeholder: 'Masukkan judul video…' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Profil Resmi', 'Tahfidz & Haflah', 'Kajian Kitab', 'Inovasi STEM', 'Kegiatan Santri', 'Dokumentasi'], defaultValue: 'Dokumentasi' },
      { key: 'description', label: 'Keterangan', kind: 'textarea', placeholder: 'Tulis keterangan singkat tentang video…' },
      { key: 'youtube_url', label: 'Tautan YouTube', kind: 'url', required: true, placeholder: 'https://youtube.com/…' },
      { key: 'thumbnail_url', label: 'Gambar sampul (Otomatis WebP)', kind: 'image' },
      { key: 'is_featured', label: 'Tampilkan unggulan', kind: 'bool' },
    ],
  },
  {
    key: 'prestasi', table: 'prestasi', label: 'Prestasi', group: 'Publikasi', icon: Trophy,
    titleField: 'title', subtitleField: 'santri_name', imageField: 'photo_url', badgeField: 'level',
    activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Nama prestasi', kind: 'text', required: true, placeholder: 'Mis: Juara 1 Lomba Tahfidz Nasional' },
      { key: 'santri_name', label: 'Nama santri', kind: 'text', required: true, placeholder: 'Mis: Ahmad Fauzi' },
      { key: 'category', label: 'Bidang', kind: 'select', options: ['Tahfidz & Tilawah', 'Kitab Kuning (MQK)', 'Sains & Robotik', 'Bahasa Arab & Inggris', 'Bahasa Mandarin', 'Olahraga & Seni'], defaultValue: 'Sains & Robotik' },
      { key: 'level', label: 'Tingkat', kind: 'select', options: ['Kabupaten', 'Karesidenan', 'Provinsi', 'Nasional', 'Internasional'], defaultValue: 'Nasional' },
      { key: 'location', label: 'Lokasi Penyelenggaraan', kind: 'select_array', options: ['Tingkat Nasional & Beranda', 'Tingkat Provinsi Jawa Tengah', 'Kabupaten Rembang - Lasem', 'Beranda & Halaman Prestasi'] },
      { key: 'organizer', label: 'Penyelenggara', kind: 'text', placeholder: 'Mis: Kemenag Kabupaten Rembang' },
      { key: 'pembina_name', label: 'Pembina', kind: 'text', placeholder: 'Mis: Ustadz Ahmad' },
      { key: 'year', label: 'Tahun', kind: 'number', defaultValue: 2026 },
      { key: 'photo_url', label: 'Foto (Otomatis WebP)', kind: 'image' },
      { key: 'certificate_url', label: 'Sertifikat (Otomatis WebP)', kind: 'image' },
    ],
  },
  // ───────── AKADEMIK
  {
    key: 'programs_pondok', table: 'programs_pondok', label: 'Program Pondok', group: 'Akademik', icon: BookOpen,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'badge', activeField: 'is_active', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'title', label: 'Nama Program', kind: 'text', required: true, placeholder: "Mis: Pembinaan Karakter Santri Mandiri" },
      { key: 'category', label: 'Kategori Program', kind: 'select', options: ['Karakter & Kepribadian', 'Kajian & Turats', 'Olahraga & Seni', 'Al-Qur\'an & Tahfidz', 'Bahasa Asing', 'Kemandirian'], defaultValue: 'Karakter & Kepribadian' },
      { key: 'badge', label: 'Label Ringkas / Waktu', kind: 'text', placeholder: 'Mis: 24 Jam Asrama' },
      { key: 'description', label: 'Deskripsi Lengkap Program', kind: 'textarea', placeholder: 'Tulis deskripsi program…' },
      { key: 'image_url', label: 'Foto Program (Otomatis WebP)', kind: 'image' },
      { key: 'schedule', label: 'Jadwal / Konfigurasi (JSON)', kind: 'json', advanced: true, defaultValue: [] },
    ],
  },
  {
    key: 'programs_sekolah', table: 'programs_sekolah', label: 'Program Sekolah', group: 'Akademik', icon: GraduationCap,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'badge', activeField: 'is_active', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'title', label: 'Nama Program', kind: 'text', required: true, placeholder: 'Mis: Kurikulum Merdeka Terakreditasi "A"' },
      { key: 'category', label: 'Kategori Program', kind: 'select', options: ['Kurikulum Nasional', 'Riset Terapan STEM', 'Bahasa Internasional', 'Ekstrakurikuler'], defaultValue: 'Kurikulum Nasional' },
      { key: 'badge', label: 'Label Ringkas / Target', kind: 'text', placeholder: 'Mis: Unggul Akademik & Inovasi' },
      { key: 'description', label: 'Deskripsi Program', kind: 'textarea', placeholder: 'Tulis deskripsi program…' },
      { key: 'curriculum', label: 'Standar Kurikulum', kind: 'text', placeholder: 'Mis: Kurikulum Merdeka BAN-PDM Akreditasi A' },
      { key: 'image_url', label: 'Foto Program (Otomatis WebP)', kind: 'image' },
      { key: 'visual_story', label: 'Visual Story & Poin (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'program_photos', table: 'program_activity_photos', label: 'Foto Kegiatan Program', group: 'Akademik', icon: Camera,
    titleField: 'title', subtitleField: 'location', imageField: 'image_url', badgeField: 'program_type',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul Dokumentasi Kegiatan', kind: 'text', required: true, placeholder: 'Mis: Subuh & Halaqah Al-Qur’an' },
      { key: 'program_type', label: 'Kategori Program', kind: 'select', options: ['pondok', 'sekolah'], required: true, defaultValue: 'pondok', help: 'Pilih apakah dokumentasi ini tampil di tab Program Pondok atau Program Sekolah.' },
      { key: 'image_url', label: 'Foto Kegiatan (Otomatis Convert WebP)', kind: 'image', required: true },
      { key: 'time_tag', label: 'Waktu / Jam', kind: 'text', placeholder: 'Mis: 04.30 - 06.00 WIB atau SMP Plus JM' },
      { key: 'location', label: 'Lokasi Kegiatan', kind: 'text', placeholder: 'Mis: Masjid Jami Raudhatul Ulum' },
      { key: 'description', label: 'Keterangan Dokumentasi', kind: 'textarea', placeholder: 'Tulis ringkasan kegiatan santri…' },
      { key: 'order_index', label: 'Urutan Tampil', kind: 'number', defaultValue: 1 },
    ],
  },
  {
    key: 'madin_flyers', table: 'madin_flyers', label: 'Flyer Madin', group: 'Akademik', icon: FileText,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', orderField: 'order_index',
    activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true, placeholder: 'Masukkan judul flyer…' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['kitab', 'tahfidz', 'kurikulum', 'jadwal', 'brosur'], defaultValue: 'kitab' },
      { key: 'image_url', label: 'Gambar flyer (Otomatis WebP)', kind: 'image', required: true },
      { key: 'pdf_url', label: 'PDF file (unggah dari komputer)', kind: 'image' },
    ],
  },
  {
    key: 'ekskul', table: 'ekskul', label: 'Ekstrakurikuler', group: 'Akademik', icon: Users,
    titleField: 'name', subtitleField: 'instructor_name', badgeField: 'category', activeField: 'is_active',
    sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'name', label: 'Nama ekskul', kind: 'text', required: true, placeholder: 'Mis: Pencak Silat' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Sains & Teknologi', 'Seni Islami & Hadrah', 'Bahasa & Literasi', 'Olahraga & Bela Diri', 'Kewirausahaan & Media'], defaultValue: 'Sains & Teknologi' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi ekskul…' },
      { key: 'instructor_name', label: 'Pembina', kind: 'text', placeholder: 'Mis: Ustadz Ahmad' },
      { key: 'location', label: 'Lokasi Latihan', kind: 'select', options: GALERI_LOCATION_OPTIONS.slice(0, 8), defaultValue: 'Aula Utama PP. Jauharul Maknuun' },
      { key: 'schedule', label: 'Jadwal', kind: 'text', placeholder: 'Mis: Sabtu 08.00 - 10.00 WIB' },
      { key: 'target', label: 'Sasaran', kind: 'text', placeholder: 'Mis: Santri kelas 7-9' },
      { key: 'images', label: 'Foto (Otomatis WebP)', kind: 'image' },
      { key: 'syllabus', label: 'Silabus (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'institutions', table: 'institutions', label: 'Lembaga', group: 'Akademik', icon: Building,
    titleField: 'name', subtitleField: 'type', imageField: 'image_url', activeField: 'is_active', sort: { col: 'created_at', asc: true },
    fields: [
      { key: 'name', label: 'Nama lembaga', kind: 'text', required: true, placeholder: 'Mis: SMP Plus Jauharul Maknuun' },
      { key: 'type', label: 'Jenis', kind: 'select', options: ['pondok', 'sekolah', 'madin', 'tahfidz'], defaultValue: 'pondok' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi lembaga…' },
      { key: 'curriculum', label: 'Kurikulum', kind: 'text', placeholder: 'Mis: Kurikulum Merdeka' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image' },
    ],
  },
  {
    key: 'mandarin_lessons', table: 'mandarin_lessons', label: 'Materi Mandarin', group: 'Akademik', icon: Languages,
    titleField: 'topic', subtitleField: 'pinyin', imageField: 'cover_image', badgeField: 'level',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'topic', label: 'Topik', kind: 'text', required: true, placeholder: '例如: 你好' },
      { key: 'level', label: 'Level', kind: 'select', options: ['Dasar', 'Menengah', 'Lanjutan', 'HSK 1', 'HSK 2'], defaultValue: 'Dasar' },
      { key: 'hanzi', label: 'Hanzi', kind: 'text', placeholder: '例如: 你好' },
      { key: 'pinyin', label: 'Pinyin', kind: 'text', defaultValue: '-', placeholder: 'Mis: nǐ hǎo' },
      { key: 'meaning_id', label: 'Arti (Indonesia)', kind: 'text', defaultValue: '-', placeholder: 'Mis: Selamat pagi' },
      { key: 'cover_image', label: 'Gambar sampul (Otomatis WebP)', kind: 'image' },
      { key: 'audio_url', label: 'Audio file (unggah dari komputer)', kind: 'image' },
      { key: 'dialog_script', label: 'Dialog (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'mandarin_vocabularies', table: 'mandarin_vocabularies', label: 'Kosakata Mandarin', group: 'Akademik', icon: Type,
    titleField: 'hanzi', subtitleField: 'arti', badgeField: 'category', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'hanzi', label: 'Hanzi', kind: 'text', required: true, placeholder: '例如: 你好' },
      { key: 'pinyin', label: 'Pinyin', kind: 'text', required: true, placeholder: 'Mis: nǐ hǎo' },
      { key: 'arti', label: 'Arti', kind: 'text', required: true, placeholder: 'Mis: Selamat pagi' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Salam & Sapaan', 'Kehidupan Asrama', 'Sekolah & Kelas', 'Angka & Waktu', 'Keluarga & Tokoh', 'Percakapan Harian'], defaultValue: 'Percakapan Harian' },
      { key: 'hsk_level', label: 'Level HSK', kind: 'select', options: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'], defaultValue: 'HSK 1' },
      { key: 'example_hanzi', label: 'Contoh kalimat (Hanzi)', kind: 'text', placeholder: '例如: 你好吗？' },
      { key: 'example_pinyin', label: 'Contoh kalimat (Pinyin)', kind: 'text', placeholder: 'Mis: Nǐ hǎo ma？' },
      { key: 'example_arti', label: 'Contoh kalimat (Arti)', kind: 'text', placeholder: 'Mis: Apa kabar?' },
      { key: 'audio_url', label: 'Audio file (unggah dari komputer)', kind: 'image' },
      { key: 'dialog_script', label: 'Dialog (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'mandarin_quizzes', table: 'mandarin_quizzes', label: 'Kuis Mandarin', group: 'Akademik', icon: HelpCircle,
    titleField: 'question', subtitleField: 'explanation', badgeField: 'question_type', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'question', label: 'Pertanyaan kuis', kind: 'textarea', required: true, placeholder: 'Tulis pertanyaan kuis…' },
      { key: 'question_type', label: 'Tipe / Topik', kind: 'select', options: ['Salam & Perkenalan', 'Kosakata HSK 1', 'Tata Bahasa Dasar', 'Percakapan Pesantren', 'Angka & Waktu'], defaultValue: 'Salam & Perkenalan' },
      { key: 'options', label: 'Pilihan jawaban (JSON array)', kind: 'json', required: true, defaultValue: ['A. Nǐ hǎo', 'B. Zàijiàn', 'C. Xièxie', 'D. Duìbuqǐ'], help: 'Contoh: ["A. Nǐ hǎo", "B. Zàijiàn", "C. Xièxie", "D. Duìbuqǐ"]' },
      { key: 'correct_index', label: 'Indeks jawaban benar (0-3)', kind: 'number', required: true, defaultValue: 0, placeholder: 'Masukkan angka 0-3' },
      { key: 'explanation', label: 'Pembahasan jawaban', kind: 'textarea', placeholder: 'Tulis pembahasan jawaban…' },
    ],
  },
  {
    key: 'stem_worksheets', table: 'stem_worksheets', label: 'LKPD STEM', group: 'Akademik', icon: FlaskConical,
    titleField: 'title', subtitleField: 'level', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Judul', kind: 'text', required: true, placeholder: 'Masukkan judul LKPD…' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Robotika & IoT', 'Energi Terbarukan', 'Sains Terapan & Kimia', 'Pemrograman & AI', 'Biologi & Lingkungan'], defaultValue: 'Robotika & IoT' },
      { key: 'level', label: 'Kelas/Level', kind: 'select', options: ['Kelas 7 SMP', 'Kelas 8 SMP', 'Kelas 9 SMP', 'Semua Kelas SMP'], defaultValue: 'Semua Kelas SMP' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi LKPD…' },
      { key: 'image_url', label: 'Gambar (Otomatis WebP)', kind: 'image' },
      { key: 'pdf_url', label: 'PDF file (unggah dari komputer)', kind: 'image' },
      { key: 'goals', label: 'Tujuan (JSON)', kind: 'json', advanced: true },
      { key: 'tools', label: 'Alat & bahan (JSON)', kind: 'json', advanced: true },
      { key: 'steps', label: 'Langkah (JSON)', kind: 'json', advanced: true },
    ],
  },
  {
    key: 'stem_projects', table: 'stem_projects', label: 'Proyek STEM', group: 'Akademik', icon: Rocket,
    titleField: 'title', subtitleField: 'author_santri', imageField: 'cover_image', badgeField: 'category',
    activeField: 'is_active', sort: { col: 'created_at', asc: false }, slugFrom: 'title',
    fields: [
      { key: 'title', label: 'Judul proyek', kind: 'text', required: true, placeholder: 'Masukkan judul proyek…' },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['IoT & Mikrokontroler', 'Energi Surya & Lingkungan', 'Robotika Otomasi', 'Aplikasi & Sains Data'], defaultValue: 'IoT & Mikrokontroler' },
      { key: 'author_santri', label: 'Nama santri', kind: 'text', placeholder: 'Mis: Santri Kelas 8' },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi proyek…' },
      { key: 'cover_image', label: 'Gambar sampul (Otomatis WebP)', kind: 'image' },
      { key: 'is_portfolio', label: 'Masuk portofolio', kind: 'bool' },
      { key: 'assignment_doc_url', label: 'Dokumen tugas file (unggah dari komputer)', kind: 'image' },
      { key: 'syllabus_url', label: 'Silabus file (unggah dari komputer)', kind: 'image' },
      { key: 'slug', label: 'Alamat (slug)', kind: 'text', advanced: true },
      { key: 'specs', label: 'Spesifikasi (JSON)', kind: 'json', advanced: true },
    ],
  },
  // ───────── MASTER DATA (SuperAdmin)
  {
    key: 'master_data', table: 'master_kelas', label: 'Data Tabel Master', group: 'Manajemen', icon: LayoutDashboard,
    titleField: 'nama_kelas', subtitleField: 'tingkat', badgeField: 'is_active', activeField: 'is_active', sort: { col: 'nama_kelas', asc: true },
    fields: [
      { key: 'nama_kelas', label: 'Nama Kelas', kind: 'text', required: true, placeholder: 'Mis: Kelas 7A' },
      { key: 'tingkat', label: 'Tingkat', kind: 'select', options: ['7', '8', '9'], required: true },
      { key: 'keterangan', label: 'Keterangan', kind: 'textarea', placeholder: 'Tulis keterangan tambahan…' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'master_jabatan', table: 'master_jabatan', label: 'Data Jabatan', group: 'Manajemen', icon: Users,
    titleField: 'nama_jabatan', activeField: 'is_active', sort: { col: 'nama_jabatan', asc: true },
    fields: [
      { key: 'nama_jabatan', label: 'Nama Jabatan', kind: 'text', required: true, placeholder: 'Mis: Kepala Sekolah' },
      { key: 'singkatan', label: 'Singkatan', kind: 'text', placeholder: 'Mis: KS' },
      { key: 'tingkat_kewenangan', label: 'Tingkat Kewenangan', kind: 'select', options: ['Tinggi', 'Sedang', 'Rendah'], defaultValue: 'Sedang' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'master_mapel', table: 'master_mapel', label: 'Data Mata Pelajaran', group: 'Manajemen', icon: BookOpen,
    titleField: 'nama_mapel', activeField: 'is_active', sort: { col: 'nama_mapel', asc: true },
    fields: [
      { key: 'nama_mapel', label: 'Nama Mata Pelajaran', kind: 'text', required: true, placeholder: 'Mis: Agama Islam' },
      { key: 'kode_mapel', label: 'Kode Mapel', kind: 'text', placeholder: 'Mis: AGM-101' },
      { key: 'jenjang', label: 'Jenjang', kind: 'select', options: ['SMP', 'SMA', 'Diniyah'], defaultValue: 'SMP' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'master_kategori', table: 'master_kategori', label: 'Data Kategori', group: 'Manajemen', icon: Layers,
    titleField: 'nama_kategori', activeField: 'is_active', sort: { col: 'nama_kategori', asc: true },
    fields: [
      { key: 'nama_kategori', label: 'Nama Kategori', kind: 'text', required: true, placeholder: 'Mis: Akademik' },
      { key: 'deskripsi', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi kategori…' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'master_sasaran', table: 'master_sasaran', label: 'Data Sasaran', group: 'Manajemen', icon: Target,
    titleField: 'nama_sasaran', activeField: 'is_active', sort: { col: 'nama_sasaran', asc: true },
    fields: [
      { key: 'nama_sasaran', label: 'Nama Sasaran', kind: 'text', required: true, placeholder: 'Mis: Santri Teladan' },
      { key: 'deskripsi', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi sasaran…' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  {
    key: 'master_lokasi', table: 'master_lokasi', label: 'Data Lokasi', group: 'Manajemen', icon: MapPin,
    titleField: 'nama_lokasi', activeField: 'is_active', sort: { col: 'nama_lokasi', asc: true },
    fields: [
      { key: 'nama_lokasi', label: 'Nama Lokasi', kind: 'text', required: true, placeholder: 'Mis: Aula Utama' },
      { key: 'gedung', label: 'Gedung', kind: 'text', placeholder: 'Mis: Gedung Utama' },
      { key: 'kapasitas', label: 'Kapasitas', kind: 'text', placeholder: 'Mis: 500 orang' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  // ───────── DATABASE ASSETS (Tabel Database)
  {
    key: 'database_assets', table: 'programs_pondok', label: 'Database Assets', group: 'Manajemen', icon: Database,
    titleField: 'title', subtitleField: 'description', badgeField: 'category', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Nama Tabel / Program', kind: 'text', required: true },
      { key: 'description', label: 'Deskripsi', kind: 'textarea', placeholder: 'Tulis deskripsi tabel…' },
      { key: 'category', label: 'Kategori Tabel', kind: 'select', options: ['Akademik', 'Keuangan', 'Kehadiran', 'Prestasi', 'Umum'], defaultValue: 'Akademik' },
      { key: 'image_url', label: 'Gambar Ikon (Otomatis WebP)', kind: 'image' },
      { key: 'is_active', label: 'Aktif', kind: 'bool', defaultValue: true },
    ],
  },
  // ───────── PHOTO ASSETS
  {
    key: 'photo_assets', table: 'galeri_foto', label: 'Foto Assets', group: 'Manajemen', icon: Image,
    titleField: 'title', subtitleField: 'description', imageField: 'image_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Judul Foto', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kegiatan OSIS', 'Rapat', 'Lomba', 'Kejahatan', 'Dokumentasi'], defaultValue: 'Kegiatan OSIS' },
      { key: 'description', label: 'Keterangan', kind: 'textarea' },
      { key: 'image_url', label: 'Foto (Otomatis WebP)', kind: 'image', required: true },
      { key: 'location', label: 'Lokasi', kind: 'select', options: GALERI_LOCATION_OPTIONS.slice(0, 8), defaultValue: 'Aula Utama PP. Jauharul Maknuun' },
      { key: 'is_featured', label: 'Unggulan', kind: 'bool' },
    ],
  },
  // ───────── VIDEO ASSETS
  {
    key: 'video_assets', table: 'galeri_videos', label: 'Video Assets', group: 'Manajemen', icon: Video,
    titleField: 'title', subtitleField: 'youtube_url', imageField: 'thumbnail_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Judul Video', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kegiatan OSIS', 'Kajian', 'Pidato', 'Dokumentasi', 'Tutorial'], defaultValue: 'Kegiatan OSIS' },
      { key: 'description', label: 'Keterangan', kind: 'textarea' },
      { key: 'youtube_url', label: 'Tautan YouTube', kind: 'url', required: true },
      { key: 'thumbnail_url', label: 'Thumbnail (Otomatis WebP)', kind: 'image' },
      { key: 'is_featured', label: 'Unggulan', kind: 'bool' },
    ],
  },
  // ───────── DOCUMENT ASSETS
  {
    key: 'document_assets', table: 'osis_events', label: 'Dokumen Assets', group: 'Manajemen', icon: FileText,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_active', sort: { col: 'created_at', asc: false },
    slugFrom: 'title',
    fields: [
      { key: 'title', label: 'Judul Dokumen', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Surat Keputusan', 'Laporan Kegiatan', 'Proposal', 'Pedoman', 'Sertifikat', 'Lainnya'], defaultValue: 'Laporan Kegiatan' },
      { key: 'description', label: 'Deskripsi Dokumen', kind: 'textarea' },
      { key: 'image_url', label: 'Cover Sampul (Otomatis WebP)', kind: 'image' },
      { key: 'content', label: 'Isi Dokumen / Catatan', kind: 'rich' },
      { key: 'is_featured', label: 'Tampilkan Unggulan', kind: 'bool' },
    ],
  },
  // ───────── ARTICLE / NASKAH ASSETS
  {
    key: 'article_assets', table: 'info_terkini', label: 'Artikel / Naskah', group: 'Manajemen', icon: Newspaper,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_published', sort: { col: 'created_at', asc: false },
    slugFrom: 'title', authorField: 'author_id', publishedAtField: 'created_at',
    fields: [
      { key: 'title', label: 'Judul Naskah', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Berita OSIS', 'Pengumuman', 'Prestasi', 'Kegiatan', 'Lainnya'], defaultValue: 'Berita OSIS' },
      { key: 'excerpt', label: 'Ringkasan', kind: 'textarea' },
      { key: 'image_url', label: 'Gambar Sampul (Otomatis WebP)', kind: 'image' },
      { key: 'content', label: 'Isi Naskah / Artikel', kind: 'rich', required: true },
      { key: 'slug', label: 'Alamat (slug)', kind: 'text', advanced: true },
      { key: 'is_featured', label: 'Tampilkan Unggulan', kind: 'bool' },
    ],
  },
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
    activeField: 'is_active', sort: { col: 'date', asc: false },
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
    titleField: 'title', subtitleField: 'department', badgeField: 'frequency', activeField: 'is_active', sort: { col: 'created_at', asc: true },
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
  // ───────── MANAJEMEN OSIS (khusus Pengurus OSIS)
  {
    key: 'osis_data_tabel', table: 'osis_structure', label: 'Data Tabel OSIS', group: 'Manajemen', icon: LayoutDashboard,
    titleField: 'name', subtitleField: 'position', badgeField: 'class', sort: { col: 'order_index', asc: true },
    fields: [
      { key: 'name', label: 'Nama Lengkap', kind: 'text', required: true },
      { key: 'position', label: 'Jabatan', kind: 'text', required: true },
      { key: 'class', label: 'Kelas', kind: 'select', options: ['Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B', 'Kelas 9A', 'Kelas 9B'], defaultValue: 'Kelas 8A' },
      { key: 'level', label: 'Tingkat', kind: 'number', defaultValue: 1 },
      { key: 'period', label: 'Periode', kind: 'text', defaultValue: '2026-2027' },
      { key: 'motto', label: 'Motto', kind: 'text' },
      { key: 'photo_url', label: 'Foto Profil (Otomatis WebP)', kind: 'image' },
    ],
  },
  {
    key: 'osis_foto', table: 'galeri_foto', label: 'Foto OSIS', group: 'Manajemen', icon: Camera,
    titleField: 'title', subtitleField: 'description', imageField: 'image_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Judul Foto', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kegiatan OSIS', 'Rapat', 'Lomba', 'Kejahatan', 'Dokumentasi'], defaultValue: 'Kegiatan OSIS' },
      { key: 'description', label: 'Keterangan', kind: 'textarea' },
      { key: 'image_url', label: 'Foto (Otomatis WebP)', kind: 'image', required: true },
      { key: 'location', label: 'Lokasi', kind: 'select', options: GALERI_LOCATION_OPTIONS.slice(0, 8), defaultValue: 'Aula Utama PP. Jauharul Maknuun' },
      { key: 'is_featured', label: 'Unggulan', kind: 'bool' },
    ],
  },
  {
    key: 'osis_video', table: 'galeri_videos', label: 'Video OSIS', group: 'Manajemen', icon: Video,
    titleField: 'title', subtitleField: 'youtube_url', imageField: 'thumbnail_url', badgeField: 'category',
    orderField: 'order_index', activeField: 'is_active', sort: { col: 'created_at', asc: false },
    fields: [
      { key: 'title', label: 'Judul Video', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Kegiatan OSIS', 'Kajian', 'Pidato', 'Dokumentasi', 'Tutorial'], defaultValue: 'Kegiatan OSIS' },
      { key: 'description', label: 'Keterangan', kind: 'textarea' },
      { key: 'youtube_url', label: 'Tautan YouTube', kind: 'url', required: true },
      { key: 'thumbnail_url', label: 'Thumbnail (Otomatis WebP)', kind: 'image' },
      { key: 'is_featured', label: 'Unggulan', kind: 'bool' },
    ],
  },
  {
    key: 'osis_dokumen', table: 'osis_events', label: 'Dokumen OSIS (PDF, Excel, Word)', group: 'Manajemen', icon: FileText,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_active', sort: { col: 'created_at', asc: false },
    slugFrom: 'title',
    fields: [
      { key: 'title', label: 'Judul Dokumen', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Surat Keputusan', 'Laporan Kegiatan', 'Proposal', 'Pedoman', 'Sertifikat', 'Lainnya'], defaultValue: 'Laporan Kegiatan' },
      { key: 'description', label: 'Deskripsi Dokumen', kind: 'textarea' },
      { key: 'image_url', label: 'Cover Sampul (Otomatis WebP)', kind: 'image' },
      { key: 'content', label: 'Isi Dokumen / Catatan', kind: 'rich' },
      { key: 'is_featured', label: 'Tampilkan Unggulan', kind: 'bool' },
    ],
  },
  {
    key: 'osis_naskah', table: 'info_terkini', label: 'Naskah / Artikel OSIS', group: 'Manajemen', icon: Newspaper,
    titleField: 'title', subtitleField: 'category', imageField: 'image_url', badgeField: 'category',
    activeField: 'is_published', sort: { col: 'created_at', asc: false },
    slugFrom: 'title', authorField: 'author_id', publishedAtField: 'created_at',
    fields: [
      { key: 'title', label: 'Judul Naskah', kind: 'text', required: true },
      { key: 'category', label: 'Kategori', kind: 'select', options: ['Berita OSIS', 'Pengumuman', 'Prestasi', 'Kegiatan', 'Lainnya'], defaultValue: 'Berita OSIS' },
      { key: 'excerpt', label: 'Ringkasan', kind: 'textarea' },
      { key: 'image_url', label: 'Gambar Sampul (Otomatis WebP)', kind: 'image' },
      { key: 'content', label: 'Isi Naskah / Artikel', kind: 'rich', required: true },
      { key: 'slug', label: 'Alamat (slug)', kind: 'text', advanced: true },
      { key: 'is_featured', label: 'Tampilkan Unggulan', kind: 'bool' },
    ],
  },
];

export const crudByKey = (key: string | undefined) => CRUD_SECTIONS.find((s) => s.key === key);
