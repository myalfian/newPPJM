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
  Volume2
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  topic: string;
  hanzi?: string;
  pinyin?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Salam & Sapaan',
    hanzi: '你好',
    pinyin: 'Nǐ hǎo',
    question: 'Apa arti dari sapaan dasar "你好" (Nǐ hǎo)?',
    options: [
      'Selamat tinggal',
      'Halo / Selamat Sejahtera',
      'Terima kasih banyak',
      'Selamat pagi ustadz'
    ],
    correctIndex: 1,
    explanation: '你好 (Nǐ hǎo) adalah sapaan paling mendasar dan ramah dalam bahasa Mandarin yang berarti Halo.'
  },
  {
    id: 'q2',
    topic: 'Kosakata Harian',
    hanzi: '古兰经',
    pinyin: 'Gǔlánjīng',
    question: 'Karakter "古兰经" (Gǔlánjīng) merujuk pada istilah apa dalam tradisi pesantren?',
    options: [
      'Kitab Al-Qur’anul Karim',
      'Kitab Matan Al-Ajurumiyah',
      'Kamus Bahasa Arab',
      'Kajian Fiqih Fathul Qorib'
    ],
    correctIndex: 0,
    explanation: '古兰经 (Gǔlánjīng) adalah sebutan resmi bahasa Mandarin untuk kitab suci Al-Qur’an.'
  },
  {
    id: 'q3',
    topic: 'Ungkapan Adab',
    hanzi: '谢谢',
    pinyin: 'Xièxiè',
    question: 'Pilihlah pelafalan Pinyin yang tepat untuk ungkapan rasa syukur "谢谢":',
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
    id: 'q4',
    topic: 'Identitas Santri',
    hanzi: '学生',
    pinyin: 'Xuéshēng',
    question: 'Kata "学生" (Xuéshēng) memiliki persamaan makna dengan:',
    options: [
      'Guru / Ustadz',
      'Murid / Santri Pelajar',
      'Buku Pelajaran',
      'Ruang Asrama Pondok'
    ],
    correctIndex: 1,
    explanation: '学生 (Xuéshēng) berarti murid atau santri yang menuntut ilmu.'
  }
];

export const MandarinQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = SAMPLE_QUIZZES[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 25);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < SAMPLE_QUIZZES.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      // Trigger victory fanfare confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F5132', '#D4AF37', '#10B981', '#F59E0B']
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-2xl p-4 sm:p-6 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mandarin Santri Quiz</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Kuis Interaktif Bahasa Mandarin
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Uji pemahaman Pinyin, Hanzi, dan kosakata harian santri dengan sistem skor instan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/20 text-center min-w-[110px]">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Skor Sementara</div>
            <div className="text-xl sm:text-2xl font-extrabold text-gold-400">{score}</div>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-m3-1 border border-slate-200 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Soal {currentIndex + 1} dari {SAMPLE_QUIZZES.length}</span>
              <span>Topik: {currentQ.topic}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-gold-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / SAMPLE_QUIZZES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="text-center py-4 px-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            {currentQ.hanzi && (
              <div className="text-4xl sm:text-5xl font-bold text-emerald-950 tracking-wider">
                {currentQ.hanzi}
              </div>
            )}
            {currentQ.pinyin && (
              <div className="text-base font-semibold text-gold-700 tracking-wide">
                [{currentQ.pinyin}]
              </div>
            )}
            <h3 className="text-base sm:text-lg font-bold text-slate-800 pt-1">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between min-h-[48px] ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-sm space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Pembahasan:</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <span>{currentIndex + 1 === SAMPLE_QUIZZES.length ? 'Lihat Hasil Akhir' : 'Soal Selanjutnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Card */
        <div className="bg-white rounded-3xl p-8 shadow-m3-2 border border-slate-200 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              Kuis Selesai!
            </h3>
            <p className="text-sm text-slate-600">
              Selamat atas ikhtiar belajar bahasa Mandarin santri PP Jauharul Maknuun!
            </p>
          </div>

          <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-2xl p-6 min-w-[200px]">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Skor Anda</div>
            <div className="text-5xl font-black text-emerald-900 mt-2">{score} / 100</div>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis Mandarin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
