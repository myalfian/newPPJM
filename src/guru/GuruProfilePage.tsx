import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Save,
  Plus,
  Trash2,
  Loader2,
  GraduationCap,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useGuru, JadwalMengajarItem } from './GuruContext';
import { GuruTipTapEditor } from './GuruTipTap';
import { parseRichJsonb } from '../santri/SantriTipTap';

const MAPEL_LIST = [
  'Matematika Olimpiade',
  "Tahfidzul Qur'an",
  'Fiqih Madrasah Diniyah',
  'English',
  'Arabic',
  'IPA & Robotika STEM',
  'Bahasa Mandarin',
  'Adab & Akhlak Pesantren',
];

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'];

export const GuruProfilePage: React.FC = () => {
  const { guruProfile, updateGuruProfile, uploadGuruFile, loading } = useGuru();

  const [fullName, setFullName] = useState(guruProfile.full_name);
  const [nip, setNip] = useState(guruProfile.nip || '');
  const [phone, setPhone] = useState(guruProfile.phone || '');
  const [pendidikan, setPendidikan] = useState(guruProfile.pendidikan || '');
  const [mapelDiampu, setMapelDiampu] = useState<string[]>(guruProfile.mapel_diampu || []);
  const [jadwal, setJadwal] = useState<JadwalMengajarItem[]>(guruProfile.jadwal_mengajar || []);
  const [fotoUrl, setFotoUrl] = useState(guruProfile.foto_url || '');
  const [bioJson, setBioJson] = useState<any>(() => parseRichJsonb(guruProfile.bio));

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFullName(guruProfile.full_name || '');
    setNip(guruProfile.nip || '');
    setPhone(guruProfile.phone || '');
    setPendidikan(guruProfile.pendidikan || '');
    setMapelDiampu(guruProfile.mapel_diampu || []);
    setJadwal(guruProfile.jadwal_mengajar || []);
    setFotoUrl(guruProfile.foto_url || '');
    setBioJson(parseRichJsonb(guruProfile.bio));
  }, [guruProfile]);

  const toggleMapel = (m: string) => {
    setMapelDiampu((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const addJadwalRow = () => {
    setJadwal((prev) => [
      ...prev,
      {
        hari: 'Senin',
        jam: '07:30 - 09:00',
        kelas: 'VIII-A Tahfidz',
        mapel: mapelDiampu[0] || 'IPA & Robotika STEM',
      },
    ]);
  };

  const updateJadwalRow = (idx: number, field: keyof JadwalMengajarItem, val: string) => {
    setJadwal((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row)));
  };

  const removeJadwalRow = (idx: number) => {
    setJadwal((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const { url } = await uploadGuruFile(file, 'berita-images');
    if (url) setFotoUrl(url);
    setUploadingPhoto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateGuruProfile({
      full_name: fullName.trim() || 'Ustadz/Ustadzah SMP Plus JM',
      nip: nip.trim(),
      phone: phone.trim(),
      pendidikan: pendidikan.trim(),
      mapel_diampu: mapelDiampu,
      jadwal_mengajar: jadwal,
      foto_url: fotoUrl.trim() || null,
      bio: bioJson,
    });
    setSaving(false);
  };

  if (loading) {
    return <div className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                fotoUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
              }
              alt={fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#115E59]/30 shadow-sm"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#115E59] text-white flex items-center justify-center shadow-md cursor-pointer"
            >
              {uploadingPhoto ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#115E59] text-[11px] font-extrabold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Dewan Asatidz &amp; Musyrif SMP Plus JM</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">{fullName}</h2>
            <p className="text-xs text-slate-500">
              NIP: <strong>{nip || '-'}</strong> • Pendidikan: <strong>{pendidikan || '-'}</strong>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-amber-300" />
          )}
          <span>{saving ? 'Menyimpan…' : 'Simpan Profil Guru'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Identitas, Mapel & Jadwal Mengajar */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                Identitas Pengajar
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Biodata Lengkap, NIP, Pendidikan &amp; Kontak
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar Akademik
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP / NIY Yayasan
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pendidikan Terakhir &amp; Sanad Keilmuan
                </label>
                <input
                  type="text"
                  value={pendidikan}
                  onChange={(e) => setPendidikan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#115E59]"
                />
              </div>
            </div>

            {/* Mata Pelajaran yang Diampu */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#115E59]" />
                <span>Mata Pelajaran &amp; Bidang Binaan (Klik untuk memilih):</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {MAPEL_LIST.map((m) => {
                  const selected = mapelDiampu.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMapel(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#115E59] text-white border-[#115E59] shadow-2xs'
                          : 'bg-[#FAF8F5] text-slate-600 border-slate-200 hover:border-[#115E59]'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Jadwal Mengajar Editor */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Pengaturan KBM
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Jadwal Mengajar &amp; Halaqah Mingguan
                </h3>
              </div>
              <button
                type="button"
                onClick={addJadwalRow}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#115E59] text-xs font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jadwal</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {jadwal.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/70 items-center"
                >
                  <select
                    value={row.hari}
                    onChange={(e) => updateJadwalRow(idx, 'hari', e.target.value)}
                    className="sm:col-span-3 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                  >
                    {HARI_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={row.jam}
                    onChange={(e) => updateJadwalRow(idx, 'jam', e.target.value)}
                    placeholder="07:30 - 09:00"
                    className="sm:col-span-3 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={row.kelas}
                    onChange={(e) => updateJadwalRow(idx, 'kelas', e.target.value)}
                    placeholder="Kelas"
                    className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={row.mapel}
                    onChange={(e) => updateJadwalRow(idx, 'mapel', e.target.value)}
                    placeholder="Mata Pelajaran"
                    className="sm:col-span-3 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => removeJadwalRow(idx)}
                    className="sm:col-span-1 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer"
                    title="Hapus baris jadwal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Bio WYSIWYG */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
              Profil Akademik WYSIWYG
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Biografi Singkat &amp; Pesan untuk Santri
            </h3>
          </div>

          <GuruTipTapEditor
            value={bioJson}
            onChange={(json) => setBioJson(json)}
            onUploadImage={(f) => uploadGuruFile(f, 'berita-images')}
            placeholder="Tuliskan biografi pengajar, latar belakang pendidikan, dan motivasi belajar..."
            minHeight="210px"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-5 rounded-2xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-amber-300" />
            )}
            <span>Simpan Seluruh Perubahan Profil</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default GuruProfilePage;

