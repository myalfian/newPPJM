import React, { useState } from 'react';
import {
  HeartHandshake,
  MessageSquare,
  Radio,
  Share2,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Globe,
  Video,
  Sparkles,
  Save,
  Eye,
  X,
  Copy,
  Check
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon
} from '../../components/common/SocialIcons';
import { MedsosModal } from '../../components/common/MedsosModal';

export interface ContactSettings {
  // 1. WhatsApp Admin Hotline
  waAdminNumber: string;
  waAdminLabel: string;
  waOperationalHours: string;
  waGreetingTemplate: string;

  // 2. Saluran WhatsApp Resmi
  waChannelUrl: string;
  waChannelTitle: string;
  waChannelDesc: string;

  // 3. Instagram Pondok Pesantren
  igPpjmUrl: string;
  igPpjmHandle: string;
  igPpjmDesc: string;

  // 4. Instagram SMP Plus JM
  igSmpjmUrl: string;
  igSmpjmHandle: string;
  igSmpjmDesc: string;

  // 5. Instagram OSIS SMP Plus JM
  igOsisUrl: string;
  igOsisHandle: string;
  igOsisDesc: string;

  // 6. TikTok Resmi Pesantren
  tiktokUrl: string;
  tiktokHandle: string;
  tiktokDesc: string;

  // 7. YouTube Channel Resmi
  youtubeUrl: string;
  youtubeHandle: string;
  youtubeDesc: string;

  // Alamat & Peta
  address: string;
  googleMapsUrl: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  waAdminNumber: '+62 856-4619-9273',
  waAdminLabel: 'WhatsApp Layanan & Konsultasi Santri Baru',
  waOperationalHours: 'Setiap Hari, 07.30 - 20.30 WIB',
  waGreetingTemplate: 'Assalamu\'alaikum Admin PPJM, saya ingin berkonsultasi mengenai pendaftaran santri baru.',

  waChannelUrl: 'https://whatsapp.com/channel/0029Vb6FZq7Jpe8cR5vR0T0D',
  waChannelTitle: 'Saluran WhatsApp Resmi',
  waChannelDesc: 'Warta kilat, pengumuman, & kajian pesantren',

  igPpjmUrl: 'https://www.instagram.com/ppjauharulmaknuun?mdxt=MWRieHkydGt5ZDNrNw==',
  igPpjmHandle: '@ppjauharulmaknuun',
  igPpjmDesc: 'Kehidupan santri, kajian kitab, & info kepesantrenan',

  igSmpjmUrl: 'https://www.instagram.com/smpplusjauharulmaknuun?dlrf=YzByczMxMXV3N3gz',
  igSmpjmHandle: '@smpplusjauharulmaknuun',
  igSmpjmDesc: 'Akademik formal, kurikulum STEM, & prestasi siswa',

  igOsisUrl: 'https://www.instagram.com/osissmppjm?rpxt=MmNiOGE1dGs3czM2',
  igOsisHandle: '@osissmppjm',
  igOsisDesc: 'Kreativitas santri, event kesiswaan, & dinamika OSIS',

  tiktokUrl: 'https://www.tiktok.com/@ppjauharulmaknuun',
  tiktokHandle: '@ppjauharulmaknuun',
  tiktokDesc: 'Video pendek edukasi, dakwah santri, & keseharian',

  youtubeUrl: 'https://www.youtube.com/@ppjauharulmaknuunlasem',
  youtubeHandle: 'PP Jauharul Maknuun Official',
  youtubeDesc: 'Siaran langsung pengajian, dokumenter santri, & warta',

  address: 'Jl. Raya Lasem, Sidayu, Kabupaten Gresik, Jawa Timur 61153',
  googleMapsUrl: 'https://maps.google.com/?q=Pondok+Pesantren+Jauharul+Maknuun+Sidayu+Gresik'
};

export const KelolaKontak: React.FC = () => {
  const [settings, setSettings] = useState<ContactSettings>(() => {
    try {
      const saved = localStorage.getItem('ppjm_contact_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedAlert, setSavedAlert] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFieldChange = (field: keyof ContactSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      localStorage.setItem('ppjm_contact_settings', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('ppjm-contact-settings-updated', { detail: settings }));
      await new Promise((r) => setTimeout(r, 400));
      setSavedAlert('Pengaturan kontak & 7 kanal medsos pop-up berhasil disimpan!');
      setTimeout(() => setSavedAlert(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-gold-300 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5 text-gold-400" />
              <span>Hotline &amp; 7 Kanal Medsos Resmi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kelola Kontak &amp; Medsos Pop-up
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Konfigurasi nomor WhatsApp hotline admin, tautan saluran resmi, serta 7 kanal media sosial yang tampil pada modal pop-up publik (MedsosModal) saat pengguna mengeklik ikon tengah di BottomNav.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4 text-gold-400" />
              <span>Preview Pop-up Medsos</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-emerald-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua'}</span>
            </button>
          </div>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{savedAlert}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* 1. WHATSAPP HOTLINE ADMIN & SALURAN RESMI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-base text-emerald-950">
                1. Kanal WhatsApp Admin &amp; Saluran Resmi (Channels)
              </h3>
              <p className="text-xs text-slate-500">
                Layanan obrolan langsung konsultasi wali santri dan saluran siaran pengumuman pondok.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Admin Hotline: *</label>
              <input
                type="text"
                required
                value={settings.waAdminNumber}
                onChange={(e) => handleFieldChange('waAdminNumber', e.target.value)}
                placeholder="+62 856-4619-9273"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Jam Operasional Layanan: *</label>
              <input
                type="text"
                required
                value={settings.waOperationalHours}
                onChange={(e) => handleFieldChange('waOperationalHours', e.target.value)}
                placeholder="Setiap Hari, 07.30 - 20.30 WIB"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Label Tombol Chat Admin:</label>
              <input
                type="text"
                value={settings.waAdminLabel}
                onChange={(e) => handleFieldChange('waAdminLabel', e.target.value)}
                placeholder="WhatsApp Layanan & Konsultasi Santri Baru"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Template Pesan Pembuka Otomatis (Pre-filled):</label>
              <textarea
                rows={2}
                value={settings.waGreetingTemplate}
                onChange={(e) => handleFieldChange('waGreetingTemplate', e.target.value)}
                placeholder="Assalamu'alaikum Admin PPJM, saya ingin menanyakan..."
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-600" />
                <span>URL Tautan Saluran WhatsApp Resmi (WhatsApp Channel): *</span>
              </label>
              <input
                type="url"
                required
                value={settings.waChannelUrl}
                onChange={(e) => handleFieldChange('waChannelUrl', e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 font-mono text-teal-900"
              />
            </div>
          </div>
        </div>

        {/* 2. MEDIA SOSIAL RESMI (INSTAGRAM, TIKTOK, YOUTUBE) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-base text-emerald-950">
                2. Daftar 7 Kanal Medsos Resmi untuk Pop-up MedsosModal
              </h3>
              <p className="text-xs text-slate-500">
                Tautan profil Instagram, TikTok, dan YouTube resmi pesantren untuk interaksi wali santri dan publik.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 3. Instagram PPJM */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="font-black text-xs text-slate-900">3. Instagram Pondok Pesantren (PPJM)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">Pondok</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Handle (@ppjauharulmaknuun)"
                  value={settings.igPpjmHandle}
                  onChange={(e) => handleFieldChange('igPpjmHandle', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="url"
                  placeholder="URL Instagram Pondok"
                  value={settings.igPpjmUrl}
                  onChange={(e) => handleFieldChange('igPpjmUrl', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>

            {/* 4. Instagram SMP Plus JM */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <InstagramIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-black text-xs text-slate-900">4. Instagram SMP Plus Jauharul Maknuun</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">SMP Plus</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Handle (@smpplusjauharulmaknuun)"
                  value={settings.igSmpjmHandle}
                  onChange={(e) => handleFieldChange('igSmpjmHandle', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="url"
                  placeholder="URL Instagram SMP Plus"
                  value={settings.igSmpjmUrl}
                  onChange={(e) => handleFieldChange('igSmpjmUrl', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>

            {/* 5. Instagram OSIS SMP Plus */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <InstagramIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-black text-xs text-slate-900">5. Instagram OSIS SMP Plus JM</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">OSIS JM</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Handle (@osissmppjm)"
                  value={settings.igOsisHandle}
                  onChange={(e) => handleFieldChange('igOsisHandle', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="url"
                  placeholder="URL Instagram OSIS"
                  value={settings.igOsisUrl}
                  onChange={(e) => handleFieldChange('igOsisUrl', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>

            {/* 6. TikTok Resmi Pesantren */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                    <TikTokIcon className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs text-slate-900">6. TikTok Resmi Pondok (@ppjauharulmaknuun)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">TikTok</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Handle TikTok (@ppjauharulmaknuun)"
                  value={settings.tiktokHandle}
                  onChange={(e) => handleFieldChange('tiktokHandle', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="url"
                  placeholder="URL TikTok"
                  value={settings.tiktokUrl}
                  onChange={(e) => handleFieldChange('tiktokUrl', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>

            {/* 7. YouTube Channel Resmi */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                    <YoutubeIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-black text-xs text-slate-900">7. YouTube Channel Resmi Pesantren</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">YouTube</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Channel (PP Jauharul Maknuun Official)"
                  value={settings.youtubeHandle}
                  onChange={(e) => handleFieldChange('youtubeHandle', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="url"
                  placeholder="URL YouTube Channel"
                  value={settings.youtubeUrl}
                  onChange={(e) => handleFieldChange('youtubeUrl', e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3. ALAMAT LOKASI & GOOGLE MAPS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-black text-base text-emerald-950">
                3. Alamat Kampus Pondok &amp; Tautan Google Maps
              </h3>
              <p className="text-xs text-slate-500">
                Ditampilkan pada footer dan halaman kontak website.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Lengkap Pesantren: *</label>
              <textarea
                rows={2}
                required
                value={settings.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Jl. Raya Lasem, Sidayu, Kabupaten Gresik, Jawa Timur 61153"
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tautan Pin Google Maps: *</label>
              <input
                type="url"
                required
                value={settings.googleMapsUrl}
                onChange={(e) => handleFieldChange('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 font-mono text-sky-900"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Reset ke Default
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Kontak & Medsos'}</span>
          </button>
        </div>

      </form>

      {/* POPUP SIMULATOR MEDSOSMODAL */}
      <MedsosModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

    </div>
  );
};
