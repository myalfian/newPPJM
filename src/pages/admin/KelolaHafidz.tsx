import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Clock,
  User,
  Award,
  Search,
  MessageSquare,
  Send,
  PlusCircle,
  FileCheck2,
  AlertCircle
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
  const [records, setRecords] = useState<SetoranRecord[]>(INITIAL_SETORAN);
  const [selectedRecord, setSelectedRecord] = useState<SetoranRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Audio Playback
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form Evaluasi
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [statusInput, setStatusInput] = useState<'mumtaz' | 'jayyid' | 'remidi'>('mumtaz');
  const [noteInput, setNoteInput] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  const handlePlayAudio = (record: SetoranRecord) => {
    if (playingId === record.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(record.audioUrl);
    } else {
      audioRef.current.src = record.audioUrl;
    }

    audioRef.current.onended = () => {
      setPlayingId(null);
    };

    audioRef.current.play().then(() => {
      setPlayingId(record.id);
    }).catch((e) => console.warn(e));
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  };

  const openEvaluation = (record: SetoranRecord) => {
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
              tajwidScore: scoreInput,
              status: statusInput,
              teacherNote: noteInput,
            }
          : r
      )
    );

    setSavedAlert(true);
    setSelectedRecord(null);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.santriName.toLowerCase().includes(search.toLowerCase()) ||
      r.surah.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
          <span>Dewan Asatidz Tahfidz & Murojaah AI</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Evaluasi & Verifikasi Setoran Hafalan Santri
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Dengarkan rekaman audio murojaah santri yang masuk secara online, berikan penilaian tajwid, fashahah, serta catatan pembinaan dari ustadz.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, evaluasi hafalan santri berhasil disimpan dan dikirimkan!</span>
        </div>
      )}

      {/* Grid: Daftar Setoran Rekaman Santri */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Daftar Rekaman Setoran Murojaah ({filteredRecords.length})
            </h3>
            <p className="text-xs text-slate-500">
              Santri membaca Al-Qur'an melalui fitur Murojaah AI untuk dievaluasi oleh asatidz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari santri / surat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="pending">Menunggu Evaluasi</option>
              <option value="mumtaz">Mumtaz (Lulus)</option>
              <option value="jayyid">Jayyid</option>
              <option value="remidi">Perlu Pengulangan</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRecords.map((item) => {
            const isPlayingThis = playingId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.status === 'mumtaz'
                          ? 'bg-emerald-100 text-emerald-900'
                          : item.status === 'jayyid'
                          ? 'bg-sky-100 text-sky-900'
                          : item.status === 'remidi'
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.status === 'pending' ? 'Perlu Dinilai' : item.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {item.santriName}
                  </h4>
                  <div className="text-xs font-semibold text-emerald-800">
                    Surat {item.surah} • {item.ayahRange}
                  </div>

                  {item.teacherNote && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80 max-w-xl">
                      <strong>Catatan Ustadz:</strong> {item.teacherNote}
                    </p>
                  )}
                </div>

                {/* Audio Controls & Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(item)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all ${
                      isPlayingThis
                        ? 'bg-gold-500 text-emerald-950'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Jeda Rekaman</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Dengar Rekaman</span>
                      </>
                    )}
                  </button>

                  {/* Stop Button */}
                  {isPlayingThis && (
                    <button
                      type="button"
                      onClick={handleStopAudio}
                      className="p-2 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                      title="Stop Audio"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {/* Skor Badge */}
                  {item.tajwidScore !== null && (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <div className="text-[9px] uppercase font-bold text-emerald-800">Skor</div>
                      <div className="text-sm font-black text-emerald-950">{item.tajwidScore}</div>
                    </div>
                  )}

                  {/* Button Beri Nilai / Edit Evaluasi */}
                  <button
                    type="button"
                    onClick={() => openEvaluation(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-200 transition-colors"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    <span>{item.status === 'pending' ? 'Beri Nilai' : 'Ubah Nilai'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Evaluasi Penilaian Ustadz */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedRecord(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full z-10 p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">
                  Formulir Penilaian Murojaah
                </span>
                <h3 className="text-base sm:text-lg font-black text-emerald-950 mt-0.5">
                  {selectedRecord.santriName}
                </h3>
                <p className="text-xs text-slate-500">
                  Surat {selectedRecord.surah} • {selectedRecord.ayahRange}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Skor Tajwid (0-100):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Keputusan Hasil:</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="mumtaz">Mumtaz (Istimewa)</option>
                    <option value="jayyid">Jayyid (Baik)</option>
                    <option value="remidi">Perlu Pengulangan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan & Masukan Ustadz:</label>
                <textarea
                  rows={3}
                  placeholder="Beri arahan makhraj huruf, tajwid, atau kelancaran hafalan..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Kirim Nilai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
