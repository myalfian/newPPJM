import React, { useState } from 'react';
import {
  Cpu,
  FileText,
  Upload,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Download,
  X
} from 'lucide-react';
import { StemProject } from '../../lib/supabase';

interface StemShowcaseProps {
  mode: 'materi' | 'portofolio';
  projects?: StemProject[];
}

const DEFAULT_PROJECTS: StemProject[] = [
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
      'Protokol Cloud': 'MQTT Dashboard Pesantren',
      'Efisiensi Air': 'Hemat air hingga 40%'
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
      'Tingkat Kejernihan': 'TDS < 30 ppm (Standar Depkes)',
      'Media Filtrasi': 'Karbon Aktif, Pasir Silika Bangka, Zeolit Malang',
      'Sterilisasi': 'Ultraviolet 11 Watt Chamber'
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
    title: 'Modul Silabus & Penugasan Robotika Line Follower Santri',
    category: 'Robotika & Mekatronika',
    description: 'Silabus terstruktur kurikulum semester gasal untuk santri jenjang wustho: pengenalan logika pemrograman C++, pembacaan array sensor fotodioda, dan tuning algoritma kendali PID.',
    specs: {
      'Platform': 'Arduino Nano / Uno R3',
      'Sensor': '8-Channel IR Sensor Array',
      'Driver Motor': 'L298N Dual H-Bridge',
      'Target Kompetisi': 'Olimpiade Robotika Santri Jatim'
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    is_portfolio: false,
    author_santri: 'Laboratorium STEM Jauharul Maknuun'
  }
];

export const StemShowcase: React.FC<StemShowcaseProps> = ({ mode, projects = DEFAULT_PROJECTS }) => {
  const [selectedProject, setSelectedProject] = useState<StemProject | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [santriName, setSantriName] = useState('');
  const [santriClass, setSantriClass] = useState('');

  const displayList = mode === 'portofolio' 
    ? projects.filter(p => p.is_portfolio) 
    : projects;

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>{mode === 'materi' ? 'Silabus & Penugasan STEM' : 'Portofolio Riset Santri'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {mode === 'materi' ? 'Laboratorium STEM: Materi & Tugas' : 'Showcase Inovasi & Portofolio Siswa'}
            </h2>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              {mode === 'materi' 
                ? 'Akses materi silabus, panduan modul praktikum, dan formulir pengumpulan laporan tugas sains santri secara digital.'
                : 'Kompilasi hasil karya riset teknologi, rekayasa mekatronika, dan inovasi sains terapan yang diciptakan oleh para santri PPJM.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md text-gold-300 text-xs font-bold">
                {project.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>{mode === 'materi' ? 'Buka Silabus & Tugas' : 'Lihat Spesifikasi'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal Dialog */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
                  {selectedProject.title}
                </h3>
                {selectedProject.author_santri && (
                  <p className="text-xs text-slate-500 mt-1">
                    Karya: <strong>{selectedProject.author_santri}</strong>
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Spesifikasi / Spek Teknis */}
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

            {/* Tombol Unduh Silabus & Tugas */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={selectedProject.syllabus_url}
                onClick={(e) => { e.preventDefault(); alert('Mengunduh Silabus Modul STEM PDF...'); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-800" />
                <span>Unduh PDF Silabus Panduan</span>
              </a>
              <a
                href={selectedProject.assignment_doc_url}
                onClick={(e) => { e.preventDefault(); alert('Mengunduh Lembar Tugas Praktikum PDF...'); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gold-900 bg-gold-100 hover:bg-gold-200 transition-colors"
              >
                <FileText className="w-4 h-4 text-gold-800" />
                <span>Unduh Lembar Tugas Santri</span>
              </a>
            </div>

            {/* Form Upload Tugas Santri (Bila mode materi) */}
            {mode === 'materi' && (
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Kirim Laporan Tugas Santri Online</span>
                </h4>

                {uploadSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                    <span>Laporan tugas berhasil dikirimkan ke Ustadz Pembina STEM!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSimulateSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Nama Lengkap Santri..."
                        value={santriName}
                        onChange={(e) => setSantriName(e.target.value)}
                        className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Kelas / Asrama..."
                        value={santriClass}
                        onChange={(e) => setSantriClass(e.target.value)}
                        className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-white">
                      <p className="text-xs text-slate-500">
                        Pilih file dokumen PDF / foto hasil karya santri (Maks. 10MB)
                      </p>
                      <input type="file" className="text-xs text-slate-400 mt-1 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700" />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                    >
                      Unggah & Serahkan Tugas
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
