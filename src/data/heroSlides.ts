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

export const initialHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'Sambutan Utama',
    title: 'Selamat Datang di PP Jauharul Maknuun',
    desc: 'Membentuk generasi Qur\'ani yang berakhlak mulia, mandiri, dan berwawasan global.',
    image: '/images/hero/flyer-selamat-datang.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1512632570417-a6032a69792d?auto=format&fit=crop&w=1600&q=85',
    btnText: 'Jelajahi Profil',
    link: '/jm-center/sambutan',
    cardTheme: 'from-[#052817] via-[#094226] to-[#041c10]',
    badgeTheme: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
    tagColor: 'text-[#d4af37]',
    btnTheme: 'from-[#0a6847] via-[#0f5132] to-[#10b981]',
    website: 'https://ppjauharulmaknuun.sch.id/',
  },
  {
    id: 'slide-2',
    badge: 'Kurikulum & Pembinaan',
    title: 'Program Unggulan Terpadu',
    desc: 'Integrasi kurikulum pesantren salaf dan modern dengan penguatan karakter kepemimpinan.',
    image: '/images/hero/flyer-program-unggulan.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=85',
    btnText: 'Lihat Program',
    link: '/program-unggulan/program-sekolah',
    cardTheme: 'from-[#072448] via-[#09356b] to-[#051c38]',
    badgeTheme: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200',
    tagColor: 'text-[#67e8f9]',
    btnTheme: 'from-[#2563eb] via-[#1d4ed8] to-[#0284c7]',
    website: 'https://ppjauharulmaknuun.sch.id/',
  },
  {
    id: 'slide-3',
    badge: 'Prestasi & Mutu',
    title: 'Terakreditasi A & Berbasis STEM',
    desc: 'Standar pendidikan unggul dengan pembelajaran sains, teknologi, rekayasa, dan matematika.',
    image: '/images/hero/flyer-akreditasi-stem.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
    btnText: 'Pelajari Kurikulum',
    link: '/smart-jm/stem/materi',
    cardTheme: 'from-[#032924] via-[#07473f] to-[#021f1b]',
    badgeTheme: 'bg-teal-500/20 border-teal-400/40 text-teal-200',
    tagColor: 'text-[#5eead4]',
    btnTheme: 'from-[#0d9488] via-[#0f766e] to-[#14b8a6]',
    website: 'https://ppjauharulmaknuun.sch.id/',
  },
  {
    id: 'slide-4',
    badge: 'Agenda & Prestasi Santri',
    title: 'Lomba Tilawatil Qur\'an',
    desc: 'Menyiapkan qari dan qari\'ah berprestasi dengan pembinaan intensif serta tartil berstandar.',
    image: '/images/hero/flyer-lomba-tilawah.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
    btnText: 'Informasi Lomba',
    link: '/karya-siswa',
    cardTheme: 'from-[#311b06] via-[#4d2a09] to-[#241304]',
    badgeTheme: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
    tagColor: 'text-[#fde047]',
    btnTheme: 'from-[#d97706] via-[#b45309] to-[#f59e0b]',
    website: 'https://ppjauharulmaknuun.sch.id/',
  },
  {
    id: 'slide-5',
    badge: 'Kompetisi Akademik',
    title: 'Lomba Cerdas Cermat Tingkat SD & SMP se-Jawa Timur',
    desc: 'Ajang unjuk ketajaman wawasan, sains, dan literasi antar-pelajar terbaik tingkat regional.',
    image: '/images/hero/flyer-cerdas-cermat.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85',
    btnText: 'Daftar Sekarang',
    link: '/spmb#formulir',
    cardTheme: 'from-[#200d33] via-[#371656] to-[#160924]',
    badgeTheme: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
    tagColor: 'text-[#e879f9]',
    btnTheme: 'from-[#9333ea] via-[#7e22ce] to-[#c084fc]',
    website: 'https://ppjauharulmaknuun.sch.id/',
  },
];
