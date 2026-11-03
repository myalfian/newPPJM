import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  UploadCloud,
  Paperclip,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
} from 'lucide-react';
import { useGuru } from './GuruContext';
import { GuruTipTapEditor } from './GuruTipTap';
import { parseRichJsonb } from '../santri/SantriTipTap';

const MAPEL_OPTIONS = [
  "Tahfidzul Qur'an",
  'IPA & Robotika STEM',
  'Matematika Olimpiade',
  'Fiqih Madrasah Diniyah',
  'Bahasa Mandarin',
  'English',
  'Arabic',
  'Adab & Akhlak Pesantren',
];

const KELAS_CHOICES = [
  'Semua Kelas',
  'VII-A Tahfidz',
  'VII-B Sains STEM',
  'VIII-A Tahfidz',
  'VIII-B Sains STEM',
  'IX-A Tahfidz',
  'IX-B Sains STEM',
];

export const GuruTugasFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tugasList,
    submissionsList,
    santriList,
    createTugas,
    updateTugas,
    uploadGuruFile,
    loading,
  } = useGuru();

  const existingTugas = id ? tugasList.find((t) => t.id === id) : undefined;
  const isEditMode = Boolean(id && existingTugas);

  const [judul, setJudul] = useState(existingTugas?.judul || '');
  const [mapel, setMapel] = useState(existingTugas?.mapel || MAPEL_OPTIONS[0]);
  const [tipe, setTipe] = useState<'harian' | 'pekanan' | 'project' | 'tahfidz'>(
    existingTugas?.tipe || 'harian'
  );
  const [kelasTargets, setKelasTargets] = useState<string[]>(
    existingTugas?.kelas_targets ||
      (existingTugas?.kelas_target ? [existingTugas.kelas_target] : ['VIII-A Tahfidz'])
  );
  const [deadline, setDeadline] = useState(() => {
    if (existingTugas?.deadline) {
      return new Date(existingTugas.deadline).toISOString().slice(0, 16);
    }
    return new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16);
  });
  const [deskripsiJson, setDeskripsiJson] = useState<any>(() =>
    parseRichJsonb(
      existingTugas?.deskripsi,
      'Tuliskan instruksi pengerjaan tugas, langkah praktikum, atau target ayat setoran...'
    )
  );
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>(
    existingTugas?.attachment_url || []
  );
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [savingMode, setSavingMode] = useState<'published' | 'draft' | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (existingTugas) {
      setJudul(existingTugas.judul);
      setMapel(existingTugas.mapel);
      setTipe(existingTugas.tipe);
      setKelasTargets(
        existingTugas.kelas_targets ||
          (existingTugas.kelas_target ? [existingTugas.kelas_target] : ['VIII-A Tahfidz'])
      );
      setDeadline(new Date(existingTugas.deadline).toISOString().slice(0, 16));
      setDeskripsiJson(parseRichJsonb(existingTugas.deskripsi));
      setAttachmentUrls(existingTugas.attachment_url || []);
    }
  }, [existingTugas]);

  const toggleKelasTarget = (k: string) => {
    if (k === 'Semua Kelas') {
      setKelasTargets(['Semua Kelas']);
      return;
    }
    setKelasTargets((prev) => {
      const cleaned = prev.filter((item) => item !== 'Semua Kelas');
      if (cleaned.includes(k)) {
        const next = cleaned.filter((item) => item !== k);
        return next.length > 0 ? next : ['VIII-A Tahfidz'];
      }
      return [...cleaned, k];
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const { url } = await uploadGuruFile(files[i], 'tugas');
      if (url) urls.push(url);
    }
    setAttachmentUrls((prev) => [...prev, ...urls]);
    setUploadingFiles(false);
  };

  const handleAddLink = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    setAttachmentUrls((prev) => [...prev, trimmed]);
    setCustomUrlInput('');
  };

  const handleSaveTugas = async (targetPublish: 'published' | 'draft') => {
    if (!judul.trim()) return;
    setSavingMode(targetPublish);
    if (isEditMode && existingTugas) {
      const res = await updateTugas(existingTugas.id, {
        judul,
        deskripsi: deskripsiJson,
        mapel,
        kelas_targets: kelasTargets,
        deadline,
        tipe,
        attachment_url: attachmentUrls,
        status_publish: targetPublish,
      });
      setSavingMode(null);
      if (res.ok) navigate('/guru/tugas');
    } else {
      const res = await createTugas({
        judul,
        deskripsi: deskripsiJson,
        mapel,
        kelas_targets: kelasTargets,
        deadline,
        tipe,
        attachment_url: attachmentUrls,
        status_publish: targetPublish,
      });
      setSavingMode(null);
      if (res.ok) navigate('/guru/tugas');
    }
  };

  // Submissions for this task if in Update mode
  const taskSubmissions = existingTugas
    ? submissionsList.filter((s) => s.tugas_id === existingTugas.id)
    : [];

  if (loading) {
    return <div className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/guru/tugas"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-[#115E59] text-xs font-extrabold text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Tugas</span>
        </Link>

        {isEditMode && existingTugas && (
          <Link
            to={`/guru/tugas/${existingTugas.id}/submissions`}
            className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#115E59] text-xs font-extrabold"
          >
            Buka Halaman Penilaian Submissions ({taskSubmissions.length})
          </Link>
        )}
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Judul, WYSIWYG Deskripsi & Upload Attachment */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
              {isEditMode ? 'Mode Update Tugas' : 'Mode Posting Tugas Baru'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {isEditMode ? `Edit Tugas: ${existingTugas?.judul}` : 'Buat & Terbitkan Tugas Santri'}
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Tugas / Proyek / Setoran
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Proyek LKPD STEM Hydrolift atau Setoran Tahfidz Surah Al-Mulk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#115E59]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi &amp; Instruksi Tugas WYSIWYG (Bisa Embed Gambar &amp; Video YouTube)
            </label>
            <GuruTipTapEditor
              value={deskripsiJson}
              onChange={(json) => setDeskripsiJson(json)}
              onUploadImage={(f) => uploadGuruFile(f, 'tugas')}
              placeholder="Ketik instruksi lengkap, langkah kerja, atau sematkan video pembelajaran YouTube..."
              minHeight="240px"
            />
          </div>

          {/* Attachment Upload to bucket 'tugas' */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">
              Lampiran Modul / Lembar Kerja (Diunggah ke Supabase Storage bucket <code>tugas</code>)
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#115E59] bg-[#FAF8F5] text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              {uploadingFiles ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#115E59]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengunggah berkas ke bucket tugas…</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="w-7 h-7 text-[#115E59] mx-auto" />
                  <div className="text-xs font-extrabold text-slate-800">
                    Klik untuk mengunggah file modul (PDF, DOCX, PPTX, Gambar, Audio)
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Atau tempel tautan modul eksternal…"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:border-[#115E59] text-xs font-bold text-[#115E59] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {attachmentUrls.length > 0 && (
              <div className="space-y-1.5">
                {attachmentUrls.map((u, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs"
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#115E59] truncate">
                      <Paperclip className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{u.split('/').pop() || u}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachmentUrls((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-rose-500 hover:bg-rose-50 p-1 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Mapel, Kelas Multi-Select, Deadline, Tipe, Publish/Draft + Progress */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                Parameter Penugasan
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Pengaturan Kelas &amp; Tenggat
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mata Pelajaran
              </label>
              <select
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#115E59]"
              >
                {MAPEL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipe Tugas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'harian', label: 'Harian' },
                    { id: 'pekanan', label: 'Pekanan' },
                    { id: 'project', label: 'Project STEM' },
                    { id: 'tahfidz', label: 'Tahfidz' },
                  ] as const
                ).map((tp) => (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => setTipe(tp.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold cursor-pointer ${
                      tipe === tp.id
                        ? 'bg-[#115E59] text-white border-[#115E59]'
                        : 'bg-[#FAF8F5] text-slate-600 border-slate-200'
                    }`}
                  >
                    {tp.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kelas Target (Multi-Select)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {KELAS_CHOICES.map((k) => {
                  const selected = kelasTargets.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleKelasTarget(k)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        selected
                          ? 'bg-emerald-50 border-[#115E59] text-[#115E59] ring-1 ring-[#115E59]/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Batas Waktu Pengumpulan (Deadline)
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:border-[#115E59]"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={savingMode !== null || !judul.trim()}
                onClick={() => handleSaveTugas('published')}
                className="w-full py-3 px-4 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingMode === 'published' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-amber-300" />
                )}
                <span>{isEditMode ? 'Update & Publish Tugas' : 'Publish Tugas Sekarang'}</span>
              </button>

              <button
                type="button"
                disabled={savingMode !== null || !judul.trim()}
                onClick={() => handleSaveTugas('draft')}
                className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingMode === 'draft' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Simpan sebagai Draft</span>
              </button>
            </div>
          </div>

          {/* Progress Siapa Saja yang Sudah Mengumpulkan (Tampil saat Update Tugas) */}
          {isEditMode && (
            <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#115E59]" />
                  <span>Status Pengumpulan Santri</span>
                </span>
                <span className="text-xs font-black text-[#115E59]">
                  {taskSubmissions.length}/{santriList.length} Santri
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#115E59] rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((taskSubmissions.length / Math.max(1, santriList.length)) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pt-1">
                {santriList.map((s) => {
                  const sub = taskSubmissions.find((ts) => ts.santri_id === s.id);
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-slate-200/60 text-xs"
                    >
                      <span className="font-bold text-slate-800 truncate">{s.full_name}</span>
                      {sub ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{sub.status.toUpperCase()}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Belum</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuruTugasFormPage;

