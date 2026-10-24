import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  Sparkles,
  X,
  Info
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: STICKY SLEEK BOTTOM FOOTER (lg:fixed)   */}
      {/* ========================================================= */}
      <footer 
        id="kontak-ppdb"
        className="hidden lg:block fixed bottom-0 inset-x-0 z-40 bg-[#071f11]/95 backdrop-blur-md border-t-2 border-[#d4af37] shadow-[0_-8px_30px_rgba(0,0,0,0.45)] text-emerald-100 select-none"
      >
        <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between gap-4">
          
          {/* A. Identity & Crest */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 shadow-sm border border-[#d4af37] flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/logo.jpg"
                  alt="PPJM Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-[#ffcc00] tracking-tight group-hover:text-amber-300 transition-colors">
                    PP. JAUHARUL MAKNUUN
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-500/40">
                    Akreditasi A
                  </span>
                </div>
                <span className="text-[10px] text-gray-300/90 font-medium">
                  Lasem, Sidayu, Gresik · Jawa Timur
                </span>
              </div>
            </Link>
          </div>

          {/* B. Center: Simplified Quick Navigation Links */}
          <nav className="flex items-center gap-4 text-xs font-semibold text-emerald-200/90">
            <Link to="/" className="hover:text-[#ffcc00] transition-colors">
              Beranda
            </Link>
            <span className="text-emerald-800 text-[10px]">•</span>
            <Link to="/jm-center/sambutan" className="hover:text-[#ffcc00] transition-colors">
              Sambutan Pengasuh
            </Link>
            <span className="text-emerald-800 text-[10px]">•</span>
            <Link to="/smart-jm/hafidz/read" className="hover:text-[#ffcc00] transition-colors flex items-center gap-1">
              <span>Tahfidz 30 Juz</span>
              <Sparkles className="w-3 h-3 text-[#ffcc00]" />
            </Link>
            <span className="text-emerald-800 text-[10px]">•</span>
            <Link to="/smart-jm/stem/materi" className="hover:text-[#ffcc00] transition-colors">
              Inovasi STEM
            </Link>
            <span className="text-emerald-800 text-[10px]">•</span>
            <Link to="/prestasi" className="hover:text-[#ffcc00] transition-colors">
              Prestasi
            </Link>
          </nav>

          {/* C. Right: Social Channels & Direct Contact */}
          <div className="flex items-center gap-2.5">
            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-1.5 border-r border-emerald-800/80 pr-2.5">
              <a
                href="https://youtube.com/@ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-emerald-950/90 hover:bg-[#ffcc00] hover:text-[#0b3d21] text-emerald-300 flex items-center justify-center transition-colors"
                title="Kanal YouTube PPJM"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com/ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-emerald-950/90 hover:bg-[#ffcc00] hover:text-[#0b3d21] text-emerald-300 flex items-center justify-center transition-colors"
                title="Instagram Resmi @ppjauharulmaknuun"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com/ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-emerald-950/90 hover:bg-[#ffcc00] hover:text-[#0b3d21] text-emerald-300 flex items-center justify-center transition-colors"
                title="Halaman Facebook PPJM"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tombol Info Alamat & Peta */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 text-xs font-medium transition-colors cursor-pointer"
              title="Informasi Alamat & Lokasi Pesantren"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>Lokasi</span>
            </button>

            {/* Tombol WhatsApp PPDB / Sekretariat */}
            <a
              href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Admin%20PPJM,%20saya%20ingin%20informasi%20pendaftaran%20santri%20baru"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a6b3c] hover:bg-[#14532d] text-white text-xs font-bold shadow-xs transition-all border border-emerald-400/40 hover:scale-[1.02] active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Kontak PPDB</span>
            </a>
          </div>

        </div>
      </footer>

      {/* ========================================================= */}
      {/* 2. MOBILE & TABLET VIEW: CLEAN IN-FLOW FOOTER (lg:hidden) */}
      {/* ========================================================= */}
      <footer className="lg:hidden bg-[#0b3d21] text-emerald-100 pt-10 pb-24 border-t-4 border-[#d4af37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Header Mobile Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 shadow-md border-2 border-[#1a6b3c]/30 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="PPJM Crest"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                  }}
                />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#d4af37] leading-tight">
                  PONDOK PESANTREN
                </h3>
                <h4 className="font-black text-sm text-white tracking-tight">
                  JAUHARUL MAKNUUN LASEM
                </h4>
                <p className="text-[10px] text-gray-300 font-medium">
                  Sidayu Gresik - Jawa Timur
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Lembaga pendidikan Islam terpadu yang memadukan keilmuan Kitab Kuning Salafiyah, Tahfidz 30 Juz Bersanad, Kurikulum Terakreditasi &quot;A&quot; BAN-PDM, dan Inovasi STEM.
            </p>

            {/* Mobile Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://youtube.com/@ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-200 hover:text-white"
                aria-label="YouTube PPJM"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-200 hover:text-white"
                aria-label="Instagram PPJM"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-200 hover:text-white"
                aria-label="Facebook PPJM"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs text-emerald-200/90 pt-2 border-t border-emerald-900/80">
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider block">Program</span>
              <ul className="space-y-1.5">
                <li><Link to="/jm-center/sambutan" className="hover:text-gold-400">Sambutan Pengasuh</Link></li>
                <li><Link to="/smart-jm/hafidz/read" className="hover:text-gold-400">Mushaf 30 Juz</Link></li>
                <li><Link to="/program-unggulan/program-madin" className="hover:text-gold-400">Madrasah Diniyah</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider block">Informasi</span>
              <ul className="space-y-1.5">
                <li><Link to="/smart-jm/stem/materi" className="hover:text-gold-400">Inovasi STEM</Link></li>
                <li><Link to="/prestasi" className="hover:text-gold-400">Prestasi Santri</Link></li>
                <li><Link to="/galeri/foto" className="hover:text-gold-400">Galeri Foto</Link></li>
              </ul>
            </div>
          </div>

          {/* Lokasi Singkat Mobile */}
          <div className="pt-2 border-t border-emerald-900/80 text-xs text-gray-300 space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ffcc00] shrink-0" />
              <span>Desa Lasem, Kec. Sidayu, Kab. Gresik 61153</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#ffcc00] shrink-0" />
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-emerald-200 font-semibold underline">
                +62 812-3456-7890 (Sekretariat)
              </a>
            </div>
          </div>

          {/* Copyright Mobile */}
          <div className="pt-4 border-t border-emerald-900 text-[11px] text-center text-emerald-300/70">
            © {new Date().getFullYear()} PP. Jauharul Maknuun Lasem Sidayu Gresik.
          </div>

        </div>
      </footer>

      {/* ========================================================= */}
      {/* 3. MODAL INFORMASI LOKASI & KONTAK LENGKAP               */}
      {/* ========================================================= */}
      {showLocationModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-5 text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    Lokasi & Narahubung Resmi
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detail Kontak & Alamat */}
            <div className="space-y-3.5 text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Alamat Lengkap:
                </span>
                <p className="font-semibold text-gray-900 leading-relaxed">
                  Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik, Jawa Timur 61153
                </p>
                <a
                  href="https://maps.google.com/?q=Lasem+Sidayu+Gresik"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#1a6b3c] hover:text-[#0d4a28] font-bold pt-1"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    WhatsApp PPDB:
                  </span>
                  <a 
                    href="https://wa.me/6281234567890" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono font-bold text-sm text-emerald-950 hover:underline block"
                  >
                    +62 812-3456-7890
                  </a>
                  <span className="text-[10px] text-emerald-700">Layanan Sekretariat & PPDB</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    Email Resmi:
                  </span>
                  <a 
                    href="mailto:info@ppjauharulmaknuun.sch.id"
                    className="font-mono font-bold text-xs text-amber-950 hover:underline block truncate"
                  >
                    info@ppjauharulmaknuun.sch.id
                  </a>
                  <span className="text-[10px] text-amber-700">Administrasi Pesantren</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-gray-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Terakreditasi <strong>&quot;A&quot; BAN-PDM</strong> dengan kurikulum terpadu salaf & sains modern.</span>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#1a6b3c] hover:bg-[#0d4a28] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
