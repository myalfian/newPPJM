import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Globe,
  BookOpen,
  HelpCircle,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Maximize2,
  X,
  ArrowRight,
  Trophy,
  Award,
  Layers,
  Check,
  Languages
} from 'lucide-react';
import {
  MandarinTopicItem,
  MandarinQuizTopic,
  MandarinQuizQuestion
} from './types';

// ========================
// MOCK DATA: MANDARIN TOPICS
// ========================
const MANDARIN_TOPICS: MandarinTopicItem[] = [
  {
    id: 'topic-hanzi-pinyin',
    topicKey: 'pinyin',
    topicName: 'Hanzi Dasar & 4 Nada Pinyin',
    chineseName: '拼音与声调 (Pīnyīn yǔ Shēngdiào)',
    level: 'Tingkat Pemula (Dasar)',
    posterFlyer:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    summary:
      'Memahami 4 nada dasar vokal bahasa Mandarin (Nada 1 Datar, Nada 2 Naik, Nada 3 Turun-Naik, Nada 4 Hentak) serta goresan dasar radikal Hanzi.',
    narrative:
      'Bahasa Mandarin adalah bahasa bernada (tonal language). Perubahan nada pada suku kata yang sama dapat mengubah arti secara menyeluruh. Santri dilatih melafalkan vokal dan konsonan awal (shengmu) serta konsonan akhir (yunmu) secara terstandar.',
    culturalNote:
      'Contoh kata "mā" (Ibu), "má" (Rami), "mǎ" (Kuda), dan "mà" (Memarahi). Santri PPJM diajarkan menyelaraskan makhraj huruf hijaiyah dengan kemiripan bunyi pinyin Mandarin.',
    vocabularies: [
      { hanzi: '一', pinyin: 'yī', indonesian: 'Satu', exampleSentence: '一个人 (Yī gè rén - Satu orang)' },
      { hanzi: '大', pinyin: 'dà', indonesian: 'Besar', exampleSentence: '大学校 (Dà xuéxiào - Sekolah besar)' },
      { hanzi: '好', pinyin: 'hǎo', indonesian: 'Baik / Bagus', exampleSentence: '很好 (Hěn hǎo - Sangat baik)' },
      { hanzi: '人', pinyin: 'rén', indonesian: 'Orang / Manusia', exampleSentence: '印尼人 (Yìnní rén - Orang Indonesia)' },
      { hanzi: '学', pinyin: 'xué', indonesian: 'Belajar', exampleSentence: '学生 (Xuéshēng - Murid / Santri)' },
      { hanzi: '中', pinyin: 'zhōng', indonesian: 'Tengah / Pusat', exampleSentence: '中文 (Zhōngwén - Bahasa Mandarin)' }
    ]
  },
  {
    id: 'topic-salam',
    topicKey: 'salam',
    topicName: 'Salam & Sapaan Santri',
    chineseName: '问候与礼貌 (Wènhòu yǔ Lǐmào)',
    level: 'Percakapan Harian 1',
    posterFlyer:
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    summary:
      'Ungkapan sopan menyapa asatidz, sesama kawan santri, ucapan terima kasih, dan adab meminta maaf dalam budaya komunikasi Tiongkok.',
    narrative:
      'Santri dibekali etika diplomasi internasional dengan menjunjung akhlak mulia. Melalui materi salam ini, santri siap menyambut tamu kehormatan maupun perwakilan universitas luar negeri yang berkunjung ke PPJM.',
    culturalNote:
      'Penggunaan "Nín" (您) sebagai bentuk penghormatan tinggi kepada guru/asatidz dan orang yang lebih tua, berbeda dengan "Nǐ" (你) untuk kawan sebaya.',
    vocabularies: [
      { hanzi: '你好', pinyin: 'Nǐ hǎo', indonesian: 'Halo / Semoga Sejahtera', exampleSentence: '你好，朋友！ (Nǐ hǎo, péngyǒu! - Halo kawan!)' },
      { hanzi: '您好', pinyin: 'Nín hǎo', indonesian: 'Halo (Bentuk Hormat ke Guru/Ustadz)', exampleSentence: '老师，您好！ (Lǎoshī, nín hǎo! - Halo Ustadz!)' },
      { hanzi: '谢谢', pinyin: 'Xièxie', indonesian: 'Terima kasih', exampleSentence: '非常感谢 (Fēicháng gǎnxiè - Terima kasih banyak)' },
      { hanzi: '不客气', pinyin: 'Bù kèqì', indonesian: 'Sama-sama / Kembali', exampleSentence: '不用谢，不客气 (Bù yòng xiè, bù kèqì - Sama-sama)' },
      { hanzi: '对不起', pinyin: 'Duìbuqǐ', indonesian: 'Mohon Maaf', exampleSentence: '对不起，我迟到了 (Duìbuqǐ, wǒ chídào le - Maaf saya terlambat)' },
      { hanzi: '再见', pinyin: 'Zàijiàn', indonesian: 'Sampai Jumpa Lagi', exampleSentence: '明天再见！ (Míngtiān zàijiàn! - Sampai jumpa besok!)' }
    ]
  },
  {
    id: 'topic-angka-waktu',
    topicKey: 'waktu',
    topicName: 'Angka & Penunjuk Waktu',
    chineseName: '数字与时间 (Shùzì yǔ Shíjiān)',
    level: 'Percakapan Harian 2',
    posterFlyer:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    summary:
      'Penguasaan sistem bilangan 1-100, penyebutan jam, menit, hari, tanggal, dan bulan untuk kedisiplinan jadwal harian santri.',
    narrative:
      'Penyebutan waktu dalam bahasa Mandarin mengikuti struktur dari unit terbesar ke terkecil (Tahun -> Bulan -> Tanggal -> Jam -> Menit). Sangat cocok untuk mendeskripsikan jadwal amaliyah santri secara runut.',
    culturalNote:
      'Angka 8 (Bā - 八) dianggap melambangkan keberuntungan dan kemakmuran karena berima dengan Fā (发 - berkembang).',
    vocabularies: [
      { hanzi: '今天', pinyin: 'Jīntiān', indonesian: 'Hari Ini', exampleSentence: '今天是星期一 (Jīntiān shì xīngqīyī - Hari ini hari Senin)' },
      { hanzi: '明天', pinyin: 'Míngtiān', indonesian: 'Besok', exampleSentence: '明天我们要考试 (Míngtiān wǒmen yào kǎoshì - Besok kita ujian)' },
      { hanzi: '点', pinyin: 'diǎn', indonesian: 'Jam / Pukul', exampleSentence: '早上五点 (Zǎoshang wǔ diǎn - Pukul 5 pagi)' },
      { hanzi: '半', pinyin: 'bàn', indonesian: 'Setengah (30 Menit)', exampleSentence: '三点半 (Sān diǎn bàn - Pukul 3 lewat 30 menit)' },
      { hanzi: '星期', pinyin: 'xīngqī', indonesian: 'Minggu / Hari Pekan', exampleSentence: '星期五祈祷 (Xīngqīwǔ qǐdǎo - Shalat Jumat)' },
      { hanzi: '月', pinyin: 'yuè', indonesian: 'Bulan', exampleSentence: '斋月 (Zhāiyuè - Bulan Ramadhan)' }
    ]
  },
  {
    id: 'topic-pesantren',
    topicKey: 'pesantren',
    topicName: 'Kehidupan & Belajar di Pondok',
    chineseName: '伊斯兰寄宿学校的生活 (Jìsù Xuéxiào)',
    level: 'Kosakata Khusus Tematik',
    posterFlyer:
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
    summary:
      'Kosakata khas pesantren: membaca Al-Qur’an, sholat berjamaah, asrama, mengkaji kitab kuning, dan kedisiplinan santri.',
    narrative:
      'Santri PPJM dibina agar mampu menjelaskan identitas pesantren sebagai kawah candradimuka ilmu dan moral kepada khalayak penutur bahasa Mandarin di seluruh dunia.',
    culturalNote:
      'Istilah "伊斯兰寄宿学校" (Yīsīlán jìsù xuéxiào) merupakan padanan terjemahan resmi untuk institusi Pondok Pesantren.',
    vocabularies: [
      { hanzi: '古兰经', pinyin: 'Gǔlánjīng', indonesian: 'Kitab Suci Al-Qur’an', exampleSentence: '每天读古兰经 (Měitiān dú Gǔlánjīng - Membaca Quran setiap hari)' },
      { hanzi: '礼拜', pinyin: 'Lǐbài', indonesian: 'Sholat / Ibadah', exampleSentence: '集体礼拜 (Jítǐ lǐbài - Sholat berjamaah)' },
      { hanzi: '宿舍', pinyin: 'Sùshè', indonesian: 'Asrama Santri', exampleSentence: '学生宿舍很干净 (Xuéshēng sùshè hěn gānjìng - Asrama santri bersih)' },
      { hanzi: '清真寺', pinyin: 'Qīngzhēnsì', indonesian: 'Masjid', exampleSentence: '我们在清真寺学习 (Wǒmen zài qīngzhēnsì xuéxí - Kami belajar di masjid)' },
      { hanzi: '清真', pinyin: 'Qīngzhēn', indonesian: 'Halal (Makanan/Minuman)', exampleSentence: '清真食品 (Qīngzhēn shípǐn - Makanan halal)' },
      { hanzi: '朋友', pinyin: 'Péngyǒu', indonesian: 'Sahabat / Teman Santri', exampleSentence: '同舍朋友 (Tóng shè péngyǒu - Teman sekamar asrama)' }
    ]
  }
];

// ========================
// MOCK DATA: MANDARIN QUIZZES
// ========================
const MANDARIN_QUIZZES: MandarinQuizTopic[] = [
  {
    id: 'quiz-salam',
    title: 'Kuis Salam & Sapaan Santri',
    chineseTitle: '问候测试 (Wènhòu Cèshì)',
    level: 'Level 1',
    description: 'Uji pemahaman kosakata salam, ungkapan terima kasih, dan adab penghormatan.',
    questions: [
      {
        id: 'qs-1',
        topicId: 'quiz-salam',
        hanzi: '你好',
        pinyin: 'Nǐ hǎo',
        question: 'Apa arti dari ungkapan "你好" (Nǐ hǎo)?',
        options: ['Selamat tinggal', 'Halo / Salam Sejahtera', 'Terima kasih', 'Mohon maaf'],
        correctIndex: 1,
        explanation: '"你好" (Nǐ hǎo) adalah salam sapaan universal paling umum dalam bahasa Mandarin.'
      },
      {
        id: 'qs-2',
        topicId: 'quiz-salam',
        hanzi: '谢谢',
        pinyin: 'Xièxie',
        question: 'Bagaimana cara santri mengucapkan "Terima kasih" dalam bahasa Mandarin?',
        options: ['对不起 (Duìbuqǐ)', '再见 (Zàijiàn)', '谢谢 (Xièxie)', '不用谢 (Bù yòng xiè)'],
        correctIndex: 2,
        explanation: '"谢谢" (Xièxie) artinya terima kasih, dijawab dengan "不客气" (Bù kèqì).'
      },
      {
        id: 'qs-3',
        topicId: 'quiz-salam',
        hanzi: '您好',
        pinyin: 'Nín hǎo',
        question: 'Kapan bentuk "您好" (Nín hǎo) sebaiknya digunakan santri?',
        options: [
          'Saat menyapa kawan sebaya di asrama',
          'Saat menyapa guru, asatidz, atau orang yang dihormati',
          'Saat hendak tidur malam di kamar',
          'Saat memesan makanan di kantin'
        ],
        correctIndex: 1,
        explanation: '"您" (Nín) adalah kata ganti orang kedua tunggal bentuk sopan untuk menghormati guru/orang tua.'
      },
      {
        id: 'qs-4',
        topicId: 'quiz-salam',
        hanzi: '再见',
        pinyin: 'Zàijiàn',
        question: 'Arti dari ungkapan "再见" (Zàijiàn) adalah...',
        options: ['Selamat pagi', 'Sampai jumpa lagi', 'Permisi lewat', 'Selamat makan'],
        correctIndex: 1,
        explanation: '"再" (zài) berarti lagi, dan "见" (jiàn) berarti bertemu. Maknanya: sampai bertemu kembali.'
      }
    ]
  },
  {
    id: 'quiz-angka',
    title: 'Kuis Angka & Penunjuk Waktu',
    chineseTitle: '数字时间测试 (Shùzì Shíjiān)',
    level: 'Level 2',
    description: 'Uji ketepatan membaca angka, jam, menit, dan nama hari dalam sepekan.',
    questions: [
      {
        id: 'qa-1',
        topicId: 'quiz-angka',
        hanzi: '三点半',
        pinyin: 'Sān diǎn bàn',
        question: 'Waktu apakah yang ditunjukkan oleh "三点半" (Sān diǎn bàn)?',
        options: ['Pukul 03.15', 'Pukul 03.30', 'Pukul 04.30', 'Pukul 03.03'],
        correctIndex: 1,
        explanation: '"三点" = Jam 3, "半" = setengah (30 menit). Jadi artinya pukul 03.30.'
      },
      {
        id: 'qa-2',
        topicId: 'quiz-angka',
        hanzi: '今天',
        pinyin: 'Jīntiān',
        question: 'Kosakata "今天" (Jīntiān) memiliki arti...',
        options: ['Kemarin', 'Hari ini', 'Besok lusa', 'Minggu depan'],
        correctIndex: 1,
        explanation: '"今天" (Jīntiān) berarti hari ini. Besok adalah "明天" (Míngtiān).'
      },
      {
        id: 'qa-3',
        topicId: 'quiz-angka',
        hanzi: '五',
        pinyin: 'Wǔ',
        question: 'Karakter Hanzi untuk angka "5" adalah...',
        options: ['四', '六', '五', '八'],
        correctIndex: 2,
        explanation: 'Karakter "五" dibaca wǔ yang melambangkan angka 5.'
      }
    ]
  },
  {
    id: 'quiz-pesantren',
    title: 'Kuis Kehidupan Pesantren',
    chineseTitle: '寄宿学校测试 (Jìsù Xuéxiào)',
    level: 'Level 3',
    description: 'Uji penguasaan kosakata santri, Al-Qur’an, sholat, dan asrama.',
    questions: [
      {
        id: 'qp-1',
        topicId: 'quiz-pesantren',
        hanzi: '古兰经',
        pinyin: 'Gǔlánjīng',
        question: 'Apa arti dari istilah "古兰经" (Gǔlánjīng)?',
        options: ['Kitab Fiqih', 'Al-Qur’an', 'Kamus Bahasa', 'Buku Hadits'],
        correctIndex: 1,
        explanation: '"古兰经" (Gǔlánjīng) adalah terjemahan resmi bahasa Mandarin untuk Kitab Suci Al-Qur’an.'
      },
      {
        id: 'qp-2',
        topicId: 'quiz-pesantren',
        hanzi: '清真寺',
        pinyin: 'Qīngzhēnsì',
        question: 'Bangunan tempat ibadah yang dimaksud dengan "清真寺" adalah...',
        options: ['Asrama santri', 'Perpustakaan', 'Masjid', 'Gedung sekolah'],
        correctIndex: 2,
        explanation: '"清真寺" (Qīngzhēnsì) berarti Masjid (tempat suci yang murni dan benar).'
      },
      {
        id: 'qp-3',
        topicId: 'quiz-pesantren',
        hanzi: '学生',
        pinyin: 'Xuéshēng',
        question: 'Kosakata "学生" (Xuéshēng) berarti...',
        options: ['Guru / Asatidz', 'Murid / Pelajar / Santri', 'Kepala Sekolah', 'Wali Santri'],
        correctIndex: 1,
        explanation: '"学生" (Xuéshēng) artinya murid atau pelajar.'
      }
    ]
  }
];

export const MandarinClassSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'materi' | 'quiz'>('materi');
  const [selectedTopic, setSelectedTopic] = useState<MandarinTopicItem>(MANDARIN_TOPICS[0]);
  const [flyerLightbox, setFlyerLightbox] = useState<string | null>(null);

  // Quiz State
  const [activeQuizTopic, setActiveQuizTopic] = useState<MandarinQuizTopic>(MANDARIN_QUIZZES[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [answeredState, setAnsweredState] = useState<boolean>(false);

  // Web Speech API Pronunciation Helper
  const speakChinese = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentQuestions = activeQuizTopic.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (answeredState) return;

    setSelectedAnswerIndex(index);
    setAnsweredState(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setAnsweredState(false);
    } else {
      setIsQuizCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAnsweredState(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleSwitchQuizTopic = (topic: MandarinQuizTopic) => {
    setActiveQuizTopic(topic);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAnsweredState(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ========================================================= */}
      {/* SUB-SECTION TOGGLER: MATERI BELAJAR vs QUIZ INTERAKTIF */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/80 dark:border-red-800/80 text-red-800 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Kelas Bahasa Mandarin Santri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Mandarin Class PPJM
          </h2>
        </div>

        {/* Pill Sub-Navigation Switcher */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('materi')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 active:scale-[0.98] ${
              activeSubTab === 'materi'
                ? 'bg-white dark:bg-zinc-800 text-red-700 dark:text-red-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materi Belajar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('quiz')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 active:scale-[0.98] ${
              activeSubTab === 'quiz'
                ? 'bg-white dark:bg-zinc-800 text-red-700 dark:text-red-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz Interaktif</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* KONTEN 1: MATERI BELAJAR BERBASIS TOPIK */}
      {/* ========================================================= */}
      {activeSubTab === 'materi' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Topik Pills Horizontal Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MANDARIN_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-zinc-50'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{topic.topicName}</span>
                </button>
              );
            })}
          </div>

          {/* Kartu Detail Materi Terpilih */}
          <div className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
            {/* Header Topik */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/70 px-3 py-1 rounded-full border border-red-200/60 dark:border-red-800/60">
                  {selectedTopic.level}
                </span>
                <span className="text-sm font-semibold text-zinc-400 font-mono">
                  {selectedTopic.chineseName}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                {selectedTopic.topicName}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Split Grid: Poster Ringkasan Visual (aspect-[3/4]) & Kosakata */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Poster Flyer Visual (aspect-[3/4], rounded-xl, lightbox zoom) */}
              <div
                className="lg:col-span-4 relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-md cursor-pointer group"
                onClick={() => setFlyerLightbox(selectedTopic.posterFlyer)}
                title="Klik untuk perbesar poster materi"
              >
                <img
                  src={selectedTopic.posterFlyer}
                  alt={selectedTopic.topicName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider block">
                    Poster Ringkasan Kosakata
                  </span>
                  <div className="text-lg font-bold font-mono">
                    {selectedTopic.chineseName}
                  </div>
                  <p className="text-[11px] text-zinc-300 line-clamp-2">
                    {selectedTopic.summary}
                  </p>
                </div>
              </div>

              {/* Teks Penjelasan & Tabel Kosakata Tematik */}
              <div className="lg:col-span-8 space-y-6">
                {/* Narasi Kontekstual */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800/50 space-y-2 text-xs sm:text-sm">
                  <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs">
                    Pengantar Konteks & Catatan Santri:
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedTopic.narrative}
                  </p>
                  {selectedTopic.culturalNote && (
                    <div className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30 mt-2">
                      💡 <strong>Catatan Pelafalan:</strong> {selectedTopic.culturalNote}
                    </div>
                  )}
                </div>

                {/* Daftar Kosakata Inti (Cards List) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                      Daftar Kosakata Hanzi, Pinyin & Makna
                    </h4>
                    <span className="text-xs text-zinc-400">
                      Klik ikon speaker untuk audio pelafalan
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTopic.vocabularies.map((vocab, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:border-red-500/40 transition-all flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400 font-serif">
                              {vocab.hanzi}
                            </span>
                            <span className="text-xs font-bold text-zinc-500 font-mono">
                              {vocab.pinyin}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            {vocab.indonesian}
                          </div>
                          {vocab.exampleSentence && (
                            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 italic mt-0.5">
                              {vocab.exampleSentence}
                            </div>
                          )}
                        </div>

                        {/* Speaker Button */}
                        <button
                          type="button"
                          onClick={() => speakChinese(vocab.hanzi)}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-950/80 dark:hover:bg-red-900/80 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                          title="Dengarkan pelafalan asli"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* KONTEN 2: QUIZ INTERAKTIF BERBASIS TOPIK */}
      {/* ========================================================= */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Filter Topik Kuis */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">
              Pilih Kuis:
            </span>
            {MANDARIN_QUIZZES.map((qz) => {
              const isSelected = activeQuizTopic.id === qz.id;
              return (
                <button
                  key={qz.id}
                  type="button"
                  onClick={() => handleSwitchQuizTopic(qz)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[38px] active:scale-[0.98] ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  {qz.title}
                </button>
              );
            })}
          </div>

          {/* Area Kuis Interaktif */}
          {!isQuizCompleted ? (
            <div className="max-w-2xl mx-auto bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 sm:p-8 shadow-md space-y-6">
              {/* Header Kuis: Indikator Nomor & Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    {activeQuizTopic.chineseTitle}
                  </span>
                  <span>
                    Soal <strong>{currentQuestionIndex + 1}</strong> dari{' '}
                    <strong>{currentQuestions.length}</strong>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Kartu Soal */}
              <div className="text-center py-4 space-y-3">
                {currentQuestion.hanzi && (
                  <div className="space-y-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-red-600 dark:text-red-400 font-serif block">
                      {currentQuestion.hanzi}
                    </span>
                    {currentQuestion.pinyin && (
                      <span className="text-sm font-semibold text-zinc-400 font-mono block">
                        ({currentQuestion.pinyin})
                      </span>
                    )}
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Pilihan Opsi Jawaban (Feedback Instan Hijau/Merah) */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const isChosen = selectedAnswerIndex === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let buttonStyle =
                    'bg-zinc-50 dark:bg-zinc-800/70 border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200';

                  if (answeredState) {
                    if (isCorrect) {
                      buttonStyle =
                        'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs';
                    } else if (isChosen && !isCorrect) {
                      buttonStyle =
                        'bg-red-50 dark:bg-red-950/70 border-red-500 text-red-800 dark:text-red-200 shadow-xs';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answeredState}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 min-h-[48px] active:scale-[0.99] cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {answeredState && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {answeredState && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Kotak Penjelasan Saat Sudah Terjawab */}
              {answeredState && (
                <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-1.5 animate-in fade-in duration-200">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Penjelasan Jawaban:</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Tombol Lanjut Soal */}
              {answeredState && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>
                      {currentQuestionIndex < currentQuestions.length - 1
                        ? 'Pertanyaan Selanjutnya'
                        : 'Lihat Hasil Akhir'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Layar Skor Akhir Interaktif */
            <div className="max-w-md mx-auto bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-8 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Kuis Selesai!
                </span>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                  Skor Anda: {Math.round((score / currentQuestions.length) * 100)}%
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Anda berhasil menjawab <strong>{score}</strong> dari{' '}
                  <strong>{currentQuestions.length}</strong> soal dengan tepat.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('materi')}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>Kembali ke Materi Belajar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Flyer Zoom */}
      {flyerLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setFlyerLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFlyerLightbox(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[3/4] w-full bg-black">
              <img
                src={flyerLightbox}
                alt="Flyer Zoom"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

