import React, { ReactNode } from 'react';
import { Eye, EyeOff, Pin, Edit3 } from 'lucide-react';

interface EditorItemWrapperProps {
  itemId: string;
  itemTitle?: string;
  isVisible: boolean;
  isPinned?: boolean;
  isPublicPreview: boolean;
  onToggleVisibility: () => void;
  onTogglePin?: () => void;
  onEditItem?: () => void;
  children: ReactNode;
}

export const EditorItemWrapper: React.FC<EditorItemWrapperProps> = ({
  itemId,
  itemTitle,
  isVisible,
  isPinned,
  isPublicPreview,
  onToggleVisibility,
  onTogglePin,
  onEditItem,
  children
}) => {
  // If in Pure Public Preview Mode and hidden, omit completely
  if (isPublicPreview && !isVisible) {
    return null;
  }

  // If in Pure Public Preview Mode and visible, render child cleanly
  if (isPublicPreview) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative group/item transition-all duration-200 rounded-2xl ${
        isVisible
          ? 'hover:ring-2 hover:ring-emerald-500/40 hover:shadow-md'
          : 'opacity-50 grayscale-[35%] ring-2 ring-dashed ring-amber-500/80 bg-amber-500/5'
      }`}
    >
      {/* FLOATING ITEM-LEVEL CONTROL BADGE */}
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1 rounded-lg bg-slate-950/90 dark:bg-zinc-900/95 p-1 shadow-lg border border-white/15 backdrop-blur-md opacity-90 sm:opacity-0 group-hover/item:opacity-100 transition-all scale-95 group-hover/item:scale-100">
        
        {/* Visibility Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          title={isVisible ? 'Sembunyikan item ini dari publik' : 'Tampilkan kembali item ini'}
          className={`p-1.5 rounded-md transition cursor-pointer ${
            isVisible
              ? 'text-slate-300 hover:text-white hover:bg-white/10'
              : 'bg-amber-500/30 text-amber-300 hover:bg-amber-500/50'
          }`}
        >
          {isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
        </button>

        {/* Pin / Featured Toggle */}
        {onTogglePin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            title={isPinned ? 'Lepas Sematan (Unpin)' : 'Sematkan di Atas (Pin)'}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              isPinned
                ? 'bg-emerald-600/30 text-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-emerald-400 text-emerald-400' : ''}`} />
          </button>
        )}

        {/* Quick Edit Item */}
        {onEditItem && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditItem();
            }}
            title="Edit detail item ini"
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* HIDDEN BADGE INDICATOR */}
      {!isVisible && (
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/90 text-slate-950 shadow-xs">
            <EyeOff className="w-2.5 h-2.5" /> Disembunyikan
          </span>
        </div>
      )}

      {/* ACTUAL CARD CHILD */}
      {children}
    </div>
  );
};

