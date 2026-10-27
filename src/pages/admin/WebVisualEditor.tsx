import React, { useState, useEffect } from 'react';
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
  Maximize2
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

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export const WebVisualEditor: React.FC = () => {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<PageEditorState>(loadEditorState);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPublicPreview, setIsPublicPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Active section modal editing state
  const [editingSection, setEditingSection] = useState<{ id: string; title: string; data: any } | null>(null);

  // Auto-save draft on state change
  useEffect(() => {
    saveEditorDraft(editorState);
  }, [editorState]);

  // Section toggle visibility
  const toggleSectionVisibility = (sectionKey: keyof PageEditorState['sections']) => {
    setEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          isVisible: !prev.sections[sectionKey].isVisible
        }
      }
    }));
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
              items: updatedItems
            }
          }
        }
      };
    });
  };

  // Toggle item pin/featured
  const toggleNewsPin = (itemId: string) => {
    setEditorState((prev) => {
      const section = prev.sections.beritaTerkini;
      const items = section.data.items.map((item) =>
        item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
      );
      return {
        ...prev,
        sections: {
          ...prev.sections,
          beritaTerkini: {
            ...section,
            data: { ...section.data, items }
          }
        }
      };
    });
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
            order: newOrder
          }
        }
      };
    });
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
          data: updatedData
        }
      }
    }));
  };

  // Handle Publish Action
  const handlePublish = async () => {
    const res = await publishEditorState(editorState);
    if (res.success) {
      setPublishSuccessMsg(true);
      setTimeout(() => setPublishSuccessMsg(false), 3500);
    }
  };

  // Handle Reset to Default
  const handleReset = () => {
    const defaultState = resetEditorStateToDefault();
    setEditorState(defaultState);
    setResetModalOpen(false);
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

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#09090b] font-sans text-zinc-100 antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* 1. TOP APP BAR (Modern Lux Slate Shell) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-zinc-950/90 px-3 sm:px-6 backdrop-blur-xl">
        
        {/* Brand & Context Information */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-[#0d4a28] text-white font-black text-xs shadow-md border border-emerald-400/40 hover:scale-105 transition"
            title="Kembali ke Panel Admin Utama"
          >
            JM
          </Link>
          <div className="hidden xs:block">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                Editor Visual In-Context
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-2.5 h-2.5 text-[#ffcc00]" /> Live Sandbox
                </span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">ppjauharulmaknuun.sch.id</p>
          </div>
        </div>

        {/* Viewport Switcher Toolbar (Mobile 390px, Tablet 768px, Desktop 100% Fluid) */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/90 p-1 shadow-inner">
          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Simulasikan Tampilan Layar HP (390px - iPhone Frame)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile <span className="hidden lg:inline text-[10px] opacity-80">(390px)</span></span>
          </button>

          {/* Tablet Button */}
          <button
            type="button"
            onClick={() => setViewportMode('tablet')}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Simulasikan Tampilan Layar Tablet (768px - iPad Frame)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet <span className="hidden lg:inline text-[10px] opacity-80">(768px)</span></span>
          </button>

          {/* Desktop Button */}
          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tampilan Layar Penuh Desktop (100% Fluid)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop <span className="hidden lg:inline text-[10px] opacity-80">(100% Fluid)</span></span>
          </button>
        </div>

        {/* Mode Preview Toggle & Global Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Section Tree Drawer Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Buka Hierarki Struktur Section"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Struktur</span>
          </button>

          {/* Toggle Public Preview Mode vs Editor Overlay Mode */}
          <button
            type="button"
            onClick={() => setIsPublicPreview(!isPublicPreview)}
            className={`flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition cursor-pointer ${
              isPublicPreview
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isPublicPreview ? 'Kembali ke Mode Kontrol Editor' : 'Pratinjau Murni Sebagai Pengunjung Publik'}
          >
            {isPublicPreview ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPublicPreview ? 'Keluar Preview' : 'Preview Publik'}</span>
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
            className="flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 active:scale-95 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* 2. SUCCESS NOTIFICATION TOAST */}
      {publishSuccessMsg && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-900/95 text-white border border-emerald-400/50 shadow-2xl backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs">
            <p className="font-black">Perubahan Berhasil Dipublikasikan!</p>
            <p className="text-emerald-200/90 text-[11px]">Seluruh konfigurasi live web editor telah disinkronkan ke website publik.</p>
          </div>
        </div>
      )}

      {/* 3. SIDEBAR HIERARCHY TREE DRAWER */}
      {sidebarOpen && (
        <aside className="fixed top-16 right-0 bottom-0 z-40 w-80 bg-zinc-950/95 border-l border-white/10 p-4 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Hierarki Komponen</h3>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
            Kontrol cepat visibilitas section dan item tanpa harus menggulir kanvas visual.
          </p>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {Object.entries(editorState.sections).map(([key, sec]) => {
              const secKey = key as keyof PageEditorState['sections'];
              return (
                <div
                  key={sec.id}
                  className={`p-2.5 rounded-xl border transition ${
                    sec.isVisible
                      ? 'bg-zinc-900/80 border-white/10 hover:border-emerald-500/30'
                      : 'bg-zinc-900/30 border-dashed border-amber-500/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{sec.title}</span>
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(secKey)}
                      className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${
                        sec.isVisible
                          ? 'bg-emerald-600/30 text-emerald-300'
                          : 'bg-amber-500/30 text-amber-300'
                      }`}
                    >
                      {sec.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{sec.description}</p>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* 4. MAIN IN-CONTEXT LIVE PREVIEW CANVAS */}
      <main className="relative flex flex-1 items-start justify-center overflow-y-auto overflow-x-hidden pt-16 pb-16">
        
        {/* ========================================================================= */}
        {/* VIEWPORT MODE A: MOBILE (390px - iPhone Titanium Frame) */}
        {/* ========================================================================= */}
        {viewportMode === 'mobile' && (
          <div className="w-full flex flex-col items-center py-6 px-2 animate-fade-in">
            {/* Viewport Dimension Spec Chip */}
            <div className="mb-3 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>iPhone 15/16 Pro • 390 × 844 pt</span>
            </div>

            {/* iPhone Device Bezel Wrapper */}
            <div className="w-[390px] min-w-[390px] max-w-[390px] bg-white dark:bg-slate-900 rounded-[50px] border-[10px] border-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.95)] ring-1 ring-white/10 ring-offset-4 ring-offset-zinc-950 overflow-hidden relative flex flex-col">
              {/* iPhone Dynamic Island Notch Pill */}
              <div className="w-full flex justify-center pt-2.5 pb-1 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 text-white pointer-events-none shadow-md">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800" />
                </div>
              </div>

              {/* Mobile Content Canvas Container */}
              <div className="flex-1 overflow-x-hidden">
                {renderWebsiteContent()}
              </div>

              {/* iPhone Bottom Home Indicator Bar */}
              <div className="w-full py-2 bg-white dark:bg-slate-900 flex justify-center sticky bottom-0 z-50 pointer-events-none">
                <div className="w-32 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEWPORT MODE B: TABLET (768px - iPad Frame) */}
        {/* ========================================================================= */}
        {viewportMode === 'tablet' && (
          <div className="w-full flex flex-col items-center py-6 px-3 animate-fade-in">
            {/* Viewport Dimension Spec Chip */}
            <div className="mb-3 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <Tablet className="w-3.5 h-3.5 text-emerald-400" />
              <span>iPad Air / Mini • 768 × 1024 pt</span>
            </div>

            {/* iPad Device Bezel Wrapper */}
            <div className="w-[768px] min-w-[768px] max-w-[768px] bg-white dark:bg-slate-900 rounded-[36px] border-[12px] border-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.85)] ring-1 ring-white/10 ring-offset-4 ring-offset-zinc-950 overflow-hidden relative flex flex-col">
              {/* iPad FaceTime Camera Dot */}
              <div className="w-full flex justify-center py-2 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
              </div>

              {/* Tablet Content Canvas Container */}
              <div className="flex-1 overflow-x-hidden">
                {renderWebsiteContent()}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEWPORT MODE C: DESKTOP (100% Fluid Full Screen Mirroring 1:1) */}
        {/* ========================================================================= */}
        {viewportMode === 'desktop' && (
          <div className="w-full max-w-full min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden relative animate-fade-in">
            {/* Fluid Desktop Viewport Indicator */}
            <div className="w-full bg-zinc-900/60 border-b border-white/5 py-1 px-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fluid Desktop • 100% Full Screen Viewport Mirroring</span>
              </div>
              <span className="text-[10px] text-zinc-500">Live 1:1 Rendering of ppjauharulmaknuun.sch.id</span>
            </div>

            {/* Desktop Full-width Canvas */}
            {renderWebsiteContent()}
          </div>
        )}

      </main>

      {/* 5. MODAL EDIT SECTION CONTENT */}
      {editingSection && (
        <EditContentModal
          isOpen={Boolean(editingSection)}
          sectionTitle={editingSection.title}
          data={editingSection.data}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSectionContent}
        />
      )}

      {/* 6. RESET CONFIRMATION MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/10 p-5 shadow-2xl text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Reset Seluruh Tampilan Editor?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Semua perubahan draft akan dikembalikan ke susunan bawaan sistem.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-md cursor-pointer"
              >
                Ya, Reset
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
          title="Header Navigasi Web"
          description="Logo pesantren, 9 pilar navigasi publik & profil pill"
          isVisible={editorState.sections.navbar.isVisible}
          isPublicPreview={isPublicPreview}
          onToggleVisibility={() => toggleSectionVisibility('navbar')}
          onEditContent={() =>
            setEditingSection({
              id: 'navbar',
              title: 'Header Navigasi Web',
              data: editorState.sections.navbar.data
            })
          }
        >
          <Navbar />
        </EditorSectionWrapper>

        {/* ============================================================ */}
        {/* 2. HERO COVERFLOW CAROUSEL */}
        {/* ============================================================ */}
        <EditorSectionWrapper
          id="heroSlider"
          title="Hero Coverflow Slider"
          description="Banner flyer 3D coverflow interaktif"
          isVisible={editorState.sections.heroSlider.isVisible}
          isPublicPreview={isPublicPreview}
          onToggleVisibility={() => toggleSectionVisibility('heroSlider')}
          onEditContent={() =>
            setEditingSection({
              id: 'heroSlider',
              title: 'Hero Coverflow Slider',
              data: editorState.sections.heroSlider.data
            })
          }
        >
          <HeroSlider />
        </EditorSectionWrapper>

        {/* ============================================================ */}
        {/* 3. QUICK MENU MOBILE (2x4 Grid) */}
        {/* ============================================================ */}
        <EditorSectionWrapper
          id="quickMenu"
          title="Quick Menu Mobile (2x4 Grid)"
          description="Menu navigasi cepat 8 kartu di layar mobile dan tablet"
          isVisible={editorState.sections.quickMenu.isVisible}
          isPublicPreview={isPublicPreview}
          onToggleVisibility={() => toggleSectionVisibility('quickMenu')}
          onEditContent={() =>
            setEditingSection({
              id: 'quickMenu',
              title: 'Quick Menu Mobile',
              data: editorState.sections.quickMenu.data
            })
          }
        >
          <div className="relative">
            <QuickMenu />
            {!isPublicPreview && viewportMode === 'desktop' && (
              <div className="px-4 py-1 text-[11px] text-slate-400 dark:text-zinc-500 font-mono text-center">
                💡 QuickMenu otomatis tersembunyi di Desktop dan aktif di layar HP / Tablet. Ubah switcher di atas ke "Mobile" untuk melihatnya aktif.
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
          onEditContent={() =>
            setEditingSection({
              id: 'sambutan',
              title: 'Kalam Sambutan Pengasuh',
              data: editorState.sections.sambutan.data
            })
          }
        >
          <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-0.5">
            <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 lg:p-4 shadow-m3-1 border border-slate-200/90 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3.5 items-center">
                
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative">
                    <div className="w-40 h-48 sm:w-52 sm:h-60 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-50 bg-slate-100">
                      <img
                        src={editorState.sections.sambutan.data.imageUrl}
                        alt="Pengasuh PP Jauharul Maknuun"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-emerald-900 text-[#ffd700] px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md whitespace-nowrap">
                      {editorState.sections.sambutan.data.title}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-2.5 text-center lg:text-left">
                  <span className="text-xs sm:text-sm font-bold text-amber-700 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Kalam Hikmah & Ma'had Barokah
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-950">
                    {editorState.sections.sambutan.data.pengasuhName}
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-emerald-800">
                    Mudir &amp; Pengasuh Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
                  </p>
                  <blockquote className="text-sm sm:text-base lg:text-lg text-slate-800 font-medium italic leading-relaxed sm:leading-loose border-l-0 lg:border-l-4 lg:border-emerald-700 lg:pl-4">
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
        {/* 5. EMPAT PILAR PENDIDIKAN PESANTREN (Granular Item Controls) */}
        {/* ============================================================ */}
        <EditorSectionWrapper
          id="programUnggulan"
          title="Empat Pilar Pendidikan PPJM"
          description="Pilar: Turats Salaf, Tahfidz AI, Lab STEM, Mandarin & Arab"
          isVisible={editorState.sections.programUnggulan.isVisible}
          isPublicPreview={isPublicPreview}
          onToggleVisibility={() => toggleSectionVisibility('programUnggulan')}
          onEditContent={() =>
            setEditingSection({
              id: 'programUnggulan',
              title: 'Empat Pilar Pendidikan PPJM',
              data: editorState.sections.programUnggulan.data
            })
          }
        >
          <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 space-y-2 sm:space-y-3">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">
                Karakteristik &amp; Keistimewaan
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950">
                {editorState.sections.programUnggulan.data.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
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
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
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
        {/* 6. WARTA & BERITA TERKINI DENGAN WHATSAPP BROADCAST */}
        {/* ============================================================ */}
        <EditorSectionWrapper
          id="beritaTerkini"
          title="Warta & Berita Santri Terkini"
          description="Kabar aktual, liputan kajian, dan agenda pesantren"
          isVisible={editorState.sections.beritaTerkini.isVisible}
          isPublicPreview={isPublicPreview}
          onToggleVisibility={() => toggleSectionVisibility('beritaTerkini')}
          onEditContent={() =>
            setEditingSection({
              id: 'beritaTerkini',
              title: 'Warta & Berita Santri Terkini',
              data: editorState.sections.beritaTerkini.data
            })
          }
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
                to="/galeri/foto"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950"
              >
                <span>Lihat Semua Berita</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* News Grid with Item-Level Granular Controls */}
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
                  onTogglePin={() => toggleNewsPin(news.id)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col group h-full">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-emerald-900/90 text-[#ffd700] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-xs">
                        {news.category}
                      </span>
                      {news.isPinned && (
                        <span className="absolute top-2.5 right-2.5 bg-[#ffd700] text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          ⭐ Tersemat
                        </span>
                      )}
                    </div>

                    {/* Body */}
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

                      {/* Footer Actions */}
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
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
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
          onEditContent={() =>
            setEditingSection({
              id: 'prestasi',
              title: 'Prestasi & Kejuaraan Santri',
              data: editorState.sections.prestasi.data
            })
          }
        >
          <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2">
            <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-teal-500/10 border border-amber-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
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
        {/* 8. ORGANISASI SANTRI (OSIS / OPJM) */}
        {/* ============================================================ */}
        {editorState.sections.osis && (
          <EditorSectionWrapper
            id="osis"
            title="Kepengurusan Santri (OSIS / OPJM)"
            description="Struktur presidium santri & pengurus divisi organisasi"
            isVisible={editorState.sections.osis.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('osis')}
            onEditContent={() =>
              setEditingSection({
                id: 'osis',
                title: 'Kepengurusan Santri (OSIS / OPJM)',
                data: editorState.sections.osis.data
              })
            }
          >
            <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2">
              <div className="text-center max-w-2xl mx-auto space-y-1 mb-3">
                <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">
                  {editorState.sections.osis.data.kabinetName}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                  {editorState.sections.osis.data.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {editorState.sections.osis.data.subheadline}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {editorState.sections.osis.data.items.map((member) => (
                  <EditorItemWrapper
                    key={member.id}
                    itemId={member.id}
                    itemTitle={member.nama}
                    isVisible={member.isVisible}
                    isPublicPreview={isPublicPreview}
                    onToggleVisibility={() => toggleItemVisibility('osis', member.id)}
                  >
                    <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {member.lencana}
                        </span>
                        <h4 className="font-extrabold text-sm text-emerald-950 mt-1">
                          {member.nama}
                        </h4>
                        <p className="text-xs font-semibold text-emerald-700">{member.jabatan}</p>
                        <p className="text-[11px] text-slate-500">{member.divisi}</p>
                      </div>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 9. AGENDA & KALENDER PESANTREN */}
        {/* ============================================================ */}
        {editorState.sections.agenda && (
          <EditorSectionWrapper
            id="agenda"
            title="Agenda & Kalender Pesantren"
            description="Jadwal pengajian, wisuda tahfidz & roan akbar"
            isVisible={editorState.sections.agenda.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('agenda')}
            onEditContent={() =>
              setEditingSection({
                id: 'agenda',
                title: 'Agenda & Kalender Pesantren',
                data: editorState.sections.agenda.data
              })
            }
          >
            <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    Kalender Kegiatan
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                    {editorState.sections.agenda.data.headline}
                  </h3>
                </div>
                <Link to="/agenda" className="text-xs font-bold text-emerald-800 hover:underline">
                  Lihat Semua Agenda &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {editorState.sections.agenda.data.items.map((ag) => (
                  <EditorItemWrapper
                    key={ag.id}
                    itemId={ag.id}
                    itemTitle={ag.title}
                    isVisible={ag.isVisible}
                    isPublicPreview={isPublicPreview}
                    onToggleVisibility={() => toggleItemVisibility('agenda', ag.id)}
                  >
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 h-full">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {ag.category}
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950 leading-snug">
                        {ag.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{ag.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium truncate">📍 {ag.location}</p>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 10. GALERI DOKUMENTASI VISUAL & VIDEO */}
        {/* ============================================================ */}
        {editorState.sections.galeri && (
          <EditorSectionWrapper
            id="galeri"
            title="Galeri Foto & Dokumentasi"
            description="Sorotan foto kegiatan santri, tahfidz & laboratorium STEM"
            isVisible={editorState.sections.galeri.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('galeri')}
            onEditContent={() =>
              setEditingSection({
                id: 'galeri',
                title: 'Galeri Foto & Dokumentasi',
                data: editorState.sections.galeri.data
              })
            }
          >
            <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    Galeri Santri
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                    {editorState.sections.galeri.data.headline}
                  </h3>
                </div>
                <Link to="/galeri/foto" className="text-xs font-bold text-emerald-800 hover:underline">
                  Buka Galeri Lengkap &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {editorState.sections.galeri.data.items.map((gal) => (
                  <EditorItemWrapper
                    key={gal.id}
                    itemId={gal.id}
                    itemTitle={gal.title}
                    isVisible={gal.isVisible}
                    isPublicPreview={isPublicPreview}
                    onToggleVisibility={() => toggleItemVisibility('galeri', gal.id)}
                  >
                    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs group h-full">
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={gal.imageUrl}
                          alt={gal.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-emerald-900/90 text-[#ffd700] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {gal.category}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-bold text-emerald-950 truncate">{gal.title}</p>
                      </div>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>
        )}

        {/* ============================================================ */}
        {/* 11. FOOTER RESMI PESANTREN */}
        {/* ============================================================ */}
        <EditorSectionWrapper
          id="footer"
          title="Footer & Kontak Resmi"
          description="Alamat resmi, WhatsApp call center & copyright"
          isVisible={editorState.sections.footer.isVisible}
          isPublicPreview={isPublicPreview}
          onToggleVisibility={() => toggleSectionVisibility('footer')}
          onEditContent={() =>
            setEditingSection({
              id: 'footer',
              title: 'Footer & Kontak Resmi',
              data: editorState.sections.footer.data
            })
          }
        >
          <footer className="bg-emerald-950 text-emerald-100 pt-8 pb-16 px-4 sm:px-6 border-t-4 border-amber-400">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-emerald-900/80">
              <div className="md:col-span-6 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white text-emerald-900 font-black flex items-center justify-center text-xs">
                    JM
                  </div>
                  <span className="font-black text-base text-[#ffd700]">Pondok Pesantren Jauharul Maknuun</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed max-w-md">
                  {editorState.sections.footer.data.alamat}
                </p>
              </div>
              <div className="md:col-span-6 flex flex-col md:items-end justify-center space-y-1 text-xs text-emerald-200">
                <p>WhatsApp: <span className="font-bold text-[#ffd700]">{editorState.sections.footer.data.whatsapp}</span></p>
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
