import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Save,
  UserCheck,
  Building2,
  Phone,
  Award,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useSantri } from './SantriContext';
import { SantriTipTapEditor, parseRichJsonb } from './SantriTipTap';

const KELAS_OPTIONS = [
  'VII-A Tahfidz',
  'VII-B Sains STEM',
  'VIII-A Tahfidz',
  'VIII-B Sains STEM',
  'IX-A Tahfidz',
  'IX-B Sains STEM',
];

const KAMAR_OPTIONS = [
  'Al-Ghazali 01',
  'Al-Ghazali 02',
  'Al-Ghazali 03',
  'Imam Syafi’i 01',
  'Imam Syafi’i 02',
  'Rabi’ah Al-Adawiyah 01 (Putri)',
  'Khadijah Al-Kubra 02 (Putri)',
];

export const SantriProfilePage: React.FC = () => {
  const { profile, updateSantriProfile, uploadSantriFile, loading } = useSantri();

  const [fullName, setFullName] = useState(profile.full_name || '');
  const [nis, setNis] = useState(profile.nis || '');
  const [kelas, setKelas] = useState(profile.kelas || 'VIII-A Tahfidz');
  const [angkatan, setAngkatan] = useState(profile.angkatan || '2025');
  const [kamarAsrama, setKamarAsrama] = useState(profile.kamar_asrama || 'Al-Ghazali 03');
  const [waliSantri, setWaliSantri] = useState(profile.wali_santri || '');
  const [noWaWali, setNoWaWali] = useState(profile.no_wa_wali || '');
  const [hafalanJuz, setHafalanJuz] = useState<number>(profile.hafalan_juz ?? 6);
  const [fotoUrl, setFotoUrl] = useState(profile.foto_url || '');
  const [bioJson, setBioJson] = useState<any>(() => parseRichJsonb(profile.bio));

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFullName(profile.full_name || '');
    setNis(profile.nis || '');
    setKelas(profile.kelas || 'VIII-A Tahfidz');
    setAngkatan(profile.angkatan || '2025');
    setKamarAsrama(profile.kamar_asrama || 'Al-Ghazali 03');
    setWaliSantri(profile.wali_santri || '');
    setNoWaWali(profile.no_wa_wali || '');
    setHafalanJuz(profile.hafalan_juz ?? 6);
    setFotoUrl(profile.foto_url || '');
    setBioJson(parseRichJsonb(profile.bio));
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const { url } = await uploadSantriFile(file, 'avatars');
    if (url) {
      setFotoUrl(url);
    }
    setUploadingPhoto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateSantriProfile({
      full_name: fullName.trim() || 'Santri SMP Plus JM',
      nis: nis.trim(),
      kelas,
      angkatan: angkatan.trim(),
      kamar_asrama: kamarAsrama,
      wali_santri: waliSantri.trim(),
      no_wa_wali: noWaWali.trim(),
      hafalan_juz: Math.max(0, Math.min(30, Number(hafalanJuz) || 0)),
      foto_url: fotoUrl.trim() || null,
      bio: bioJson,
    });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-white border border-slate-200/70" />
        <div className="h-96 rounded-2xl bg-white border border-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={
                fotoUrl ||
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
              }
              alt={fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#115E59]/30 shadow-sm"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
              title="Ubah Foto Profil Santri"
            >
              {uploadingPhoto ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#115E59] text-[11px] font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role: Santri Aktif • Terverifikasi RLS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">{fullName}</h2>
            <p className="text-xs text-slate-500">
              NIS: <strong>{nis || '-'}</strong> • Kelas: <strong>{kelas}</strong> • Asrama:{' '}
              <strong>{kamarAsrama}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPhoto}
          className="self-start sm:self-center px-4 py-2 rounded-xl border border-slate-200 hover:border-[#115E59] bg-[#FAF8F5] hover:bg-white text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4 text-[#115E59]" />
          <span>{uploadingPhoto ? 'Mengunggah Foto…' : 'Ganti Foto Santri'}</span>
        </button>
      </div>

      {/* Form Biodata & WYSIWYG Bio Santri */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Identitas Akademik & Asrama */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
              Data Induk Santri
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Biodata Akademik &amp; Kamar Asrama
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="santri-fullname" className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Santri
              </label>
              <input
                id="santri-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
              />
            </div>

            <div>
              <label htmlFor="santri-nis" className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Induk Santri (NIS / NISN)
              </label>
              <input
                id="santri-nis"
                type="text"
                required
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Contoh: 70045189-089"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
              />
            </div>

            <div>
              <label htmlFor="santri-angkatan" className="block text-xs font-bold text-slate-700 mb-1">
                Tahun Angkatan Masuk
              </label>
              <input
                id="santri-angkatan"
                type="text"
                value={angkatan}
                onChange={(e) => setAngkatan(e.target.value)}
                placeholder="2025"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
              />
            </div>

            <div>
              <label htmlFor="santri-kelas" className="block text-xs font-bold text-slate-700 mb-1">
                Kelas SMP Plus JM
              </label>
              <select
                id="santri-kelas"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-[#115E59]"
              >
                {KELAS_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="santri-kamar" className="block text-xs font-bold text-slate-700 mb-1">
                Kamar Asrama Pondok
              </label>
              <select
                id="santri-kamar"
                value={kamarAsrama}
                onChange={(e) => setKamarAsrama(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-[#115E59]"
              >
                {KAMAR_OPTIONS.map((km) => (
                  <option key={km} value={km}>
                    {km}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="santri-wali" className="block text-xs font-bold text-slate-700 mb-1">
                Nama Orang Tua / Wali Santri
              </label>
              <input
                id="santri-wali"
                type="text"
                value={waliSantri}
                onChange={(e) => setWaliSantri(e.target.value)}
                placeholder="Nama Ayah / Ibu / Wali"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
              />
            </div>

            <div>
              <label htmlFor="santri-wa" className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Wali Santri
              </label>
              <input
                id="santri-wa"
                type="text"
                value={noWaWali}
                onChange={(e) => setNoWaWali(e.target.value)}
                placeholder="0821-xxxx-xxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="santri-juz" className="block text-xs font-bold text-slate-700 mb-1">
                Capaian Hafalan Al-Qur&apos;an Saat Ini (Juz 1–30)
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="santri-juz"
                  type="range"
                  min={0}
                  max={30}
                  value={hafalanJuz}
                  onChange={(e) => setHafalanJuz(Number(e.target.value))}
                  className="flex-1 accent-[#115E59] cursor-pointer"
                />
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#115E59] font-black text-sm shrink-0">
                  {hafalanJuz} Juz
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="santri-foto-url" className="block text-xs font-bold text-slate-700 mb-1">
                Tautan Foto Profil (Otomatis terisi saat upload foto)
              </label>
              <input
                id="santri-foto-url"
                type="url"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-[#115E59]"
              />
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Bio & Target Belajar WYSIWYG + Simpan */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3.5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                Editor WYSIWYG Santri
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Bio, Motto &amp; Target Belajar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tuliskan cita-cita, target khatam hafalan, dan bidang riset/ekskul yang sedang ditekuni.
              </p>
            </div>

            <SantriTipTapEditor
              value={bioJson}
              onChange={setBioJson}
              placeholder="Tuliskan bio singkat, motto hidup santri, dan target hafalan Al-Qur'an Anda..."
              minHeight="170px"
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-5 rounded-2xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Database…</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Keamanan Data Santri */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
            <div className="font-extrabold flex items-center gap-1.5 text-[#115E59]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Privasi &amp; Keamanan Data Santri (RLS Aktif)</span>
            </div>
            <p className="text-[11.5px] text-emerald-900/85 leading-relaxed">
              Biodata ini tersimpan di tabel <code>public.profiles</code> Supabase dan dilindungi kebijakan{' '}
              <code>auth.uid() = id</code> sehingga hanya Anda, Wali Kelas, dan Pengasuh Pondok yang berwenang mengaksesnya.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SantriProfilePage;

