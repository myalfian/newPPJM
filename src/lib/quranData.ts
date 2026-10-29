/**
 * Dataset & API Helper Mushaf Al-Qur'an 30 Juz (114 Surat Lengkap)
 * Standar Kementerian Agama RI & Audio Murottal Syaikh Misyari Rasyid Al-Afasy
 */

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndo: string;
  numberOfAyahs: number;
  revelationType: 'Makkiyyah' | 'Madaniyyah';
  juzStart: number;
}

export interface JuzMeta {
  juzNumber: number;
  name: string;
  startSurahNumber: number;
  startSurahName: string;
  startAyahNumber: number;
  endSurahNumber: number;
  endSurahName: string;
  endAyahNumber: number;
}

export interface AyahItem {
  numberInSurah: number;
  textArabic: string;
  textLatin: string;
  translationIndo: string;
  audioUrl: string;
  fallbackAudioUrl: string;
  tertiaryAudioUrl?: string;
  quaternaryAudioUrl?: string;
}

// 114 Daftar Surat Al-Qur'an Lengkap
export const QURAN_SURAHS: SurahMeta[] = [
  { number: 1, nameArabic: 'الفاتحة', nameLatin: 'Al-Fatihah', nameIndo: 'Pembukaan', numberOfAyahs: 7, revelationType: 'Makkiyyah', juzStart: 1 },
  { number: 2, nameArabic: 'البقرة', nameLatin: 'Al-Baqarah', nameIndo: 'Sapi Betina', numberOfAyahs: 286, revelationType: 'Madaniyyah', juzStart: 1 },
  { number: 3, nameArabic: 'آل عمران', nameLatin: 'Ali Imran', nameIndo: 'Keluarga Imran', numberOfAyahs: 200, revelationType: 'Madaniyyah', juzStart: 3 },
  { number: 4, nameArabic: 'النساء', nameLatin: 'An-Nisa', nameIndo: 'Wanita', numberOfAyahs: 176, revelationType: 'Madaniyyah', juzStart: 4 },
  { number: 5, nameArabic: 'المائدة', nameLatin: 'Al-Ma\'idah', nameIndo: 'Jamuan Hidangan', numberOfAyahs: 120, revelationType: 'Madaniyyah', juzStart: 6 },
  { number: 6, nameArabic: 'الأنعام', nameLatin: 'Al-An\'am', nameIndo: 'Hewan Ternak', numberOfAyahs: 165, revelationType: 'Makkiyyah', juzStart: 7 },
  { number: 7, nameArabic: 'الأعراف', nameLatin: 'Al-A\'raf', nameIndo: 'Tempat Tertinggi', numberOfAyahs: 206, revelationType: 'Makkiyyah', juzStart: 8 },
  { number: 8, nameArabic: 'الأنفال', nameLatin: 'Al-Anfal', nameIndo: 'Rampasan Perang', numberOfAyahs: 75, revelationType: 'Madaniyyah', juzStart: 9 },
  { number: 9, nameArabic: 'التوبة', nameLatin: 'At-Taubah', nameIndo: 'Pengampunan', numberOfAyahs: 129, revelationType: 'Madaniyyah', juzStart: 10 },
  { number: 10, nameArabic: 'يونس', nameLatin: 'Yunus', nameIndo: 'Nabi Yunus', numberOfAyahs: 109, revelationType: 'Makkiyyah', juzStart: 11 },
  { number: 11, nameArabic: 'هود', nameLatin: 'Hud', nameIndo: 'Nabi Hud', numberOfAyahs: 123, revelationType: 'Makkiyyah', juzStart: 11 },
  { number: 12, nameArabic: 'يوسف', nameLatin: 'Yusuf', nameIndo: 'Nabi Yusuf', numberOfAyahs: 111, revelationType: 'Makkiyyah', juzStart: 12 },
  { number: 13, nameArabic: 'الرعد', nameLatin: 'Ar-Ra\'d', nameIndo: 'Guruh', numberOfAyahs: 43, revelationType: 'Madaniyyah', juzStart: 13 },
  { number: 14, nameArabic: 'إبراهيم', nameLatin: 'Ibrahim', nameIndo: 'Nabi Ibrahim', numberOfAyahs: 52, revelationType: 'Makkiyyah', juzStart: 13 },
  { number: 15, nameArabic: 'الحجر', nameLatin: 'Al-Hijr', nameIndo: 'Bukit Hijr', numberOfAyahs: 99, revelationType: 'Makkiyyah', juzStart: 14 },
  { number: 16, nameArabic: 'النحل', nameLatin: 'An-Nahl', nameIndo: 'Lebah', numberOfAyahs: 128, revelationType: 'Makkiyyah', juzStart: 14 },
  { number: 17, nameArabic: 'الإسراء', nameLatin: 'Al-Isra\'', nameIndo: 'Memperjalankan Malam Hari', numberOfAyahs: 111, revelationType: 'Makkiyyah', juzStart: 15 },
  { number: 18, nameArabic: 'الكهف', nameLatin: 'Al-Kahf', nameIndo: 'Penghuni Gua', numberOfAyahs: 110, revelationType: 'Makkiyyah', juzStart: 15 },
  { number: 19, nameArabic: 'مريم', nameLatin: 'Maryam', nameIndo: 'Siti Maryam', numberOfAyahs: 98, revelationType: 'Makkiyyah', juzStart: 16 },
  { number: 20, nameArabic: 'طه', nameLatin: 'Taha', nameIndo: 'Taha', numberOfAyahs: 135, revelationType: 'Makkiyyah', juzStart: 16 },
  { number: 21, nameArabic: 'الأنبياء', nameLatin: 'Al-Anbiya\'', nameIndo: 'Para Nabi', numberOfAyahs: 112, revelationType: 'Makkiyyah', juzStart: 17 },
  { number: 22, nameArabic: 'الحج', nameLatin: 'Al-Hajj', nameIndo: 'Haji', numberOfAyahs: 78, revelationType: 'Madaniyyah', juzStart: 17 },
  { number: 23, nameArabic: 'المؤمنون', nameLatin: 'Al-Mu\'minun', nameIndo: 'Orang-Orang Mukmin', numberOfAyahs: 118, revelationType: 'Makkiyyah', juzStart: 18 },
  { number: 24, nameArabic: 'النور', nameLatin: 'An-Nur', nameIndo: 'Cahaya', numberOfAyahs: 64, revelationType: 'Madaniyyah', juzStart: 18 },
  { number: 25, nameArabic: 'الفرقان', nameLatin: 'Al-Furqan', nameIndo: 'Pembeda', numberOfAyahs: 77, revelationType: 'Makkiyyah', juzStart: 18 },
  { number: 26, nameArabic: 'الشعراء', nameLatin: 'Asy-Syu\'ara\'', nameIndo: 'Para Penyair', numberOfAyahs: 227, revelationType: 'Makkiyyah', juzStart: 19 },
  { number: 27, nameArabic: 'النمل', nameLatin: 'An-Naml', nameIndo: 'Semut', numberOfAyahs: 93, revelationType: 'Makkiyyah', juzStart: 19 },
  { number: 28, nameArabic: 'القصص', nameLatin: 'Al-Qasas', nameIndo: 'Kisah-Kisah', numberOfAyahs: 88, revelationType: 'Makkiyyah', juzStart: 20 },
  { number: 29, nameArabic: 'العنكبوت', nameLatin: 'Al-\'Ankabut', nameIndo: 'Laba-Laba', numberOfAyahs: 69, revelationType: 'Makkiyyah', juzStart: 20 },
  { number: 30, nameArabic: 'الروم', nameLatin: 'Ar-Rum', nameIndo: 'Bangsa Romawi', numberOfAyahs: 60, revelationType: 'Makkiyyah', juzStart: 21 },
  { number: 31, nameArabic: 'لقمان', nameLatin: 'Luqman', nameIndo: 'Keluarga Luqman', numberOfAyahs: 34, revelationType: 'Makkiyyah', juzStart: 21 },
  { number: 32, nameArabic: 'السجدة', nameLatin: 'As-Sajdah', nameIndo: 'Sujud', numberOfAyahs: 30, revelationType: 'Makkiyyah', juzStart: 21 },
  { number: 33, nameArabic: 'الأحزاب', nameLatin: 'Al-Ahzab', nameIndo: 'Golongan yang Bersekutu', numberOfAyahs: 73, revelationType: 'Madaniyyah', juzStart: 21 },
  { number: 34, nameArabic: 'سبإ', nameLatin: 'Saba\'', nameIndo: 'Kaum Saba\'', numberOfAyahs: 54, revelationType: 'Makkiyyah', juzStart: 22 },
  { number: 35, nameArabic: 'فاطر', nameLatin: 'Fatir', nameIndo: 'Pencipta', numberOfAyahs: 45, revelationType: 'Makkiyyah', juzStart: 22 },
  { number: 36, nameArabic: 'يس', nameLatin: 'Yasin', nameIndo: 'Yasin', numberOfAyahs: 83, revelationType: 'Makkiyyah', juzStart: 22 },
  { number: 37, nameArabic: 'الصافات', nameLatin: 'As-Saffat', nameIndo: 'Barisan-Barisan', numberOfAyahs: 182, revelationType: 'Makkiyyah', juzStart: 23 },
  { number: 38, nameArabic: 'ص', nameLatin: 'Sad', nameIndo: 'Sad', numberOfAyahs: 88, revelationType: 'Makkiyyah', juzStart: 23 },
  { number: 39, nameArabic: 'الزمر', nameLatin: 'Az-Zumar', nameIndo: 'Rombongan', numberOfAyahs: 75, revelationType: 'Makkiyyah', juzStart: 23 },
  { number: 40, nameArabic: 'غافر', nameLatin: 'Ghafir', nameIndo: 'Yang Mengampuni', numberOfAyahs: 85, revelationType: 'Makkiyyah', juzStart: 24 },
  { number: 41, nameArabic: 'فصلت', nameLatin: 'Fussilat', nameIndo: 'Yang Dijelaskan', numberOfAyahs: 54, revelationType: 'Makkiyyah', juzStart: 24 },
  { number: 42, nameArabic: 'الشورى', nameLatin: 'Asy-Syura', nameIndo: 'Musyawarah', numberOfAyahs: 53, revelationType: 'Makkiyyah', juzStart: 25 },
  { number: 43, nameArabic: 'الزخرف', nameLatin: 'Az-Zukhruf', nameIndo: 'Perhiasan', numberOfAyahs: 89, revelationType: 'Makkiyyah', juzStart: 25 },
  { number: 44, nameArabic: 'الدخان', nameLatin: 'Ad-Dukhan', nameIndo: 'Kabut Asap', numberOfAyahs: 59, revelationType: 'Makkiyyah', juzStart: 25 },
  { number: 45, nameArabic: 'الجاثية', nameLatin: 'Al-Jasiyah', nameIndo: 'Yang Berlutut', numberOfAyahs: 37, revelationType: 'Makkiyyah', juzStart: 25 },
  { number: 46, nameArabic: 'الأحقاف', nameLatin: 'Al-Ahqaf', nameIndo: 'Bukit-Bukit Pasir', numberOfAyahs: 35, revelationType: 'Makkiyyah', juzStart: 26 },
  { number: 47, nameArabic: 'محمد', nameLatin: 'Muhammad', nameIndo: 'Nabi Muhammad', numberOfAyahs: 38, revelationType: 'Madaniyyah', juzStart: 26 },
  { number: 48, nameArabic: 'الفتح', nameLatin: 'Al-Fath', nameIndo: 'Kemenangan', numberOfAyahs: 29, revelationType: 'Madaniyyah', juzStart: 26 },
  { number: 49, nameArabic: 'الحجرات', nameLatin: 'Al-Hujurat', nameIndo: 'Kamar-Kamar', numberOfAyahs: 18, revelationType: 'Madaniyyah', juzStart: 26 },
  { number: 50, nameArabic: 'ق', nameLatin: 'Qaf', nameIndo: 'Qaf', numberOfAyahs: 45, revelationType: 'Makkiyyah', juzStart: 26 },
  { number: 51, nameArabic: 'الذاريات', nameLatin: 'Az-Zariyat', nameIndo: 'Angin yang Menerbangkan', numberOfAyahs: 60, revelationType: 'Makkiyyah', juzStart: 26 },
  { number: 52, nameArabic: 'الطور', nameLatin: 'At-Tur', nameIndo: 'Bukit Tursina', numberOfAyahs: 49, revelationType: 'Makkiyyah', juzStart: 27 },
  { number: 53, nameArabic: 'النجم', nameLatin: 'An-Najm', nameIndo: 'Bintang', numberOfAyahs: 62, revelationType: 'Makkiyyah', juzStart: 27 },
  { number: 54, nameArabic: 'القمر', nameLatin: 'Al-Qamar', nameIndo: 'Bulan', numberOfAyahs: 55, revelationType: 'Makkiyyah', juzStart: 27 },
  { number: 55, nameArabic: 'الرحمن', nameLatin: 'Ar-Rahman', nameIndo: 'Yang Maha Pengasih', numberOfAyahs: 78, revelationType: 'Madaniyyah', juzStart: 27 },
  { number: 56, nameArabic: 'الواقعة', nameLatin: 'Al-Waqi\'ah', nameIndo: 'Hari Kiamat', numberOfAyahs: 96, revelationType: 'Makkiyyah', juzStart: 27 },
  { number: 57, nameArabic: 'الحديد', nameLatin: 'Al-Hadid', nameIndo: 'Besi', numberOfAyahs: 29, revelationType: 'Madaniyyah', juzStart: 27 },
  { number: 58, nameArabic: 'المجادلة', nameLatin: 'Al-Mujadilah', nameIndo: 'Gugatan', numberOfAyahs: 22, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 59, nameArabic: 'الحشر', nameLatin: 'Al-Hasyr', nameIndo: 'Pengusiran', numberOfAyahs: 24, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 60, nameArabic: 'الممتحنة', nameLatin: 'Al-Mumtahanah', nameIndo: 'Wanita yang Diuji', numberOfAyahs: 13, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 61, nameArabic: 'الصف', nameLatin: 'As-Saff', nameIndo: 'Barisan', numberOfAyahs: 14, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 62, nameArabic: 'الجمعة', nameLatin: 'Al-Jumu\'ah', nameIndo: 'Hari Jumat', numberOfAyahs: 11, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 63, nameArabic: 'المنافقون', nameLatin: 'Al-Munafiqun', nameIndo: 'Orang-Orang Munafik', numberOfAyahs: 11, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 64, nameArabic: 'التغابن', nameLatin: 'At-Taghabun', nameIndo: 'Hari Ditampakkan Kesalahan', numberOfAyahs: 18, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 65, nameArabic: 'الطلاق', nameLatin: 'At-Talaq', nameIndo: 'Perceraian', numberOfAyahs: 12, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 66, nameArabic: 'التحريم', nameLatin: 'At-Tahrim', nameIndo: 'Pengharaman', numberOfAyahs: 12, revelationType: 'Madaniyyah', juzStart: 28 },
  { number: 67, nameArabic: 'الملك', nameLatin: 'Al-Mulk', nameIndo: 'Kerajaan', numberOfAyahs: 30, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 68, nameArabic: 'القلم', nameLatin: 'Al-Qalam', nameIndo: 'Pena', numberOfAyahs: 52, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 69, nameArabic: 'الحاقة', nameLatin: 'Al-Haqqah', nameIndo: 'Hari Kiamat yang Pasti', numberOfAyahs: 52, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 70, nameArabic: 'المعارج', nameLatin: 'Al-Ma\'arij', nameIndo: 'Tempat Naik', numberOfAyahs: 44, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 71, nameArabic: 'نوح', nameLatin: 'Nuh', nameIndo: 'Nabi Nuh', numberOfAyahs: 28, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 72, nameArabic: 'الجن', nameLatin: 'Al-Jinn', nameIndo: 'Bangsa Jin', numberOfAyahs: 28, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 73, nameArabic: 'المزمل', nameLatin: 'Al-Muzzammil', nameIndo: 'Orang yang Berselimut', numberOfAyahs: 20, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 74, nameArabic: 'المدثر', nameLatin: 'Al-Muddassir', nameIndo: 'Orang yang Berkemul', numberOfAyahs: 56, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 75, nameArabic: 'القيامة', nameLatin: 'Al-Qiyamah', nameIndo: 'Hari Berbangkit', numberOfAyahs: 40, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 76, nameArabic: 'الإنسان', nameLatin: 'Al-Insan', nameIndo: 'Manusia', numberOfAyahs: 31, revelationType: 'Madaniyyah', juzStart: 29 },
  { number: 77, nameArabic: 'المرسلات', nameLatin: 'Al-Mursalat', nameIndo: 'Malaikat yang Diutus', numberOfAyahs: 50, revelationType: 'Makkiyyah', juzStart: 29 },
  { number: 78, nameArabic: 'النبإ', nameLatin: 'An-Naba\'', nameIndo: 'Berita Besar', numberOfAyahs: 40, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 79, nameArabic: 'النازعات', nameLatin: 'An-Nazi\'at', nameIndo: 'Malaikat yang Mencabut', numberOfAyahs: 46, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 80, nameArabic: 'عبس', nameLatin: '\'Abasa', nameIndo: 'Bermuka Masam', numberOfAyahs: 42, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 81, nameArabic: 'التكوير', nameLatin: 'At-Takwir', nameIndo: 'Penggulungan', numberOfAyahs: 29, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 82, nameArabic: 'الانفطار', nameLatin: 'Al-Infitar', nameIndo: 'Terbelah', numberOfAyahs: 19, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 83, nameArabic: 'المطففين', nameLatin: 'Al-Mutaffifin', nameIndo: 'Orang yang Curang', numberOfAyahs: 36, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 84, nameArabic: 'الانشقاق', nameLatin: 'Al-Insyiqaq', nameIndo: 'Terbelah', numberOfAyahs: 25, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 85, nameArabic: 'البروج', nameLatin: 'Al-Buruj', nameIndo: 'Gugusan Bintang', numberOfAyahs: 22, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 86, nameArabic: 'الطارق', nameLatin: 'At-Tariq', nameIndo: 'Yang Datang di Malam Hari', numberOfAyahs: 17, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 87, nameArabic: 'الأعلى', nameLatin: 'Al-A\'la', nameIndo: 'Yang Maha Tinggi', numberOfAyahs: 19, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 88, nameArabic: 'الغاشية', nameLatin: 'Al-Ghasyiyah', nameIndo: 'Hari Pembalasan yang Menyelubungi', numberOfAyahs: 26, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 89, nameArabic: 'الفجر', nameLatin: 'Al-Fajr', nameIndo: 'Waktu Fajar', numberOfAyahs: 30, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 90, nameArabic: 'البلد', nameLatin: 'Al-Balad', nameIndo: 'Negeri', numberOfAyahs: 20, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 91, nameArabic: 'الشمس', nameLatin: 'Asy-Syams', nameIndo: 'Matahari', numberOfAyahs: 15, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 92, nameArabic: 'الليل', nameLatin: 'Al-Lail', nameIndo: 'Malam', numberOfAyahs: 21, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 93, nameArabic: 'الضحى', nameLatin: 'Ad-Duha', nameIndo: 'Waktu Dhuha', numberOfAyahs: 11, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 94, nameArabic: 'الشرح', nameLatin: 'Asy-Syarh', nameIndo: 'Kelapangan', numberOfAyahs: 8, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 95, nameArabic: 'التين', nameLatin: 'At-Tin', nameIndo: 'Buah Tin', numberOfAyahs: 8, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 96, nameArabic: 'العلق', nameLatin: 'Al-\'Alaq', nameIndo: 'Segumpal Darah', numberOfAyahs: 19, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 97, nameArabic: 'القدر', nameLatin: 'Al-Qadr', nameIndo: 'Kemuliaan', numberOfAyahs: 5, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 98, nameArabic: 'البينة', nameLatin: 'Al-Bayyinah', nameIndo: 'Bukti yang Nyata', numberOfAyahs: 8, revelationType: 'Madaniyyah', juzStart: 30 },
  { number: 99, nameArabic: 'الزلزلة', nameLatin: 'Az-Zalzalah', nameIndo: 'Keguncangan', numberOfAyahs: 8, revelationType: 'Madaniyyah', juzStart: 30 },
  { number: 100, nameArabic: 'العاديات', nameLatin: 'Al-\'Adiyat', nameIndo: 'Kuda Perang yang Berlari Kencang', numberOfAyahs: 11, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 101, nameArabic: 'القارعة', nameLatin: 'Al-Qari\'ah', nameIndo: 'Hari Kiamat yang Menggegerkan', numberOfAyahs: 11, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 102, nameArabic: 'التكاثر', nameLatin: 'At-Takasur', nameIndo: 'Bermegah-Megahan', numberOfAyahs: 8, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 103, nameArabic: 'العصر', nameLatin: 'Al-\'Asr', nameIndo: 'Masa / Waktu Asar', numberOfAyahs: 3, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 104, nameArabic: 'الهمزة', nameLatin: 'Al-Humazah', nameIndo: 'Pengumpat', numberOfAyahs: 9, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 105, nameArabic: 'الفيل', nameLatin: 'Al-Fil', nameIndo: 'Gajah', numberOfAyahs: 5, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 106, nameArabic: 'قريش', nameLatin: 'Quraisy', nameIndo: 'Suku Quraisy', numberOfAyahs: 4, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 107, nameArabic: 'الماعون', nameLatin: 'Al-Ma\'un', nameIndo: 'Barang-Barang Berguna', numberOfAyahs: 7, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 108, nameArabic: 'الكوثر', nameLatin: 'Al-Kausar', nameIndo: 'Nikmat yang Berlimpah', numberOfAyahs: 3, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 109, nameArabic: 'الكافرون', nameLatin: 'Al-Kafirun', nameIndo: 'Orang-Orang Kafir', numberOfAyahs: 6, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 110, nameArabic: 'النصر', nameLatin: 'An-Nasr', nameIndo: 'Pertolongan', numberOfAyahs: 3, revelationType: 'Madaniyyah', juzStart: 30 },
  { number: 111, nameArabic: 'المسد', nameLatin: 'Al-Lahab', nameIndo: 'Gejolak Api', numberOfAyahs: 5, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 112, nameArabic: 'الإخلاص', nameLatin: 'Al-Ikhlas', nameIndo: 'Keesaan Allah', numberOfAyahs: 4, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 113, nameArabic: 'الفلق', nameLatin: 'Al-Falaq', nameIndo: 'Waktu Subuh', numberOfAyahs: 5, revelationType: 'Makkiyyah', juzStart: 30 },
  { number: 114, nameArabic: 'الناس', nameLatin: 'An-Nas', nameIndo: 'Manusia', numberOfAyahs: 6, revelationType: 'Makkiyyah', juzStart: 30 },
];

// Daftar 30 Juz Al-Qur'an
export const QURAN_JUZ_LIST: JuzMeta[] = [
  { juzNumber: 1, name: 'Juz 1', startSurahNumber: 1, startSurahName: 'Al-Fatihah', startAyahNumber: 1, endSurahNumber: 2, endSurahName: 'Al-Baqarah', endAyahNumber: 141 },
  { juzNumber: 2, name: 'Juz 2', startSurahNumber: 2, startSurahName: 'Al-Baqarah', startAyahNumber: 142, endSurahNumber: 2, endSurahName: 'Al-Baqarah', endAyahNumber: 252 },
  { juzNumber: 3, name: 'Juz 3', startSurahNumber: 2, startSurahName: 'Al-Baqarah', startAyahNumber: 253, endSurahNumber: 3, endSurahName: 'Ali Imran', endAyahNumber: 92 },
  { juzNumber: 4, name: 'Juz 4', startSurahNumber: 3, startSurahName: 'Ali Imran', startAyahNumber: 93, endSurahNumber: 4, endSurahName: 'An-Nisa', endAyahNumber: 23 },
  { juzNumber: 5, name: 'Juz 5', startSurahNumber: 4, startSurahName: 'An-Nisa', startAyahNumber: 24, endSurahNumber: 4, endSurahName: 'An-Nisa', endAyahNumber: 147 },
  { juzNumber: 6, name: 'Juz 6', startSurahNumber: 4, startSurahName: 'An-Nisa', startAyahNumber: 148, endSurahNumber: 5, endSurahName: 'Al-Ma\'idah', endAyahNumber: 81 },
  { juzNumber: 7, name: 'Juz 7', startSurahNumber: 5, startSurahName: 'Al-Ma\'idah', startAyahNumber: 82, endSurahNumber: 6, endSurahName: 'Al-An\'am', endAyahNumber: 110 },
  { juzNumber: 8, name: 'Juz 8', startSurahNumber: 6, startSurahName: 'Al-An\'am', startAyahNumber: 111, endSurahNumber: 7, endSurahName: 'Al-A\'raf', endAyahNumber: 87 },
  { juzNumber: 9, name: 'Juz 9', startSurahNumber: 7, startSurahName: 'Al-A\'raf', startAyahNumber: 88, endSurahNumber: 8, endSurahName: 'Al-Anfal', endAyahNumber: 40 },
  { juzNumber: 10, name: 'Juz 10', startSurahNumber: 8, startSurahName: 'Al-Anfal', startAyahNumber: 41, endSurahNumber: 9, endSurahName: 'At-Taubah', endAyahNumber: 92 },
  { juzNumber: 11, name: 'Juz 11', startSurahNumber: 9, startSurahName: 'At-Taubah', startAyahNumber: 93, endSurahNumber: 11, endSurahName: 'Hud', endAyahNumber: 5 },
  { juzNumber: 12, name: 'Juz 12', startSurahNumber: 11, startSurahName: 'Hud', startAyahNumber: 6, endSurahNumber: 12, endSurahName: 'Yusuf', endAyahNumber: 52 },
  { juzNumber: 13, name: 'Juz 13', startSurahNumber: 12, startSurahName: 'Yusuf', startAyahNumber: 53, endSurahNumber: 14, endSurahName: 'Ibrahim', endAyahNumber: 52 },
  { juzNumber: 14, name: 'Juz 14', startSurahNumber: 15, startSurahName: 'Al-Hijr', startAyahNumber: 1, endSurahNumber: 16, endSurahName: 'An-Nahl', endAyahNumber: 128 },
  { juzNumber: 15, name: 'Juz 15', startSurahNumber: 17, startSurahName: 'Al-Isra\'', startAyahNumber: 1, endSurahNumber: 18, endSurahName: 'Al-Kahf', endAyahNumber: 74 },
  { juzNumber: 16, name: 'Juz 16', startSurahNumber: 18, startSurahName: 'Al-Kahf', startAyahNumber: 75, endSurahNumber: 20, endSurahName: 'Taha', endAyahNumber: 135 },
  { juzNumber: 17, name: 'Juz 17', startSurahNumber: 21, startSurahName: 'Al-Anbiya\'', startAyahNumber: 1, endSurahNumber: 22, endSurahName: 'Al-Hajj', endAyahNumber: 78 },
  { juzNumber: 18, name: 'Juz 18', startSurahNumber: 23, startSurahName: 'Al-Mu\'minun', startAyahNumber: 1, endSurahNumber: 25, endSurahName: 'Al-Furqan', endAyahNumber: 20 },
  { juzNumber: 19, name: 'Juz 19', startSurahNumber: 25, startSurahName: 'Al-Furqan', startAyahNumber: 21, endSurahNumber: 27, endSurahName: 'An-Naml', endAyahNumber: 55 },
  { juzNumber: 20, name: 'Juz 20', startSurahNumber: 27, startSurahName: 'An-Naml', startAyahNumber: 56, endSurahNumber: 29, endSurahName: 'Al-\'Ankabut', endAyahNumber: 45 },
  { juzNumber: 21, name: 'Juz 21', startSurahNumber: 29, startSurahName: 'Al-\'Ankabut', startAyahNumber: 46, endSurahNumber: 33, endSurahName: 'Al-Ahzab', endAyahNumber: 30 },
  { juzNumber: 22, name: 'Juz 22', startSurahNumber: 33, startSurahName: 'Al-Ahzab', startAyahNumber: 31, endSurahNumber: 36, endSurahName: 'Yasin', endAyahNumber: 27 },
  { juzNumber: 23, name: 'Juz 23', startSurahNumber: 36, startSurahName: 'Yasin', startAyahNumber: 28, endSurahNumber: 39, endSurahName: 'Az-Zumar', endAyahNumber: 31 },
  { juzNumber: 24, name: 'Juz 24', startSurahNumber: 39, startSurahName: 'Az-Zumar', startAyahNumber: 32, endSurahNumber: 41, endSurahName: 'Fussilat', endAyahNumber: 46 },
  { juzNumber: 25, name: 'Juz 25', startSurahNumber: 41, startSurahName: 'Fussilat', startAyahNumber: 47, endSurahNumber: 45, endSurahName: 'Al-Jasiyah', endAyahNumber: 37 },
  { juzNumber: 26, name: 'Juz 26', startSurahNumber: 46, startSurahName: 'Al-Ahqaf', startAyahNumber: 1, endSurahNumber: 51, endSurahName: 'Az-Zariyat', endAyahNumber: 30 },
  { juzNumber: 27, name: 'Juz 27', startSurahNumber: 51, startSurahName: 'Az-Zariyat', startAyahNumber: 31, endSurahNumber: 57, endSurahName: 'Al-Hadid', endAyahNumber: 29 },
  { juzNumber: 28, name: 'Juz 28', startSurahNumber: 58, startSurahName: 'Al-Mujadilah', startAyahNumber: 1, endSurahNumber: 66, endSurahName: 'At-Tahrim', endAyahNumber: 12 },
  { juzNumber: 29, name: 'Juz 29', startSurahNumber: 67, startSurahName: 'Al-Mulk', startAyahNumber: 1, endSurahNumber: 77, endSurahName: 'Al-Mursalat', endAyahNumber: 50 },
  { juzNumber: 30, name: 'Juz 30 (Juz \'Amma)', startSurahNumber: 78, startSurahName: 'An-Naba\'', startAyahNumber: 1, endSurahNumber: 114, endSurahName: 'An-Nas', endAyahNumber: 6 }
];

// In-memory cache for loaded Ayahs
const surahCache = new Map<number, AyahItem[]>();

// Hitung nomor ayat global seluruh Al-Qur'an (1 - 6236) untuk CDN Islamic Network
export function getGlobalAyahNumber(surahNumber: number, ayahNumberInSurah: number): number {
  let globalIndex = 0;
  for (let i = 0; i < surahNumber - 1; i++) {
    globalIndex += QURAN_SURAHS[i]?.numberOfAyahs || 0;
  }
  return globalIndex + ayahNumberInSurah;
}

// Fallback ayat autentik offline untuk Al-Fatihah
export const SAMPLE_AL_FATIHAH: AyahItem[] = [
  {
    numberInSurah: 1,
    textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    textLatin: 'Bismillāhir-raḥmānir-raḥīm(i)',
    translationIndo: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3'
  },
  {
    numberInSurah: 2,
    textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    textLatin: 'Al-ḥamdu lillāhi rabbil-‘ālamīn(a)',
    translationIndo: 'Segala puji bagi Allah, Tuhan semesta alam,',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001002.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/2.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3'
  },
  {
    numberInSurah: 3,
    textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    textLatin: 'Ar-raḥmānir-raḥīm(i)',
    translationIndo: 'Yang Maha Pengasih lagi Maha Penyayang,',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001003.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/3.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001003.mp3'
  },
  {
    numberInSurah: 4,
    textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
    textLatin: 'Māliki yaumid-dīn(i)',
    translationIndo: 'Pemilik hari Pembalasan.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001004.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/4.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001004.mp3'
  },
  {
    numberInSurah: 5,
    textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    textLatin: 'Iyyāka na‘budu wa iyyāka nasta‘īn(u)',
    translationIndo: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001005.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/5.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3'
  },
  {
    numberInSurah: 6,
    textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    textLatin: 'Ihdinaṣ-ṣirāṭal-mustaqīm(a)',
    translationIndo: 'Tunjukilah kami jalan yang lurus,',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001006.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/6.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001006.mp3'
  },
  {
    numberInSurah: 7,
    textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    textLatin: 'Ṣirāṭal-lażīna an‘amta ‘alaihim, gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn(a)',
    translationIndo: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001007.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/7.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3'
  }
];

export const SAMPLE_AL_IKHLAS: AyahItem[] = [
  {
    numberInSurah: 1,
    textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    textLatin: 'Qul huwallāhu aḥad(un)',
    translationIndo: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/112001.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/6222.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3'
  },
  {
    numberInSurah: 2,
    textArabic: 'اللَّهُ الصَّمَدُ',
    textLatin: 'Allāhuṣ-ṣamad(u)',
    translationIndo: 'Allah tempat meminta segala sesuatu.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/112002.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/6223.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112002.mp3'
  },
  {
    numberInSurah: 3,
    textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    textLatin: 'Lam yalid wa lam yūlad',
    translationIndo: '(Allah) tidak beranak dan tidak pula diperanakkan,',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/112003.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/6224.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112003.mp3'
  },
  {
    numberInSurah: 4,
    textArabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    textLatin: 'Wa lam yakul lahū kufuwan aḥad(un)',
    translationIndo: 'dan tidak ada sesuatu pun yang setara dengan Dia.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3',
    fallbackAudioUrl: 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/112004.mp3',
    tertiaryAudioUrl: 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/6225.mp3',
    quaternaryAudioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112004.mp3'
  }
];

/**
 * Fetch Ayat-Ayat per Surat dari API Kemenag / EQuran ID (dengan caching & fallback multi-CDN)
 */
export async function fetchSurahAyahs(surahNumber: number): Promise<AyahItem[]> {
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  const sNum = String(surahNumber).padStart(3, '0');

  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data.ayat)) {
      const items: AyahItem[] = data.data.ayat.map((item: any) => {
        const aNum = String(item.nomorAyat).padStart(3, '0');
        const globalNum = getGlobalAyahNumber(surahNumber, item.nomorAyat);

        // 1. Primary: Islamic Network 128kbps (Singapore S3, bebas blokir di Indonesia)
        const islamicNetAudio = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3`;
        // 2. Secondary: EQuran ID Indonesian cloud
        const eqAudio = item.audio?.['05'] || `https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/${sNum}${aNum}.mp3`;
        // 3. Tertiary: Islamic Network 64kbps (ringan & cepat)
        const islamicNetAudio64 = `https://cdn.islamic.network/quran/audio/64/ar.alafasy/${globalNum}.mp3`;
        // 4. Quaternary: EveryAyah global CDN
        const everyAyahAudio = `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`;

        return {
          numberInSurah: item.nomorAyat,
          textArabic: item.teksArab,
          textLatin: item.teksLatin,
          translationIndo: item.teksIndonesia,
          audioUrl: islamicNetAudio,
          fallbackAudioUrl: eqAudio,
          tertiaryAudioUrl: islamicNetAudio64,
          quaternaryAudioUrl: everyAyahAudio
        };
      });

      surahCache.set(surahNumber, items);
      return items;
    }
  } catch (e) {
    console.warn(`Mengambil fallback lokal atau alternatif untuk surat ${surahNumber}:`, e);
  }

  // Fallback offline jika internet offline atau API down
  if (surahNumber === 112) return SAMPLE_AL_IKHLAS;
  if (surahNumber === 1) return SAMPLE_AL_FATIHAH;

  // Generic fallback generator for offline viewing
  const targetSurah = QURAN_SURAHS.find((s) => s.number === surahNumber);
  const count = targetSurah ? Math.min(targetSurah.numberOfAyahs, 10) : 7;
  const genericList: AyahItem[] = Array.from({ length: count }, (_, idx) => {
    const aNum = String(idx + 1).padStart(3, '0');
    const globalNum = getGlobalAyahNumber(surahNumber, idx + 1);
    return {
      numberInSurah: idx + 1,
      textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      textLatin: `Ayat ${idx + 1} Surat ${targetSurah?.nameLatin || ''}`,
      translationIndo: `Terjemahan ayat ke-${idx + 1} surat ${targetSurah?.nameLatin || ''}.`,
      audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3`,
      fallbackAudioUrl: `https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/${sNum}${aNum}.mp3`,
      tertiaryAudioUrl: `https://cdn.islamic.network/quran/audio/64/ar.alafasy/${globalNum}.mp3`,
      quaternaryAudioUrl: `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`
    };
  });

  return genericList;
}
