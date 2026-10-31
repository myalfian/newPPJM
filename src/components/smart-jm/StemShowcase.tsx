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
  X,
  User,
  Tag,
  Eye
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
  },
  {
    id: 'p4',
    slug: 'smart-greenhouse-iot',
    title: 'Smart Greenhouse Pengendali Suhu & Kelembaban Kandang Hidroponik',
    category: 'Internet of Things (IoT) & Agrikultur',
    description: 'Silabus modul dan penugasan santri untuk merakit sistem kontrol mikroklimat otomatis pada miniatur rumah kaca menggunakan kipas DC, mist maker, dan mikrokontroler terprogram.',
    specs: {
      'Mikrokontroler': 'ESP8266 Wi-Fi Modul',
      'Sensor Suhu': 'DHT22 Digital Temperature & Humidity',
      'Aktuator': 'Relay 4-Channel 5V + Exhaust Fan DC 12V',
      'Indikator Display': 'OLED 0.96 inch I2C'
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    is_portfolio: false,
    author_santri: 'Ustadz Pembina Lab STEM & Santri Kelas IX'
  },
  {
    id: 'p5',
    slug: 'solar-tracker-santri',
    title: 'Solar Tracker Dua Sumbu Pembangkit Listrik Pesantren',
    category: 'Energi Terbarukan',
    description: 'Karya inovasi teknologi ramah lingkungan oleh santri aliyah berupa panel surya yang mampu bergerak otomatis mengikuti arah datangnya sinar matahari untuk efisiensi daya.',
    specs: {
      'Motor Penggerak': 'Dual Servo SG90 Metal Gear',
      'Sensor Cahaya': '4x LDR Light Dependent Resistor',
      'Output Listrik': 'Charging Station Powerbank Santri',
      'Peningkatan Daya': '32% lebih optimal dibanding panel statis'
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    is_portfolio: true,
    author_santri: 'Muhammad Hilmi & Tim Riset Energi PPJM'
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

export const StemShowcase: React.FC<StemShowcaseProps> = ({ mode, projects }) => {
  const { data: cachedProjects } = useCachedQuery<StemProject[]>(
    'stem_projects_list',
    fetchStemProjects,
    DEFAULT_PROJECTS
  );

  const activeProjects = projects || cachedProjects;
  const [selectedProject, setSelectedProject] = useState<StemProject | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [santriName, setSantriName] = useState('');
  const [santriClass, setSantriClass] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [reportFileUrl, setReportFileUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith('image/')) {
      setCompressing(true);
      try {
        const res = await compressImageToWebP(file, 1200, 1200, 0.82);
        setCompressionResult(res);
        setReportFileUrl(res.dataUrl);
      } catch (err: any) {
        alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak didukung'));
      } finally {
        setCompressing(false);
      }
    } else {
      setReportFileUrl(file.name);
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
            onClick={() => setSelectedProject(project)}
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
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 p-5 sm:p-7 space-y-5">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm font-bold text-gold-600 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
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
                onClick={() => setSelectedProject(null)}
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

            {/* Narasi & Deskripsi Lengkap Proyek */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider">
                {mode === 'materi' ? 'Uraian Materi & Panduan Praktikum:' : 'Latar Belakang Riset Siswa:'}
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

            {/* Tombol Unduh Silabus & Lembar Tugas */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={selectedProject.syllabus_url}
                onClick={(e) => { e.preventDefault(); alert('Mengunduh Silabus Modul STEM PDF...'); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-800" />
                <span>Unduh PDF Silabus & Materi</span>
              </a>
              <a
                href={selectedProject.assignment_doc_url}
                onClick={(e) => { e.preventDefault(); alert('Mengunduh Lembar Tugas Praktikum PDF...'); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gold-900 bg-gold-100 hover:bg-gold-200 transition-colors"
              >
                <FileText className="w-4 h-4 text-gold-800" />
                <span>Unduh Lembar Penugasan Siswa</span>
              </a>
            </div>

            {/* Formulir Upload Tugas Santri Online (Mode Materi) */}
            {mode === 'materi' && (
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Kirim Laporan Penugasan Proyek Santri Online</span>
                </h4>

                {uploadSuccess ? (
                  <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Laporan penugasan berhasil diserahkan kepada Ustadz Pembina STEM!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSimulateSubmit} className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Nama Lengkap Santri..."
                        value={santriName}
                        onChange={(e) => setSantriName(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                      />
                      {compressing && <p className="text-[11px] text-emerald-700 font-bold mt-1">Mengompres foto ke WebP...</p>}
                      {compressionResult && <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10.5px] font-bold">WebP: {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)</div>}
                      <input
                        type="text"
                        required
                        placeholder="Kelas / Jenjang / Kamar..."
                        value={santriClass}
                        onChange={(e) => setSantriClass(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                      />
                      {compressing && <p className="text-[11px] text-emerald-700 font-bold mt-1">Mengompres foto ke WebP...</p>}
                      {compressionResult && <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10.5px] font-bold">WebP: {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)</div>}
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-white">
                      <p className="text-xs text-slate-500">
                        Pilih file dokumen PDF atau foto perakitan alat (Otomatis WebP)
                      </p>
                      <input
                        type="file"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }}
                        className="text-xs text-slate-400 mt-1 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                      />
                      {compressing && <p className="text-[11px] text-emerald-700 font-bold mt-1">Mengompres foto ke WebP...</p>}
                      {compressionResult && <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10.5px] font-bold">WebP: {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)</div>}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all"
                    >
                      Unggah & Kirim Laporan Tugas
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
