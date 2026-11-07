import React, { useState, useCallback, useEffect } from 'react';
import {
  Layout,
  Image as ImageIcon,
  Newspaper,
  Activity,
  Trophy,
  Calendar,
  Building2,
  Sparkles,
  Layers,
  Users,
  Compass,
  Settings,
  ShieldCheck,
  Zap,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Save,
  Upload,
  Image as UploadImage,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';
import { SideNavbar } from '../../components/common/SideNavbar';

/* ============================================================================
   SIMPLE ADMIN EDITOR - For non-technical users
   ============================================================================ */

type EditorSection =
  | 'dashboard'
  | 'sliders'
  | 'berita'
  | 'ekskul'
  | 'prestasi'
  | 'agendas'
  | 'facilities'
  | 'madin-flyers'
  | 'programs-pondok'
  | 'info-terkini'
  | 'site-settings';

const SECTIONS: { id: EditorSection; label: string; icon: React.ElementType; hint: string }[] = [
  { id: 'dashboard', label: 'Beranda', icon: Layout, hint: 'Ringkasan semua konten' },
  { id: 'sliders', label: 'Slider Halaman Depan', icon: ImageIcon, hint: 'Gambar besar di halaman utama' },
  { id: 'berita', label: 'Berita & Warta', icon: Newspaper, hint: 'Artikel dan pengumuman terbaru' },
  { id: 'ekskul', label: 'Ekskul', icon: Activity, hint: 'Kegiatan ekstrakurikuler santri' },
  { id: 'prestasi', label: 'Prestasi', icon: Trophy, hint: 'Prestasi dan penghargaan' },
  { id: 'agendas', label: 'Agenda & Jadwal', icon: Calendar, hint: 'Jadwal kegiatan rutin' },
  { id: 'facilities', label: 'Sarana & Prasarana', icon: Building2, hint: 'Fasilitas pesantren' },
  { id: 'madin-flyers', label: 'Flyer Madrasah', icon: Sparkles, hint: 'Poster kurikulum madin' },
  { id: 'programs-pondok', label: 'Program Pondok', icon: Layers, hint: 'Program unggulan pondok pesantren' },
  { id: 'info-terkini', label: 'Info Terkini', icon: Zap, hint: 'Warta dan informasi terbaru' }
];

/* ============================================================================
   Generic CRUD (uses Supabase directly, no complex generics)
   ============================================================================ */

interface CrudState {
  items: any[];
  loading: boolean;
  error: string | null;
}

function useSimpleCrud(tableName: string) {
  const [state, setState] = useState<CrudState>({ items: [], loading: true, error: null });

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setState({ items: [], loading: false, error: 'Supabase belum dihubungkan' });
      return;
    }
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data, error } = await (supabase as any)
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setState({ items: (data || []) as any[], loading: false, error: null });
    } catch (err: any) {
      setState({ items: [], loading: false, error: err.message || 'Gagal memuat data' });
    }
  }, [tableName]);

  const createItem = useCallback(async (values: Record<string, any>) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase belum dihubungkan');
    const { error } = await (supabase as any)
      .from(tableName)
      .insert([{ ...values, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
    if (error) throw error;
    await load();
    invalidateCache();
  }, [tableName, load]);

  const updateItem = useCallback(async (id: string, values: Record<string, any>) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase belum dihubungkan');
    const { error } = await (supabase as any)
      .from(tableName)
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    await load();
    invalidateCache();
  }, [tableName, load]);

  const deleteItem = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase belum dihubungkan');
    const { error } = await (supabase as any).from(tableName).delete().eq('id', id);
    if (error) throw error;
    await load();
    invalidateCache();
  }, [tableName, load]);

  useEffect(() => { load(); }, [load]);

  return { ...state, load, createItem, updateItem, deleteItem };
}

/* ============================================================================
   Helper: extract single image from pondok images JSON
   ============================================================================ */

function extractSingleImage(images: any): string | null {
  if (!images) return null;
  if (Array.isArray(images) && images[0]) {
    if (typeof images[0] === 'string') return images[0];
    return images[0].image_url || images[0].url || images[0].src || null;
  }
  if (typeof images === 'object') return images.image_url || images.url || null;
  return null;
}

/* ============================================================================
   Image Input with Preview - User-friendly for non-technical users
   ============================================================================ */

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  preview?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  label = 'URL Gambar',
  preview
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
        {label} (tempel link gambar dari Google Drive / website)
      </label>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://contoh.com/gambar.jpg"
          className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />
        {(preview || value) && (
          <div className="relative group">
            <img
              src={preview || value}
              alt="preview"
              className="w-full h-32 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
            />
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Pratinjau Gambar
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   Simple Item Card - Display with image
   ============================================================================ */

interface ItemCardProps {
  item: any;
  section: EditorSection;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, section, onEdit, onDelete }) => {
  const imageField = section === 'sliders' ? 'image_url' : section === 'facilities' ? 'image' : section === 'programs-pondok' ? 'images' : section === 'info-terkini' ? 'image_url' : 'thumbnail';
  const imageUrl = section === 'programs-pondok'
    ? (item.images?.[0]?.image_url || item.images?.[0]?.url || null)
    : item[imageField as string] || null;
  const title = item.title || item.name || '-';
  const subtitle = item.category || item.badge || '';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-colors group">
      {imageUrl ? (
        <div className="relative h-32 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-zinc-400" />
        </div>
      )}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-snug line-clamp-2">{title}</h3>
        </div>
        {subtitle && (
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full mt-2 inline-block">
            {subtitle}
          </span>
        )}
        <div className="mt-auto flex items-center justify-end gap-2 pt-3">
          <button onClick={() => onEdit(item)} className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400" title="Edit">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(item)} className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400" title="Hapus">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   Simple Edit Modal - User-friendly form
   ============================================================================ */

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  section: EditorSection;
  item: any | null;
  onSave: (values: Record<string, any>) => Promise<void>;
  saving: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
  open,
  onClose,
  section,
  item,
  onSave,
  saving
}) => {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const initial: Record<string, any> = {};
    switch (section) {
      case 'sliders':
        initial.title = item?.title || '';
        initial.badge_tag = item?.badge_tag || '';
        initial.description = item?.description || '';
        initial.image_url = item?.image_url || '';
        initial.cta_text = item?.cta_text || '';
        initial.cta_link = item?.cta_link || '';
        initial.order_index = item?.order_index || 1;
        initial.is_active = item?.is_active !== false;
        break;
      case 'berita':
        initial.title = item?.title || '';
        initial.slug = item?.slug || '';
        initial.category = item?.category || '';
        initial.summary = item?.summary || '';
        initial.content = item?.content || '';
        initial.thumbnail = item?.thumbnail || '';
        initial.author = item?.author || '';
        initial.is_published = item?.is_published !== false;
        initial.is_pinned = item?.is_pinned === true;
        break;
      case 'ekskul':
        initial.name = item?.name || '';
        initial.category = item?.category || '';
        initial.coach = item?.coach || '';
        initial.schedule = item?.schedule || '';
        initial.description = item?.description || '';
        initial.target = item?.target || '';
        initial.location = item?.location || '';
        initial.photo_url = item?.photo_url || '';
        initial.is_active = item?.is_active !== false;
        initial.is_featured = item?.is_featured === true;
        break;
      case 'prestasi':
        initial.title = item?.title || '';
        initial.category = item?.category || '';
        initial.tingkat = item?.tingkat || '';
        initial.winner_name = item?.winner_name || '';
        initial.year = item?.year || '';
        initial.description = item?.description || '';
        initial.photo_url = item?.photo_url || '';
        initial.is_active = item?.is_active !== false;
        break;
      case 'agendas':
        initial.title = item?.title || '';
        initial.category = item?.category || '';
        initial.time_display = item?.time_display || '';
        initial.date_display = item?.date_display || '';
        initial.location = item?.location || '';
        initial.description = item?.description || '';
        initial.target_audience = item?.target_audience || '';
        initial.image = item?.image || '';
        initial.is_active = item?.is_active !== false;
        initial.is_featured = item?.is_featured === true;
        break;
      case 'facilities':
        initial.name = item?.name || '';
        initial.category = item?.category || '';
        initial.description = item?.description || '';
        initial.capacity = item?.capacity || '';
        initial.image = item?.image || '';
        initial.is_active = item?.is_active !== false;
        break;
      case 'madin-flyers':
        initial.title = item?.title || '';
        initial.category = item?.category || 'kitab';
        initial.level = item?.level || 'Ula';
        initial.subject = item?.subject || '';
        initial.description = item?.description || '';
        initial.imageUrl = item?.imageUrl || '';
        break;
      case 'programs-pondok':
        initial.title = item?.title || '';
        initial.description = item?.description || '';
        initial.image_url = extractSingleImage(item?.images) || '';
        initial.is_active = item?.is_active !== false;
        break;
      case 'info-terkini':
        initial.title = item?.title || '';
        initial.slug = item?.slug || '';
        initial.category = item?.category || 'Umum';
        initial.excerpt = item?.excerpt || '';
        initial.content = item?.content || '';
        initial.image_url = item?.image_url || '';
        initial.author_name = item?.author_name || '';
        initial.is_published = item?.is_published !== false;
        initial.is_featured = item?.is_featured === true;
        break;
    }
    setValues(initial);
  }, [item, section]);

  const fieldConfig: Record<string, { label: string; type: string; placeholder?: string; hint?: string }> = {
    title: { label: 'Judul', type: 'text', hint: 'Judul yang akan ditampilkan' },
    name: { label: 'Nama', type: 'text', hint: 'Nama program atau fasilitas' },
    slug: { label: 'Alamat URL (Slug)', type: 'text', hint: 'Contoh: berita-terbaru-2026' },
    category: { label: 'Kategori', type: 'text', hint: 'Contoh: Ibadah, Akademik, Prestasi' },
    badge_tag: { label: 'Badge / Label', type: 'text', hint: 'Contoh: Unggulan, Baru, Populer' },
    description: { label: 'Deskripsi Singkat', type: 'textarea', hint: 'Deskripsi pendek untuk tampilan card' },
    content: { label: 'Konten Lengkap', type: 'textarea', hint: 'Isi lengkap artikel' },
    excerpt: { label: 'Ringkasan', type: 'textarea', hint: 'Ringkasan singkat info terkini' },
    summary: { label: 'Ringkasan', type: 'textarea', hint: 'Ringkasan berita' },
    author: { label: 'Penulis', type: 'text', hint: 'Nama penulis berita' },
    author_name: { label: 'Nama Penulis', type: 'text', hint: 'Nama penulis info terkini' },
    coach: { label: 'Pembina Ekskul', type: 'text', hint: 'Nama guru pembina' },
    schedule: { label: 'Jadwal', type: 'text', hint: 'Contoh: Setiap Sabtu pagi' },
    target: { label: 'Target Capaian', type: 'text', hint: 'Target prestasi' },
    location: { label: 'Lokasi', type: 'text', hint: 'Tempat kegiatan' },
    capacity: { label: 'Kapasitas', type: 'text', hint: 'Contoh: 50 orang' },
    winner_name: { label: 'Nama Pemenang', type: 'text', hint: 'Nama siswa atau tim' },
    year: { label: 'Tahun', type: 'number', hint: 'Contoh: 2026' },
    tingkat: { label: 'Tingkat Lomba', type: 'text', hint: 'Contoh: Kabupaten, Provinsi, Nasional' },
    time_display: { label: 'Waktu', type: 'text', hint: 'Contoh: 08.00 WIB' },
    date_display: { label: 'Tanggal', type: 'text', hint: 'Contoh: 15 Januari 2026' },
    target_audience: { label: 'Sasaran', type: 'text', hint: 'Contoh: Seluruh Santri' },
    image_url: { label: 'URL Gambar', type: 'url', hint: 'Link gambar dari internet' },
    thumbnail: { label: 'URL Thumbnail', type: 'url', hint: 'Link gambar kecil' },
    photo_url: { label: 'URL Foto', type: 'url', hint: 'Link foto ekskul' },
    image: { label: 'URL Gambar', type: 'url', hint: 'Link gambar fasilitas' },
    imageUrl: { label: 'URL Gambar Flyer', type: 'url', hint: 'Link gambar flyer madin' },
    cta_text: { label: 'Teks Tombol', type: 'text', hint: 'Contoh: Baca Selengkapnya' },
    cta_link: { label: 'Link Tombol', type: 'url', hint: 'Alamat website tujuan' },
    order_index: { label: 'Urutan Tampilan', type: 'number', hint: 'Angka kecil = lebih atas' },
    is_active: { label: 'Aktifkan Tampilan', type: 'boolean', hint: 'Matikan untuk menyembunyikan' },
    is_published: { label: 'Terbitkan', type: 'boolean', hint: 'Matikan untuk draft' },
    is_pinned: { label: 'Sematkan di Atas', type: 'boolean', hint: 'Selalu tampil di posisi teratas' },
    is_featured: { label: 'Tandai Unggulan', type: 'boolean', hint: 'Tampilkan sebagai unggulan' }
  };

  const handleSave = async () => {
    const saveValues: Record<string, any> = { ...values };

    // Section-specific transformations
    if (section === 'programs-pondok' && saveValues.image_url) {
      saveValues.images = [{ image_url: saveValues.image_url }];
      delete saveValues.image_url;
    }

    await onSave(saveValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-zinc-900 dark:text-white">
            {item ? 'Edit Data' : 'Tambah Data Baru'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-3">
            {(() => {
              const fields: string[] = [];
              switch (section) {
                case 'sliders': fields.push('title', 'badge_tag', 'description', 'image_url', 'cta_text', 'cta_link', 'order_index', 'is_active'); break;
                case 'berita': fields.push('title', 'slug', 'category', 'summary', 'content', 'thumbnail', 'author', 'is_published', 'is_pinned'); break;
                case 'ekskul': fields.push('name', 'category', 'coach', 'schedule', 'description', 'target', 'location', 'photo_url', 'is_active', 'is_featured'); break;
                case 'prestasi': fields.push('title', 'category', 'tingkat', 'winner_name', 'year', 'description', 'photo_url', 'is_active'); break;
                case 'agendas': fields.push('title', 'category', 'time_display', 'date_display', 'location', 'description', 'target_audience', 'image', 'is_active', 'is_featured'); break;
                case 'facilities': fields.push('name', 'category', 'description', 'capacity', 'image', 'is_active'); break;
                case 'madin-flyers': fields.push('title', 'category', 'level', 'subject', 'description', 'imageUrl'); break;
                case 'programs-pondok': fields.push('title', 'description', 'image_url', 'is_active'); break;
                case 'info-terkini': fields.push('title', 'slug', 'category', 'excerpt', 'content', 'image_url', 'author_name', 'is_published', 'is_featured'); break;
              }
              return fields;
            })().map((key) => {
              const cfg = fieldConfig[key];
              if (!cfg) return null;
              return (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    {cfg.label}
                  </label>
                  {cfg.type === 'boolean' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(values[key])}
                        onChange={(e) => setValues({ ...values, [key]: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{cfg.hint}</span>
                    </div>
                  ) : cfg.type === 'textarea' ? (
                    <textarea
                      value={values[key] || ''}
                      onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                      rows={3}
                      placeholder={cfg.hint}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  ) : cfg.type === 'url' || key === 'image_url' || key === 'thumbnail' || key === 'photo_url' || key === 'image' || key === 'imageUrl' ? (
                    <ImageInput
                      value={values[key] || ''}
                      onChange={(v) => setValues({ ...values, [key]: v })}
                      label={cfg.label}
                      preview={values[key]}
                    />
                  ) : (
                    <input
                      type={cfg.type}
                      value={values[key] || ''}
                      onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                      placeholder={cfg.hint}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  )}
                </div>
              );
            })}
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-50 shadow-md"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   MAIN EDITOR COMPONENT
   ============================================================================ */

export const KelolaAset: React.FC = () => {
  const [activeSection, setActiveSection] = useState<EditorSection>('dashboard');
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  /* ---- Load all sections ---- */
  const sliders = useSimpleCrud('sliders');
  const berita = useSimpleCrud('berita');
  const ekskul = useSimpleCrud('ekskul');
  const prestasi = useSimpleCrud('prestasi');
  const agendas = useSimpleCrud('agendas');
  const facilities = useSimpleCrud('facilities');
  const madinFlyers = useSimpleCrud('madin_flyers');
  const programsPondok = useSimpleCrud('programs_pondok');
  const infoTerkini = useSimpleCrud('info_terkini');

  const crudMap: Record<EditorSection, any> = {
    dashboard: { items: [], loading: false, error: null },
    sliders, berita, ekskul, prestasi, agendas, facilities,
    'madin-flyers': madinFlyers,
    'programs-pondok': programsPondok,
    'info-terkini': infoTerkini,
    'site-settings': { items: [], loading: false, error: null }
  };
  const crud = crudMap[activeSection];
  const items = crud.items || [];
  const isLoading = crud.loading || false;

  const handleAdd = () => {
    setEditingItem(null);
    setOpenModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setOpenModal(true);
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Yakin ingin menghapus "${item.title || item.name || item.id}"?`)) return;
    try {
      await crud.deleteItem(item.id);
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const handleSave = async (values: Record<string, any>) => {
    setSaving(true);
    try {
      if (editingItem?.id) {
        await crud.updateItem(editingItem.id, values);
      } else {
        await crud.createItem(values);
      }
      setOpenModal(false);
      setEditingItem(null);
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---- Helper: extract single image from pondok images JSON ---- */
  function extractSingleImage(images: any): string | null {
    if (!images) return null;
    if (Array.isArray(images) && images[0]) {
      if (typeof images[0] === 'string') return images[0];
      return images[0].image_url || images[0].url || images[0].src || null;
    }
    if (typeof images === 'object') return images.image_url || images.url || null;
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">Editor Konten PPJM</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              isSupabaseConfigured()
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {isSupabaseConfigured() ? 'Terhubung ke Database' : 'Mode Offline'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] overflow-hidden">
        {/* Left Sidebar - Simple Section Picker */}
        <aside className="hidden lg:flex lg:w-60 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
          <div className="p-3">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Pilih Halaman</p>
            <div className="space-y-0.5">
              {SECTIONS.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <s.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500 dark:text-zinc-400">
              <p className="font-bold mb-1">Cara Penggunaan:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Pilih halaman di kiri</li>
                <li>Klik "+ Tambah" untuk data baru</li>
                <li>Klik icon pensil untuk edit</li>
                <li>Tempel link gambar di kolom URL Gambar</li>
                <li>Klik "Simpan Perubahan" untuk menyimpan</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${activeSection === 'info-terkini' ? 'pr-80' : ''}`}>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {SECTIONS.find(s => s.id === activeSection)?.label || activeSection}
              </p>
              <h2 className="font-bold text-zinc-900 dark:text-white text-lg sm:text-xl">
                {activeSection === 'dashboard' ? 'Ringkasan Konten' : 'Kelola Data'}
              </h2>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md"
            >
              <Plus className="w-4 h-4" /> Tambah Data Baru
            </button>
          </div>

          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SECTIONS.filter(s => s.id !== 'dashboard').map((s) => {
                const sectionData = crudMap[s.id];
                const count = sectionData.items?.length || 0;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                        <s.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{count}</span>
                    </div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{s.label}</h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">{s.hint}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {activeSection !== 'dashboard' && items.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="font-bold text-zinc-900 dark:text-white">Belum ada data</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Klik "Tambah Data Baru" untuk menambahkan konten pertama.
              </p>
            </div>
          )}

          {/* Item Grid */}
          {activeSection !== 'dashboard' && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: any) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  section={activeSection}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>

        {/* SideNavbar - Info Terkini Quick Editor */}
        {activeSection === 'info-terkini' && (
          <SideNavbar
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            saving={saving}
          />
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        section={activeSection}
        item={editingItem}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
};

export default KelolaAset;