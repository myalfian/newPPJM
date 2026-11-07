export interface HeroSlide {
  id: string;
  badge: string; // Tag/Kategori (e.g. Sambutan Utama, Kurikulum & Pembinaan)
  tag?: string; // Tag opsional
  title?: string; // Judul
  desc?: string; // Deskripsi Singkat
  image: string; // URL Flyer/Gambar utama
  fallbackImage?: string; // Fallback gambar HD jika file lokal belum dimuat
  btnText?: string; // Teks CTA
  link?: string; // Link tujuan CTA
  cardTheme?: string;
  badgeTheme?: string;
  tagColor?: string;
  btnTheme?: string;
  tagline?: string;
  website?: string;
}

export const initialHeroSlides: HeroSlide[] = [];
