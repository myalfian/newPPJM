import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Cpu,
  Globe,
  Image as ImageIcon,
  Share2,
  PlusCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Gauge
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const activeRole = localStorage.getItem('ppjm_admin_role') || 'super_admin';

  return (
    <div className="space-y-8">
      {/* Welcome Banner (Google Workspace Style) */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Pengurus Ramah Gaptek</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan di Ruang Pengurus PPJM
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Sistem dirancang sesederhana mungkin agar pengurus pesantren dapat memperbarui warta, mengunggah foto, dan membagikan pengumuman ke WhatsApp wali santri tanpa keahlian IT rumit.
          </p>
        </div>
      </div>

      {/* Quick Action Tiles (Ikon Besar & Jelas) */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Aksi Cepat Pengurus:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/berita"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-m3-2 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors">
                Tulis Berita / Warta
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tulis kabar pondok & langsung buat link pesan WhatsApp untuk wali santri.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-800">
              <PlusCircle className="w-4 h-4" />
              <span>Buka Formulir Berita</span>
            </div>
          </Link>

          <Link
            to="/admin/galeri"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-m3-2 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-emerald-950 transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors">
                Tambah Agenda Foto Kegiatan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload foto santri; foto otomatis dikompres menjadi ringan & tajam (WebP).
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-800">
              <PlusCircle className="w-4 h-4" />
              <span>Buka Formulir Galeri</span>
            </div>
          </Link>

          <Link
            to="/admin/stem"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-m3-2 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors">
                Kelola Modul STEM & Robotika
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Unggah panduan silabus dan cek kiriman tugas sains dari para santri.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-800">
              <PlusCircle className="w-4 h-4" />
              <span>Buka Modul STEM</span>
            </div>
          </Link>

          <Link
            to="/admin/slider"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-m3-2 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors">
                Kelola Speed Slider Beranda
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Atur durasi per detik (interval) dan kehalusan animasi geser coverflow 3D.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-800">
              <PlusCircle className="w-4 h-4" />
              <span>Atur Kecepatan Banner</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Panduan Ramah Gaptek */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <span>Petunjuk Praktis Pengurus Pondok:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
            <div className="font-bold text-emerald-950">1. Foto Otomatis Diperkecil</div>
            <p>Bapak/Ibu pengurus tidak perlu pusing memikirkan ukuran foto. Cukup seret foto dari galeri HP atau laptop, sistem akan otomatis mengubahnya menjadi format WebP berukuran ringan.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
            <div className="font-bold text-emerald-950">2. Sebar Pengumuman ke WhatsApp</div>
            <p>Setelah mengetik warta atau berita acara, klik tombol "Kirim ke WhatsApp". Tautan pesan rapi berformat tebal langsung terbuka di aplikasi WhatsApp untuk diteruskan ke grup wali santri.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
