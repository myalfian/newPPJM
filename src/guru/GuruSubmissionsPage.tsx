import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGuru } from './GuruContext';
import { GuruRichViewer } from './GuruTipTap';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  FileText,
  ExternalLink,
  Send,
  RotateCcw,
  Users,
  Edit3,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const QUICK_SCORES = [100, 95, 90, 85, 80, 75];
const QUICK_FEEDBACKS = [
  'MasyaAllah, jawaban sangat lengkap, terstruktur, dan tepat waktu. Pertahankan!',
  'Jawaban sudah baik dan sesuai konsep, tingkatkan lagi ketelitian analisisnya.',
  'Mohon lengkapi bagian kesimpulan dan lampirkan bukti pengerjaan sesuai instruksi.',
];

export const GuruSubmissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tugasList, submissionsList, santriList, gradeSubmission, loading } = useGuru();

  const currentTugas = useMemo(() => {
    return tugasList.find((t) => t.id === id) || tugasList[0] || null;
  }, [tugasList, id]);

  const [statusFilter, setStatusFilter] = useState<'all' | 'dikumpulkan' | 'dinilai' | 'revisi' | 'belum'>('all');
  const [selectedSantriId, setSelectedSantriId] = useState<string>('');
  const [nilaiInput, setNilaiInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Build unified roster of santri with their submission for currentTugas
  const santriSubmissions = useMemo(() => {
    if (!currentTugas) return [];
    const taskSubs = submissionsList.filter((s) => s.tugas_id === currentTugas.id);

    return santriList.map((santri) => {
      const sub = taskSubs.find((s) => s.santri_id === santri.id) || null;
      const status: 'dikumpulkan' | 'dinilai' | 'revisi' | 'draft' | 'belum' = sub ? sub.status : 'belum';
      return {
        santri,
        submission: sub,
        status,
      };
    });
  }, [currentTugas, submissionsList, santriList]);

  const filteredRoster = useMemo(() => {
    return santriSubmissions.filter((item) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    });
  }, [santriSubmissions, statusFilter]);

  // Default select first santri who has a submission (prefer 'dikumpulkan')
  useEffect(() => {
    if (santriSubmissions.length === 0) return;
    const stillValid = santriSubmissions.some((s) => s.santri.id === selectedSantriId);
    if (!stillValid) {
      const needGrading = santriSubmissions.find((s) => s.status === 'dikumpulkan');
      const withSub = santriSubmissions.find((s) => s.submission !== null);
      const chosen = needGrading || withSub || santriSubmissions[0];
      if (chosen) {
        setSelectedSantriId(chosen.santri.id);
      }
    }
  }, [santriSubmissions, selectedSantriId]);

  const activeItem = useMemo(() => {
    return santriSubmissions.find((s) => s.santri.id === selectedSantriId) || santriSubmissions[0] || null;
  }, [santriSubmissions, selectedSantriId]);

  // Sync grading form when activeItem changes
  useEffect(() => {
    if (activeItem?.submission) {
      setNilaiInput(activeItem.submission.nilai ?? 90);
      setFeedbackInput(activeItem.submission.feedback || '');
    } else {
      setNilaiInput(90);
      setFeedbackInput('');
    }
  }, [activeItem?.santri.id, activeItem?.submission?.id]);

  const stats = useMemo(() => {
    const totalSantri = Math.max(santriSubmissions.length, 1);
    const submitted = santriSubmissions.filter((s) => s.submission && s.status !== 'draft').length;
    const perluDinilai = santriSubmissions.filter((s) => s.status === 'dikumpulkan').length;
    const selesaiDinilai = santriSubmissions.filter((s) => s.status === 'dinilai').length;
    const revisi = santriSubmissions.filter((s) => s.status === 'revisi').length;
    const belum = santriSubmissions.filter((s) => s.status === 'belum').length;
    const pct = Math.min(100, Math.round((submitted / totalSantri) * 100));
    return { totalSantri, submitted, perluDinilai, selesaiDinilai, revisi, belum, pct };
  }, [santriSubmissions]);

  const handleGrade = async (targetStatus: 'dinilai' | 'revisi') => {
    if (!activeItem?.submission) return;
    setSaving(true);
    await gradeSubmission(activeItem.submission.id, {
      nilai: Number(nilaiInput) || 0,
      feedback: feedbackInput.trim() || (targetStatus === 'dinilai' ? 'Telah dinilai oleh Guru.' : 'Mohon perbaiki sesuai catatan revisi.'),
      status: targetStatus,
    });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-white border border-stone-200/80 animate-pulse" />
        <div className="h-96 rounded-2xl bg-white border border-stone-200/80 animate-pulse" />
      </div>
    );
  }

  if (!currentTugas) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 p-10 text-center">
        <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-stone-800">Belum Ada Tugas</h2>
        <p className="text-sm text-stone-500 mt-1 mb-4">Silakan buat tugas terlebih dahulu untuk menilai pengumpulan santri.</p>
        <Link
          to="/guru/tugas/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115E59] text-white text-sm font-semibold"
        >
          Buat Tugas Baru
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar & Task Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            to="/guru/tugas"
            className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition shrink-0"
            title="Kembali ke Daftar Tugas"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-[#115E59] border border-teal-200">
                {currentTugas.mapel}
              </span>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Deadline: {new Date(currentTugas.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">{currentTugas.judul}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 whitespace-nowrap">Pilih Tugas:</label>
            <select
              value={currentTugas.id}
              onChange={(e) => navigate(`/guru/tugas/${e.target.value}/submissions`)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF8F5] text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#115E59] max-w-xs truncate"
            >
              {tugasList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.judul} ({t.mapel})
                </option>
              ))}
            </select>
          </div>

          <Link
            to={`/guru/tugas/${currentTugas.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#115E59]" />
            Update Tugas
          </Link>
        </div>
      </div>

      {/* Progress Bar & Summary Counters */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#115E59]" />
            <span className="text-sm font-bold text-stone-900">
              Progress Pengumpulan Kelas ({ currentTugas.kelas_target })
            </span>
          </div>
          <span className="text-xs font-bold text-[#115E59]">
            {stats.submitted} dari {stats.totalSantri} Santri Mengumpulkan ({stats.pct}%)
          </span>
        </div>

        <div className="h-3 rounded-full bg-stone-100 overflow-hidden p-0.5 border border-stone-200/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#115E59] to-teal-500 transition-all duration-500"
            style={{ width: `${stats.pct}%` }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'all'
                ? 'bg-[#115E59] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            Semua Santri ({stats.totalSantri})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('dikumpulkan')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'dikumpulkan'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Perlu Dinilai ({stats.perluDinilai})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('dinilai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'dinilai'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Sudah Dinilai ({stats.selesaiDinilai})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('revisi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'revisi'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Perlu Revisi ({stats.revisi})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('belum')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'belum'
                ? 'bg-stone-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Belum Mengumpulkan ({stats.belum})
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Roster List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="px-4 py-3.5 border-b border-stone-100 bg-[#FAF8F5] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Daftar Santri ({filteredRoster.length})
            </span>
            <span className="text-[11px] text-stone-400">Klik untuk menilai</span>
          </div>

          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
            {filteredRoster.map((item) => {
              const isSelected = activeItem?.santri.id === item.santri.id;
              return (
                <button
                  key={item.santri.id}
                  type="button"
                  onClick={() => setSelectedSantriId(item.santri.id)}
                  className={`w-full text-left p-4 transition flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50/70 border-l-4 border-l-[#115E59]'
                      : 'hover:bg-stone-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        item.santri.foto_url ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={item.santri.full_name}
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">{item.santri.full_name}</p>
                      <p className="text-xs text-stone-500 truncate">
                        NIS {item.santri.nis} • {item.santri.kelas}
                      </p>
                      {item.submission?.submitted_at && (
                        <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.submission.submitted_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {item.status === 'dikumpulkan' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        Perlu Dinilai
                      </span>
                    )}
                    {item.status === 'dinilai' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Nilai: {item.submission?.nilai}
                      </span>
                    )}
                    {item.status === 'revisi' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Revisi ({item.submission?.nilai ?? '-'})
                      </span>
                    )}
                    {item.status === 'draft' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                        Masih Draft
                      </span>
                    )}
                    {item.status === 'belum' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-400">
                        Belum Kumpul
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Grading & Answer Panel */}
        <div className="lg:col-span-8 space-y-6">
          {activeItem ? (
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
              {/* Santri Header */}
              <div className="p-5 sm:p-6 border-b border-stone-100 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      activeItem.santri.foto_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={activeItem.santri.full_name}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <h2 className="text-base font-bold text-stone-900">{activeItem.santri.full_name}</h2>
                    <p className="text-xs text-stone-500">
                      NIS: {activeItem.santri.nis} • Kelas: {activeItem.santri.kelas} • Asrama: {activeItem.santri.kamar_asrama}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeItem.status === 'dikumpulkan' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Menunggu Penilaian Guru
                    </span>
                  )}
                  {activeItem.status === 'dinilai' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Telah Dinilai: {activeItem.submission?.nilai}/100
                    </span>
                  )}
                  {activeItem.status === 'revisi' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Diminta Revisi
                    </span>
                  )}
                </div>
              </div>

              {/* Submission Body */}
              {activeItem.submission ? (
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Jawaban Santri WYSIWYG */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#115E59]" />
                        Lembar Jawaban Santri
                      </h3>
                      <span className="text-xs text-stone-400">
                        Dikumpulkan:{' '}
                        {new Date(activeItem.submission.submitted_at || Date.now()).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-stone-800">
                      <GuruRichViewer content={activeItem.submission.jawaban_text} />
                    </div>
                  </div>

                  {/* Lampiran File Santri */}
                  {activeItem.submission.file_url && activeItem.submission.file_url.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                        Lampiran Berkas / Dokumen Santri ({activeItem.submission.file_url.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeItem.submission.file_url.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 p-3 rounded-xl border border-stone-200 bg-white hover:border-[#115E59] hover:bg-teal-50/30 transition group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="w-4 h-4 text-[#115E59] shrink-0" />
                              <span className="text-xs font-medium text-stone-700 truncate">
                                {url.split('/').pop() || `Lampiran-${idx + 1}`}
                              </span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#115E59] shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Penilaian Guru */}
                  <div className="pt-5 border-t border-stone-200/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#115E59]" />
                      <h3 className="text-base font-bold text-stone-900">Form Penilaian & Evaluasi Guru</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                      <div className="sm:col-span-4 space-y-2">
                        <label className="block text-xs font-bold text-stone-700">Nilai Akhir (0 - 100)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={nilaiInput}
                          onChange={(e) => setNilaiInput(Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF8F5] text-2xl font-extrabold text-[#115E59] focus:outline-none focus:border-[#115E59] focus:bg-white"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {QUICK_SCORES.map((sc) => (
                            <button
                              key={sc}
                              type="button"
                              onClick={() => setNilaiInput(sc)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                nilaiInput === sc
                                  ? 'bg-[#115E59] text-white'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {sc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-8 space-y-2">
                        <label className="block text-xs font-bold text-stone-700">
                          Feedback / Catatan Koreksi untuk Santri
                        </label>
                        <textarea
                          rows={3}
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          placeholder="Tuliskan apresiasi, koreksi jawaban, atau instruksi revisi untuk santri..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm text-stone-800 focus:outline-none focus:border-[#115E59] focus:bg-white"
                        />
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Template Feedback Cepat:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {QUICK_FEEDBACKS.map((tpl, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setFeedbackInput(tpl)}
                                className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-teal-50 hover:text-[#115E59] text-stone-600 transition truncate max-w-xs"
                              >
                                "{tpl.slice(0, 48)}..."
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleGrade('revisi')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Kembalikan untuk Revisi
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleGrade('dinilai')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {saving ? 'Menyimpan Nilai...' : 'Simpan Nilai & Tandai Selesai'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center space-y-2">
                  <Clock className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800">
                    {activeItem.santri.full_name} Belum Mengumpulkan Tugas Ini
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Santri ini belum mengirimkan jawaban pada tugas <strong>{currentTugas.judul}</strong>. Begitu santri mengumpulkan, Anda akan menerima notifikasi Realtime di pojok kanan atas.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
