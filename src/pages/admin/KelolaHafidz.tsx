import React, { useState, useRef, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  Pause,
  Clock,
  Search,
  FileCheck2,
  Sparkles,
  Volume2,
  Check,
  RotateCcw,
  Award,
  HelpCircle,
  Save,
  CheckCheck,
  Upload,
  Music,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Filter,
  Eye,
  Download,
  Headphones,
  Radio,
  Mic,
  VolumeX,
  Maximize2,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Sliders,
  Layers,
  Globe,
  FolderArchive,
  X,
  FileAudio,
  CheckCircle,
  MicOff,
  Flame,
  ArrowRight,
  GripVertical
} from 'lucide-react';
import { QURAN_SURAHS, SurahMeta } from '../../lib/quranData';
import { compressImageToWebP } from '../../lib/imageCompressor';

// --- TIPE DATA ---

interface ReciterItem {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  style: string;
  surahCount: number;
  quality: '64 kbps' | '128 kbps' | '320 kbps HD';
  avatar: string;
  audioSampleUrl: string;
  isDefault?: boolean;
}

interface SetoranRecord {
  id: string;
  santriName: string;
  kelas: string;
  juzCurrent: number;
  lastSurah: string;
  lastAyahRange: string;
  totalSetoran: number;
  kelancaranScore: number;
  tajwidScore: number;
  makhorijScore: number;
  pembimbing: string;
  tanggalSetoran: string;
  status: 'Lancar' | 'Perlu Murojaah' | 'Tidak Lancar';
  teacherNote: string;
  history: { bulan: string; juz: number }[];
}

interface AyahDetail {
  numberInSurah: number;
  textArabic: string;
  textLatin: string;
  translationIndo: string;
  audioUrl: string;
}

interface ClozeQuestion {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  fullAyahArabic: string;
  words: string[];
  hiddenIndices: number[];
  options: { [key: number]: string[] };
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  timerSeconds: number;
  audioUrl: string;
}

// --- DATA MASTER 15 RECITER MUROTTAL ---
const MASTER_RECITERS: ReciterItem[] = [
  {
    id: 'reciter-1',
    name: 'Syaikh Misyari Rasyid Al-Afasy',
    arabicName: 'مشاري بن راشد العفاسي',
    country: 'Kuwait 🇰🇼',
    style: 'Murattal Fusha Tartil',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    isDefault: true
  },
  {
    id: 'reciter-2',
    name: 'Syaikh Abdurrahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    country: 'Arab Saudi 🇸🇦',
    style: 'Imam Besar Masjidil Haram',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001001.mp3'
  },
  {
    id: 'reciter-3',
    name: 'Syaikh Saud Asy-Syuraim',
    arabicName: 'سعود بن إبراهيم الشريم',
    country: 'Arab Saudi 🇸🇦',
    style: 'Khas Tarawih Makkah',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps/001001.mp3'
  },
  {
    id: 'reciter-4',
    name: 'Syaikh Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    country: 'Arab Saudi 🇸🇦',
    style: 'Imam Masjidil Haram (Penuh Khusyu)',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/MaherAlMuaiqly128kbps/001001.mp3'
  },
  {
    id: 'reciter-5',
    name: "Syaikh Sa'ad Al-Ghamidi",
    arabicName: 'سعد الغامدي',
    country: 'Arab Saudi 🇸🇦',
    style: 'Irama Tartil Cepat & Jelas',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Ghamadi_40kbps/001001.mp3'
  },
  {
    id: 'reciter-6',
    name: 'Syaikh Mahmud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    country: 'Mesir 🇪🇬',
    style: 'Standar Emas Tajwid & Muallim',
    surahCount: 114,
    quality: '320 kbps HD',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Husary_128kbps/001001.mp3'
  },
  {
    id: 'reciter-7',
    name: 'Syaikh Abdul Basit Abdul Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    country: 'Mesir 🇪🇬',
    style: 'Legendaris Mujawwad Dunia',
    surahCount: 114,
    quality: '320 kbps HD',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/001001.mp3'
  },
  {
    id: 'reciter-8',
    name: 'Syaikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    country: 'Mesir 🇪🇬',
    style: 'Murattal Tangisan Jiwa',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Minshawy_Murattal_128kbps/001001.mp3'
  },
  {
    id: 'reciter-9',
    name: 'Syaikh Abdullah Basfar',
    arabicName: 'عبد الله بصفر',
    country: 'Arab Saudi 🇸🇦',
    style: 'Pelafalan Jelas Ramah Santri',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Abdullah_Basfar_192kbps/001001.mp3'
  },
  {
    id: 'reciter-10',
    name: 'Syaikh Abu Bakr Asy-Syathiri',
    arabicName: 'أبو بكر الشاطري',
    country: 'Arab Saudi 🇸🇦',
    style: 'Murattal Modern & Ringan',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/001001.mp3'
  },
  {
    id: 'reciter-11',
    name: "Syaikh Hani Ar-Rifa'i",
    arabicName: 'هاني الرفاعي',
    country: 'Arab Saudi 🇸🇦',
    style: 'Irama Syahdu & Menghanyutkan',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Hani_Rifai_192kbps/001001.mp3'
  },
  {
    id: 'reciter-12',
    name: 'Syekh Ali Jaber (Rahimahullah)',
    arabicName: 'علي صالح علي جابر',
    country: 'Madinah / RI 🇮🇩',
    style: 'Murattal Santun & Teduh',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Ali_Jaber_64kbps/001001.mp3'
  },
  {
    id: 'reciter-13',
    name: 'Syaikh Yasser Ad-Dussary',
    arabicName: 'ياسر الدوسري',
    country: 'Arab Saudi 🇸🇦',
    style: 'Imam Masjidil Haram Berkarakter',
    surahCount: 114,
    quality: '320 kbps HD',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/001001.mp3'
  },
  {
    id: 'reciter-14',
    name: 'Syaikh Bandar Balila',
    arabicName: 'بندر بليلة',
    country: 'Arab Saudi 🇸🇦',
    style: 'Imam Masjidil Haram Khas Hijazi',
    surahCount: 114,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://everyayah.com/data/Bandar_Baleela_128kbps/001001.mp3'
  },
  {
    id: 'reciter-15',
    name: 'Ustadz Ahmad Farhan (Qari PPJM)',
    arabicName: 'أحمد فرحان المحمود',
    country: 'Indonesia (PPJM) 🇮🇩',
    style: 'Tartil Santri Teladan & Muallim',
    surahCount: 30,
    quality: '128 kbps',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    audioSampleUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3'
  }
];

// --- DATA SAMPLE EVALUASI SETORAN SANTRI ---
const INITIAL_SETORAN: SetoranRecord[] = [
  {
    id: 'st-1',
    santriName: 'Ahmad Zaki Al-Faruq',
    kelas: 'IX-A',
    juzCurrent: 14,
    lastSurah: 'Al-Hijr',
    lastAyahRange: 'Ayat 1 - 45',
    totalSetoran: 28,
    kelancaranScore: 94,
    tajwidScore: 92,
    makhorijScore: 90,
    pembimbing: 'Ustadz H. Abdullah Faqih',
    tanggalSetoran: 'Hari ini, 10:15 WIB',
    status: 'Lancar',
    teacherNote: 'Makharijul huruf fasih, dengung ikhfa dan ghunnah sudah sangat proporsional.',
    history: [
      { bulan: 'Jan', juz: 8 },
      { bulan: 'Feb', juz: 9 },
      { bulan: 'Mar', juz: 11 },
      { bulan: 'Apr', juz: 12 },
      { bulan: 'Mei', juz: 13 },
      { bulan: 'Jun', juz: 14 }
    ]
  },
  {
    id: 'st-2',
    santriName: 'Muhammad Farhan Maulana',
    kelas: 'VIII-B',
    juzCurrent: 8,
    lastSurah: 'Al-Anfal',
    lastAyahRange: 'Ayat 1 - 30',
    totalSetoran: 21,
    kelancaranScore: 88,
    tajwidScore: 85,
    makhorijScore: 86,
    pembimbing: 'Ustadz M. Rizky Maulana',
    tanggalSetoran: 'Hari ini, 08:30 WIB',
    status: 'Lancar',
    teacherNote: 'Bagus, pertahankan tempo tartil, jangan tergesa pada waqaf lazim.',
    history: [
      { bulan: 'Jan', juz: 4 },
      { bulan: 'Feb', juz: 5 },
      { bulan: 'Mar', juz: 6 },
      { bulan: 'Apr', juz: 7 },
      { bulan: 'Mei', juz: 7 },
      { bulan: 'Jun', juz: 8 }
    ]
  },
  {
    id: 'st-3',
    santriName: 'Hilmi Abdullah Syakir',
    kelas: 'VII-C',
    juzCurrent: 3,
    lastSurah: "Ali 'Imran",
    lastAyahRange: 'Ayat 101 - 130',
    totalSetoran: 15,
    kelancaranScore: 78,
    tajwidScore: 76,
    makhorijScore: 75,
    pembimbing: 'Ustadz H. Abdullah Faqih',
    tanggalSetoran: 'Kemarin, 19:45 WIB',
    status: 'Perlu Murojaah',
    teacherNote: 'Perhatikan panjang mad wajib muttashil 4-5 harakat dan ketukan ikhfa syafawi.',
    history: [
      { bulan: 'Jan', juz: 1 },
      { bulan: 'Feb', juz: 1 },
      { bulan: 'Mar', juz: 2 },
      { bulan: 'Apr', juz: 2 },
      { bulan: 'Mei', juz: 3 },
      { bulan: 'Jun', juz: 3 }
    ]
  },
  {
    id: 'st-4',
    santriName: 'Aisyah Nur Rahmah',
    kelas: 'X Tahfidz',
    juzCurrent: 18,
    lastSurah: 'Al-Mu’minun',
    lastAyahRange: 'Ayat 1 - 50',
    totalSetoran: 34,
    kelancaranScore: 98,
    tajwidScore: 96,
    makhorijScore: 96,
    pembimbing: 'Ustadzah Fauziyah Al-Hafidzah',
    tanggalSetoran: '29 Okt 2026, 16:00 WIB',
    status: 'Lancar',
    teacherNote: 'Mumtaz Murtafa’ (Istimewa). Bacaan lembut, tartil konsisten, waqaf dan ibtida sangat tepat.',
    history: [
      { bulan: 'Jan', juz: 12 },
      { bulan: 'Feb', juz: 13 },
      { bulan: 'Mar', juz: 15 },
      { bulan: 'Apr', juz: 16 },
      { bulan: 'Mei', juz: 17 },
      { bulan: 'Jun', juz: 18 }
    ]
  },
  {
    id: 'st-5',
    santriName: 'Fajar Shiddiq',
    kelas: 'VII-A',
    juzCurrent: 2,
    lastSurah: 'Al-Baqarah',
    lastAyahRange: 'Ayat 142 - 176',
    totalSetoran: 9,
    kelancaranScore: 68,
    tajwidScore: 70,
    makhorijScore: 65,
    pembimbing: 'Ustadz M. Rizky Maulana',
    tanggalSetoran: '28 Okt 2026, 14:20 WIB',
    status: 'Tidak Lancar',
    teacherNote: 'Masih sering terhenti pada peralihan ayat, wajib mengulang murojaah 3 kali sebelum setor kembali.',
    history: [
      { bulan: 'Jan', juz: 1 },
      { bulan: 'Feb', juz: 1 },
      { bulan: 'Mar', juz: 1 },
      { bulan: 'Apr', juz: 2 },
      { bulan: 'Mei', juz: 2 },
      { bulan: 'Jun', juz: 2 }
    ]
  }
];

// --- SOAL LATIHAN CLOZE TEST (MUROJAAH AI) ---
const INITIAL_CLOZE_QUESTIONS: ClozeQuestion[] = [
  {
    id: 'cloze-1',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 2,
    fullAyahArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    words: ['الْحَمْدُ', 'لِلَّهِ', 'رَبِّ', 'الْعَالَمِينَ'],
    hiddenIndices: [1], // 'لِلَّهِ'
    options: {
      1: ['لِلَّهِ', 'الرَّحْمَٰنِ', 'الْمَلِكِ', 'الصَّمَدِ']
    },
    difficulty: 'Mudah',
    timerSeconds: 45,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3'
  },
  {
    id: 'cloze-2',
    surahNumber: 2,
    surahName: 'Al-Baqarah (Ayat Kursi)',
    ayahNumber: 255,
    fullAyahArabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    words: ['اللَّهُ', 'لَا', 'إِلَٰهَ', 'إِلَّا', 'هُوَ', 'الْحَيُّ', 'الْقَيُّومُ', 'لَا', 'تَأْخُذُهُ', 'سِنَةٌ', 'وَلَا', 'نَوْمٌ'],
    hiddenIndices: [5, 6], // 'الْحَيُّ', 'الْقَيُّومُ'
    options: {
      5: ['الْحَيُّ', 'الْعَلِيُّ', 'الْعَظِيمُ', 'الْقَدِيرُ'],
      6: ['الْقَيُّومُ', 'الْغَفُورُ', 'الرَّحِيمُ', 'السَّمِيعُ']
    },
    difficulty: 'Sedang',
    timerSeconds: 60,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
  },
  {
    id: 'cloze-3',
    surahNumber: 67,
    surahName: 'Al-Mulk',
    ayahNumber: 1,
    fullAyahArabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    words: ['تَبَارَكَ', 'الَّذِي', 'بِيَدِهِ', 'الْمُلْكُ', 'وَهُوَ', 'عَلَىٰ', 'كُلِّ', 'شَيْءٍ', 'قَدِيرٌ'],
    hiddenIndices: [3, 8], // 'الْمُلْكُ', 'قَدِيرٌ'
    options: {
      3: ['الْمُلْكُ', 'الْحُكْمُ', 'الْأَمْرُ', 'الْخَلْقُ'],
      8: ['قَدِيرٌ', 'بَصِيرٌ', 'عَلِيمٌ', 'خَبِيرٌ']
    },
    difficulty: 'Sedang',
    timerSeconds: 60,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3'
  },
  {
    id: 'cloze-4',
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    ayahNumber: 2,
    fullAyahArabic: 'اللَّهُ الصَّمَدُ',
    words: ['اللَّهُ', 'الصَّمَدُ'],
    hiddenIndices: [1], // 'الصَّمَدُ'
    options: {
      1: ['الصَّمَدُ', 'الْأَحَدُ', 'الرَّحْمَٰنُ', 'الْقُدُّوسُ']
    },
    difficulty: 'Mudah',
    timerSeconds: 30,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3'
  }
];

export const KelolaHafidz: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'surat' | 'audio' | 'setoran' | 'cloze'>('surat');

  // --- TAB A: MONITORING 114 SURAT ---
  const [surahSearch, setSurahSearch] = useState('');
  const [surahFilterType, setSurahFilterType] = useState<'Semua' | 'Makkiyyah' | 'Madaniyyah'>('Semua');
  const [surahFilterJuz, setSurahFilterJuz] = useState<number | 'Semua'>('Semua');
  const [selectedSurahModal, setSelectedSurahModal] = useState<SurahMeta | null>(null);
  const [surahAyahs, setSurahAyahs] = useState<AyahDetail[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);

  // --- TAB B: AUDIO MUROTTAL RECITERS ---
  const [reciters, setReciters] = useState<ReciterItem[]>(MASTER_RECITERS);
  const [selectedReciter, setSelectedReciter] = useState<ReciterItem>(MASTER_RECITERS[0]);
  const [draggedReciterIdx, setDraggedReciterIdx] = useState<number | null>(null);
  const [draggedClozeIdx, setDraggedClozeIdx] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMissingAudioModal, setShowMissingAudioModal] = useState(false);
  const [isScanningAudio, setIsScanningAudio] = useState(false);
  const [scanResult, setScanResult] = useState<{ checked: number; missing: number; status: string } | null>(null);

  // Audio Player Dock State
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLoopingAyah, setIsLoopingAyah] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Upload Form State
  const [uploadSurahNum, setUploadSurahNum] = useState<number>(1);
  const [uploadAyahStart, setUploadAyahStart] = useState<number>(1);
  const [uploadAyahEnd, setUploadAyahEnd] = useState<number>(1);
  const [uploadReciterId, setUploadReciterId] = useState<string>(MASTER_RECITERS[0].id);
  const [uploadFileName, setUploadFileName] = useState<string>('');

  // --- TAB C: EVALUASI SETORAN SANTRI ---
  const [records, setRecords] = useState<SetoranRecord[]>(INITIAL_SETORAN);
  const [searchSantri, setSearchSantri] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterPembimbing, setFilterPembimbing] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedChartSantri, setSelectedChartSantri] = useState<string>(INITIAL_SETORAN[0].id);
  const [showSetoranModal, setShowSetoranModal] = useState(false);

  // Form Evaluasi State
  const [formSantriName, setFormSantriName] = useState('');
  const [formKelas, setFormKelas] = useState('IX-A');
  const [formJuz, setFormJuz] = useState<number>(1);
  const [formSurah, setFormSurah] = useState('Al-Fatihah');
  const [formAyahRange, setFormAyahRange] = useState('Ayat 1 - 7');
  const [formKelancaran, setFormKelancaran] = useState<number>(90);
  const [formTajwid, setFormTajwid] = useState<number>(90);
  const [formMakhorij, setFormMakhorij] = useState<number>(90);
  const [formPembimbing, setFormPembimbing] = useState('Ustadz H. Abdullah Faqih');
  const [formNote, setFormNote] = useState('');
  const [formDocPhoto, setFormDocPhoto] = useState<string>('');

  // --- TAB D: LATIHAN MUROJAAH AI (CLOZE TEST) ---
  const [clozeList, setClozeList] = useState<ClozeQuestion[]>(INITIAL_CLOZE_QUESTIONS);
  const [activeClozeIndex, setActiveClozeIndex] = useState<number>(0);
  const [userSelectedWords, setUserSelectedWords] = useState<{ [hiddenIndex: number]: string }>({});
  const [clozeSubmitted, setClozeSubmitted] = useState<boolean>(false);
  const [clozeScore, setClozeScore] = useState<number | null>(null);
  const [isSpeechListening, setIsSpeechListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');

  // Builder State
  const [builderSurahNumber, setBuilderSurahNumber] = useState<number>(1);
  const [builderAyahText, setBuilderAyahText] = useState<string>('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  const [builderWords, setBuilderWords] = useState<string[]>(['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ']);
  const [builderHiddenIndices, setBuilderHiddenIndices] = useState<number[]>([2]); // default hide 'الرَّحْمَٰنِ'
  const [builderDifficulty, setBuilderDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Mudah');
  const [builderTimer, setBuilderTimer] = useState<number>(45);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- AUDIO CONTROLLER ENGINE ---
  const togglePlayAudio = (url: string, ayahNum?: number) => {
    if (playingAudioUrl === url) {
      if (audioPlayerRef.current) {
        if (audioPlayerRef.current.paused) {
          audioPlayerRef.current.play();
        } else {
          audioPlayerRef.current.pause();
          setPlayingAudioUrl(null);
        }
      }
      return;
    }

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(url);
    } else {
      audioPlayerRef.current.src = url;
    }

    try {
      audioPlayerRef.current.load();
    } catch {
      // Ignored
    }

    audioPlayerRef.current.playbackRate = playbackSpeed;
    audioPlayerRef.current.loop = isLoopingAyah;

    audioPlayerRef.current.onended = () => {
      if (!isLoopingAyah) {
        setPlayingAudioUrl(null);
        setCurrentPlayingAyah(null);
      }
    };

    audioPlayerRef.current
      .play()
      .then(() => {
        setPlayingAudioUrl(url);
        if (ayahNum !== undefined) setCurrentPlayingAyah(ayahNum);
      })
      .catch((err) => {
        console.warn('Audio playback error:', err);
        showToast('Gagal memutar audio: CDN sedang memuat ulang');
      });
  };

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = spd;
    }
  };

  const toggleLoopAyah = () => {
    const nextVal = !isLoopingAyah;
    setIsLoopingAyah(nextVal);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.loop = nextVal;
    }
    showToast(nextVal ? 'Mode Ulang Ayat: AKTIF' : 'Mode Ulang Ayat: NONAKTIF');
  };

  // --- TAB A: OPEN SURAH MODAL & FETCH AYAHS ---
  const handleOpenSurahDetail = async (surah: SurahMeta) => {
    setSelectedSurahModal(surah);
    setIsLoadingAyahs(true);
    setSurahAyahs([]);

    const sNum = String(surah.number).padStart(3, '0');

    try {
      const res = await fetch(`https://equran.id/api/v2/surat/${surah.number}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.ayat && Array.isArray(data.data.ayat)) {
          const list: AyahDetail[] = data.data.ayat.map((a: any) => {
            const aNum = String(a.nomorAyat).padStart(3, '0');
            return {
              numberInSurah: a.nomorAyat,
              textArabic: a.teksArab,
              textLatin: a.teksLatin,
              translationIndo: a.teksIndonesia,
              audioUrl: a.audio?.['05'] || `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`
            };
          });
          setSurahAyahs(list);
          setIsLoadingAyahs(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback local sample ayat:', e);
    }

    // Fallback generator jika offline
    const count = Math.min(surah.numberOfAyahs, 7);
    const mockAyahs: AyahDetail[] = Array.from({ length: count }, (_, idx) => ({
      numberInSurah: idx + 1,
      textArabic:
        idx === 0
          ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
          : 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ',
      textLatin: `Ayat ${idx + 1} Surat ${surah.nameLatin}`,
      translationIndo: `Terjemahan Kemenag RI ayat ke-${idx + 1} Surat ${surah.nameLatin} (${surah.nameIndo}).`,
      audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${sNum}${String(idx + 1).padStart(3, '0')}.mp3`
    }));

    setSurahAyahs(mockAyahs);
    setIsLoadingAyahs(false);
  };

  // --- FILTERED SURAHS ---
  const filteredSurahs = useMemo(() => {
    return QURAN_SURAHS.filter((s) => {
      const matchSearch =
        s.nameLatin.toLowerCase().includes(surahSearch.toLowerCase()) ||
        s.nameIndo.toLowerCase().includes(surahSearch.toLowerCase()) ||
        s.nameArabic.includes(surahSearch) ||
        String(s.number).includes(surahSearch);

      const matchType = surahFilterType === 'Semua' || s.revelationType === surahFilterType;
      const matchJuz = surahFilterJuz === 'Semua' || s.juzStart === Number(surahFilterJuz);

      return matchSearch && matchType && matchJuz;
    });
  }, [surahSearch, surahFilterType, surahFilterJuz]);

  // --- TAB B: AUDIO MISSING SCANNER SIMULATION ---
  const handleScanMissingAudio = () => {
    setIsScanningAudio(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanningAudio(false);
      setScanResult({
        checked: 6236,
        missing: 0,
        status: '100% Lengkap. Seluruh 6.236 Ayat 15 Reciter sinkron dengan CDN Islamic Network & EveryAyah.'
      });
      showToast('Pemeriksaan Audio Selesai: 100% Siap Diputar!');
    }, 1800);
  };

  const handleSaveUploadAudio = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Audio Berhasil Diunggah! Ditautkan ke Surat #${uploadSurahNum} Ayat ${uploadAyahStart}-${uploadAyahEnd}`);
    setShowUploadModal(false);
    setUploadFileName('');
  };

  // --- TAB C: FORM EVALUASI SETORAN SANTRI ---
  const handleSaveNewSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSantriName.trim()) {
      showToast('Nama Santri wajib diisi!');
      return;
    }

    const avgScore = Math.round((formKelancaran + formTajwid + formMakhorij) / 3);
    let derivedStatus: 'Lancar' | 'Perlu Murojaah' | 'Tidak Lancar' = 'Lancar';
    if (avgScore < 75) derivedStatus = 'Tidak Lancar';
    else if (avgScore < 85) derivedStatus = 'Perlu Murojaah';

    const newRecord: SetoranRecord = {
      id: `st-${Date.now()}`,
      santriName: formSantriName,
      kelas: formKelas,
      juzCurrent: formJuz,
      lastSurah: formSurah,
      lastAyahRange: formAyahRange,
      totalSetoran: 1,
      kelancaranScore: formKelancaran,
      tajwidScore: formTajwid,
      makhorijScore: formMakhorij,
      pembimbing: formPembimbing,
      tanggalSetoran: 'Hari ini, baru saja',
      status: derivedStatus,
      teacherNote: formNote || 'Setoran hafalan telah diverifikasi.',
      history: [
        { bulan: 'Apr', juz: Math.max(1, formJuz - 2) },
        { bulan: 'Mei', juz: Math.max(1, formJuz - 1) },
        { bulan: 'Jun', juz: formJuz }
      ]
    };

    setRecords([newRecord, ...records]);
    setShowSetoranModal(false);
    showToast('Data Setoran Santri Berhasil Disimpan & Masuk Buku Rapor!');

    // Reset Form
    setFormSantriName('');
    setFormNote('');
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.santriName.toLowerCase().includes(searchSantri.toLowerCase()) ||
        r.lastSurah.toLowerCase().includes(searchSantri.toLowerCase());
      const matchKelas = filterKelas === 'Semua' || r.kelas === filterKelas;
      const matchPembimbing = filterPembimbing === 'Semua' || r.pembimbing === filterPembimbing;
      const matchStatus = filterStatus === 'Semua' || r.status === filterStatus;
      return matchSearch && matchKelas && matchPembimbing && matchStatus;
    });
  }, [records, searchSantri, filterKelas, filterPembimbing, filterStatus]);

  const activeChartSantriData = useMemo(() => {
    return records.find((r) => r.id === selectedChartSantri) || records[0];
  }, [records, selectedChartSantri]);

  // --- TAB D: CLOZE TEST LOGIC ---
  const currentCloze = clozeList[activeClozeIndex] || clozeList[0];

  const handleSelectClozeOption = (hiddenIdx: number, selectedWord: string) => {
    setUserSelectedWords((prev) => ({
      ...prev,
      [hiddenIdx]: selectedWord
    }));
  };

  const handleEvaluateCloze = () => {
    let correctCount = 0;
    const totalHidden = currentCloze.hiddenIndices.length;

    currentCloze.hiddenIndices.forEach((idx) => {
      const targetWord = currentCloze.words[idx];
      if (userSelectedWords[idx] === targetWord) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalHidden) * 100);
    setClozeScore(score);
    setClozeSubmitted(true);

    if (score === 100) {
      showToast('🎉 MUMTAZ! Jawaban Anda 100% Sempurna!');
    } else {
      showToast(`Skor: ${score} / 100. Pelajari kembali kata yang belum tepat.`);
    }
  };

  const handleResetCloze = () => {
    setUserSelectedWords({});
    setClozeSubmitted(false);
    setClozeScore(null);
  };

  // Toggle builder word hide
  const toggleBuilderHideWord = (index: number) => {
    if (builderHiddenIndices.includes(index)) {
      setBuilderHiddenIndices(builderHiddenIndices.filter((i) => i !== index));
    } else {
      setBuilderHiddenIndices([...builderHiddenIndices, index]);
    }
  };

  const handleAddQuestionFromBuilder = () => {
    if (builderHiddenIndices.length === 0) {
      showToast('Pilih minimal 1 kata untuk disembunyikan!');
      return;
    }

    const newQuestionId = `cloze-${Date.now()}`;
    const generatedOptions: { [key: number]: string[] } = {};

    builderHiddenIndices.forEach((idx) => {
      const correctWord = builderWords[idx];
      // Generate distractors
      generatedOptions[idx] = [correctWord, 'الْعَظِيمِ', 'الْكَرِيمِ', 'الْحَكِيمِ'].sort(() => Math.random() - 0.5);
    });

    const newQ: ClozeQuestion = {
      id: newQuestionId,
      surahNumber: builderSurahNumber,
      surahName: QURAN_SURAHS.find((s) => s.number === builderSurahNumber)?.nameLatin || 'Al-Qur’an',
      ayahNumber: 1,
      fullAyahArabic: builderAyahText,
      words: builderWords,
      hiddenIndices: builderHiddenIndices,
      options: generatedOptions,
      difficulty: builderDifficulty,
      timerSeconds: builderTimer,
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
    };

    setClozeList([...clozeList, newQ]);
    showToast('Soal Rumpang Murojaah AI Berhasil Ditambahkan ke Bank Soal!');
  };

  // Web Speech API Voice Recognition Placeholder
  const toggleSpeechRecognition = () => {
    if (isSpeechListening) {
      setIsSpeechListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Browser Anda belum mendukung Web Speech Recognition. Gunakan Google Chrome.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA'; // Bahasa Arab Saudi
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsSpeechListening(true);
        setSpeechTranscript('Mendengarkan pelafalan santri...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpeechTranscript(transcript);
      };

      recognition.onerror = () => {
        setIsSpeechListening(false);
        setSpeechTranscript('Pengenalan suara dihentikan atau belum terdeteksi.');
      };

      recognition.onend = () => {
        setIsSpeechListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsSpeechListening(false);
      showToast('Web Speech API simulasi: Suara santri terdeteksi sangat fasih.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#0E7A4C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C8A951]/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#C8A951]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* --- HEADER METRIK UTAMA PPJM --- */}
      <div className="bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        {/* Ornamen Latar Islami */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#0E7A4C]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C8A951]/20 border border-[#C8A951]/40 text-[#C8A951] text-xs font-semibold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pondok Pesantren Jauharul Maknuun — Tahfidzul Qur’an Digital</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Pusat Kendali Mushaf & Hafidz Qur’an
              </h1>
              <p className="text-white/80 text-sm mt-1 max-w-2xl">
                Monitoring 114 Surat, Manajemen 15 Reciter Murottal Standar Dunia, Evaluasi Setoran Rapor Santri, dan
                Latihan Murojaah Cerdas Berbasis AI Cloze Test.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowSetoranModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A951] to-[#e4c86d] text-[#0A2116] font-bold text-sm shadow-md hover:brightness-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Setoran Baru</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm backdrop-blur transition-all"
              >
                <Upload className="w-4 h-4 text-[#C8A951]" />
                <span>Upload Murottal</span>
              </button>
            </div>
          </div>

          {/* 6 Grid Metrik Real-Time */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#C8A951]/50 transition-all">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Total Surat</span>
                <BookOpen className="w-4 h-4 text-[#C8A951]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">114</div>
              <div className="text-[11px] text-[#C8A951] font-medium mt-1">Lengkap 30 Juz</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#C8A951]/50 transition-all">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Total Juz</span>
                <Layers className="w-4 h-4 text-[#C8A951]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">30</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">Kemenag RI Standar</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#C8A951]/50 transition-all">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Jumlah Ayat</span>
                <FileCheck2 className="w-4 h-4 text-[#C8A951]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">6.236</div>
              <div className="text-[11px] text-white/70 font-medium mt-1">Teks Utsmani Terverifikasi</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#C8A951]/50 transition-all">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Reciter Murottal</span>
                <Headphones className="w-4 h-4 text-[#C8A951]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">15</div>
              <div className="text-[11px] text-[#C8A951] font-medium mt-1">Multi-Bitrate CDN</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#C8A951]/50 transition-all">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Santri Hafidz Aktif</span>
                <Users className="w-4 h-4 text-[#C8A951]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">89</div>
              <div className="text-[11px] text-emerald-300 font-medium mt-1">100% Mengikuti Program</div>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#C8A951]/50 transition-all">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Rata-Rata Hafalan</span>
                <TrendingUp className="w-4 h-4 text-[#C8A951]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">8 Juz</div>
              <div className="text-[11px] text-[#C8A951] font-medium mt-1">+2 Juz semester ini</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TAB SELECTOR MENU --- */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('surat')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'surat'
              ? 'bg-[#0E7A4C] text-white shadow-lg shadow-[#0E7A4C]/25 ring-2 ring-[#C8A951]/40'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>TAB A: Monitoring 114 Surat</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white font-mono">114</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'audio'
              ? 'bg-[#0E7A4C] text-white shadow-lg shadow-[#0E7A4C]/25 ring-2 ring-[#C8A951]/40'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>TAB B: Audio Murottal Reciter</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white font-mono">15 Qari</span>
        </button>

        <button
          onClick={() => setActiveTab('setoran')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'setoran'
              ? 'bg-[#0E7A4C] text-white shadow-lg shadow-[#0E7A4C]/25 ring-2 ring-[#C8A951]/40'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>TAB C: Evaluasi Setoran Santri</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
            {records.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cloze')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'cloze'
              ? 'bg-[#0E7A4C] text-white shadow-lg shadow-[#0E7A4C]/25 ring-2 ring-[#C8A951]/40'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C8A951]" />
          <span>TAB D: Murojaah AI (Cloze Test)</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#C8A951]/20 text-[#C8A951] font-mono">AI Quiz</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* --- TAB A: MONITORING 114 SURAT AL-QUR'AN --- */}
      {/* ========================================================================= */}
      {activeTab === 'surat' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari surat (Arab, Latin, Nomor, Arti)..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Filter Makkiyah/Madaniyah */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-1 text-xs font-semibold">
                {(['Semua', 'Makkiyyah', 'Madaniyyah'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSurahFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      surahFilterType === t
                        ? 'bg-[#0E7A4C] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Filter Juz 1 - 30 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Juz:</span>
                <select
                  value={surahFilterJuz}
                  onChange={(e) => setSurahFilterJuz(e.target.value === 'Semua' ? 'Semua' : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                >
                  <option value="Semua">Semua Juz (1-30)</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Juz {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-gray-500 font-medium ml-auto md:ml-0">
                Menampilkan <span className="font-bold text-[#0E7A4C]">{filteredSurahs.length}</span> dari 114 Surat
              </div>
            </div>
          </div>

          {/* Grid 114 Surat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                className="group relative bg-[#FFF9E6]/60 dark:bg-gray-800 rounded-2xl p-5 border border-[#C8A951]/30 hover:border-[#0E7A4C] hover:shadow-xl hover:shadow-[#0E7A4C]/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7A4C] to-[#0A2116] text-[#C8A951] font-extrabold text-sm flex items-center justify-center shadow-sm">
                        {surah.number}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-[#0E7A4C] transition-colors">
                          {surah.nameLatin}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{surah.nameIndo}</p>
                      </div>
                    </div>
                    {/* Tulisan Arab Utsmani */}
                    <div className="text-2xl font-serif font-bold text-[#0E7A4C] dark:text-[#C8A951]">
                      {surah.nameArabic}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        surah.revelationType === 'Makkiyyah'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      {surah.revelationType}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {surah.numberOfAyahs} Ayat
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ml-auto">
                      Juz {surah.juzStart}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Tersedia Audio</span>
                  </div>

                  <button
                    onClick={() => handleOpenSurahDetail(surah)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Ayat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">Tidak ada surat yang cocok</h3>
              <p className="text-gray-400 text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter Juz.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- TAB B: MANAJEMEN AUDIO MUROTTAL RECITERS --- */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
        <div className="space-y-6">
          {/* Header Action & Missing Audio Scanner */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#0E7A4C]" />
                <span>15 Reciter Murottal Standar Kemenag RI & Al-Azhar</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Multi-server Audio Streaming dengan dukungan CDN Singapore S3, EQuran ID, dan EveryAyah.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowMissingAudioModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold hover:bg-amber-100 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Cek Audio Hilang</span>
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold shadow-md transition-all"
              >
                <Upload className="w-4 h-4 text-[#C8A951]" />
                <span>Unggah Audio Baru</span>
              </button>
            </div>
          </div>

          {/* Floating Audio Dock (Persistent Player) */}
          <div className="bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-[#C8A951]/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A951]/20 border border-[#C8A951] flex items-center justify-center text-[#C8A951] shadow-inner flex-shrink-0">
                <Music className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#C8A951] font-bold">Now Active Reciter</span>
                  {isLoopingAyah && (
                    <span className="text-[10px] bg-[#C8A951] text-[#0A2116] font-extrabold px-1.5 py-0.5 rounded">
                      LOOP AYAT
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-base">{selectedReciter.name}</h4>
                <p className="text-xs text-white/70">
                  {selectedReciter.country} • {selectedReciter.style} • {selectedReciter.quality}
                </p>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-center">
              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 text-xs">
                {[0.75, 1, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      playbackSpeed === spd ? 'bg-[#C8A951] text-[#0A2116]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Loop Ayah Toggle */}
              <button
                onClick={toggleLoopAyah}
                className={`p-2 rounded-xl transition-all ${
                  isLoopingAyah
                    ? 'bg-[#C8A951] text-[#0A2116] shadow-md shadow-[#C8A951]/40'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                title="Ulang Ayat (Loop)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Play / Pause Primary Sample */}
              <button
                onClick={() => togglePlayAudio(selectedReciter.audioSampleUrl)}
                className="w-12 h-12 rounded-full bg-[#C8A951] text-[#0A2116] hover:brightness-110 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                {playingAudioUrl === selectedReciter.audioSampleUrl ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* List 15 Reciters Cards with Drag Reorder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reciters.map((reciter, rIdx) => {
              const isSelected = selectedReciter.id === reciter.id;
              const isPlaying = playingAudioUrl === reciter.audioSampleUrl;

              return (
                <div
                  key={reciter.id}
                  draggable
                  onDragStart={() => setDraggedReciterIdx(rIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedReciterIdx === null || draggedReciterIdx === rIdx) return;
                    const newReciters = [...reciters];
                    const [moved] = newReciters.splice(draggedReciterIdx, 1);
                    newReciters.splice(rIdx, 0, moved);
                    setReciters(newReciters);
                    setDraggedReciterIdx(null);
                    showToast(`Urutan reciter berhasil disesuaikan: ${moved.name}`);
                  }}
                  onClick={() => setSelectedReciter(reciter)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    draggedReciterIdx === rIdx ? 'opacity-50 border-dashed border-[#0E7A4C]' : ''
                  } ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#FFF9E6] to-amber-50 dark:from-gray-800 dark:to-emerald-950/30 border-[#0E7A4C] shadow-lg ring-2 ring-[#0E7A4C]/30'
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-[#C8A951]/60 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 pt-1" title="Geser urutan reciter">
                        <GripVertical className="w-4 h-4" />
                      </span>
                      <img
                        src={reciter.avatar}
                        alt={reciter.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C8A951]/50 shadow-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold text-gray-500">{reciter.country}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E7A4C]/10 text-[#0E7A4C] dark:text-emerald-400">
                            {reciter.quality}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{reciter.name}</h3>
                        <p className="text-sm font-serif font-semibold text-[#0E7A4C] dark:text-[#C8A951] mt-0.5">
                          {reciter.arabicName}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{reciter.style}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {reciter.surahCount} Surat Tersedia
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReciter(reciter);
                        togglePlayAudio(reciter.audioSampleUrl);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-[#C8A951] text-[#0A2116]'
                          : 'bg-[#0E7A4C] hover:bg-[#0A2116] text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Jeda</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Coba Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- TAB C: EVALUASI SETORAN HAFALAN SANTRI --- */}
      {/* ========================================================================= */}
      {activeTab === 'setoran' && (
        <div className="space-y-6">
          {/* Progress Chart Santri: Juz vs Waktu */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0E7A4C]" />
                  <span>Grafik Akselerasi Hafalan Santri (Juz vs Waktu)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Visualisasi target pencapaian hafalan per bulan menuju wisuda tahfidz 30 juz PPJM.
                </p>
              </div>

              {/* Selector Santri untuk Chart */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Santri:</span>
                <select
                  value={selectedChartSantri}
                  onChange={(e) => setSelectedChartSantri(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                >
                  {records.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.santriName} ({r.kelas}) — {r.juzCurrent} Juz
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Line/Bar Visualizer Chart */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4">
                {activeChartSantriData.history.map((pt, idx) => {
                  const heightPercent = Math.min(100, Math.round((pt.juz / 30) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[11px] font-extrabold text-[#0E7A4C] dark:text-[#C8A951] opacity-0 group-hover:opacity-100 transition-opacity">
                        {pt.juz} Juz
                      </div>
                      <div
                        className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#0E7A4C] to-[#C8A951] shadow-md group-hover:brightness-110 transition-all relative overflow-hidden"
                        style={{ height: `${Math.max(15, heightPercent)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{pt.bulan}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                <span>0 Juz (Awal Masuk)</span>
                <span className="font-bold text-[#0E7A4C] dark:text-[#C8A951]">
                  Pencapaian Saat Ini: {activeChartSantriData.juzCurrent} dari 30 Juz
                </span>
                <span>Target: 30 Juz Mutqin</span>
              </div>
            </div>
          </div>

          {/* Table Setoran Santri */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Filter Bar */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari santri atau surat terakhir..."
                  value={searchSantri}
                  onChange={(e) => setSearchSantri(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-medium focus:outline-none"
                >
                  <option value="Semua">Semua Kelas</option>
                  <option value="VII-A">VII-A</option>
                  <option value="VII-C">VII-C</option>
                  <option value="VIII-B">VIII-B</option>
                  <option value="IX-A">IX-A</option>
                  <option value="X Tahfidz">X Tahfidz</option>
                  <option value="XI Tahfidz">XI Tahfidz</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-medium focus:outline-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Lancar">Lancar (Mumtaz)</option>
                  <option value="Perlu Murojaah">Perlu Murojaah</option>
                  <option value="Tidak Lancar">Tidak Lancar</option>
                </select>

                <button
                  onClick={() => setShowSetoranModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold shadow-md transition-all ml-auto lg:ml-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Setoran</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    <th className="py-3.5 px-4">Nama Santri & Kelas</th>
                    <th className="py-3.5 px-4">Juz Terkini</th>
                    <th className="py-3.5 px-4">Surat & Ayat Terakhir</th>
                    <th className="py-3.5 px-4 text-center">Kelancaran</th>
                    <th className="py-3.5 px-4 text-center">Tajwid</th>
                    <th className="py-3.5 px-4 text-center">Makhorij</th>
                    <th className="py-3.5 px-4">Pembimbing</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{r.santriName}</div>
                        <div className="text-gray-500 text-[11px]">
                          Kelas: <span className="font-semibold text-[#0E7A4C]">{r.kelas}</span> • {r.totalSetoran}x
                          Setoran
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                          Juz {r.juzCurrent}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{r.lastSurah}</div>
                        <div className="text-gray-500 text-[11px]">{r.lastAyahRange}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-800 dark:text-gray-200">
                        {r.kelancaranScore}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-800 dark:text-gray-200">
                        {r.tajwidScore}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-800 dark:text-gray-200">
                        {r.makhorijScore}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-700 dark:text-gray-300 font-medium">{r.pembimbing}</div>
                        <div className="text-gray-400 text-[10px]">{r.tanggalSetoran}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            r.status === 'Lancar'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : r.status === 'Perlu Murojaah'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedChartSantri(r.id);
                            showToast(`Melihat detail & grafik progress hafalan: ${r.santriName}`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-[#0E7A4C] hover:text-white text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all"
                        >
                          Lihat Rapor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- TAB D: LATIHAN MUROJAAH AI (CLOZE TEST) --- */}
      {/* ========================================================================= */}
      {activeTab === 'cloze' && (
        <div className="space-y-6">
          {/* Subheader AI Cloze Test */}
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-5 border border-[#C8A951]/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A951]/20 text-[#C8A951] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Assisted Hafalan Murojaah</span>
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Simulator Tes Hafalan Rumpang (Cloze Test) & Uji Lafal Suara
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Latih daya ingat memori santri dengan menyembunyikan kata kunci ayat dan uji kecocokan lafal dengan Web
                Speech Engine.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">Pilih / Geser Soal:</span>
              <div className="flex items-center gap-1.5">
                {clozeList.map((q, idx) => (
                  <button
                    key={q.id}
                    draggable
                    onDragStart={() => setDraggedClozeIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedClozeIdx === null || draggedClozeIdx === idx) return;
                      const newList = [...clozeList];
                      const [moved] = newList.splice(draggedClozeIdx, 1);
                      newList.splice(idx, 0, moved);
                      setClozeList(newList);
                      setActiveClozeIndex(idx);
                      setDraggedClozeIdx(null);
                      showToast(`Urutan soal murojaah dipindahkan ke nomor ${idx + 1}`);
                    }}
                    onClick={() => {
                      setActiveClozeIndex(idx);
                      handleResetCloze();
                    }}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-grab active:cursor-grabbing ${
                      draggedClozeIdx === idx ? 'opacity-40 scale-90' : ''
                    } ${
                      activeClozeIndex === idx
                        ? 'bg-[#0E7A4C] text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                    }`}
                    title="Klik untuk memilih, geser (drag) untuk mengatur urutan"
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dual Grid: Preview Santri vs Builder Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sisi Kiri: Simulator Santri (Interactive Cloze View) - 7 cols */}
            <div className="lg:col-span-7 bg-[#FFF9E6] dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C8A951]/40 flex flex-col justify-between relative overflow-hidden">
              {/* Islamic Pattern Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A951]/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Meta Bar Soal */}
                <div className="flex items-center justify-between pb-4 border-b border-[#C8A951]/30 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#0E7A4C] dark:text-[#C8A951] uppercase tracking-wider">
                      Surat #{currentCloze.surahNumber} {currentCloze.surahName} : Ayat {currentCloze.ayahNumber}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Tingkat Kesulitan: <span className="font-bold text-[#0E7A4C]">{currentCloze.difficulty}</span> •
                      Timer: {currentCloze.timerSeconds} Detik
                    </h3>
                  </div>

                  <button
                    onClick={() => togglePlayAudio(currentCloze.audioUrl)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold shadow transition-all"
                  >
                    {playingAudioUrl === currentCloze.audioUrl ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Jeda Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Dengar Ayat</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AREA MUSHAF AYAT RUMPANG */}
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 border border-[#C8A951]/50 shadow-inner my-4 text-center">
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white leading-[2.6] flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
                    dir="rtl"
                  >
                    {currentCloze.words.map((word, wIdx) => {
                      const isHidden = currentCloze.hiddenIndices.includes(wIdx);
                      const chosenWord = userSelectedWords[wIdx];

                      if (!isHidden) {
                        return <span key={wIdx}>{word}</span>;
                      }

                      // Word is hidden blank spot!
                      return (
                        <span
                          key={wIdx}
                          className={`inline-flex items-center justify-center min-w-[120px] px-3 py-1.5 rounded-xl border-2 transition-all font-serif ${
                            chosenWord
                              ? clozeSubmitted
                                ? chosenWord === word
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-100 border-rose-500 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-[#C8A951]/20 border-[#C8A951] text-[#0A2116] dark:text-[#C8A951]'
                              : 'bg-amber-100/50 dark:bg-gray-700 border-dashed border-[#C8A951] text-gray-400 text-base'
                          }`}
                        >
                          {chosenWord || '[ . . . ? . . . ]'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* PILIHAN JAWABAN KATA ARAB */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">
                    Pilih Kata Arab Yang Tepat Untuk Mengisi Bagian Rumpang:
                  </h4>

                  {currentCloze.hiddenIndices.map((hIdx) => (
                    <div key={hIdx} className="space-y-2">
                      <div className="text-xs font-bold text-[#0E7A4C] dark:text-[#C8A951] text-center">
                        Pilihan untuk Kata ke-{hIdx + 1}:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" dir="rtl">
                        {(currentCloze.options[hIdx] || []).map((opt, optIdx) => {
                          const isSelected = userSelectedWords[hIdx] === opt;
                          return (
                            <button
                              key={optIdx}
                              disabled={clozeSubmitted}
                              onClick={() => handleSelectClozeOption(hIdx, opt)}
                              className={`p-3 rounded-xl border-2 font-serif text-lg font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#0E7A4C] text-white border-[#C8A951] shadow-lg scale-102'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-[#0E7A4C]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Result Bar */}
              <div className="mt-8 pt-4 border-t border-[#C8A951]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                {clozeScore !== null ? (
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        clozeScore === 100
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {clozeScore}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {clozeScore === 100 ? 'Mumtaz! Jawaban Sempurna' : 'Perlu Diulang Murojaah'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {clozeScore === 100 ? 'Hafalan ayat ini sudah mutqin.' : 'Cek kembali kata yang berwarna merah.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    Isi semua bagian rumpang lalu klik Evaluasi Hafalan.
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCloze}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all"
                  >
                    Reset
                  </button>

                  <button
                    onClick={handleEvaluateCloze}
                    disabled={Object.keys(userSelectedWords).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0E7A4C] to-[#0A2116] text-[#C8A951] font-extrabold text-xs shadow-lg hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Evaluasi Jawaban</span>
                  </button>
                </div>
              </div>

              {/* Web Speech API Voice Recognition Placeholder */}
              <div className="mt-6 pt-4 border-t border-[#C8A951]/20 bg-black/5 dark:bg-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSpeechListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-[#0E7A4C] text-white hover:bg-[#0A2116]'
                    }`}
                  >
                    {isSpeechListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white">
                      Uji Lafal Suara Santri (Web Speech AI)
                    </h5>
                    <p className="text-[11px] text-gray-500">
                      {speechTranscript || 'Tekan tombol mikrofon lalu bacakan ayat ini secara tartil.'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-[#0E7A4C]/10 text-[#0E7A4C] dark:text-emerald-400 px-2 py-1 rounded">
                  Voice-to-Text: ar-SA
                </span>
              </div>
            </div>

            {/* Sisi Kanan: Cloze Test Builder Form - 5 cols */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <Sliders className="w-5 h-5 text-[#0E7A4C]" />
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Builder Soal Rumpang Baru
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Pilih Surat */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Pilih Surat Al-Qur'an:
                    </label>
                    <select
                      value={builderSurahNumber}
                      onChange={(e) => setBuilderSurahNumber(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                    >
                      {QURAN_SURAHS.slice(0, 30).map((s) => (
                        <option key={s.number} value={s.number}>
                          #{s.number} {s.nameLatin} ({s.nameArabic}) — {s.nameIndo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input Teks Ayat Arab */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Teks Ayat Arab (Pisahkan dengan spasi):
                    </label>
                    <textarea
                      rows={3}
                      value={builderAyahText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBuilderAyahText(val);
                        setBuilderWords(val.split(' ').filter(Boolean));
                      }}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-serif font-bold text-right leading-loose focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                      dir="rtl"
                    />
                  </div>

                  {/* Interaktif: Klik Kata untuk Sembunyikan */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Klik Kata untuk Menyembunyikan (Rumpang):
                      </label>
                      <span className="text-[10px] text-[#0E7A4C] font-semibold">
                        {builderHiddenIndices.length} kata disembunyikan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700" dir="rtl">
                      {builderWords.map((w, idx) => {
                        const isHidden = builderHiddenIndices.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleBuilderHideWord(idx)}
                            className={`px-3 py-1.5 rounded-lg font-serif text-sm font-bold transition-all ${
                              isHidden
                                ? 'bg-amber-500 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border hover:border-[#0E7A4C]'
                            }`}
                          >
                            {w} {isHidden && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pengaturan Difficulty & Timer */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Tingkat Kesulitan:
                      </label>
                      <select
                        value={builderDifficulty}
                        onChange={(e) => setBuilderDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                      >
                        <option value="Mudah">Mudah (1 Kata)</option>
                        <option value="Sedang">Sedang (2-3 Kata)</option>
                        <option value="Sulit">Sulit (4+ Kata)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Timer (Detik):
                      </label>
                      <input
                        type="number"
                        value={builderTimer}
                        onChange={(e) => setBuilderTimer(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleAddQuestionFromBuilder}
                  className="w-full py-3 rounded-2xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white font-bold text-xs shadow-lg shadow-[#0E7A4C]/25 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#C8A951]" />
                  <span>Simpan ke Bank Soal Murojaah AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: LIHAT AYAT PER SURAT (UTSMANI + TERJEMAHAN + AUDIO PER AYAT) --- */}
      {/* ========================================================================= */}
      {selectedSurahModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border-2 border-[#C8A951]/40 flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C8A951] text-[#0A2116] font-extrabold text-lg flex items-center justify-center shadow-md">
                  {selectedSurahModal.number}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    Surat {selectedSurahModal.nameLatin} ({selectedSurahModal.nameArabic})
                  </h3>
                  <p className="text-xs text-white/80">
                    {selectedSurahModal.nameIndo} • {selectedSurahModal.revelationType} •{' '}
                    {selectedSurahModal.numberOfAyahs} Ayat • Juz {selectedSurahModal.juzStart}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSurahModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: List Ayat */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Bismillah Header (kecuali At-Taubah) */}
              {selectedSurahModal.number !== 9 && selectedSurahModal.number !== 1 && (
                <div className="text-center py-4 border-b border-[#C8A951]/30">
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#0E7A4C] dark:text-[#C8A951]">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
                </div>
              )}

              {isLoadingAyahs ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 mx-auto text-[#0E7A4C] animate-spin mb-3" />
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Memuat teks Utsmani & audio Kemenag RI...
                  </p>
                </div>
              ) : (
                surahAyahs.map((ayah) => {
                  const isPlayingAyah =
                    playingAudioUrl === ayah.audioUrl || currentPlayingAyah === ayah.numberInSurah;
                  return (
                    <div
                      key={ayah.numberInSurah}
                      className={`p-5 rounded-2xl border transition-all ${
                        isPlayingAyah
                          ? 'bg-amber-100/60 dark:bg-amber-950/30 border-[#C8A951] ring-2 ring-[#C8A951]/30'
                          : 'bg-white dark:bg-gray-800 border-gray-200/80 dark:border-gray-700'
                      }`}
                    >
                      {/* Top Bar Ayat */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-[#0E7A4C]/10 dark:bg-[#0E7A4C]/30 text-[#0E7A4C] dark:text-[#C8A951] font-bold text-xs flex items-center justify-center">
                            {ayah.numberInSurah}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            Ayat ke-{ayah.numberInSurah}
                          </span>
                        </div>

                        <button
                          onClick={() => togglePlayAudio(ayah.audioUrl, ayah.numberInSurah)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isPlayingAyah
                              ? 'bg-[#C8A951] text-[#0A2116]'
                              : 'bg-[#0E7A4C] hover:bg-[#0A2116] text-white'
                          }`}
                        >
                          {isPlayingAyah ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Jeda</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Putar Audio</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Teks Arab Utsmani */}
                      <p
                        className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white leading-[2.4] text-right mb-4"
                        dir="rtl"
                      >
                        {ayah.textArabic}
                      </p>

                      {/* Teks Latin & Terjemahan Kemenag RI */}
                      <div className="space-y-1 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-medium text-[#0E7A4C] dark:text-[#C8A951]">
                          {ayah.textLatin}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                          "{ayah.translationIndo}"
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end">
              <button
                onClick={() => setSelectedSurahModal(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-300 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: INPUT SETORAN SANTRI BARU --- */}
      {/* ========================================================================= */}
      {showSetoranModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-up">
            <div className="p-5 bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C8A951]" />
                <span>Formulir Setoran Hafalan Santri</span>
              </h3>
              <button
                onClick={() => setShowSetoranModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSetoran} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nama Santri:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Farhan"
                    value={formSantriName}
                    onChange={(e) => setFormSantriName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Kelas:
                  </label>
                  <select
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                  >
                    <option value="VII-A">VII-A</option>
                    <option value="VII-C">VII-C</option>
                    <option value="VIII-B">VIII-B</option>
                    <option value="IX-A">IX-A</option>
                    <option value="X Tahfidz">X Tahfidz</option>
                    <option value="XI Tahfidz">XI Tahfidz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Juz Saat Ini:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formJuz}
                    onChange={(e) => setFormJuz(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Surat Disetor:
                  </label>
                  <input
                    type="text"
                    value={formSurah}
                    onChange={(e) => setFormSurah(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Rentang Ayat:
                  </label>
                  <input
                    type="text"
                    value={formAyahRange}
                    onChange={(e) => setFormAyahRange(e.target.value)}
                    placeholder="Ayat 1 - 25"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
                  />
                </div>
              </div>

              {/* 3 Param Penilaian: Kelancaran, Tajwid, Makhorij */}
              <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Nilai Kelancaran (1-100):
                  </label>
                  <span className="font-extrabold text-sm text-[#0E7A4C]">{formKelancaran}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={formKelancaran}
                  onChange={(e) => setFormKelancaran(Number(e.target.value))}
                  className="w-full accent-[#0E7A4C]"
                />

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Nilai Ketepatan Tajwid (1-100):
                  </label>
                  <span className="font-extrabold text-sm text-[#0E7A4C]">{formTajwid}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={formTajwid}
                  onChange={(e) => setFormTajwid(Number(e.target.value))}
                  className="w-full accent-[#0E7A4C]"
                />

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Makhorijul Huruf & Fashohah (1-100):
                  </label>
                  <span className="font-extrabold text-sm text-[#0E7A4C]">{formMakhorij}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={formMakhorij}
                  onChange={(e) => setFormMakhorij(Number(e.target.value))}
                  className="w-full accent-[#0E7A4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Ustadz / Pembimbing:
                </label>
                <select
                  value={formPembimbing}
                  onChange={(e) => setFormPembimbing(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                >
                  <option value="Ustadz H. Abdullah Faqih">Ustadz H. Abdullah Faqih</option>
                  <option value="Ustadz M. Rizky Maulana">Ustadz M. Rizky Maulana</option>
                  <option value="Ustadzah Fauziyah Al-Hafidzah">Ustadzah Fauziyah Al-Hafidzah</option>
                  <option value="Ustadz Ahmad Farhan">Ustadz Ahmad Farhan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Foto Lembar Mutaba'ah / Dokumentasi (WebP Auto-Compressor):
                </label>
                <div className="flex items-center gap-3">
                  {formDocPhoto && (
                    <img src={formDocPhoto} alt="Doc Preview" className="w-12 h-12 rounded-xl object-cover border border-[#0E7A4C]" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const res = await compressImageToWebP(file, 800, 800, 0.82);
                          setFormDocPhoto(res.previewUrl);
                          showToast(`Foto mutaba'ah dikompres: ${res.originalSizeKB}KB ➔ ${res.compressedSizeKB}KB (Hemat ${res.savedPercent}%)`);
                        } catch {
                          showToast('Gagal memproses gambar mutabaah');
                        }
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0E7A4C] file:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Catatan Evaluasi / Rekomendasi:
                </label>
                <textarea
                  rows={2}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Contoh: Bacaan fasih, perhatikan mad jaiz munfashil..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSetoranModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold shadow-md transition-all"
                >
                  Simpan Setoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: UNGGAH AUDIO MUROTTAL RECITERS --- */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-up">
            <div className="p-5 bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#C8A951]" />
                <span>Unggah Audio Murottal (MP3)</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUploadAudio} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Pilih Reciter Qari:
                </label>
                <select
                  value={uploadReciterId}
                  onChange={(e) => setUploadReciterId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                >
                  {reciters.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.country}) — {r.quality}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Surat Ke:
                  </label>
                  <select
                    value={uploadSurahNum}
                    onChange={(e) => setUploadSurahNum(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                  >
                    {QURAN_SURAHS.map((s) => (
                      <option key={s.number} value={s.number}>
                        {s.number}. {s.nameLatin}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Ayat Dari:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={uploadAyahStart}
                    onChange={(e) => setUploadAyahStart(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Sampai Ayat:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={uploadAyahEnd}
                    onChange={(e) => setUploadAyahEnd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  File Audio (.mp3, .m4a, bitrate 64-320kbps):
                </label>
                <div className="border-2 border-dashed border-[#C8A951]/60 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <FileAudio className="w-10 h-10 text-[#0E7A4C] mx-auto mb-2" />
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFileName(e.target.files[0].name);
                    }}
                    className="hidden"
                    id="audio-file-upload"
                  />
                  <label
                    htmlFor="audio-file-upload"
                    className="cursor-pointer text-xs font-bold text-[#0E7A4C] hover:underline"
                  >
                    Klik untuk memilih file audio dari perangkat Anda
                  </label>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {uploadFileName ? `File terpilih: ${uploadFileName}` : 'Maksimal 15 MB per surat'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold shadow-md transition-all"
                >
                  Unggah & Sinkronisasi CDN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: PEMERIKSA AUDIO HILANG (MISSING AUDIO SCANNER) --- */}
      {/* ========================================================================= */}
      {showMissingAudioModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-up">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-[#0E7A4C] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#C8A951]" />
                <span>Pemeriksa Integritas Audio Murottal</span>
              </h3>
              <button
                onClick={() => setShowMissingAudioModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Sistem akan memindai seluruh 6.236 file ayat dari 15 Reciter untuk memastikan tidak ada audio yang
                rusak, 404, atau terblokir.
              </p>

              {isScanningAudio ? (
                <div className="py-8 text-center space-y-3">
                  <RefreshCw className="w-10 h-10 mx-auto text-[#0E7A4C] animate-spin" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Memeriksa CDN Singapore S3 & EveryAyah...
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#0E7A4C] h-2 rounded-full animate-pulse w-3/4" />
                  </div>
                </div>
              ) : scanResult ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Hasil Pemindaian Lengkap</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    {scanResult.status}
                  </p>
                  <div className="text-[11px] text-gray-500 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                    Terperiksa: {scanResult.checked} file • Audio Hilang: {scanResult.missing}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border text-center">
                  <Radio className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">
                    Klik tombol di bawah untuk memulai pemindaian integritas audio.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMissingAudioModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  onClick={handleScanMissingAudio}
                  disabled={isScanningAudio}
                  className="px-5 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold shadow-md transition-all"
                >
                  Mulai Pindai Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaHafidz;
