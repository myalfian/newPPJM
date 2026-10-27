import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Volume2,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Award,
  Play
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

export interface QuizQuestion {
  id: string;
  hanzi?: string;
  pinyin?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  chineseTitle: string;
  level: string;
  description: string;
  coverImage: string;
  questions: QuizQuestion[];
}

const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: 'topic-salam',
    title: 'Salam & Sapaan Santri',
    chineseTitle: '问候 (Wènhòu)',
    level: 'Tingkat Dasar 1',
    description: 'Uji penguasaan sapaan harian, adab bertamu, dan cara menyapa ustadz serta sesama santri dalam bahasa Mandarin.',
    coverImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1-1',
        hanzi: '你好',
        pinyin: 'Nǐ hǎo',
        question: 'Apa arti dari sapaan dasar "你好" (Nǐ hǎo)?',
        options: [
          'Selamat tinggal',
          'Halo / Semoga Sejahtera',
          'Terima kasih banyak',
          'Selamat pagi ustadz'
        ],
        correctIndex: 1,
        explanation: '你好 (Nǐ hǎo) adalah sapaan paling mendasar dan ramah dalam bahasa Mandarin yang berarti Halo.'
      },
      {
        id: 'q1-2',
        hanzi: '很高兴认识你',
        pinyin: 'Hěn gāoxìng rènshí nǐ',
        question: 'Kapan ungkapan "很高兴认识你" biasanya diucapkan?',
        options: [
          'Saat berpamitan pulang kampung',
          'Saat pertama kali berkenalan dengan santri baru',
          'Saat meminta maaf atas keterlambatan',
          'Saat selesai sholat berjamaah'
        ],
        correctIndex: 1,
        explanation: '很高兴认识你 (Hěn gāoxìng rènshí nǐ) bermakna "Sangat senang berkenalan denganmu".'
      },
      {
        id: 'q1-3',
        hanzi: '早上好',
        pinyin: 'Zǎoshang hǎo',
        question: 'Pilihlah sapaan yang tepat untuk mengucapkan "Selamat Pagi":',
        options: [
          'Wǎnshang hǎo (晚上好)',
          'Zàijiàn (再见)',
          'Zǎoshang hǎo (早上好)',
          'Xièxiè (谢谢)'
        ],
        correctIndex: 2,
        explanation: '早上好 (Zǎoshang hǎo) digunakan khusus pada pagi hari saat santri memulai aktivitas taklim.'
      },
      {
        id: 'q1-4',
        hanzi: '再见',
        pinyin: 'Zàijiàn',
        question: 'Kata "再见" (Zàijiàn) memiliki padanan arti dalam bahasa Indonesia yaitu:',
        options: [
          'Sampai jumpa kembali / Selamat jalan',
          'Silakan masuk ke asrama',
          'Terima kasih guru',
          'Sama-sama'
        ],
        correctIndex: 0,
        explanation: '再见 (Zàijiàn) secara harfiah berarti bertemu lagi, dipakai saat berpisah atau berpamitan.'
      }
    ]
  },
  {
    id: 'topic-pesantren',
    title: 'Belajar & Kosakata Pesantren',
    chineseTitle: '学习与经书 (Xuéxí)',
    level: 'Tingkat Menengah',
    description: 'Kosakata istilah keislaman, kitab suci, madrasah, dan aktivitas mengaji santri Pondok Pesantren Jauharul Maknuun.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q2-1',
        hanzi: '古兰经',
        pinyin: 'Gǔlánjīng',
        question: 'Karakter "古兰经" (Gǔlánjīng) merujuk pada istilah apa dalam tradisi pesantren?',
        options: [
          'Kitab Suci Al-Qur’anul Karim',
          'Kitab Matan Al-Ajurumiyah',
          'Kamus Bahasa Arab',
          'Kajian Fiqih Fathul Qorib'
        ],
        correctIndex: 0,
        explanation: '古兰经 (Gǔlánjīng) adalah sebutan resmi bahasa Mandarin untuk kitab suci Al-Qur’an.'
      },
      {
        id: 'q2-2',
        hanzi: '学生',
        pinyin: 'Xuéshēng',
        question: 'Kata "学生" (Xuéshēng) dalam konteks pondok bermakna:',
        options: [
          'Pengasuh Pondok',
          'Santri / Murid Pelajar',
          'Buku Tulis Pegon',
          'Ruang Asrama Putra'
        ],
        correctIndex: 1,
        explanation: '学生 (Xuéshēng) bermakna murid, pelajar, atau santri penuntut ilmu.'
      },
      {
        id: 'q2-3',
        hanzi: '伊斯兰寄宿学校',
        pinyin: 'Yīsīlán jìsù xuéxiào',
        question: 'Istilah "伊斯兰寄宿学校" adalah padanan Mandarin untuk:',
        options: [
          'Universitas Negeri',
          'Pondok Pesantren Islam Modern/Salaf',
          'Perpustakaan Umum',
          'Pusat Riset Teknologi'
        ],
        correctIndex: 1,
        explanation: '伊斯兰寄宿学校 (Yīsīlán jìsù xuéxiào) merujuk pada Islamic Boarding School atau Pondok Pesantren.'
      },
      {
        id: 'q2-4',
        hanzi: '老师',
        pinyin: 'Lǎoshī',
        question: 'Panggilan hormat santri untuk guru atau ustadz pengajar dalam bahasa Mandarin adalah:',
        options: [
          'Péngyǒu (朋友)',
          'Tóngxué (同学)',
          'Lǎoshī (老师)',
          'Dìdi (弟弟)'
        ],
        correctIndex: 2,
        explanation: '老师 (Lǎoshī) bermakna Guru, Asatidz, atau Dosen pembina.'
      }
    ]
  },
  {
    id: 'topic-adab',
    title: 'Adab Kesantunan & Syukur',
    chineseTitle: '礼貌与感恩 (Lǐmào)',
    level: 'Praktik Adab Santri',
    description: 'Ungkapan rasa syukur, permohonan maaf, ucapan terima kasih kepada guru dan orang tua dalam akhlaqul karimah.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q3-1',
        hanzi: '谢谢',
        pinyin: 'Xièxiè',
        question: 'Pilihlah pelafalan Pinyin yang tepat untuk ungkapan syukur "谢谢":',
        options: [
          'Zàijiàn (再见)',
          'Duìbuqǐ (对不起)',
          'Xièxiè (谢谢)',
          'Bùkèqì (不客气)'
        ],
        correctIndex: 2,
        explanation: '谢谢 dilafalkan dengan nada ke-4 menurun (Xièxiè) yang bermakna terima kasih.'
      },
      {
        id: 'q3-2',
        hanzi: '不客气',
        pinyin: 'Bù kèqì',
        question: 'Ketika seseorang mengucapkan "Xièxiè", jawaban santun yang tepat adalah:',
        options: [
          'Duìbuqǐ (对不起)',
          'Bù kèqì (不客气)',
          'Méi guānxi (没关系)',
          'Tài hǎo le (太好了)'
        ],
        correctIndex: 1,
        explanation: '不客气 (Bù kèqì) berarti "Sama-sama / Jangan sungkan".'
      },
      {
        id: 'q3-3',
        hanzi: '对不起',
        pinyin: 'Duìbuqǐ',
        question: 'Ungkapan permohonan maaf atas kesalahan atau kekhilafan santri adalah:',
        options: [
          'Duìbuqǐ (对不起)',
          'Xièxiè (谢谢)',
          'Nǐ hǎo (你好)',
          'Qǐngwèn (请问)'
        ],
        correctIndex: 0,
        explanation: '对不起 (Duìbuqǐ) bermakna "Mohon Maaf" atau minta ampunan/maaf.'
      },
      {
        id: 'q3-4',
        hanzi: '请问',
        pinyin: 'Qǐngwèn',
        question: 'Kata "请问" (Qǐngwèn) biasa diucapkan di awal kalimat santri saat:',
        options: [
          'Meminta izin bertanya dengan sopan',
          'Mengakhiri doa bersama',
          'Memanggil teman asrama dari jauh',
          'Membeli kitab di koperasi pondok'
        ],
        correctIndex: 0,
        explanation: '请问 (Qǐngwèn) berarti "Bolehkah saya bertanya / Permisi mau tanya".'
      }
    ]
  }
];

const fetchMandarinQuizzes = async (): Promise<QuizTopic[]> => {
  if (!isSupabaseConfigured()) {
    return QUIZ_TOPICS;
  }
  try {
    const { data, error } = await supabase
      .from('mandarin_quizzes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return QUIZ_TOPICS;
    }

    const topicsMap = new Map<string, QuizTopic>();

    QUIZ_TOPICS.forEach((t) => {
      topicsMap.set(t.title.toLowerCase(), { ...t, questions: [...t.questions] });
    });

    data.forEach((row) => {
      const topicName = row.topic_name || 'Salam & Sapaan Santri';
      const key = topicName.toLowerCase();
      const questionItem: QuizQuestion = {
        id: row.id,
        hanzi: row.hanzi || undefined,
        pinyin: row.pinyin || undefined,
        question: row.question,
        options: Array.isArray(row.options) ? (row.options as unknown as string[]) : [],
        correctIndex: typeof row.correct_index === 'number' ? row.correct_index : 0,
        explanation: row.explanation || ''
      };

      if (topicsMap.has(key)) {
        const topic = topicsMap.get(key)!;
        if (!topic.questions.some((q) => q.id === row.id)) {
          topic.questions.push(questionItem);
        }
      } else {
        topicsMap.set(key, {
          id: `topic-${row.id}`,
          title: topicName,
          chineseTitle: row.hanzi || '测验 (Cèyàn)',
          level: 'Kuis Admin PPJM',
          description: `Kumpulan butir soal kuis untuk topik ${topicName}.`,
          coverImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
          questions: [questionItem]
        });
      }
    });

    return Array.from(topicsMap.values());
  } catch {
    return QUIZ_TOPICS;
  }
};

export const MandarinQuiz: React.FC = () => {
  const { data: topics = QUIZ_TOPICS } = useCachedQuery<QuizTopic[]>(
    'mandarin-quiz-topics',
    fetchMandarinQuizzes
  );

  // Navigation State: null = List of Topics, otherwise = active topic questions
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);

  // Active Quiz Progress State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartTopicQuiz = (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setScore(0);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setScore(0);
  };

  const currentQuestions = selectedTopic?.questions || [];
  const currentQ = currentQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const pointsPerQ = Math.round(100 / currentQuestions.length);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + pointsPerQ);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F5132', '#D4AF37', '#10B981', '#F59E0B']
      });
    }
  };

  const handleRestartCurrentTopic = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setScore(0);
  };

  // 1. TAMPILAN JIKA BELUM MEMILIH TOPIK: LIST QUIZ SESUAI DENGAN TOPIK
  if (!selectedTopic) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-3 sm:p-4 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daftar Topik Quiz Mandarin</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Pilih Topik Ujian & Kuis Interaktif
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Silakan pilih salah satu topik materi di bawah ini untuk memulai lembar soal evaluasi pemahaman bahasa Mandarin santri.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-gold-300 font-bold self-start sm:self-center">
            <GraduationCap className="w-4 h-4 text-gold-400" />
            <span>Tersedia {topics.length} Modul Ujian</span>
          </div>
        </div>

        {/* List of Quiz Topics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => handleStartTopicQuiz(topic)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Topic Image & Badge */}
                <div className="relative h-36 sm:h-40 overflow-hidden bg-slate-100">
                  <img
                    src={topic.coverImage}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-gold-300 text-[10px] font-extrabold border border-gold-400/30 uppercase tracking-wider">
                      {topic.level}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-mono text-sm text-gold-300 font-bold">
                      {topic.chineseTitle}
                    </span>
                    <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                      {topic.questions.length} Soal Test
                    </span>
                  </div>
                </div>

                {/* Topic Title & Description */}
                <div className="p-3.5 space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Topik ke-{index + 1}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-800 group-hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-gold-400" />
                  <span>Mulai Kerjakan Soal Test</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. TAMPILAN JIKA TOPIK SUDAH DIKLIK: SOAL TEST INTERAKTIF TOPIK TERSEBUT
  return (
    <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
      {/* Navigation Header to return back to Topic List */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleBackToTopics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-50 border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Kembali ke Daftar Topik Quiz</span>
        </button>

        <span className="text-xs font-bold text-emerald-800 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          {selectedTopic.title}
        </span>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-2xl p-3 sm:p-4 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Soal Test: {selectedTopic.chineseTitle}</span>
            </div>
            <h3 className="text-base sm:text-xl font-black tracking-tight">
              {selectedTopic.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-emerald-200 uppercase font-bold">Skor Perolehan</div>
              <div className="text-lg sm:text-2xl font-black text-gold-300">{score} Poin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Card */}
      {!quizFinished && currentQ ? (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <span>
              Soal {currentIndex + 1} dari {currentQuestions.length}
            </span>
            <span>Progress: {Math.round(((currentIndex + 1) / currentQuestions.length) * 100)}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center space-y-1.5">
            {currentQ.hanzi && (
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 flex items-center justify-center gap-2">
                <span>{currentQ.hanzi}</span>
                <button
                  type="button"
                  onClick={() => speakText(currentQ.hanzi || '')}
                  className="p-1 rounded-full text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Dengarkan pelafalan Pinyin"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {currentQ.pinyin && (
              <div className="text-xs sm:text-sm font-semibold text-gold-700 font-mono">
                [{currentQ.pinyin}]
              </div>
            )}
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 pt-1">
              {currentQ.question}
            </h4>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 border-slate-200 hover:border-emerald-400 text-slate-800';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {isAnswered && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-0.5">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  Pembahasan Kunci Jawaban:
                </span>
                <p>{currentQ.explanation}</p>
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>{currentIndex + 1 < currentQuestions.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Ujian'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Victory & Result Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              Hasil Ujian Selesai!
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
              Mumtaz! Selamat atas Capaianmu
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Kamu telah menyelesaikan seluruh paket soal test untuk topik <strong>{selectedTopic.title}</strong>.
            </p>
          </div>

          <div className="inline-block p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-xs font-bold text-emerald-800 uppercase">Total Skor Akhir</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1">{score} / 100</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleRestartCurrentTopic}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Topik Ini</span>
            </button>

            <button
              type="button"
              onClick={handleBackToTopics}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-emerald-950 font-extrabold text-xs shadow-md transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Pilih Topik Quiz Lainnya</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
