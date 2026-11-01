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
  Image as ImageIcon,
  Trash2,
  PlusCircle,
  Star,
  Eye,
  Check,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { sanitizeText, sanitizeUrl, isValidImageUrl } from '../../utils/sanitize';
import { publishEditorState, getPublishedEditorState } from '../../lib/editorStorage';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { Link } from 'react-router-dom';
import { SectionWordEditor } from '../../components/editor/SectionWordEditor';
import { clearOldSeedCache } from '../../utils/clearOldCache';

interface SambutanFormState {
  id?: string;
  name: string;
  title: string;
  role_type: string;
  message_full: string;
  message_short: string;
  photo_url: string;
  order_index: number;
  is_active: boolean;
  is_featured: boolean;
  location: string[];
}

const EMPTY_FORM: SambutanFormState = {
  name: '',
  title: '',
  role_type: 'pengasuh',
  message_full: '',
  message_short: '',
  photo_url: '',
  order_index: 1,
  is_active: true,
  is_featured: false,
  location: ['home', 'jm-center'],
};

export const KelolaSambutan: React.FC = () => {
  const [sambutans, setSambutans] = useState<SambutanPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SambutanPerson | null>(null);
  const [form, setForm] = useState<SambutanFormState>(EMPTY_FORM);
  const [compressing, setCompressing] = useState<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. FETCH dari Supabase (bukan dari initialSections hardcode!)
  async function fetchSambutan() {
    if (!isSupabaseConfigured()) {
      setError('Koneksi Supabase belum terkonfigurasi pada .env');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[KelolaSambutan] Fetching sambutan_persons from Supabase...');

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
        showToast(`Gagal memuat sambutan: ${fetchErr.message}`, 'error');
      } else {
        const rows = (data || []) as SambutanPerson[];
        setSambutans(rows);

        // Jika form kosong dan ada data featured, set form awal untuk edit mudah
        if (!editing && rows.length > 0) {
          const featured = rows.find((s) => s.is_featured) || rows[0];
          setEditing(featured);
          setForm({
            id: featured.id,
            name: featured.name || '',
            title: featured.title || '',
            role_type: featured.role_type || 'pengasuh',
            message_full: featured.message_full || '',
            message_short: featured.message_short || '',
            photo_url: featured.photo_url || '',
            order_index: featured.order_index ?? 1,
            is_active: featured.is_active !== false,
            is_featured: featured.is_featured === true,
            location: Array.isArray(featured.location) ? featured.location : ['home', 'jm-center'],
          });
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat sambutan dari database.');
    } finally {
      setLoading(false);
    }
  }

  // 2. REALTIME subscription - sinkronisasi otomatis multi-admin & live refresh
  useEffect(() => {
    fetchSambutan();

    const channel = supabase
      .channel('realtime-sambutan-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        (payload) => {
          console.log('[KelolaSambutan] Realtime notification received:', payload);
          // Auto-refetch dari server agar state selalu konsisten dengan DB
          fetchSambutan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. UPLOAD foto dari komputer dengan Auto-WebP Compression
  async function handlePhotoUpload(file: File) {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 2MB (JPG, PNG, atau WebP).', 'error');
      return;
    }

    setCompressing(true);
    try {
      // Kompresi WebP client-side
      const res: CompressionResult = await compressImageToWebP(file, 800, 1000, 0.85);

      // Coba upload ke Supabase Storage bucket 'avatars' jika aktif
      let finalUrl = res.dataUrl;
      try {
        const fileExt = 'webp';
        const fileName = `sambutan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${fileExt}`;

        // Convert dataUrl to blob
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
        // Fallback to high-efficiency dataUrl jika storage bucket belum siap
        console.warn('Storage upload fallback to WebP dataURL:', storageException);
      }

      setForm((prev) => ({ ...prev, photo_url: finalUrl }));
      showToast(`Foto berhasil dikompresi ke WebP (${res.compressedSizeKB} KB, hemat ${res.savedPercent}%).`);
    } catch (err: any) {
      showToast('Gagal memproses foto: ' + (err?.message || 'Error'), 'error');
    } finally {
      setCompressing(false);
    }
  }

  // 4. SAVE dengan UPSERT ke Supabase + error handling + audit log
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    // Validasi
    const name = sanitizeText(form.name.trim(), 120);
    const title = sanitizeText(form.title.trim(), 150);
    const messageFull = sanitizeText(form.message_full.trim(), 10000);
    const messageShort = form.message_short
      ? sanitizeText(form.message_short.trim(), 500)
      : messageFull.slice(0, 240);

    if (!name || name.length < 3) {
      showToast('Nama Lengkap Mudir/Pengasuh minimal 3 karakter.', 'error');
      return;
    }
    if (!title || title.length < 3) {
      showToast('Jabatan & Amanah minimal 3 karakter.', 'error');
      return;
    }
    if (!messageFull || messageFull.length < 20) {
      showToast('Naskah sambutan minimal 20 karakter.', 'error');
      return;
    }

    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Jika diset sebagai featured, pastikan sambutan lain dinonaktifkan status featured-nya
      if (form.is_featured) {
        await supabase
          .from('sambutan_persons')
          .update({ is_featured: false } as any)
          .neq('id', editing?.id || '00000000-0000-0000-0000-000000000000');
      }

      const payload: any = {
        name,
        title,
        role_type: form.role_type || 'pengasuh',
        message_full: messageFull,
        message_short: messageShort,
        photo_url: form.photo_url || null,
        order_index: Number(form.order_index) || 1,
        is_active: form.is_active,
        is_featured: form.is_featured,
        location: form.location && form.location.length > 0 ? form.location : ['home', 'jm-center'],
        updated_at: new Date().toISOString(),
        updated_by: userId || null,
      };

      if (editing?.id) {
        payload.id = editing.id;
      }

      // UPSERT ke tabel sambutan_persons + .select().single()
      const { data: savedData, error: upsertError } = await supabase
        .from('sambutan_persons')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) {
        console.error('[KelolaSambutan] Upsert error:', upsertError);
        if (upsertError.code === '42501') {
          showToast(
            '❌ RLS BLOCK (42501)! Akses simpan ditolak oleh policy Postgres. Cek permission role.',
            'error'
          );
        } else if (upsertError.code === '23505') {
          showToast('❌ Duplikat data: ID atau data unik sudah ada di tabel.', 'error');
        } else {
          showToast(`❌ Gagal simpan: ${upsertError.message} (Code: ${upsertError.code})`, 'error');
        }
        setSaving(false);
        return;
      }

      // SINKRONISASI KE TABEL jm_center_pages & site_settings AGAR 100% PERSISTEN & TIDAK PERNAH BALIK SEED
      try {
        await supabase.from('jm_center_pages').upsert(
          {
            slug: 'sambutan',
            title: 'Sambutan Pengasuh Pondok Pesantren',
            subtitle: title,
            content: messageFull,
            quotes: name,
            banner_image: form.photo_url || null,
            updated_at: new Date().toISOString(),
            extra_data: {
              penceramah: name,
              jabatan: title,
              last_synced_from: 'KelolaSambutan',
            },
          },
          { onConflict: 'slug' }
        );

        // Update site_settings for Home section
        const currentCfg = getPublishedEditorState();
        const updatedCfg = {
          ...currentCfg,
          sections: {
            ...currentCfg.sections,
            sambutan: {
              ...currentCfg.sections.sambutan,
              data: {
                ...currentCfg.sections.sambutan.data,
                pengasuhName: name,
                title: title,
                kalam: messageShort,
                imageUrl: form.photo_url || currentCfg.sections.sambutan.data.imageUrl,
              },
            },
          },
        };
        await publishEditorState(updatedCfg);
      } catch (syncErr) {
        console.warn('[KelolaSambutan] Backward compatibility sync notice:', syncErr);
      }

      // Audit Log Recording
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
          console.warn('[KelolaSambutan] Audit log notice:', auditErr);
        }
      }

      // Hapus cache lama di browser agar langsung live
      try {
        clearOldSeedCache();
        localStorage.removeItem('sambutan');
        localStorage.removeItem('ppjm_published_public_state_v1');
      } catch {}

      // Update local state dengan data dari Supabase (bukan dari form!)
      if (editing) {
        setSambutans((prev) => prev.map((s) => (s.id === savedData.id ? (savedData as SambutanPerson) : s)));
      } else {
        setSambutans((prev) =>
          [...prev, savedData as SambutanPerson].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        );
      }

      showToast('✅ Berhasil! Data sudah tersimpan di Supabase dan otomatis live di web publik.');
      setEditing(savedData as SambutanPerson);
      setForm((prev) => ({ ...prev, id: savedData.id }));
    } catch (err: any) {
      showToast('Kendala menyimpan data: ' + (err?.message || 'Error'), 'error');
    } finally {
      setSaving(false);
    }
  }

  // 5. DELETE sambutan
  async function handleDelete(id: string) {
    const target = sambutans.find((s) => s.id === id);
    if (!target) return;

    if (!confirm(`Yakin ingin menghapus sambutan dari "${target.name}"? Data akan dihapus permanen dari Supabase.`)) {
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showToast('Sesi autentikasi telah habis. Mohon login ulang.', 'error');
      return;
    }

    // Proteksi: jangan hapus sambutan unggulan terakhir jika hanya tersisa 1
    const featuredCount = sambutans.filter((s) => s.is_featured).length;
    if (target.is_featured && featuredCount <= 1 && sambutans.length > 1) {
      showToast('Tidak bisa menghapus sambutan unggulan terakhir. Tetapkan tokoh lain sebagai Featured terlebih dahulu.', 'error');
      return;
    }

    try {
      const { error: delErr } = await supabase.from('sambutan_persons').delete().eq('id', id);

      if (delErr) {
        showToast(`Gagal menghapus: ${delErr.message}`, 'error');
        return;
      }

      // Audit Log
      await supabase.from('audit_logs').insert({
        user_id: session.user.id,
        email: session.user.email,
        action: 'DELETE_SAMBUTAN',
        module: 'sambutan_persons',
        section_id: id,
        old_data: target as any,
        created_at: new Date().toISOString(),
      });

      setSambutans((prev) => prev.filter((s) => s.id !== id));
      if (editing?.id === id) {
        const remaining = sambutans.filter((s) => s.id !== id);
        if (remaining.length > 0) {
          handleSelectEdit(remaining[0]);
        } else {
          setEditing(null);
          setForm(EMPTY_FORM);
        }
      }

      clearOldSeedCache();
      showToast(`Sambutan ${target.name} berhasil dihapus dari database.`);
    } catch (err: any) {
      showToast('Gagal menghapus: ' + err.message, 'error');
    }
  }

  // Quick action: Set featured
  async function handleSetFeatured(person: SambutanPerson) {
    try {
      // Nonaktifkan semua featured lain
      await supabase.from('sambutan_persons').update({ is_featured: false } as any).neq('id', person.id);
      // Aktifkan featured untuk target
      const { error: updErr } = await supabase
        .from('sambutan_persons')
        .update({ is_featured: true, is_active: true } as any)
        .eq('id', person.id);

      if (updErr) {
        showToast('Gagal mengubah unggulan: ' + updErr.message, 'error');
        return;
      }

      setSambutans((prev) =>
        prev.map((s) => ({
          ...s,
          is_featured: s.id === person.id,
          is_active: s.id === person.id ? true : s.is_active,
        }))
      );

      if (editing?.id === person.id) {
        setForm((prev) => ({ ...prev, is_featured: true, is_active: true }));
      }

      showToast(`⭐ "${person.name}" kini menjadi Sambutan Utama (Featured) di Beranda Publik!`);
    } catch (err: any) {
      showToast('Gagal mengubah status: ' + err.message, 'error');
    }
  }

  const handleSelectEdit = (person: SambutanPerson) => {
    setEditing(person);
    setForm({
      id: person.id,
      name: person.name || '',
      title: person.title || '',
      role_type: person.role_type || 'pengasuh',
      message_full: person.message_full || '',
      message_short: person.message_short || '',
      photo_url: person.photo_url || '',
      order_index: person.order_index ?? 1,
      is_active: person.is_active !== false,
      is_featured: person.is_featured === true,
      location: Array.isArray(person.location) ? person.location : ['home', 'jm-center'],
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      order_index: sambutans.length + 1,
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  if (loading && sambutans.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-3xl animate-pulse flex items-center justify-center text-zinc-500 font-bold text-sm">
          Menghubungkan ke Supabase Cloud (sambutan_persons)...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification Banner */}
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

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Kalam Pimpinan &amp; Pengasuh Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Kelola Sambutan Mudir &amp; Pimpinan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Manajemen sambutan multi-pimpinan terhubung penuh ke Supabase &amp; sinkronisasi realtime ke web publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSambutan}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pimpinan Baru</span>
          </button>
          <Link
            to="/jm-center/sambutan"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 text-amber-300 hover:bg-zinc-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Publik</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{error}</span>
          </div>
          <button
            onClick={fetchSambutan}
            className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Total Pimpinan</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{sambutans.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Aktif Tayang</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {sambutans.filter((s) => s.is_active).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Sambutan Utama (Home)</p>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-2 truncate">
            {sambutans.find((s) => s.is_featured)?.name || sambutans[0]?.name || 'Belum diatur'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status Database</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Live Supabase</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Editor Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-7 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                {editing ? `Edit Sambutan: ${editing.name}` : 'Formulir Tambah Sambutan Baru'}
              </h2>
            </div>
            {editing && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                ID: {editing.id.slice(0, 8)}...
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Nama & Jabatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Nama Lengkap Tokoh *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I."
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Jabatan &amp; Amanah *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pengasuh & Pendiri Pondok Pesantren"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Role Type & Order Index */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Kategori Tokoh:</label>
                <select
                  value={form.role_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, role_type: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  <option value="pengasuh">Pengasuh / Mudir</option>
                  <option value="wakil_pengasuh">Wakil Pengasuh</option>
                  <option value="dewan_asatidz">Dewan Asatidz / Masyayikh</option>
                  <option value="kepala_sekolah">Kepala SMP Plus</option>
                  <option value="kepala_madin">Kepala Madin Al-Mubarokah</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Urutan Prioritas:</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={form.order_index}
                  onChange={(e) => setForm((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Tampilkan di Halaman:</label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.location.includes('home')}
                      onChange={(e) => {
                        const locs = e.target.checked
                          ? [...form.location, 'home']
                          : form.location.filter((l) => l !== 'home');
                        setForm((prev) => ({ ...prev, location: locs }));
                      }}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Beranda (Home)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.location.includes('jm-center')}
                      onChange={(e) => {
                        const locs = e.target.checked
                          ? [...form.location, 'jm-center']
                          : form.location.filter((l) => l !== 'jm-center');
                        setForm((prev) => ({ ...prev, location: locs }));
                      }}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>JM Center</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Unggah Foto Tokoh Pengasuh dari Komputer dengan Auto-WebP */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Foto Resmi Tokoh (Otomatis WebP)</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-bold">
                  Auto-WebP Hemat Kuota
                </span>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handlePhotoUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 shrink-0 shadow-xs relative">
                  {form.photo_url ? (
                    <img src={form.photo_url} alt="Pratinjau Foto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-[10px] text-center p-1 font-bold">
                      <User className="w-6 h-6 mb-1 opacity-50" />
                      Belum ada foto
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={compressing}
                    className="w-full py-2.5 px-3 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{compressing ? 'Mengompres ke WebP...' : 'Pilih Foto dari Komputer (JPG, PNG, WebP)'}</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Sistem otomatis mengompresi gambar ke WebP 800x1000px demi kelancaran akses wali santri.
                  </p>
                  {form.photo_url && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, photo_url: '' }))}
                      className="text-[11px] text-rose-600 hover:underline font-bold"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Naskah Sambutan Lengkap dengan Toolbar Word-Like */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Naskah Sambutan Lengkap (Word Toolbar Contextual) *</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                  Full Word Ribbon Aktif
                </span>
              </label>
              <SectionWordEditor
                sectionType="sambutan"
                fieldName="message_full"
                value={form.message_full}
                onChange={(html) => setForm((prev) => ({ ...prev, message_full: html }))}
                bucket="avatars"
                minHeight="280px"
              />
            </div>

            {/* Ringkasan Kalam Hikmah untuk Beranda */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Ringkasan Kalam Hikmah (Kutipan Beranda Publik)
              </label>
              <SectionWordEditor
                sectionType="sambutan"
                fieldName="message_short"
                value={form.message_short}
                onChange={(html) => setForm((prev) => ({ ...prev, message_short: html }))}
                bucket="avatars"
                minHeight="110px"
              />
            </div>

            {/* Status Aktif & Featured Toggle */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Status Aktif (Ditampilkan ke Publik)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Jadikan Sambutan Utama Beranda</span>
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              {editing && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Batal Edit
                </button>
              )}
              <button
                type="submit"
                disabled={saving || compressing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Menyimpan ke Supabase...' : 'Simpan ke Supabase & Live Publik'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Tokoh & Pratinjau Live (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card Daftar Sambutan Tersimpan */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                  Daftar Pimpinan ({sambutans.length})
                </h3>
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold">Realtime Sync</span>
            </div>

            {sambutans.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs font-medium">
                Belum ada data sambutan di tabel Supabase.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {sambutans.map((person) => {
                  const isSelected = editing?.id === person.id;
                  return (
                    <div
                      key={person.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 shrink-0">
                          {person.photo_url ? (
                            <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-2 text-zinc-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{person.name}</p>
                            {person.is_featured && (
                              <span title="Utama di Beranda">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate">{person.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!person.is_featured && (
                          <button
                            type="button"
                            onClick={() => handleSetFeatured(person)}
                            title="Jadikan Sambutan Utama Beranda"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSelectEdit(person)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 text-zinc-800 dark:text-zinc-200 transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(person.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-emerald-950 to-zinc-900 rounded-3xl p-5 text-white border border-emerald-800/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">
                Pratinjau Beranda Publik
              </span>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Live Sinkron
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="w-14 h-16 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 bg-black/40">
                {form.photo_url ? (
                  <img src={form.photo_url} alt="Pratinjau" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-3 text-emerald-600" />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-black text-amber-300 truncate">{form.name || 'Nama Mudir Pengasuh'}</h4>
                <p className="text-[11px] text-emerald-200 truncate">{form.title || 'Pengasuh Pondok Pesantren'}</p>
                <p className="text-[11px] text-zinc-300 italic line-clamp-3 leading-relaxed">
                  "{form.message_short || form.message_full.slice(0, 180) || 'Kalam hikmah sambutan pengasuh...'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaSambutan;
