import React, { useState, useEffect, useRef } from 'react';
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
  Save,
  Copy,
  ChevronUp,
  ChevronDown,
  Video,
  Filter,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  HelpCircle,
  Maximize2,
  GripVertical
} from 'lucide-react';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

// -------------------------------------------------------------
// INTERFACES & DATA MODELS
// -------------------------------------------------------------

export type StemCategory = 'IoT' | 'Filtrasi' | 'Energi' | 'Robotik';

export interface WorksheetItem {
  id: string;
  title: string;
  category: StemCategory;
  level: 'SMP Kelas 7' | 'SMP Kelas 8' | 'SMP Kelas 9';
  duration: string;
  description: string;
  learningObjectives: string;
  toolsAndMaterials: string[];
  steps: string[];
  illustrationImage?: string;
  pdfFileUrl?: string;
}

export interface RubricLevelDescriptor {
  score: number; // 1, 2, 3, 4
  label: 'Kurang' | 'Cukup' | 'Baik' | 'Sangat Baik';
  description: string;
}

export interface RubricParameter {
  id: string;
  name: string;
  weight: number; // Persentase bobot (misal 25%)
  criteriaDescription: string;
  descriptors: Record<number, string>; // { 1: '...', 2: '...', 3: '...', 4: '...' }
}

export interface StudentPortfolioItem {
  id: string;
  studentName: string;
  studentClass: string;
  projectTitle: string;
  category: StemCategory;
  resultDescription: string;
  photos: string[];
  youtubeUrl?: string;
  status: 'Lolos Uji' | 'Proses' | 'Revisi';
  finalScore: number;
}

// -------------------------------------------------------------
// SEED INITIAL DATA
// -------------------------------------------------------------

const INITIAL_WORKSHEETS: WorksheetItem[] = [
  {
    id: 'ws-1',
    title: 'Otomasi Irigasi Hidroponik ESP32',
    category: 'IoT',
    level: 'SMP Kelas 8',
    duration: '3 Minggu (6 Pertemuan)',
    description: 'Panduan rekayasa sistem otomasi penyiram air dan nutrisi tanaman hidroponik berbasis mikrokontroler ESP32 NodeMCU dengan sensor capacitive soil moisture.',
    learningObjectives: 'Santri mampu merakit sirkuit elektronika daya 5V, membaca nilai analog sensor kelembaban, dan memprogram logika otomasi relay pompa air menggunakan Arduino C++.',
    toolsAndMaterials: [
      'ESP32 NodeMCU 38-Pin CP2102',
      'Sensor Kelembaban Kapasitif V2.0',
      'Modul Relay 5V 1-Channel dengan Optocoupler',
      'Pompa Submersible Mini 5V DC',
      'Selang Silikon 8mm & Kabel Jumper Dupont'
    ],
    steps: [
      'Siapkan papan breadboard dan tancapkan modul ESP32 NodeMCU secara presisi pada alur tengah.',
      'Hubungkan pin VCC dan GND sensor kapasitif ke pin 3.3V dan GND pada ESP32.',
      'Hubungkan pin sinyal analog (AOUT) sensor ke pin GPIO34 (ADC1_CH6) ESP32.',
      'Rangkai modul relay dengan pin kontrol terhubung ke pin GPIO26.',
      'Unggah firmware sketch kalibrasi batas ambang kering (< 1800) dan basah (> 3000) melalui Arduino IDE.',
      'Lakukan pengujian respon pompa saat sensor dimasukkan ke media nutrisi rockwool.'
    ],
    illustrationImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    pdfFileUrl: '#lembar-kerja-esp32.pdf'
  },
  {
    id: 'ws-2',
    title: 'Nanofiltrasi Karbon Aktif Air Payau',
    category: 'Filtrasi',
    level: 'SMP Kelas 9',
    duration: '2 Minggu (4 Pertemuan)',
    description: 'Eksperimen pemurnian sumber air sumur payau di pesisir Lasem Sidayu menjadi air bersih menggunakan tabung kolom multi-stage zeolit dan karbon aktif sawit.',
    learningObjectives: 'Santri memahami prinsip adsorpsi pori mikro karbon aktif, ion exchange zeolit alam, dan pengujian kualitas air berbasis parameter TDS dan pH meter.',
    toolsAndMaterials: [
      'Tabung Kolom Akrilik Diameter 70mm x 50cm',
      'Karbon Aktif Tempurung Kelapa Sawit Mesh 8x30',
      'Pasir Silika Bangka Mesh 20-40',
      'Zeolit Alam Teraktivasi',
      'TDS Meter & Digital pH Meter'
    ],
    steps: [
      'Bilas seluruh media adsorben dengan air demineralisasi hingga air bilasan tidak lagi keruh.',
      'Susun lapisan secara berurutan: spon filter, pasir silika (10 cm), zeolit (10 cm), dan karbon aktif (20 cm).',
      'Ukur nilai TDS dan pH sampel air sumur payau mentah sebelum dialirkan ke kolom filtrasi.',
      'Alirkan air sampel dengan debit gravitasi stabil 20 mL/menit.',
      'Tampung filtrat dan catat penurunan nilai TDS (target < 50 ppm) serta nilai pH (target 6.8 - 7.5).'
    ],
    illustrationImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    pdfFileUrl: '#lembar-kerja-filtrasi.pdf'
  },
  {
    id: 'ws-3',
    title: 'Sistem Monitoring Kualitas Udara MQ-135',
    category: 'Energi',
    level: 'SMP Kelas 8',
    duration: '2 Minggu (4 Pertemuan)',
    description: 'Pendeteksian gas amonia dan konsentrasi CO2 di ruang asrama santri menggunakan sensor gas MQ-135 dan layar OLED 0.96 inch.',
    learningObjectives: 'Memahami cara kalibrasi sensor gas resistif dan menampilkan grafik indeks kualitas udara secara mandiri.',
    toolsAndMaterials: [
      'Arduino Nano ATmega328P',
      'Sensor Gas Udara MQ-135',
      'Display OLED I2C 128x64 Blue',
      'Buzzer Alarm 5V'
    ],
    steps: [
      'Panaskan heater sensor MQ-135 selama 15 menit untuk stabilisasi tahanan load resistor.',
      'Sambungkan pin I2C SDA dan SCL layar OLED ke pin A4 dan A5 Arduino Nano.',
      'Kalibrasi nilai Ro di udara terbuka bebas kontaminasi.',
      'Uji respon buzzer saat sensor mendeteksi asap atau gas terkonsentrasi.'
    ],
    illustrationImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ws-4',
    title: 'Line Follower Robotika Kendali PID',
    category: 'Robotik',
    level: 'SMP Kelas 7',
    duration: '3 Minggu (6 Pertemuan)',
    description: 'Mobil otonom mini pembaca garis lintasan sirkuit menggunakan array photodiode inframerah dan kendali logika proporsional-integral-derivatif.',
    learningObjectives: 'Menerapkan logika biner pembacaan sensor dan rumus kalkulasi konstanta Kp-Ki-Kd pada pergerakan dual motor DC.',
    toolsAndMaterials: [
      'Chassis 2-Wheel Robot Akrilik',
      'Driver Motor Dual H-Bridge L298N',
      'Sensor Array 8-Channel IR TCRT5000',
      'Arduino Uno R3',
      'Baterai Li-Ion 2S 7.4V'
    ],
    steps: [
      'Rakit dudukan sensor array pada bagian paling depan bawah sirkuit chassis.',
      'Hubungkan output motor ke terminal driver L298N dan atur jumper ENA/ENB untuk modulasi PWM.',
      'Tulis algoritma pembobotan error garis dari -4 sampai +4.',
      'Tuning nilai Kp secara bertahap hingga robot melaju mulus di tikungan 90 derajat.'
    ],
    illustrationImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_RUBRICS: RubricParameter[] = [
  {
    id: 'rub-1',
    name: '1. Inovasi & Desain',
    weight: 25,
    criteriaDescription: 'Orisinalitas ide karya, arsitektur tata letak sirkuit/mekanik, serta kesesuaian solusi terhadap masalah nyata di lingkungan pondok.',
    descriptors: {
      1: 'Desain meniru mentah tanpa modifikasi; pemilihan komponen tidak efisien.',
      2: 'Terdapat modifikasi sederhana, namun rancang bangun belum ergonomis atau rapi.',
      3: 'Desain fungsional, tata letak perkabelan rapi, dan memiliki nilai guna praktis.',
      4: 'Sangat orisinal, arsitektur modular elegan, hemat daya, dan siap diimplementasikan luas.'
    }
  },
  {
    id: 'rub-2',
    name: '2. Metodologi',
    weight: 25,
    criteriaDescription: 'Kedisiplinan prosedur eksperimen, ketepatan kalibrasi instrumen, dan kelengkapan catatan logbook data penelitian santri.',
    descriptors: {
      1: 'Langkah kerja tidak sistematis; tidak ada kalibrasi sensor atau instrumen.',
      2: 'Langkah kerja sesuai panduan dasar namun data pengamatan tidak lengkap.',
      3: 'Metodologi terstruktur, kalibrasi instrumen terukur, dan logbook tercatat runut.',
      4: 'Sangat teliti, menerapkan kontrol variabel ketat, replikasi data valid, dan analisis deviasi tepat.'
    }
  },
  {
    id: 'rub-3',
    name: '3. Hasil Pengujian',
    weight: 30,
    criteriaDescription: 'Kestabilan kinerja prototipe alat saat diuji, tingkat akurasi pengukuran sensor, serta efektivitas filtrasi atau kendali otomatis.',
    descriptors: {
      1: 'Prototipe tidak berfungsi atau sering terjadi kegagalan sistem saat pengujian.',
      2: 'Alat berfungsi sebagian dengan fluktuasi error pembacaan sensor cukup tinggi.',
      3: 'Alat bekerja stabil sesuai spesifikasi target; toleransi error < 10%.',
      4: 'Kinerja prototipe sangat handal, respon cepat, akurasi tinggi (error < 3%), dan teruji tahan lama.'
    }
  },
  {
    id: 'rub-4',
    name: '4. Presentasi',
    weight: 20,
    criteriaDescription: 'Kelancaran pemaparan konsep sains, kemampuan menjawab sanggahan teknis asatidz, dan etika santri dalam penyampaian karya.',
    descriptors: {
      1: 'Pemaparan terbata-bata; tidak memahami prinsip dasar kerja komponen yang dipakai.',
      2: 'Mampu menjelaskan fungsi dasar alat namun kurang menguasai analisis data.',
      3: 'Penyampaian jelas, percaya diri, memahami teori sains, dan adab presentasi santun.',
      4: 'Artikulasi sangat prima, visual poster ilmiah menarik, argumentasi kritis, dan percaya diri tinggi.'
    }
  }
];

const INITIAL_PORTFOLIO: StudentPortfolioItem[] = [
  {
    id: 'port-1',
    studentName: 'Ahmad Zaki Al-Maknuuni & Tim',
    studentClass: 'SMP Plus Kelas IX-A',
    projectTitle: 'Sistem Irigasi Tetes Cerdas Kebun Hidroponik Selada ESP32',
    category: 'IoT',
    resultDescription: 'Mampu menghemat penggunaan air nutrisi hingga 42% dengan respon otomatis pompa menyala saat kelembaban rockwool di bawah 40%.',
    photos: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'Lolos Uji',
    finalScore: 94
  },
  {
    id: 'port-2',
    studentName: 'Muhammad Faiz & Farhan Maulana',
    studentClass: 'SMP Plus Kelas IX-B',
    projectTitle: 'Reaktor Nanofiltrasi Karbon Aktif Kelapa Sawit Air Payau',
    category: 'Filtrasi',
    resultDescription: 'Menurunkan kadar TDS air sumur pesisir dari 480 ppm menjadi 34 ppm dengan pH stabil di angka 7.2 (layak pakai santri).',
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Lolos Uji',
    finalScore: 92
  },
  {
    id: 'port-3',
    studentName: 'Hilman Abdullah & Fajar Shodiq',
    studentClass: 'SMP Plus Kelas VIII-A',
    projectTitle: 'Robot Pembersih Lorong Asrama Terkendali Bluetooth & Line Follower',
    category: 'Robotik',
    resultDescription: 'Prototipe mobil roda 4 dengan sapu mikrofiber putar, mampu menavigasi garis koridor asrama secara mandiri.',
    photos: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Proses',
    finalScore: 78
  },
  {
    id: 'port-4',
    studentName: 'Rayhan Arya Pratama',
    studentClass: 'SMP Plus Kelas VIII-B',
    projectTitle: 'Solar Tracker Sederhana Sensor LDR Dual-Axis',
    category: 'Energi',
    resultDescription: 'Panel surya 10W mini yang dapat bergerak mengikuti arah datang cahaya matahari untuk efisiensi pengisian baterai lab.',
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Revisi',
    finalScore: 68
  }
];

// -------------------------------------------------------------
// MAIN COMPONENT: KELOLA STEM PPJM
// -------------------------------------------------------------

export const KelolaStem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worksheet' | 'rubrik' | 'portfolio'>('worksheet');
  
  // Data State
  const [worksheets, setWorksheets] = useState<WorksheetItem[]>(INITIAL_WORKSHEETS);
  const [rubrics, setRubrics] = useState<RubricParameter[]>(INITIAL_RUBRICS);
  const [portfolios, setPortfolios] = useState<StudentPortfolioItem[]>(INITIAL_PORTFOLIO);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchWs, setSearchWs] = useState('');
  const [filterWsCat, setFilterWsCat] = useState<string>('Semua');
  const [filterPortStatus, setFilterPortStatus] = useState<string>('Semua');

  // Worksheet Modal Form State
  const [isWsModalOpen, setIsWsModalOpen] = useState(false);
  const [editingWsId, setEditingWsId] = useState<string | null>(null);
  const [wsTitle, setWsTitle] = useState('');
  const [wsCategory, setWsCategory] = useState<StemCategory>('IoT');
  const [wsLevel, setWsLevel] = useState<'SMP Kelas 7' | 'SMP Kelas 8' | 'SMP Kelas 9'>('SMP Kelas 8');
  const [wsDuration, setWsDuration] = useState('3 Minggu (6 Pertemuan)');
  const [wsDescription, setWsDescription] = useState('');
  const [wsLearningObjectives, setWsLearningObjectives] = useState('');
  const [wsTools, setWsTools] = useState<string[]>(['ESP32 NodeMCU', 'Kabel Jumper']);
  const [wsNewTool, setWsNewTool] = useState('');
  const [wsSteps, setWsSteps] = useState<string[]>([
    'Siapkan komponen di atas meja praktikum lab sains.',
    'Rangkai pin VCC dan GND mikrokontroler.'
  ]);
  const [wsNewStep, setWsNewStep] = useState('');
  const [wsImage, setWsImage] = useState('');
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Worksheet Preview Modal State
  const [previewWs, setPreviewWs] = useState<WorksheetItem | null>(null);

  // Interactive Scoring Calculator State for Tab B
  const [calcScores, setCalcScores] = useState<Record<string, number>>({
    'rub-1': 4,
    'rub-2': 3,
    'rub-3': 4,
    'rub-4': 3
  });

  // Portfolio Modal Form State
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [editingPortId, setEditingPortId] = useState<string | null>(null);
  const [pStudentName, setPStudentName] = useState('');
  const [pStudentClass, setPStudentClass] = useState('SMP Plus Kelas IX-A');
  const [pProjectTitle, setPProjectTitle] = useState('');
  const [pCategory, setPCategory] = useState<StemCategory>('IoT');
  const [pResultDesc, setPResultDesc] = useState('');
  const [pPhotos, setPPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  ]);
  const [pYoutubeUrl, setPYoutubeUrl] = useState('');
  const [pStatus, setPStatus] = useState<'Lolos Uji' | 'Proses' | 'Revisi'>('Lolos Uji');
  const [pFinalScore, setPFinalScore] = useState<number>(90);

  // Lightbox Preview State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // WORKSHEET HANDLERS
  // -------------------------------------------------------------

  const handleOpenAddWs = () => {
    setEditingWsId(null);
    setWsTitle('');
    setWsCategory('IoT');
    setWsLevel('SMP Kelas 8');
    setWsDuration('3 Minggu (6 Pertemuan)');
    setWsDescription('');
    setWsLearningObjectives('');
    setWsTools(['ESP32 NodeMCU', 'Kabel Jumper']);
    setWsSteps(['Siapkan komponen di atas meja praktikum lab sains.']);
    setWsImage('');
    setIsWsModalOpen(true);
  };

  const handleEditWs = (ws: WorksheetItem) => {
    setEditingWsId(ws.id);
    setWsTitle(ws.title);
    setWsCategory(ws.category);
    setWsLevel(ws.level);
    setWsDuration(ws.duration);
    setWsDescription(ws.description);
    setWsLearningObjectives(ws.learningObjectives);
    setWsTools([...ws.toolsAndMaterials]);
    setWsSteps([...ws.steps]);
    setWsImage(ws.illustrationImage || '');
    setIsWsModalOpen(true);
  };

  const handleDuplicateWs = (ws: WorksheetItem) => {
    const duplicated: WorksheetItem = {
      ...ws,
      id: `ws-${Date.now()}`,
      title: `${ws.title} (Salinan)`
    };
    setWorksheets([duplicated, ...worksheets]);
    showToast(`Worksheet "${duplicated.title}" berhasil diduplikasi!`);
  };

  const handleDeleteWs = (id: string) => {
    if (confirm('Hapus lembar kerja (worksheet) proyek ini?')) {
      setWorksheets(worksheets.filter((w) => w.id !== id));
      showToast('Worksheet berhasil dihapus.');
    }
  };

  // Drag & Drop Reorder State
  const [draggedWsIndex, setDraggedWsIndex] = useState<number | null>(null);

  const handleDragStartWs = (idx: number) => {
    setDraggedWsIndex(idx);
  };

  const handleDropWs = (targetIdx: number) => {
    if (draggedWsIndex === null || draggedWsIndex === targetIdx) return;
    const newWs = [...worksheets];
    const [moved] = newWs.splice(draggedWsIndex, 1);
    newWs.splice(targetIdx, 0, moved);
    setWorksheets(newWs);
    setDraggedWsIndex(null);
    showToast('Urutan lembar kerja berhasil dipindahkan.');
  };

  // Reorder Worksheet (Up / Down)
  const handleMoveWs = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === worksheets.length - 1)) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newWs = [...worksheets];
    const temp = newWs[idx];
    newWs[idx] = newWs[targetIdx];
    newWs[targetIdx] = temp;
    setWorksheets(newWs);
    showToast('Urutan lembar kerja berhasil diperbarui.');
  };

  const handleSaveWs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsTitle || !wsDescription) {
      alert('Mohon isi judul dan deskripsi worksheet.');
      return;
    }

    const payload: WorksheetItem = {
      id: editingWsId || `ws-${Date.now()}`,
      title: wsTitle,
      category: wsCategory,
      level: wsLevel,
      duration: wsDuration,
      description: wsDescription,
      learningObjectives: wsLearningObjectives || 'Meningkatkan nalar kritis santri melalui praktikum rekayasa.',
      toolsAndMaterials: wsTools.length > 0 ? wsTools : ['Alat Praktikum Standar Lab'],
      steps: wsSteps.length > 0 ? wsSteps : ['Lakukan perakitan sesuai arahan pembina lab.'],
      illustrationImage: wsImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      pdfFileUrl: '#unduh-lembar-kerja.pdf'
    };

    if (editingWsId) {
      setWorksheets(worksheets.map((w) => (w.id === editingWsId ? payload : w)));
      showToast(`Worksheet "${wsTitle}" berhasil diperbarui!`);
    } else {
      setWorksheets([payload, ...worksheets]);
      showToast(`Worksheet baru "${wsTitle}" berhasil ditambahkan!`);
    }

    setIsWsModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const res = await compressImageToWebP(file, 1200, 1200, 0.85);
      setWsImage(res.previewUrl);
      showToast(`Foto berhasil dikompresi WebP (Hemat ${res.savedPercent}%).`);
    } catch {
      alert('Gagal mengompres gambar.');
    } finally {
      setCompressing(false);
    }
  };

  // -------------------------------------------------------------
  // CALCULATOR NILAI RUBRIK (TAB B)
  // -------------------------------------------------------------

  const calculateTotalWeightedScore = (): number => {
    let total = 0;
    rubrics.forEach((r) => {
      const scoreChosen = calcScores[r.id] || 3;
      // Skor 1-4 dikonversi ke skala 100: (score / 4) * weight
      const componentScore = (scoreChosen / 4) * 100 * (r.weight / 100);
      total += componentScore;
    });
    return Math.round(total);
  };

  const totalWeightedScore = calculateTotalWeightedScore();

  const getPredicateBadge = (score: number) => {
    if (score >= 90) return { label: 'Mumtaz (Sangat Memuaskan)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (score >= 80) return { label: 'Jayyid Jiddan (Baik Sekali)', color: 'bg-sky-100 text-sky-900 border-sky-300' };
    if (score >= 70) return { label: 'Jayyid (Cukup Baik)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    return { label: 'Maqbul / Perlu Remedial', color: 'bg-rose-100 text-rose-900 border-rose-300' };
  };

  // -------------------------------------------------------------
  // PORTFOLIO HANDLERS (TAB C)
  // -------------------------------------------------------------

  const handleOpenAddPort = () => {
    setEditingPortId(null);
    setPStudentName('');
    setPStudentClass('SMP Plus Kelas IX-A');
    setPProjectTitle('');
    setPCategory('IoT');
    setPResultDesc('');
    setPPhotos(['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80']);
    setPYoutubeUrl('');
    setPStatus('Lolos Uji');
    setPFinalScore(90);
    setIsPortModalOpen(true);
  };

  const handleSavePort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pStudentName || !pProjectTitle) {
      alert('Mohon isi nama santri dan judul proyek.');
      return;
    }

    const payload: StudentPortfolioItem = {
      id: editingPortId || `port-${Date.now()}`,
      studentName: pStudentName,
      studentClass: pStudentClass,
      projectTitle: pProjectTitle,
      category: pCategory,
      resultDescription: pResultDesc,
      photos: pPhotos,
      youtubeUrl: pYoutubeUrl,
      status: pStatus,
      finalScore: pFinalScore
    };

    if (editingPortId) {
      setPortfolios(portfolios.map((p) => (p.id === editingPortId ? payload : p)));
      showToast(`Portofolio "${pProjectTitle}" berhasil diperbarui!`);
    } else {
      setPortfolios([payload, ...portfolios]);
      showToast(`Karya baru "${pProjectTitle}" berhasil dipublikasikan!`);
    }

    setIsPortModalOpen(false);
  };

  const handleDeletePort = (id: string) => {
    if (confirm('Hapus karya portofolio santri ini?')) {
      setPortfolios(portfolios.filter((p) => p.id !== id));
      showToast('Karya santri berhasil dihapus dari galeri.');
    }
  };

  // Filtered Lists
  const filteredWorksheets = worksheets.filter((w) => {
    const matchSearch =
      !searchWs ||
      w.title.toLowerCase().includes(searchWs.toLowerCase()) ||
      w.description.toLowerCase().includes(searchWs.toLowerCase());
    const matchCat = filterWsCat === 'Semua' || w.category === filterWsCat;
    return matchSearch && matchCat;
  });

  const filteredPortfolios = portfolios.filter((p) => {
    return filterPortStatus === 'Semua' || p.status === filterPortStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 relative">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER UTAMA DENGAN PALET #0E7A4C & #C8A951               */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0E7A4C] via-[#0A2116] to-[#0E7A4C] text-white shadow-xl border border-[#C8A951]/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#C8A951]/50 text-[#C8A951] text-xs font-black uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#C8A951]" />
              <span>SMART JM • Laboratorium Riset &amp; Rekayasa STEM Santri</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Kelola Lembar Kerja STEM, Rubrik &amp; Portofolio</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#C8A951] text-slate-950 font-mono">
                Sains &amp; IoT
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pusat pengelolaan silabus worksheet praktikum (IoT Pertanian ESP32, Nanofiltrasi Karbon Aktif), rubrik penilaian terstandar 4 parameter, serta etalase karya teknologi santri pondok.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAddWs}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C8A951] to-amber-500 hover:from-amber-400 hover:to-[#C8A951] text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Worksheet Baru</span>
            </button>
            <button
              onClick={handleOpenAddPort}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all backdrop-blur-md"
            >
              <Upload className="w-4 h-4 text-[#C8A951]" />
              <span>Unggah Karya Santri</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HEADER METRIK SPESIFIKASI PPJM                            */}
      {/* Total Worksheet: 24 | Rubrik: 12 | Portfolio: 28 | Lab: Online*/}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Worksheet */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Worksheet
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#0E7A4C]">24</span>
              <span className="text-xs font-semibold text-slate-500">modul</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              IoT, Filtrasi &amp; Robotik
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0E7A4C] flex items-center justify-center border border-emerald-100">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metrik 2: Rubrik Penilaian */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Rubrik Terstandar
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#C8A951]">12</span>
              <span className="text-xs font-semibold text-slate-500">instrumen</span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              4 Parameter Standar
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C8A951] flex items-center justify-center border border-amber-100">
            <Sliders className="w-6 h-6" />
          </div>
        </div>

        {/* Metrik 3: Portfolio Karya */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Karya Portofolio
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-sky-700">28</span>
              <span className="text-xs font-semibold text-slate-500">karya santri</span>
            </div>
            <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full inline-block">
              Tervalidasi Asatidz
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metrik 4: Status Lab */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Status Lab STEM
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-2xl sm:text-3xl font-black text-emerald-800">Online</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              Microcontroller Telemetry Aktif
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Alert Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TAB NAVIGATION (TAB A, TAB B, TAB C)                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('worksheet')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'worksheet'
              ? 'bg-[#0E7A4C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tab A - Worksheet Proyek (Lembar Kerja)</span>
        </button>

        <button
          onClick={() => setActiveTab('rubrik')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'rubrik'
              ? 'bg-[#0E7A4C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tab B - Rubrik Penilaian Terstandar</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'portfolio'
              ? 'bg-[#0E7A4C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tab C - Galeri Portofolio Santri</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* TAB A: WORKSHEET PROYEK (LEMBAR KERJA SANTRI)                 */}
      {/* ============================================================= */}
      {activeTab === 'worksheet' && (
        <div className="space-y-4">
          
          {/* Action Toolbar & Filters */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari worksheet proyek..."
                value={searchWs}
                onChange={(e) => setSearchWs(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E7A4C]"
              />
            </div>

            {/* Filter Kategori */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['Semua', 'IoT', 'Filtrasi', 'Energi', 'Robotik'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterWsCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterWsCat === cat
                      ? 'bg-[#0E7A4C] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tombol Buat */}
            <button
              onClick={handleOpenAddWs}
              className="px-4 py-2 rounded-xl bg-[#0E7A4C] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-800 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Lembar Kerja</span>
            </button>
          </div>

          {/* Cards Grid Worksheet dengan Reorder Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorksheets.map((ws, index) => (
              <div
                key={ws.id}
                draggable
                onDragStart={() => handleDragStartWs(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropWs(index)}
                className={`bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative ${
                  draggedWsIndex === index ? 'opacity-50 border-dashed border-[#0E7A4C] ring-2 ring-[#0E7A4C]/30' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges & Reorder Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700" title="Geser untuk mengubah urutan">
                        <GripVertical className="w-4 h-4" />
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ws.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {ws.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveWs(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Geser ke atas"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveWs(index, 'down')}
                        disabled={index === filteredWorksheets.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Geser ke bawah"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Image Preview Banner */}
                  {ws.illustrationImage && (
                    <div className="h-40 rounded-2xl overflow-hidden bg-slate-100 relative group">
                      <img
                        src={ws.illustrationImage}
                        alt={ws.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C8A951]" />
                        <span>{ws.duration}</span>
                      </div>
                    </div>
                  )}

                  <h3 className="font-black text-base text-slate-900 leading-snug">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ws.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 block text-[11px]">
                      Komponen Alat &amp; Bahan ({ws.toolsAndMaterials.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ws.toolsAndMaterials.slice(0, 3).map((tool, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                          {tool}
                        </span>
                      ))}
                      {ws.toolsAndMaterials.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold px-1">
                          +{ws.toolsAndMaterials.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewWs(ws)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7A4C] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Lembar Kerja</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateWs(ws)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                      title="Duplikat Worksheet"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditWs(ws)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                      title="Edit Worksheet"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteWs(ws.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      title="Hapus Worksheet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB B: RUBRIK PENILAIAN TERSTANDAR (4 PARAMETER TETAP)         */}
      {/* 1. Inovasi (25%) 2. Metodologi (25%) 3. Hasil (30%) 4. Presentasi (20%) */}
      {/* ============================================================= */}
      {activeTab === 'rubrik' && (
        <div className="space-y-6">
          
          {/* Header Rubrik Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0E7A4C]" />
                <span>Instrumen Penilaian Proyek Sains Terstandar PPJM</span>
              </h3>
              <p className="text-xs text-slate-500">
                Rubrik berbasis 4 parameter baku dengan pembobotan total 100% dan deskriptor skor 1 (Kurang) hingga 4 (Sangat Baik).
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-3">
              <span>Total Bobot: 100%</span>
              <span>•</span>
              <span>Skor Maksimal: 100 Poin</span>
            </div>
          </div>

          {/* 4 Parameter Card List */}
          <div className="space-y-4">
            {rubrics.map((rubric) => (
              <div
                key={rubric.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                      <span>{rubric.name}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C8A951]/20 text-[#0E7A4C] border border-[#C8A951]/40">
                        Bobot {rubric.weight}%
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{rubric.criteriaDescription}</p>
                  </div>

                  {/* Quick Score Selector for Calculator */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Skor Uji:</span>
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setCalcScores({ ...calcScores, [rubric.id]: s })}
                        className={`w-7 h-7 rounded-xl font-black text-xs transition-all ${
                          calcScores[rubric.id] === s
                            ? 'bg-[#0E7A4C] text-white shadow-xs scale-105'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={`Pilih skor ${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid 4 Deskriptor Skor (1=Kurang, 2=Cukup, 3=Baik, 4=Sangat Baik) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {([1, 2, 3, 4] as const).map((sc) => {
                    const label = sc === 1 ? 'Kurang' : sc === 2 ? 'Cukup' : sc === 3 ? 'Baik' : 'Sangat Baik';
                    const isSelected = calcScores[rubric.id] === sc;
                    return (
                      <div
                        key={sc}
                        className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            sc === 4 ? 'bg-emerald-100 text-emerald-800' : sc === 3 ? 'bg-sky-100 text-sky-800' : sc === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Skor {sc} • {label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {rubric.descriptors[sc]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* PREVIEW TABEL PENILAIAN & SIMULATOR NILAI AKHIR */}
          <div className="bg-gradient-to-br from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white rounded-3xl p-6 sm:p-8 border border-[#C8A951]/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951] block">
                  Simulasi Penilaian Santri Terpadu
                </span>
                <h4 className="text-lg font-black text-white">Hasil Kalkulasi Nilai Akhir Otomatis</h4>
              </div>

              <div className="flex items-center gap-4 bg-black/40 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="text-right">
                  <span className="text-xs text-slate-300 block">Akumulasi Nilai:</span>
                  <span className="text-3xl font-black text-[#C8A951]">{totalWeightedScore}</span>
                  <span className="text-xs text-slate-300"> / 100</span>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <span className="text-[10px] text-slate-400 block uppercase">Predikat:</span>
                  <span className="text-sm font-black text-emerald-300">
                    {getPredicateBadge(totalWeightedScore).label}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB C: GALERI PORTOFOLIO SANTRI                               */}
      {/* ============================================================= */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          
          {/* Action Toolbar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Filter Status Badge */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Status Proyek:</span>
              {['Semua', 'Lolos Uji', 'Proses', 'Revisi'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterPortStatus(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterPortStatus === st
                      ? 'bg-[#0E7A4C] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenAddPort}
              className="px-4 py-2 rounded-xl bg-[#0E7A4C] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-800 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Unggah Portofolio Santri</span>
            </button>
          </div>

          {/* Grid Karya Santri */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPortfolios.map((port) => (
              <div
                key={port.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Foto Utama dengan Lightbox Trigger */}
                  <div
                    onClick={() => setLightboxImage(port.photos[0])}
                    className="h-44 rounded-2xl overflow-hidden bg-slate-100 relative cursor-pointer group"
                  >
                    <img
                      src={port.photos[0]}
                      alt={port.projectTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs ${
                      port.status === 'Lolos Uji'
                        ? 'bg-emerald-600 text-white'
                        : port.status === 'Proses'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {port.status}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-[#C8A951] text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      <span>Perbesar Foto</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#0E7A4C] uppercase tracking-wider block">
                      {port.category} • {port.studentClass}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 line-clamp-2">
                      {port.projectTitle}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Oleh: <strong className="text-slate-800">{port.studentName}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {port.resultDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">Nilai Akhir:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs">
                      {port.finalScore} / 100
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingPortId(port.id);
                        setPStudentName(port.studentName);
                        setPStudentClass(port.studentClass);
                        setPProjectTitle(port.projectTitle);
                        setPCategory(port.category);
                        setPResultDesc(port.resultDescription);
                        setPPhotos(port.photos);
                        setPYoutubeUrl(port.youtubeUrl || '');
                        setPStatus(port.status);
                        setPFinalScore(port.finalScore);
                        setIsPortModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                      title="Edit Karya"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePort(port.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      title="Hapus Karya"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL FORM WORKSHEET (TAMBAH / EDIT)                          */}
      {/* ------------------------------------------------------------- */}
      {isWsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0E7A4C]" />
                <span>{editingWsId ? 'Edit Worksheet Proyek' : 'Formulir Lembar Kerja Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsWsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWs} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Worksheet Proyek: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Otomasi Irigasi Hidroponik ESP32"
                  value={wsTitle}
                  onChange={(e) => setWsTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E7A4C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori: *</label>
                  <select
                    value={wsCategory}
                    onChange={(e) => setWsCategory(e.target.value as StemCategory)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="IoT">IoT</option>
                    <option value="Filtrasi">Filtrasi</option>
                    <option value="Energi">Energi</option>
                    <option value="Robotik">Robotik</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tingkat Level: *</label>
                  <select
                    value={wsLevel}
                    onChange={(e) => setWsLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="SMP Kelas 7">SMP Kelas 7</option>
                    <option value="SMP Kelas 8">SMP Kelas 8</option>
                    <option value="SMP Kelas 9">SMP Kelas 9</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Estimasi Durasi: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3 Minggu"
                    value={wsDuration}
                    onChange={(e) => setWsDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Ringkas: *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan proyek rekayasa sains..."
                  value={wsDescription}
                  onChange={(e) => setWsDescription(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tujuan Pembelajaran:</label>
                <textarea
                  rows={2}
                  placeholder="Kompetensi sains dan keterampilan yang dicapai santri..."
                  value={wsLearningObjectives}
                  onChange={(e) => setWsLearningObjectives(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Alat & Bahan Dinamis */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="text-xs font-bold text-slate-800 block">Daftar Alat &amp; Bahan Praktikum:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama komponen / bahan baru..."
                    value={wsNewTool}
                    onChange={(e) => setWsNewTool(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!wsNewTool.trim()) return;
                      setWsTools([...wsTools, wsNewTool.trim()]);
                      setWsNewTool('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {wsTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700"
                    >
                      <span>{tool}</span>
                      <button
                        type="button"
                        onClick={() => setWsTools(wsTools.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Langkah Kerja Dinamis */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="text-xs font-bold text-slate-800 block">Langkah Kerja Praktikum:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tuliskan instruksi langkah kerja berikutnya..."
                    value={wsNewStep}
                    onChange={(e) => setWsNewStep(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!wsNewStep.trim()) return;
                      setWsSteps([...wsSteps, wsNewStep.trim()]);
                      setWsNewStep('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Tambah Langkah
                  </button>
                </div>

                <ol className="space-y-1.5 pt-1 list-decimal list-inside text-xs text-slate-700">
                  {wsSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200">
                      <span>{step}</span>
                      <button
                        type="button"
                        onClick={() => setWsSteps(wsSteps.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Upload Foto Ilustrasi dengan WebP Compressor */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Gambar Ilustrasi Rangkaian / Alat (WebP Auto-Compressor):</span>
                  {compressing && <span className="text-[#0E7A4C] text-[10px] font-bold">Mengompres WebP...</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0E7A4C] file:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E7A4C] hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  Simpan Worksheet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL PREVIEW WORKSHEET LEMBAR KERJA                          */}
      {/* ------------------------------------------------------------- */}
      {previewWs && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-fadeIn">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {previewWs.category}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">•</span>
                  <span className="text-xs text-slate-500 font-bold">{previewWs.level}</span>
                </div>
                <h3 className="font-black text-xl text-slate-900">{previewWs.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewWs(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewWs.illustrationImage && (
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={previewWs.illustrationImage}
                  alt={previewWs.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <strong className="text-emerald-950 block font-black">Tujuan Pembelajaran:</strong>
                <p>{previewWs.learningObjectives}</p>
              </div>

              <div className="space-y-1.5">
                <strong className="text-slate-900 block font-black">Alat &amp; Bahan Praktikum:</strong>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {previewWs.toolsAndMaterials.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <strong className="text-slate-900 block font-black">Langkah Kerja:</strong>
                <ol className="list-decimal list-inside space-y-2 pl-1">
                  {previewWs.steps.map((st, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      {st}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewWs(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Tutup Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL FORM PORTOFOLIO KARYA SANTRI (TAMBAH / EDIT)            */}
      {/* ------------------------------------------------------------- */}
      {isPortModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0E7A4C]" />
                <span>{editingPortId ? 'Edit Karya Portofolio' : 'Unggah Portofolio Santri'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPortModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePort} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Santri: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Zaki & Tim"
                    value={pStudentName}
                    onChange={(e) => setPStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kelas Santri: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMP Plus Kelas IX-A"
                    value={pStudentClass}
                    onChange={(e) => setPStudentClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Proyek Karya: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sistem Irigasi Tetes Otomatis ESP32"
                  value={pProjectTitle}
                  onChange={(e) => setPProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori: *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as StemCategory)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="IoT">IoT</option>
                    <option value="Filtrasi">Filtrasi</option>
                    <option value="Energi">Energi</option>
                    <option value="Robotik">Robotik</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Pengujian: *</label>
                  <select
                    value={pStatus}
                    onChange={(e) => setPStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Lolos Uji">Lolos Uji</option>
                    <option value="Proses">Proses</option>
                    <option value="Revisi">Revisi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nilai Akhir (0-100): *</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={pFinalScore}
                    onChange={(e) => setPFinalScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Hasil Uji Alat:</label>
                <textarea
                  rows={2}
                  placeholder="Ringkas hasil pengujian, efisiensi dan manfaat alat..."
                  value={pResultDesc}
                  onChange={(e) => setPResultDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tautan Video YouTube (Opsional):</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={pYoutubeUrl}
                  onChange={(e) => setPYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Upload Foto Dokumentasi Multi */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Foto Dokumentasi Prototipe:</span>
                  <span className="text-[10px] text-slate-400 font-medium">Bisa multi-foto WebP</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const res = await compressImageToWebP(file, 1200, 1200, 0.85);
                      setPPhotos([res.previewUrl, ...pPhotos]);
                      showToast('Foto karya berhasil diunggah.');
                    } catch {
                      alert('Gagal mengompres gambar.');
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0E7A4C] file:text-white"
                />

                {/* Grid Preview Foto */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {pPhotos.map((photo, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={photo} alt="karya" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPPhotos(pPhotos.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPortModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E7A4C] hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  Simpan Karya
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* LIGHTBOX MODAL FOTO KARYA SANTRI                              */}
      {/* ------------------------------------------------------------- */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={lightboxImage} alt="Karya Santri" className="max-w-full max-h-[85vh] object-contain" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default KelolaStem;
