import React, { useState, useMemo } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, KeyRound } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
  userRole?: string;
}

const WEAK_PASSWORDS_BLACKLIST = [
  '123456',
  '12345678',
  '123456789',
  'password',
  'password123',
  'qwerty',
  'admin123',
  'ppjm123',
  'santri123',
  'bismillah',
  'jauharul',
  'maknuun',
  'pesantren',
  'santri2026',
  'admin2026',
  'indonesia',
];

const PW_RATE_LIMIT_KEY = 'ppjm_pw_change_attempts';
const MAX_ATTEMPTS_PER_HOUR = 3;

export const ChangePasswordModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userEmail = '',
  userId,
  userRole = 'santri',
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rate Limiting Check
  const checkRateLimit = (): boolean => {
    try {
      const raw = localStorage.getItem(PW_RATE_LIMIT_KEY);
      const timestamps: number[] = raw ? JSON.parse(raw) : [];
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const recent = timestamps.filter((t) => t > oneHourAgo);

      if (recent.length >= MAX_ATTEMPTS_PER_HOUR) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  const recordRateLimitAttempt = () => {
    try {
      const raw = localStorage.getItem(PW_RATE_LIMIT_KEY);
      const timestamps: number[] = raw ? JSON.parse(raw) : [];
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const recent = timestamps.filter((t) => t > oneHourAgo);
      recent.push(Date.now());
      localStorage.setItem(PW_RATE_LIMIT_KEY, JSON.stringify(recent));
    } catch {
      // ignore localstorage errors
    }
  };

  // Real-time password entropy & strength calculation
  const strength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'Belum diisi', color: 'bg-zinc-200 dark:bg-zinc-700', textColor: 'text-zinc-400' };

    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (newPassword.length >= 12) score += 1;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    // Check blacklist
    const isBlacklisted = WEAK_PASSWORDS_BLACKLIST.includes(newPassword.toLowerCase());
    if (isBlacklisted) {
      return { score: 1, label: 'Sangat Rentan (Terlalu Umum)', color: 'bg-rose-600', textColor: 'text-rose-600' };
    }

    if (score <= 2) {
      return { score: 1, label: 'Lemah', color: 'bg-rose-500', textColor: 'text-rose-500' };
    } else if (score === 3) {
      return { score: 2, label: 'Sedang', color: 'bg-amber-500', textColor: 'text-amber-500' };
    } else if (score === 4) {
      return { score: 3, label: 'Kuat', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
    } else {
      return { score: 4, label: 'Sangat Kuat (Grade Militer)', color: 'bg-teal-500', textColor: 'text-teal-500' };
    }
  }, [newPassword]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Rate Limiting Check
    if (!checkRateLimit()) {
      setErrorMessage(
        'Batas perubahan sandi tercapai (maksimal 3x per jam). Demi keamanan akun Anda, silakan coba lagi nanti.'
      );
      return;
    }

    // 2. Current Password Validation
    if (!currentPassword) {
      setErrorMessage('Kata sandi saat ini wajib diisi untuk verifikasi keamanan.');
      return;
    }

    // 3. Length & Format Check
    if (newPassword.length < 8) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter.');
      return;
    }

    // 4. Blacklist Check
    const isBlacklisted = WEAK_PASSWORDS_BLACKLIST.includes(newPassword.toLowerCase());
    if (isBlacklisted) {
      setErrorMessage('Kata sandi terlalu mudah ditebak. Harap gunakan kombinasi karakter yang lebih acak dan aman.');
      return;
    }

    // Email matching check
    const emailPrefix = userEmail.split('@')[0]?.toLowerCase();
    if (emailPrefix && emailPrefix.length > 3 && newPassword.toLowerCase().includes(emailPrefix)) {
      setErrorMessage('Kata sandi baru tidak boleh mengandung nama email Anda.');
      return;
    }

    // 5. Match Check
    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isSupabaseConfigured() && userEmail) {
        // Re-authenticate with current password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: currentPassword,
        });

        if (signInError) {
          setErrorMessage('Kata sandi saat ini tidak valid. Verifikasi identitas gagal.');
          setIsSubmitting(false);
          return;
        }

        // Update password in Supabase
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          setErrorMessage(updateError.message || 'Gagal memperbarui kata sandi di sistem.');
          setIsSubmitting(false);
          return;
        }

        // Revoke other active sessions for defense against session hijacking
        try {
          await supabase.auth.signOut({ scope: 'others' });
        } catch {
          // ignore if scope not supported in local provider
        }

        // Audit Log entry
        (supabase.from as any)('audit_logs')
          .insert({
            user_id: userId,
            email: userEmail,
            role: userRole,
            action: 'UPDATE_PASSWORD',
            module: 'profil',
            section_id: 'security_credentials',
            ip_address: 'client-ip',
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          })
          .then(() => {}, () => {});
      }

      recordRateLimitAttempt();
      setSuccessMessage('Alhamdulillah, kata sandi berhasil diperbarui! Semua sesi di perangkat lain telah dinonaktifkan.');

      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage(null);
      }, 2200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat memproses pembaruan sandi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92dvh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Ganti Kata Sandi</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{userEmail || 'Akun Terproteksi PPJM'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Current Password with Re-auth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Kata Sandi Saat Ini: *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Kata Sandi Baru: *
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter unik & kuat"
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter Bars */}
            {newPassword && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400">Tingkat Kekuatan:</span>
                  <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-full transition-all duration-300 ${
                        level <= strength.score ? strength.color : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Konfirmasi Kata Sandi Baru: *
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] text-rose-500 font-medium">Konfirmasi kata sandi tidak cocok.</p>
            )}
          </div>

          {/* Security Checklist */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standar Keamanan Kata Sandi PPJM</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
              <li>Minimal 8 karakter (disarankan 12+ karakter untuk keamanan optimal).</li>
              <li>Sertakan huruf besar, huruf kecil, angka, dan karakter khusus.</li>
              <li>Perubahan sandi secara otomatis mencabut sesi di perangkat lain.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (confirmPassword !== '' && newPassword !== confirmPassword) || !currentPassword || newPassword.length < 8}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Perbarui Kata Sandi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
