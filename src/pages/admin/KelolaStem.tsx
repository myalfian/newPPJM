import React, { useState, useEffect } from 'react';
import {
  Cpu,
  PlusCircle,
  CheckCircle2,
  FileText,
  Upload,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  Download,
  Eye,
  Layers,
  X,
  Sliders,
  Award,
  Zap,
  Check,
  Calendar,
  Save
} from 'lucide-react';
import { StemProject, supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

interface WorksheetItem {
  id: string;
  title: string;
  category: string;
  targetSantri: string;
  duration: string;
  components: string[];
  docUrl: string;
  description: string;
}

const INITIAL_WORKSHEETS: WorksheetItem[] = [
  {
    id: 'ws-1',
    title: 'Worksheet IoT ESP32: Otomasi Irigasi & Monitoring Suhu Green-House',
    category: 'Internet of Things (IoT)',
    targetSantri: 'Santri Wustho (Kelas VIII & IX)',
    duration: '4 Pertemuan Praktikum (8 Jam)',
    components: ['ESP32 NodeMCU 38-Pin', 'Capacitive Soil Moisture V2.0', 'Relay 5V 1-Channel', 'Pompa Mini 5V', 'Kabel Jumper'],
    docUrl: '#unduh-lembar-kerja-esp32',
    description: 'Panduan step-by-step perakitan sensor kelembaban tanah, penulisan script Arduino C++, dan pengiriman data telemetry via protokol MQTT ke dashboard lokal.'
  },
  {
    id: 'ws-2',
    title: 'Worksheet Nanofiltrasi Karbon Aktif Kelapa Sawit Air Payau Sidayu',
    category: 'Sains Lingkungan & Kimia Terapan',
    targetSantri: 'Santri Takhassus Riset Sains',
    duration: '3 Pertemuan Riset (6 Jam)',
    components: ['Tabung Kolom Akrilik 50cm', 'Zeolit Alam Teraktivasi', 'Silika Sand Mesh 20-40', 'Karbon Aktif Sawit', 'TDS Meter Digital'],
    docUrl: '#unduh-lembar-kerja-nanofiltrasi',
    description: 'Instruksi eksperimen pemurnian air sumur pesisir Lasem Sidayu dengan pengukuran TDS, pH, dan uji kejernihan air sebelum dan sesudah filtrasi bertingkat.'
  },
  {
    id: 'ws-3',
    title: 'Worksheet Line Follower Robotika: Kalibrasi Sensor IR & Algoritma PID',
    category: 'Robotika & Mekatronika',
    targetSantri: 'Santri Jenjang Awal (Kelas VII)',
    duration: '2 Pertemuan (4 Jam)',
    components: ['Chassis Acrylic 2-Wheel', 'Arduino Uno R3', 'Array IR Sensor 5-Channel', 'Driver Motor L298N', 'Baterai Li-Ion 2S'],
    docUrl: '#unduh-lembar-kerja-linefollower',
    description: 'Eksperimen pembacaan logika biner lintasan hitam-putih dan optimasi konstanta Kp, Ki, Kd untuk manuver robot di tikungan tajam.'
  }
];

const INITIAL_PROJECTS: StemProject[] = [
  {
    id: 'p1',
    slug: 'iot-smart-irrigation',
    title: 'Sistem Otomasi Penyiram Tanaman Hidroponik Berbasis ESP32',
    category: 'Internet of Things (IoT)',
    description: 'Proyek rekayasa sains santri yang memadukan sensor kelembaban kapasitif, modul mikrokontroler ESP32, dan protokol MQTT untuk otomatisasi irigasi kebun hidroponik pesantren secara presisi.',
    specs: {
      'Mikrokontroler': 'ESP32 NodeMCU 38-Pin',
      'Sensor': 'Capacitive Soil Moisture V2.0',
      'Sumber Daya': 'Solar Panel 20W + Baterai Li-Ion 18650',
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    is_portfolio: true,
    author_santri: 'Ahmad Zaki & Tim Robotika Santri PPJM'
  },
  {
    id: 'p2',
    slug: 'smart-water-filtration',
    title: 'Purifier Air Minum Nanofiltrasi Karbon Aktif Kelapa Sawit',
    category: 'Sains Lingkungan & Kimia Terapan',
    description: 'Penelitian santri dalam memurnikan sumber air sumur payau kawasan pesisir Sidayu menjadi air layak konsumsi dengan multi-stage filter zeolit, silika, dan karbon aktif bersanad ramah lingkungan.',
    specs: {
      'Kapasitas Aliran': '50 Liter / Jam',
      'Tingkat Kejernihan': 'TDS < 30 ppm',
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    is_portfolio: true,
    author_santri: 'Farhan Maulana & Muhammad Iqbal'
  },
  {
    id: 'p3',
    slug: 'line-follower-robotics',
    title: 'Robot Line Follower Berbasis Kendali Logika PID Sensor Array',
    category: 'Robotika & Mekatronika',
    description: 'Rancang bangun mobil otonom navigasi garis lintasan dengan responsifitas tinggi untuk kompetisi festival sains teknologi santri se-Jawa Timur.',
    specs: {
      'Platform': 'Arduino Nano / Uno R3',
      'Sensor': '8-Channel IR Sensor Array',
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    is_portfolio: true,
    author_santri: 'Hilman Abdullah & Fajar Shodiq'
  }
];

export const KelolaStem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worksheet' | 'rubrik' | 'portofolio'>('worksheet');
  const [projects, setProjects] = useState<StemProject[]>(INITIAL_PROJECTS);
  const [worksheets, setWorksheets] = useState<WorksheetItem[]>(INITIAL_WORKSHEETS);
  const [search, setSearch] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  // Rubrik Penilaian 4 Parameter State
  const [santriName, setSantriName] = useState('Ahmad Zaki Al-Faruq (Kelas IX-A)');
  const [projectName, setProjectName] = useState('Sistem Otomasi Penyiram Hidroponik ESP32');
  const [scoreInovasi, setScoreInovasi] = useState<number>(95); // 25%
  const [scoreMetode, setScoreMetode] = useState<number>(90); // 25%
  const [scoreUji, setScoreUji] = useState<number>(92); // 25%
  const [scorePresentasi, setScorePresentasi] = useState<number>(88); // 25%
  const [teacherEvaluationNotes, setTeacherEvaluationNotes] = useState(
    'Alhamdulillah, prototipe berfungsi sangat stabil. Kalibrasi sensor kapasitif tepat dan dokumentasi wiring rapi.'
  );

  // Portofolio Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Internet of Things (IoT)');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [specsText, setSpecsText] = useState('Mikrokontroler: ESP32\nSensor: Digital Sensor\nEfisiensi: Tinggi');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculate Weighted Total Score
  const totalScore = Math.round(
    scoreInovasi * 0.25 + scoreMetode * 0.25 + scoreUji * 0.25 + scorePresentasi * 0.25
  );

  const getPredicate = (score: number) => {
    if (score >= 90) return { label: 'Mumtaz (Sangat Memuaskan)', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40' };
    if (score >= 80) return { label: 'Jayyid Jiddan (Baik Sekali)', color: 'text-sky-400 bg-sky-950/80 border-sky-500/40' };
    if (score >= 70) return { label: 'Jayyid (Cukup Baik)', color: 'text-amber-400 bg-amber-950/80 border-amber-500/40' };
    return { label: 'Maqbul / Perlu Bimbingan', color: 'text-rose-400 bg-rose-950/80 border-rose-500/40' };
  };

  const predicate = getPredicate(totalScore);

  const handleSaveRubrik = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-sky-950 to-[#0A2116] text-white shadow-xl border border-sky-500/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-sky-400 text-xs font-bold border border-sky-500/40">
            <Cpu className="w-3.5 h-3.5" />
            <span>Laboratorium Riset &amp; Inovasi Teknologi Santri</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Kelola Modul STEM, Rubrik 4 Param &amp; Portofolio
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-3xl leading-relaxed">
            Pusat pengelolaan silabus worksheet eksperimen (IoT ESP32 Hidroponik &amp; Nanofiltrasi), rubrik penilaian terstandarisasi 4 parameter, serta galeri showcase karya ilmiah santri.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-200 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-sky-400" />
          <span>Alhamdulillah, lembar penilaian riset STEM berhasil disimpan ke portofolio santri!</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('worksheet')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'worksheet'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Worksheet Proyek Riset</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rubrik')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'rubrik'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. Rubrik Penilaian 4 Param</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portofolio')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'portofolio'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Galeri Portofolio Santri</span>
        </button>
      </div>

      {/* TAB 1: WORKSHEET PROYEK RISET */}
      {activeTab === 'worksheet' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                Daftar Worksheet Panduan Praktikum Sains &amp; Rekayasa
              </h3>
              <p className="text-xs text-zinc-400">
                Silabus penugasan laboratorium dengan daftar komponen dan langkah kerja mandiri santri
              </p>
            </div>
            <span className="text-xs font-bold text-sky-500 bg-sky-950/40 border border-sky-500/30 px-3 py-1 rounded-lg">
              {worksheets.length} Modul Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {worksheets.map((ws) => (
              <div
                key={ws.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    {ws.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                    {ws.title}
                  </h4>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                    <p>🎯 Target: <span className="font-medium text-zinc-700 dark:text-zinc-300">{ws.targetSantri}</span></p>
                    <p>⏱️ Durasi: <span className="font-medium text-zinc-700 dark:text-zinc-300">{ws.duration}</span></p>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Komponen Praktikum:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ws.components.map((comp, idx) => (
                        <span key={idx} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2">
                    {ws.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => alert(`Mengunduh lembar kerja: ${ws.title}`)}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </button>
                  <span className="text-[10px] text-emerald-500 font-bold">Siap Cetak A4</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RUBRIK PENILAIAN 4 PARAMETER */}
      {activeTab === 'rubrik' && (
        <form onSubmit={handleSaveRubrik} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-6">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h3 className="font-black text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C8A951]" />
              <span>Rubrik Evaluasi Ujian &amp; Proyek Sains Santri (4 Parameter x 25%)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Sistem kalkulasi bobot otomatis terstandarisasi untuk mengukur kecakapan inovasi dan metodologi ilmiah
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Santri / Tim Peneliti:</label>
              <input
                type="text"
                value={santriName}
                onChange={(e) => setSantriName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Judul Karya Proyek Sains:</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* 4 PARAMETER SLIDERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* PARAM 1: Inovasi & Desain (25%) */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white">1. Inovasi &amp; Desain (25%)</h4>
                  <p className="text-[10px] text-zinc-400">Kebaruan ide, kreativitas arsitektur alat &amp; sirkuit</p>
                </div>
                <span className="font-mono text-base font-black text-sky-500">{scoreInovasi}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scoreInovasi}
                onChange={(e) => setScoreInovasi(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* PARAM 2: Metodologi & Eksekusi Sains (25%) */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white">2. Metodologi &amp; Eksekusi (25%)</h4>
                  <p className="text-[10px] text-zinc-400">Kerapian coding C++, soldering &amp; kalibrasi sensor</p>
                </div>
                <span className="font-mono text-base font-black text-emerald-500">{scoreMetode}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scoreMetode}
                onChange={(e) => setScoreMetode(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* PARAM 3: Hasil Pengujian & Analisis Data (25%) */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white">3. Hasil Uji &amp; Analisis (25%)</h4>
                  <p className="text-[10px] text-zinc-400">Akurasi pembacaan data telemetry, stabilitas alat</p>
                </div>
                <span className="font-mono text-base font-black text-[#C8A951]">{scoreUji}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scoreUji}
                onChange={(e) => setScoreUji(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* PARAM 4: Presentasi & Dokumentasi Teknis (25%) */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white">4. Presentasi &amp; Laporan (25%)</h4>
                  <p className="text-[10px] text-zinc-400">Kemampuan retorika santri, slide &amp; etika ilmiah</p>
                </div>
                <span className="font-mono text-base font-black text-purple-500">{scorePresentasi}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scorePresentasi}
                onChange={(e) => setScorePresentasi(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* TOTAL SCORE & PREDICATE RESULT BADGE */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A2116] to-[#0d3322] border border-[#0E7A4C]/50 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-zinc-400 font-mono">Total Nilai Kumulatif:</span>
              <div className="text-3xl font-black text-[#C8A951]">{totalScore} / 100</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block mb-1">Predikat Kelulusan Proyek:</span>
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${predicate.color}`}>
                {predicate.label}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Catatan &amp; Rekomendasi Guru Pembina Lab STEM:</label>
            <textarea
              rows={3}
              value={teacherEvaluationNotes}
              onChange={(e) => setTeacherEvaluationNotes(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Lembar Rubrik Penilaian</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: GALERI PORTOFOLIO SANTRI */}
      {activeTab === 'portofolio' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                Katalog Portofolio Karya Ilmiah Santri PPJM
              </h3>
              <p className="text-xs text-zinc-400">
                Showcase publik inovasi teknologi terverifikasi untuk dipamerkan di pameran sains
              </p>
            </div>
            <span className="text-xs font-bold text-[#0E7A4C] dark:text-emerald-400 bg-[#0E7A4C]/10 border border-[#0E7A4C]/30 px-3 py-1 rounded-lg">
              {projects.length} Portofolio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-zinc-100">
                    <img src={proj.cover_image} alt={proj.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A2116] text-[#C8A951] border border-[#C8A951]/40">
                      {proj.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                      {proj.title}
                    </h4>
                    <p className="text-xs font-bold text-[#0E7A4C] dark:text-emerald-400">
                      Oleh: {proj.author_santri}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Terverifikasi
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Rincian spesifikasi:\n${JSON.stringify(proj.specs, null, 2)}`)}
                    className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Lihat Spek
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
export default KelolaStem;
