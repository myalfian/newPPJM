import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Paperclip,
  UploadCloud,
  FileText,
  Trash2,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  ExternalLink,
  User,
  Calendar,
  Award,
  Loader2,
  Plus,
} from 'lucide-react';
import { useSantri } from './SantriContext';
import { SantriTipTapEditor, SantriRichViewer, parseRichJsonb } from './SantriTipTap';
import { formatDeadlineCountdown } from './SantriDashboard';

export const SantriTugasDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tugasList, submissionsMap, saveTugasSubmission, uploadSantriFile, loading } = useSantri();

  const tugas = tugasList.find((t) => t.id === id) || tugasList[0];
  const existingSub = tugas ? submissionsMap[tugas.id] : undefined;

  const [jawabanJson, setJawabanJson] = useState<any>(() =>
    parseRichJsonb(existingSub?.jawaban_text)
  );
  const [fileUrls, setFileUrls] = useState<string[]>(existingSub?.file_url || []);
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [isEditingSubmitted, setIsEditingSubmitted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [savingStatus, setSavingStatus] = useState<'draft' | 'dikumpulkan' | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (existingSub) {
      setJawabanJson(parseRichJsonb(existingSub.jawaban_text));
      setFileUrls(existingSub.file_url || []);
      // Automatically open editor if status is draft or revisi
      setIsEditingSubmitted(
        existingSub.status === 'draft' || existingSub.status === 'revisi'
      );
    } else {
      setJawabanJson(parseRichJsonb(null));
      setFileUrls([]);
      setIsEditingSubmitted(true);
    }
  }, [existingSub, tugas?.id]);

  if (loading || !tugas) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 rounded-2xl bg-white border border-slate-200/70" />
        <div className="h-96 rounded-2xl bg-white border border-slate-200/70" />
      </div>
    );
  }

  const countdown = formatDeadlineCountdown(tugas.deadline);
  const status = existingSub?.status || 'belum';
  const isLocked = status === 'dinilai';
  const isEditorOpen = !isLocked && (status === 'belum' || status === 'draft' || status === 'revisi' || isEditingSubmitted);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const { url } = await uploadSantriFile(f, 'tugas');
      if (url) uploaded.push(url);
    }
    setFileUrls((prev) => [...prev, ...uploaded]);
    setUploadingFiles(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFilesSelected(e.dataTransfer.files);
  };

  const handleAddCustomLink = () => {
    const trimmed = customLinkInput.trim();
    if (!trimmed) return;
    setFileUrls((prev) => [...prev, trimmed]);
    setCustomLinkInput('');
  };

  const handleRemoveAttachment = (index: number) => {
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (targetStatus: 'draft' | 'dikumpulkan') => {
    setSavingStatus(targetStatus);
    const res = await saveTugasSubmission(tugas.id, {
      jawaban_text: jawabanJson,
      file_url: fileUrls,
      status: targetStatus,
    });
    setSavingStatus(null);
    if (res.ok && targetStatus === 'dikumpulkan') {
      setIsEditingSubmitted(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/santri/tugas"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-[#115E59] text-xs font-extrabold text-slate-700 hover:text-[#115E59] shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Tugas</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
              status === 'dinilai'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : status === 'revisi'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : status === 'dikumpulkan'
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : status === 'draft'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            Status:{' '}
            {status === 'dinilai'
              ? `Sudah Dinilai (${existingSub?.nilai}/100)`
              : status === 'revisi'
              ? 'Perlu Revisi'
              : status === 'dikumpulkan'
              ? 'Sudah Dikumpulkan'
              : status === 'draft'
              ? 'Draft Tersimpan'
              : 'Belum Dikumpulkan'}
          </span>
        </div>
      </div>

      {/* ─── BAGIAN 1: HEADER & DESKRIPSI TUGAS WYSIWYG ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#115E59] text-[11px] font-extrabold uppercase">
                {tugas.mapel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase">
                Tipe: {tugas.tipe}
              </span>
              <span className="text-xs text-slate-500">
                • Sasaran: <strong>{tugas.kelas_target}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {tugas.judul}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#115E59]" />
                <span>
                  Pengampu: <strong className="text-slate-700">{tugas.guru_nama || 'Dewan Asatidz'}</strong>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#115E59]" />
                <span>
                  Tenggat:{' '}
                  <strong className="text-slate-700">
                    {new Date(tugas.deadline).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </span>
              </span>
            </div>
          </div>

          {/* Countdown Box */}
          <div
            className={`px-4 py-2.5 rounded-2xl border shrink-0 flex items-center gap-2.5 ${
              countdown.urgent && status !== 'dinilai'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-[#FAF8F5] border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-5 h-5 text-[#115E59]" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                Sisa Waktu Pengumpulan
              </div>
              <div className="text-sm font-black">{countdown.label}</div>
            </div>
          </div>
        </div>

        {/* Deskripsi Tugas WYSIWYG */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Instruksi &amp; Deskripsi Tugas
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/70">
            <SantriRichViewer content={tugas.deskripsi} />
          </div>
        </div>

        {/* Lampiran Modul dari Guru */}
        {tugas.attachment_url && tugas.attachment_url.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Lampiran Modul / Bahan Bacaan dari Guru
            </div>
            <div className="flex flex-wrap gap-2">
              {tugas.attachment_url.map((url, idx) => {
                const fileName = url.split('/').pop() || `Lampiran-${idx + 1}`;
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-[#115E59] text-xs font-bold transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── BAGIAN 2: PANEL NILAI & FEEDBACK GURU (Jika Dinilai / Perlu Revisi) ─── */}
      {existingSub && (existingSub.status === 'dinilai' || existingSub.status === 'revisi' || existingSub.feedback) && (
        <div
          className={`rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            existingSub.status === 'revisi'
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider">
              {existingSub.status === 'revisi' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-rose-700">Catatan Evaluasi &amp; Permintaan Revisi Guru</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-[#115E59]" />
                  <span className="text-[#115E59]">Hasil Penilaian &amp; Apresiasi Guru Pengampu</span>
                </>
              )}
            </div>
            <p className="text-sm font-medium leading-relaxed">
              {existingSub.feedback || 'Terima kasih, tugas Anda telah diterima dan diperiksa oleh guru pengampu.'}
            </p>
          </div>

          {typeof existingSub.nilai === 'number' && (
            <div className="px-5 py-3 rounded-2xl bg-white border border-emerald-200 text-center shrink-0 shadow-2xs">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Nilai Akhir
              </div>
              <div className="text-3xl font-black text-[#115E59]">{existingSub.nilai}</div>
              <div className="text-[11px] font-bold text-emerald-700">Skala 0–100</div>
            </div>
          )}
        </div>
      )}

      {/* ─── BAGIAN 3: FORM POSTING / UPDATE JAWABAN SANTRI ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
              Lembar Kerja &amp; Jawaban Santri
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {isLocked
                ? 'Jawaban Anda (Sudah Dinilai)'
                : existingSub
                ? 'Perbarui / Edit Jawaban Tugas'
                : 'Posting Jawaban Tugas Baru'}
            </h3>
          </div>

          {/* Toggle Edit Mode if status === 'dikumpulkan' */}
          {!isLocked && status === 'dikumpulkan' && !isEditingSubmitted && (
            <button
              type="button"
              onClick={() => setIsEditingSubmitted(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit / Perbarui Jawaban</span>
            </button>
          )}
        </div>

        {/* Read-only view when already submitted and not currently editing */}
        {!isEditorOpen ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <SantriRichViewer content={jawabanJson} />
            </div>

            {fileUrls.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600">
                  Berkas Lampiran yang Dikumpulkan ({fileUrls.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {fileUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-[#115E59]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="max-w-xs truncate">{url.split('/').pop() || url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {existingSub?.updated_at && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Terakhir diperbarui pada{' '}
                  {new Date(existingSub.updated_at).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Interactive WYSIWYG Editor + Drag & Drop Upload */
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                1. Tulis Jawaban / Laporan Tugas (Editor WYSIWYG TipTap)
              </label>
              <SantriTipTapEditor
                value={jawabanJson}
                onChange={setJawabanJson}
                placeholder="Ketik jawaban lengkap, rangkuman kitab, tabel data percobaan STEM, atau teks Hanzi/Pinyin di sini..."
                minHeight="220px"
              />
            </div>

            {/* Drag & Drop File Upload Zone */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                2. Unggah Berkas Lampiran (Foto LKPD, Dokumen PDF/DOCX, atau Audio Rekaman Tahfidz)
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-[#115E59] bg-emerald-50/70'
                    : 'border-slate-300/90 hover:border-[#115E59] bg-[#FAF8F5]/70 hover:bg-emerald-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />
                {uploadingFiles ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <Loader2 className="w-7 h-7 text-[#115E59] animate-spin" />
                    <span className="text-xs font-bold text-[#115E59]">
                      Mengunggah berkas ke penyimpanan…
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-8 h-8 text-[#115E59] mx-auto" />
                    <div className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Tarik &amp; lepaskan berkas di sini, atau klik untuk memilih file
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Mendukung Foto (JPG/PNG/WebP), Dokumen (PDF/DOCX), dan Rekaman Suara Setoran (MP3/M4A)
                    </p>
                  </div>
                )}
              </div>

              {/* Optional Direct Link Input */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customLinkInput}
                  onChange={(e) => setCustomLinkInput(e.target.value)}
                  placeholder="Atau tempel tautan Google Drive / YouTube / dokumen eksternal…"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#115E59]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomLink}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#115E59] bg-white text-xs font-bold text-[#115E59] flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Link</span>
                </button>
              </div>

              {/* List of Attached Files */}
              {fileUrls.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-500">
                    Berkas Terlampir ({fileUrls.length}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fileUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-slate-200/80 text-xs"
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 min-w-0 font-semibold text-[#115E59] hover:underline"
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="truncate">{url.split('/').pop() || url}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
                          title="Hapus lampiran"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Simpan Draft & Kumpulkan Tugas */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {existingSub
                  ? 'Anda dapat menyimpan sebagai draft atau langsung memperbarui pengumpulan tugas.'
                  : 'Simpan sebagai draft jika masih ingin melanjutkan nanti.'}
              </div>

              <div className="flex items-center gap-2.5">
                {status === 'dikumpulkan' && (
                  <button
                    type="button"
                    onClick={() => setIsEditingSubmitted(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                )}

                <button
                  type="button"
                  disabled={savingStatus !== null}
                  onClick={() => handleSave('draft')}
                  className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingStatus === 'draft' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Simpan Draft</span>
                </button>

                <button
                  type="button"
                  disabled={savingStatus !== null}
                  onClick={() => handleSave('dikumpulkan')}
                  className="px-5 py-2.5 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingStatus === 'dikumpulkan' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-amber-300" />
                  )}
                  <span>
                    {status === 'dikumpulkan' || status === 'revisi'
                      ? 'Perbarui & Kumpulkan Tugas'
                      : 'Kumpulkan Tugas Sekarang'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SantriTugasDetailPage;

