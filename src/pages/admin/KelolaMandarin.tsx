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
  Play,
  Pause,
  Clock,
  Award,
  Upload,
  Check,
  Zap,
  HelpCircle,
  Save
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

interface MandarinVocabItem {
  id: string;
  topic: string;
  level: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  narrative: string;
  audioUrl?: string;
}

interface QuizBuilderItem {
  id: string;
  topicName: string;
  hanzi?: string;
  pinyin?: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  points: number;
  timeLimitSec: number;
  explanation: string;
}

const INITIAL_VOCAB: MandarinVocabItem[] = [
  {
    id: 'mv-1',
    topic: 'Salam & Sapaan Santri (问候 - Wènhòu)',
    level: 'HSK 1 Dasar',
    hanzi: '你好！很高兴认识你。',
    pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ.',
    meaning: 'Halo! Sangat senang bisa mengenalmu.',
    narrative: 'Modul percakapan adab santri dalam menyambut tamu muhibbah internasional dan asatidz.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'mv-2',
    topic: 'Kehidupan Pesantren (学习 - Xuéxí)',
    level: 'HSK 2 Menengah',
    hanzi: '我们在伊斯兰寄宿学校读古兰经',
    pinyin: 'Wǒmen zài yīsīlán jìsù xuéxiào dú gǔlánjīng',
    meaning: 'Kami membaca Al-Qur’an di pondok pesantren',
    narrative: 'Kosakata seputar mengaji Al-Qur’an dan kajian kitab turats dalam bahasa Putonghua.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  },
  {
    id: 'mv-3',
    topic: 'Doa Makan & Bersyukur (感恩 - Gǎn\'ēn)',
    level: 'HSK 1 Dasar',
    hanzi: '真主保佑我们，给我们食物',
    pinyin: 'Zhēnzhǔ bǎoyòu wǒmen, gěi wǒmen shíwù',
    meaning: 'Allah memberkahi kita dan memberi kita rezeki makanan',
    narrative: 'Diplomasi dakwah Islamiyah dalam bahasa Mandarin santri.',
    audioUrl: 'https://actions.google.com/sounds/v1/speech/hello.ogg'
  }
];

const INITIAL_QUIZZES: QuizBuilderItem[] = [
  {
    id: 'mq-1',
    topicName: 'Salam & Sapaan Dasar',
    hanzi: '你好',
    pinyin: 'Nǐ hǎo',
    question: 'Apa arti dan adab dari ungkapan "你好" (Nǐ hǎo)?',
    options: ['Selamat tinggal', 'Halo / Semoga Sejahtera', 'Terima kasih banyak', 'Selamat makan'],
    correctIndex: 1,
    points: 20,
    timeLimitSec: 30,
    explanation: '你好 (Nǐ hǎo) adalah sapaan santun dan ramah yang paling mendasar dalam bahasa Mandarin.'
  },
  {
    id: 'mq-2',
    topicName: 'Kosakata Keislaman',
    hanzi: '古兰经',
    pinyin: 'Gǔlánjīng',
    question: 'Karakter "古兰经" (Gǔlánjīng) merujuk pada istilah apa dalam tradisi santri?',
    options: ['Kitab Suci Al-Qur’anul Karim', 'Kitab Matan Al-Ajurumiyah', 'Kamus Arab-Mandarin', 'Buku Percakapan Harian'],
    correctIndex: 0,
    points: 25,
    timeLimitSec: 45,
    explanation: '古兰经 (Gǔlánjīng) adalah sebutan resmi bahasa Putonghua untuk Kitab Suci Al-Qur\'an.'
  },
  {
    id: 'mq-3',
    topicName: 'Doa & Ketauhidan',
    hanzi: '真主',
    pinyin: 'Zhēnzhǔ',
    question: 'Istilah "真主" (Zhēnzhǔ) dalam bahasa Mandarin merujuk pada:',
    options: ['Nabi Muhammad SAW', 'Allah SWT (Tuhan Yang Maha Esa)', 'Malaikat Jibril AS', 'Para Masyaikh'],
    correctIndex: 1,
    points: 30,
    timeLimitSec: 30,
    explanation: '真主 (Zhēnzhǔ) berarti "Penguasa yang Sejati", istilah standar Muslim Tiongkok untuk Allah SWT.'
  }
];

export const KelolaMandarin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kosakata' | 'kuis-builder' | 'simulator'>('kosakata');
  const [vocabs, setVocabs] = useState<MandarinVocabItem[]>(INITIAL_VOCAB);
  const [quizzes, setQuizzes] = useState<QuizBuilderItem[]>(INITIAL_QUIZZES);
  const [savedAlert, setSavedAlert] = useState(false);

  // Audio preview state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Quiz Builder Form State
  const [qTopic, setQTopic] = useState('Salam & Sapaan Dasar');
  const [qHanzi, setQHanzi] = useState('');
  const [qPinyin, setQPinyin] = useState('');
  const [qQuestion, setQQuestion] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [qCorrect, setQCorrect] = useState<number>(0);
  const [qPoints, setQPoints] = useState<number>(20);
  const [qTimer, setQTimer] = useState<number>(30);
  const [qExplanation, setQExplanation] = useState('');

  // Simulator Game State with Confetti trigger
  const [simIndex, setSimIndex] = useState(0);
  const [simSelectedOption, setSimSelectedOption] = useState<number | null>(null);
  const [simIsCorrect, setSimIsCorrect] = useState<boolean | null>(null);
  const [simScore, setSimScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePlayAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qQuestion || !opt0 || !opt1) return;

    const newQuiz: QuizBuilderItem = {
      id: `mq-${Date.now()}`,
      topicName: qTopic,
      hanzi: qHanzi,
      pinyin: qPinyin,
      question: qQuestion,
      options: [opt0, opt1, opt2 || 'Pilihan C', opt3 || 'Pilihan D'],
      correctIndex: qCorrect,
      points: qPoints,
      timeLimitSec: qTimer,
      explanation: qExplanation || 'Jawaban telah diverifikasi oleh tim kurikulum Mandarin.',
    };

    setQuizzes([...quizzes, newQuiz]);
    setQQuestion('');
    setQHanzi('');
    setQPinyin('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setQExplanation('');

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  // Simulator logic with Confetti
  const handleAnswerSimulator = (optionIndex: number) => {
    const curQ = quizzes[simIndex];
    if (!curQ) return;

    setSimSelectedOption(optionIndex);
    const correct = optionIndex === curQ.correctIndex;
    setSimIsCorrect(correct);

    if (correct) {
      setSimScore((s) => s + curQ.points);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const nextSimulatorQuestion = () => {
    if (simIndex < quizzes.length - 1) {
      setSimIndex((i) => i + 1);
      setSimSelectedOption(null);
      setSimIsCorrect(null);
    } else {
      alert(`Kuis Selesai! Skor Akhir Anda: ${simScore} Poin!`);
      setSimIndex(0);
      setSimSelectedOption(null);
      setSimIsCorrect(null);
      setSimScore(0);
    }
  };

  const currentSimQuiz = quizzes[simIndex] || quizzes[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 relative">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-amber-950 to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40">
            <Globe className="w-3.5 h-3.5" />
            <span>Pusat Pembelajaran Bahasa Mandarin Putonghua &amp; HSK</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Kelola Bank Soal, Audio Pinyin &amp; Quiz Builder Gamifikasi
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-3xl leading-relaxed">
            Kelola materi kosakata Hanzi &amp; Pinyin, rekam audio pelafalan Putonghua, susun butir kuis dengan timer durasi, poin, dan simulator selebrasi confetti kemenangan santri.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span>Alhamdulillah, butir kuis baru berhasil ditambahkan ke bank soal santri!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('kosakata')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'kosakata'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Bank Kosakata &amp; Audio Pinyin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kuis-builder')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'kuis-builder'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. Quiz Builder (Soal, Poin &amp; Timer)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Uji Kuis &amp; Confetti Simulator</span>
        </button>
      </div>

      {/* TAB 1: KOSAKATA & AUDIO */}
      {activeTab === 'kosakata' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                Daftar Kosakata Hanzi, Pinyin &amp; Audio Putonghua
              </h3>
              <p className="text-xs text-zinc-400">
                Materi kosakata standar HSK 1 - 3 terintegrasi adab pergaulan dan syiar dakwah pesantren
              </p>
            </div>
            <span className="text-xs font-bold text-[#C8A951] bg-[#0A2116] px-3 py-1 rounded-lg border border-[#C8A951]/40">
              {vocabs.length} Kosakata Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vocabs.map((vocab) => (
              <div
                key={vocab.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {vocab.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(vocab.id)}
                      className="p-1.5 rounded-full bg-[#0E7A4C]/15 text-[#0E7A4C] dark:text-emerald-400 hover:bg-[#0E7A4C] hover:text-white transition cursor-pointer"
                      title="Dengarkan Pelafalan Putonghua"
                    >
                      {playingId === vocab.id ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-center space-y-1">
                    <h4 className="font-black text-xl text-zinc-900 dark:text-white tracking-wide">
                      {vocab.hanzi}
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#C8A951]">
                      {vocab.pinyin}
                    </p>
                  </div>

                  <p className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
                    Artinya: "{vocab.meaning}"
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {vocab.narrative}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold">Audio Native Putonghua</span>
                  <button
                    type="button"
                    onClick={() => alert(`Upload audio rekaman baru untuk ${vocab.hanzi}`)}
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Ganti Audio</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QUIZ BUILDER */}
      {activeTab === 'kuis-builder' && (
        <div className="space-y-6">
          <form onSubmit={handleAddQuiz} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-black text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C8A951]" />
                <span>Quiz Builder: Tambah Butir Soal Gamifikasi</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Rancang pertanyaan, 4 pilihan ganda, kunci jawaban, skor poin dan durasi timer per soal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Topik Materi:</label>
                <input
                  type="text"
                  required
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Poin Soal:</label>
                <select
                  value={qPoints}
                  onChange={(e) => setQPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
                >
                  <option value={10}>10 Poin</option>
                  <option value={20}>20 Poin</option>
                  <option value={25}>25 Poin</option>
                  <option value={50}>50 Poin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Timer Waktu Menjawab:</label>
                <select
                  value={qTimer}
                  onChange={(e) => setQTimer(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
                >
                  <option value={15}>15 Detik (Cepat)</option>
                  <option value={30}>30 Detik (Standar)</option>
                  <option value={45}>45 Detik</option>
                  <option value={60}>60 Detik (Panjang)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Karakter Hanzi (Opsional):</label>
                <input
                  type="text"
                  placeholder="Contoh: 你好"
                  value={qHanzi}
                  onChange={(e) => setQHanzi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Transkripsi Pinyin (Opsional):</label>
                <input
                  type="text"
                  placeholder="Contoh: Nǐ hǎo"
                  value={qPinyin}
                  onChange={(e) => setQPinyin(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Pertanyaan Soal: *</label>
              <textarea
                rows={2}
                required
                placeholder="Tuliskan pertanyaan kuis..."
                value={qQuestion}
                onChange={(e) => setQQuestion(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">4 Opsi Pilihan Jawaban (Pilih radio untuk Kunci Jawaban Benar):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <input
                    type="radio"
                    name="correct"
                    checked={qCorrect === 0}
                    onChange={() => setQCorrect(0)}
                    className="accent-[#0E7A4C]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pilihan A (Kunci/Distraktor)"
                    value={opt0}
                    onChange={(e) => setOpt0(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <input
                    type="radio"
                    name="correct"
                    checked={qCorrect === 1}
                    onChange={() => setQCorrect(1)}
                    className="accent-[#0E7A4C]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pilihan B"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <input
                    type="radio"
                    name="correct"
                    checked={qCorrect === 2}
                    onChange={() => setQCorrect(2)}
                    className="accent-[#0E7A4C]"
                  />
                  <input
                    type="text"
                    placeholder="Pilihan C"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <input
                    type="radio"
                    name="correct"
                    checked={qCorrect === 3}
                    onChange={() => setQCorrect(3)}
                    className="accent-[#0E7A4C]"
                  />
                  <input
                    type="text"
                    placeholder="Pilihan D"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Penjelasan Pembahasan Jawaban Benar:</label>
              <input
                type="text"
                placeholder="Penjelasan ringkas yang muncul saat santri selesai menjawab..."
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simpan Butir Kuis Baru</span>
              </button>
            </div>
          </form>

          {/* List of Existing Quizzes */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
              Daftar Soal Tersedia di Bank Soal ({quizzes.length} Soal)
            </h4>
            <div className="space-y-2.5">
              {quizzes.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[#C8A951] bg-[#0A2116] px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {q.topicName}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ⭐ {q.points} Poin
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        ⏱️ {q.timeLimitSec}s
                      </span>
                    </div>
                    <p className="font-extrabold text-zinc-900 dark:text-white">
                      {q.question} {q.hanzi && <span className="text-[#C8A951]">({q.hanzi})</span>}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Kunci: <span className="font-semibold text-emerald-600">{q.options[q.correctIndex]}</span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteQuiz(q.id)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 cursor-pointer"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UJI KUIS & CONFETTI SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#C8A951]/40 shadow-xl space-y-5 relative overflow-hidden">
          
          {/* Confetti Animation Effect Overlay */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center animate-fade-in bg-emerald-500/10">
              <div className="text-center space-y-2 p-6 rounded-3xl bg-[#0A2116]/95 border-2 border-[#C8A951] text-white shadow-2xl animate-bounce">
                <Sparkles className="w-12 h-12 text-[#C8A951] mx-auto animate-spin" />
                <h3 className="text-xl font-black text-[#C8A951]">🎉 MUMTAZ! JAWABAN TEPAT!</h3>
                <p className="text-xs text-emerald-200">Selamat, Anda mendapatkan +{currentSimQuiz.points} Poin!</p>
              </div>
            </div>
          )}

          {/* Simulator Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-[#C8A951] tracking-wider">
                Simulasi Kuis Santri
              </span>
              <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-white">
                Soal {simIndex + 1} dari {quizzes.length}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
                Skor: {simScore} Poin
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentSimQuiz.timeLimitSec}s</span>
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-center space-y-2">
            {currentSimQuiz.hanzi && (
              <div className="text-3xl font-black text-zinc-900 dark:text-white">
                {currentSimQuiz.hanzi}
              </div>
            )}
            {currentSimQuiz.pinyin && (
              <div className="text-xs font-mono font-bold text-[#C8A951]">
                {currentSimQuiz.pinyin}
              </div>
            )}
            <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white pt-1">
              {currentSimQuiz.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentSimQuiz.options.map((option, idx) => {
              const isSelected = simSelectedOption === idx;
              const isCorrectAnswer = idx === currentSimQuiz.correctIndex;
              let btnStyle = 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700';

              if (simSelectedOption !== null) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-500 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={simSelectedOption !== null}
                  onClick={() => handleAnswerSimulator(idx)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {simSelectedOption !== null && isCorrectAnswer && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {simSelectedOption !== null && (
            <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1 text-xs">
              <span className="font-bold text-[#C8A951]">💡 Pembahasan Jawaban:</span>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {currentSimQuiz.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {simSelectedOption !== null && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={nextSimulatorQuestion}
                className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-extrabold text-xs shadow-md border border-[#C8A951]/40 cursor-pointer"
              >
                {simIndex < quizzes.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil Akhir'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
export default KelolaMandarin;
