import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface SideNavbarProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAdd: () => void;
  saving?: boolean;
}

export const SideNavbar: React.FC<SideNavbarProps> = ({
  items,
  onEdit,
  onDelete,
  onAdd,
  saving = false
}) => {
  const [open, setOpen] = useState(true);

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Yakin ingin menghapus "${item.title || item.id}"?`)) return;
    onDelete(item);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out transform ${open ? 'translate-x-0' : 'translate-x-full'}">
      {/* Toggle button when closed */}
      {!open && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setOpen(true)}
            className="bg-emerald-600 text-white p-2 rounded-l-lg shadow-md hover:bg-emerald-700 transition-colors"
            title="Buka Navigasi Info Terkini"
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">
            Info Terkini
          </h3>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          title="Tutup"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
        <button
          onClick={onAdd}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Tambah Info
        </button>
        {saving && (
          <div className="mt-2 flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3 text-zinc-500 animate-spin" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Menyimpan...</span>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Zap className="w-8 h-8 text-zinc-400 mb-2" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Belum ada Info Terkini
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
              Klik "Tambah Info" untuk membuat yang pertama
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2.5 hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title || '-'}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.is_featured
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.is_featured ? 'Unggulan' : item.category || 'Umum'}
                  </span>
                </div>
                {item.excerpt && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
                    {item.is_published !== false ? 'Aktif' : 'Draft'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                      className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400" title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400" title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-center">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
          {items.length} item
        </span>
      </div>
    </div>
  );
};