import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpRight,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Share2,
  BookOpen,
  Award,
  Globe,
  Trophy,
  Palette,
  HeartHandshake,
  ExternalLink,
  ChevronDown,
  X,
  Menu,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  Cpu,
  Newspaper,
  ShieldCheck,
  Check,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  GripVertical,
  Plus,
  Play,
  Settings,
  Radio,
  Clock,
  Video,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

import { PageEditorState, INITIAL_EDITOR_STATE, NewsItem, QuickMenuItem, SectionMeta } from '../../types/EditorState';
import { loadEditorState, saveEditorDraft, publishEditorState, resetEditorStateToDefault } from '../../lib/editorStorage';
import { EditorSectionWrapper } from '../../components/editor/EditorSectionWrapper';
import { EditorItemWrapper } from '../../components/editor/EditorItemWrapper';
import { EditContentModal } from '../../components/editor/EditContentModal';
import { Navbar } from '../../components/common/Navbar';
import { HeroSlider } from '../../components/HeroSlider';
import { QuickMenu } from '../../components/QuickMenu';
import { BottomNav } from '../../components/common/BottomNav';
import { generateWhatsAppBroadcastUrl } from '../../lib/waFormatter';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

// --- DEFINISI 21 KOMPONEN SECTION LIBRARY LENGKAP ---
interface SectionLibraryTemplate {
  key: string;
  name: string;
  category: 'Utama' | 'Akademik' | 'Publik' | 'Interaktif' | 'Informasi';
  description: string;
  icon: any;
  defaultData: any;
}

const SECTION_LIBRARY: SectionLibraryTemplate[] = [
  {
    key: 'heroSlider',
    name: 'Hero Coverflow (3D 5 Flyer)',
    category: 'Utama',
    description: 'Banner carousel 3D coverflow interaktif 5 flyer program pondok.',
    icon: Sparkles,
    defaultData: { autoplay: true, interval: 5, showBadge: true, effect: 'Coverflow' }
  },
  {
    key: 'ticker',
    name: 'Running Ticker (Breaking News)',
    category: 'Utama',
    description: 'Teks berjalan pengumuman resmi dan maklumat penting pondok.',
    icon: Radio,
    defaultData: {
      headline: 'Warta Pesantren Terkini',
      text: 'Pendaftaran Santri Baru (PPDB) TP 2026/2027 telah dibuka! Informasi hubungi Sekretariat Panitia PPDB Jauharul Maknuun.',
      speed: 'normal'
    }
  },
  {
    key: 'navbar',
    name: 'Navbar 9 Pilar Interaktif',
    category: 'Utama',
    description: 'Header navigasi website, logo pesantren, 9 pilar navigasi & profil pill.',
    icon: Layers,
    defaultData: { showProfile: true, showTopBanner: true, bannerText: '✨ Ahlan Wa Sahlan di Pondok Pesantren Jauharul Maknuun' }
  },
  {
    key: 'quickMenu',
    name: 'QuickMenu 8 Tombol Mobile',
    category: 'Utama',
    description: 'Menu akses cepat 8 kartu kompak responsif di layar smartphone.',
    icon: LayoutGridIcon,
    defaultData: {
      items: [
        { id: 'jm-center', label: 'JM Center', route: '/jm-center', theme: 'blue', isVisible: true },
        { id: 'program-unggulan', label: 'Program', route: '/program-unggulan', theme: 'violet', isVisible: true },
        { id: 'smart-jm', label: 'SMART JM', route: '/smart-jm/hafidz/read', theme: 'emerald', isVisible: true },
        { id: 'prestasi', label: 'Prestasi', route: '/prestasi', theme: 'amber', isVisible: true },
        { id: 'ekskul', label: 'Ekstrakurikuler', route: '/ekskul', theme: 'orange', isVisible: true },
        { id: 'osis', label: 'OSIS', route: '/osis', theme: 'indigo', isVisible: true },
        { id: 'agenda-pesantren', label: 'Agenda', route: '/agenda', theme: 'emerald', isVisible: true },
        { id: 'galeri-sekolah', label: 'Galeri', route: '/galeri/foto', theme: 'rose', isVisible: true }
      ]
    }
  },
  {
    key: 'sambutan',
    name: 'Kalam Sambutan Mudir Pengasuh',
    category: 'Utama',
    description: 'Pesan keteladanan KH. M. Jauharul Maknuun dengan foto mudir.',
    icon: HeartHandshake,
    defaultData: {
      pengasuhName: 'KH. M. Jauharul Maknuun, Lc., M.Pd.I.',
      title: 'Mudir & Pengasuh Pesantren',
      kalam: 'Membimbing santri dengan keteladanan akhlak salaf, ketajaman sains modern, dan keluhuran jiwa Qurani.',
      quote: 'Pendidikan terbaik adalah menanamkan adab sebelum ilmu.',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    key: 'keunggulan',
    name: '4 Pilar Keunggulan Pesantren',
    category: 'Akademik',
    description: 'Pilar Turats Salaf, Tahfidz Digital AI, Lab Riset STEM, dan Mandarin Class.',
    icon: Award,
    defaultData: {
      headline: '4 Pilar Keunggulan Jauharul Maknuun',
      subheadline: 'Integrasi kurikulum pesantren salaf dengan keunggulan sains masa depan.'
    }
  },
  {
    key: 'statistik',
    name: 'Statistik Pesantren (Counter)',
    category: 'Informasi',
    description: 'Capaian 1.250 Santri Aktif, 85 Asatidz, 142 Prestasi Juara, 28 Tahun Mengabdi.',
    icon: Trophy,
    defaultData: {
      santriCount: '1.250+',
      asatidzCount: '85',
      prestasiCount: '142+',
      tahunBerdiri: '1998'
    }
  },
  {
    key: 'programUnggulan',
    name: 'Program Pendidikan Unggulan',
    category: 'Akademik',
    description: 'Daftar program madin, tahfidz mutqin, bilingual Arabic/Mandarin, dan riset teknologi.',
    icon: BookOpen,
    defaultData: {
      headline: 'Empat Pilar Pendidikan PPJM',
      subheadline: 'Kurikulum holistik memadukan kedalaman kutubus salaf dan penguasaan sains global.',
      items: [
        { id: 'prog-1', name: 'Madrasah Diniyah Salafiyah', desc: 'Kajian kitab kuning berjenjang dengan metode sorogan dan bandongan.', iconName: 'BookOpen', tag: 'Turats', isVisible: true },
        { id: 'prog-2', name: 'Tahfidzul Quran 30 Juz', desc: 'Bimbingan intensif bersanad dengan evaluasi harian sistematis.', iconName: 'Award', tag: 'Tahfidz', isVisible: true },
        { id: 'prog-3', name: 'SMART Lab Riset STEM', desc: 'Laboratorium IoT, robotika cerdas, filtrasi air, dan rekayasa sains aplikatif.', iconName: 'Cpu', tag: 'STEM', isVisible: true },
        { id: 'prog-4', name: 'Mandarin Class HSK Standar', desc: 'Pembelajaran bahasa Mandarin HSK 1-3 dengan pengajar bersertifikasi.', iconName: 'Globe', tag: 'Bahasa', isVisible: true }
      ]
    }
  },
  {
    key: 'fasilitas',
    name: 'Fasilitas Pesantren Lengkap',
    category: 'Informasi',
    description: 'Asrama santri, masjid jami, laboratorium komputer, dan perpustakaan digital.',
    icon: ShieldCheck,
    defaultData: {
      headline: 'Fasilitas Unggulan Pesantren',
      subheadline: 'Sarana dan prasarana modern menunjang kenyamanan belajar santri.'
    }
  },
  {
    key: 'amaliyah',
    name: 'Jadwal Amaliyah 24 Jam',
    category: 'Akademik',
    description: 'Jadwal rutinitas santri mulai shalat tahajjud, ngaji shubuh hingga istirahat malam.',
    icon: Clock,
    defaultData: {
      headline: 'Jadwal Harian & Amaliyah Santri',
      subheadline: 'Kedisiplinan 24 jam membangun kepribadian mandiri dan berakhlakul karimah.'
    }
  },
  {
    key: 'galeri',
    name: 'Galeri Foto Kegiatan Lightbox',
    category: 'Publik',
    description: 'Dokumentasi foto kegiatan harian, rihlah ilmiah, dan wisuda hafidz.',
    icon: ImageIcon,
    defaultData: {
      headline: 'Galeri Kegiatan Santri',
      subheadline: 'Potret aktivitas belajar, ibadah, dan kebersamaan santri PPJM.',
      items: [
        { id: 'gal-1', title: 'Halaqah Tahfidz Shubuh', category: 'Tahfidz', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', isVisible: true },
        { id: 'gal-2', title: 'Uji Coba Robot IoT ESP32', category: 'STEM', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', isVisible: true },
        { id: 'gal-3', title: 'Praktik Percakapan Mandarin HSK', category: 'Bahasa', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', isVisible: true }
      ]
    }
  },
  {
    key: 'video',
    name: 'Video Profil YouTube',
    category: 'Publik',
    description: 'Embed video profil sinematik resmi PPJM dengan deskripsi singkat.',
    icon: Video,
    defaultData: {
      headline: 'Video Profil Pesantren',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      caption: 'Mengenal Lebih Dekat Pesantren Jauharul Maknuun Lasem'
    }
  },
  {
    key: 'beritaTerkini',
    name: 'Warta & Berita Santri Terkini',
    category: 'Publik',
    description: 'Kabar aktual, liputan kajian, dan agenda pesantren.',
    icon: Newspaper,
    defaultData: {
      headline: 'Warta & Berita Pesantren',
      subheadline: 'Kabar aktual dan dokumentasi kegiatan santri terkini.',
      items: [
        { id: 'news-1', title: 'Santri PPJM Sabet Juara 1 Robotika Nasional 2026', category: 'Prestasi', date: '30 Okt 2026', thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', summary: 'Tim riset STEM Jauharul Maknuun berhasil meraih medali emas pada ajang teknologi nasional.', isVisible: true, isPinned: true },
        { id: 'news-2', title: 'Wisuda Akbar Tahfidz Al-Quran 30 Juz Angkatan IX', category: 'Tahfidz', date: '28 Okt 2026', thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', summary: 'Sebanyak 45 santri resmi dikukuhkan sebagai hafidz dan hafidzah bersanad.', isVisible: true }
      ]
    }
  },
  {
    key: 'testimoni',
    name: 'Testimoni Wali Santri & Alumni',
    category: 'Publik',
    description: 'Ulasan dan pesan bangga dari para wali santri dan alumni sukses.',
    icon: MessageSquare,
    defaultData: {
      headline: 'Apa Kata Wali Santri & Alumni',
      subheadline: 'Kepercayaan dan pengalaman nyata menimba ilmu di Jauharul Maknuun.'
    }
  },
  {
    key: 'prestasi',
    name: 'Prestasi Lux Card',
    category: 'Publik',
    description: 'Kartu kejuaraan emas santri di bidang MQK, MTQ, STEM & Bahasa.',
    icon: Trophy,
    defaultData: {
      headline: 'Prestasi & Kejuaraan Membanggakan',
      items: [
        { id: 'pres-1', juara: 'Juara 1 Nasional', kejuaraan: 'Musabaqah Qira’atil Kutub Fathul Qorib', tingkat: 'Nasional', tahun: '2026', santri: 'Ahmad Zaki', isVisible: true },
        { id: 'pres-2', juara: 'Juara 1 Provinsi', kejuaraan: 'Olimpiade IoT & Rekayasa Hijau', tingkat: 'Jawa Timur', tahun: '2026', santri: 'Farhan Maulana', isVisible: true },
        { id: 'pres-3', juara: 'Juara Umum', kejuaraan: 'HSK Chinese Speech Competition', tingkat: 'Jawa-Bali', tahun: '2026', santri: 'Aisyah Nur', isVisible: true }
      ]
    }
  },
  {
    key: 'ekskul',
    name: 'Ekskul Santri Grid',
    category: 'Akademik',
    description: 'Pramuka, Hadrah Al-Banjari, Pagar Nusa, Robotik, dan Jurnalistik.',
    icon: CompassIcon,
    defaultData: {
      headline: 'Ekstrakurikuler Minat & Bakat Santri',
      items: [
        { id: 'eks-1', nama: 'Seni Hadrah & Sholawat Al-Banjari', kategori: 'Seni Islami', jadwal: 'Malam Jumat', pembimbing: 'Ustadz Rizky', isVisible: true },
        { id: 'eks-2', nama: 'Pencak Silat Pagar Nusa', kategori: 'Bela Diri', jadwal: 'Ahad Pagi', pembimbing: 'Kang Fauzi', isVisible: true },
        { id: 'eks-3', nama: 'Klub Riset & Robotika Cerdas', kategori: 'Sains', jadwal: 'Sabtu Sore', pembimbing: 'Ustadz Ilham', isVisible: true }
      ]
    }
  },
  {
    key: 'osis',
    name: 'Struktur Kepengurusan OSIS',
    category: 'Akademik',
    description: 'Struktur pengurus santri: Presidium, BPH, dan 5 Departemen.',
    icon: UsersIcon,
    defaultData: {
      headline: 'Organisasi Santri Intra Ma’had (OSIS)',
      subheadline: 'Wadah kepemimpinan dan pengabdian santri.',
      kabinetName: 'Kabinet Al-Fatih 2026/2027',
      items: [
        { id: 'os-1', nama: 'Muhammad Hafidz', jabatan: 'Presiden Santri', divisi: 'Presidium', lencana: 'Emas', isVisible: true },
        { id: 'os-2', nama: 'Abdullah Azzam', jabatan: 'Sekretaris Jenderal', divisi: 'BPH', lencana: 'Perak', isVisible: true }
      ]
    }
  },
  {
    key: 'agenda',
    name: 'Agenda Countdown Kegiatan',
    category: 'Interaktif',
    description: 'Hitung mundur kegiatan besar pondok: Wisuda, Haflah Akhirussanah, dll.',
    icon: Calendar,
    defaultData: {
      headline: 'Agenda & Kalender Pondok',
      subheadline: 'Agenda kegiatan terdekat dan jadwal penting santri.',
      items: [
        { id: 'ag-1', title: 'Haflah Akhirussanah & Khotmil Quran', date: '15 Syawal 1447 H', location: 'Auditorium Utama PPJM', category: 'Pondok', isVisible: true },
        { id: 'ag-2', title: 'Pameran Karya Sains & IoT Santri', date: '20 Syawal 1447 H', location: 'Lab STEM PPJM', category: 'Akademik', isVisible: true }
      ]
    }
  },
  {
    key: 'spmb',
    name: 'CTA Pendaftaran SPMB Online',
    category: 'Interaktif',
    description: 'Banner ajakan bergabung dan pendaftaran santri baru 2026/2027.',
    icon: Sparkles,
    defaultData: {
      headline: 'Penerimaan Santri Baru (PPDB) 2026/2027',
      subheadline: 'Mari bergabung menjadi bagian dari keluarga besar Pondok Pesantren Jauharul Maknuun.',
      ctaText: 'Daftar Online Sekarang',
      waNumber: '6285646199273'
    }
  },
  {
    key: 'kontak',
    name: 'Kontak & Peta Interaktif',
    category: 'Informasi',
    description: 'Alamat lengkap, nomor telepon, WhatsApp, dan peta Google Maps.',
    icon: MapPin,
    defaultData: {
      headline: 'Hubungi & Kunjungi Pesantren Kami',
      alamat: 'Jl. Raya Lasem No. 45, Sidayu, Gresik, Jawa Timur 61153',
      telepon: '(031) 3948212',
      whatsapp: '+62 856-4619-9273',
      email: 'sekretariat@jauharulmaknuun.sch.id'
    }
  },
  {
    key: 'footer',
    name: 'Footer 3 Kolom Resmi PPJM',
    category: 'Informasi',
    description: 'Footer penutup resmi website, logo pondok, kontak, dan copyright.',
    icon: ShieldCheck,
    defaultData: {
      alamat: 'Jl. Raya Lasem No. 45, Sidayu, Gresik, Jawa Timur 61153',
      whatsapp: '+62 856-4619-9273',
      telepon: '(031) 3948212',
      email: 'sekretariat@jauharulmaknuun.sch.id',
      copyright: '© 2026 Pondok Pesantren Jauharul Maknuun. Hak Cipta Dilindungi Undang-Undang.'
    }
  }
];

function LayoutGridIcon(props: any) {
  return <Menu {...props} />;
}
function CompassIcon(props: any) {
  return <Award {...props} />;
}
function UsersIcon(props: any) {
  return <ShieldCheck {...props} />;
}

export const WebVisualEditor: React.FC = () => {
  const navigate = useNavigate();

  // --- 1. STATE & HISTORY STACK (UNDO / REDO) ---
  const initialLoadedState = useMemo(() => loadEditorState(), []);
  const [editorState, setEditorState] = useState<PageEditorState>(initialLoadedState);
  const [history, setHistory] = useState<PageEditorState[]>([initialLoadedState]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Helper untuk update state dengan merekam history snapshot
  const updateEditorState = (
    updater: PageEditorState | ((prev: PageEditorState) => PageEditorState),
    recordHistory = true
  ) => {
    setEditorState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (recordHistory) {
        setHistory((currHist) => {
          const newHist = currHist.slice(0, historyIndex + 1);
          newHist.push(next);
          // Batasi max 50 riwayat untuk hemat memori
          if (newHist.length > 50) newHist.shift();
          return newHist;
        });
        setHistoryIndex((currIdx) => Math.min(currIdx + 1, 49));
      }
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setEditorState(history[prevIdx]);
      showToast(`Undo: Kembali ke perubahan #${prevIdx}`);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setEditorState(history[nextIdx]);
      showToast(`Redo: Maju ke perubahan #${nextIdx}`);
    }
  };

  // Keyboard shortcut listener untuk Ctrl+Z dan Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // --- 2. VIEWPORT & INTERACTION MODES ---
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isPublicPreview, setIsPublicPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [sectionLibraryOpen, setSectionLibraryOpen] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');

  // Drag & drop sections reorder state
  const [draggedSecKey, setDraggedSecKey] = useState<string | null>(null);

  // Active section for properties panel
  const [activeSectionId, setActiveSectionId] = useState<string>('heroSlider');

  // Active section modal editing state (dialog)
  const [editingSection, setEditingSection] = useState<{ id: string; title: string; data: any } | null>(null);

  // --- 3. FLOATING TOOLBAR PRO STATE ---
  const [floatingToolbarPos, setFloatingToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showFontSizeSelect, setShowFontSizeSelect] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [customLinkUrl, setCustomLinkUrl] = useState('https://');
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // --- 4. IMAGE EDITOR PRO STATE ---
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageTarget, setSelectedImageTarget] = useState<{
    sectionId: string;
    currentUrl: string;
    fieldName: string;
    alt?: string;
    title?: string;
    linkOnClick?: string;
    objectFit?: 'cover' | 'contain';
    rounded?: number;
    shadow?: string;
    opacity?: number;
    overlayColor?: string;
    overlayOpacity?: number;
  } | null>(null);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [imgAltText, setImgAltText] = useState('');
  const [imgTitleText, setImgTitleText] = useState('');
  const [imgLinkUrl, setImgLinkUrl] = useState('');
  const [imgObjectFit, setImgObjectFit] = useState<'cover' | 'contain'>('cover');
  const [imgRounded, setImgRounded] = useState<number>(16);
  const [imgShadow, setImgShadow] = useState<string>('lg');
  const [imgOpacity, setImgOpacity] = useState<number>(100);
  const [imgOverlayColor, setImgOverlayColor] = useState<string>('#0A2116');
  const [imgOverlayOpacity, setImgOverlayOpacity] = useState<number>(20);

  // Hero Slider Spesifik Config
  const [sliderAutoplay, setSliderAutoplay] = useState<boolean>(true);
  const [sliderDuration, setSliderDuration] = useState<number>(5);
  const [sliderEffect, setSliderEffect] = useState<'Coverflow' | 'Fade' | 'Slide'>('Coverflow');

  const [compressingImage, setCompressingImage] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  // Auto-save draft on state change
  useEffect(() => {
    saveEditorDraft(editorState);
    const now = new Date();
    setLastSavedTime(
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  }, [editorState]);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- FLOATING TOOLBAR SELECTION DETECTOR ---
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isPublicPreview) {
        setFloatingToolbarPos(null);
        return;
      }
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setFloatingToolbarPos(null);
        setLinkInputOpen(false);
        setShowColorPicker(false);
        setShowBgPicker(false);
        setShowFontSizeSelect(false);
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.top > 0) {
          setFloatingToolbarPos({
            top: Math.max(76, rect.top - 62),
            left: Math.max(16, rect.left + rect.width / 2 - 160)
          });
        }
      } catch {
        setFloatingToolbarPos(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isPublicPreview]);

  // Apply Formatting command via document.execCommand
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    setShowColorPicker(false);
    setShowBgPicker(false);
    setShowFontSizeSelect(false);
    setLinkInputOpen(false);
  };

  // Section visibility toggle
  const toggleSectionVisibility = (sectionKey: string) => {
    updateEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          isVisible: !prev.sections[sectionKey]?.isVisible
        }
      }
    }));
    showToast(`Visibilitas seksi "${sectionKey}" diperbarui`);
  };

  // Section item toggle visibility
  const toggleItemVisibility = (sectionKey: string, itemId: string) => {
    updateEditorState((prev) => {
      const section = prev.sections[sectionKey];
      if (!section) return prev;
      const items = (section.data as any).items || [];
      const updatedItems = items.map((item: any) =>
        item.id === itemId ? { ...item, isVisible: !item.isVisible } : item
      );
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...section,
            data: {
              ...section.data,
              items: updatedItems
            }
          }
        }
      };
    });
    showToast(`Status item diperbarui`);
  };

  // --- TRUE DRAG & DROP SECTION REORDER ---
  const handleDragStartSection = (secKey: string) => {
    setDraggedSecKey(secKey);
  };

  const handleDropSection = (targetSecKey: string) => {
    if (!draggedSecKey || draggedSecKey === targetSecKey) return;

    updateEditorState((prev) => {
      const keys = Object.keys(prev.sections);
      const draggedOrder = prev.sections[draggedSecKey]?.order || 0;
      const targetOrder = prev.sections[targetSecKey]?.order || 0;

      const newSections = { ...prev.sections };
      newSections[draggedSecKey] = { ...newSections[draggedSecKey], order: targetOrder };
      newSections[targetSecKey] = { ...newSections[targetSecKey], order: draggedOrder };

      return {
        ...prev,
        sections: newSections
      };
    });

    setDraggedSecKey(null);
    showToast('Urutan seksi berhasil dipindahkan!');
  };

  // Section order reorder via Up/Down
  const moveSectionOrder = (sectionKey: string, direction: 'up' | 'down') => {
    updateEditorState((prev) => {
      const sec = prev.sections[sectionKey];
      if (!sec) return prev;
      const currentOrder = sec.order;
      const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...sec,
            order: newOrder
          }
        }
      };
    });
    showToast(`Urutan seksi dipindahkan`);
  };

  // Handle section content save from modal
  const handleSaveSectionContent = (updatedData: any) => {
    if (!editingSection) return;
    const sectionKey = editingSection.id;
    updateEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          data: updatedData
        }
      }
    }));
    showToast(`Konten seksi "${editingSection.title}" berhasil disimpan`);
  };

  // Duplicate section
  const handleDuplicateSection = (sectionKey: string) => {
    const sec = editorState.sections[sectionKey];
    if (!sec) return;
    const newKey = `${sectionKey}_copy_${Date.now()}`;
    updateEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [newKey]: {
          ...sec,
          id: newKey,
          title: `${sec.title} (Duplikat)`,
          order: sec.order + 1
        }
      }
    }));
    showToast(`Seksi ${sec.title} berhasil diduplikasi!`);
  };

  // Delete/Hide section
  const handleDeleteSection = (sectionKey: string) => {
    updateEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          isVisible: false
        }
      }
    }));
    showToast(`Seksi ${sectionKey} disembunyikan`);
  };

  // Add Section from 21 Library Components
  const handleAddSectionFromLibrary = (template: SectionLibraryTemplate) => {
    const uniqueId = `${template.key}_${Date.now()}`;
    const nextOrder = Object.keys(editorState.sections).length + 1;

    const newSec: SectionMeta = {
      id: uniqueId,
      title: template.name,
      description: template.description,
      isVisible: true,
      order: nextOrder,
      data: template.defaultData
    };

    updateEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [uniqueId]: newSec
      }
    }));

    setSectionLibraryOpen(false);
    setActiveSectionId(uniqueId);
    setPropertiesOpen(true);
    showToast(`Seksi baru "${template.name}" berhasil ditambahkan!`);
  };

  // Handle Publish Action
  const handlePublish = async () => {
    const res = await publishEditorState(editorState);
    if (res.success) {
      setPublishSuccessMsg(true);
      setTimeout(() => setPublishSuccessMsg(false), 3500);
      showToast('Berhasil dipublikasikan ke website publik PPJM!');
    }
  };

  // Handle Reset to Default
  const handleReset = () => {
    const defaultState = resetEditorStateToDefault();
    updateEditorState(defaultState);
    setResetModalOpen(false);
    showToast('Seluruh seksi berhasil direset ke pengaturan bawaan');
  };

  // WhatsApp Broadcast handler for News
  const handleShareWA = (news: NewsItem) => {
    const url = generateWhatsAppBroadcastUrl({
      title: news.title,
      category: news.category,
      excerpt: news.summary,
      targetUrl: window.location.origin + (news.link || '/'),
      tanggal: news.date
    });
    window.open(url, '_blank');
  };

  // --- IMAGE EDITOR PRO HANDLERS ---
  const openImageModal = (
    sectionId: string,
    currentUrl: string,
    fieldName: string,
    options?: {
      alt?: string;
      title?: string;
      linkOnClick?: string;
      objectFit?: 'cover' | 'contain';
      rounded?: number;
      shadow?: string;
      opacity?: number;
    }
  ) => {
    if (isPublicPreview) return;
    setSelectedImageTarget({
      sectionId,
      currentUrl,
      fieldName,
      alt: options?.alt || 'Foto Dokumentasi PPJM',
      title: options?.title || '',
      linkOnClick: options?.linkOnClick || '',
      objectFit: options?.objectFit || 'cover',
      rounded: options?.rounded !== undefined ? options.rounded : 16,
      shadow: options?.shadow || 'lg',
      opacity: options?.opacity !== undefined ? options.opacity : 100
    });
    setNewImageUrl(currentUrl);
    setImgAltText(options?.alt || '');
    setImgTitleText(options?.title || '');
    setImgLinkUrl(options?.linkOnClick || '');
    setImgObjectFit(options?.objectFit || 'cover');
    setImgRounded(options?.rounded !== undefined ? options.rounded : 16);
    setImgShadow(options?.shadow || 'lg');
    setImgOpacity(options?.opacity !== undefined ? options.opacity : 100);
    setCompressionResult(null);
    setImageModalOpen(true);
  };

  // Handle File Upload with Auto-WebP Compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingImage(true);
    try {
      const res = await compressImageToWebP(file, 1400, 1400, 0.82);
      setCompressionResult(res);
      setNewImageUrl(res.previewUrl);
      showToast(`WebP Berhasil! ${res.originalSizeKB} KB ➔ ${res.compressedSizeKB} KB (Hemat ${res.savedPercent}%)`);
    } catch (err) {
      alert('Gagal mengompres gambar.');
    } finally {
      setCompressingImage(false);
    }
  };

  const handleApplyImageReplace = () => {
    if (!selectedImageTarget || !newImageUrl) return;

    const { sectionId, fieldName } = selectedImageTarget;
    const secKey = sectionId;

    if (editorState.sections[secKey]) {
      updateEditorState((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [secKey]: {
            ...prev.sections[secKey],
            data: {
              ...prev.sections[secKey].data,
              [fieldName]: newImageUrl,
              imgAlt: imgAltText,
              imgTitle: imgTitleText,
              imgLink: imgLinkUrl,
              imgFit: imgObjectFit,
              imgRounded,
              imgShadow,
              imgOpacity,
              imgOverlayColor,
              imgOverlayOpacity
            }
          }
        }
      }));
    }

    setImageModalOpen(false);
    setSelectedImageTarget(null);
    setNewImageUrl('');
    setCompressionResult(null);
    showToast('Properti gambar berhasil diperbarui & disimpan!');
  };

  const handleDeleteImage = () => {
    if (!selectedImageTarget) return;
    const { sectionId, fieldName } = selectedImageTarget;
    updateEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          data: {
            ...prev.sections[sectionId].data,
            [fieldName]: ''
          }
        }
      }
    }));
    setImageModalOpen(false);
    showToast('Gambar berhasil dihapus dari seksi.');
  };

  // Sorted Sections by 'order'
  const sortedSectionEntries = useMemo(() => {
    return Object.entries(editorState.sections).sort((a, b) => (a[1]?.order || 0) - (b[1]?.order || 0));
  }, [editorState.sections]);

  const currentSection = editorState.sections[activeSectionId];

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#09090b] font-sans text-zinc-100 antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR (Modern Islamic Emerald & Gold Shell)                      */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#0A2116]/95 px-3 sm:px-6 backdrop-blur-xl">
        
        {/* Brand & Context Information */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E7A4C] to-[#0A2116] text-[#C8A951] font-black text-xs shadow-md border border-[#C8A951]/40 hover:scale-105 transition"
            title="Kembali ke Panel Admin Utama"
          >
            JM
          </Link>
          <div className="hidden xs:block">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                PPJM Live WYSIWYG Editor
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#0E7A4C]/30 text-[#C8A951] border border-[#C8A951]/30">
                  <Sparkles className="w-2.5 h-2.5 text-[#C8A951]" /> Zero-IT Pro
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Otomatis Tersimpan: {lastSavedTime}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-[#C8A951] font-mono">
                {historyIndex} dari {Math.max(0, history.length - 1)} riwayat
              </span>
            </div>
          </div>
        </div>

        {/* UNDO / REDO & DEVICE VIEWPORT SWITCHER */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Undo / Redo Buttons */}
          <div className="flex items-center bg-zinc-900/90 rounded-xl p-1 border border-white/10 mr-1 sm:mr-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
              title="Urungkan Perubahan (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
              title="Ulangi Perubahan (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center rounded-xl bg-zinc-900/90 p-1 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                viewportMode === 'mobile'
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tampilan Smartphone (iPhone 390px + 5 Hub BottomNav)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HP</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('tablet')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                viewportMode === 'tablet'
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tampilan Tablet iPad (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                viewportMode === 'desktop'
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tampilan Layar Komputer Penuh (100% Fluid)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">
          
          {/* Tombol Tambah Seksi dari 21 Library */}
          <button
            type="button"
            onClick={() => setSectionLibraryOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C8A951] to-amber-400 text-slate-950 font-black px-3 text-xs shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
            title="Tambah Seksi Baru dari 21 Koleksi Library"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden md:inline">Tambah Seksi</span>
          </button>

          {/* Sidebar Menu Grouping Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition cursor-pointer ${
              sidebarOpen
                ? 'border-[#0E7A4C] bg-[#0E7A4C]/30 text-[#C8A951]'
                : 'border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title="Buka Menu Modul CMS & Urutan Drag Reorder"
          >
            <Layers className="w-3.5 h-3.5 text-[#C8A951]" />
            <span className="hidden md:inline">Seksi &amp; Urutan</span>
          </button>

          {/* Properties Panel Toggle */}
          <button
            type="button"
            onClick={() => setPropertiesOpen(!propertiesOpen)}
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition cursor-pointer ${
              propertiesOpen
                ? 'border-[#C8A951] bg-[#C8A951]/20 text-[#C8A951]'
                : 'border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title="Buka Panel Properti Context-Aware"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C8A951]" />
            <span className="hidden md:inline">Properti</span>
          </button>

          {/* Toggle Public Preview Mode */}
          <button
            type="button"
            onClick={() => setIsPublicPreview(!isPublicPreview)}
            className={`flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition cursor-pointer ${
              isPublicPreview
                ? 'bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/40'
                : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isPublicPreview ? 'Kembali ke Mode Edit Visual' : 'Pratinjau Murni Sebagai Pengunjung'}
          >
            {isPublicPreview ? <EyeOff className="w-3.5 h-3.5 text-[#C8A951]" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPublicPreview ? 'Edit Mode' : 'Preview'}</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="hidden lg:flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
            title="Reset ke Pengaturan Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Publish Perubahan Button */}
          <button
            type="button"
            onClick={handlePublish}
            className="flex h-9 items-center gap-2 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] px-4 text-xs font-extrabold text-[#C8A951] shadow-lg shadow-black/40 active:scale-95 transition cursor-pointer border border-[#C8A951]/30"
          >
            <Save className="w-3.5 h-3.5 text-[#C8A951]" />
            <span>Publikasikan</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FLOATING TEXT FORMATTING TOOLBAR PRO (WITH ARROW & PRO TOOLS)          */}
      {/* ========================================================================= */}
      {floatingToolbarPos && !isPublicPreview && (
        <div
          style={{ top: floatingToolbarPos.top, left: floatingToolbarPos.left }}
          className="fixed z-50 flex items-center gap-1 p-1.5 rounded-2xl bg-zinc-900/95 text-white border border-[#C8A951]/50 shadow-2xl backdrop-blur-xl animate-scale-up after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-zinc-900/95"
        >
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold"
            title="Tebal (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold"
            title="Miring (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold"
            title="Garis Bawah (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-white/20 mx-0.5" />

          {/* Text Color Picker Swatches */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setShowColorPicker(!showColorPicker); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold flex items-center gap-1 text-[#C8A951]"
              title="Warna Teks"
            >
              <span>A</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 p-2 rounded-xl bg-zinc-900 border border-white/20 shadow-xl flex items-center gap-1.5 z-50">
                {['#0E7A4C', '#C8A951', '#0A2116', '#FFFFFF', '#EF4444', '#2563EB'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyFormat('foreColor', color); }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Background Highlight Swatches */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setShowBgPicker(!showBgPicker); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-xs flex items-center gap-1 text-amber-300"
              title="Warna Latar (Highlight)"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>

            {showBgPicker && (
              <div className="absolute top-full left-0 mt-2 p-2 rounded-xl bg-zinc-900 border border-white/20 shadow-xl flex items-center gap-1.5 z-50">
                {['#FEF08A', '#A7F3D0', '#FED7AA', '#E9D5FF', 'transparent'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyFormat('hiliteColor', color); }}
                    className="w-5 h-5 rounded-md border border-white/30 hover:scale-110 transition flex items-center justify-center text-[9px] text-zinc-900"
                    style={{ backgroundColor: color === 'transparent' ? '#333' : color }}
                    title={color}
                  >
                    {color === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Selector */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setShowFontSizeSelect(!showFontSizeSelect); }}
              className="px-2 py-1 rounded-lg hover:bg-white/10 text-[11px] font-bold text-zinc-300 flex items-center gap-1"
              title="Ukuran Font"
            >
              <span>Size</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {showFontSizeSelect && (
              <div className="absolute top-full left-0 mt-2 p-1.5 rounded-xl bg-zinc-900 border border-white/20 shadow-xl flex flex-col gap-1 z-50 text-xs w-20">
                {['1', '2', '3', '4', '5', '6', '7'].map((sz, idx) => {
                  const labels = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'];
                  return (
                    <button
                      key={sz}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); applyFormat('fontSize', sz); }}
                      className="px-2 py-1 rounded hover:bg-white/10 text-left font-medium"
                    >
                      {labels[idx]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-white/20 mx-0.5" />

          {/* Text Alignment */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyLeft'); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs"
            title="Rata Kiri"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyCenter'); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs"
            title="Rata Tengah"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyRight'); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs"
            title="Rata Kanan"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          {/* Link Popover */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setLinkInputOpen(!linkInputOpen); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold text-sky-400"
              title="Sisipkan Tautan (Link _blank)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            {linkInputOpen && (
              <div className="absolute top-full right-0 mt-2 p-2 rounded-xl bg-zinc-900 border border-white/20 shadow-2xl flex items-center gap-2 z-50 w-64">
                <input
                  type="text"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-2 py-1 rounded bg-black/60 border border-white/20 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (customLinkUrl) applyFormat('createLink', customLinkUrl);
                  }}
                  className="px-2.5 py-1 rounded bg-[#0E7A4C] text-[#C8A951] font-bold text-xs"
                >
                  OK
                </button>
              </div>
            )}
          </div>

          {/* Clear Format */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('removeFormat'); }}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 text-xs"
            title="Hapus Pemformatan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TOAST NOTIFICATION                                                     */}
      {/* ========================================================================= */}
      {(toastMsg || publishSuccessMsg) && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0A2116] text-white border border-[#C8A951]/60 shadow-2xl backdrop-blur-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#C8A951] shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-[#C8A951]">{toastMsg || 'Perubahan Berhasil Disimpan!'}</p>
            <p className="text-emerald-100/90 text-[11px]">Tersinkronisasi ke canvas &amp; live preview santri.</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LEFT SIDEBAR: DRAG & DROP SECTIONS REORDER LIST                        */}
      {/* ========================================================================= */}
      {sidebarOpen && (
        <aside className="fixed top-16 left-0 bottom-0 z-40 w-80 bg-[#0A2116]/95 border-r border-white/10 p-4 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C8A951]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Hierarki &amp; Drag Reorder</h3>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 mb-2">
            Geser handle <GripVertical className="w-3 h-3 inline text-[#C8A951]" /> untuk mengatur urutan section website:
          </p>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {sortedSectionEntries.map(([key, sec]) => (
              <div
                key={key}
                draggable
                onDragStart={() => handleDragStartSection(key)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropSection(key)}
                onClick={() => {
                  setActiveSectionId(key);
                  setPropertiesOpen(true);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer ${
                  draggedSecKey === key ? 'opacity-40 border-dashed border-[#C8A951]' : ''
                } ${
                  activeSectionId === key
                    ? 'bg-[#0E7A4C]/30 border-[#C8A951] text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-[#C8A951]">
                    <GripVertical className="w-4 h-4" />
                  </span>
                  <span className="font-bold truncate">{sec.title}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(key);
                    }}
                    className={`p-1 rounded ${sec.isVisible ? 'text-emerald-400' : 'text-zinc-500'}`}
                    title={sec.isVisible ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSectionOrder(key, 'up');
                    }}
                    className="p-1 rounded text-zinc-400 hover:text-white"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSectionOrder(key, 'down');
                    }}
                    className="p-1 rounded text-zinc-400 hover:text-white"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSectionLibraryOpen(true)}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A951] to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Seksi dari Library</span>
          </button>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 5. RIGHT SIDEBAR: CONTEXT-AWARE PROPERTIES PANEL                          */}
      {/* ========================================================================= */}
      {propertiesOpen && currentSection && (
        <aside className="fixed top-16 right-0 bottom-0 z-40 w-84 sm:w-96 bg-[#0A2116]/95 border-l border-white/10 p-5 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C8A951]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Properti: {currentSection.title}
              </h3>
            </div>
            <button
              onClick={() => setPropertiesOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Quick Actions (Reorder, Visibility, Duplicate, Delete) */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase text-zinc-400">Kontrol Seksi Cepat</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => moveSectionOrder(activeSectionId, 'up')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold"
                >
                  <ArrowUp className="w-3 h-3 text-[#C8A951]" />
                  <span>Geser Ke Atas</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveSectionOrder(activeSectionId, 'down')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold"
                >
                  <ArrowDown className="w-3 h-3 text-[#C8A951]" />
                  <span>Geser Ke Bawah</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility(activeSectionId)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold"
                >
                  {currentSection.isVisible ? (
                    <>
                      <EyeOff className="w-3 h-3 text-amber-400" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>Tampilkan</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateSection(activeSectionId)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold"
                >
                  <Copy className="w-3 h-3 text-sky-400" />
                  <span>Duplikasi</span>
                </button>
              </div>
            </div>

            {/* Form Title & Description */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Judul Seksi:</label>
                <input
                  type="text"
                  value={currentSection.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateEditorState((prev) => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        [activeSectionId]: { ...prev.sections[activeSectionId], title: val }
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
                />
              </div>

              {/* Specific Section Controls for Hero Slider */}
              {activeSectionId === 'heroSlider' && (
                <div className="p-3 rounded-xl bg-[#0E7A4C]/10 border border-[#0E7A4C]/30 space-y-3">
                  <span className="font-bold text-[#C8A951] text-[11px] block">Hero Slider Settings</span>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-zinc-300">Auto-play Carousel:</label>
                    <button
                      type="button"
                      onClick={() => setSliderAutoplay(!sliderAutoplay)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        sliderAutoplay ? 'bg-[#0E7A4C] text-[#C8A951]' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {sliderAutoplay ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-zinc-300">Durasi Pergantian:</label>
                    <div className="flex items-center gap-1">
                      {[3, 5, 7].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSliderDuration(dur)}
                          className={`px-2 py-1 rounded font-bold text-xs ${
                            sliderDuration === dur ? 'bg-[#C8A951] text-[#0A2116]' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {dur}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-zinc-300">Efek Transisi:</label>
                    <select
                      value={sliderEffect}
                      onChange={(e) => setSliderEffect(e.target.value as any)}
                      className="px-2 py-1 rounded bg-black/40 border border-white/20 text-xs text-white"
                    >
                      <option value="Coverflow">3D Coverflow</option>
                      <option value="Fade">Smooth Fade</option>
                      <option value="Slide">Slide Horizontal</option>
                    </select>
                  </div>

                  <Link
                    to="/admin/slider"
                    className="w-full py-2 rounded-xl bg-[#0E7A4C] text-[#C8A951] font-bold text-xs flex items-center justify-center gap-1.5 mt-2"
                  >
                    <span>Buka Editor 5 Flyer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Specific Section Controls for Sambutan */}
              {activeSectionId === 'sambutan' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Nama Pimpinan / Pengasuh:</label>
                    <input
                      type="text"
                      value={(currentSection.data as any).pengasuhName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateEditorState((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            sambutan: {
                              ...prev.sections.sambutan,
                              data: { ...prev.sections.sambutan.data, pengasuhName: val }
                            }
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Teks Kalam Sambutan:</label>
                    <textarea
                      rows={3}
                      value={(currentSection.data as any).kalam || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateEditorState((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            sambutan: {
                              ...prev.sections.sambutan,
                              data: { ...prev.sections.sambutan.data, kalam: val }
                            }
                          }
                        }));
                      }}
                      className="w-full p-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingSection({
                    id: activeSectionId,
                    title: currentSection.title,
                    data: currentSection.data
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Buka Form Edit Rinci</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 6. MAIN PREVIEW CANVAS CONTAINER (RESPONSIVE VIEWPORT ENGINE)             */}
      {/* ========================================================================= */}
      <main
        ref={canvasRef}
        className="relative flex flex-1 items-start justify-center overflow-y-auto overflow-x-hidden pt-16 pb-20"
      >
        {/* VIEWPORT MODE: MOBILE (390px iPhone Frame with 5 Hub BottomNav) */}
        {viewportMode === 'mobile' && (
          <div className="w-full flex flex-col items-center py-6 px-2 animate-fade-in">
            <div className="mb-3 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>iPhone Frame • 390 × 844 pt • 5 Hub BottomNav Sticky</span>
            </div>

            <div className="w-[390px] min-w-[390px] max-w-[390px] bg-white dark:bg-slate-900 rounded-[50px] border-[10px] border-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.95)] ring-1 ring-white/10 ring-offset-4 ring-offset-zinc-950 overflow-hidden relative flex flex-col">
              {/* Dynamic Island Notch */}
              <div className="w-full flex justify-center pt-2.5 pb-1 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 text-white pointer-events-none shadow-md">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800" />
                </div>
              </div>

              {/* Mobile Content + Pinned BottomNav */}
              <div className="flex-1 overflow-x-hidden relative pb-20">
                {renderWebsiteContent()}
                <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-auto">
                  <BottomNav />
                </div>
              </div>

              {/* Home Indicator */}
              <div className="w-full py-2 bg-white dark:bg-slate-900 flex justify-center sticky bottom-0 z-50 pointer-events-none">
                <div className="w-32 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT MODE: TABLET (768px iPad Frame) */}
        {viewportMode === 'tablet' && (
          <div className="w-full flex flex-col items-center py-6 px-3 animate-fade-in">
            <div className="mb-3 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <Tablet className="w-3.5 h-3.5 text-emerald-400" />
              <span>iPad Frame • 768 × 1024 pt</span>
            </div>

            <div className="w-[768px] min-w-[768px] max-w-[768px] bg-white dark:bg-slate-900 rounded-[36px] border-[12px] border-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.85)] ring-1 ring-white/10 ring-offset-4 ring-offset-zinc-950 overflow-hidden relative flex flex-col">
              <div className="w-full flex justify-center py-2 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
              </div>

              <div className="flex-1 overflow-x-hidden">
                {renderWebsiteContent()}
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT MODE: DESKTOP (100% Fluid Full Screen Mirroring) */}
        {viewportMode === 'desktop' && (
          <div className="w-full max-w-full min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden relative animate-fade-in">
            <div className="w-full bg-zinc-900/60 border-b border-white/5 py-1 px-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Mode Pratinjau Interaktif Desktop (100% Responsif)</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Klik teks untuk edit langsung</span>
                <span>•</span>
                <span>Klik gambar untuk membuka Image Editor Pro</span>
              </div>
            </div>
            {renderWebsiteContent()}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 7. IMAGE EDITOR PRO MODAL (WITH WEBP COMPRESSOR & SLIDERS)                */}
      {/* ========================================================================= */}
      {imageModalOpen && selectedImageTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0A2116] border border-[#C8A951]/50 p-6 text-white shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C8A951]" />
                <h3 className="font-extrabold text-sm text-white">Image Editor Pro (WebP Compressor)</h3>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Preview Box with Sliders Applied */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400">Pratinjau Hasil Desain:</span>
              <div
                className="w-full h-44 rounded-2xl bg-black/50 overflow-hidden border border-white/10 flex items-center justify-center relative"
                style={{
                  borderRadius: `${imgRounded}px`,
                  opacity: imgOpacity / 100
                }}
              >
                {newImageUrl ? (
                  <img
                    src={newImageUrl}
                    alt={imgAltText || 'Preview'}
                    className={`w-full h-full object-${imgObjectFit} transition-all`}
                  />
                ) : (
                  <span className="text-xs text-zinc-500">Tidak ada gambar</span>
                )}

                {/* Overlay color & opacity preview */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: imgOverlayColor,
                    opacity: imgOverlayOpacity / 100
                  }}
                />
              </div>
            </div>

            {/* Sliders: Rounded, Opacity, Shadow, Object Fit */}
            <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-2xl border border-white/10 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-300 flex justify-between">
                  <span>Rounded Corner:</span>
                  <span className="text-[#C8A951]">{imgRounded}px</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={imgRounded}
                  onChange={(e) => setImgRounded(Number(e.target.value))}
                  className="w-full accent-[#0E7A4C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-300 flex justify-between">
                  <span>Opacity Gambar:</span>
                  <span className="text-[#C8A951]">{imgOpacity}%</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={imgOpacity}
                  onChange={(e) => setImgOpacity(Number(e.target.value))}
                  className="w-full accent-[#0E7A4C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-300 block mb-1">Object Fit:</label>
                <div className="flex items-center gap-1">
                  {(['cover', 'contain'] as const).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setImgObjectFit(fit)}
                      className={`flex-1 py-1 rounded text-xs font-bold uppercase ${
                        imgObjectFit === fit ? 'bg-[#0E7A4C] text-[#C8A951]' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-300 flex justify-between">
                  <span>Overlay Color Opacity:</span>
                  <span className="text-[#C8A951]">{imgOverlayOpacity}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={90}
                  value={imgOverlayOpacity}
                  onChange={(e) => setImgOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-[#C8A951]"
                />
              </div>
            </div>

            {/* Input URL & Upload WebP */}
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">URL Gambar:</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  Upload dari Komputer (Auto-Compress WebP):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0E7A4C] file:text-[#C8A951]"
                />
              </div>

              {compressionResult && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>Kompresi WebP Berhasil!</span>
                  <span className="font-bold">
                    {compressionResult.originalSizeKB} KB ➔ {compressionResult.compressedSizeKB} KB (Hemat{' '}
                    {compressionResult.savedPercent}%)
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10"
              >
                Hapus Gambar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyImageReplace}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#0E7A4C] text-[#C8A951] hover:bg-[#128a57] shadow-md border border-[#C8A951]/40"
                >
                  Terapkan Gambar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SECTION LIBRARY MODAL (21 KOMPONEN LENGKAP)                            */}
      {/* ========================================================================= */}
      {sectionLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-3xl bg-[#0A2116] border border-[#C8A951]/50 p-6 text-white shadow-2xl flex flex-col max-h-[85vh] animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0E7A4C] text-[#C8A951] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Section Library PPJM (21 Komponen)</h3>
                  <p className="text-xs text-zinc-400">Pilih komponen untuk langsung disisipkan ke tata letak website.</p>
                </div>
              </div>
              <button
                onClick={() => setSectionLibraryOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-1">
              {SECTION_LIBRARY.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleAddSectionFromLibrary(item)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8A951] hover:bg-[#0E7A4C]/20 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#0E7A4C] text-[#C8A951] flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white group-hover:text-[#C8A951] mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#C8A951]">
                      <span>+ Tambahkan Seksi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SECTION DETAIL FORM MODAL (POPUP PROPERTI)                            */}
      {/* ========================================================================= */}
      {editingSection && (
        <EditContentModal
          isOpen={!!editingSection}
          sectionTitle={editingSection.title}
          data={editingSection.data}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSectionContent}
        />
      )}

      {/* ========================================================================= */}
      {/* 10. RESET CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#0A2116] border border-amber-500/40 p-5 text-white shadow-2xl space-y-3">
            <h3 className="font-extrabold text-sm text-amber-400">Konfirmasi Reset Pengaturan</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Apakah Anda yakin ingin mengembalikan tata letak dan seluruh komponen ke pengaturan awal bawaan pondok? Draf yang belum disimpan akan digantikan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  /**
   * Helper function to render the complete public website layout 1:1
   * wrapped with modular interactive editor boundaries
   */
  function renderWebsiteContent() {
    return (
      <div className="space-y-2 sm:space-y-3 pb-8">
        
        {/* ============================================================ */}
        {/* 1. PUBLIC NAVBAR HEADER */}
        {/* ============================================================ */}
        {editorState.sections.navbar?.isVisible && (
          <EditorSectionWrapper
            id="navbar"
            title="Header Navigasi Web (9 Pilar)"
            description="Logo pesantren, 9 pilar navigasi publik & profil pill"
            isVisible={editorState.sections.navbar.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('navbar')}
            onEditContent={() => {
              setActiveSectionId('navbar');
              setPropertiesOpen(true);
            }}
          >
            <Navbar />
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 2. HERO COVERFLOW CAROUSEL */}
        {/* ============================================================ */}
        {editorState.sections.heroSlider?.isVisible && (
          <EditorSectionWrapper
            id="heroSlider"
            title="Hero Coverflow Slider (5 Flyer)"
            description="Banner flyer 3D coverflow interaktif"
            isVisible={editorState.sections.heroSlider.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('heroSlider')}
            onEditContent={() => {
              setActiveSectionId('heroSlider');
              setPropertiesOpen(true);
            }}
          >
            <div
              onClick={() => {
                setActiveSectionId('heroSlider');
                setPropertiesOpen(true);
              }}
              className="cursor-pointer"
            >
              <HeroSlider />
            </div>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 3. QUICK MENU MOBILE (2x4 Grid) */}
        {/* ============================================================ */}
        {editorState.sections.quickMenu?.isVisible && (
          <EditorSectionWrapper
            id="quickMenu"
            title="Quick Menu Mobile (8 Tombol)"
            description="Menu navigasi cepat 8 kartu di layar mobile dan tablet"
            isVisible={editorState.sections.quickMenu.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('quickMenu')}
            onEditContent={() => {
              setActiveSectionId('quickMenu');
              setPropertiesOpen(true);
            }}
          >
            <div
              onClick={() => {
                setActiveSectionId('quickMenu');
                setPropertiesOpen(true);
              }}
              className="relative cursor-pointer"
            >
              <QuickMenu />
              {!isPublicPreview && viewportMode === 'desktop' && (
                <div className="px-4 py-1 text-[11px] text-[#C8A951] font-mono text-center">
                  💡 QuickMenu otomatis aktif di layar HP / Tablet. Beralih ke switcher "HP" di atas untuk simulasikan interaksi.
                </div>
              )}
            </div>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 4. KALAM & SAMBUTAN SINGKAT PENGASUH */}
        {/* ============================================================ */}
        {editorState.sections.sambutan?.isVisible && (
          <EditorSectionWrapper
            id="sambutan"
            title="Kalam Sambutan Pengasuh"
            description="Pesan keteladanan KH. M. Jauharul Maknuun"
            isVisible={editorState.sections.sambutan.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('sambutan')}
            onEditContent={() => {
              setActiveSectionId('sambutan');
              setPropertiesOpen(true);
            }}
          >
            <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-0.5">
              <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 lg:p-4 shadow-m3-1 border border-slate-200/90 relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3.5 items-center">
                  
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative">
                      <div
                        onClick={() => openImageModal('sambutan', editorState.sections.sambutan.data.imageUrl, 'imageUrl')}
                        className="w-40 h-48 sm:w-52 sm:h-60 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-50 bg-slate-100 cursor-pointer group relative"
                        title="Klik untuk membuka Image Editor Pro foto Pengasuh"
                      >
                        <img
                          src={editorState.sections.sambutan.data.imageUrl}
                          alt="Pengasuh PP Jauharul Maknuun"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {!isPublicPreview && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded-md">
                              Edit Gambar Pro
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#0A2116] text-[#C8A951] px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md whitespace-nowrap border border-[#C8A951]/40">
                        {editorState.sections.sambutan.data.title}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-2.5 text-center lg:text-left">
                    <span className="text-xs sm:text-sm font-bold text-amber-700 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Kalam Hikmah & Ma'had Barokah
                    </span>
                    
                    <h2
                      contentEditable={!isPublicPreview}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const text = e.currentTarget.textContent || '';
                        updateEditorState((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            sambutan: {
                              ...prev.sections.sambutan,
                              data: { ...prev.sections.sambutan.data, pengasuhName: text }
                            }
                          }
                        }));
                        showToast('Nama pengasuh berhasil diperbarui');
                      }}
                      className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-950 focus:outline-dashed focus:outline-2 focus:outline-[#C8A951] p-1 rounded"
                    >
                      {editorState.sections.sambutan.data.pengasuhName}
                    </h2>
                    
                    <p className="text-sm sm:text-base font-bold text-emerald-800">
                      Mudir &amp; Pengasuh Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
                    </p>
                    
                    <blockquote
                      contentEditable={!isPublicPreview}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const text = e.currentTarget.textContent || '';
                        updateEditorState((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            sambutan: {
                              ...prev.sections.sambutan,
                              data: { ...prev.sections.sambutan.data, kalam: text }
                            }
                          }
                        }));
                        showToast('Kalam hikmah berhasil diperbarui');
                      }}
                      className="text-sm sm:text-base lg:text-lg text-slate-800 font-medium italic leading-relaxed sm:leading-loose border-l-0 lg:border-l-4 lg:border-emerald-700 lg:pl-4 focus:outline-dashed focus:outline-2 focus:outline-[#C8A951] p-1 rounded"
                    >
                      “{editorState.sections.sambutan.data.kalam}”
                    </blockquote>
                  </div>

                </div>
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 5. EMPAT PILAR PENDIDIKAN PESANTREN */}
        {/* ============================================================ */}
        {editorState.sections.programUnggulan?.isVisible && (
          <EditorSectionWrapper
            id="programUnggulan"
            title="Empat Pilar Pendidikan PPJM"
            description="Pilar: Turats Salaf, Tahfidz AI, Lab STEM, Mandarin & Arab"
            isVisible={editorState.sections.programUnggulan.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('programUnggulan')}
            onEditContent={() => {
              setActiveSectionId('programUnggulan');
              setPropertiesOpen(true);
            }}
          >
            <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 space-y-2 sm:space-y-3">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">
                  Karakteristik &amp; Keistimewaan
                </span>
                <h2
                  contentEditable={!isPublicPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const text = e.currentTarget.textContent || '';
                    updateEditorState((prev) => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        programUnggulan: {
                          ...prev.sections.programUnggulan,
                          data: { ...prev.sections.programUnggulan.data, headline: text }
                        }
                      }
                    }));
                  }}
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 focus:outline-dashed focus:outline-2 focus:outline-[#C8A951] p-1 rounded"
                >
                  {editorState.sections.programUnggulan.data.headline}
                </h2>
                <p
                  contentEditable={!isPublicPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const text = e.currentTarget.textContent || '';
                    updateEditorState((prev) => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        programUnggulan: {
                          ...prev.sections.programUnggulan,
                          data: { ...prev.sections.programUnggulan.data, subheadline: text }
                        }
                      }
                    }));
                  }}
                  className="text-sm sm:text-base text-slate-700 font-medium focus:outline-dashed focus:outline-2 focus:outline-[#C8A951] p-1 rounded"
                >
                  {editorState.sections.programUnggulan.data.subheadline}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {editorState.sections.programUnggulan.data.items.map((item) => (
                  <EditorItemWrapper
                    key={item.id}
                    itemId={item.id}
                    itemTitle={item.name}
                    isVisible={item.isVisible}
                    isPublicPreview={isPublicPreview}
                    onToggleVisibility={() => toggleItemVisibility('programUnggulan', item.id)}
                  >
                    <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-300 transition-all group flex flex-col justify-between h-full">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-[#0E7A4C] group-hover:text-[#C8A951] transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.tag}
                        </span>
                        <h3 className="font-black text-base sm:text-lg text-emerald-950">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950">
                        <span>Rincian Jenjang</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 6. WARTA & BERITA TERKINI */}
        {/* ============================================================ */}
        {editorState.sections.beritaTerkini?.isVisible && (
          <EditorSectionWrapper
            id="beritaTerkini"
            title="Warta & Berita Santri Terkini"
            description="Kabar aktual, liputan kajian, dan agenda pesantren"
            isVisible={editorState.sections.beritaTerkini.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('beritaTerkini')}
            onEditContent={() => {
              setActiveSectionId('beritaTerkini');
              setPropertiesOpen(true);
            }}
          >
            <section id="warta-berita" className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 space-y-2 sm:space-y-3 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">
                    Kabar Pesantren
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950">
                    {editorState.sections.beritaTerkini.data.headline}
                  </h2>
                </div>
                <Link
                  to="/jm-news"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950"
                >
                  <span>Lihat Semua Berita</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4">
                {editorState.sections.beritaTerkini.data.items.map((news) => (
                  <EditorItemWrapper
                    key={news.id}
                    itemId={news.id}
                    itemTitle={news.title}
                    isVisible={news.isVisible}
                    isPinned={news.isPinned}
                    isPublicPreview={isPublicPreview}
                    onToggleVisibility={() => toggleItemVisibility('beritaTerkini', news.id)}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-300 transition-all flex flex-col group h-full">
                      <div
                        onClick={() => openImageModal('beritaTerkini', news.thumbnail, 'thumbnail')}
                        className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer"
                        title="Klik untuk membuka Image Editor Pro thumbnail berita"
                      >
                        <img
                          src={news.thumbnail}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#0A2116] text-[#C8A951] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-[#C8A951]/40">
                          {news.category}
                        </span>
                        {news.isPinned && (
                          <span className="absolute top-2.5 right-2.5 bg-[#C8A951] text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            ⭐ Tersemat
                          </span>
                        )}
                      </div>

                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{news.date}</span>
                          </div>
                          <h3 className="font-black text-sm sm:text-base text-emerald-950 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                            {news.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 leading-relaxed">
                            {news.summary}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            to={news.link || '/'}
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-800 hover:text-emerald-950"
                          >
                            <span>Baca Detail</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleShareWA(news)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0E7A4C] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Bagikan ke WhatsApp Wali Santri"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WA</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 7. PRESTASI & KEJUARAAN SANTRI */}
        {/* ============================================================ */}
        {editorState.sections.prestasi?.isVisible && (
          <EditorSectionWrapper
            id="prestasi"
            title="Prestasi & Kejuaraan Santri"
            description="Prestasi kitab kuning, MTQ, dan robotika santri"
            isVisible={editorState.sections.prestasi.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('prestasi')}
            onEditContent={() => {
              setActiveSectionId('prestasi');
              setPropertiesOpen(true);
            }}
          >
            <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2">
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0A2116] via-[#0E7A4C]/10 to-[#C8A951]/10 border border-[#C8A951]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#C8A951] text-[#0A2116] flex items-center justify-center font-bold">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {editorState.sections.prestasi.data.headline}
                      </h3>
                      <p className="text-xs text-slate-500">Capaian membanggakan santri di tingkat daerah &amp; nasional</p>
                    </div>
                  </div>
                  <Link to="/prestasi" className="text-xs font-bold text-emerald-700 hover:underline">
                    Lihat Semua &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {editorState.sections.prestasi.data.items.map((pres) => (
                    <div key={pres.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C8A951]/20 text-[#C8A951]">
                        {pres.juara} • {pres.tingkat}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {pres.kejuaraan}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">Peraih: {pres.santri} ({pres.tahun})</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 8. FOOTER RESMI PESANTREN */}
        {/* ============================================================ */}
        {editorState.sections.footer?.isVisible && (
          <EditorSectionWrapper
            id="footer"
            title="Footer & Kontak Resmi"
            description="Alamat resmi, WhatsApp call center & copyright"
            isVisible={editorState.sections.footer.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('footer')}
            onEditContent={() => {
              setActiveSectionId('footer');
              setPropertiesOpen(true);
            }}
          >
            <footer className="bg-[#0A2116] text-emerald-100 pt-8 pb-16 px-4 sm:px-6 border-t-4 border-[#C8A951]">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-emerald-900/80">
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white text-[#0A2116] font-black flex items-center justify-center text-xs">
                      JM
                    </div>
                    <span className="font-black text-base text-[#C8A951]">Pondok Pesantren Jauharul Maknuun</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed max-w-md">
                    {editorState.sections.footer.data.alamat}
                  </p>
                </div>
                <div className="md:col-span-6 flex flex-col md:items-end justify-center space-y-1 text-xs text-emerald-200">
                  <p>WhatsApp: <span className="font-bold text-[#C8A951]">{editorState.sections.footer.data.whatsapp}</span></p>
                  <p>Email: <span>{editorState.sections.footer.data.email}</span></p>
                </div>
              </div>
              <div className="max-w-7xl mx-auto pt-4 text-center text-[11px] text-emerald-300/70">
                {editorState.sections.footer.data.copyright}
              </div>
            </footer>
          </EditorSectionWrapper>
        )}
      </div>
    );
  }
};

export default WebVisualEditor;
