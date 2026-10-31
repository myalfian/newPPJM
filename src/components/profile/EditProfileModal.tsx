import React, { useState, useMemo } from 'react';
import { X, User, Phone, Briefcase, FileText, CheckCircle2, Loader2, Hash, Sparkles, AlertCircle } from 'lucide-react';
import { AdminProfile } from '../../lib/supabase';
import { sanitizeText, isValidFullName } from '../../utils/sanitize';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile;
  onSave: (updates: Partial<AdminProfile>) => Promise<{ error: Error | null }>;
}

const KELAS_OPTIONS = ['7A', '7B', '8A', '8B', '9A', '9B', 'Asrama Putra', 'Asrama Putri', 'Asatidz / Staf'];

export const EditProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [department, setDepartment] = useState(profile.department || '');
  const [nisOrNip] = useState(profile.nis_or_nip || ''); // Read-only untuk keamanan
  const [bio, setBio] = useState(profile.bio || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validasi Real-time
  const nameError = useMemo(() => {
    if (!fullName.trim()) return 'Nama lengkap wajib diisi.';
    if (fullName.trim().length < 2) return 'Nama terlalu pendek (minimal 2 karakter).';
    if (!isValidFullName(fullName)) return 'Format nama tidak valid. Jangan gunakan karakter kurung sudut (< >) atau skrip.';
    return null;
  }, [fullName]);

  const bioError = useMemo(() => {
    if (bio.length > 200) return 'Bio melebihi batas maksimal 200 karakter.';
    return null;
  }, [bio]);

  const isFormValid = !nameError && !bioError;

  const isModified = useMemo(() => {
    return (
      fullName.trim() !== (profile.full_name || '').trim() ||
      phone.trim() !== (profile.phone || '').trim() ||
      department.trim() !== (profile.department || '').trim() ||
      bio.trim() !== (profile.bio || '').trim()
    );
  }, [fullName, phone, department, bio, profile]);

  if (!isOpen) return null;

  const handleFullNameBlur = () => {
    const clean = sanitizeText(fullName, 50);
    setFullName(clean);
  };

  const handleBioBlur = () => {
    const clean = sanitizeText(bio, 200);
    setBio(clean);
  };

  const handlePasteSanitized = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>, setter: (val: string) => void, maxLen: number) => {
    e.preventDefault();
    const pasteText = e.clipboardData.getData('text/plain');
    const clean = sanitizeText(pasteText, maxLen);
    setter(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMessage(nameError || bioError || 'Mohon periksa kembali input formulir Anda.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const sanitizedName = sanitizeText(fullName, 50);
      const sanitizedPhone = sanitizeText(phone, 20);
      const sanitizedDept = sanitizeText(department, 50);
      const sanitizedBio = sanitizeText(bio, 200);

      const res = await onSave({
        full_name: sanitizedName,
        phone: sanitizedPhone,
        department: sanitizedDept,
        bio: sanitizedBio,
      });

      if (res.error) {
        setErrorMessage(res.error.message);
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan perubahan profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92dvh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <span>Perbarui Data Profil</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Tervalidasi
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Informasi personal akun resmi pesantren</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Nama Lengkap &amp; Gelar *</span>
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">{fullName.length}/50</span>
            </div>
            <input
              type="text"
              required
              maxLength={50}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={handleFullNameBlur}
              onPaste={(e) => handlePasteSanitized(e, setFullName, 50)}
              placeholder="Contoh: Ahmad Zaki Al-Maknuuni, S.Pd."
              className={`w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border text-xs sm:text-sm text-zinc-900 dark:text-white transition-all focus:outline-none ${
                nameError
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-zinc-200/80 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
            />
            {nameError && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{nameError}</p>}
          </div>

          {/* NIS / NIP (Read-Only demi keamanan institusi) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-zinc-400" />
                <span>Nomor Induk Santri (NIS) / NIP</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Terkunci (Hanya Administrator)</span>
            </label>
            <input
              type="text"
              disabled
              value={nisOrNip || 'NIS/NIP Terverifikasi'}
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-500 font-mono cursor-not-allowed"
            />
          </div>

          {/* Kelas / Departemen (Dropdown Terstandar) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
              <span>Kelas / Penugasan Khidmah</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="">Pilih Kelas / Satuan Tugas...</option>
              {KELAS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Nomor WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>Nomor WhatsApp Aktif</span>
            </label>
            <input
              type="tel"
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setPhone(sanitizeText(phone, 20))}
              placeholder="+62 812-3456-7890"
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
            />
          </div>

          {/* Motto Khidmah / Bio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span>Motto Khidmah &amp; Biografi Singkat</span>
              </label>
              <span className={`text-[10px] font-mono ${bio.length > 200 ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>
                {bio.length}/200
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={handleBioBlur}
              onPaste={(e) => handlePasteSanitized(e, setBio, 200)}
              placeholder="Tuliskan biografi singkat atau motto hidup santri (maks 200 karakter)..."
              className={`w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border text-xs sm:text-sm text-zinc-900 dark:text-white transition-all focus:outline-none ${
                bioError
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-zinc-200/80 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
            />
            {bioError && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{bioError}</p>}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isFormValid || !isModified || isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
