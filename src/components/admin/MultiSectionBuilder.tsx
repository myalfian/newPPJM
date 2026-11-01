import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Filter,
  RefreshCw,
  AlertTriangle,
  FolderPlus,
  X,
  Save,
  Upload,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
  Check
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { WordLikeEditor } from '../editor/WordLikeEditor';
import { compressImageToWebP } from '../../lib/imageCompressor';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'image'
  | 'select'
  | 'multiselect'
  | 'tags'
  | 'date'
  | 'time'
  | 'youtube'
  | 'color'
  | 'icon'
  | 'boolean';

export interface FieldOption {
  label: string;
  value: string;
  color?: string;
  icon?: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[];
  bucket?: string;
  parentModuleCategory?: string; // Jika select diambil dari sub_items
  max?: number;
  min?: number;
  helperText?: string;
  showInTable?: boolean;
}

export interface MultiSectionBuilderProps {
  tableName: string;
  displayName: string;
  parentModule?: string; // jika menggunakan tabel sub_items
  categoryParentModule?: string; // jika ada kategori pendukung di sub_items
  fields: FieldConfig[];
  allowFeatured?: boolean;
  featuredScope?: 'home' | 'global';
  allowReorder?: boolean;
  allowCategories?: boolean;
  storageBucket?: string;
  maxItems?: number;
  previewCard?: (item: any) => React.ReactNode;
}

// Komponen Sortable Row Table
function SortableRow({
  id,
  children
}: {
  id: string;
  children: (listeners: any, attributes: any) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
      {children(listeners, attributes)}
    </tr>
  );
}

export const MultiSectionBuilder: React.FC<MultiSectionBuilderProps> = ({
  tableName,
  displayName,
  parentModule,
  categoryParentModule,
  fields,
  allowFeatured = true,
  featuredScope = 'home',
  allowReorder = true,
  allowCategories = true,
  storageBucket = 'cms-images',
  maxItems,
  previewCard
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Modal Tambah Kategori Cepat
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catFormData, setCatFormData] = useState({ title: '', description: '', color: 'emerald', icon: 'Folder' });

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // In-component Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
  };
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 1. Fetch Categories dari sub_items (jika ada)
  const fetchCategories = useCallback(async () => {
    if (!categoryParentModule) return;
    try {
      const { data, error } = await (supabase.from('sub_items' as any) as any)
        .select('*')
        .eq('parent_module', categoryParentModule)
        .order('order_index', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  }, [categoryParentModule]);

  // 2. Fetch Data Utama
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let query = (supabase.from(tableName as any) as any).select('*');
      if (parentModule) {
        query = query.eq('parent_module', parentModule);
      }
      query = query.order('order_index', { ascending: true }).order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error(`Error fetching ${tableName}:`, err);
      showToast('Gagal memuat data dari Supabase', 'error');
    } finally {
      setLoading(false);
    }
  }, [tableName, parentModule]);

  // Initial Load + Realtime Subscription
  useEffect(() => {
    fetchData();
    fetchCategories();

    const channel = supabase
      .channel(`realtime_${tableName}_${parentModule || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData();
      })
      .subscribe();

    let catChannel: any = null;
    if (categoryParentModule) {
      catChannel = supabase
        .channel(`realtime_cat_${categoryParentModule}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sub_items' }, () => {
          fetchCategories();
        })
        .subscribe();
    }

    return () => {
      supabase.removeChannel(channel);
      if (catChannel) supabase.removeChannel(catChannel);
    };
  }, [fetchData, fetchCategories, tableName, parentModule, categoryParentModule]);

  // Handle Drag & Drop End Reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    const updated = reordered.map((item, index) => ({ ...item, order_index: index + 1 }));
    setItems(updated);

    try {
      const updates = updated.map((item) => ({
        id: item.id,
        order_index: item.order_index,
        updated_at: new Date().toISOString()
      }));

      for (const u of updates) {
        await (supabase.from(tableName as any) as any).update({ order_index: u.order_index, updated_at: u.updated_at }).eq('id', u.id);
      }
      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
    } catch (err: any) {
      console.error('Error reordering:', err);
      showToast('Gagal memuat data dari Supabase', 'error');
      fetchData();
    }
  };

  // Reorder single Up/Down
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const updated = newItems.map((item, idx) => ({ ...item, order_index: idx + 1 }));
    setItems(updated);

    try {
      await Promise.all([
        (supabase.from(tableName as any) as any).update({ order_index: updated[index].order_index }).eq('id', updated[index].id),
        (supabase.from(tableName as any) as any).update({ order_index: updated[targetIndex].order_index }).eq('id', updated[targetIndex].id)
      ]);
      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
    } catch (err: any) {
      showToast('Gagal memuat data dari Supabase', 'error');
      fetchData();
    }
  };

  // Toggle is_active
  const handleToggleActive = async (item: any) => {
    const nextVal = !item.is_active;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: nextVal } : i)));

    try {
      const { error } = await (supabase.from(tableName as any) as any)
        .update({ is_active: nextVal, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
    } catch (err: any) {
      showToast('Gagal memuat data dari Supabase', 'error');
      fetchData();
    }
  };

  // Toggle Featured (Enforce single featured for home scope)
  const handleToggleFeatured = async (item: any) => {
    if (!allowFeatured) return;
    const nextVal = !item.is_featured;

    try {
      if (nextVal && featuredScope === 'home') {
        // Reset featured yang lain
        if (parentModule) {
          await (supabase.from(tableName as any) as any).update({ is_featured: false }).eq('parent_module', parentModule);
        } else {
          await (supabase.from(tableName as any) as any).update({ is_featured: false }).neq('id', item.id);
        }
      }

      const { error } = await (supabase.from(tableName as any) as any)
        .update({ is_featured: nextVal, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;
      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
      fetchData();
    } catch (err: any) {
      showToast('Gagal memuat data dari Supabase', 'error');
      fetchData();
    }
  };

  // Delete Item
  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus item ini secara permanen dari Supabase?')) return;

    try {
      const { error } = await (supabase.from(tableName as any) as any).delete().eq('id', id);
      if (error) throw error;

      // Audit Log
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          await (supabase.from('audit_logs' as any) as any).insert({
            user_id: session.session.user.id,
            action: 'DELETE',
            module: tableName,
            section_id: id,
            old_data: items.find((i) => i.id === id)
          });
        }
      } catch (e) {}

      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
    } catch (err: any) {
      showToast('Gagal memuat data dari Supabase', 'error');
    }
  };

  // Duplicate Item
  const handleDuplicate = async (item: any) => {
    try {
      const { id, created_at, updated_at, ...cleanItem } = item;
      const duplicated = {
        ...cleanItem,
        title: cleanItem.title ? `${cleanItem.title} (Salinan)` : cleanItem.name ? `${cleanItem.name} (Salinan)` : 'Salinan',
        name: cleanItem.name ? `${cleanItem.name} (Salinan)` : undefined,
        order_index: (cleanItem.order_index || 0) + 1,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await (supabase.from(tableName as any) as any).insert([duplicated]).select().single();
      if (error) throw error;

      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
      fetchData();
    } catch (err: any) {
      showToast('Gagal memuat data dari Supabase', 'error');
    }
  };

  // Open Modal Create/Edit
  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      const defaults: Record<string, any> = {
        order_index: items.length + 1,
        is_active: true,
        is_featured: false
      };
      if (parentModule) defaults.parent_module = parentModule;
      fields.forEach((f) => {
        if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
        else if (f.type === 'multiselect' || f.type === 'tags') defaults[f.name] = [];
        else if (f.type === 'boolean') defaults[f.name] = false;
        else defaults[f.name] = '';
      });
      setFormData(defaults);
    }
    setIsModalOpen(true);
  };

  // Image Upload Handler
  const handleImageUpload = async (fieldName: string, file: File, bucket = storageBucket) => {
    setUploadingImage(fieldName);
    try {
      const compressed = await compressImageToWebP(file, 1200, 0.85);
      const fileExt = 'webp';
      const fileName = `${tableName}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, compressed, {
        contentType: 'image/webp',
        upsert: true
      });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, [fieldName]: urlData.publicUrl }));
      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('Gagal memuat data dari Supabase', 'error');
    } finally {
      setUploadingImage(null);
    }
  };

  // Save Form (Upsert)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validasi required
      for (const f of fields) {
        if (f.required && !formData[f.name]) {
          throw new Error(`Kolom ${f.label} wajib diisi!`);
        }
      }

      const payload: Record<string, any> = {
        ...formData,
        updated_at: new Date().toISOString()
      };
      if (parentModule) payload.parent_module = parentModule;

      let resData: any = null;
      if (editingItem?.id) {
        const { data, error } = await (supabase.from(tableName as any) as any).update(payload).eq('id', editingItem.id).select().single();
        if (error) {
          if (error.code === '42501') {
            throw new Error('RLS Block: Anda tidak memiliki hak akses (role super_admin/konten diperlukan).');
          }
          throw error;
        }
        resData = data;
        showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
      } else {
        const { data, error } = await (supabase.from(tableName as any) as any).insert([payload]).select().single();
        if (error) {
          if (error.code === '42501') {
            throw new Error('RLS Block: Anda tidak memiliki hak akses (role super_admin/konten diperlukan).');
          }
          throw error;
        }
        resData = data;
        showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
      }

      // Audit Log
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          await (supabase.from('audit_logs' as any) as any).insert({
            user_id: session.session.user.id,
            action: editingItem ? 'UPDATE' : 'CREATE',
            module: tableName,
            section_id: resData?.id,
            new_data: resData,
            old_data: editingItem
          });
        }
      } catch (e) {}

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Save error:', err);
      showToast('Gagal memuat data dari Supabase', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Simpan Kategori Baru ke sub_items
  const handleSaveNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryParentModule || !catFormData.title.trim()) return;

    try {
      const payload = {
        parent_module: categoryParentModule,
        title: catFormData.title.trim(),
        description: catFormData.description.trim(),
        icon: catFormData.icon,
        color: catFormData.color,
        order_index: categories.length + 1,
        is_active: true
      };

      const { data, error } = await (supabase.from('sub_items' as any) as any).insert([payload]).select().single();
      if (error) throw error;

      showToast('Perubahan berhasil disimpan ke Supabase!', 'success');
      setCategories((prev) => [...prev, data]);
      setCatFormData({ title: '', description: '', color: 'emerald', icon: 'Folder' });
      setIsCatModalOpen(false);
    } catch (err: any) {
      showToast('Gagal memuat data dari Supabase', 'error');
    }
  };

  // Filter Data
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      const searchStr = search.toLowerCase();
      const matchSearch =
        !search ||
        (item.title && item.title.toLowerCase().includes(searchStr)) ||
        (item.name && item.name.toLowerCase().includes(searchStr)) ||
        (item.description && item.description.toLowerCase().includes(searchStr)) ||
        (item.category && item.category.toLowerCase().includes(searchStr));

      // Category
      const matchCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory ||
        item.album_id === selectedCategory ||
        item.type === selectedCategory;

      // Status
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && item.is_active) ||
        (selectedStatus === 'inactive' && !item.is_active) ||
        (selectedStatus === 'featured' && item.is_featured);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, search, selectedCategory, selectedStatus]);

  // Stats Counters
  const totalCount = items.length;
  const activeCount = items.filter((i) => i.is_active).length;
  const featuredCount = items.filter((i) => i.is_featured).length;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 space-y-6 relative">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-500 shadow-emerald-950/20'
              : 'bg-rose-900 text-white border-rose-500 shadow-rose-950/20'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-300" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}
      {/* Header Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <Layers className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Kelola {displayName}</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Multi-item manager terhubung langsung ke Supabase (Realtime Sync & No Local Seed)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {allowCategories && categoryParentModule && (
              <button
                onClick={() => setIsCatModalOpen(true)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <FolderPlus className="w-4 h-4 text-emerald-600" />
                Tambah Kategori
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20"
            >
              <Plus className="w-4 h-4" />
              Tambah {displayName} Baru
            </button>
          </div>
        </div>

        {/* 4 Cards Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Data</span>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">{totalCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Status Aktif</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{activeCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/60">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Unggulan (Featured)</span>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">{featuredCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/60">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Kategori / Grup</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{categories.length || 'Umum'}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Cari ${displayName}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {allowCategories && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">Semua Kategori ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Non-aktif Saja</option>
            {allowFeatured && <option value="featured">Unggulan Saja</option>}
          </select>

          <button
            onClick={fetchData}
            title="Refresh Realtime"
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Memuat data dari Supabase...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Layers className="w-12 h-12 text-slate-300" />
            <p className="text-base font-medium text-slate-600">Belum ada data untuk ditampilkan</p>
            <p className="text-xs text-slate-400">Klik tombol "Tambah {displayName} Baru" untuk membuat item pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    {allowReorder && <th className="px-4 py-3.5 w-12 text-center">Urutan</th>}
                    <th className="px-4 py-3.5 w-16">Foto</th>
                    <th className="px-4 py-3.5">Judul / Nama</th>
                    {fields.some((f) => f.name === 'category' || f.name === 'album_id') && (
                      <th className="px-4 py-3.5">Kategori</th>
                    )}
                    {allowFeatured && <th className="px-4 py-3.5 w-24 text-center">Unggulan</th>}
                    <th className="px-4 py-3.5 w-24 text-center">Status</th>
                    <th className="px-4 py-3.5 text-right w-44">Aksi</th>
                  </tr>
                </thead>
                <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <SortableRow key={item.id} id={item.id}>
                        {(listeners, attributes) => (
                          <>
                            {/* Reorder Cell */}
                            {allowReorder && (
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    {...attributes}
                                    {...listeners}
                                    className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded"
                                    title="Tarik untuk mengubah urutan"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </button>
                                  <div className="flex flex-col">
                                    <button
                                      disabled={index === 0}
                                      onClick={() => handleMoveOrder(index, 'up')}
                                      className="text-slate-400 hover:text-slate-700 disabled:opacity-20 p-0.5"
                                    >
                                      <ChevronUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      disabled={index === filteredItems.length - 1}
                                      onClick={() => handleMoveOrder(index, 'down')}
                                      className="text-slate-400 hover:text-slate-700 disabled:opacity-20 p-0.5"
                                    >
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            )}

                            {/* Foto Thumbnail */}
                            <td className="px-4 py-3">
                              {item.image_url || item.photo_url || item.thumbnail ? (
                                <img
                                  src={item.image_url || item.photo_url || item.thumbnail}
                                  alt={item.title || item.name}
                                  className="w-11 h-11 object-cover rounded-lg border border-slate-200 shadow-xs"
                                />
                              ) : (
                                <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                                  <Layers className="w-5 h-5" />
                                </div>
                              )}
                            </td>

                            {/* Title & Deskripsi Ringkas */}
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-800 line-clamp-1">
                                {item.title || item.name || item.label || 'Tanpa Judul'}
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {item.description || item.excerpt || item.quote || item.title_badge || 'Tidak ada keterangan'}
                              </div>
                            </td>

                            {/* Kategori Badge */}
                            {fields.some((f) => f.name === 'category' || f.name === 'album_id') && (
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <Tag className="w-3 h-3" />
                                  {item.category || item.album_id || item.type || 'Umum'}
                                </span>
                              </td>
                            )}

                            {/* Featured Star Toggle */}
                            {allowFeatured && (
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleToggleFeatured(item)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    item.is_featured
                                      ? 'text-amber-500 hover:bg-amber-50'
                                      : 'text-slate-300 hover:text-slate-400 hover:bg-slate-100'
                                  }`}
                                  title={item.is_featured ? 'Unggulan Aktif' : 'Jadikan Unggulan'}
                                >
                                  <Star className={`w-5 h-5 ${item.is_featured ? 'fill-amber-400' : ''}`} />
                                </button>
                              </td>
                            )}

                            {/* Status Active Toggle */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleToggleActive(item)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                  item.is_active
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {item.is_active ? 'Aktif' : 'Non-aktif'}
                              </button>
                            </td>

                            {/* Aksi */}
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleDuplicate(item)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Duplikasi Item"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenModal(item)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Edit Data"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Hapus Permanen"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </SortableRow>
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        )}
      </div>

      {/* MODAL EDIT / CREATE FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingItem ? `Edit ${displayName}` : `Tambah ${displayName} Baru`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Isi detail formulir di bawah ini dengan lengkap.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fields.map((f) => {
                  const val = formData[f.name] ?? '';

                  // Field Type: Text / Number / Date / Time / Youtube
                  if (['text', 'number', 'date', 'time', 'youtube'].includes(f.type)) {
                    return (
                      <div
                        key={f.name}
                        className={f.name === 'title' || f.name === 'name' ? 'md:col-span-2' : ''}
                      >
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </label>
                        <input
                          type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'time' ? 'time' : 'text'}
                          value={val}
                          placeholder={f.placeholder || f.label}
                          required={f.required}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value
                            }))
                          }
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {f.helperText && <p className="text-[11px] text-slate-400 mt-1">{f.helperText}</p>}
                      </div>
                    );
                  }

                  // Field Type: Select
                  if (f.type === 'select') {
                    const options = f.options || (f.parentModuleCategory && categories) || [];
                    return (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </label>
                        <select
                          value={val}
                          required={f.required}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [f.name]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 bg-white"
                        >
                          <option value="">-- Pilih {f.label} --</option>
                          {options.map((opt: any) => (
                            <option key={opt.value || opt.id || opt.title} value={opt.value || opt.title}>
                              {opt.label || opt.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  // Field Type: Textarea
                  if (f.type === 'textarea') {
                    return (
                      <div key={f.name} className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </label>
                        <textarea
                          rows={3}
                          value={val}
                          placeholder={f.placeholder || f.label}
                          required={f.required}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [f.name]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    );
                  }

                  // Field Type: Image Upload (WebP Compression)
                  if (f.type === 'image') {
                    return (
                      <div key={f.name} className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </label>
                        <div className="flex items-center gap-4">
                          {val ? (
                            <img
                              src={val}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-xs"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                              <Upload className="w-6 h-6" />
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage === f.name}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(f.name, file, f.bucket || storageBucket);
                              }}
                              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                            />
                            <p className="text-[11px] text-slate-400">
                              Maksimal 2MB (JPG, PNG, WebP). Otomatis dikompres ke WebP modern.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Field Type: Richtext (Word tip-tap editor)
                  if (f.type === 'richtext') {
                    return (
                      <div key={f.name} className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </label>
                        <WordLikeEditor
                          value={val}
                          onChange={(html) => setFormData((prev) => ({ ...prev, [f.name]: html }))}
                          placeholder={f.placeholder || 'Tulis konten lengkap...'}
                          bucket={f.bucket || storageBucket}
                          minHeight="220px"
                          toolbarMode="full"
                        />
                      </div>
                    );
                  }

                  // Field Type: Tags / Array of text
                  if (f.type === 'tags') {
                    const tagsArr: string[] = Array.isArray(val) ? val : [];
                    return (
                      <div key={f.name} className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {f.label} (Tekan Enter untuk menambah)
                        </label>
                        <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50/50">
                          {tagsArr.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-2xs"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    [f.name]: tagsArr.filter((_, idx) => idx !== tIdx)
                                  }))
                                }
                                className="text-slate-400 hover:text-rose-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder="+ Tambah item..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.currentTarget;
                                const newTag = target.value.trim();
                                if (newTag && !tagsArr.includes(newTag)) {
                                  setFormData((prev) => ({ ...prev, [f.name]: [...tagsArr, newTag] }));
                                  target.value = '';
                                }
                              }
                            }}
                            className="bg-transparent text-xs text-slate-700 focus:outline-none px-2 py-1 flex-1 min-w-[120px]"
                          />
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Toggles (Active & Featured) */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Publikasikan Langsung (Status Aktif)</span>
                </label>

                {allowFeatured && (
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured ?? false}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Tandai Sebagai Unggulan Utama ({featuredScope})
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage !== null}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Simpan ke Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KATEGORI CEPAT */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Tambah Kategori Baru</h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNewCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Robotik & AI"
                  value={catFormData.title}
                  onChange={(e) => setCatFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan Singkat
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi singkat kategori..."
                  value={catFormData.description}
                  onChange={(e) => setCatFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

