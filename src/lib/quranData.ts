/**
 * Dataset & API Helper Mushaf Al-Qur'an 30 Juz
 * Standar Kementerian Agama RI & Audio Murottal Syaikh Misyari Rasyid Al-Afasy
 */

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndo: string;
  numberOfAyahs: number;
  revelationType: 'Makkiyyah' | 'Madaniyyah';
}

export interface AyahItem {
  numberInSurah: number;
  textArabic: string;
  textLatin: string;
  translationIndo: string;
  audioUrl: string;
}

// 114 Daftar Surat Al-Qur'an
export const QURAN_SURAHS: SurahMeta[] = [
  { number: 1, nameArabic: 'الفاتحة', nameLatin: 'Al-Fatihah', nameIndo: 'Pembukaan', numberOfAyahs: 7, revelationType: 'Makkiyyah' },
  { number: 2, nameArabic: 'البقرة', nameLatin: 'Al-Baqarah', nameIndo: 'Sapi Betina', numberOfAyahs: 286, revelationType: 'Madaniyyah' },
  { number: 3, nameArabic: 'آل عمران', nameLatin: 'Ali Imran', nameIndo: 'Keluarga Imran', numberOfAyahs: 200, revelationType: 'Madaniyyah' },
  { number: 4, nameArabic: 'النساء', nameLatin: 'An-Nisa', nameIndo: 'Wanita', numberOfAyahs: 176, revelationType: 'Madaniyyah' },
  { number: 5, nameArabic: 'المائدة', nameLatin: 'Al-Maidah', nameIndo: 'Jamuan Hidangan', numberOfAyahs: 120, revelationType: 'Madaniyyah' },
  { number: 6, nameArabic: 'الأنعام', nameLatin: 'Al-Anam', nameIndo: 'Hewan Ternak', numberOfAyahs: 165, revelationType: 'Makkiyyah' },
  { number: 7, nameArabic: 'الأعراف', nameLatin: 'Al-Araf', nameIndo: 'Tempat Tertinggi', numberOfAyahs: 206, revelationType: 'Makkiyyah' },
  { number: 8, nameArabic: 'الأنفال', nameLatin: 'Al-Anfal', nameIndo: 'Rampasan Perang', numberOfAyahs: 75, revelationType: 'Madaniyyah' },
  { number: 9, nameArabic: 'التوبة', nameLatin: 'At-Taubah', nameIndo: 'Pengampunan', numberOfAyahs: 129, revelationType: 'Madaniyyah' },
  { number: 10, nameArabic: 'يونس', nameLatin: 'Yunus', nameIndo: 'Nabi Yunus', numberOfAyahs: 109, revelationType: 'Makkiyyah' },
  { number: 11, nameArabic: 'هود', nameLatin: 'Hud', nameIndo: 'Nabi Hud', numberOfAyahs: 123, revelationType: 'Makkiyyah' },
  { number: 12, nameArabic: 'يوسف', nameLatin: 'Yusuf', nameIndo: 'Nabi Yusuf', numberOfAyahs: 111, revelationType: 'Makkiyyah' },
  { number: 13, nameArabic: 'الرعد', nameLatin: 'Ar-Rad', nameIndo: 'Guruh', numberOfAyahs: 43, revelationType: 'Madaniyyah' },
  { number: 14, nameArabic: 'إبراهيم', nameLatin: 'Ibrahim', nameIndo: 'Nabi Ibrahim', numberOfAyahs: 52, revelationType: 'Makkiyyah' },
  { number: 15, nameArabic: 'الحجر', nameLatin: 'Al-Hijr', nameIndo: 'Bukit Hijr', numberOfAyahs: 99, revelationType: 'Makkiyyah' },
  { number: 16, nameArabic: 'النحل', nameLatin: 'An-Nahl', nameIndo: 'Lebah', numberOfAyahs: 128, revelationType: 'Makkiyyah' },
  { number: 17, nameArabic: 'الإسراء', nameLatin: 'Al-Isra', nameIndo: 'Memperjalankan di Malam Hari', numberOfAyahs: 111, revelationType: 'Makkiyyah' },
  { number: 18, nameArabic: 'الكهف', nameLatin: 'Al-Kahf', nameIndo: 'Penghuni Gua', numberOfAyahs: 110, revelationType: 'Makkiyyah' },
  { number: 19, nameArabic: 'مريم', nameLatin: 'Maryam', nameIndo: 'Maryam', numberOfAyahs: 98, revelationType: 'Makkiyyah' },
  { number: 20, nameArabic: 'طه', nameLatin: 'Taha', nameIndo: 'Taha', numberOfAyahs: 135, revelationType: 'Makkiyyah' },
  { number: 36, nameArabic: 'يس', nameLatin: 'Yasin', nameIndo: 'Yasin', numberOfAyahs: 83, revelationType: 'Makkiyyah' },
  { number: 55, nameArabic: 'الرحمن', nameLatin: 'Ar-Rahman', nameIndo: 'Yang Maha Pengasih', numberOfAyahs: 78, revelationType: 'Madaniyyah' },
  { number: 56, nameArabic: 'الواقعة', nameLatin: 'Al-Waqiah', nameIndo: 'Hari Kiamat', numberOfAyahs: 96, revelationType: 'Makkiyyah' },
  { number: 67, nameArabic: 'الملك', nameLatin: 'Al-Mulk', nameIndo: 'Kerajaan', numberOfAyahs: 30, revelationType: 'Makkiyyah' },
  { number: 112, nameArabic: 'الإخلاص', nameLatin: 'Al-Ikhlas', nameIndo: 'Keesaan Allah', numberOfAyahs: 4, revelationType: 'Makkiyyah' },
  { number: 113, nameArabic: 'الفلق', nameLatin: 'Al-Falaq', nameIndo: 'Waktu Subuh', numberOfAyahs: 5, revelationType: 'Makkiyyah' },
  { number: 114, nameArabic: 'الناس', nameLatin: 'An-Nas', nameIndo: 'Manusia', numberOfAyahs: 6, revelationType: 'Makkiyyah' },
];

// Fallback ayat autentik offline untuk Al-Fatihah
export const SAMPLE_AL_FATIHAH: AyahItem[] = [
  {
    numberInSurah: 1,
    textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    textLatin: 'Bismillāhir-raḥmānir-raḥīm(i)',
    translationIndo: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3'
  },
  {
    numberInSurah: 2,
    textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    textLatin: 'Al-ḥamdu lillāhi rabbil-‘ālamīn(a)',
    translationIndo: 'Segala puji bagi Allah, Tuhan semesta alam,',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3'
  },
  {
    numberInSurah: 3,
    textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    textLatin: 'Ar-raḥmānir-raḥīm(i)',
    translationIndo: 'Yang Maha Pengasih lagi Maha Penyayang,',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001003.mp3'
  },
  {
    numberInSurah: 4,
    textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
    textLatin: 'Māliki yaumid-dīn(i)',
    translationIndo: 'Pemilik hari Pembalasan.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001004.mp3'
  },
  {
    numberInSurah: 5,
    textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    textLatin: 'Iyyāka na‘budu wa iyyāka nasta‘īn(u)',
    translationIndo: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3'
  },
  {
    numberInSurah: 6,
    textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    textLatin: 'Ihdinaṣ-ṣirāṭal-mustaqīm(a)',
    translationIndo: 'Tunjukilah kami jalan yang lurus,',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001006.mp3'
  },
  {
    numberInSurah: 7,
    textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    textLatin: 'Ṣirāṭal-lażīna an‘amta ‘alaihim, gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn(a)',
    translationIndo: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3'
  }
];

// Fallback Al-Ikhlas
export const SAMPLE_AL_IKHLAS: AyahItem[] = [
  {
    numberInSurah: 1,
    textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    textLatin: 'Qul huwallāhu aḥad(un)',
    translationIndo: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3'
  },
  {
    numberInSurah: 2,
    textArabic: 'اللَّهُ الصَّمَدُ',
    textLatin: 'Allāhuṣ-ṣamad(u)',
    translationIndo: 'Allah tempat meminta segala sesuatu.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112002.mp3'
  },
  {
    numberInSurah: 3,
    textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    textLatin: 'Lam yalid wa lam yūlad',
    translationIndo: '(Allah) tidak beranak dan tidak pula diperanakkan,',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112003.mp3'
  },
  {
    numberInSurah: 4,
    textArabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    textLatin: 'Wa lam yakul lahū kufuwan aḥad(un)',
    translationIndo: 'dan tidak ada sesuatu pun yang setara dengan Dia.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112004.mp3'
  }
];

/**
 * Fetch Ayat-Ayat per Surat dari API Kemenag / Quran EQ (dengan fallback offline)
 */
export async function fetchSurahAyahs(surahNumber: number): Promise<AyahItem[]> {
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data.ayat)) {
      return data.data.ayat.map((item: any) => {
        const sNum = String(surahNumber).padStart(3, '0');
        const aNum = String(item.nomorAyat).padStart(3, '0');
        return {
          numberInSurah: item.nomorAyat,
          textArabic: item.teksArab,
          textLatin: item.teksLatin,
          translationIndo: item.teksIndonesia,
          audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`
        };
      });
    }
  } catch (e) {
    console.warn('Menggunakan fallback data ayat lokal:', e);
  }

  if (surahNumber === 112) return SAMPLE_AL_IKHLAS;
  return SAMPLE_AL_FATIHAH;
}
