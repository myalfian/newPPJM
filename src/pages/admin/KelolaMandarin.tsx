import React, { useState } from 'react';
import {
  Globe,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  Volume2,
  BookOpen,
  HelpCircle,
  X
} from 'lucide-react';

interface MandarinLessonItem {
  id: string;
  topic: string;
  level: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  narrative: string;
  coverImage: string;
}

interface QuizItem {
  id: string;
  topicName: string;
  hanzi?: string;
  pinyin?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const INITIAL_LESSONS: MandarinLessonItem[] = [
  {
    id: 'ml-1',
    topic: 'Salam & Sapaan Santri (问候 - Wènhòu)',
    level: 'Dasar 1',
    hanzi: '你好！很高兴认识你。',
    pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ.',
    meaning: 'Halo! Sangat senang bisa mengenalmu.',
    narrative: 'Modul pengantar diplomasi santri untuk menyapa tamu kehormatan dan asatidz dengan adab luhur.',
    coverImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ml-2',
    topic: 'Belajar & Mengaji di Pondok (学习 - Xuéxí)',
    level: 'Kosakata Harian',
    hanzi: '我们在伊斯兰寄宿学校读古兰经',
    pinyin: 'Wǒmen zài yīsīlán jìsù xuéxiào dú gǔlánjīng',
    meaning: 'Kami membaca Al-Qur’an di pondok pesantren',
    narrative: 'Kosakata seputar mengaji Al-Qur’an dan kajian kitab kuning turats dalam bahasa Mandarin.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  }
];

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'mq-1',
    topicName: 'Salam & Sapaan Santri',
    hanzi: '你好',
    pinyin: 'Nǐ hǎo',
    question: 'Apa arti dari sapaan dasar "你好" (Nǐ hǎo)?',
    options: ['Selamat tinggal', 'Halo / Semoga Sejahtera', 'Terima kasih', 'Selamat pagi'],
    correctIndex: 1,
    explanation: '你好 (Nǐ hǎo) adalah sapaan ramah dalam bahasa Mandarin yang berarti Halo.',
  },
  {
    id: 'mq-2',
    topicName: 'Kosakata Pesantren',
    hanzi: '古兰经',
    pinyin: 'Gǔlánjīng',
    question: 'Karakter "古兰经" (Gǔlánjīng) merujuk pada istilah apa dalam tradisi pesantren?',
    options: ['Kitab Suci Al-Qur’anul Karim', 'Kitab Matan Ajurumiyah', 'Kamus Arab', 'Kajian Fiqih'],
    correctIndex: 0,
    explanation: '古兰经 (Gǔlánjīng) adalah sebutan resmi bahasa Mandarin untuk kitab suci Al-Qur’an.',
  }
];

export const KelolaMandarin: React.FC = () => {
  const [tab, setTab] = useState<'materi' | 'kuis'>('materi');
  const [lessons, setLessons] = useState<MandarinLessonItem[]>(INITIAL_LESSONS);
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedAlert, setSavedAlert] = useState(false);

  // Form Materi State
  const [topik, setTopik] = useState('');
  const [level, setLevel] = useState('Dasar 1');
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [arti, setArti] = useState('');
  const [narasi, setNarasi] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Form Kuis State
  const [topikKuis, setTopikKuis] = useState('Salam & Sapaan Santri');
  const [hanziKuis, setHanziKuis] = useState('');
  const [pinyinKuis, setPinyinKuis] = useState('');
  const [soal, setSoal] = useState('');
  const [opsiA, setOpsiA] = useState('');
  const [opsiB, setOpsiB] = useState('');
  const [opsiC, setOpsiC] = useState('');
  const [opsiD, setOpsiD] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState(0);
  const [pembahasan, setPembahasan] = useState('');

  const resetForm = () => {
    setTopik('');
    setLevel('Dasar 1');
    setHanzi('');
    setPinyin('');
    setArti('');
    setNarasi('');
    setCoverImage('');
    setHanziKuis('');
    setPinyinKuis('');
    setSoal('');
    setOpsiA('');
    setOpsiB('');
    setOpsiC('');
    setOpsiD('');
    setJawabanBenar(0);
    setPembahasan('');
    setEditingId(null);
  };

  const handleEditLesson = (les: MandarinLessonItem) => {
    setEditingId(les.id);
    setTopik(les.topic);
    setLevel(les.level);
    setHanzi(les.hanzi);
    setPinyin(les.pinyin);
    setArti(les.meaning);
    setNarasi(les.narrative);
    setCoverImage(les.coverImage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('Hapus materi pelajaran Mandarin ini?')) {
      setLessons(lessons.filter((l) => l.id !== id));
    }
  };

  const handleEditQuiz = (q: QuizItem) => {
    setEditingId(q.id);
    setTopikKuis(q.topicName);
    setHanziKuis(q.hanzi || '');
    setPinyinKuis(q.pinyin || '');
    setSoal(q.question);
    setOpsiA(q.options[0] || '');
    setOpsiB(q.options[1] || '');
    setOpsiC(q.options[2] || '');
    setOpsiD(q.options[3] || '');
    setJawabanBenar(q.correctIndex);
    setPembahasan(q.explanation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Hapus butir soal kuis Mandarin ini?')) {
      setQuizzes(quizzes.filter((q) => q.id !== id));
    }
  };

  const handleSubmitLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topik || !hanzi) return;

    if (editingId) {
      setLessons(
        lessons.map((l) =>
          l.id === editingId
            ? {
                ...l,
                topic: topik,
                level,
                hanzi,
                pinyin,
                meaning: arti,
                narrative: narasi,
                coverImage: coverImage || l.coverImage,
              }
            : l
        )
      );
    } else {
      const newLes: MandarinLessonItem = {
        id: `ml-${Date.now()}`,
        topic: topik,
        level,
        hanzi,
        pinyin,
        meaning: arti,
        narrative: narasi,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
      };
      setLessons([newLes, ...lessons]);
    }

    setSavedAlert(true);
    resetForm();
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soal || !opsiA || !opsiB) return;

    if (editingId) {
      setQuizzes(
        quizzes.map((q) =>
          q.id === editingId
            ? {
                ...q,
                topicName: topikKuis,
                hanzi: hanziKuis,
                pinyin: pinyinKuis,
                question: soal,
                options: [opsiA, opsiB, opsiC, opsiD],
                correctIndex: jawabanBenar,
                explanation: pembahasan,
              }
            : q
        )
      );
    } else {
      const newQ: QuizItem = {
        id: `mq-${Date.now()}`,
        topicName: topikKuis,
        hanzi: hanziKuis,
        pinyin: pinyinKuis,
        question: soal,
        options: [opsiA, opsiB, opsiC, opsiD],
        correctIndex: jawabanBenar,
        explanation: pembahasan,
      };
      setQuizzes([newQ, ...quizzes]);
    }

    setSavedAlert(true);
    resetForm();
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-gold-800" />
          <span>Editor & Publish Bahasa Mandarin</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Modul Materi & Bank Soal Kuis Mandarin
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kelola topik materi dengan narasi berfoto, pelafalan Pinyin, serta bank butir soal test interaktif untuk santri di halaman publik <code>/smart-jm/mandarin/*</code>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, data bahasa Mandarin berhasil disimpan dan disinkronkan ke website publik!</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setTab('materi'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            tab === 'materi'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Section: Materi Pembelajaran</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab('kuis'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            tab === 'kuis'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Section: Bank Soal Kuis</span>
        </button>
      </div>

      {/* Form Tab 1: Materi */}
      {tab === 'materi' && (
        <form onSubmit={handleSubmitLesson} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>{editingId ? 'Edit Modul Materi' : 'Tambah Modul Materi Baru'}</span>
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Topik Pelajaran: *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Salam & Sapaan Santri (问候)"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tingkat / Level:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
              >
                <option value="Dasar 1">Dasar 1</option>
                <option value="Kosakata Harian">Kosakata Harian</option>
                <option value="Percakapan Santri">Percakapan Santri</option>
                <option value="Tingkat Lanjutan">Tingkat Lanjutan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Karakter Hanzi: *</label>
              <input
                type="text"
                required
                placeholder="你好！很高兴认识你。"
                value={hanzi}
                onChange={(e) => setHanzi(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nada Pinyin: *</label>
              <input
                type="text"
                required
                placeholder="Nǐ hǎo! Hěn gāoxìng rènshí nǐ."
                value={pinyin}
                onChange={(e) => setPinyin(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Arti Bahasa Indonesia: *</label>
              <input
                type="text"
                required
                placeholder="Halo! Sangat senang bisa mengenalmu."
                value={arti}
                onChange={(e) => setArti(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">URL Foto Cover Dokumentasi Kelas:</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... (atau upload foto)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Narasi Konteks Budaya & Adab Santri: *</label>
            <textarea
              rows={4}
              required
              placeholder="Ceritakan latar belakang, adab penerapan sapaan ini di pesantren, dan hikmah pembelajarannya..."
              value={narasi}
              onChange={(e) => setNarasi(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{editingId ? 'Simpan Modul Materi' : 'Terbitkan Materi ke Web'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Form Tab 2: Kuis */}
      {tab === 'kuis' && (
        <form onSubmit={handleSubmitQuiz} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>{editingId ? 'Edit Soal Kuis' : 'Tambah Butir Soal Kuis Baru'}</span>
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Topik Kuis:</label>
              <select
                value={topikKuis}
                onChange={(e) => setTopikKuis(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
              >
                <option value="Salam & Sapaan Santri">Salam & Sapaan Santri</option>
                <option value="Belajar & Kosakata Pesantren">Belajar & Kosakata Pesantren</option>
                <option value="Adab Kesantunan & Syukur">Adab Kesantunan & Syukur</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Karakter Hanzi (Opsional):</label>
              <input
                type="text"
                placeholder="Contoh: 你好"
                value={hanziKuis}
                onChange={(e) => setHanziKuis(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pinyin (Opsional):</label>
              <input
                type="text"
                placeholder="Contoh: Nǐ hǎo"
                value={pinyinKuis}
                onChange={(e) => setPinyinKuis(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Pertanyaan Soal: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Apa arti dari sapaan dasar 'Nǐ hǎo'?"
              value={soal}
              onChange={(e) => setSoal(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan A: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan jawaban A"
                value={opsiA}
                onChange={(e) => setOpsiA(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan B: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan jawaban B"
                value={opsiB}
                onChange={(e) => setOpsiB(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan C: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan jawaban C"
                value={opsiC}
                onChange={(e) => setOpsiC(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan D: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan jawaban D"
                value={opsiD}
                onChange={(e) => setOpsiD(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kunci Jawaban Benar:</label>
              <select
                value={jawabanBenar}
                onChange={(e) => setJawabanBenar(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              >
                <option value={0}>Pilihan A</option>
                <option value={1}>Pilihan B</option>
                <option value={2}>Pilihan C</option>
                <option value={3}>Pilihan D</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Ulasan / Pembahasan Kunci:</label>
              <input
                type="text"
                placeholder="Penjelasan ringkas agar santri paham..."
                value={pembahasan}
                onChange={(e) => setPembahasan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{editingId ? 'Simpan Soal Kuis' : 'Terbitkan Soal ke Bank Kuis'}</span>
            </button>
          </div>
        </form>
      )}

      {/* List Preview Item yang Terbit */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Daftar {tab === 'materi' ? 'Modul Materi' : 'Soal Kuis'} Aktif ({tab === 'materi' ? lessons.length : quizzes.length})
        </h3>

        {tab === 'materi' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((les) => (
              <div key={les.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex gap-3 justify-between">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 uppercase">
                    {les.level}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{les.topic}</h4>
                  <p className="text-xs font-bold text-emerald-800">{les.hanzi} ({les.pinyin})</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{les.narrative}</p>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditLesson(les)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                      title="Edit Materi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(les.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Hapus Materi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {les.id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((q, idx) => (
              <div key={q.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      Soal #{idx + 1} • {q.topicName}
                    </span>
                    {q.hanzi && <span className="font-bold text-xs text-emerald-800">{q.hanzi}</span>}
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">{q.question}</h4>
                  <p className="text-[11px] text-slate-500">
                    Kunci: Opsi {String.fromCharCode(65 + q.correctIndex)} ({q.options[q.correctIndex]})
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditQuiz(q)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                    title="Edit Soal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuiz(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
