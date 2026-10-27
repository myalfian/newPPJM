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
  Menu
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
    sectionKey: 'beritaTerkini' | 'programUnggulan' | 'quickMenu' | 'prestasi' | 'ekskul',
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
  const handlePublish = () => {
    const res = publishEditorState(editorState);
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

  // Dynamic canvas width styling based on viewport mode
  const canvasViewportClasses = {
    mobile: 'w-full max-w-[400px] border-x border-zinc-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-[38px] ring-12 ring-zinc-800 my-6',
    tablet: 'w-full max-w-[768px] border-x border-zinc-700/80 shadow-2xl rounded-3xl ring-8 ring-zinc-800/80 my-6',
    desktop: 'w-full max-w-7xl rounded-2xl border border-zinc-800 shadow-xl my-4'
  }[viewportMode];

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

        {/* Viewport Switcher Toolbar (Mobile, Tablet, Desktop) */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/90 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`flex h-7 sm:h-8 items-center gap-1.5 rounded-full px-2.5 sm:px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Simulasikan Tampilan Layar HP (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode('tablet')}
            className={`flex h-7 sm:h-8 items-center gap-1.5 rounded-full px-2.5 sm:px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Simulasikan Tampilan Layar Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`flex h-7 sm:h-8 items-center gap-1.5 rounded-full px-2.5 sm:px-3 text-xs font-bold transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tampilan Layar Penuh Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Mode Preview Toggle & Global Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Section Tree Drawer Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-2.5 sm:px-3 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Buka Hierarki Struktur Section"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Struktur Web</span>
          </button>

          {/* Toggle Public Preview Mode vs Editor Overlay Mode */}
          <button
            type="button"
            onClick={() => setIsPublicPreview(!isPublicPreview)}
            className={`flex h-8 sm:h-9 items-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-bold transition cursor-pointer ${
              isPublicPreview
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isPublicPreview ? 'Kembali ke Mode Kontrol Editor' : 'Pratinjau Murni Sebagai Pengunjung Publik'}
          >
            {isPublicPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPublicPreview ? 'Keluar Preview' : 'Preview Publik'}</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="hidden lg:flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
            title="Reset ke Pengaturan Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Publish Perubahan Button */}
          <button
            type="button"
            onClick={handlePublish}
            className="flex h-8 sm:h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 sm:px-4 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 active:scale-95 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Publish</span>
          </button>
        </div>
      </header>

      {/* 2. SUCCESS NOTIFICATION TOAST */}
      {publishSuccessMsg && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-900/90 text-white border border-emerald-400/50 shadow-2xl backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs">
            <p className="font-black">Perubahan Berhasil Dipublikasikan!</p>
            <p className="text-emerald-200/90 text-[11px]">Seluruh pengaturan tampilan telah disinkronkan ke website publik.</p>
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
              className="p-1 rounded-md text-zinc-400 hover:text-white transition"
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

      {/* 4. MAIN LIVE PREVIEW CANVAS */}
      <main className="relative flex flex-1 items-start justify-center overflow-y-auto overflow-x-hidden pt-20 pb-20 px-2 sm:px-6">
        
        {/* Responsive Frame Shell (Mirroring Public Web Layout 1:1) */}
        <div className={`transition-all duration-300 ease-out ${canvasViewportClasses} min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden relative`}>
          
          {/* iPhone Speaker Notch Simulation (Only in Mobile Mode) */}
          {viewportMode === 'mobile' && (
            <div className="w-full flex justify-center pt-2 pb-1 bg-black text-white pointer-events-none sticky top-0 z-50">
              <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-zinc-800 mr-2" />
                <div className="w-8 h-1 bg-zinc-800 rounded-full" />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SECTION 1: PUBLIC NAVBAR HEADER */}
          {/* ============================================================ */}
          <EditorSectionWrapper
            id="navbar"
            title="Header & Navigasi"
            description="Logo pondok, 9 pilar navigasi publik & profil pill"
            isVisible={editorState.sections.navbar.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('navbar')}
            onEditContent={() =>
              setEditingSection({
                id: 'navbar',
                title: 'Header & Navigasi',
                data: editorState.sections.navbar.data
              })
            }
          >
            <Navbar />
          </EditorSectionWrapper>

          {/* ============================================================ */}
          {/* SECTION 2: HERO COVERFLOW CAROUSEL */}
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
          {/* SECTION 3: QUICK MENU MOBILE (2x4 Grid with Item Visibility) */}
          {/* ============================================================ */}
          <EditorSectionWrapper
            id="quickMenu"
            title="Quick Menu Mobile (Grid 2x4)"
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
              {/* Overlay note on editor canvas */}
              {!isPublicPreview && (
                <div className="px-4 py-1 text-[10px] text-slate-400 dark:text-zinc-500 font-mono text-center">
                  💡 Menu di atas otomatis tersembunyi pada layar desktop dan aktif di viewport mobile/tablet.
                </div>
              )}
            </div>
          </EditorSectionWrapper>

          {/* ============================================================ */}
          {/* SECTION 4: KALAM & SAMBUTAN PENGASUH */}
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
            <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200/90 dark:border-slate-700 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative w-44 h-52 sm:w-52 sm:h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-50 dark:border-slate-700 bg-slate-100">
                      <img
                        src={editorState.sections.sambutan.data.imageUrl}
                        alt="Pengasuh PPJM"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#0d4a28] text-[#ffd700] px-3 py-1 rounded-full text-[10px] font-black shadow-md whitespace-nowrap">
                        {editorState.sections.sambutan.data.title}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-2.5 text-center md:text-left">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Kalam Hikmah & Keteladanan
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black text-emerald-950 dark:text-white">
                      {editorState.sections.sambutan.data.pengasuhName}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{editorState.sections.sambutan.data.kalam}"
                    </p>
                    <div className="pt-1">
                      <span className="inline-block px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-700/60 text-xs font-bold">
                        🌟 {editorState.sections.sambutan.data.quote}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </EditorSectionWrapper>

          {/* ============================================================ */}
          {/* SECTION 5: PROGRAM UNGGULAN (Granular Item Controls) */}
          {/* ============================================================ */}
          <EditorSectionWrapper
            id="programUnggulan"
            title="Pilar Program Unggulan"
            description="3 pilar: Salaf, Diniyah Takmiliyah, dan Sains STEM"
            isVisible={editorState.sections.programUnggulan.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('programUnggulan')}
            onEditContent={() =>
              setEditingSection({
                id: 'programUnggulan',
                title: 'Program Unggulan',
                data: editorState.sections.programUnggulan.data
              })
            }
          >
            <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {editorState.sections.programUnggulan.data.subheadline}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {editorState.sections.programUnggulan.data.headline}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {editorState.sections.programUnggulan.data.items.map((item) => (
                  <EditorItemWrapper
                    key={item.id}
                    itemId={item.id}
                    itemTitle={item.name}
                    isVisible={item.isVisible}
                    isPublicPreview={isPublicPreview}
                    onToggleVisibility={() => toggleItemVisibility('programUnggulan', item.id)}
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs h-full flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-3">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {item.tag}
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mt-2 mb-1.5 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer">
                          Pelajari Silabus &rarr;
                        </span>
                      </div>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>

          {/* ============================================================ */}
          {/* SECTION 6: WARTA & BERITA SANTRI (Granular Item Controls) */}
          {/* ============================================================ */}
          <EditorSectionWrapper
            id="beritaTerkini"
            title="Warta & Berita Santri"
            description="Katalog berita, kajian, agenda akbar dan liputan khusus"
            isVisible={editorState.sections.beritaTerkini.isVisible}
            isPublicPreview={isPublicPreview}
            onToggleVisibility={() => toggleSectionVisibility('beritaTerkini')}
            onEditContent={() =>
              setEditingSection({
                id: 'beritaTerkini',
                title: 'Warta & Berita Santri',
                data: editorState.sections.beritaTerkini.data
              })
            }
          >
            <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {editorState.sections.beritaTerkini.data.subheadline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {editorState.sections.beritaTerkini.data.headline}
                  </h2>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer">
                  Lihat Semua Arsip &rarr;
                </span>
              </div>

              {/* News Item Grid with Granular Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full">
                      {/* Thumbnail */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={news.thumbnail}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0d4a28]/90 text-white backdrop-blur-md shadow-xs">
                            {news.category}
                          </span>
                        </div>
                        {news.isPinned && (
                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#ffd700] text-slate-950 shadow-md flex items-center gap-1">
                              ⭐ Tersemat
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium block mb-1">
                            {news.date}
                          </span>
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2">
                            {news.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {news.summary}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <span>Baca Selengkapnya &rarr;</span>
                          <Share2 className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </EditorItemWrapper>
                ))}
              </div>
            </section>
          </EditorSectionWrapper>

          {/* ============================================================ */}
          {/* SECTION 7: FOOTER & KONTAK RESMI */}
          {/* ============================================================ */}
          <EditorSectionWrapper
            id="footer"
            title="Footer & Kontak Resmi"
            description="Informasi alamat, nomor WA, dan hak cipta"
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
            <footer className="bg-slate-900 text-slate-100 border-t border-slate-800 pt-8 pb-16 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-800">
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      JM
                    </div>
                    <span className="font-black text-sm text-[#ffd700]">Pondok Pesantren Jauharul Maknuun</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                    {editorState.sections.footer.data.alamat}
                  </p>
                </div>
                <div className="md:col-span-6 flex flex-col md:items-end justify-center space-y-1 text-xs text-slate-300">
                  <p>WhatsApp: <span className="font-bold text-emerald-400">{editorState.sections.footer.data.whatsapp}</span></p>
                  <p>Email: <span className="text-slate-400">{editorState.sections.footer.data.email}</span></p>
                </div>
              </div>
              <div className="max-w-7xl mx-auto pt-4 text-center text-[11px] text-slate-500">
                {editorState.sections.footer.data.copyright}
              </div>
            </footer>
          </EditorSectionWrapper>

          {/* BottomNav Simulator in Mobile View */}
          {viewportMode === 'mobile' && <BottomNav />}
        </div>
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
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-md"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

