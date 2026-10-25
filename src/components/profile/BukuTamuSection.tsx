import React, { useState } from 'react';
import {
  BookOpen,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Heart,
  Star,
  MessageSquare,
  Search,
  Filter,
  RotateCcw,
  User,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  GuestBookEntry,
  getGuestBookEntries,
  addGuestBookEntry,
  resetGuestBookEntries
} from '../../services/bukuTamuService';

interface Props {
  guestName?: string;
  onSuccessMessage?: (msg: string) => void;
}

export const BukuTamuSection: React.FC<Props> = ({ guestName = 'Tamu Terhormat (Guest)', onSuccessMessage }) => {
  const [entries, setEntries] = useState<GuestBookEntry[]>(getGuestBookEntries);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');

  // Form State
  const [name, setName] = useState(guestName === 'Tamu / Pengunjung' ? '' : guestName);
  const [origin, setOrigin] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [purpose, setPurpose] = useState<GuestBookEntry['purpose']>('Silaturahmi');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama lengkap atau nama panggilan wajib diisi.');
      return;
    }
    if (!origin.trim()) {
      setFormError('Asal kota, lembaga, atau daerah wajib diisi.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setFormError('Pesan atau doa silaturahmi mohon diisi minimal 5 karakter.');
      return;
    }

    const newEntry = addGuestBookEntry({
      name: name.trim(),
      origin: origin.trim(),
      phoneOrEmail: phoneOrEmail.trim() || undefined,
      purpose,
      message: message.trim(),
      rating,
      isPublic: true,
    });

    setEntries(getGuestBookEntries());
    setIsFormOpen(false);
    setMessage('');
    setFormError(null);
    if (onSuccessMessage) {
      onSuccessMessage(`Terima kasih Bapak/Ibu ${newEntry.name}, pesan buku tamu Anda berhasil dicatat.`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan catatan Buku Tamu ke data default resmi pondok?')) {
      const reset = resetGuestBookEntries();
      setEntries(reset);
      if (onSuccessMessage) {
        onSuccessMessage('Buku Tamu telah disetel ulang ke data bawaan.');
      }
    }
  };

  const filteredEntries = entries.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterPurpose === 'all' || item.purpose === filterPurpose;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Guest Role Statement */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white overflow-hidden shadow-xl border border-emerald-800/60">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d4af37] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buku Tamu Digital • Pondok Pesantren Jauharul Maknuun</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Ahlan Wa Sahlan, Tamu Terhormat (Guest)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
              Sebagai <strong>Guest (Tamu Publik)</strong>, Anda memiliki hak penuh untuk menjelajahi seluruh informasi pesantren dan menitipkan untaian doa, kesan, serta pesan silaturahmi melalui Buku Tamu Digital ini.
            </p>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex-1 sm:flex-none min-h-[44px] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isFormOpen ? 'Tutup Formulir' : '+ Isi Buku Tamu'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-emerald-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Kembalikan data contoh buku tamu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Guest Permission Highlights */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Membaca Al-Qur'an 30 Juz & Berita</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Mengisi Pesan Kunjungan & Silaturahmi</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Akses Kalender Agenda, Galeri & Video</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Input Form Modal / Accordion */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <MessageSquare className="w-5 h-5" />
              <span>Formulir Pengisian Buku Tamu</span>
            </div>
            <span className="text-[11px] text-zinc-500">* Wajib diisi</span>
          </div>

          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Nama Lengkap / Panggilan *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: H. Ahmad Syukron / Ibu Fatimah"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Asal Kota / Lembaga / Instansi *
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Contoh: Surabaya / Yayasan Al-Ikhlas Gresik"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Maksud & Tujuan Kunjungan *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as GuestBookEntry['purpose'])}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="Silaturahmi">Silaturahmi & Kunjungan Santri</option>
                <option value="Kunjungan PPDB">Pendaftaran Santri Baru (PPDB)</option>
                <option value="Konsultasi Santri">Konsultasi Perkembangan Santri</option>
                <option value="Studi Banding">Studi Banding Lembaga / Sekolah</option>
                <option value="Kajian & Ziarah">Kajian Diniyah & Ziarah Masyayikh</option>
                <option value="Umum">Kunjungan Umum & Doa Bersama</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                No. WhatsApp / Email (Opsional)
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="0812-xxxx-xxxx / email@domain.com"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Pesan, Kesan, & Untaian Doa untuk Pondok Pesantren *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan kesan kunjungan Anda, motivasi untuk para santri, atau doa barokah untuk masyayikh pondok..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-500 font-medium mr-1">Kesan Layanan:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan ke Buku Tamu</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. Search & Purpose Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu, kota, atau pesan..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          {['all', 'Silaturahmi', 'Kunjungan PPDB', 'Studi Banding', 'Konsultasi Santri'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterPurpose(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterPurpose === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Semua Maksud' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Guest Book Entries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{item.origin}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-bold shrink-0">
                  {item.purpose}
                </span>
              </div>

              {/* Message Quote */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 relative">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  "{item.message}"
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1">
                {[...Array(item.rating || 5)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 space-y-2">
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Belum ada catatan buku tamu yang cocok
          </p>
          <p className="text-xs text-zinc-500">
            Jadilah yang pertama mengisi Buku Tamu Pondok Pesantren Jauharul Maknuun!
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Isi Buku Tamu</span>
          </button>
        </div>
      )}
    </div>
  );
};
