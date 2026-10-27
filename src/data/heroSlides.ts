export interface HeroSlide {
  id: string;
  badge: string;
  title?: string;
  desc?: string;
  image: string;
  tag?: string;
  cardTheme?: string;
  badgeTheme?: string;
  tagColor?: string;
  btnTheme?: string;
  btnText?: string;
  link?: string;
  tagline?: string;
  website?: string;
}

export const initialHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: "Takhassus Al-Qur'an Bersanad",
    title: "Program Tahfidzul Qur'an 30 Juz Bersanad Muttashil",
    desc: "Bimbingan hafalan Al-Qur'an intensif dengan talaqqi musyafahah bersanad hingga Rasulullah SAW serta dukungan evaluasi Murojaah AI mandiri.",
    website: 'https://ppjauharulmaknuun.sch.id/',
    //High-resolution Sheikh Zayed Grand Mosque glowing in warm amber twilight with water reflection (matches screenshot)
    image: 'https://images.unsplash.com/photo-1512632570417-a6032a69792d?auto=format&fit=crop&w=1200&q=85',
    cardTheme: 'from-[#08357a] via-[#093c8a] to-[#062c66]',
    badgeTheme: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
    tagColor: 'text-[#ffcc00]',
    btnTheme: 'from-[#ffcc00] via-[#eab308] to-[#ca8a04]'
  },
  {
    id: 'slide-2',
    badge: 'Pendidikan Islam Unggulan Berkarakter',
    title: 'Pembentukan Akhlaqul Karimah & Kepemimpinan Santri',
    desc: 'Integrasi pendidikan pesantren salafiyah dan kurikulum formal terpadu untuk mencetak generasi ulama intelek yang berakhlak mulia.',
    website: 'https://ppjauharulmaknuun.sch.id/',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    cardTheme: 'from-[#08357a] via-[#093c8a] to-[#062c66]',
    badgeTheme: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200',
    tagColor: 'text-[#ffcc00]',
    btnTheme: 'from-[#ffcc00] via-[#facc15] to-[#eab308]'
  },
  {
    id: 'slide-3',
    badge: 'Khasanah Keilmuan Pesantren Nusantara',
    title: 'Kajian Kitab Kuning Turats Berjenjang (Madin Salafiyah)',
    desc: 'Pendalaman ilmu alat (Nahwu & Shorof), Fiqih, Ushul Fiqih, dan Tasawuf melalui kajian kitab kuning bersanad di bawah asuhan Masyayikh.',
    website: 'https://ppjauharulmaknuun.sch.id/',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    cardTheme: 'from-[#08357a] via-[#093c8a] to-[#062c66]',
    badgeTheme: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
    tagColor: 'text-[#ffcc00]',
    btnTheme: 'from-[#ffcc00] via-[#eab308] to-[#ca8a04]'
  },
  {
    id: 'slide-4',
    badge: 'Inovasi Sains & Teknologi Terpadu',
    title: 'Laboratorium Riset STEM, Robotika & IoT Santri',
    desc: 'Wadah eksplorasi sains terapan santri meliputi otomasi pertanian hidroponik, mikrokontroler, energi terbarukan, dan rekayasa tepat guna.',
    website: 'https://ppjauharulmaknuun.sch.id/',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    cardTheme: 'from-[#08357a] via-[#093c8a] to-[#062c66]',
    badgeTheme: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
    tagColor: 'text-[#ffcc00]',
    btnTheme: 'from-[#ffcc00] via-[#eab308] to-[#ca8a04]'
  },
  {
    id: 'slide-5',
    badge: 'Wawasan Global Bahasa Dunia',
    title: 'Bimbingan Intensif Bahasa Arab & Mandarin Aktif',
    desc: 'Pembekalan komunikasi dwibahasa internasional (Arab & Mandarin) untuk menyiapkan dakwah dan studi lanjut santri ke kancah global.',
    website: 'https://ppjauharulmaknuun.sch.id/',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    cardTheme: 'from-[#08357a] via-[#093c8a] to-[#062c66]',
    badgeTheme: 'bg-blue-500/20 border-blue-400/40 text-blue-200',
    tagColor: 'text-[#ffcc00]',
    btnTheme: 'from-[#ffcc00] via-[#eab308] to-[#ca8a04]'
  }
];
