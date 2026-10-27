import React, { useState } from 'react';
import { X, Save, Plus, Trash2, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  data: any;
  onSave: (updatedData: any) => void;
}

export const EditContentModal: React.FC<EditContentModalProps> = ({
  isOpen,
  onClose,
  sectionTitle,
  data,
  onSave
}) => {
  const [formData, setFormData] = useState<any>(data);

  if (!isOpen) return null;

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleItemFieldChange = (itemIndex: number, field: string, value: any) => {
    if (!formData.items) return;
    const updatedItems = [...formData.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
    setFormData((prev: any) => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    if (!formData.items) return;
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'Judul Baru',
      name: 'Item Program Baru',
      desc: 'Deskripsi singkat item baru',
      summary: 'Ringkasan informasi terkini...',
      category: 'Umum',
      tag: 'Baru',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      isVisible: true
    };
    setFormData((prev: any) => ({ ...prev, items: [newItem, ...prev.items] }));
  };

  const handleDeleteItem = (index: number) => {
    if (!formData.items) return;
    const updatedItems = formData.items.filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, items: updatedItems }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Edit Section: {sectionTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                Sesuaikan teks, gambar, dan daftar item secara langsung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Headline / Title Fields */}
          {formData.headline !== undefined && (
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Headline / Judul Utama
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleFieldChange('headline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {formData.subheadline !== undefined && (
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Sub-headline / Keterangan
              </label>
              <input
                type="text"
                value={formData.subheadline}
                onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Pengasuh Kalam Fields */}
          {formData.pengasuhName !== undefined && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nama Tokoh Pengasuh
                </label>
                <input
                  type="text"
                  value={formData.pengasuhName}
                  onChange={(e) => handleFieldChange('pengasuhName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Teks Kalam Hikmah
                </label>
                <textarea
                  rows={4}
                  value={formData.kalam}
                  onChange={(e) => handleFieldChange('kalam', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Kutipan Moto / Slogan
                </label>
                <input
                  type="text"
                  value={formData.quote}
                  onChange={(e) => handleFieldChange('quote', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Contact Fields */}
          {formData.alamat !== undefined && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Alamat Pesantren</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => handleFieldChange('alamat', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Nomor WhatsApp Resmi</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* List Items Editor (News / Program / Ekskul) */}
          {Array.isArray(formData.items) && (
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Daftar Konten Item ({formData.items.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Item
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-700/80 bg-slate-50/50 dark:bg-zinc-800/40 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                        Item #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="text-xs text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Judul / Nama Item"
                      value={item.title || item.name || item.kejuaraan || item.nama || ''}
                      onChange={(e) =>
                        handleItemFieldChange(
                          idx,
                          item.title ? 'title' : item.name ? 'name' : item.kejuaraan ? 'kejuaraan' : 'nama',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-slate-900 dark:text-white"
                    />

                    {(item.summary !== undefined || item.desc !== undefined) && (
                      <textarea
                        rows={2}
                        placeholder="Deskripsi / Ringkasan Item"
                        value={item.summary || item.desc || ''}
                        onChange={(e) =>
                          handleItemFieldChange(idx, item.summary !== undefined ? 'summary' : 'desc', e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-slate-700 dark:text-zinc-300 leading-normal"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 active:scale-95 transition shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

