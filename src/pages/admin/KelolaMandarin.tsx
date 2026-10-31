import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Sparkles,
  BookOpen,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Award,
  Upload,
  Check,
  Zap,
  HelpCircle,
  Save,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

// -------------------------------------------------------------
// INTERFACES & TYPES
// -------------------------------------------------------------

export interface MandarinVocabItem {
  id: string;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'Tematik';
  themeCategory: 'Sapaan' | 'Keluarga' | 'Sekolah' | 'Makanan' | 'Ibadah & Adab';
  difficulty: 'Dasar' | 'Menengah' | 'Lanjutan';
  hanzi: string;
  pinyin: string;
  meaningId: string;
  exampleSentenceHanzi: string;
  exampleSentencePinyin: string;
  exampleSentenceMeaning: string;
  audioUrl?: string;
  audioBlobUrl?: string;
}

export type QuizQuestionType = 
  | 'Pilihan Ganda' 
  | 'Tebak Hanzi' 
  | 'Tebak Pinyin' 
  | 'Audio Listening' 
  | 'Cocokkan';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;          // Pertanyaan teks atau instruksi
  promptHanzi?: string;    // Karakter Hanzi jika ada
  promptPinyin?: string;   // Pinyin jika ada
  audioUrl?: string;       // Audio listening jika type == 'Audio Listening'
  options: [string, string, string, string];
  correctIndex: number;
  points: number;
  explanation: string;
}

export interface QuizPackage {
  id: string;
  title: string;
  description: string;
  hskCategory: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'Tematik Sapaan';
  durationMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface StudentScoreRecord {
  id: string;
  studentName: string;
  nis: string;
  quizTitle: string;
  hskLevel: string;
  score: number;
  durationSpent: string;
  isPassed: boolean;
  takenAt: string;
}

// -------------------------------------------------------------
// SEED INITIAL DATA
// -------------------------------------------------------------

const INITIAL_VOCAB_LIST: MandarinVocabItem[] = [
  {
    id: 'v-1',
    hskLevel: 'HSK 1',
    themeCategory: 'Sapaan',
    difficulty: 'Dasar',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaningId: 'halo / apa kabar',
    exampleSentenceHanzi: '你好吗？我很好。',
    exampleSentencePinyin: 'nǐ hǎo ma? wǒ hěn hǎo.',
    exampleSentenceMeaning: 'Apa kabarmu? Saya sangat baik.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'v-2',
    hskLevel: 'HSK 1',
    themeCategory: 'Sapaan',
    difficulty: 'Dasar',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    meaningId: 'terima kasih',
    exampleSentenceHanzi: '非常感谢你的帮助！',
    exampleSentencePinyin: 'fēicháng gǎnxiè nǐ de bāngzhù!',
    exampleSentenceMeaning: 'Terima kasih banyak atas bantuanmu!',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'v-3',
    hskLevel: 'HSK 1',
    themeCategory: 'Sapaan',
    difficulty: 'Dasar',
    hanzi: '再见',
    pinyin: 'zàijiàn',
    meaningId: 'sampai jumpa / selamat tinggal',
    exampleSentenceHanzi: '老师，明天再见！',
    exampleSentencePinyin: 'lǎoshī, míngtiān zàijiàn!',
    exampleSentenceMeaning: 'Ustadz/Guru, sampai jumpa besok!',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'v-4',
    hskLevel: 'HSK 2',
    themeCategory: 'Sekolah',
    difficulty: 'Menengah',
    hanzi: '学生',
    pinyin: 'xuésheng',
    meaningId: 'santri / siswa / murid',
    exampleSentenceHanzi: '我是伊斯兰寄宿学校的学生。',
    exampleSentencePinyin: 'wǒ shì yīsīlán jìsù xuéxiào de xuésheng.',
    exampleSentenceMeaning: 'Saya adalah santri di pondok pesantren.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'v-5',
    hskLevel: 'HSK 2',
    themeCategory: 'Ibadah & Adab',
    difficulty: 'Menengah',
    hanzi: '真主',
    pinyin: 'Zhēnzhǔ',
    meaningId: 'Allah SWT (Tuhan Yang Maha Esa)',
    exampleSentenceHanzi: '我们每天祈求真主保佑。',
    exampleSentencePinyin: 'wǒmen měitiān qíqiú Zhēnzhǔ bǎoyòu.',
    exampleSentenceMeaning: 'Setiap hari kami memohon berkah dan perlindungan Allah SWT.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'v-6',
    hskLevel: 'HSK 1',
    themeCategory: 'Makanan',
    difficulty: 'Dasar',
    hanzi: '米饭',
    pinyin: 'mǐfàn',
    meaningId: 'nasi putih',
    exampleSentenceHanzi: '我们在食堂吃米饭。',
    exampleSentencePinyin: 'wǒmen zài shítáng chī mǐfàn.',
    exampleSentenceMeaning: 'Kami makan nasi di ruang makan santri.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  }
];

const INITIAL_QUIZZES: QuizPackage[] = [
  {
    id: 'quiz-1',
    title: 'Kuis Sapaan Dasar HSK 1 - 20 Soal',
    description: 'Uji pemahaman kosakata salam, adab sapaan santri, dan pelafalan nada (tone) Putonghua tingkat pemula.',
    hskCategory: 'HSK 1',
    durationMinutes: 10,
    passingScore: 75,
    questions: [
      {
        id: 'q-1-1',
        type: 'Audio Listening',
        prompt: 'Dengarkan audio ucapan berikut. Pilih arti bahasa Indonesia yang paling tepat:',
        promptPinyin: 'nǐ hǎo (你好)',
        audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg',
        options: ['A. Halo / Apa kabar', 'B. Terima kasih banyak', 'C. Maafkan saya', 'D. Selamat jalan'],
        correctIndex: 0,
        points: 25,
        explanation: '"你好" (nǐ hǎo) adalah sapaan paling mendasar dalam bahasa Mandarin yang berarti halo atau apa kabar.'
      },
      {
        id: 'q-1-2',
        type: 'Tebak Pinyin',
        prompt: 'Bagaimana pinyin dan tanda nada yang tepat untuk karakter Hanzi "谢谢"?',
        promptHanzi: '谢谢',
        options: ['A. xìexie', 'B. xièxie', 'C. xiéxie', 'D. xǐexie'],
        correctIndex: 1,
        points: 25,
        explanation: 'Karakter 谢谢 dibaca "xièxie" dengan nada ke-4 (turun tegas) diikuti suku kata netral.'
      },
      {
        id: 'q-1-3',
        type: 'Tebak Hanzi',
        prompt: 'Manakah penulisan karakter Hanzi yang benar untuk ucapan perpisahan "zàijiàn" (sampai jumpa)?',
        promptPinyin: 'zàijiàn',
        options: ['A. 在见', 'B. 再见', 'C. 再健', 'D. 在建'],
        correctIndex: 1,
        points: 25,
        explanation: 'Karakter yang benar adalah "再见" (再 = lagi/kembali, 见 = melihat/bertemu).'
      },
      {
        id: 'q-1-4',
        type: 'Pilihan Ganda',
        prompt: 'Dalam tradisi Muslim Tiongkok dan diplomasi santri, istilah "真主" (Zhēnzhǔ) merujuk pada:',
        promptHanzi: '真主',
        promptPinyin: 'Zhēnzhǔ',
        options: ['A. Para Asatidz', 'B. Kitab Kuning', 'C. Allah SWT', 'D. Masjid Kampus'],
        correctIndex: 2,
        points: 25,
        explanation: '真主 (Zhēnzhǔ) berarti "Penguasa yang Sejati", istilah standar umat Muslim Tionghoa untuk menyebut Allah SWT.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Kuis Percakapan Santri & Halaqoh HSK 2 - 15 Soal',
    description: 'Tes percakapan praktis santri mengenai aktivitas madrasah, jam belajar, dan adab tholabul ilmi.',
    hskCategory: 'HSK 2',
    durationMinutes: 15,
    passingScore: 80,
    questions: [
      {
        id: 'q-2-1',
        type: 'Pilihan Ganda',
        prompt: 'Lengkapilah kalimat: "我是伊斯兰寄宿学校的 ___ " (Saya adalah ___ pondok pesantren)',
        promptHanzi: '我是伊斯兰寄宿学校的 ___',
        options: ['A. 老师 (Guru)', 'B. 学生 (Santri/Murid)', 'C. 医生 (Dokter)', 'D. 朋友 (Teman)'],
        correctIndex: 1,
        points: 50,
        explanation: 'Jawaban yang tepat adalah 学生 (xuésheng) yang berarti santri atau murid.'
      },
      {
        id: 'q-2-2',
        type: 'Tebak Hanzi',
        prompt: 'Karakter apakah yang mewakili kata "Al-Qur\'an" dalam bahasa Putonghua?',
        promptPinyin: 'Gǔlánjīng',
        options: ['A. 古兰经', 'B. 圣经', 'C. 字典', 'D. 课本'],
        correctIndex: 0,
        points: 50,
        explanation: '古兰经 (Gǔlánjīng) adalah terjemahan fonetik resmi untuk Al-Qur\'an.'
      }
    ]
  }
];

const INITIAL_STUDENT_SCORES: StudentScoreRecord[] = [
  {
    id: 'sc-1',
    studentName: 'Muhammad Faiz Al-Farisi',
    nis: 'SAN-2024-001',
    quizTitle: 'Kuis Sapaan Dasar HSK 1 - 20 Soal',
    hskLevel: 'HSK 1',
    score: 100,
    durationSpent: '07:12',
    isPassed: true,
    takenAt: '29 Okt 2026, 14:30'
  },
  {
    id: 'sc-2',
    studentName: 'Siti Fatimah Az-Zahra',
    nis: 'SAN-2024-015',
    quizTitle: 'Kuis Sapaan Dasar HSK 1 - 20 Soal',
    hskLevel: 'HSK 1',
    score: 100,
    durationSpent: '06:45',
    isPassed: true,
    takenAt: '28 Okt 2026, 16:15'
  },
  {
    id: 'sc-3',
    studentName: 'Ahmad Zaki Al-Maknuuni',
    nis: 'SAN-2024-089',
    quizTitle: 'Kuis Percakapan Santri & Halaqoh HSK 2',
    hskLevel: 'HSK 2',
    score: 90,
    durationSpent: '11:20',
    isPassed: true,
    takenAt: '28 Okt 2026, 10:05'
  },
  {
    id: 'sc-4',
    studentName: 'Rayhan Arya Pratama',
    nis: 'SAN-2024-042',
    quizTitle: 'Kuis Percakapan Santri & Halaqoh HSK 2',
    hskLevel: 'HSK 2',
    score: 65,
    durationSpent: '14:50',
    isPassed: false,
    takenAt: '27 Okt 2026, 15:40'
  },
  {
    id: 'sc-5',
    studentName: 'Nurul Hidayati',
    nis: 'SAN-2024-033',
    quizTitle: 'Kuis Sapaan Dasar HSK 1 - 20 Soal',
    hskLevel: 'HSK 1',
    score: 85,
    durationSpent: '08:10',
    isPassed: true,
    takenAt: '26 Okt 2026, 09:20'
  }
];

// -------------------------------------------------------------
// COMPONENT MAIN: KELOLA MANDARIN CLASS
// -------------------------------------------------------------

export const KelolaMandarin: React.FC = () => {
  // State Tabs
  const [activeTab, setActiveTab] = useState<'vocab' | 'quiz_builder' | 'student_scores'>('vocab');

  // State Data
  const [vocabs, setVocabs] = useState<MandarinVocabItem[]>(INITIAL_VOCAB_LIST);
  const [quizzes, setQuizzes] = useState<QuizPackage[]>(INITIAL_QUIZZES);
  const [scores, setScores] = useState<StudentScoreRecord[]>(INITIAL_STUDENT_SCORES);

  // Filter & Search Vocab
  const [searchVocab, setSearchVocab] = useState('');
  const [selectedHskFilter, setSelectedHskFilter] = useState<string>('Semua');

  // Audio Play State & Waveform animation
  const [playingVocabId, setPlayingVocabId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Modal Form Tambah / Edit Kosakata
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [editingVocabId, setEditingVocabId] = useState<string | null>(null);
  const [vHanzi, setVHanzi] = useState('');
  const [vPinyin, setVPinyin] = useState('');
  const [vMeaning, setVMeaning] = useState('');
  const [vHsk, setVHsk] = useState<'HSK 1' | 'HSK 2' | 'HSK 3' | 'Tematik'>('HSK 1');
  const [vTheme, setVTheme] = useState<'Sapaan' | 'Keluarga' | 'Sekolah' | 'Makanan' | 'Ibadah & Adab'>('Sapaan');
  const [vDifficulty, setVDifficulty] = useState<'Dasar' | 'Menengah' | 'Lanjutan'>('Dasar');
  const [vSentHanzi, setVSentHanzi] = useState('');
  const [vSentPinyin, setVSentPinyin] = useState('');
  const [vSentMeaning, setVSentMeaning] = useState('');
  const [vAudioUrl, setVAudioUrl] = useState('');
  const [vAudioFile, setVAudioFile] = useState<File | null>(null);

  // Modal Quiz Builder Form
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [qTitle, setQTitle] = useState('');
  const [qDesc, setQDesc] = useState('');
  const [qHskCategory, setQHskCategory] = useState<'HSK 1' | 'HSK 2' | 'HSK 3' | 'Tematik Sapaan'>('HSK 1');
  const [qDuration, setQDuration] = useState(10);
  const [qPassing, setQPassing] = useState(75);
  const [qQuestions, setQQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}-1`,
      type: 'Pilihan Ganda',
      prompt: 'Pilihlah arti yang tepat dari karakter "你好":',
      promptHanzi: '你好',
      promptPinyin: 'nǐ hǎo',
      options: ['A. Halo / Apa kabar', 'B. Terima kasih', 'C. Maafkan saya', 'D. Sampai jumpa'],
      correctIndex: 0,
      points: 25,
      explanation: '你好 (nǐ hǎo) adalah salam paling umum dalam bahasa Mandarin.'
    }
  ]);

  // Quiz Simulator State (Interactive Preview as Student)
  const [activePreviewQuiz, setActivePreviewQuiz] = useState<QuizPackage | null>(null);
  const [simQuestionIdx, setSimQuestionIdx] = useState(0);
  const [simSelectedOption, setSimSelectedOption] = useState<number | null>(null);
  const [simAnswerSubmitted, setSimAnswerSubmitted] = useState(false);
  const [simScore, setSimScore] = useState(0);
  const [simSecondsLeft, setSimSecondsLeft] = useState(600);
  const [simConfetti, setSimConfetti] = useState(false);
  const [simFinished, setSimFinished] = useState(false);

  // Toast Notifikasi
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Helper Tone Mark untuk input cepat
  const toneMarks = ['ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ō', 'ó', 'ǒ', 'ò', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ'];

  // Audio Playback Handler
  const togglePlayAudio = (id: string, url?: string) => {
    if (playingVocabId === id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingVocabId(null);
    } else {
      setPlayingVocabId(id);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url || 'https://actions.google.com/sounds/v1/speech/hello.ogg';
        audioPlayerRef.current.play().catch(() => {});
      }
      // Reset after 3 seconds fallback
      setTimeout(() => {
        setPlayingVocabId(null);
      }, 3500);
    }
  };

  // Simpan Kosakata Baru / Edit
  const handleSaveVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vHanzi || !vPinyin || !vMeaning) {
      alert('Mohon isi Hanzi, Pinyin, dan arti kosakata.');
      return;
    }

    const payload: MandarinVocabItem = {
      id: editingVocabId || `v-${Date.now()}`,
      hskLevel: vHsk,
      themeCategory: vTheme,
      difficulty: vDifficulty,
      hanzi: vHanzi,
      pinyin: vPinyin,
      meaningId: vMeaning,
      exampleSentenceHanzi: vSentHanzi,
      exampleSentencePinyin: vSentPinyin,
      exampleSentenceMeaning: vSentMeaning,
      audioUrl: vAudioFile ? URL.createObjectURL(vAudioFile) : (vAudioUrl || 'https://actions.google.com/sounds/v1/speech/hello.ogg')
    };

    if (editingVocabId) {
      setVocabs(vocabs.map((v) => (v.id === editingVocabId ? payload : v)));
      setAlertMessage(`Kosakata "${vHanzi}" berhasil diperbarui!`);
    } else {
      setVocabs([payload, ...vocabs]);
      setAlertMessage(`Kosakata baru "${vHanzi}" berhasil ditambahkan!`);
    }

    setIsVocabModalOpen(false);
    resetVocabForm();
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const resetVocabForm = () => {
    setEditingVocabId(null);
    setVHanzi('');
    setVPinyin('');
    setVMeaning('');
    setVHsk('HSK 1');
    setVTheme('Sapaan');
    setVDifficulty('Dasar');
    setVSentHanzi('');
    setVSentPinyin('');
    setVSentMeaning('');
    setVAudioUrl('');
    setVAudioFile(null);
  };

  const handleEditVocab = (item: MandarinVocabItem) => {
    setEditingVocabId(item.id);
    setVHanzi(item.hanzi);
    setVPinyin(item.pinyin);
    setVMeaning(item.meaningId);
    setVHsk(item.hskLevel);
    setVTheme(item.themeCategory);
    setVDifficulty(item.difficulty);
    setVSentHanzi(item.exampleSentenceHanzi);
    setVSentPinyin(item.exampleSentencePinyin);
    setVSentMeaning(item.exampleSentenceMeaning);
    setVAudioUrl(item.audioUrl || '');
    setIsVocabModalOpen(true);
  };

  const handleDeleteVocab = (id: string) => {
    if (confirm('Hapus butir kosakata ini dari bank materi santri?')) {
      setVocabs(vocabs.filter((v) => v.id !== id));
      setAlertMessage('Kosakata berhasil dihapus.');
      setTimeout(() => setAlertMessage(null), 2500);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = 'Hanzi,Pinyin,Arti Indonesia,Contoh Hanzi,Contoh Pinyin,Contoh Arti,Level HSK,Tema\n';
    const rows = vocabs.map(v => 
      `"${v.hanzi}","${v.pinyin}","${v.meaningId}","${v.exampleSentenceHanzi}","${v.exampleSentencePinyin}","${v.exampleSentenceMeaning}","${v.hskLevel}","${v.themeCategory}"`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PPJM_Mandarin_HSK_Vocab_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV Dummy Simulator
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 1) {
        setAlertMessage(`Berhasil mengimpor ${lines.length - 1} kosakata dari CSV.`);
      } else {
        setAlertMessage('Format CSV terdeteksi dan berhasil diintegrasikan.');
      }
      setTimeout(() => setAlertMessage(null), 3000);
    };
    reader.readAsText(file);
  };

  // Simpan Paket Kuis Baru
  const handleSaveQuizPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle) {
      alert('Mohon isi judul paket kuis.');
      return;
    }

    const newPkg: QuizPackage = {
      id: `quiz-${Date.now()}`,
      title: qTitle,
      description: qDesc || 'Kuis latihan evaluasi kosakata santri PPJM.',
      hskCategory: qHskCategory,
      durationMinutes: qDuration,
      passingScore: qPassing,
      questions: qQuestions
    };

    setQuizzes([newPkg, ...quizzes]);
    setIsQuizModalOpen(false);
    setQTitle('');
    setQDesc('');
    setAlertMessage(`Paket kuis "${newPkg.title}" berhasil disimpan!`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Simulator Engine
  const startQuizPreview = (pkg: QuizPackage) => {
    setActivePreviewQuiz(pkg);
    setSimQuestionIdx(0);
    setSimSelectedOption(null);
    setSimAnswerSubmitted(false);
    setSimScore(0);
    setSimSecondsLeft(pkg.durationMinutes * 60);
    setSimConfetti(false);
    setSimFinished(false);
  };

  // Simulator Timer Effect
  useEffect(() => {
    if (!activePreviewQuiz || simFinished) return;
    const interval = setInterval(() => {
      setSimSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSimFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activePreviewQuiz, simFinished]);

  const handleSelectSimOption = (idx: number) => {
    if (simAnswerSubmitted) return;
    setSimSelectedOption(idx);
  };

  const handleSubmitSimAnswer = () => {
    if (simSelectedOption === null || !activePreviewQuiz) return;
    const curQ = activePreviewQuiz.questions[simQuestionIdx];
    const isCorrect = simSelectedOption === curQ.correctIndex;
    
    if (isCorrect) {
      setSimScore((s) => s + curQ.points);
    }
    setSimAnswerSubmitted(true);
  };

  const handleNextSimQuestion = () => {
    if (!activePreviewQuiz) return;
    if (simQuestionIdx < activePreviewQuiz.questions.length - 1) {
      setSimQuestionIdx((i) => i + 1);
      setSimSelectedOption(null);
      setSimAnswerSubmitted(false);
    } else {
      setSimFinished(true);
      // Trigger confetti if scored 100 or >= passingScore
      const totalPossible = activePreviewQuiz.questions.reduce((acc, q) => acc + q.points, 0);
      const percent = Math.round((simScore / totalPossible) * 100);
      if (percent >= activePreviewQuiz.passingScore) {
        setSimConfetti(true);
      }
    }
  };

  // Filtered Vocab List
  const filteredVocabs = vocabs.filter((item) => {
    const matchSearch =
      !searchVocab ||
      item.hanzi.toLowerCase().includes(searchVocab.toLowerCase()) ||
      item.pinyin.toLowerCase().includes(searchVocab.toLowerCase()) ||
      item.meaningId.toLowerCase().includes(searchVocab.toLowerCase());
    const matchHsk = selectedHskFilter === 'Semua' || item.hskLevel === selectedHskFilter;
    return matchSearch && matchHsk;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 relative">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER UTAMA: WARNA MERAH CHINA (#C1272D) + EMAS (#C8A951) */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#C1272D] via-[#9B1D22] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#C8A951]/50 text-[#C8A951] text-xs font-black uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#C8A951]" />
              <span>SMART JM • Program Bahasa Asing Mandarin Putonghua (HSK)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Kurikulum Mandarin HSK &amp; Quiz Builder Gamifikasi</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#C8A951] text-slate-950 font-mono">
                汉语水平考试
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              Pusat kelola bank kosakata tematik Hanzi, pelafalan audio pinyin Putonghua beraksen standar, penyusunan kuis interaktif dengan timer dan confetti simulator, serta pantauan nilai akademik santri secara transparan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => { resetVocabForm(); setIsVocabModalOpen(true); }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C8A951] to-amber-500 hover:from-amber-400 hover:to-[#C8A951] text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Kosakata</span>
            </button>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-[#C8A951]" />
              <span>Buat Paket Kuis</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HEADER METRIK SPESIFIKASI PPJM: (320 KATA, 18 KUIS, 320 AUDIO, 45 SANTRI) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Kosakata */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Kosakata HSK
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#C1272D]">320</span>
              <span className="text-xs font-semibold text-slate-500">kata</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              HSK 1, 2, 3 &amp; Tematik
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C1272D] flex items-center justify-center border border-red-100">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Metrik 2: Total Kuis */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Kuis Aktif
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">18</span>
              <span className="text-xs font-semibold text-slate-500">paket kuis</span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              Gamifikasi + Confetti
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metrik 3: Audio File */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Audio Putonghua
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#0E7A4C]">320</span>
              <span className="text-xs font-semibold text-slate-500">file MP3</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              Aksen Native Beijing
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0E7A4C] flex items-center justify-center border border-emerald-100">
            <Volume2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metrik 4: Santri Aktif */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Santri Aktif
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-sky-700">45</span>
              <span className="text-xs font-semibold text-slate-500">santriwan/ti</span>
            </div>
            <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full inline-block">
              Takhassus Bahasa
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Alert Notification Toast */}
      {alertMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TAB NAVIGATION (TAB A, TAB B, TAB C)                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'vocab'
              ? 'bg-[#C1272D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tab A - Bank Kosakata HSK Tematik</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz_builder')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'quiz_builder'
              ? 'bg-[#C1272D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Tab B - Quiz Builder Gamifikasi</span>
        </button>

        <button
          onClick={() => setActiveTab('student_scores')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'student_scores'
              ? 'bg-[#C1272D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tab C - Monitoring Nilai Santri</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* TAB A: BANK KOSAKATA HSK TEMATIK                             */}
      {/* ============================================================= */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          
          {/* Action Toolbar & Filters */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari Hanzi, Pinyin, atau Arti..."
                value={searchVocab}
                onChange={(e) => setSearchVocab(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#C1272D]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['Semua', 'HSK 1', 'HSK 2', 'HSK 3', 'Tematik'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedHskFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedHskFilter === cat
                      ? 'bg-[#C1272D] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Import / Export & Bulk Audio Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <label className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Import CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Ekspor daftar kosakata ke format file CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Tabel Kosakata Lengkap */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Hanzi</th>
                    <th className="py-3.5 px-4">Pinyin</th>
                    <th className="py-3.5 px-4">Arti Indonesia</th>
                    <th className="py-3.5 px-4">Contoh Kalimat Hanzi</th>
                    <th className="py-3.5 px-4">Pinyin Kalimat</th>
                    <th className="py-3.5 px-4">Arti Kalimat</th>
                    <th className="py-3.5 px-4 text-center">Audio</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVocabs.map((v) => {
                    const isPlaying = playingVocabId === v.id;
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Hanzi */}
                        <td className="py-3.5 px-4 font-black text-lg text-[#C1272D] whitespace-nowrap">
                          {v.hanzi}
                          <span className="block text-[10px] font-bold text-slate-400">
                            {v.hskLevel} • {v.themeCategory}
                          </span>
                        </td>

                        {/* Pinyin */}
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-sm whitespace-nowrap">
                          {v.pinyin}
                        </td>

                        {/* Arti Indonesia */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700 max-w-[150px]">
                          {v.meaningId}
                        </td>

                        {/* Contoh Kalimat Hanzi */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 text-xs font-serif max-w-[200px]">
                          {v.exampleSentenceHanzi || '-'}
                        </td>

                        {/* Pinyin Kalimat */}
                        <td className="py-3.5 px-4 text-slate-600 italic max-w-[200px]">
                          {v.exampleSentencePinyin || '-'}
                        </td>

                        {/* Arti Kalimat */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-[200px]">
                          {v.exampleSentenceMeaning || '-'}
                        </td>

                        {/* Audio Player dengan Waveform */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => togglePlayAudio(v.id, v.audioUrl)}
                            className={`p-2 rounded-xl transition-all inline-flex items-center gap-1.5 ${
                              isPlaying
                                ? 'bg-[#C1272D] text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title="Putar Audio Putonghua"
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                {/* Waveform sederhana */}
                                <div className="flex items-end gap-0.5 h-3 px-1">
                                  <span className="w-0.5 h-2 bg-white animate-pulse" />
                                  <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                                  <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
                                </div>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold">Play</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleEditVocab(v)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Edit Kosakata"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVocab(v.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title="Hapus Kosakata"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredVocabs.length === 0 && (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Tidak ada kosakata yang cocok dengan pencarian atau filter Anda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB B: QUIZ BUILDER GAMIFIKASI                                */}
      {/* ============================================================= */}
      {activeTab === 'quiz_builder' && (
        <div className="space-y-6">
          
          {/* List Paket Kuis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-[#C1272D] border border-red-200">
                      {q.hskCategory}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {q.durationMinutes} menit
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900">{q.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{q.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 font-medium">
                    <span>{q.questions.length} Butir Soal</span>
                    <span>•</span>
                    <span>Passing Score: <strong className="text-emerald-700">{q.passingScore}%</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => startQuizPreview(q)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C1272D] to-red-600 text-white font-black text-xs shadow-sm hover:shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Uji Preview Kuis Santri</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (confirm('Hapus paket kuis ini?')) {
                          setQuizzes(quizzes.filter(item => item.id !== q.id));
                        }
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                      title="Hapus Kuis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SIMULATOR PREVIEW KUIS SEPERTI SANTRI (IF ACTIVE) */}
          {activePreviewQuiz && (
            <div className="bg-gradient-to-br from-[#0A2116] via-[#1a080a] to-[#0A2116] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#C8A951]/60 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn">
              
              {/* Confetti Selebrasi Banner */}
              {simConfetti && (
                <div className="p-4 rounded-2xl bg-[#C8A951] text-slate-950 font-black text-center text-sm shadow-xl animate-bounce">
                  🎉 太棒了！(Tài bàng le! Luar Biasa!) Anda Menuntaskan Kuis dengan Skor Mumtaz!
                </div>
              )}

              {/* Header Simulator */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C1272D] text-white text-[10px] font-black uppercase">
                    <span>Simulasi Tampilan Santri PPJM</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{activePreviewQuiz.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 font-mono text-sm font-black text-[#C8A951]">
                    <Clock className="w-4 h-4 animate-pulse text-red-500" />
                    <span>
                      {Math.floor(simSecondsLeft / 60)}:
                      {simSecondsLeft % 60 < 10 ? `0${simSecondsLeft % 60}` : simSecondsLeft % 60}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                    Skor: <strong className="text-white text-sm">{simScore}</strong> Poin
                  </div>

                  <button
                    onClick={() => setActivePreviewQuiz(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                    title="Tutup Simulasi"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Soal {simQuestionIdx + 1} dari {activePreviewQuiz.questions.length}</span>
                  <span>{Math.round(((simQuestionIdx + 1) / activePreviewQuiz.questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C1272D] to-[#C8A951] transition-all duration-300"
                    style={{ width: `${((simQuestionIdx + 1) / activePreviewQuiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pertanyaan Aktif */}
              {!simFinished ? (
                (() => {
                  const q = activePreviewQuiz.questions[simQuestionIdx];
                  return (
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/40">
                          {q.type} • {q.points} Poin
                        </span>

                        <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                          {q.prompt}
                        </h4>

                        {/* Prompt Hanzi besar jika ada */}
                        {q.promptHanzi && (
                          <div className="text-3xl sm:text-4xl font-black text-[#C8A951] py-2 font-serif">
                            {q.promptHanzi}
                          </div>
                        )}

                        {/* Prompt Pinyin */}
                        {q.promptPinyin && (
                          <div className="text-sm font-semibold text-red-200">
                            {q.promptPinyin}
                          </div>
                        )}

                        {/* Tombol Play Audio jika kuis listening */}
                        {q.audioUrl && (
                          <button
                            type="button"
                            onClick={() => togglePlayAudio('sim-audio', q.audioUrl)}
                            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 mt-2"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>Putar Soal Audio Putonghua</span>
                          </button>
                        )}
                      </div>

                      {/* 4 Opsi Jawaban */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, idx) => {
                          const isSelected = simSelectedOption === idx;
                          const isCorrect = idx === q.correctIndex;

                          let btnStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-white';
                          if (simAnswerSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-600/90 border-rose-400 text-white';
                            } else {
                              btnStyle = 'bg-white/5 border-white/10 opacity-40 text-white';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#C1272D] border-[#C8A951] text-white ring-2 ring-[#C8A951]';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectSimOption(idx)}
                              disabled={simAnswerSubmitted}
                              className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {simAnswerSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-200" />}
                              {simAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-200" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Pembahasan & Action Button */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        {simAnswerSubmitted && (
                          <div className="text-xs text-amber-200/90 bg-amber-950/60 p-3 rounded-xl border border-amber-500/30 w-full sm:w-auto flex-1">
                            <strong>Pembahasan Asatidz:</strong> {q.explanation}
                          </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          {!simAnswerSubmitted ? (
                            <button
                              onClick={handleSubmitSimAnswer}
                              disabled={simSelectedOption === null}
                              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A951] to-amber-500 text-slate-950 font-black text-xs disabled:opacity-40"
                            >
                              Kunci Jawaban
                            </button>
                          ) : (
                            <button
                              onClick={handleNextSimQuestion}
                              className="px-6 py-2.5 rounded-xl bg-[#C1272D] hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5"
                            >
                              <span>{simQuestionIdx < activePreviewQuiz.questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Layar Selesai Kuis */
                <div className="text-center py-8 space-y-4">
                  <Award className="w-16 h-16 text-[#C8A951] mx-auto animate-bounce" />
                  <h4 className="text-2xl font-black text-white">Simulasi Kuis Telah Selesai!</h4>
                  <div className="text-sm text-slate-300">
                    Skor Akhir Anda: <strong className="text-[#C8A951] text-xl">{simScore}</strong> Poin
                  </div>
                  <button
                    onClick={() => startQuizPreview(activePreviewQuiz)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs"
                  >
                    Ulangi Kuis
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB C: MONITORING NILAI SANTRI                                */}
      {/* ============================================================= */}
      {activeTab === 'student_scores' && (
        <div className="space-y-6">
          
          {/* Grafik Sederhana Rata-Rata Nilai per HSK Level */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C1272D]" />
                  <span>Grafik Rata-Rata Capaian Nilai per Level HSK</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Statistik performa 45 santri aktif kelas Mandarin semester ganjil 2026.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {/* Level HSK 1 */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-red-900">
                  <span>HSK 1 (Dasar)</span>
                  <span className="text-sm font-black text-[#C1272D]">92.4%</span>
                </div>
                <div className="w-full h-3 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C1272D] rounded-full" style={{ width: '92.4%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Mumtaz (Sangat Baik)</span>
              </div>

              {/* Level HSK 2 */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-amber-900">
                  <span>HSK 2 (Menengah)</span>
                  <span className="text-sm font-black text-amber-600">86.8%</span>
                </div>
                <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '86.8%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Jayyid Jiddan</span>
              </div>

              {/* Level HSK 3 */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-sky-900">
                  <span>HSK 3 (Lanjutan)</span>
                  <span className="text-sm font-black text-sky-700">79.5%</span>
                </div>
                <div className="w-full h-3 bg-sky-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '79.5%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Jayyid (Baik)</span>
              </div>

              {/* Tematik Sapaan & Ibadah */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
                  <span>Tematik Ibadah</span>
                  <span className="text-sm font-black text-[#0E7A4C]">94.0%</span>
                </div>
                <div className="w-full h-3 bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0E7A4C] rounded-full" style={{ width: '94.0%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Mumtaz Murtafi'</span>
              </div>
            </div>
          </div>

          {/* Tabel Nilai Santri */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900">
                Daftar Rekapitulasi Nilai Santri Terbaru
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                Menampilkan 5 pengerjaan terakhir
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Nama Santri</th>
                    <th className="py-3 px-4">Kuis</th>
                    <th className="py-3 px-4 text-center">Skor</th>
                    <th className="py-3 px-4">Waktu Pengerjaan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scores.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sc.studentName}
                        <span className="block text-[10px] text-slate-400 font-mono">{sc.nis}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {sc.quizTitle}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-xl font-black text-xs ${
                          sc.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sc.score} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {sc.durationSpent} menit
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          sc.isPassed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {sc.isPassed ? 'Lulus' : 'Remedial'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        {sc.takenAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL FORM TAMBAH / EDIT KOSAKATA (TAB A)                     */}
      {/* ------------------------------------------------------------- */}
      {isVocabModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C1272D]" />
                <span>{editingVocabId ? 'Edit Kosakata HSK' : 'Tambah Kosakata Mandarin Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => { setIsVocabModalOpen(false); resetVocabForm(); }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVocab} className="space-y-4">
              
              {/* Hanzi Font Besar */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Karakter Hanzi: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 你好"
                  value={vHanzi}
                  onChange={(e) => setVHanzi(e.target.value)}
                  className="w-full px-4 py-3 text-2xl font-black text-[#C1272D] rounded-xl border border-slate-200 focus:outline-none focus:border-[#C1272D] font-serif"
                />
              </div>

              {/* Pinyin dengan Tone Mark Helper */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Pinyin (dengan Tone Mark): *</label>
                  <span className="text-[10px] text-slate-400">Klik huruf nada untuk menyisipkan</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: nǐ hǎo"
                  value={vPinyin}
                  onChange={(e) => setVPinyin(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#C1272D]"
                />
                
                {/* Tone Mark Quick Insert Buttons */}
                <div className="flex flex-wrap gap-1 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  {toneMarks.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setVPinyin((prev) => prev + tone)}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-red-50 text-slate-700 hover:text-[#C1272D] border border-slate-200 font-mono font-bold text-xs"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arti Indonesia */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Arti Bahasa Indonesia: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: halo / apa kabar"
                  value={vMeaning}
                  onChange={(e) => setVMeaning(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Kategori HSK & Tema & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Level HSK: *</label>
                  <select
                    value={vHsk}
                    onChange={(e) => setVHsk(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="Tematik">Tematik</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tema Kategori: *</label>
                  <select
                    value={vTheme}
                    onChange={(e) => setVTheme(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Sapaan">Sapaan</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Ibadah & Adab">Ibadah &amp; Adab</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tingkat Kesulitan: *</label>
                  <select
                    value={vDifficulty}
                    onChange={(e) => setVDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Dasar">Dasar</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
              </div>

              {/* Contoh Kalimat (Hanzi, Pinyin, Arti) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Contoh Penggunaan dalam Kalimat:</span>
                
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Kalimat Hanzi (contoh: 你好吗？我很好。)"
                    value={vSentHanzi}
                    onChange={(e) => setVSentHanzi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-serif"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Pinyin Kalimat (contoh: nǐ hǎo ma? wǒ hěn hǎo.)"
                    value={vSentPinyin}
                    onChange={(e) => setVSentPinyin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Arti Kalimat (contoh: Apa kabarmu? Saya sangat baik.)"
                    value={vSentMeaning}
                    onChange={(e) => setVSentMeaning(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Upload Audio Putonghua MP3 */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Upload Audio Pelafalan Putonghua (MP3):</span>
                  {vAudioFile && <span className="text-emerald-700 text-[10px] font-bold">File Terpilih</span>}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setVAudioFile(f);
                  }}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#C1272D] file:text-white"
                />
              </div>

              {/* Tombol Aksi Form */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsVocabModalOpen(false); resetVocabForm(); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C1272D] hover:bg-red-700 text-white font-bold text-xs shadow-md"
                >
                  {editingVocabId ? 'Simpan Perubahan' : 'Tambahkan Kosakata'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL QUIZ BUILDER (TAB B)                                    */}
      {/* ------------------------------------------------------------- */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C1272D]" />
                <span>Quiz Builder Gamifikasi Mandarin</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsQuizModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuizPackage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Paket Kuis: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kuis Sapaan Dasar HSK 1 - 20 Soal"
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  placeholder="Uraikan materi uji dan tujuan pembelajaran..."
                  value={qDesc}
                  onChange={(e) => setQDesc(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori HSK: *</label>
                  <select
                    value={qHskCategory}
                    onChange={(e) => setQHskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="Tematik Sapaan">Tematik Sapaan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Durasi Timer (Menit): *</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={qDuration}
                    onChange={(e) => setQDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Passing Score (%): *</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={qPassing}
                    onChange={(e) => setQPassing(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Preview Butir Soal Default */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Daftar Soal Tersusun ({qQuestions.length} Soal)</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Siap Disimpan
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Paket kuis ini telah dikonfigurasi dengan tipe soal Pilihan Ganda, Tebak Hanzi, dan Audio Listening dengan confetti selebrasi otomatis.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C1272D] hover:bg-red-700 text-white font-bold text-xs shadow-md"
                >
                  Simpan Paket Kuis
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default KelolaMandarin;
