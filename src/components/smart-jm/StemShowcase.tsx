import React, { useState } from 'react';
import {
  Cpu,
  FileText,
  CheckCircle,
  ChevronRight,
  Layers,
  Download,
  X,
  User,
  Tag,
  Eye,
  BookOpen,
  FileCheck,
  BarChart3,
  CloudUpload
} from 'lucide-react';
import { StemProject, supabase } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

interface StemShowcaseProps {
  mode: 'materi' | 'portofolio';
  projects?: StemProject[];
}

const DEFAULT_PROJECTS: StemProject[] = [
  {
    id: 'p-hydrolift',
    slug: 'hydrolift-hukum-pascal',
    title: 'LKPD STEM • HYDROLIFT: Alat Pengangkat Berbasis Tekanan Hukum Pascal',
    category: 'Fisika Tekanan Fluida (IPA Kelas VIII)',
    description: 'Rancang dan buat alat pengangkat sederhana berbasis tekanan hidrolik yang mampu mengangkat beban menggunakan sistem 2–4 spuit, selang air, dan rangka kardus/stik melalui tahapan Engineering Design Process (EDP).',
    specs: {
      'Pengampu': 'Ustadzah Ria & Ustadzah Anggun',
      'Jenjang Kelas': 'IPA Kelas VIII SMP Plus JM',
      'Model Belajar': 'PjBL - Engineering Design Process (EDP)',
      'Alat Utama': '2–4 Spuit, Selang, Air, Kardus/Stik, Lem',
      'Pengujian': '3 Percobaan Variasi Massa Beban & Iterasi'
    },
    syllabus_url: 'https://youtu.be/LjSuHty6xTg?si=qTXhw-jYnuxX87Iv',
    assignment_doc_url: '/docs/stem/LKPD_STEM_Hydrolift_Hukum_Pascal_Kelas_8.docx',
    cover_image: '/images/stem/hydrolift_foto_display_topik.jpg',
    is_portfolio: true,
    author_santri: 'Tim Riset Santriwati Kelas VIII (Pembina: Us. Ria & Us. Anggun)'
  },
  {
    id: 'p-roket-air',
    slug: 'roket-air-hukum-iii-newton',
    title: 'LKPD STEM • Merancang Roket Air & Hukum III Newton (Kelas VII)',
    category: 'Fisika Gaya & Gerak (IPA Kelas VII)',
    description: 'Merancang, membuat, dan menguji roket air dari botol PET 1,5 L yang dapat terbang setinggi atau sejauh mungkin dan meluncur stabil berdasarkan pasangan gaya aksi–reaksi Hukum III Newton.',
    specs: {
      'Pengampu': 'Ustadzah Ria & Ustadzah Anggun',
      'Jenjang Kelas': 'IPA Kelas VII SMP Plus JM',
      'Alokasi Waktu': '2 Pertemuan (@ 2 × 40 Menit)',
      'Alat Utama': 'Botol PET 1,5 L, Karton Sirip & Hidung, Pompa Peluncur',
      'Pengujian': '3 Percobaan per Variabel & Grafik Millimeter Block'
    },
    syllabus_url: 'https://youtu.be/cY8cBMl_-94?si=EY7KhIj7EZG8XcoP',
    assignment_doc_url: '/docs/stem/LKPD_STEM_Roket_Air_Hukum_III_Newton_Kelas_7.docx',
    cover_image: '/images/stem/roket_air_foto_display_topik.webp',
    is_portfolio: true,
    author_santri: 'Tim Rekayasa Muda Kelas VII (Pembina: Us. Ria & Us. Anggun)'
  }
];

const fetchStemProjects = async (): Promise<StemProject[]> => {
  try {
    const { data, error } = await supabase
      .from('stem_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_PROJECTS;
    }

    return data.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      description: item.description,
      specs: (item.specs as Record<string, any>) || undefined,
      syllabus_url: item.syllabus_url || undefined,
      assignment_doc_url: item.assignment_doc_url || undefined,
      cover_image: item.cover_image || undefined,
      is_portfolio: Boolean(item.is_portfolio),
      author_santri: item.author_santri || undefined,
    }));
  } catch {
    return DEFAULT_PROJECTS;
  }
};

type TabKey = 'materi' | 'lkpd' | 'rubrik' | 'unggah';

const TAB_LABELS: Record<TabKey, { label: string; icon: React.ElementType }> = {
  materi: { label: 'Materi', icon: BookOpen },
  lkpd: { label: 'LKPD', icon: FileCheck },
  rubrik: { label: 'Rubrik Penilaian', icon: BarChart3 },
  unggah: { label: 'Unggah Proyek', icon: CloudUpload },
};

export const StemShowcase: React.FC<StemShowcaseProps> = ({ mode, projects }) => {
  const { data: cachedProjects } = useCachedQuery<StemProject[]>(
    'stem_projects_list',
    fetchStemProjects,
    DEFAULT_PROJECTS
  );

  const activeProjects = projects || cachedProjects;
  const [selectedProject, setSelectedProject] = useState<StemProject | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('materi');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [santriName, setSantriName] = useState('');
  const [santriClass, setSantriClass] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith('image/')) {
      setCompressing(true);
      try {
        const res = await compressImageToWebP(file, 1200, 1200, 0.82);
        setCompressionResult(res);
      } catch (err: any) {
        alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak didukung'));
      } finally {
        setCompressing(false);
      }
    }
  };

  const displayList = mode === 'portofolio'
    ? activeProjects.filter(p => p.is_portfolio)
    : activeProjects;

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!santriName || !santriClass) return;
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setSantriName('');
      setSantriClass('');
      setSelectedProject(null);
    }, 2500);
  };

  const closeDetail = () => {
    setSelectedProject(null);
    setActiveTab('materi');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-3 sm:p-4 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>{mode === 'materi' ? 'Silabus & Penugasan STEM' : 'Portofolio Riset Santri'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {mode === 'materi' ? 'Laboratorium STEM: Materi & Penugasan Proyek' : 'Portofolio Karya & Inovasi Sains Siswa'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
            {mode === 'materi'
              ? 'Pilih salah satu card proyek di bawah untuk membuka modul panduan materi lengkap, silabus, dan lembar penugasan santri.'
              : 'Eksplorasi karya inovasi teknologi terapan, robotika mekatronika, dan sains lingkungan yang diciptakan langsung oleh para santri.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-900/70 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-gold-300 font-bold self-start sm:self-center">
          <Tag className="w-4 h-4 text-gold-400" />
          <span>{displayList.length} Proyek {mode === 'materi' ? 'Tersedia' : 'Santri'}</span>
        </div>
      </div>

      {/* Grid of Projects: Section Card "Gambar dan Nama Project" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {displayList.map((project) => (
          <div
            key={project.id}
            onClick={() => { setSelectedProject(project); setActiveTab('materi'); }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Gambar Project */}
              <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-gold-300 text-[10.5px] font-extrabold border border-gold-400/30">
                  {project.category}
                </span>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                    <Eye className="w-3.5 h-3.5 text-gold-400" />
                    <span>Klik untuk Detail</span>
                  </span>
                  {project.author_santri && (
                    <span className="truncate max-w-[140px] text-emerald-200">
                      {project.author_santri}
                    </span>
                  )}
                </div>
              </div>

              {/* Nama Project & Deskripsi Ringkas */}
              <div className="p-4 sm:p-5 space-y-2">
                <div className="text-xs sm:text-sm font-black text-emerald-800 uppercase tracking-wider">
                  {mode === 'materi' ? 'Modul Silabus & Tugas' : 'Karya Inovasi Siswa'}
                </div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-extrabold text-emerald-800 group-hover:text-emerald-950">
                <span>{mode === 'materi' ? 'Buka Materi & Penugasan' : 'Lihat Detail Portofolio'}</span>
                <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform text-gold-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal Dialog Saat Card Project Diklik */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={closeDetail}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto z-10">
            {/* Tab Navigation Bar */}
            <div className="flex border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur-md z-10">
              {Object.entries(TAB_LABELS).map(([key, tab]) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key as TabKey)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                      isActive
                        ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-7 overflow-y-auto max-h-[calc(92vh-60px)]">
              {/* Tab: Materi */}
              {activeTab === 'materi' && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gold-600 uppercase tracking-wider">
                        {selectedProject.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 line-clamp-2">
                        {selectedProject.title}
                      </h3>
                      {selectedProject.author_santri && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                          <User className="w-4 h-4 text-emerald-700" />
                          <span>Inovator / Tim: <strong className="text-emerald-950 font-bold">{selectedProject.author_santri}</strong></span>
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Gambar Cover Project */}
                  <div className="h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={selectedProject.cover_image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Deskripsi Lengkap Proyek */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Deskripsi & Latar Belakang Proyek:</span>
                    </h4>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed sm:leading-loose font-medium">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Spesifikasi / Spek Teknis Alat */}
                  {selectedProject.specs && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-700" />
                        <span>Spesifikasi & Rincian Teknis Alat:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(selectedProject.specs).map(([key, val]) => (
                          <div key={key} className="bg-white p-2.5 rounded-xl border border-emerald-100/60">
                            <div className="text-slate-400 font-semibold">{key}</div>
                            <div className="text-emerald-950 font-bold">{String(val)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: LKPD */}
              {activeTab === 'lkpd' && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gold-600 uppercase tracking-wider">
                        Lembar Kerja Peserta Didik
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 line-clamp-2">
                        {selectedProject.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-amber-700" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Unduh LKPD {selectedProject.title}</h4>
                          <p className="text-xs text-slate-600">
                            Lembar Kerja Peserta Didik lengkap dengan langkah-langkah praktikum dan catatan pembimbing.
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedProject.assignment_doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-sm shadow-sm shadow-amber-200 transition-all"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Unduh Dokumen LKPD
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                        Isi LKPD yang Tersedia:
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Instruksi praktikum dan langkah-langkah pembuatan alat</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Tabel pengamatan dan catatan hasil percobaan</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Analisis data & kesimpulan praktikum</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Tugas rifle & evaluasi pemahaman konsep</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <a
                        href={selectedProject.syllabus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                      >
                        <Download className="w-4 h-4 text-emerald-800" />
                        <span>Unduh PDF Silabus & Materi</span>
                      </a>
                      <a
                        href={selectedProject.assignment_doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gold-900 bg-gold-100 hover:bg-gold-200 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gold-800" />
                        <span>Unduh Lembar Penugasan Siswa</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Rubrik Penilaian */}
              {activeTab === 'rubrik' && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gold-600 uppercase tracking-wider">
                        Rubrik Penilaian Proyek STEM
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 line-clamp-2">
                        {selectedProject.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left border border-slate-200 rounded-2xl overflow-hidden">
                      <thead>
                        <tr className="bg-emerald-900 text-white">
                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">No</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Aspek Penilaian</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Bobot</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Deskripsi Kriteria</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Skor Maks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { no: 1, aspek: 'Inovasi & Desain Alat', bobot: '25%', desc: 'Kreativitas dalam merancang alat, keaslian ide, dan keterkaitan dengan konsep sains yang diajarkan.', skor: '25' },
                          { no: 2, aspek: 'Metodologi Percobaan', bobot: '25%', desc: 'Kesesuaian langkah Engineering Design Process (EDP), variabel yang dikontrol, dan pengujian berulang.', skor: '25' },
                          { no: 3, aspek: 'Hasil Pengujian Alat', bobot: '25%', desc: 'Fungsionalitas alat sesuai target, kestabilan performa, dan bukti dokumentasi percobaan.', skor: '25' },
                          { no: 4, aspek: 'Presentasi & Dokumentasi', bobot: '25%', desc: 'Kualitas presentasi hasil kerja, kejelasan penjelasan, dan kelengkapan laporan praktikum.', skor: '25' },
                        ].map((row) => (
                          <tr key={row.no} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-xs font-bold text-emerald-900">{row.no}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-slate-900">{row.aspek}</td>
                            <td className="px-4 py-3 text-xs text-slate-600">{row.bobot}</td>
                            <td className="px-4 py-3 text-xs text-slate-700">{row.desc}</td>
                            <td className="px-4 py-3 text-xs font-mono font-bold text-right text-slate-900">{row.skor}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t border-slate-200">
                          <td className="px-4 py-3 text-xs" colSpan={4}>Total Skor</td>
                          <td className="px-4 py-3 text-xs font-mono font-bold text-right text-emerald-900">100</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                      Panduan Penilaian:
                    </h5>
                    <ul className="space-y-1 text-sm text-slate-700 list-disc list-inside">
                      <li>Skor 80–100: Predikat A (Istimewa) – Layak dipamerkan dalam portofolio santri</li>
                      <li>Skor 70–79: Predikat B (Baik) – Memenuhi standar praktikum</li>
                      <li>Skor 60–69: Predikat C (Cukup) – Perlu perbaikan pada dokumentasi</li>
                      <li>Skor di bawah 60: Perlu mengulang praktikum</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab: Unggah Proyek */}
              {activeTab === 'unggah' && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gold-600 uppercase tracking-wider">
                        Kirim Laporan Proyek
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 line-clamp-2">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Unggah dokumen laporan praktikum dan foto perakitan alat untuk dinilai oleh pembina STEM.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {uploadSuccess ? (
                    <div className="p-5 rounded-2xl bg-emerald-100 border border-emerald-200 text-center">
                      <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
                      <h4 className="font-bold text-emerald-900 text-sm sm:text-base">Laporan Berhasil Dikirim!</h4>
                      <p className="text-sm text-emerald-800 mt-1">
                        Laporan penugasan proyek "{selectedProject.title}" telah berhasil diserahkan kepada Ustadz Pembina STEM.
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateSubmit}
                        className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Kirim Laporan Lagi
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSimulateSubmit} className="space-y-4">
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">
                          <User className="w-4 h-4 text-emerald-600 mr-2" />
                          Identitas Pengumpul
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Santri..."
                            value={santriName}
                            onChange={(e) => setSantriName(e.target.value)}
                            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Kelas / Jenjang / Kamar..."
                            value={santriClass}
                            onChange={(e) => setSantriClass(e.target.value)}
                            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">
                          <CloudUpload className="w-4 h-4 text-emerald-600 mr-2" />
                          Berkas Laporan
                        </h4>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-white/50">
                          <p className="text-xs text-slate-500 mb-2">
                            Pilih file dokumen PDF atau foto perakitan alat (Otomatis dikompres ke WebP)
                          </p>
                          {compressing && <p className="text-[11px] text-emerald-700 font-bold mt-1">Mengompres foto ke WebP...</p>}
                          {compressionResult && (
                            <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10.5px] font-bold">
                              WebP: {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)
                            </div>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }}
                            className="text-xs text-slate-400 mt-2 block w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <button
                          type="button"
                          onClick={closeDetail}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={!santriName || !santriClass || compressing}
                          className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                            (!santriName || !santriClass || compressing)
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-200'
                          }`}
                        >
                          {compressing ? 'Mengupload…' : 'Unggah & Kirim Laporan'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
