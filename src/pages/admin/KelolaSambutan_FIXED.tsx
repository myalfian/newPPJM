import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Database,
  Quote,
  User,
  Briefcase
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SambutanPerson } from '../../lib/supabase';
import { sanitizeText } from '../../utils/sanitize';
import { publishEditorState, getPublishedEditorState } from '../../lib/editorStorage';
import { Link } from 'react-router-dom';

interface FormState {
  id?: string;
  name: string;
  title: string;
  message: string;
  photoUrl?: string;
}

const INITIAL_FORM: FormState = {
  name: 'KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I.',
  title: 'Pengasuh & Pendiri Pondok Pesantren Jauharul Maknuun',
  message:
    'Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di gerbang digital Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik. Lembaga ini berikhtiar memadukan kemurnian sanad keilmuan kitab kuning turats salaf dengan penguasaan sains teknologi modern serta adab budi pekerti luhur.\n\nSemoga ikhtiar ini melahirkan generasi santri yang faqih fiddin, mutafannin, dan siap mengabdi bagi agama, nusa, dan bangsa.',
  photoUrl:
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
};

export const KelolaSambutan_FIXED: React.FC<{ onSaveSuccess?: () => void }> = ({
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [lastSavedInfo, setLastSavedInfo] = useState<{
    id: string;
    timestamp: string;
    savedBy?: string;
  } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Fetch live Sambutan from Supabase on mount
  const fetchLiveSambutan = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      console.log('[KelolaSambutan_FIXED] Fetching active sambutan from Supabase...');

      // 1. Query sambutan_persons
      const { data, error } = await supabase
        .from('sambutan_persons')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[KelolaSambutan_FIXED] Fetch error:', error);
        if (error.code === '42501') {
          setErrorMessage('RLS BLOCK! Akses baca publik ke tabel sambutan_persons ditolak (Code: 42501).');
        } else {
          setErrorMessage(`Gagal mengambil data dari Supabase: ${error.message}`);
        }
      }

      if (data) {
        console.log('[KelolaSambutan_FIXED] Live data found in Supabase:', data);
        setFormData({
          id: data.id,
          name: data.name,
          title: data.title,
          message: data.message_full || data.message_short || INITIAL_FORM.message,
          photoUrl: data.photo_url || INITIAL_FORM.photoUrl,
        });
        setLastSavedInfo({
          id: data.id,
          timestamp: data.updated_at
            ? new Date(data.updated_at).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'medium',
              })
            : 'Baru saja',
          savedBy: data.updated_by || 'Admin Pesantren',
        });
      } else {
        // 2. Fallback check jm_center_pages
        const { data: jmData } = await supabase
          .from('jm_center_pages')
          .select('*')
          .eq('slug', 'sambutan')
          .maybeSingle();

        if (jmData) {
          const extra = (jmData.extra_data as any) || {};
          setFormData({
            id: jmData.id,
            name: jmData.quotes || extra.penceramah || INITIAL_FORM.name,
            title: extra.jabatan || jmData.subtitle || INITIAL_FORM.title,
            message: jmData.content || INITIAL_FORM.message,
            photoUrl: jmData.banner_image || INITIAL_FORM.photoUrl,
          });
        }
      }
    } catch (err: any) {
      console.error('[KelolaSambutan_FIXED] Unexpected fetch error:', err);
      setErrorMessage(`Terjadi kesalahan jaringan: ${err?.message || 'Gagal koneksi'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSambutan();

    // Subscribe to live changes
    const channel = supabase
      .channel('sambutan-admin-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sambutan_persons' },
        (payload) => {
          console.log('[KelolaSambutan_FIXED] Realtime event received:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Form submit handler with deep multi-table synchronization
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanName = sanitizeText(formData.name.trim(), 120);
    const cleanTitle = sanitizeText(formData.title.trim(), 150);
    const cleanMessage = sanitizeText(formData.message.trim(), 5000);

    if (!cleanName || cleanName.length < 3) {
      setErrorMessage('Nama Lengkap Pengasuh wajib diisi minimal 3 karakter.');
      return;
    }
    if (!cleanTitle || cleanTitle.length < 3) {
      setErrorMessage('Jabatan & Amanah wajib diisi minimal 3 karakter.');
      return;
    }
    if (!cleanMessage || cleanMessage.length < 20) {
      setErrorMessage('Naskah Sambutan minimal 20 karakter.');
      return;
    }

    setSaving(true);
    console.log('[KelolaSambutan_FIXED] Saving to Supabase:', { cleanName, cleanTitle });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // 1. UPSERT ke tabel sambutan_persons (Primary Dynamic Source)
      const payload = {
        ...(formData.id ? { id: formData.id } : {}),
        name: cleanName,
        title: cleanTitle,
        role_type: 'pengasuh',
        photo_url: formData.photoUrl || INITIAL_FORM.photoUrl,
        message_short: cleanMessage.slice(0, 240),
        message_full: cleanMessage,
        order_index: 1,
        is_active: true,
        location: ['home', 'jm-center'],
        updated_at: new Date().toISOString(),
        updated_by: userId,
      };

      const { data: savedData, error: upsertError } = await supabase
        .from('sambutan_persons')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) {
        console.error('[KelolaSambutan_FIXED] Supabase Upsert Error:', upsertError);
        if (upsertError.code === '42501') {
          setErrorMessage(
            'RLS BLOCK (Code: 42501)! Akses simpan ditolak oleh kebijakan keamanan Postgres. Periksa izin admin.'
          );
        } else {
          setErrorMessage(`Gagal menyimpan ke database: ${upsertError.message} (Code: ${upsertError.code})`);
        }
        setSaving(false);
        return;
      }

      console.log('[KelolaSambutan_FIXED] Successfully saved to sambutan_persons:', savedData);

      // 2. SINKRONISASI ke tabel jm_center_pages (Backward Compatibility for /jm-center/sambutan)
      await supabase.from('jm_center_pages').upsert(
        {
          slug: 'sambutan',
          title: 'Sambutan Pengasuh Pondok Pesantren',
          subtitle: cleanTitle,
          content: cleanMessage,
          quotes: cleanName,
          banner_image: formData.photoUrl || INITIAL_FORM.photoUrl,
          updated_at: new Date().toISOString(),
          extra_data: {
            penceramah: cleanName,
            jabatan: cleanTitle,
            last_synced_from: 'KelolaSambutan_FIXED',
          },
        },
        { onConflict: 'slug' }
      );

      // 3. SINKRONISASI ke site_settings (Home Sections Config for /)
      try {
        const currentCfg = getPublishedEditorState();
        const updatedCfg = {
          ...currentCfg,
          sections: {
            ...currentCfg.sections,
            sambutan: {
              ...currentCfg.sections.sambutan,
              data: {
                ...currentCfg.sections.sambutan.data,
                pengasuhName: cleanName,
                title: cleanTitle,
                kalam: cleanMessage.slice(0, 280),
                imageUrl: formData.photoUrl || currentCfg.sections.sambutan.data.imageUrl,
              },
            },
          },
        };
        await publishEditorState(updatedCfg);
      } catch (errSync) {
        console.warn('[KelolaSambutan_FIXED] Site settings sync warning:', errSync);
      }

      // 4. Audit Log Recording
      if (userId) {
        await supabase.from('audit_logs').insert({
          user_id: userId,
          action: 'UPDATE_SAMBUTAN_MUDIR',
          module: 'sambutan_persons',
          section_id: savedData.id,
          new_data: {
            name: cleanName,
            title: cleanTitle,
            updated_at: new Date().toISOString(),
          },
        });
      }

      // Update Local State
      setFormData((prev) => ({
        ...prev,
        id: savedData.id,
      }));

      setLastSavedInfo({
        id: savedData.id,
        timestamp: new Date().toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'medium',
        }),
        savedBy: session?.user?.email || 'Admin',
      });

      setSuccessToast('✅ Alhamdulillah! Sambutan Mudir berhasil disimpan & langsung live di web publik!');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      console.error('[KelolaSambutan_FIXED] Save exception:', err);
      setErrorMessage(`Terjadi kendala sistem: ${err?.message || 'Gagal menyimpan data'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-700 text-white shadow-2xl flex items-center gap-3 border border-emerald-500 animate-fade-in max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs font-bold leading-relaxed">{successToast}</div>
        </div>
      )}

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold">Kendala Penyimpanan Database:</p>
            <p className="font-mono text-[11px]">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form Card (Matching screenshot layout) */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4"
      >
        {/* Info Header Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Formulir Sambutan Mudir &amp; Pengasuh
            </span>
          </div>

          {lastSavedInfo && (
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#0E7A4C]" />
              <span>Tersimpan di Cloud: {lastSavedInfo.timestamp}</span>
            </div>
          )}
        </div>

        {/* 2 Kolom: Nama Lengkap Pengasuh + Jabatan & Amanah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0E7A4C]" />
              <span>Nama Lengkap Pengasuh:</span>
            </label>
            <input
              type="text"
              required
              disabled={loading || saving}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I."
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold focus:border-[#0E7A4C] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#0E7A4C]" />
              <span>Jabatan &amp; Amanah:</span>
            </label>
            <input
              type="text"
              required
              disabled={loading || saving}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Pengasuh & Pendiri Pondok Pesantren Jauharul Maknuun"
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold focus:border-[#0E7A4C] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Naskah Sambutan (Textarea) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[#0E7A4C]" />
              <span>Naskah Sambutan:</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">
              {formData.message.length} karakter
            </span>
          </label>
          <textarea
            rows={8}
            required
            disabled={loading || saving}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tuliskan naskah sambutan resmi pengasuh pondok..."
            className="w-full p-4 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white leading-relaxed focus:border-[#0E7A4C] focus:outline-none transition-colors"
          />
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <Link
              to="/jm-center/sambutan"
              target="_blank"
              className="inline-flex items-center gap-1 text-[#0E7A4C] hover:underline font-bold"
            >
              <span>Lihat Halaman Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center justify-center gap-2 border border-[#C8A951]/30 cursor-pointer disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Sambutan Mudir</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KelolaSambutan_FIXED;
