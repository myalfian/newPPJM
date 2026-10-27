import React, { ReactNode } from 'react';
import { Eye, EyeOff, Sliders, ArrowUp, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface EditorSectionWrapperProps {
  id: string;
  title: string;
  description?: string;
  isVisible: boolean;
  order?: number;
  isPublicPreview: boolean;
  onToggleVisibility: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEditContent?: () => void;
  children: ReactNode;
}

export const EditorSectionWrapper: React.FC<EditorSectionWrapperProps> = ({
  id,
  title,
  description,
  isVisible,
  order,
  isPublicPreview,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onEditContent,
  children
}) => {
  // If in Pure Public Preview Mode and hidden, omit completely from the public view
  if (isPublicPreview && !isVisible) {
    return null;
  }

  // If in Pure Public Preview Mode and visible, render without editor controls
  if (isPublicPreview) {
    return <section id={id} className="relative">{children}</section>;
  }

  return (
    <section
      id={id}
      aria-label={`Editor Section: ${title}`}
      className={`relative group/sec transition-all duration-300 rounded-2xl my-2 ${
        isVisible
          ? 'border-2 border-transparent hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]'
          : 'border-2 border-dashed border-amber-400/60 bg-amber-50/20 dark:bg-amber-950/20 p-2 sm:p-3'
      }`}
    >
      {/* SECTION HOVER CONTROL BAR (FLOATING BADGE) */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40 flex items-center gap-1 sm:gap-1.5 rounded-full bg-slate-900/90 dark:bg-zinc-900/95 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md border border-white/15 shadow-xl transition-all duration-200 opacity-90 sm:opacity-0 group-hover/sec:opacity-100 scale-95 group-hover/sec:scale-100">
        
        {/* Section Label */}
        <div className="flex items-center gap-1.5 pr-1 border-r border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-black text-white tracking-wide truncate max-w-[120px] sm:max-w-none">
            {title}
          </span>
        </div>

        {/* Visibility Toggle Button */}
        <button
          type="button"
          onClick={onToggleVisibility}
          title={isVisible ? 'Sembunyikan Section ini dari Pengunjung Publik' : 'Tampilkan Section ini ke Publik'}
          className={`flex h-6 sm:h-7 items-center gap-1 rounded-full px-2 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
            isVisible
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
              : 'bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:bg-amber-500/50'
          }`}
        >
          {isVisible ? (
            <>
              <Eye className="w-3 h-3 text-emerald-400" />
              <span>Live</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 text-amber-400" />
              <span>Hidden</span>
            </>
          )}
        </button>

        {/* Move Up/Down Controls */}
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            title="Pindahkan Section ke Atas"
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            title="Pindahkan Section ke Bawah"
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        )}

        {/* Open Content Edit Drawer */}
        {onEditContent && (
          <button
            type="button"
            onClick={onEditContent}
            title="Konfigurasi & Edit Isi Section Ini"
            className="flex items-center gap-1 p-1 sm:px-2 sm:py-0.5 rounded-full text-slate-200 hover:text-white bg-white/10 hover:bg-emerald-600/40 transition cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px] font-semibold">Edit</span>
          </button>
        )}
      </div>

      {/* HIDDEN WATERMARK OVERLAY WHEN SECTION IS INACTIVE */}
      {!isVisible && (
        <div className="mb-2 p-2 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Section ini berstatus <strong>Draft / Disembunyikan</strong> dari Pengunjung Publik.</span>
          </div>
          <button
            type="button"
            onClick={onToggleVisibility}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10.5px] hover:bg-emerald-500 transition shadow-xs cursor-pointer"
          >
            Aktifkan Sekarang
          </button>
        </div>
      )}

      {/* ACTUAL PUBLIC COMPONENT PREVIEW */}
      <div className={`transition-all duration-300 ${!isVisible ? 'opacity-40 grayscale-[25%] pointer-events-none' : ''}`}>
        {children}
      </div>
    </section>
  );
};

