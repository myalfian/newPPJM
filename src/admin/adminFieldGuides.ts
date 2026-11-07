/**
 * Centralized Field Guides & Helper Tooltips for Admin & Role CMS
 * Provides consistent labels, placeholders, helper text, and accessibility hints.
 */

export interface FieldGuide {
  label?: string;
  placeholder?: string;
  help?: string;
  tooltip?: string;
}

export const COMMON_FIELD_GUIDES: Record<string, FieldGuide> = {
  title: {
    label: 'Judul Konten',
    placeholder: 'Masukkan judul konten yang informatif dan ringkas…',
    help: 'Judul ini akan menjadi tajuk utama yang tampil kepada publik dan mesin pencari (SEO).',
    tooltip: 'Tuliskan judul dengan jelas, hindari huruf kapital semua.',
  },
  name: {
    label: 'Nama Lengkap / Nama Entitas',
    placeholder: 'Mis: Ustadz Ahmad Fauzi, S.Pd.I',
    help: 'Nama resmi atau penamaan entitas untuk kartu profil publik.',
    tooltip: 'Masukkan gelar akademik atau kehormatan secara rapi.',
  },
  description: {
    label: 'Deskripsi / Ulasan Lengkap',
    placeholder: 'Tuliskan deskripsi lengkap, latar belakang, atau ringkasan materi…',
    help: 'Uraikan secara detail namun mudah dipahami oleh santri, wali santri, dan masyarakat umum.',
    tooltip: 'Gunakan paragraf yang rapi untuk kenyamanan pembaca.',
  },
  excerpt: {
    label: 'Ringkasan Cepat (Kutipan)',
    placeholder: 'Tuliskan 1-2 kalimat ringkasan pengantar…',
    help: 'Kutipan singkat yang muncul pada pratinjau kartu berita atau info terkini.',
    tooltip: 'Maksimal 160 karakter agar tidak terpotong pada layar ponsel.',
  },
  category: {
    label: 'Kategori / Bidang',
    placeholder: 'Pilih salah satu kategori…',
    help: 'Kategori digunakan untuk pengelompokan dan penyaringan otomatis pada tab publik.',
    tooltip: 'Pilih kategori yang paling sesuai dengan isi materi.',
  },
  location: {
    label: 'Lokasi Penayangan & Pelaksanaan',
    placeholder: 'Pilih lokasi penayangan…',
    help: 'Tentukan lokasi fisik kegiatan atau halaman mana saja yang akan menampilkan konten ini.',
    tooltip: 'Konten dengan tag "Beranda" akan otomatis tayang di halaman depan.',
  },
  image_url: {
    label: 'Foto / Gambar Utama (Otomatis WebP)',
    placeholder: 'Unggah file foto atau masukkan URL…',
    help: 'Format JPG, PNG, atau WebP. Foto otomatis dikompresi ke WebP (target ≤ 320 KB) tanpa memotong proporsi.',
    tooltip: 'Klik untuk memilih foto dari perangkat Anda. Resolusi optimal 1600×1000 px.',
  },
  photos: {
    label: 'Foto Slider Kegiatan (Multi-Foto)',
    placeholder: 'Pilih 3 foto untuk slider…',
    help: 'Unggah hingga 3 foto kegiatan. Kartu publik akan otomatis bertransformasi menjadi slider beranimasi.',
    tooltip: 'Semua foto slider otomatis dikonversi ke format WebP ringan.',
  },
  youtube_url: {
    label: 'Tautan Video YouTube',
    placeholder: 'https://www.youtube.com/watch?v=... atau https://youtu.be/...',
    help: 'Tempel tautan video YouTube resmi pondok. Pemutar video interaktif akan disematkan otomatis.',
    tooltip: 'Pastikan status visibilitas video di YouTube disetel Publik atau Tidak Terdaftar (Unlisted).',
  },
  order_index: {
    label: 'Urutan Tampil',
    placeholder: '0, 1, 2…',
    help: 'Angka lebih kecil tampil lebih awal di halaman publik. Anda juga bisa menggeser baris secara langsung.',
    tooltip: 'Nilai default 0 menandakan prioritas teratas.',
  },
  is_active: {
    label: 'Status Penayangan Publik',
    help: 'Jika aktif (hijau), data dapat diakses oleh publik/guest. Jika dinonaktifkan, data hanya terlihat oleh admin/role internal.',
    tooltip: 'Klik ikon mata untuk mengaktifkan atau menonaktifkan visibilitas publik.',
  },
  is_featured: {
    label: 'Sorot sebagai Unggulan',
    help: 'Konten bertanda unggulan akan diprioritaskan di baris pertama atau carousel banner beranda.',
    tooltip: 'Tandai jika konten ini memiliki urgensi atau nilai prestasi tinggi.',
  },
  year: {
    label: 'Tahun Kegiatan',
    placeholder: 'Mis: 2026',
    help: 'Tahun pelaksanaan kegiatan atau perolehan prestasi.',
    tooltip: 'Gunakan format 4 digit tahun Masehi.',
  },
  date_display: {
    label: 'Teks Tampilan Tanggal',
    placeholder: 'Contoh: 12 - 19 Oktober 2026',
    help: 'Format tanggal ramah manusia yang dibaca pengunjung pada kalender agenda.',
    tooltip: 'Bisa berupa rentang tanggal atau satu hari pelaksanaan.',
  },
};

/**
 * Get the best field guide matching section and field key
 */
export function getFieldGuide(fieldKey: string, sectionKey?: string): FieldGuide {
  // If specific section-field guide exists
  const specificKey = sectionKey ? `${sectionKey}.${fieldKey}` : '';
  if (specificKey && COMMON_FIELD_GUIDES[specificKey]) {
    return COMMON_FIELD_GUIDES[specificKey];
  }
  return COMMON_FIELD_GUIDES[fieldKey] || {};
}
