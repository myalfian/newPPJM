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
  Globe
} from 'lucide-react';
import { SimpleFormCard } from '../../components/admin/SimpleFormCard';
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon
} from '../../components/common/SocialIcons';

interface ContactSettings {
  waAdminNumber: string;
  waAdminLabel: string;
  waOperationalHours: string;
  waChannelUrl: string;
  waChannelTitle: string;
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  tiktokHandle: string;
  youtubeUrl: string;
  youtubeHandle: string;
  address: string;
  googleMapsUrl: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  waAdminNumber: '+62 856-4619-9273',
  waAdminLabel: 'WhatsApp Layanan & Konsultasi Santri Baru',
  waOperationalHours: 'Setiap Hari, 07.30 - 20.30 WIB',
  waChannelUrl: 'https://whatsapp.com/channel/0029Vb6FZq7Jpe8cR5vR0T0D',
  waChannelTitle: 'Saluran Warta & Pengumuman Pesantren',
  instagramUrl: 'https://instagram.com/ppjauharulmaknuun',
  instagramHandle: '@ppjauharulmaknuun',
  tiktokUrl: 'https://tiktok.com/@ppjauharulmaknuun',
  tiktokHandle: '@ppjauharulmaknuun',
  youtubeUrl: 'https://youtube.com/@ppjauharulmaknuun',
  youtubeHandle: 'PP Jauharul Maknuun Official',
  address: 'Jl. Raya Lasem, Sidayu, Kabupaten Gresik, Jawa Timur 61153',
  googleMapsUrl: 'https://maps.app.goo.gl/...'
};

export const KelolaKontak: React.FC = () => {
  const [settings, setSettings] = useState<ContactSettings>(() => {
    try {
      const saved = localStorage.getItem('ppjm_contact_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ppjm_contact_settings', JSON.stringify(settings));
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pusat Hotline &amp; Komunikasi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Kelola Kontak &amp; Medsos Pop-up
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Perbarui nomor hotline WhatsApp, saluran siaran resmi, serta tautan akun media sosial pesantren.
          </p>
        </div>
      </div>

      <SimpleFormCard
        title="Layanan WhatsApp & Hotline Resmi"
        subtitle="Nomor kontak yang akan muncul saat wali santri mengeklik tombol WhatsApp atau bantuan di website."
        icon={MessageSquare}
        isPublished={true}
        onPublish={handleSave}
        onSaveDraft={handleSave}
        isSaving={isSaving}
        draftStorageKey="ppjm_contact_settings"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Nomor WhatsApp Admin (Hotline)
              </label>
              <div className="relative">
                <WhatsAppIcon className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.waAdminNumber}
                  onChange={(e) => setSettings({ ...settings, waAdminNumber: e.target.value })}
                  className="w-full min-h-[48px] pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                  placeholder="+62 856-4619-9273"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Jam Layanan &amp; Operasional
              </label>
              <input
                type="text"
                value={settings.waOperationalHours}
                onChange={(e) => setSettings({ ...settings, waOperationalHours: e.target.value })}
                className="w-full min-h-[48px] px-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                placeholder="Setiap Hari, 07.30 - 20.30 WIB"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Tautan Saluran WhatsApp Resmi (WhatsApp Channel)
            </label>
            <div className="relative">
              <Radio className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={settings.waChannelUrl}
                onChange={(e) => setSettings({ ...settings, waChannelUrl: e.target.value })}
                className="w-full min-h-[48px] pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                placeholder="https://whatsapp.com/channel/..."
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Digunakan untuk menyiarkan warta kilat, pengumuman libur santri &amp; jadwal kajian live.
            </p>
          </div>
        </div>
      </SimpleFormCard>

      <SimpleFormCard
        title="Akun Media Sosial Resmi Pesantren"
        subtitle="Akun resmi yang dapat diakses oleh publik untuk melihat dokumentasi keseharian santri."
        icon={Share2}
        isPublished={true}
        onPublish={handleSave}
        onSaveDraft={handleSave}
        isSaving={isSaving}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Instagram Pesantren
              </label>
              <div className="relative">
                <InstagramIcon className="w-4 h-4 text-pink-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.instagramHandle}
                  onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  className="w-full min-h-[48px] pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                  placeholder="@ppjauharulmaknuun"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                TikTok Resmi
              </label>
              <div className="relative">
                <TikTokIcon className="w-4 h-4 text-zinc-800 dark:text-zinc-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.tiktokHandle}
                  onChange={(e) => setSettings({ ...settings, tiktokHandle: e.target.value })}
                  className="w-full min-h-[48px] pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                  placeholder="@ppjauharulmaknuun"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              YouTube Channel
            </label>
            <div className="relative">
              <YoutubeIcon className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={settings.youtubeHandle}
                onChange={(e) => setSettings({ ...settings, youtubeHandle: e.target.value })}
                className="w-full min-h-[48px] pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                placeholder="PP Jauharul Maknuun Official"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Alamat Lengkap Pesantren
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-3.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              placeholder="Jl. Raya Lasem, Sidayu, Gresik..."
            />
          </div>
        </div>
      </SimpleFormCard>

    </div>
  );
};
