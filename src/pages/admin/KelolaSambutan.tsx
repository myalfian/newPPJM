import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Database,
  Quote,
  User,
  Briefcase,
  UploadCloud,
  Trash2,
  PlusCircle,
  Star,
  Eye,
  Check,
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Copy,
  Search,
  Filter,
  Video,
  Award,
  Globe,
  Mail,
  MessageCircle,
  Calendar,
  Tag,
  CheckSquare,
  Square
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { sanitizeText, sanitizeUrl, isValidImageUrl } from '../../utils/sanitize';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { Link } from 'react-router-dom';
import { WordLikeEditor } from '../../components/editor/WordLikeEditor';
import { clearOldSeedCache } from '../../utils/clearOldCache';

interface SambutanFormState {
  id?: string;
  name: string;
  title: string;
  role_type: string;
  type: string;
  quote: string;
  message_short: string;
  message_full: string;
  photo_url: string;
  video_url: string;
  order_index: number;
  is_active: boolean;
  is_featured: boolean;
  location: string[];
  credentials: string[];
  achievements: string[];
  start_date: string;
  end_date: string;
  social_links: {
    wa: string;
    ig: string;
    email: string;
    youtube: string;
  };
}

const EMPTY_FORM: SambutanFormState = {
  name: '',
  title: '',
  role_type: 'pengasuh',
  type: 'pimpinan',
  quote: '',
  message_short: '',
  message_full: '',
  photo_url: '',
  video_url: '',
  order_index: 1,
  is_active: true,
  is_featured: false,
  location: ['home', 'jm-center'],
  credentials: [],
  achievements: [],
  start_date: '',
  end_date: '',
  social_links: {
    wa: '',
    ig: '',
    email: '',
    youtube: ''
  }
};

const LOCATION_OPTIONS = [
  { id: 'home', label: 'Beranda (Home)' },
  { id: 'jm-center', label: 'JM-Center' },
  { id: 'smp-plus', label: 'SMP Plus' },
  { id: 'madin', label: 'Madrasah Diniyah' },
  { id: 'yayasan', label: 'Yayasan' },
];

const ROLE_OPTIONS = [
  'Pengasuh Pondok Pesantren',
  'Kepala Sekolah SMP Plus Jauharul Maknuun',
  'Kepala Madrasah Diniyah Takmiliyah',
  'Ketua Yayasan Jauharul Maknuun',
  'Wakil Pengasuh Bidang Akademik',
  'Wakil Pengasuh Bidang Kesantrian',
  'Kepala Markaz Tahfidz Al-Qur\'an',
  'Lainnya (Ketik Manual)'
];

export const KelolaSambutan: React.FC = () => {
  const [sambutans, setSambutans] = useState<SambutanPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'pesan'>('info');
  const [editing, setEditing] = useState<SambutanPerson | null>(null);
  const [form, setForm] = useState<SambutanFormState>(EMPTY_FORM);
  const [compressing, setCompressing] = useState<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<'order_index' | 'name' | 'created_at'>('order_index');

  // Multi Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Gelar & Prestasi Input state
  const [credentialInput, setCredentialInput] = useState<string>('');
  const [achievementInput, setAchievementInput] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. Fetch live sambutan_persons from Supabase
  const fetchSambutan = async () => {
    if (!isSupabaseConfigured()) {
      setError('Koneksi Supabase belum terkonfigurasi.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchErr } = await supabase
        .from('sambutan_persons')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchErr) {
        console.error('[KelolaSambutan] Fetch error:', fetchErr);
        if (fetchErr.code === '42501') {
          setError('RLS BLOCK (Code: 42501): Hak akses baca ditolak oleh policy Postgres.');
        } else {
          setError(fetchErr.message);
        }
        showToast(`Gagal memuat: ${fetchErr.message}`, 'error');
      } else {
        const rows = (data || []) as SambutanPerson[];
        setSambutans(rows);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data dari database.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Realtime Subscription
  useEffect(() => {
    fetchSambutan();

    const channel = supabase
      .channel('realtime-sambutan-manager')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        (payload) => {
          console.log('[KelolaSambutan] Realtime notification:', payload);
          fetchSambutan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Open Create Modal
  const handleOpenCreate = () => {
    setEditing(null);
    const nextOrder = sambutans.length > 0 ? Math.max(...sambutans.map((s) => s.order_index || 0)) + 1 : 1;
    setForm({
      ...EMPTY_FORM,
      order_index: nextOrder,
      is_featured: sambutans.length === 0, // Featured jika pertama
    });
    setCustomTitle(false);
    setActiveModalTab('info');
    setIsModalOpen(true);
  };

  // 4. Open Edit Modal
  const handleOpenEdit = (person: SambutanPerson) => {
    setEditing(person);
    const isCustom = !ROLE_OPTIONS.slice(0, -1).includes(person.title);
    setCustomTitle(isCustom);
    setForm({
      id: person.id,
      name: person.name || '',
      title: person.title || '',
      role_type: person.role_type || 'pengasuh',
      type: person.type || 'pimpinan',
      quote: person.quote || person.message_short || '',
      message_short: person.message_short || '',
      message_full: person.message_full || '',
      photo_url: person.photo_url || '',
      video_url: person.video_url || '',
      order_index: person.order_index ?? 1,
      is_active: person.is_active !== false,
      is_featured: person.is_featured === true,
      location: Array.isArray(person.location) ? person.location : ['home', 'jm-center'],
      credentials: Array.isArray(person.credentials) ? person.credentials : [],
      achievements: Array.isArray(person.achievements) ? person.achievements : [],
      start_date: person.start_date || '',
      end_date: person.end_date || '',
      social_links: {
        wa: person.social_links?.wa || '',
        ig: person.social_links?.ig || '',
        email: person.social_links?.email || '',
        youtube: person.social_links?.youtube || '',
      }
    });
    setActiveModalTab('info');
    setIsModalOpen(true);
  };

  // 5. Handle Upload Photo with 2MB validation & WebP compression
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 2MB sebelum kompresi.', 'error');
      return;
    }

    setCompressing(true);
    try {
      const res: CompressionResult = await compressImageToWebP(file, 800, 1000, 0.85);
      let finalUrl = res.dataUrl;

      try {
        const fileExt = 'webp';
        const fileName = `sambutan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${fileExt}`;

        const fetchRes = await fetch(res.dataUrl);
        const blob = await fetchRes.blob();

        const { error: storageErr } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob, { contentType: 'image/webp', upsert: true });

        if (!storageErr) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          if (urlData?.publicUrl) {
            finalUrl = urlData.publicUrl;
          }
        }
      } catch (storageException) {
        console.warn('Storage upload fallback to dataURL:', storageException);
      }

      setForm((prev) => ({ ...prev, photo_url: finalUrl }));
      showToast(`Foto berhasil dikompresi (${res.compressedSizeKB} KB, hemat ${res.savedPercent}%).`);
    } catch (err: any) {
      showToast('Gagal memproses foto: ' + (err?.message || 'Error'), 'error');
    } finally {
      setCompressing(false);
    }
  };

  // 6. Handle Save / Upsert
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const name = sanitizeText(form.name.trim(), 100);
    const title = sanitizeText(form.title.trim(), 150);
    const quote = sanitizeText(form.quote.trim(), 150);
    const messageShort = form.message_short.trim() ? sanitizeText(form.message_short.trim(), 200) : quote;
    const messageFull = sanitizeText(form.message_full.trim(), 5000);

    if (!name || name.length < 3) {
      showToast('Nama Lengkap wajib diisi minimal 3 karakter.', 'error');
      return;
    }
    if (!title || title.length < 3) {
      showToast('Jabatan / Amanah wajib diisi.', 'error');
      return;
    }
    if (!messageFull || messageFull.length < 50) {
      showToast('Naskah sambutan lengkap minimal 50 karakter.', 'error');
      return;
    }

    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Single featured guarantee: Jika diset featured & lokasinya mencakup home, reset featured lain
      if (form.is_featured && form.location.includes('home')) {
        await supabase
          .from('sambutan_persons')
          .update({ is_featured: false } as any)
          .neq('id', editing?.id || '00000000-0000-0000-0000-000000000000');
      }

      const payload: any = {
        name,
        title,
        role_type: form.role_type || 'pengasuh',
        type: form.type || 'pimpinan',
        quote: quote || messageShort,
        message_short: messageShort || quote,
        message_full: messageFull,
        photo_url: form.photo_url || null,
        video_url: form.video_url ? sanitizeUrl(form.video_url) : null,
        order_index: Number(form.order_index) || 1,
        is_active: form.is_active,
        is_featured: form.is_featured,
        location: form.location.length > 0 ? form.location : ['home', 'jm-center'],
        credentials: form.credentials,
        achievements: form.achievements,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        social_links: form.social_links,
        updated_at: new Date().toISOString(),
        updated_by: userId || null,
      };

      let savedData: any = null;
      let upsertError: any = null;

      if (editing?.id) {
        payload.id = editing.id;
        const res = await supabase
          .from('sambutan_persons')
          .update(payload)
          .eq('id', editing.id)
          .select()
          .single();
        savedData = res.data;
        upsertError = res.error;
      } else {
        const res = await supabase
          .from('sambutan_persons')
          .insert(payload)
          .select()
          .single();
        savedData = res.data;
        upsertError = res.error;
      }

      if (upsertError) {
        console.error('[KelolaSambutan] Save error:', upsertError);
        if (upsertError.code === '42501') {
          showToast('❌ RLS BLOCK (42501)! Akses simpan ditolak oleh policy Postgres.', 'error');
        } else {
          showToast(`❌ Gagal simpan: ${upsertError.message}`, 'error');
        }
        setSaving(false);
        return;
      }

      // Record Audit Log
      if (userId) {
        try {
          await supabase.from('audit_logs').insert({
            user_id: userId,
            email: session?.user?.email || 'admin@ppjauharulmaknuun.sch.id',
            action: editing ? 'UPDATE_SAMBUTAN' : 'CREATE_SAMBUTAN',
            module: 'sambutan_persons',
            section_id: String(savedData.id),
            old_data: editing ? (editing as any) : null,
            new_data: savedData,
            created_at: new Date().toISOString(),
          });
        } catch (auditErr) {
          console.warn('[KelolaSambutan] Audit notice:', auditErr);
        }
      }

      // Hapus cache lama
      clearOldSeedCache();

      // Update state dari data Supabase asli
      if (editing) {
        setSambutans((prev) => prev.map((s) => (s.id === savedData.id ? (savedData as SambutanPerson) : s)));
      } else {
        setSambutans((prev) =>
          [...prev, savedData as SambutanPerson].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        );
      }

      showToast('✅ Berhasil disimpan! Data live di web publik.');
      setIsModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (err: any) {
      showToast('Gagal menyimpan: ' + (err?.message || 'Error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // 7. Toggle Featured
  const handleToggleFeatured = async (person: SambutanPerson) => {
    const newFeatured = !person.is_featured;
    try {
      if (newFeatured) {
        // Reset featured lain terlebih dahulu
        await supabase.from('sambutan_persons').update({ is_featured: false } as any).neq('id', person.id);
      }

      const { data, error: updErr } = await supabase
        .from('sambutan_persons')
        .update({ is_featured: newFeatured, is_active: true } as any)
        .eq('id', person.id)
        .select()
        .single();

      if (updErr) {
        showToast(`Gagal update featured: ${updErr.message}`, 'error');
        return;
      }

      clearOldSeedCache();
      setSambutans((prev) =>
        prev.map((s) => {
          if (s.id === person.id) return data as SambutanPerson;
          if (newFeatured) return { ...s, is_featured: false };
          return s;
        })
      );

      showToast(newFeatured ? `⭐ ${person.name} ditetapkan sebagai Tokoh Utama (Featured)!` : 'Status Featured dinonaktifkan.');
    } catch (err: any) {
      showToast('Gagal mengubah status featured: ' + err.message, 'error');
    }
  };

  // 8. Toggle Active Status
  const handleToggleActive = async (person: SambutanPerson) => {
    const newActive = !person.is_active;
    try {
      const { data, error: updErr } = await supabase
        .from('sambutan_persons')
        .update({ is_active: newActive } as any)
        .eq('id', person.id)
        .select()
        .single();

      if (updErr) {
        showToast(`Gagal: ${updErr.message}`, 'error');
        return;
      }

      clearOldSeedCache();
      setSambutans((prev) => prev.map((s) => (s.id === person.id ? (data as SambutanPerson) : s)));
      showToast(newActive ? `✅ ${person.name} aktif di publik.` : `⏸️ ${person.name} dinonaktifkan.`);
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  // 9. Reorder Order Index (Naik / Turun)
  const handleReorder = async (person: SambutanPerson, direction: 'up' | 'down') => {
    const currentIndex = sambutans.findIndex((s) => s.id === person.id);
    if (currentIndex < 0) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sambutans.length) return;

    const targetPerson = sambutans[targetIndex];
    const newPersonOrder = targetPerson.order_index;
    const newTargetOrder = person.order_index;

    try {
      await supabase.from('sambutan_persons').update({ order_index: newPersonOrder } as any).eq('id', person.id);
      await supabase.from('sambutan_persons').update({ order_index: newTargetOrder } as any).eq('id', targetPerson.id);

      clearOldSeedCache();
      fetchSambutan();
      showToast('Urutan posisi diperbarui.');
    } catch (err: any) {
      showToast('Gagal memindahkan urutan: ' + err.message, 'error');
    }
  };

  // 10. Delete Person
  const handleDelete = async (id: string) => {
    const target = sambutans.find((s) => s.id === id);
    if (!target) return;

    if (!confirm(`Hapus permanen sambutan "${target.name}" dari Supabase?`)) return;

    const { data: { session } } = await supabase.auth.getSession();
    try {
      const { error: delErr } = await supabase.from('sambutan_persons').delete().eq('id', id);
      if (delErr) {
        showToast(`Gagal menghapus: ${delErr.message}`, 'error');
        return;
      }

      if (session) {
        await supabase.from('audit_logs').insert({
          user_id: session.user.id,
          email: session.user.email,
          action: 'DELETE_SAMBUTAN',
          module: 'sambutan_persons',
          section_id: id,
          old_data: target as any,
          created_at: new Date().toISOString(),
        });
      }

      clearOldSeedCache();
      setSambutans((prev) => prev.filter((s) => s.id !== id));
      showToast(`Sambutan ${target.name} dihapus.`);
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  // 11. Duplicate Person
  const handleDuplicate = async (person: SambutanPerson) => {
    try {
      const nextOrder = Math.max(...sambutans.map((s) => s.order_index || 0)) + 1;
      const { data, error: dupErr } = await supabase
        .from('sambutan_persons')
        .insert({
          name: `${person.name} (Salinan)`,
          title: person.title,
          role_type: person.role_type,
          type: person.type,
          quote: person.quote,
          message_short: person.message_short,
          message_full: person.message_full,
          photo_url: person.photo_url,
          video_url: person.video_url,
          order_index: nextOrder,
          is_active: false,
          is_featured: false,
          location: person.location,
          credentials: person.credentials,
          achievements: person.achievements,
          social_links: person.social_links,
        } as any)
        .select()
        .single();

      if (dupErr) {
        showToast('Gagal menduplikasi: ' + dupErr.message, 'error');
        return;
      }

      clearOldSeedCache();
      setSambutans((prev) => [...prev, data as SambutanPerson]);
      showToast(`Duplikasi berhasil untuk ${person.name}.`);
    } catch (err: any) {
      showToast('Error duplikasi: ' + err.message, 'error');
    }
  };

  // 12. Bulk Actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredSambutans.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSambutans.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selectedIds.length} pemberi sambutan terpilih?`)) return;
    try {
      await supabase.from('sambutan_persons').delete().in('id', selectedIds);
      clearOldSeedCache();
      setSambutans((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      showToast('Data terpilih berhasil dihapus.');
    } catch (err: any) {
      showToast('Gagal hapus massal: ' + err.message, 'error');
    }
  };

  const handleBulkActivate = async (activate: boolean) => {
    try {
      await supabase.from('sambutan_persons').update({ is_active: activate } as any).in('id', selectedIds);
      clearOldSeedCache();
      setSambutans((prev) =>
        prev.map((s) => (selectedIds.includes(s.id) ? { ...s, is_active: activate } : s))
      );
      setSelectedIds([]);
      showToast(activate ? 'Semua terpilih diaktifkan.' : 'Semua terpilih dinonaktifkan.');
    } catch (err: any) {
      showToast('Gagal ubah status massal: ' + err.message, 'error');
    }
  };

  // Filtered and Sorted Data
  const filteredSambutans = sambutans
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.quote && s.quote.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchLocation =
        filterLocation === 'all' ||
        (Array.isArray(s.location) && s.location.includes(filterLocation));

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && s.is_active) ||
        (filterStatus === 'inactive' && !s.is_active) ||
        (filterStatus === 'featured' && s.is_featured);

      return matchSearch && matchLocation && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'order_index') return (a.order_index || 0) - (b.order_index || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'created_at') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      return 0;
    });

  // Stats calculation
  const totalCount = sambutans.length;
  const activeCount = sambutans.filter((s) => s.is_active).length;
  const featuredCount = sambutans.filter((s) => s.is_featured).length;
  const homeCount = sambutans.filter((s) => s.location?.includes('home')).length;

  return (
    <div className="max-w-7xl mx-auto space-y-2.5 sm:space-y-3.5">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 border-emerald-500 text-white'
              : 'bg-rose-950/95 border-rose-500 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-white dark:bg-zinc-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Kelola Pemberi Sambutan (Multi Manager)
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Pusat manajemen naskah sambutan Mudir, Kepala Sekolah, Kepala Madin & Dewan Yayasan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/jm-center/sambutan"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-2xl text-xs font-bold transition"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Publik</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-emerald-900/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pemberi Sambutan</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">{totalCount}</div>
            <div className="text-[11px] font-medium text-zinc-500">Total Tokoh</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">{activeCount}</div>
            <div className="text-[11px] font-medium text-zinc-500">Aktif Tayang</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">{featuredCount}</div>
            <div className="text-[11px] font-medium text-zinc-500">Tokoh Utama (Featured)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">{homeCount}</div>
            <div className="text-[11px] font-medium text-zinc-500">Tayang di Beranda</div>
          </div>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama tokoh, jabatan, atau naskah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-200"
            />
          </div>

          {/* Filter Lokasi */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lokasi:
            </span>
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              {['all', 'home', 'jm-center', 'smp-plus', 'madin', 'yayasan'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setFilterLocation(loc)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
                    filterLocation === loc
                      ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {loc === 'all' ? 'Semua' : loc}
                </button>
              ))}
            </div>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="all">Status: Semua</option>
              <option value="active">Hanya Aktif</option>
              <option value="inactive">Nonaktif</option>
              <option value="featured">Hanya Featured</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              {selectedIds.length} tokoh terpilih
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkActivate(true)}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
              >
                Aktifkan Semua
              </button>
              <button
                onClick={() => handleBulkActivate(false)}
                className="px-3 py-1 bg-zinc-600 text-white rounded-lg font-bold hover:bg-zinc-700 transition"
              >
                Nonaktifkan
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition"
              >
                Hapus Terpilih
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 uppercase font-bold text-[11px] border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredSambutans.length && filteredSambutans.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-3 py-3.5 w-14 text-center">Urutan</th>
                <th className="px-4 py-3.5">Tokoh & Foto</th>
                <th className="px-4 py-3.5">Jabatan & Gelar</th>
                <th className="px-4 py-3.5">Lokasi Tayang</th>
                <th className="px-3 py-3.5 text-center">Status</th>
                <th className="px-3 py-3.5 text-center">Featured</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading && sambutans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                      <span className="text-xs font-semibold text-zinc-500">Memuat data dari Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSambutans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    Tidak ada pemberi sambutan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSambutans.map((person, idx) => (
                  <tr
                    key={person.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition group"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(person.id)}
                        onChange={() => handleToggleSelect(person.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    {/* Reorder Arrows & Index */}
                    <td className="px-3 py-3.5 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <button
                          onClick={() => handleReorder(person, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 text-zinc-400 hover:text-emerald-600 disabled:opacity-20 cursor-pointer"
                          title="Naikkan urutan"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-xs text-zinc-700 dark:text-zinc-200">
                          {person.order_index}
                        </span>
                        <button
                          onClick={() => handleReorder(person, 'down')}
                          disabled={idx === filteredSambutans.length - 1}
                          className="p-0.5 text-zinc-400 hover:text-emerald-600 disabled:opacity-20 cursor-pointer"
                          title="Turunkan urutan"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Foto & Nama */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-emerald-600/30 shadow-xs bg-slate-100 dark:bg-zinc-800">
                          {person.photo_url ? (
                            <img
                              src={person.photo_url}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-base">
                              {person.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white text-sm">
                            {person.name}
                          </div>
                          {person.quote && (
                            <div className="text-[11px] text-zinc-400 italic line-clamp-1 max-w-xs">
                              &ldquo;{person.quote}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Jabatan & Gelar */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {person.title}
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {person.credentials && person.credentials.length > 0 ? (
                          person.credentials.map((cr, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                            >
                              {cr}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-zinc-400">Tanpa gelar</span>
                        )}
                      </div>
                    </td>

                    {/* Lokasi Badges */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {person.location?.map((loc) => (
                          <span
                            key={loc}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              loc === 'home'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Active Switch */}
                    <td className="px-3 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(person)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          person.is_active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {person.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="px-3 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(person)}
                        className={`p-1.5 rounded-xl transition cursor-pointer ${
                          person.is_featured
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-zinc-300 hover:text-amber-400'
                        }`}
                        title={person.is_featured ? 'Tokoh Utama (Featured)' : 'Jadikan Tokoh Utama'}
                      >
                        <Star className={`w-4 h-4 ${person.is_featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(person)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl text-xs font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicate(person)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
                          title="Duplikat Tokoh"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(person.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form: 2 Tabs */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                  {editing ? `Edit Sambutan: ${editing.name}` : 'Tambah Pemberi Sambutan Baru'}
                </h2>
                <p className="text-xs text-zinc-500">
                  Konfigurasikan biografi, pesan kalam hikmah, serta lokasi tayang di portal PPJM.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-5 pt-2 gap-4">
              <button
                type="button"
                onClick={() => setActiveModalTab('info')}
                className={`pb-3 text-xs font-bold border-b-2 transition ${
                  activeModalTab === 'info'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                }`}
              >
                1. Informasi Tokoh & Media
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('pesan')}
                className={`pb-3 text-xs font-bold border-b-2 transition ${
                  activeModalTab === 'pesan'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                }`}
              >
                2. Naskah Sambutan & Prestasi
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: INFORMASI TOKOH & MEDIA */}
              {activeModalTab === 'info' && (
                <div className="space-y-4">
                  {/* Foto Upload Preview */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-emerald-600/30 shadow-md bg-white dark:bg-zinc-800 shrink-0">
                      {form.photo_url ? (
                        <img
                          src={form.photo_url}
                          alt="Foto Pengasuh"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-2xl">
                          {form.name ? form.name.charAt(0) : <User className="w-10 h-10" />}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Foto Resmi Tokoh (Maksimal 2MB, WebP Auto-Compressed)
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Gunakan foto berlatar bersih dengan rasio pas foto formal.
                      </p>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <input
                          type="file"
                          ref={photoInputRef}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }}
                        />
                        <button
                          type="button"
                          disabled={compressing}
                          onClick={() => photoInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>{compressing ? 'Mengompresi...' : 'Pilih Foto'}</span>
                        </button>
                        {form.photo_url && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, photo_url: '' }))}
                            className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-semibold"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Nama Lengkap Tokoh <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I."
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Jabatan / Amanah */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Jabatan / Amanah Resmi <span className="text-rose-500">*</span>:
                    </label>
                    {!customTitle ? (
                      <select
                        value={form.title}
                        onChange={(e) => {
                          if (e.target.value === 'Lainnya (Ketik Manual)') {
                            setCustomTitle(true);
                            setForm((prev) => ({ ...prev, title: '' }));
                          } else {
                            setForm((prev) => ({ ...prev, title: e.target.value }));
                          }
                        }}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">-- Pilih Jabatan --</option>
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Ketik jabatan manual..."
                          value={form.title}
                          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                          className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setCustomTitle(false)}
                          className="px-3 py-2 bg-zinc-100 text-zinc-600 rounded-xl text-xs font-semibold"
                        >
                          Pilih Daftar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Gelar / Credentials Tags */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Gelar Akademik & Pesantren (Tekan Enter untuk menambah):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: Lc., M.Pd.I., S.Pd., Hafidz"
                        value={credentialInput}
                        onChange={(e) => setCredentialInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (credentialInput.trim()) {
                              setForm((prev) => ({
                                ...prev,
                                credentials: [...prev.credentials, credentialInput.trim()],
                              }));
                              setCredentialInput('');
                            }
                          }
                        }}
                        className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (credentialInput.trim()) {
                            setForm((prev) => ({
                              ...prev,
                              credentials: [...prev.credentials, credentialInput.trim()],
                            }));
                            setCredentialInput('');
                          }
                        }}
                        className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold"
                      >
                        Tambah
                      </button>
                    </div>
                    {form.credentials.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                        {form.credentials.map((c, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center gap-1 border border-zinc-200 dark:border-zinc-700"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  credentials: prev.credentials.filter((_, idx) => idx !== cIdx),
                                }))
                              }
                              className="text-zinc-400 hover:text-rose-500"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lokasi Multi Checkbox */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Tampilkan Pada Halaman (Multi Lokasi):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {LOCATION_OPTIONS.map((loc) => {
                        const checked = form.location.includes(loc.id);
                        return (
                          <label
                            key={loc.id}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                              checked
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm((prev) => ({
                                    ...prev,
                                    location: [...prev.location, loc.id],
                                  }));
                                } else {
                                  setForm((prev) => ({
                                    ...prev,
                                    location: prev.location.filter((id) => id !== loc.id),
                                  }));
                                }
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{loc.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Urutan, Status Aktif & Featured Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Urutan Tampilan:
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={form.order_index}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 1 }))
                        }
                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.is_active}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, is_active: e.target.checked }))
                          }
                          className="rounded text-emerald-600"
                        />
                        <span>Aktif Tayang</span>
                      </label>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/30 text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.is_featured}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, is_featured: e.target.checked }))
                          }
                          className="rounded text-amber-600"
                        />
                        <span>⭐ Tokoh Utama (Featured)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NASKAH SAMBUTAN & MEDIA */}
              {activeModalTab === 'pesan' && (
                <div className="space-y-4">
                  {/* Quote / Pesan Singkat */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Kutipan Mutiara / Pesan Singkat (Maksimal 150 karakter):
                      </label>
                      <span className="text-[10px] text-zinc-400">{form.quote.length} / 150</span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={150}
                      placeholder="Contoh: Mendidik dengan Adab, Membina dengan Al-Qur'an, Menjawab Tantangan Zaman."
                      value={form.quote}
                      onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-serif italic"
                    />
                  </div>

                  {/* Naskah Lengkap with WordLikeEditor (Full Toolbar & Word Count) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Naskah Lengkap Sambutan (Word-Like TipTap Editor):
                    </label>
                    <WordLikeEditor
                      value={form.message_full}
                      onChange={(val) => setForm((prev) => ({ ...prev, message_full: val }))}
                      bucket="avatars"
                      minHeight="220px"
                      toolbarMode="full"
                      placeholder="Tulis amanat & sambutan lengkap pimpinan..."
                    />
                  </div>

                  {/* Video YouTube URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-rose-500" /> Tautan Video Sambutan (YouTube URL):
                    </label>
                    <input
                      type="url"
                      placeholder="Contoh: https://www.youtube.com/watch?v=..."
                      value={form.video_url}
                      onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {/* Prestasi & Track Record Tags */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Prestasi & Rekam Jejak (Tekan Enter):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: Al-Azhar Alumnus, Penulis Buku Turats"
                        value={achievementInput}
                        onChange={(e) => setAchievementInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (achievementInput.trim()) {
                              setForm((prev) => ({
                                ...prev,
                                achievements: [...prev.achievements, achievementInput.trim()],
                              }));
                              setAchievementInput('');
                            }
                          }
                        }}
                        className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (achievementInput.trim()) {
                            setForm((prev) => ({
                              ...prev,
                              achievements: [...prev.achievements, achievementInput.trim()],
                            }));
                            setAchievementInput('');
                          }
                        }}
                        className="px-3 py-2 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold"
                      >
                        Tambah
                      </button>
                    </div>
                    {form.achievements.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                        {form.achievements.map((ach, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                          >
                            <span>{ach}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  achievements: prev.achievements.filter((_, idx) => idx !== aIdx),
                                }))
                              }
                              className="text-zinc-400 hover:text-rose-500"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Kontak Media Sosial */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> No. WhatsApp:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 628123456789"
                        value={form.social_links.wa}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            social_links: { ...prev.social_links, wa: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Resmi:
                      </label>
                      <input
                        type="email"
                        placeholder="Contoh: mudir@ppjauharulmaknuun.sch.id"
                        value={form.social_links.email}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            social_links: { ...prev.social_links, email: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 rounded-xl transition"
                >
                  Batal
                </button>
                <div className="flex items-center gap-2">
                  {activeModalTab === 'info' ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('pesan')}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      Lanjut ke Naskah Sambutan →
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveModalTab('info')}
                        className="px-4 py-2 text-xs font-bold text-zinc-600 bg-zinc-100 rounded-xl"
                      >
                        ← Kembali ke Info
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-950/20 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Pemberi Sambutan'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaSambutan;
