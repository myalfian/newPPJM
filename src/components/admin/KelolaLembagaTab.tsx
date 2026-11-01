import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  School,
  BookOpen,
  CheckCircle2,
  Save,
  UploadCloud,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Tag,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { WordLikeEditor } from '../editor/WordLikeEditor';

export interface InstitutionItem {
  id: string;
  name: string;
  type: 'pesantren' | 'formal' | 'diniyah';
  description: string;
  curriculum: string[];
  image_url: string;
  order_index?: number;
  is_active?: boolean;
}

const DEFAULT_INSTITUTIONS: InstitutionItem[] = [
  {
    id: 'b0000001-0000-0000-0000-000000000001',
    name: 'Pondok Pesantren Jauharul Maknuun',
    type: 'pesantren',
    description: `# Meneguhkan Tradisi Salaf dan Mencetak Generasi Hafizh Al-Qur'an Bersanad 30 Juz

Pondok Pesantren Jauharul Maknuun (PPJM) yang berpusat di Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik, hadir sebagai kawah candradimuka pendidikan Islam terpadu yang memadukan kedalaman ilmu agama salafiyah dan pembinaan akhlak mulia. Melalui sistem tarbiyah asrama mukim 24 jam penuh di bawah bimbingan para *masyayikh* dan asatidz, santri dibina secara istiqamah dalam hafalan Al-Qur’an 30 juz mutqin dengan sanad keilmuan yang bersambung (*muttashil*) hingga Rasulullah saw.

## Pilar Tarbiyah Ruhiyah dan Kedisiplinan Asrama 24 Jam
Pendidikan kepesantrenan di PP. Jauharul Maknuun dirancang untuk membentuk pribadi santri yang mandiri, berintelektual luhur, dan matang secara spiritual. Setiap santri menjalani pembiasaan ibadah fardhu lima waktu berjamaah di masjid, *qiyamul lail*, puasa sunnah, serta pembacaan wirid *Rotibul Haddad* dan *Ratib Al-Attas* secara istiqamah demi menyucikan jiwa (*tazkiyatun nafs*).`,
    curriculum: [
      'Takhassus Tahfidzul Qur’an Bersanad',
      'Halaqah Tajwid & Tahsin',
      'Tarbiyah Ruhiyah Asrama 24 Jam'
    ],
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000002',
    name: 'SMP Plus Jauharul Maknuun',
    type: 'formal',
    description: `# Menelusuri Sejarah Pendirian dan Keunggulan 4 Sintesa Kurikulum SMP Plus Jauharul Maknuun

SMP Plus Jauharul Maknuun *Islamic Boarding School* merupakan satuan pendidikan formal jenjang menengah pertama di bawah naungan Yayasan Al Jauharu Al Maknuun yang berlokasi di Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik. Berdiri di atas lahan seluas 1.188 m² dan diresmikan langsung oleh Wakil Bupati Kabupaten Gresik, Ibu **Hj. Aminatun Habibah, M.Pd.** pada tanggal **21 Agustus 2022**.

## 4 Sintesa Kurikulum: Kiblat Pembinaan Mutu Pendidikan
1. **Pondok Modern Darussalam Gontor Ponorogo**: Kiblat kedisiplinan dan bilingual Arabic-English.
2. **Pondok Pesantren Yanbu’ul Qur’an Kudus**: Kiblat tahfidz bersanad fashahah muttashil.
3. **Pondok Pesantren Mambaus Sholihin Gresik**: Kiblat kajian kutubut turats salaf.
4. **SD IRADA Full Day Education**: Kiblat manajemen sekolah modern dan riset STEM.`,
    curriculum: [
      'Kurikulum Merdeka BAN-PDM Akreditasi A',
      '4 Sintesa Kurikulum Unggulan',
      "Tahfidzul Qur'an 30 Juz",
      'Laboratorium Riset STEM Komputer',
      'Kelas Bahasa Internasional (Inggris, Arab, Mandarin)'
    ],
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'b0000001-0000-0000-0000-000000000003',
    name: 'MDT Wustho Jauharul Maknuun',
    type: 'diniyah',
    description: `# Mengkaji Turats Klasik dan Memperkokoh Bahasa Arab Melalui Tradisi Maknani Jawa

Madrasah Diniyah Takmiliyah Wustho (MDT Wustho) Jauharul Maknuun merupakan lembaga pendidikan formal keagamaan berizin resmi Kementerian Agama Republik Indonesia (NSDT: **322235251146**) di bawah naungan Yayasan Al Jauharu Al Maknuun yang berdiri pada **21 Agustus 2022** di Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik.

## Tradisi Salafiyah dan Metode Pembelajaran Maknani Jawa
Kurikulum MDT Wustho Jauharul Maknuun berpijak murni pada khazanah pesantren salaf dengan metode maknani gandul pegon Jawa untuk menguasai sembilan cabang ilmu turats pokok.`,
    curriculum: [
      'Fikih, Nahwu & Shorof',
      'Hadits & Akhlak',
      'Tauhid & Faraidh',
      'Tarikh & Bahasa Arab',
      'Sistem Klasik Maknani Jawa'
    ],
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'
  }
];

export const KelolaLembagaTab: React.FC = () => {
  const [institutions, setInstitutions] = useState<InstitutionItem[]>(DEFAULT_INSTITUTIONS);
  const [selectedType, setSelectedType] = useState<'pesantren' | 'formal' | 'diniyah' | 'overview'>('pesantren');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Active item being edited
  const activeItem = institutions.find((inst) => inst.type === selectedType) || institutions[0];

  // Form states for the active institution
  const [name, setName] = useState(activeItem?.name || '');
  const [type, setType] = useState<'pesantren' | 'formal' | 'diniyah'>(activeItem?.type || 'pesantren');
  const [description, setDescription] = useState(activeItem?.description || '');
  const [imageUrl, setImageUrl] = useState(activeItem?.image_url || '');
  const [curriculum, setCurriculum] = useState<string[]>(activeItem?.curriculum || []);
  const [newCurriculumInput, setNewCurriculumInput] = useState('');

  // Compressor states
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when switching institution tabs
  useEffect(() => {
    if (selectedType !== 'overview') {
      const current = institutions.find((inst) => inst.type === selectedType);
      if (current) {
        setName(current.name);
        setType(current.type);
        setDescription(current.description || '');
        setImageUrl(current.image_url || '');
        setCurriculum(Array.isArray(current.curriculum) ? current.curriculum : []);
        setCompressionResult(null);
      }
    }
  }, [selectedType, institutions]);

  // Load live data from Supabase
  const fetchInstitutionsFromDb = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: InstitutionItem[] = data.map((d: any) => ({
          id: d.id,
          name: d.name || '',
          type: (d.type === 'formal' || d.type === 'diniyah' ? d.type : 'pesantren') as any,
          description: d.description || '',
          curriculum: Array.isArray(d.curriculum) ? d.curriculum : [],
          image_url: d.image_url || '',
          order_index: d.order_index,
          is_active: d.is_active
        }));
        setInstitutions(mapped);
      }
    } catch (err: any) {
      console.warn('Gagal memuat institutions dari Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutionsFromDb();

    const channel = supabase
      .channel('admin-institutions-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'institutions' }, () => {
        fetchInstitutionsFromDb();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Upload image with auto WebP compression
  const handleImageFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }
    setCompressing(true);
    try {
      const compressed = await compressImageToWebP(file, 1600, 1600, 0.85);
      setCompressionResult(compressed);

      if (isSupabaseConfigured() && compressed.file) {
        const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'lembaga';
        const storagePath = `institutions/${cleanSlug}-${Date.now()}.webp`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('cms-images')
          .upload(storagePath, compressed.file, {
            contentType: 'image/webp',
            upsert: true
          });

        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage
            .from('cms-images')
            .getPublicUrl(storagePath);
          if (urlData?.publicUrl) {
            setImageUrl(urlData.publicUrl);
            return;
          }
        }
      }
      setImageUrl(compressed.dataUrl);
    } catch (err: any) {
      alert('Gagal mengompres gambar: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setCompressing(false);
    }
  };

  // Add Curriculum Item
  const handleAddCurriculum = () => {
    const trimmed = newCurriculumInput.trim();
    if (!trimmed) return;
    if (curriculum.includes(trimmed)) {
      alert('Poin kurikulum ini sudah ada.');
      return;
    }
    setCurriculum([...curriculum, trimmed]);
    setNewCurriculumInput('');
  };

  // Remove Curriculum Item
  const handleRemoveCurriculum = (idx: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== idx));
  };

  // Save current institution to Supabase
  const handleSaveInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama lembaga tidak boleh kosong.');
      return;
    }

    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const payload = {
      name: name.trim(),
      type,
      description,
      curriculum,
      image_url: imageUrl
    };

    try {
      if (isSupabaseConfigured() && activeItem?.id) {
        const { error } = await supabase
          .from('institutions')
          .update(payload)
          .eq('id', activeItem.id);

        if (error) throw error;
      }

      // Update local state
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === activeItem.id
            ? { ...inst, ...payload }
            : inst
        )
      );

      // Invalidate query caches & dispatch realtime event
      invalidateCache('institutions_list');
      invalidateCache('institutions');
      invalidateCache('admin_dashboard_metrics');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('ppjm-content-updated', { detail: { type: 'lembaga', id: activeItem.id } })
        );
      }

      setSaveSuccess(`Alhamdulillah! Data "${name}" berhasil disimpan dan langsung tayang di web publik.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Save institution error:', err);
      setSaveError(err?.message || 'Gagal menyimpan perubahan ke database Supabase.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#072417] via-[#0E7A4C] to-[#072417] text-white border border-emerald-600/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-[#C8A951]/40 text-[#C8A951] text-[10.5px] font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Tritunggal Unit Pendidikan Terpadu PPJM</span>
          </div>
          <h2 className="text-base sm:text-lg font-black tracking-tight">
            Pusat Manajemen Profil 3 Lembaga
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            Kelola profil resmi, sintesa kurikulum unggulan, foto dokumentasi WebP, dan naskah sejarah untuk 3 pilar lembaga pendidikan PP. Jauharul Maknuun.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/jm-center/lembaga"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
            title="Lihat Tampilan Web Publik"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C8A951]" />
            <span>Pratinjau Publik</span>
          </a>
          <button
            type="button"
            onClick={fetchInstitutionsFromDb}
            disabled={loading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Muat Ulang Data dari Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Feedback Toasts */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/50 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 3. Sub-Tab Pills for the 3 Institutions */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 overflow-x-auto text-xs shadow-2xs">
        <button
          type="button"
          onClick={() => setSelectedType('pesantren')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedType === 'pesantren'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>1. Pondok Pesantren (PPJM)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('formal')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedType === 'formal'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>2. SMP Plus JM (Formal)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('diniyah')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedType === 'diniyah'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>3. MDT Wustho (Diniyah)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('overview')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedType === 'overview'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs border border-[#C8A951]/40'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ikhtisar 3 Lembaga</span>
        </button>
      </div>

      {/* 4. OVERVIEW MODE: Grid of All 3 Institutions */}
      {selectedType === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {institutions.map((inst, idx) => (
            <div
              key={inst.id || idx}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="h-40 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 relative">
                  {inst.image_url ? (
                    <img
                      src={inst.image_url}
                      alt={inst.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#C8A951] text-[10px] font-black uppercase tracking-wider border border-[#C8A951]/30">
                    {inst.type === 'pesantren'
                      ? 'Pondok Pesantren'
                      : inst.type === 'formal'
                      ? 'SMP Formal'
                      : 'Madrasah Diniyah'}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-3 mt-1 leading-relaxed">
                    {inst.description?.replace(/#|\*|_/g, '').slice(0, 150)}...
                  </p>
                </div>

                {inst.curriculum && inst.curriculum.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {inst.curriculum.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[#0E7A4C] dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800/60"
                      >
                        ✓ {c}
                      </span>
                    ))}
                    {inst.curriculum.length > 3 && (
                      <span className="text-[10px] text-zinc-400 self-center">
                        +{inst.curriculum.length - 3} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedType(inst.type)}
                className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs transition border border-emerald-200 dark:border-emerald-800 cursor-pointer"
              >
                ✏️ Edit Lembaga Ini
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* 5. DEDICATED FORM FOR ACTIVE INSTITUTION */
        <form
          onSubmit={handleSaveInstitution}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
        >
          {/* Identity Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Nama Lembaga / Unit Pendidikan:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pondok Pesantren Jauharul Maknuun"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Tipe / Kategori Entitas:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
              >
                <option value="pesantren">Pondok Pesantren (Salafiyah & Tahfidz)</option>
                <option value="formal">SMP Plus JM (Formal / Akreditasi A)</option>
                <option value="diniyah">Madrasah Diniyah (MDT Wustho)</option>
              </select>
            </div>
          </div>

          {/* Photo & WebP Compressor Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#0E7A4C]" />
                <span>Foto Utama / Cover Lembaga (Auto-WebP):</span>
              </label>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                WebP Compressor Siap
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageFileChange(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-32 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0 shadow-2xs">
                {imageUrl ? (
                  <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={compressing}
                    className="px-3 py-1.5 rounded-lg bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{compressing ? 'Mengompres...' : 'Unggah Foto Baru dari Komputer'}</span>
                  </button>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setCompressionResult(null);
                      }}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                {compressionResult ? (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Optimal WebP: {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)
                  </p>
                ) : (
                  <p className="text-[11px] text-zinc-500">
                    Mendukung JPG, PNG, atau WebP. Gambar otomatis dioptimalkan agar ringan dan jernih.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum & Features Pills Editor */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#0E7A4C]" />
                <span>Poin Kurikulum &amp; Keunggulan Utama (Tag Chips):</span>
              </label>
              <span className="text-[11px] text-zinc-400">
                {curriculum.length} Poin Terpasang
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
              {curriculum.length === 0 ? (
                <span className="text-xs text-zinc-400 italic">Belum ada poin kurikulum. Tambahkan di bawah.</span>
              ) : (
                curriculum.map((curr, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0E7A4C] dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                  >
                    <span>✓ {curr}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCurriculum(idx)}
                      className="hover:text-rose-600 ml-1 cursor-pointer"
                      title="Hapus poin ini"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCurriculumInput}
                onChange={(e) => setNewCurriculumInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCurriculum();
                  }
                }}
                placeholder="Tambah poin kurikulum / keunggulan baru (Tekan Enter)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={handleAddCurriculum}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Poin</span>
              </button>
            </div>
          </div>

          {/* Description WordLikeEditor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Naskah Deskripsi &amp; Profil Lengkap Lembaga:</span>
              <span className="text-[11px] text-zinc-400">
                Word-Like WYSIWYG &amp; Markdown Support
              </span>
            </label>
            <WordLikeEditor
              value={description}
              onChange={(val) => setDescription(val)}
              bucket="cms-images"
              minHeight="240px"
              toolbarMode="full"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400">
              Perubahan langsung disinkronkan ke tabel database Supabase &amp; web publik.
            </span>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Sedang Menyimpan...' : `Simpan Profil ${name || 'Lembaga'}`}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
