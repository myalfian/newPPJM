import React, { useState, useRef } from 'react';
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
  CheckCheck
} from 'lucide-react';

interface SetoranRecord {
  id: string;
  santriName: string;
  surah: string;
  ayahRange: string;
  date: string;
  audioUrl: string;
  status: 'pending' | 'mumtaz' | 'jayyid' | 'remidi';
  tajwidScore: number | null;
  teacherNote: string;
}

interface SurahItem {
  number: number;
  name: string;
  arabic: string;
  ayahCount: number;
  juz: number;
  audioUrl: string;
}

const SURAH_LIST: SurahItem[] = [
  { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', ayahCount: 7, juz: 1, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3' },
  { number: 2, name: 'Al-Baqarah', arabic: 'البقرة', ayahCount: 286, juz: 1, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3' },
  { number: 3, name: 'Ali \'Imran', arabic: 'آل عمران', ayahCount: 200, juz: 3, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/003001.mp3' },
  { number: 4, name: 'An-Nisa\'', arabic: 'النساء', ayahCount: 176, juz: 4, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/004001.mp3' },
  { number: 18, name: 'Al-Kahf', arabic: 'الكهف', ayahCount: 110, juz: 15, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/018001.mp3' },
  { number: 36, name: 'Yasin', arabic: 'يس', ayahCount: 83, juz: 22, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/036001.mp3' },
  { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', ayahCount: 78, juz: 27, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/055001.mp3' },
  { number: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', ayahCount: 96, juz: 27, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/056001.mp3' },
  { number: 67, name: 'Al-Mulk', arabic: 'الملك', ayahCount: 30, juz: 29, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/067001.mp3' },
  { number: 78, name: 'An-Naba\'', arabic: 'النبأ', ayahCount: 40, juz: 30, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/078001.mp3' },
  { number: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', ayahCount: 4, juz: 30, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3' },
  { number: 113, name: 'Al-Falaq', arabic: 'الفلق', ayahCount: 5, juz: 30, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3' },
  { number: 114, name: 'An-Nas', arabic: 'الناس', ayahCount: 6, juz: 30, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114001.mp3' },
];

const INITIAL_SETORAN: SetoranRecord[] = [
  {
    id: 'st-1',
    santriName: 'Ahmad Zaki Al-Faruq (Kelas IX-A)',
    surah: 'Al-Baqarah',
    ayahRange: 'Ayat 255 - 257 (Ayat Kursi)',
    date: 'Hari ini, 10:15 WIB',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
    status: 'pending',
    tajwidScore: null,
    teacherNote: '',
  },
  {
    id: 'st-2',
    santriName: 'Muhammad Farhan Maulana (Kelas VIII-B)',
    surah: 'Yasin',
    ayahRange: 'Ayat 1 - 20',
    date: 'Hari ini, 08:30 WIB',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/036001.mp3',
    status: 'mumtaz',
    tajwidScore: 95,
    teacherNote: 'Makharijul huruf fasih, dengung ikhfa dan ghunnah sudah sangat tepat.',
  },
  {
    id: 'st-3',
    santriName: 'Hilmi Abdullah (Kelas VII-C)',
    surah: 'An-Naba',
    ayahRange: 'Ayat 1 - 40 (Juz 30 Penuh)',
    date: 'Kemarin, 19:45 WIB',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/078001.mp3',
    status: 'jayyid',
    tajwidScore: 88,
    teacherNote: 'Bagus, perhatikan panjang mad wajib muttashil 4-5 harakat pada ayat 14.',
  }
];

export const KelolaHafidz: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setoran' | 'monitoring' | 'cloze'>('setoran');
  const [records, setRecords] = useState<SetoranRecord[]>(INITIAL_SETORAN);
  const [selectedRecord, setSelectedRecord] = useState<SetoranRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Audio Playback
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form Evaluasi Setoran
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [statusInput, setStatusInput] = useState<'mumtaz' | 'jayyid' | 'remidi'>('mumtaz');
  const [noteInput, setNoteInput] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  // Cloze Test Murojaah AI State
  const [clozeAnswer, setClozeAnswer] = useState('');
  const [clozeResult, setClozeResult] = useState<boolean | null>(null);

  const handlePlayAudio = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    } else {
      audioRef.current.src = url;
    }

    audioRef.current.onended = () => {
      setPlayingUrl(null);
    };

    audioRef.current.play().then(() => {
      setPlayingUrl(url);
    }).catch((e) => console.warn(e));
  };

  const handleSelectRecord = (record: SetoranRecord) => {
    setSelectedRecord(record);
    setScoreInput(record.tajwidScore || 90);
    setStatusInput(record.status === 'pending' ? 'mumtaz' : record.status);
    setNoteInput(record.teacherNote || '');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setRecords(
      records.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              status: statusInput,
              tajwidScore: scoreInput,
              teacherNote: noteInput,
            }
          : r
      )
    );

    setSelectedRecord(null);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleCheckCloze = (e: React.FormEvent) => {
    e.preventDefault();
    // Cloze answer target: "الْعَالَمِينَ"
    const cleaned = clozeAnswer.trim().toLowerCase();
    const isCorrect = cleaned.includes('العالمين') || cleaned.includes('al-alamin') || cleaned.includes('alamin');
    setClozeResult(isCorrect);
  };

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.santriName.toLowerCase().includes(search.toLowerCase()) ||
      r.surah.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Markaz Tahfidzul Qur'an &amp; Murojaah Bersanad</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Monitoring 114 Surat, Audio Murottal &amp; Murojaah AI
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Pusat evaluasi setoran rekaman audio santri, pemantauan kelulusan 114 surat 30 Juz, pemutar murottal audio syaikh muqri\', serta pengujian sambung ayat otomatis Cloze Test Murojaah AI.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-[#0E7A4C]/15 border border-[#0E7A4C] text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#0E7A4C] dark:text-emerald-400" />
          <span>Alhamdulillah, penilaian tajwid dan catatan evaluasi setoran santri berhasil disimpan!</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('setoran')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'setoran'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>1. Evaluasi Setoran Audio Santri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'monitoring'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Monitoring 114 Surat &amp; Murottal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cloze')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'cloze'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Cloze Test Murojaah AI</span>
        </button>
      </div>

      {/* TAB 1: EVALUASI SETORAN AUDIO */}
      {activeTab === 'setoran' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari santri / surat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['Semua', 'pending', 'mumtaz', 'jayyid'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer ${
                      filterStatus === st
                        ? 'bg-[#0E7A4C] text-[#C8A951]'
                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleSelectRecord(r)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedRecord?.id === r.id
                      ? 'bg-[#0E7A4C]/10 border-[#0E7A4C] shadow-md ring-1 ring-[#0E7A4C]'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                        {r.santriName}
                      </h4>
                      <p className="text-xs font-bold text-[#0E7A4C] dark:text-emerald-400 mt-0.5">
                        Surat {r.surah} • {r.ayahRange}
                      </p>
                      <span className="text-[11px] text-zinc-400 font-mono mt-1 block">
                        {r.date}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          r.status === 'mumtaz'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : r.status === 'jayyid'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {r.status}
                      </span>
                      {r.tajwidScore && (
                        <span className="text-xs font-black text-[#C8A951]">
                          Nilai: {r.tajwidScore}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(r.audioUrl);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7A4C] dark:text-emerald-400 hover:underline"
                    >
                      {playingUrl === r.audioUrl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingUrl === r.audioUrl ? 'Jeda Audio' : 'Putar Rekaman Santri'}</span>
                    </button>
                    <span className="text-[11px] text-zinc-400">Klik kartu untuk nilai</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Evaluator Form */}
          <div className="lg:col-span-5">
            {selectedRecord ? (
              <form onSubmit={handleSaveEvaluation} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-[#0E7A4C]/40 shadow-xl space-y-4 sticky top-20">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <span className="text-[10px] font-black uppercase text-[#C8A951]">Lembar Koreksi Asatidz</span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                    {selectedRecord.santriName}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Setoran: {selectedRecord.surah} ({selectedRecord.ayahRange})
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nilai Tajwid &amp; Makharijul Huruf (0 - 100):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm font-black text-[#C8A951] bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Status Kelulusan Setoran:</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
                  >
                    <option value="mumtaz">Mumtaz (Lulus Sempurna)</option>
                    <option value="jayyid">Jayyid (Lulus dengan Catatan)</option>
                    <option value="remidi">Remidi (Ulangi Setoran)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Catatan Dewan Asatidz / Pembimbing:</label>
                  <textarea
                    rows={4}
                    placeholder="Catatan makhraj huruf, hukum mad, atau dengung ghunnah..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    className="px-3 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md border border-[#C8A951]/40"
                  >
                    Simpan Nilai Setoran
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="font-bold text-xs text-zinc-600 dark:text-zinc-400">Pilih Salah Satu Setoran</h4>
                <p className="text-[11px] text-zinc-400">
                  Klik kartu setoran santri di sebelah kiri untuk mendengarkan audio rekaman dan mengisi nilai tajwid.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MONITORING 114 SURAT & RECITERS */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                Daftar Rujukan 114 Surat Al-Qur'an 30 Juz
              </h3>
              <p className="text-xs text-zinc-400">
                Pusat murottal digital syaikh muqri\' bersanad untuk pendampingan setoran santri
              </p>
            </div>
            <span className="text-xs font-bold text-[#C8A951] bg-[#0A2116] px-3 py-1 rounded-lg border border-[#C8A951]/40">
              Reciter: Syaikh Misyari Rasyid
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SURAH_LIST.map((surah) => (
              <div
                key={surah.number}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-[#0E7A4C] transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0E7A4C]/10 text-[#0E7A4C] dark:text-emerald-400 font-black text-xs flex items-center justify-center border border-[#0E7A4C]/20">
                    {surah.number}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                      {surah.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Juz {surah.juz} • {surah.ayahCount} Ayat
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-serif text-lg font-bold text-zinc-800 dark:text-zinc-200 block">
                    {surah.arabic}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(surah.audioUrl)}
                    className="text-[11px] font-bold text-[#0E7A4C] hover:underline flex items-center gap-1 justify-end cursor-pointer"
                  >
                    {playingUrl === surah.audioUrl ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{playingUrl === surah.audioUrl ? 'Jeda' : 'Murottal'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLOZE TEST MUROJAAH AI */}
      {activeTab === 'cloze' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#C8A951]/40 shadow-xl space-y-5">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-[#C8A951] tracking-wider">
              Uji Hafalan Santri Mandiri
            </span>
            <h3 className="font-black text-base text-zinc-900 dark:text-white">
              Cloze Test: Sambung Potongan Ayat Al-Qur'an
            </h3>
            <p className="text-xs text-zinc-400">
              Lengkapi lafadz ayat yang hilang untuk menguji kekokohan hafalan mutqin santri
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-center space-y-4">
            <span className="text-xs font-bold text-[#0E7A4C]">QS. Al-Fatihah : Ayat 2</span>
            
            <div className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-white leading-loose">
              الْحَمْدُ لِلَّهِ رَبِّ <span className="underline decoration-[#C8A951] decoration-wavy px-2 text-[#C8A951]">[ ... ? ... ]</span>
            </div>

            <form onSubmit={handleCheckCloze} className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="Tuliskan kelanjutan lafadz (Arab / Latin: Al-Alamin)..."
                value={clozeAnswer}
                onChange={(e) => setClozeAnswer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center text-sm font-bold focus:outline-none focus:border-[#0E7A4C]"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md border border-[#C8A951]/40 cursor-pointer"
              >
                Verifikasi Jawaban Murojaah AI
              </button>
            </form>
          </div>

          {clozeResult !== null && (
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 animate-fade-in ${
                clozeResult
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/80 border-rose-500/40 text-rose-800 dark:text-rose-300'
              }`}
            >
              {clozeResult ? (
                <>
                  <p className="font-black text-sm">🎉 MASYA ALLAH, JAWABAN TEPAT!</p>
                  <p className="text-xs">Lafadz yang benar adalah: الْعَالَمِينَ (Al-'Alamin). Hafalan Anda mutqin.</p>
                </>
              ) : (
                <>
                  <p className="font-black text-sm">Coba Periksa Kembali Makhraj &amp; Ejaan</p>
                  <p className="text-xs">Kelanjutan ayat yang tepat: رَبِّ الْعَالَمِينَ.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
export default KelolaHafidz;
