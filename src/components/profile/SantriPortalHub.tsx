import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Cpu,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Award,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import {
  santriPortalService,
  HafalanReport,
  StemSubmission,
  TestRecord,
} from '../../services/santriPortalService';

interface Props {
  santriId?: string;
  santriName?: string;
}

export const SantriPortalHub: React.FC<Props> = ({
  santriId = 'SAN-2024-089',
  santriName = 'Ahmad Zaki Al-Maknuuni',
}) => {
  const [activeTab, setActiveTab] = useState<'hafalan' | 'stem' | 'tests'>('hafalan');

  // Data states
  const [hafalanList, setHafalanList] = useState<HafalanReport[]>([]);
  const [stemList, setStemList] = useState<StemSubmission[]>([]);
  const [testList, setTestList] = useState<TestRecord[]>([]);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Modals state
  const [isHafalanModalOpen, setIsHafalanModalOpen] = useState(false);
  const [editingHafalan, setEditingHafalan] = useState<HafalanReport | null>(null);

  const [isStemModalOpen, setIsStemModalOpen] = useState(false);
  const [editingStem, setEditingStem] = useState<StemSubmission | null>(null);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestRecord | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    type: 'hafalan' | 'stem' | 'test';
    id: string;
    title: string;
  } | null>(null);

  // Load data
  const loadAllData = () => {
    setHafalanList(santriPortalService.getHafalanReports(santriId));
    setStemList(santriPortalService.getStemSubmissions(santriId));
    setTestList(santriPortalService.getTestRecords(santriId));
  };

  useEffect(() => {
    loadAllData();
  }, [santriId]);

  // Metrics
  const metrics = useMemo(() => {
    const totalHafalan = hafalanList.length;
    const mutqinCount = hafalanList.filter(h => h.fluencyStatus === 'mutqin').length;
    const mutqinRate = totalHafalan > 0 ? Math.round((mutqinCount / totalHafalan) * 100) : 0;

    const totalStem = stemList.length;
    const stemDoneCount = stemList.filter(s => s.status === 'selesai').length;

    const totalTests = testList.length;
    const avgScore = totalTests > 0
      ? Math.round(testList.reduce((acc, curr) => acc + curr.score, 0) / totalTests)
      : 0;

    return { totalHafalan, mutqinRate, totalStem, stemDoneCount, totalTests, avgScore };
  }, [hafalanList, stemList, testList]);

  // ================= CRUD HANDLERS =================
  const handleSaveHafalan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const reportData = {
      santriId,
      surah: formData.get('surah') as string,
      juz: Number(formData.get('juz')),
      ayatRange: formData.get('ayatRange') as string,
      setoranType: formData.get('setoranType') as 'ziyadah' | 'murojaah' | 'simakan',
      fluencyStatus: formData.get('fluencyStatus') as 'mutqin' | 'jayyid' | 'dhoif',
      date: formData.get('date') as string,
      ustadzNotes: formData.get('ustadzNotes') as string,
    };

    if (editingHafalan) {
      santriPortalService.updateHafalanReport(editingHafalan.id, reportData, santriId);
      showToast('Setoran hafalan berhasil diperbarui!');
    } else {
      santriPortalService.addHafalanReport(reportData, santriId);
      showToast('Setoran hafalan baru berhasil dicatat!');
    }

    setIsHafalanModalOpen(false);
    setEditingHafalan(null);
    loadAllData();
  };

  const handleSaveStem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const submissionData = {
      santriId,
      title: formData.get('title') as string,
      category: formData.get('category') as 'iot' | 'robotika' | 'coding' | 'hidroponik' | 'sains',
      progressNotes: formData.get('progressNotes') as string,
      projectLink: formData.get('projectLink') as string,
      submissionDate: formData.get('submissionDate') as string,
      status: formData.get('status') as 'draft' | 'diserahkan' | 'revisi' | 'selesai',
    };

    if (editingStem) {
      santriPortalService.updateStemSubmission(editingStem.id, submissionData, santriId);
      showToast('Laporan tugas STEM berhasil diperbarui!');
    } else {
      santriPortalService.addStemSubmission(submissionData, santriId);
      showToast('Tugas STEM baru berhasil diserahkan!');
    }

    setIsStemModalOpen(false);
    setEditingStem(null);
    loadAllData();
  };

  const handleSaveTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const scoreVal = Number(formData.get('score'));

    const testData = {
      santriId,
      testTitle: formData.get('testTitle') as string,
      category: formData.get('category') as 'mandarin' | 'tahfidz' | 'diniyah' | 'stem',
      score: scoreVal,
      testDate: formData.get('testDate') as string,
      status: (scoreVal >= 75 ? 'lulus' : 'remidi') as 'lulus' | 'remidi',
      reflection: formData.get('reflection') as string,
    };

    if (editingTest) {
      santriPortalService.updateTestRecord(editingTest.id, testData, santriId);
      showToast('Catatan nilai test berhasil diperbarui!');
    } else {
      santriPortalService.addTestRecord(testData, santriId);
      showToast('Hasil test baru berhasil dicatat!');
    }

    setIsTestModalOpen(false);
    setEditingTest(null);
    loadAllData();
  };

  const executeDelete = () => {
    if (!deleteModal) return;

    if (deleteModal.type === 'hafalan') {
      santriPortalService.deleteHafalanReport(deleteModal.id, santriId);
      showToast('Entri setoran hafalan berhasil dihapus.');
    } else if (deleteModal.type === 'stem') {
      santriPortalService.deleteStemSubmission(deleteModal.id, santriId);
      showToast('Entri tugas STEM berhasil dihapus.');
    } else if (deleteModal.type === 'test') {
      santriPortalService.deleteTestRecord(deleteModal.id, santriId);
      showToast('Catatan hasil test berhasil dihapus.');
    }

    setDeleteModal(null);
    loadAllData();
  };

  const handleResetData = () => {
    if (window.confirm('Reset seluruh data contoh santri ke kondisi awal?')) {
      santriPortalService.resetSantriData(santriId);
      loadAllData();
      showToast('Data portofolio & test santri berhasil di-reset ke data bawaan.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-800 text-white shadow-xl border border-emerald-600/50 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. HERO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Tahfidz */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Setoran Tahfidz
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {metrics.totalHafalan}
            </span>
            <span className="text-xs text-zinc-500 font-medium">Laporan Tercatat</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Tingkat Kelancaran Mutqin: <strong className="text-emerald-600">{metrics.mutqinRate}%</strong>
          </p>
        </div>

        {/* Metric 2: STEM */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              Proyek STEM Santri
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {metrics.totalStem}
            </span>
            <span className="text-xs text-zinc-500 font-medium">Proyek / Tugas</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Status Selesai: <strong className="text-sky-600">{metrics.stemDoneCount} Proyek</strong>
          </p>
        </div>

        {/* Metric 3: Tests */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Hasil Test & Kuis
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {metrics.avgScore}
            </span>
            <span className="text-xs text-zinc-500 font-medium">/ 100 Rata-Rata</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Total Evaluasi: <strong className="text-purple-600">{metrics.totalTests} Kuis Lulus</strong>
          </p>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS & ACTION BUTTON */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white tracking-tight">
                Portal Mandiri Santri: {santriName}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Kelola pencatatan setoran hafalan, pengumpulan tugas riset STEM, dan riwayat test santri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset ke data bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Bawaan</span>
            </button>

            {activeTab === 'hafalan' && (
              <button
                type="button"
                onClick={() => {
                  setEditingHafalan(null);
                  setIsHafalanModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Setoran</span>
              </button>
            )}

            {activeTab === 'stem' && (
              <button
                type="button"
                onClick={() => {
                  setEditingStem(null);
                  setIsStemModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Serah Tugas STEM</span>
              </button>
            )}

            {activeTab === 'tests' && (
              <button
                type="button"
                onClick={() => {
                  setEditingTest(null);
                  setIsTestModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Nilai Test</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl w-full sm:w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('hafalan')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'hafalan'
                ? 'bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hafalan Qur'an ({hafalanList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stem')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'stem'
                ? 'bg-white dark:bg-zinc-900 text-sky-800 dark:text-sky-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Tugas STEM ({stemList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-white dark:bg-zinc-900 text-purple-800 dark:text-purple-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Nilai Test / Kuis ({testList.length})</span>
          </button>
        </div>

        {/* TAB 1: HAFALAN LIST */}
        {activeTab === 'hafalan' && (
          <div className="space-y-3">
            {hafalanList.length === 0 ? (
              <div className="text-center py-10 text-zinc-400">
                <BookOpen className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-bold">Belum ada catatan setoran hafalan.</p>
                <p className="text-[11px] mt-1">Klik "+ Catat Setoran" untuk memulai rekaman hafalan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hafalanList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                          Juz {item.juz}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              item.setoranType === 'ziyadah'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : item.setoranType === 'simakan'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {item.setoranType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              item.fluencyStatus === 'mutqin'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300'
                                : item.fluencyStatus === 'jayyid'
                                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-300'
                                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300'
                            }`}
                          >
                            ● {item.fluencyStatus}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                        Surah {item.surah}
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                        {item.ayatRange}
                      </p>

                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 italic bg-white/60 dark:bg-zinc-900/60 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                        "{item.ustadzNotes}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingHafalan(item);
                            setIsHafalanModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                          title="Edit setoran"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              type: 'hafalan',
                              id: item.id,
                              title: `Setoran Surah ${item.surah} (${item.ayatRange})`,
                            })
                          }
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Hapus setoran"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STEM LIST */}
        {activeTab === 'stem' && (
          <div className="space-y-3">
            {stemList.length === 0 ? (
              <div className="text-center py-10 text-zinc-400">
                <Cpu className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-bold">Belum ada tugas STEM diserahkan.</p>
                <p className="text-[11px] mt-1">Klik "+ Serah Tugas STEM" untuk mengunggah laporan proyek.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stemList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 hover:border-sky-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 uppercase">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            item.status === 'selesai'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.status === 'diserahkan'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : item.status === 'revisi'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          ● {item.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                        {item.progressNotes}
                      </p>

                      {item.projectLink && (
                        <a
                          href={item.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-400 hover:underline mt-2.5 break-all"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">Tautan Proyek / Demo</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{item.submissionDate}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStem(item);
                            setIsStemModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors cursor-pointer"
                          title="Edit tugas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              type: 'stem',
                              id: item.id,
                              title: item.title,
                            })
                          }
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Hapus tugas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TESTS LIST */}
        {activeTab === 'tests' && (
          <div className="space-y-3">
            {testList.length === 0 ? (
              <div className="text-center py-10 text-zinc-400">
                <GraduationCap className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-bold">Belum ada rekaman nilai test / kuis.</p>
                <p className="text-[11px] mt-1">Klik "+ Catat Nilai Test" untuk memasukkan capaian ujian santri.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 hover:border-purple-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 uppercase">
                          {item.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              item.status === 'lulus'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {item.status === 'lulus' ? 'LULUS' : 'REMIDI'}
                          </span>
                          <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-zinc-900 text-amber-300 dark:bg-zinc-950">
                            {item.score}/100
                          </span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                        {item.testTitle}
                      </h4>

                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 bg-white/60 dark:bg-zinc-900/60 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800 leading-relaxed">
                        <strong className="text-zinc-700 dark:text-zinc-300">Catatan Refleksi: </strong>
                        {item.reflection}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{item.testDate}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTest(item);
                            setIsTestModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                          title="Edit catatan nilai"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              type: 'test',
                              id: item.id,
                              title: item.testTitle,
                            })
                          }
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Hapus nilai test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL 1: HAFALAN (CREATE / EDIT) ================= */}
      {isHafalanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                  {editingHafalan ? 'Edit Laporan Setoran Hafalan' : 'Catat Setoran Hafalan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHafalanModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHafalan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Nama Surah:</label>
                  <input
                    name="surah"
                    type="text"
                    required
                    placeholder="Contoh: Al-Kahfi"
                    defaultValue={editingHafalan?.surah || ''}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Juz (1 - 30):</label>
                  <input
                    name="juz"
                    type="number"
                    min="1"
                    max="30"
                    required
                    defaultValue={editingHafalan?.juz || 1}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Rentang Ayat:</label>
                <input
                  name="ayatRange"
                  type="text"
                  required
                  placeholder="Contoh: Ayat 1 - 25"
                  defaultValue={editingHafalan?.ayatRange || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Jenis Setoran:</label>
                  <select
                    name="setoranType"
                    defaultValue={editingHafalan?.setoranType || 'ziyadah'}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  >
                    <option value="ziyadah">Ziyadah (Hafalan Baru)</option>
                    <option value="murojaah">Murojaah (Pengulangan)</option>
                    <option value="simakan">Simakan Akbar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Status Kelancaran:</label>
                  <select
                    name="fluencyStatus"
                    defaultValue={editingHafalan?.fluencyStatus || 'mutqin'}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  >
                    <option value="mutqin">Mutqin (Sangat Lancar)</option>
                    <option value="jayyid">Jayyid (Cukup Lancar)</option>
                    <option value="dhoif">Dho'if (Perlu Ditingkatkan)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Tanggal Setoran:</label>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={editingHafalan?.date || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Catatan Ustadz / Mandiri:</label>
                <textarea
                  name="ustadzNotes"
                  rows={3}
                  placeholder="Catatan makhraj, tajwid, atau waqaf..."
                  defaultValue={editingHafalan?.ustadzNotes || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsHafalanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-sm"
                >
                  {editingHafalan ? 'Simpan Perubahan' : 'Catat Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: STEM (CREATE / EDIT) ================= */}
      {isStemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-600" />
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                  {editingStem ? 'Edit Penyerahan Tugas STEM' : 'Serahkan Laporan Tugas STEM Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsStemModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStem} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Judul Proyek / Tugas:</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Rancang Bangun IoT Pengendali Suhu Asrama"
                  defaultValue={editingStem?.title || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Kategori Sains:</label>
                  <select
                    name="category"
                    defaultValue={editingStem?.category || 'iot'}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  >
                    <option value="iot">Internet of Things (IoT)</option>
                    <option value="robotika">Robotika & Otomasi</option>
                    <option value="coding">Coding & Software</option>
                    <option value="hidroponik">Hidroponik & Lingkungan</option>
                    <option value="sains">Fisika & Kimia Terapan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Status Tugas:</label>
                  <select
                    name="status"
                    defaultValue={editingStem?.status || 'diserahkan'}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  >
                    <option value="draft">Draft (Belum Diserahkan)</option>
                    <option value="diserahkan">Diserahkan (Menunggu Nilai)</option>
                    <option value="revisi">Revisi Diperlukan</option>
                    <option value="selesai">Selesai / Lulus</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Tautan Proyek / GitHub / Dokumen PDF:</label>
                <input
                  name="projectLink"
                  type="url"
                  placeholder="https://github.com/... atau https://drive.google.com/..."
                  defaultValue={editingStem?.projectLink || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Tanggal Serah:</label>
                <input
                  name="submissionDate"
                  type="date"
                  required
                  defaultValue={editingStem?.submissionDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Catatan Progres / Hasil Pengujian:</label>
                <textarea
                  name="progressNotes"
                  rows={3}
                  placeholder="Uraikan kemajuan perakitan alat, kendala sensor, atau hasil eksperimen..."
                  defaultValue={editingStem?.progressNotes || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsStemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold cursor-pointer shadow-sm"
                >
                  {editingStem ? 'Simpan Perubahan' : 'Serahkan Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: TESTS (CREATE / EDIT) ================= */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                  {editingTest ? 'Edit Catatan Hasil Test' : 'Catat Capaian Nilai Test Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Nama Ujian / Kuis:</label>
                <input
                  name="testTitle"
                  type="text"
                  required
                  placeholder="Contoh: Kuis Mandarin HSK 1 - Kosakata Sapaan"
                  defaultValue={editingTest?.testTitle || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Kategori Pelajaran:</label>
                  <select
                    name="category"
                    defaultValue={editingTest?.category || 'mandarin'}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                  >
                    <option value="mandarin">Bahasa Mandarin</option>
                    <option value="tahfidz">Tahfidz & Tajwid Qur'an</option>
                    <option value="diniyah">Diniyah Salafiyah (Kitab)</option>
                    <option value="stem">STEM & Riset Robotika</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Nilai / Skor (0 - 100):</label>
                  <input
                    name="score"
                    type="number"
                    min="0"
                    max="100"
                    required
                    defaultValue={editingTest?.score ?? 85}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Tanggal Pelaksanaan Test:</label>
                <input
                  name="testDate"
                  type="date"
                  required
                  defaultValue={editingTest?.testDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Refleksi Mandiri Santri:</label>
                <textarea
                  name="reflection"
                  rows={3}
                  placeholder="Catatan materi yang sudah dikuasai dan yang butuh penguatan..."
                  defaultValue={editingTest?.reflection || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer shadow-sm"
                >
                  {editingTest ? 'Simpan Perubahan' : 'Catat Nilai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: DELETE CONFIRMATION ================= */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-black text-sm text-zinc-900 dark:text-white">
                Hapus Data Laporan?
              </h4>
              <p className="text-xs text-zinc-500 mt-1">
                Apakah Anda yakin ingin menghapus data <strong>"{deleteModal.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
