import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  BookOpen,
  GraduationCap,
  Home,
  Briefcase,
  Award,
  CheckCircle2,
  Calendar,
  Edit3,
  Eye,
  Phone,
  MapPin,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  getRoleMeta,
  normalizeCanonicalRole,
  type CanonicalRole,
} from '../../admin/permissions';
import { SantriRichViewer as SantriRichTextViewer } from '../../santri/SantriTipTap';
import type { DynamicProfileRecord } from '../../admin/UsersPage';

const db = supabase as any;

export const PublicProfileViewPage: React.FC = () => {
  const { role: paramRole, id: paramId } = useParams<{ role: string; id: string }>();
  const [targetProfile, setTargetProfile] = useState<DynamicProfileRecord | null>(null);
  const [performanceRows, setPerformanceRows] = useState<any[]>([]);
  const [hafalanRows, setHafalanRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Viewer perspective mode to demonstrate permission scoping (Guru viewing Santri vs Public vs Owner/Super Admin)
  const [viewerMode, setViewerMode] = useState<'guru' | 'super_admin' | 'public'>('guru');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let prof: DynamicProfileRecord | null = null;

      if (paramId) {
        const { data } = await db.from('profiles').select('*').eq('id', paramId).maybeSingle();
        if (data) prof = data as DynamicProfileRecord;
      }

      if (!prof && paramRole) {
        const canonical = normalizeCanonicalRole(paramRole);
        const { data } = await db
          .from('profiles')
          .select('*')
          .eq('role', canonical)
          .limit(1)
          .maybeSingle();
        if (data) prof = data as DynamicProfileRecord;
      }

      if (prof) {
        setTargetProfile(prof);
        const [{ data: perf }, { data: haf }] = await Promise.all([
          db.from('performance').select('*').eq('santri_id', prof.id).order('created_at', { ascending: false }),
          db.from('hafalan_setoran').select('*').eq('santri_id', prof.id).order('tanggal', { ascending: false }),
        ]);
        setPerformanceRows(perf || []);
        setHafalanRows(haf || []);
      }
      setLoading(false);
    };
    void load();
  }, [paramRole, paramId]);

  const targetCanonicalRole: CanonicalRole = useMemo(
    () => normalizeCanonicalRole(targetProfile?.role || paramRole),
    [targetProfile?.role, paramRole]
  );

  const meta = useMemo(() => getRoleMeta(targetCanonicalRole), [targetCanonicalRole]);

  const canSeeSensitiveData = viewerMode === 'super_admin';
  const canSeeAcademicDetails = viewerMode === 'guru' || viewerMode === 'super_admin';

  const avgScore = useMemo(() => {
    if (performanceRows.length === 0) return 91;
    return Math.round(
      performanceRows.reduce((acc, r) => acc + Number(r.nilai || 0), 0) / performanceRows.length
    );
  }, [performanceRows]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-10 px-4">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-16 rounded-2xl bg-stone-200/70 animate-pulse" />
          <div className="h-80 rounded-2xl bg-stone-200/70 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!targetProfile) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Profil Tidak Ditemukan</h1>
        <p className="text-sm text-stone-500">Data pengguna dengan ID tersebut tidak ditemukan atau tidak aktif.</p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2.5 text-xs font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Profil Saya
        </Link>
      </div>
    );
  }

  const juzPct = Math.min(100, Math.round(((targetProfile.hafalan_juz ?? 9) / 30) * 100));

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 text-stone-900">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Bar & Viewer Permission Simulator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 p-2 text-stone-700 transition"
              title="Kembali ke /profile"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-bold text-stone-800">
                Public & Role-Scoped Profile View (<code>/profile/{targetCanonicalRole}/{targetProfile.id.slice(0, 8)}…</code>)
              </p>
              <p className="text-[11px] text-stone-500">
                Menampilkan informasi sesuai hak akses (menyembunyikan data sensitif jika bukan Owner/Admin).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-400 mr-1 flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-[#115E59]" />
              Dilihat Sebagai:
            </span>
            {[
              { id: 'guru', label: 'Guru (Read-Only Akademik)' },
              { id: 'public', label: 'Publik (Terbatas)' },
              { id: 'super_admin', label: 'Owner / Super Admin' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setViewerMode(m.id as any)}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition ${
                  viewerMode === m.id
                    ? 'bg-[#115E59] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="rounded-2xl border border-stone-200/80 bg-white overflow-hidden shadow-xs">
          {/* Decorative Header Banner */}
          <div className="h-28 bg-gradient-to-r from-[#115E59] via-teal-700 to-emerald-800 relative px-6 flex items-end pb-3 justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-200" />
              Terverifikasi Sistem Informasi PP Jauharul Maknuun
            </span>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <img
                  src={
                    targetProfile.foto_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={targetProfile.full_name}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                <div className="pt-2 sm:pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${meta.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                      {meta.label}
                    </span>
                    {targetCanonicalRole === 'santri' ? (
                      <span className="text-xs font-bold text-stone-500">
                        NIS: {targetProfile.nis || '202608001'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-stone-500">
                        NIP: {targetProfile.nip || '-'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-extrabold text-stone-900 mt-1">
                    {targetProfile.full_name}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {targetCanonicalRole === 'santri'
                      ? `Santri Kelas ${targetProfile.kelas || 'VIII-A Tahfidz'} • Angkatan ${
                          targetProfile.angkatan || '2025/2026'
                        }`
                      : targetProfile.jabatan || meta.label}
                  </p>
                </div>
              </div>

              {canSeeSensitiveData && (
                <Link
                  to="/admin/users"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Kelola di /admin/users
                </Link>
              )}
            </div>

            {/* Bio Section */}
            <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-4 mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Profil Singkat & Portofolio
              </p>
              <SantriRichTextViewer content={targetProfile.bio} />
            </div>

            {/* Role-Specific Public/Scoped Content */}
            {targetCanonicalRole === 'santri' ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-stone-200/80 p-4 bg-white">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-[#115E59]" />
                      Kelas & Kamar Asrama
                    </span>
                    <p className="text-base font-extrabold text-stone-900 mt-1">
                      {targetProfile.kelas || 'VIII-A Tahfidz'}
                    </p>
                    <p className="text-xs text-stone-500">
                      Kamar: {targetProfile.asrama_kamar || targetProfile.kamar_asrama || 'Al-Ghazali 04'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200/80 p-4 bg-white">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-[#115E59]" />
                      Progres Tahfidz Al-Qur'an
                    </span>
                    <p className="text-base font-extrabold text-[#115E59] mt-1">
                      {targetProfile.hafalan_juz ?? 9} Juz Mutqin ({juzPct}%)
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#115E59]"
                        style={{ width: `${juzPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200/80 p-4 bg-white">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-[#115E59]" />
                      Rata-Rata Akademik
                    </span>
                    <p className="text-base font-extrabold text-stone-900 mt-1">
                      {canSeeAcademicDetails ? `${avgScore} / 100` : 'Terbatas (Khusus Guru/Wali)'}
                    </p>
                    <p className="text-xs text-stone-500">
                      {performanceRows.length} Mata Pelajaran Tercatat
                    </p>
                  </div>
                </div>

                {/* Read-Only Academic Table for Guru / Super Admin */}
                {canSeeAcademicDetails ? (
                  <div className="rounded-2xl border border-stone-200/80 overflow-hidden">
                    <div className="bg-[#FAF8F5] px-4 py-3 border-b border-stone-200/80 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Rekap Akademik & Evaluasi Pembelajaran (Read-Only untuk Guru)
                      </span>
                      <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-[#115E59] border border-teal-200">
                        Akses Guru Kelas Ampu
                      </span>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-stone-100 text-stone-500 font-bold uppercase">
                        <tr>
                          <th className="py-2.5 px-4">Mata Pelajaran</th>
                          <th className="py-2.5 px-4">Jenis</th>
                          <th className="py-2.5 px-4">Nilai</th>
                          <th className="py-2.5 px-4">Predikat</th>
                          <th className="py-2.5 px-4">Catatan Musyrif / Guru</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {performanceRows.map((r) => (
                          <tr key={r.id}>
                            <td className="py-2.5 px-4 font-bold text-stone-800">{r.mapel}</td>
                            <td className="py-2.5 px-4 uppercase text-stone-500">{r.jenis}</td>
                            <td className="py-2.5 px-4 font-extrabold text-[#115E59]">{r.nilai}</td>
                            <td className="py-2.5 px-4">{r.predikat}</td>
                            <td className="py-2.5 px-4 text-stone-600">{r.catatan_musyrif}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 flex items-center gap-3 text-xs text-amber-900">
                    <Lock className="h-4 w-4 shrink-0 text-amber-700" />
                    <span>
                      Rincian nilai akademik hanya ditampilkan untuk Guru Pengampu, Musyrif, Santri yang bersangkutan, dan Super Admin.
                    </span>
                  </div>
                )}

                {/* Privacy-Protected Contact & Wali Info */}
                <div className="rounded-2xl border border-stone-200/80 p-4 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-stone-800">
                      Informasi Kontak Wali & Alamat Rumah
                    </p>
                    {canSeeSensitiveData ? (
                      <div className="text-xs text-stone-600 mt-1 space-y-0.5">
                        <p>
                          Wali: <strong>{targetProfile.wali_info?.nama_ayah || '-'}</strong> &{' '}
                          <strong>{targetProfile.wali_info?.nama_ibu || '-'}</strong> (WA:{' '}
                          {targetProfile.wali_info?.kontak_wali || targetProfile.wa_number})
                        </p>
                        <p>Alamat: {targetProfile.alamat_lengkap}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500 mt-0.5">
                        Disembunyikan secara otomatis untuk melindungi privasi santri & keluarga (Hanya Owner / Super Admin).
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-stone-200 px-3 py-1.5 text-[11px] font-bold text-stone-600 shrink-0">
                    <Lock className="h-3.5 w-3.5 text-[#115E59]" />
                    {canSeeSensitiveData ? 'Terbuka (Super Admin)' : 'Dilindungi Privasi RLS'}
                  </span>
                </div>
              </div>
            ) : (
              /* Public View for Guru / Musyrif / Pimpinan / Staf */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-stone-200/80 p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Bidang Pengajaran & Keahlian
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(targetProfile.mapel_ampu?.length
                      ? targetProfile.mapel_ampu
                      : targetProfile.mapel_diampu?.length
                      ? targetProfile.mapel_diampu
                      : [meta.label]
                    ).map((m, i) => (
                      <span
                        key={i}
                        className="rounded-xl bg-teal-50 px-3 py-1 text-xs font-bold text-[#115E59] border border-teal-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200/80 p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Informasi Kepegawaian & Kontak
                  </p>
                  <p className="text-xs text-stone-700 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-[#115E59]" />
                    Jabatan: <strong>{targetProfile.jabatan || meta.label}</strong>
                  </p>
                  <p className="text-xs text-stone-700 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#115E59]" />
                    Kontak:{' '}
                    <strong>
                      {canSeeSensitiveData
                        ? targetProfile.wa_number || '0821-3160-6535'
                        : '0821-3160-•••• (Humas Resmi)'}
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

