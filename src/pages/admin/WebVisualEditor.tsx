import React, { useState, useEffect, useRef } from 'react';
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
  Check
} from 'lucide-react';

import { PageEditorState, INITIAL_EDITOR_STATE, NewsItem, QuickMenuItem } from '../../types/EditorState';
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

export const WebVisualEditor: React.FC = () => {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<PageEditorState>(loadEditorState);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isPublicPreview, setIsPublicPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');

  // Active section for properties panel
  const [activeSectionId, setActiveSectionId] = useState<string>('heroSlider');

  // Active section modal editing state (dialog)
  const [editingSection, setEditingSection] = useState<{ id: string; title: string; data: any } | null>(null);

  // Floating selection toolbar
  const [floatingToolbarPos, setFloatingToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Image Upload / Replace Modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageTarget, setSelectedImageTarget] = useState<{ sectionId: string; currentUrl: string; fieldName: string } | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [compressingImage, setCompressingImage] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Listen to text selection in visual mode for floating toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isPublicPreview) {
        setFloatingToolbarPos(null);
        return;
      }
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setFloatingToolbarPos(null);
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.top > 0) {
          setFloatingToolbarPos({
            top: Math.max(70, rect.top - 48),
            left: Math.max(16, rect.left + rect.width / 2 - 120),
          });
        }
      } catch {
        setFloatingToolbarPos(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isPublicPreview]);

  // Section toggle visibility
  const toggleSectionVisibility = (sectionKey: keyof PageEditorState['sections']) => {
    setEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          isVisible: !prev.sections[sectionKey].isVisible,
        },
      },
    }));
    showToast(`Visibilitas seksi diperbarui`);
  };

  // Section item toggle visibility
  const toggleItemVisibility = (
    sectionKey: 'beritaTerkini' | 'programUnggulan' | 'quickMenu' | 'prestasi' | 'ekskul' | 'osis' | 'agenda' | 'galeri',
    itemId: string
  ) => {
    setEditorState((prev) => {
      const section = prev.sections[sectionKey];
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
              items: updatedItems,
            },
          },
        },
      };
    });
    showToast(`Status item diperbarui`);
  };

  // Section order reorder
  const moveSectionOrder = (sectionKey: keyof PageEditorState['sections'], direction: 'up' | 'down') => {
    setEditorState((prev) => {
      const currentOrder = prev.sections[sectionKey].order;
      const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            order: newOrder,
          },
        },
      };
    });
    showToast(`Urutan seksi berhasil dipindahkan`);
  };

  // Handle section content save from modal
  const handleSaveSectionContent = (updatedData: any) => {
    if (!editingSection) return;
    const sectionKey = editingSection.id as keyof PageEditorState['sections'];
    setEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          data: updatedData,
        },
      },
    }));
    showToast(`Konten seksi "${editingSection.title}" berhasil disimpan`);
  };

  // Duplicate section simulation
  const handleDuplicateSection = (sectionKey: string) => {
    showToast(`Seksi ${sectionKey} berhasil diduplikasi ke draf`);
  };

  // Delete section simulation
  const handleDeleteSection = (sectionKey: keyof PageEditorState['sections']) => {
    setEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          isVisible: false,
        },
      },
    }));
    showToast(`Seksi disembunyikan/dihapus dari tampilan`);
  };

  // Handle Publish Action
  const handlePublish = async () => {
    const res = await publishEditorState(editorState);
    if (res.success) {
      setPublishSuccessMsg(true);
      setTimeout(() => setPublishSuccessMsg(false), 3500);
      showToast('Berhasil disimpan & dipublikasikan ke website publik!');
    }
  };

  // Handle Reset to Default
  const handleReset = () => {
    const defaultState = resetEditorStateToDefault();
    setEditorState(defaultState);
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
      tanggal: news.date,
    });
    window.open(url, '_blank');
  };

  // Inline formatting commands
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    setFloatingToolbarPos(null);
  };

  // Handle Image Replace from file upload with WebP compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingImage(true);
    try {
      const res = await compressImageToWebP(file, 1200, 1200, 0.85);
      setCompressionResult(res);
      setNewImageUrl(res.previewUrl);
    } catch {
      alert('Gagal mengompres gambar.');
    } finally {
      setCompressingImage(false);
    }
  };

  const handleApplyImageReplace = () => {
    if (!selectedImageTarget || !newImageUrl) return;

    const { sectionId, fieldName } = selectedImageTarget;
    const secKey = sectionId as keyof PageEditorState['sections'];

    if (editorState.sections[secKey]) {
      setEditorState((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [secKey]: {
            ...prev.sections[secKey],
            data: {
              ...prev.sections[secKey].data,
              [fieldName]: newImageUrl,
            },
          },
        },
      }));
    }

    setImageModalOpen(false);
    setSelectedImageTarget(null);
    setNewImageUrl('');
    setCompressionResult(null);
    showToast('Foto berhasil diganti dengan WebP terkompresi');
  };

  const openImageModal = (sectionId: string, currentUrl: string, fieldName: string) => {
    if (isPublicPreview) return;
    setSelectedImageTarget({ sectionId, currentUrl, fieldName });
    setNewImageUrl(currentUrl);
    setImageModalOpen(true);
  };

  const currentSection = editorState.sections[activeSectionId as keyof PageEditorState['sections']];

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#09090b] font-sans text-zinc-100 antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* 1. TOP APP BAR (Modern Islamic Emerald & Gold Shell) */}
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
                  <Sparkles className="w-2.5 h-2.5 text-[#C8A951]" /> Zero-IT Sandbox
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-emerald-200/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Otomatis tersimpan ({lastSavedTime})</span>
            </div>
          </div>
        </div>

        {/* Viewport Switcher Toolbar (Mobile 390px, Tablet 768px, Desktop 100% Fluid) */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Simulasikan Tampilan Layar HP (390px - Mobile)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode('tablet')}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Simulasikan Tampilan Layar Tablet (768px - Tablet)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tampilan Layar Penuh Desktop (100% Fluid)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">
          
          {/* Sidebar Menu Grouping Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition cursor-pointer ${
              sidebarOpen
                ? 'border-[#0E7A4C] bg-[#0E7A4C]/30 text-[#C8A951]'
                : 'border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title="Buka Menu Modul CMS & Hierarki"
          >
            <Layers className="w-3.5 h-3.5 text-[#C8A951]" />
            <span className="hidden md:inline">Modul CMS</span>
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

          {/* Toggle Public Preview Mode vs Editor Overlay Mode */}
          <button
            type="button"
            onClick={() => setIsPublicPreview(!isPublicPreview)}
            className={`flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition cursor-pointer ${
              isPublicPreview
                ? 'bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/40'
                : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isPublicPreview ? 'Kembali ke Mode Edit Visual' : 'Pratinjau Murni Sebagai Pengunjung Publik'}
          >
            {isPublicPreview ? <EyeOff className="w-3.5 h-3.5 text-[#C8A951]" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPublicPreview ? 'Keluar Preview' : 'Mode Preview'}</span>
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
            <span>Simpan</span>
          </button>
        </div>
      </header>

      {/* 2. FLOATING TEXT FORMATTING TOOLBAR */}
      {floatingToolbarPos && !isPublicPreview && (
        <div
          style={{ top: floatingToolbarPos.top, left: floatingToolbarPos.left }}
          className="fixed z-50 flex items-center gap-1 p-1 rounded-xl bg-zinc-900/95 text-white border border-[#C8A951]/40 shadow-2xl backdrop-blur-md animate-fade-in"
        >
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold"
            title="Tebal (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold"
            title="Miring (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = prompt('Masukkan tautan URL:');
              if (url) applyFormat('createLink', url);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold"
            title="Sisipkan Tautan (Link)"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('foreColor', '#C8A951')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold text-[#C8A951]"
            title="Warna Emas PPJM"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => applyFormat('foreColor', '#0E7A4C')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-bold text-[#0E7A4C]"
            title="Warna Hijau Islami"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => applyFormat('removeFormat')}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 text-xs"
            title="Hapus Format"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. TOAST NOTIFICATION */}
      {(toastMsg || publishSuccessMsg) && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0A2116] text-white border border-[#C8A951]/60 shadow-2xl backdrop-blur-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#C8A951] shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-[#C8A951]">{toastMsg || 'Perubahan Berhasil Disimpan!'}</p>
            <p className="text-emerald-100/90 text-[11px]">Tersinkronisasi ke live preview santri.</p>
          </div>
        </div>
      )}

      {/* 4. LEFT SIDEBAR: 6 GROUPING MODUL CMS LENGKAP */}
      {sidebarOpen && (
        <aside className="fixed top-16 left-0 bottom-0 z-40 w-80 bg-[#0A2116]/95 border-r border-white/10 p-4 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C8A951]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Modul Editor PPJM</h3>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* GROUP 1: BERANDA & NAVIGASI */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951]">
                1. Beranda &amp; Navigasi
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin/slider"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Kelola Poster Slider (5 Flyer)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSectionId('quickMenu');
                    setPropertiesOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition text-left"
                >
                  <span>QuickMenu Mobile (8 Tombol)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* GROUP 2: JM CENTER */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951]">
                2. JM Center
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin/profil"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Profil &amp; Sambutan KH. M. Jauharul Maknuun</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/profil?tab=fasilitas"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Fasilitas (Pondok, Sekolah &amp; Lab STEM)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/profil?tab=lembaga"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Lembaga Pesantren &amp; SMP Plus</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </div>
            </div>

            {/* GROUP 3: PROGRAM */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951]">
                3. Program Unggulan
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin/program"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Pondok 4 Program + Jadwal 24 Jam</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/program"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Flyer Madin Kitab Turats (Unduh &amp; Share)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </div>
            </div>

            {/* GROUP 4: SMART JM */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951]">
                4. SMART JM
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin/stem"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>STEM: IoT ESP32 Hidroponik &amp; Nanofiltrasi</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/mandarin"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Mandarin: Audio HSK &amp; Kuis Gamifikasi Confetti</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/hafidz"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Tahfidz: Monitoring 114 Surat &amp; Murojaah AI</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </div>
            </div>

            {/* GROUP 5: KONTEN */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951]">
                5. Konten &amp; Komunitas
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin/berita"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Warta Pesantren (Broadcast WA)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/galeri"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Galeri Foto WebP &amp; Video YouTube</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/prestasi"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Prestasi Santri (Filter Kategori/Tahun)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/ekskul"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Ekskul (Sains, Olahraga, Seni, Agama, Pramuka)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/osis"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>OSIS: Presidium, BPH &amp; 5 Departemen</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/agenda"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Agenda &amp; Kalender Bulanan Interaktif</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </div>
            </div>

            {/* GROUP 6: SISTEM */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8A951]">
                6. Sistem &amp; Keamanan
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin/kontak"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Kontak &amp; Medsos Pop-up 7 Kanal</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/admin/akun"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#0E7A4C]/30 text-zinc-300 hover:text-white transition"
                >
                  <span>Akun RBAC &amp; Kredensial 4 Peran</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 5. RIGHT SIDEBAR: CONTEXT-AWARE PROPERTIES PANEL */}
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
              <span className="text-[10px] font-bold uppercase text-zinc-400">Kontrol Seksi</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => moveSectionOrder(activeSectionId as any, 'up')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold"
                >
                  <ArrowUp className="w-3 h-3 text-[#C8A951]" />
                  <span>Ke Atas</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveSectionOrder(activeSectionId as any, 'down')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold"
                >
                  <ArrowDown className="w-3 h-3 text-[#C8A951]" />
                  <span>Ke Bawah</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility(activeSectionId as any)}
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
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1 font-bold text-sky-400"
                >
                  <Copy className="w-3 h-3" />
                  <span>Duplikat</span>
                </button>
              </div>
            </div>

            {/* Context-Aware Form Fields based on active section */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Judul Seksi:</label>
                <input
                  type="text"
                  value={currentSection.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditorState((prev) => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        [activeSectionId]: {
                          ...prev.sections[activeSectionId as keyof PageEditorState['sections']],
                          title: val,
                        },
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Deskripsi Ringkas:</label>
                <textarea
                  rows={2}
                  value={currentSection.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditorState((prev) => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        [activeSectionId]: {
                          ...prev.sections[activeSectionId as keyof PageEditorState['sections']],
                          description: val,
                        },
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
                />
              </div>

              {/* Specific Section Properties */}
              {activeSectionId === 'heroSlider' && (
                <div className="p-3 rounded-xl bg-[#0E7A4C]/10 border border-[#0E7A4C]/30 space-y-2">
                  <span className="font-bold text-[#C8A951] text-[11px] block">Hero Slider Settings</span>
                  <p className="text-[11px] text-emerald-100/80">
                    Menampilkan 5 flyer interaktif coverflow dengan putar otomatis dan tautan jelajah.
                  </p>
                  <Link
                    to="/admin/slider"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E7A4C] text-[#C8A951] font-bold text-xs"
                  >
                    <span>Buka Editor 5 Flyer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {activeSectionId === 'sambutan' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Nama Pimpinan / Pengasuh:</label>
                    <input
                      type="text"
                      value={(currentSection.data as any).pengasuhName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditorState((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            sambutan: {
                              ...prev.sections.sambutan,
                              data: { ...prev.sections.sambutan.data, pengasuhName: val },
                            },
                          },
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Teks Kalam Sambutan:</label>
                    <textarea
                      rows={4}
                      value={(currentSection.data as any).kalam || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditorState((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            sambutan: {
                              ...prev.sections.sambutan,
                              data: { ...prev.sections.sambutan.data, kalam: val },
                            },
                          },
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951]"
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
                    data: currentSection.data,
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

      {/* 6. MAIN PREVIEW CANVAS CONTAINER */}
      <main
        ref={canvasRef}
        className="relative flex flex-1 items-start justify-center overflow-y-auto overflow-x-hidden pt-16 pb-20"
      >
        {/* VIEWPORT MODE: MOBILE (390px iPhone Frame) */}
        {viewportMode === 'mobile' && (
          <div className="w-full flex flex-col items-center py-6 px-2 animate-fade-in">
            <div className="mb-3 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>iPhone Viewport • 390 × 844 pt</span>
            </div>

            <div className="w-[390px] min-w-[390px] max-w-[390px] bg-white dark:bg-slate-900 rounded-[50px] border-[10px] border-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.95)] ring-1 ring-white/10 ring-offset-4 ring-offset-zinc-950 overflow-hidden relative flex flex-col">
              <div className="w-full flex justify-center pt-2.5 pb-1 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 text-white pointer-events-none shadow-md">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800" />
                </div>
              </div>

              <div className="flex-1 overflow-x-hidden">
                {renderWebsiteContent()}
              </div>

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
              <span>iPad Viewport • 768 × 1024 pt</span>
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
                <span>Klik teks untuk mengedit langsung</span>
                <span>•</span>
                <span>Klik gambar untuk mengganti</span>
              </div>
            </div>
            {renderWebsiteContent()}
          </div>
        )}
      </main>

      {/* 7. FLOATING WHATSAPP HELP BUTTON */}
      <a
        href="https://wa.me/6285646199273?text=Halo%20Admin%20IT%20PPJM,%20saya%20butuh%20panduan%20menggunakan%20Live%20WYSIWYG%20Editor"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-extrabold text-xs shadow-2xl border border-[#C8A951]/40 backdrop-blur-md active:scale-95 transition"
        title="Butuh Bantuan? Hubungi Tim IT / Mudir via WhatsApp"
      >
        <MessageSquare className="w-4 h-4 text-[#C8A951]" />
        <span className="hidden sm:inline">Bantuan WA</span>
      </a>

      {/* 8. IMAGE REPLACE / WEBP AUTO-COMPRESSION MODAL */}
      {imageModalOpen && selectedImageTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0A2116] border border-[#C8A951]/40 p-5 text-white shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C8A951]" />
                <h3 className="font-extrabold text-sm text-white">Ganti Gambar (WebP Auto-Compressor)</h3>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Image Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400">Pratinjau Gambar Terpilih:</span>
              <div className="w-full h-40 rounded-xl bg-black/50 overflow-hidden border border-white/10 flex items-center justify-center">
                {newImageUrl ? (
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-500">Tidak ada gambar</span>
                )}
              </div>
            </div>

            {/* Upload or URL input */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Upload File Lokal (Kompresi WebP Otomatis):</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0E7A4C] file:text-[#C8A951] hover:file:bg-[#128a57] file:cursor-pointer"
                />
              </div>

              {compressingImage && (
                <div className="text-xs text-emerald-300 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Mengompresi ke format WebP hemat daya...</span>
                </div>
              )}

              {compressionResult && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200">
                  <p className="font-bold">✓ Kompresi Berhasil:</p>
                  <p>Ukuran: {compressionResult.originalSizeKB} KB &rarr; {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)</p>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Atau Masukkan URL Gambar Langsung:</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C8A951] text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
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
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#0E7A4C] text-[#C8A951] hover:bg-[#128a57] shadow-md border border-[#C8A951]/40"
              >
                Terapkan Gambar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. SECTION DETAIL FORM MODAL */}
      {editingSection && (
        <EditContentModal
          isOpen={!!editingSection}
          sectionTitle={editingSection.title}
          data={editingSection.data}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSectionContent}
        />
      )}

      {/* 10. RESET CONFIRMATION MODAL */}
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

        {/* ============================================================ */}
        {/* 2. HERO COVERFLOW CAROUSEL */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* 3. QUICK MENU MOBILE (2x4 Grid) */}
        {/* ============================================================ */}
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
                💡 QuickMenu otomatis aktif di layar HP / Tablet. Beralih ke switcher "Mobile" di atas untuk simulasikan interaksi.
              </div>
            )}
          </div>
        </EditorSectionWrapper>

        {/* Divider Spacing Halus untuk Desktop */}
        <div className="hidden lg:block h-1" />

        {/* ============================================================ */}
        {/* 4. KALAM & SAMBUTAN SINGKAT PENGASUH KH. M. JAUHARUL MAKNUUN */}
        {/* ============================================================ */}
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
                      title="Klik untuk mengganti foto Mudir KH. M. Jauharul Maknuun"
                    >
                      <img
                        src={editorState.sections.sambutan.data.imageUrl}
                        alt="Pengasuh PP Jauharul Maknuun"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {!isPublicPreview && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded-md">
                            Ganti Foto
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
                      setEditorState((prev) => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          sambutan: {
                            ...prev.sections.sambutan,
                            data: { ...prev.sections.sambutan.data, pengasuhName: text },
                          },
                        },
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
                      setEditorState((prev) => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          sambutan: {
                            ...prev.sections.sambutan,
                            data: { ...prev.sections.sambutan.data, kalam: text },
                          },
                        },
                      }));
                      showToast('Kalam hikmah berhasil diperbarui');
                    }}
                    className="text-sm sm:text-base lg:text-lg text-slate-800 font-medium italic leading-relaxed sm:leading-loose border-l-0 lg:border-l-4 lg:border-emerald-700 lg:pl-4 focus:outline-dashed focus:outline-2 focus:outline-[#C8A951] p-1 rounded"
                  >
                    “{editorState.sections.sambutan.data.kalam}”
                  </blockquote>
                  
                  <div className="pt-2">
                    <Link
                      to="/jm-center/sambutan"
                      className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
                    >
                      <span>Baca Selengkapnya Sambutan Pengasuh</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </EditorSectionWrapper>

        {/* ============================================================ */}
        {/* 5. EMPAT PILAR PENDIDIKAN PESANTREN */}
        {/* ============================================================ */}
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
                  setEditorState((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      programUnggulan: {
                        ...prev.sections.programUnggulan,
                        data: { ...prev.sections.programUnggulan.data, headline: text },
                      },
                    },
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
                  setEditorState((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      programUnggulan: {
                        ...prev.sections.programUnggulan,
                        data: { ...prev.sections.programUnggulan.data, subheadline: text },
                      },
                    },
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

        {/* ============================================================ */}
        {/* 6. WARTA & BERITA TERKINI */}
        {/* ============================================================ */}
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
                      title="Klik untuk mengganti thumbnail berita"
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

        {/* ============================================================ */}
        {/* 7. PRESTASI & KEJUARAAN SANTRI */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* 8. FOOTER RESMI PESANTREN */}
        {/* ============================================================ */}
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

        {/* BottomNav Simulator in Mobile Viewport Mode */}
        {viewportMode === 'mobile' && <BottomNav />}
      </div>
    );
  }
};
export default WebVisualEditor;
