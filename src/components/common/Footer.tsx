import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  X,
  Calendar,
  FileText,
  HelpCircle,
  Share2
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, WhatsAppIcon, TikTokIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [modalType, setModalType] = useState<'contact' | 'calendar' | 'privacy' | 'faq' | null>(null);

  const openModal = (type: 'contact' | 'calendar' | 'privacy' | 'faq') => {
    setModalType(type);
    setShowContactModal(true);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* MODERN LUX MINIMALIST FOOTER (SIMPLE, CLEAN, RESPONSIVE ACROSS VIEWPORTS)  */}
      {/* ========================================================================= */}
      <footer
        id="kontak-ppdb"
        className="relative w-full mt-auto bg-gradient-to-b from-[#031d0e] via-[#02180b] to-[#011107] text-emerald-100/90 border-t border-emerald-900/60 shadow-[0_-4px_24px_rgba(0,0,0,0.25)] z-20 select-none overflow-hidden"
      >
        {/* Subtle accent hairline highlight */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

        {/* Main Footer Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-5">
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
            
            {/* 1. Brand & Identity (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-2.5">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-md border border-[#d4af37]/80 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
                  <img
                    src="/logo.jpg"
                    alt="PPJM Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-[10.5px] text-[#e5a93b] tracking-wider uppercase leading-none">
                    PONDOK PESANTREN
                  </h3>
                  <h4 className="font-black text-sm sm:text-base text-white tracking-tight uppercase leading-snug group-hover:text-emerald-200 transition-colors">
                    JAUHARUL MAKNUUN
                  </h4>
                  <span className="text-[10px] text-emerald-300/70 block leading-none font-medium">
                    Lasem, Sidayu, Gresik • Akreditasi A
                  </span>
                </div>
              </Link>

              <p className="text-xs text-emerald-200/75 leading-relaxed max-w-md">
                Lembaga pendidikan Islam terpadu yang memadukan kedalaman keilmuan Kitab Kuning Turats Salafiyah dengan kurikulum nasional berbasis sains &amp; teknologi.
              </p>

              {/* Social Media Pills in Brand Column for Cleaner Flow */}
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-emerald-300/80 mr-1 hidden xs:inline">
                  Ikuti Kami:
                </span>
                <a
                  href="https://wa.me/6285646199273"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-[#e5a93b] hover:text-white border border-emerald-800/60 flex items-center justify-center transition-all shadow-xs"
                  aria-label="WhatsApp Admin PPJM"
                  title="WhatsApp Admin"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/ppjauharulmaknuun?mdxt=MWRieHkydGt5ZDNrNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-[#e5a93b] hover:text-white border border-emerald-800/60 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Instagram PPJM"
                  title="Instagram Resmi"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.tiktok.com/@ppjauharulmaknuun?_r=1&_t=ZS-9ArxcQ3dNKf"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-[#e5a93b] hover:text-white border border-emerald-800/60 flex items-center justify-center transition-all shadow-xs"
                  aria-label="TikTok Resmi PPJM"
                  title="TikTok Resmi"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-[#e5a93b] hover:text-white border border-emerald-800/60 flex items-center justify-center transition-all shadow-xs"
                  aria-label="YouTube Channel PPJM"
                  title="YouTube Channel"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-medsos-modal'))}
                  className="h-7 px-2.5 rounded-lg bg-[#0e4823]/70 hover:bg-[#125c2d] text-[#e5a93b] hover:text-white border border-[#d4af37]/30 flex items-center justify-center text-[10.5px] font-bold transition-all shadow-xs cursor-pointer gap-1"
                  title="Lihat 7 Kanal Medsos Resmi"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Semua Kanal</span>
                </button>
              </div>
            </div>

            {/* 2. Tautan Cepat (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-2">
              <h4 className="text-xs font-bold text-[#e5a93b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Navigasi &amp; Tautan Cepat</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-100/85 font-medium">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">›</span>
                    <span>Beranda Utama</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/spmb"
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-emerald-200 font-bold group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">›</span>
                    <span>Pendaftaran Santri (SPMB)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/agenda"
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">›</span>
                    <span>Kalender Akademik &amp; Agenda</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('faq')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">›</span>
                    <span>Tanya Jawab (FAQ SPMB)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('privacy')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">›</span>
                    <span>Kebijakan Privasi</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. Kontak & Sekretariat (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-2">
              <h4 className="text-xs font-bold text-[#e5a93b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Sekretariat &amp; Layanan</span>
              </h4>
              <div className="space-y-2 text-xs text-emerald-100/85">
                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#e5a93b] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Jl. Pesantren No. 01, Desa Lasem, Kec. Sidayu, Kab. Gresik, Jawa Timur 61153
                  </p>
                </div>

                {/* WhatsApp Hotline */}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#e5a93b] shrink-0" />
                  <a
                    href="https://wa.me/6285646199273"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold"
                  >
                    <span>+62 856-4619-9273</span>
                    <span className="text-[10px] bg-emerald-800/90 text-emerald-200 px-1.5 py-0.5 rounded-md font-bold">
                      Admin Online
                    </span>
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#e5a93b] shrink-0" />
                  <a
                    href="mailto:sekretariat@ppjauharulmaknuun.sch.id"
                    className="hover:text-white transition-colors truncate font-medium"
                  >
                    sekretariat@ppjauharulmaknuun.sch.id
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ================= BOTTOM SUB-FOOTER BAR ================= */}
          <div className="mt-5 pt-3 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-300/70 gap-2">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5a93b] shrink-0" />
              <span>
                © {new Date().getFullYear()} PP. Jauharul Maknuun Lasem Sidayu Gresik. Hak Cipta Dilindungi.
              </span>
            </div>

            <div className="flex items-center gap-3 text-emerald-300/80 flex-wrap justify-center font-medium">
              <button
                type="button"
                onClick={() => openModal('contact')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Hubungi Kami
              </button>
              <span className="text-emerald-800">•</span>
              <button
                type="button"
                onClick={() => openModal('calendar')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Kalender Akademik
              </button>
              <span className="text-emerald-800">•</span>
              <button
                type="button"
                onClick={() => openModal('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privasi
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= INTERACTIVE POPUP MODALS ================= */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 space-y-3.5 text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#093a1c] flex items-center justify-center font-bold">
                  {modalType === 'contact' && <Phone className="w-4 h-4 text-[#1a6b3c]" />}
                  {modalType === 'calendar' && <Calendar className="w-4 h-4 text-[#1a6b3c]" />}
                  {modalType === 'privacy' && <FileText className="w-4 h-4 text-[#1a6b3c]" />}
                  {modalType === 'faq' && <HelpCircle className="w-4 h-4 text-[#1a6b3c]" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 leading-tight">
                    {modalType === 'contact' && 'Layanan Kontak & Sekretariat PPJM'}
                    {modalType === 'calendar' && 'Kalender Akademik & Agenda Pesantren'}
                    {modalType === 'privacy' && 'Kebijakan Privasi (Privacy Policy)'}
                    {modalType === 'faq' && 'Tanya Jawab (FAQ Seputar PPDB/SPMB)'}
                  </h3>
                  <p className="text-[10.5px] text-gray-500 font-medium">
                    Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Contact */}
            {modalType === 'contact' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Alamat Lengkap Sekretariat:
                  </span>
                  <p className="font-semibold text-gray-900 leading-relaxed text-xs">
                    Jl. Pesantren No. 01, Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik, Jawa Timur 61153
                  </p>
                  <a
                    href="https://maps.google.com/?q=Lasem+Sidayu+Gresik"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#1a6b3c] hover:text-[#0d4a28] font-bold pt-0.5"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      WhatsApp Panitia SPMB:
                    </span>
                    <a
                      href="https://wa.me/6285646199273?text=Assalamu'alaikum%20Panitia%20SPMB%20PPJM"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-bold text-xs text-emerald-950 hover:underline block"
                    >
                      +62 856-4619-9273
                    </a>
                    <span className="text-[9.5px] text-emerald-700">Layanan Aktif 07.30 - 20.00 WIB</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Email Resmi:
                    </span>
                    <a
                      href="mailto:sekretariat@ppjauharulmaknuun.sch.id"
                      className="font-mono font-bold text-xs text-amber-950 hover:underline block truncate"
                    >
                      sekretariat@ppjauharulmaknuun.sch.id
                    </a>
                    <span className="text-[9.5px] text-amber-700">Administrasi &amp; Surat</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: Academic Calendar */}
            {modalType === 'calendar' && (
              <div className="space-y-2.5 text-xs text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900 text-xs">Agenda &amp; Tahun Pelajaran Berjalan:</h5>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-[11px] text-emerald-800">
                    <li>Pendaftaran Santri Baru (Gelombang I): 01 Januari - 31 Maret</li>
                    <li>Tes Seleksi Baca Kitab &amp; Al-Qur&apos;an: Pertengahan April</li>
                    <li>Haflah Khotmil Qur&apos;an 30 Juz &amp; Imtihan: Bulan Juni</li>
                    <li>Masa Ta&apos;aruf &amp; Masuk Asrama Santri: Bulan Juli</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal Body: Privacy Policy */}
            {modalType === 'privacy' && (
              <div className="space-y-2 text-xs text-gray-600 max-h-[60vh] overflow-y-auto pr-1">
                <p>
                  Pondok Pesantren Jauharul Maknuun berkomitmen menjaga kerahasiaan data pribadi calon santri, wali santri, dan pengunjung website resmi sesuai ketentuan perundang-undangan.
                </p>
                <p>
                  Data formulir pendaftaran SPMB hanya digunakan untuk keperluan verifikasi akademik, administrasi asrama, dan arsip resmi pesantren tanpa diperjualbelikan kepada pihak ketiga.
                </p>
              </div>
            )}

            {/* Modal Body: FAQ SPMB */}
            {modalType === 'faq' && (
              <div className="space-y-2 text-xs text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900">Q: Apa itu SPMB?</p>
                  <p className="mt-0.5 text-gray-600">A: SPMB adalah Sistem Penerimaan Murid Baru resmi Pondok Pesantren Jauharul Maknuun dan SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900">Q: Apa saja syarat pendaftaran santri baru?</p>
                  <p className="mt-0.5 text-gray-600">A: Mengisi formulir online, fotokopi KK/Akta, ijazah/rapor terakhir, dan lulus tes baca Al-Qur&apos;an dasar.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900">Q: Apakah ada program beasiswa bagi penghafal Al-Qur&apos;an?</p>
                  <p className="mt-0.5 text-gray-600">A: Ya, tersedia beasiswa penuh khusus santri yang lolos seleksi Tahfidz 30 Juz dan berprestasi.</p>
                </div>
              </div>
            )}

            {/* Footer Modal */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#093a1c] hover:bg-[#072d15] text-white font-bold text-xs transition-colors cursor-pointer"
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
