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
  HelpCircle
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon, WhatsAppIcon, TikTokIcon } from './SocialIcons';

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
      {/* DESKTOP & MOBILE: IN-FLOW NATURAL FOOTER (FULL CONTENT VISIBILITY)        */}
      {/* WITH DEDICATED SAFE PADDING FOR MOBILE BOTTOM NAV                         */}
      {/* ========================================================================= */}
      <footer
        id="kontak-ppdb"
        className="relative w-full mt-auto bg-[#032110] text-emerald-100 selection:bg-[#d4af37] selection:text-black shadow-[0_-8px_30px_rgba(0,0,0,0.35)] border-t border-[#d4af37]/30 z-20"
      >
        {/* Subtle Wave Top Divider (Ultra-slim) */}
        <div className="w-full overflow-hidden leading-none h-2 sm:h-3">
          <svg
            className="w-full h-full text-[#032110] fill-current block"
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
          >
            <path d="M0,24 C360,6 1080,4 1440,20 L1440,24 L0,24 Z" />
          </svg>
        </div>

        {/* Main Footer Container with Slim Padding & Mobile Bottom Nav Safe Clearance */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pt-4 md:pb-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 lg:gap-5 items-start">

            {/* ================= COLUMN 1: IDENTITY & CREST (lg:col-span-4) ================= */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 shadow-sm border border-[#d4af37] shrink-0 flex items-center justify-center">
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
                  <h3 className="font-extrabold text-xs text-[#e5a93b] leading-none tracking-wider uppercase">
                    PONDOK PESANTREN
                  </h3>
                  <h4 className="font-black text-sm sm:text-base text-white tracking-tight uppercase leading-snug">
                    JAUHARUL MAKNUUN LASEM
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/85 leading-normal pr-2">
                Lembaga pendidikan Islam terpadu yang memadukan keilmuan Kitab Kuning Salafiyah dengan kurikulum terpadu berakreditasi &quot;A&quot; BAN-PDM.
              </p>
            </div>

            {/* ================= COLUMN 2: TAUTAN CEPAT (lg:col-span-3) ================= */}
            <div className="lg:col-span-3 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#e5a93b] uppercase tracking-wider">
                TAUTAN CEPAT (QUICK LINKS)
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-100/90 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('privacy')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                    <span>Kebijakan Privasi (Privacy Policy)</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                    <span>Beranda Utama</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('faq')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                    <span>Tanya Jawab (FAQ PPDB)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* ================= COLUMN 3: SOCIAL ICONS PILL (lg:col-span-2) ================= */}
            <div className="lg:col-span-2 flex flex-col justify-start lg:items-center space-y-2 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#e5a93b] uppercase tracking-wider text-left lg:text-center w-full">
                MEDIA SOSIAL
              </h4>
              {/* Row 1: WhatsApp, Instagram, TikTok */}
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/6285646199273"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="WhatsApp Admin PPJM"
                  title="WhatsApp Admin"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/ppjauharulmaknuun?mdxt=MWRieHkydGt5ZDNrNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Instagram PPJM"
                  title="Instagram Resmi"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.tiktok.com/@ppjauharulmaknuun?_r=1&_t=ZS-9ArxcQ3dNKf"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="TikTok Resmi PPJM"
                  title="TikTok Resmi"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Row 2: YouTube, WhatsApp Channel, All Channels Trigger */}
              <div className="flex items-center gap-2">
                <a
                  href="https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="YouTube Channel PPJM"
                  title="YouTube Channel"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Vb6FZq7Jpe8cR5vR0T0D"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Saluran WhatsApp Resmi"
                  title="Saluran WhatsApp Resmi"
                >
                  <span className="text-xs font-bold text-[#e5a93b]">WA</span>
                </a>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-medsos-modal'))}
                  className="px-2 h-8 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-[#e5a93b] hover:text-white border border-[#d4af37]/40 flex items-center justify-center text-[11px] font-bold transition-all shadow-xs cursor-pointer gap-1"
                  title="Lihat 7 Kanal Komunikasi Resmi"
                >
                  <span>Medsos</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ================= COLUMN 4: SEKRETARIAT & ASRAMA (lg:col-span-3) ================= */}
            <div className="lg:col-span-3 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#e5a93b] uppercase tracking-wider">
                SEKRETARIAT & ASRAMA
              </h4>
              <div className="space-y-1.5 text-xs sm:text-sm text-emerald-100/90 font-medium">
                {/* Location */}
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e5a93b] shrink-0 mt-0.5" />
                  <p className="leading-tight truncate">
                    Jl. Pesantren No. 01, Lasem, Sidayu, Gresik 61153
                  </p>
                </div>

                {/* WhatsApp Admin Hotline */}
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#e5a93b] shrink-0" />
                  <a
                    href="https://wa.me/6285646199273"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>+62 856-4619-9273</span>
                    <span className="text-[10px] bg-emerald-700/80 text-emerald-200 px-1.5 py-0.2 rounded font-bold">Chat Admin</span>
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#e5a93b] shrink-0" />
                  <a href="mailto:sekretariat@ppjauharulmaknuun.sch.id" className="hover:text-white transition-colors truncate">
                    sekretariat@ppjauharulmaknuun.sch.id
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ================= BOTTOM SUB-FOOTER BAR (Divider & Copyright) ================= */}
          <div className="mt-3 pt-2 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm text-emerald-200/80 gap-2">
            {/* Copyright with Shield */}
            <div className="flex items-center gap-1.5 text-center md:text-left">
              <ShieldCheck className="w-4 h-4 text-[#e5a93b] shrink-0" />
              <span>
                © 2026 Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik. All rights reserved.
              </span>
            </div>

            {/* Inline Sub-links matching screenshot */}
            <div className="flex items-center gap-2.5 text-center md:text-right flex-wrap justify-center">
              <button
                type="button"
                onClick={() => openModal('contact')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Hubungi Kami (Contact Us)
              </button>
              <span className="text-emerald-800">•</span>
              <button
                type="button"
                onClick={() => openModal('calendar')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Kalender Akademik (Academic Calendar)
              </button>
              <span className="text-emerald-800">•</span>
              <button
                type="button"
                onClick={() => openModal('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Kebijakan Privasi (Privacy Policy)
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
            className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 space-y-3.5 text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#093a1c] flex items-center justify-center font-bold">
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
                    {modalType === 'faq' && 'Tanya Jawab (FAQ Seputar PPDB)'}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Contact */}
            {modalType === 'contact' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
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
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      WhatsApp Panitia PPDB:
                    </span>
                    <a
                      href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Panitia%20PPDB%20PPJM"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-bold text-xs text-emerald-950 hover:underline block"
                    >
                      +62 812-3456-7890
                    </a>
                    <span className="text-[9px] text-emerald-700">Layanan Aktif 07.00 - 20.00 WIB</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Email Resmi:
                    </span>
                    <a
                      href="mailto:sekretariat@ppjauharulmaknuun.sch.id"
                      className="font-mono font-bold text-xs text-amber-950 hover:underline block truncate"
                    >
                      sekretariat@ppjauharulmaknuun.sch.id
                    </a>
                    <span className="text-[9px] text-amber-700">Administrasi & Surat</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: Academic Calendar */}
            {modalType === 'calendar' && (
              <div className="space-y-2.5 text-xs text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900 text-xs">Tahun Ajaran 2025/2026:</h5>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-[11px] text-emerald-800">
                    <li>Pendaftaran Santri Baru (Gelombang I): 01 Januari - 31 Maret 2025</li>
                    <li>Tes Seleksi Baca Kitab & Al-Qur&apos;an: 12 April 2025</li>
                    <li>Haflah Khotmil Qur&apos;an 30 Juz: 20 Juni 2025</li>
                    <li>Masuk Asrama & Masa Orientasi Ta&apos;aruf: 15 Juli 2025</li>
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
                  Data formulir pendaftaran PPDB hanya digunakan untuk keperluan verifikasi akademik, administrasi asrama, dan arsip resmi pesantren tanpa diperjualbelikan kepada pihak ketiga.
                </p>
              </div>
            )}

            {/* Modal Body: FAQ PPDB */}
            {modalType === 'faq' && (
              <div className="space-y-2 text-xs text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900">Q: Apa saja syarat pendaftaran santri baru?</p>
                  <p className="mt-0.5 text-gray-600">A: Mengisi formulir online, fotokopi KK/Akta, ijazah terakhir, dan lulus tes baca Al-Qur&apos;an dasar.</p>
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
                className="px-4 py-2 rounded-xl bg-[#093a1c] hover:bg-[#072d15] text-white font-bold text-xs transition-colors cursor-pointer"
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
