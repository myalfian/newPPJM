import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  X,
  Calendar,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [modalType, setModalType] = useState<'contact' | 'calendar' | 'privacy' | 'faq' | null>(null);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const openModal = (type: 'contact' | 'calendar' | 'privacy' | 'faq') => {
    setModalType(type);
    setShowContactModal(true);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP: DOCKED STICKY BOTTOM BAR (lg:fixed lg:bottom-0)                   */}
      {/* MOBILE / TABLET: IN-FLOW BOTTOM FOOTER (relative w-full lg:fixed)         */}
      {/* ========================================================================= */}
      <footer 
        id="kontak-ppdb" 
        className="relative w-full lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-40 bg-[#032110] text-emerald-100 selection:bg-[#d4af37] selection:text-black shadow-[0_-12px_40px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-in-out"
        style={{
          transform: isDesktopCollapsed ? 'translateY(calc(100% - 34px))' : 'translateY(0)'
        }}
      >
        
        {/* Curved Wave Top Divider with Minimize/Expand Toggle on Desktop */}
        <div className="relative w-full overflow-hidden leading-none">
          <svg
            className="w-full h-5 sm:h-7 lg:h-8 text-[#032110] fill-current block"
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
          >
            <path d="M0,40 C360,10 1080,8 1440,36 L1440,40 L0,40 Z" />
          </svg>

          {/* Desktop Minimize / Expand Toggle Button (Floating in Center-Top of Wave) */}
          <div className="hidden lg:flex absolute top-1 right-6 z-50 items-center">
            <button
              type="button"
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#093a1c] hover:bg-[#0f5228] text-[#e5a93b] hover:text-white border border-[#165a30] text-[11px] font-bold shadow-md transition-all cursor-pointer"
              title={isDesktopCollapsed ? 'Tampilkan Footer Lengkap' : 'Kecilkan Footer'}
            >
              <span>{isDesktopCollapsed ? 'Tampilkan Footer' : 'Sembunyikan'}</span>
              {isDesktopCollapsed ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#e5a93b]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#e5a93b]" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsed Bar Teaser for Desktop (Visible when minimized) */}
        {isDesktopCollapsed && (
          <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-xs text-emerald-200/80 bg-[#032110] border-t border-emerald-900/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#e5a93b]" />
              <span className="font-semibold text-white">Pondok Pesantren Jauharul Maknuun Lasem</span>
              <span className="text-emerald-700">•</span>
              <span className="text-gray-400">Sidayu Gresik, Jawa Timur</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <button onClick={() => openModal('contact')} className="hover:text-white text-[#e5a93b]">
                Kontak PPDB: 031-3949xxx
              </button>
              <span className="text-emerald-700">•</span>
              <button onClick={() => setIsDesktopCollapsed(false)} className="text-[#e5a93b] hover:underline flex items-center gap-1 font-bold">
                <span>Buka Panel Footer Lengkap</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Footer Container (4 Columns matching attached screenshot) */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 sm:pt-3 sm:pb-5 ${isDesktopCollapsed ? 'lg:invisible lg:opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            
            {/* ================= COLUMN 1: IDENTITY & CREST (lg:col-span-4) ================= */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-md border-2 border-[#d4af37] shrink-0 flex items-center justify-center">
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
                  <h3 className="font-extrabold text-[11px] sm:text-xs text-[#e5a93b] leading-tight tracking-wider uppercase">
                    PONDOK PESANTREN
                  </h3>
                  <h4 className="font-black text-xs sm:text-sm text-white tracking-tight uppercase">
                    JAUHARUL MAKNUUN LASEM
                  </h4>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-emerald-100/75 leading-relaxed pr-2">
                Lembaga pendidikan Islam terpadu yang memadukan keilmuan Kitab Kuning Salafiyah dengan kurikulum terpadu berakreditasi &quot;A&quot; BAN-PDM.
              </p>
            </div>

            {/* ================= COLUMN 2: TAUTAN CEPAT (lg:col-span-3) ================= */}
            <div className="lg:col-span-3 space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold text-[#e5a93b] uppercase tracking-wider">
                TAUTAN CEPAT (QUICK LINKS)
              </h4>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-emerald-100/80 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('contact')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">→</span>
                    <span>Hubungi Kami (Contact Us)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('calendar')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">→</span>
                    <span>Kalender Akademik (Academic Calendar)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('privacy')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">→</span>
                    <span>Kebijakan Privasi (Privacy Policy)</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">→</span>
                    <span>Beranda Utama</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('faq')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
                  >
                    <span className="text-[#e5a93b] group-hover:translate-x-0.5 transition-transform text-[11px]">→</span>
                    <span>Tanya Jawab (FAQ PPDB)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* ================= COLUMN 3: SOCIAL ICONS PILL (lg:col-span-2) ================= */}
            <div className="lg:col-span-2 flex flex-col justify-start lg:items-center space-y-2 pt-1 sm:pt-2">
              {/* Row 1 */}
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com/ppjauharulmaknuun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Facebook PPJM"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://instagram.com/ppjauharulmaknuun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Instagram PPJM"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com/@ppjauharulmaknuun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="YouTube PPJM"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com/ppjauharulmaknuun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Facebook PPJM Fanpage"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://instagram.com/ppjauharulmaknuun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Instagram Galeri Santri"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com/@ppjauharulmaknuun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#093a1c] hover:bg-[#0e5429] text-[#e5a93b] hover:text-white border border-[#165a30]/80 flex items-center justify-center transition-all shadow-xs"
                  aria-label="YouTube Live Streaming PPJM"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* ================= COLUMN 4: SEKRETARIAT & ASRAMA (lg:col-span-3) ================= */}
            <div className="lg:col-span-3 space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold text-[#e5a93b] uppercase tracking-wider">
                SEKRETARIAT & ASRAMA
              </h4>
              <div className="space-y-1.5 text-[11px] sm:text-xs text-emerald-100/80 font-normal">
                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e5a93b] shrink-0 mt-0.5" />
                  <p className="leading-tight">
                    Jl. Pesantren No. 01, Lasem, Sidayu, Gresik, Jawa Timur 61153
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#e5a93b] shrink-0" />
                  <a href="tel:0313949000" className="hover:text-white transition-colors">
                    031-3949xxx (Panitia PPDB)
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#e5a93b] shrink-0" />
                  <a href="mailto:sekretariat@ppjauharulmaknuun.sch.id" className="hover:text-white transition-colors truncate">
                    sekretariat@ppjauharulmaknuun.sch.id
                  </a>
                </div>

                {/* Link to Full Contact */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => openModal('contact')}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#e5a93b] hover:text-amber-300 font-bold hover:underline underline-offset-4 cursor-pointer"
                  >
                    <span>Buka Layanan Kontak Lengkap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ================= BOTTOM SUB-FOOTER BAR (Divider & Copyright) ================= */}
          <div className="mt-4 pt-2.5 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between text-[11px] text-emerald-200/65 gap-2">
            {/* Copyright with Shield */}
            <div className="flex items-center gap-1.5 text-center md:text-left">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5a93b] shrink-0" />
              <span>
                © 2026 Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik. All rights reserved.
              </span>
            </div>

            {/* Inline Sub-links matching screenshot */}
            <div className="flex items-center gap-2 text-center md:text-right flex-wrap justify-center">
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
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4 text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#093a1c] flex items-center justify-center font-bold">
                  {modalType === 'contact' && <Phone className="w-5 h-5 text-[#1a6b3c]" />}
                  {modalType === 'calendar' && <Calendar className="w-5 h-5 text-[#1a6b3c]" />}
                  {modalType === 'privacy' && <FileText className="w-5 h-5 text-[#1a6b3c]" />}
                  {modalType === 'faq' && <HelpCircle className="w-5 h-5 text-[#1a6b3c]" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    {modalType === 'contact' && 'Layanan Kontak & Sekretariat PPJM'}
                    {modalType === 'calendar' && 'Kalender Akademik & Agenda Pesantren'}
                    {modalType === 'privacy' && 'Kebijakan Privasi (Privacy Policy)'}
                    {modalType === 'faq' && 'Tanya Jawab (FAQ Seputar PPDB)'}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Contact */}
            {modalType === 'contact' && (
              <div className="space-y-3.5 text-sm">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Alamat Lengkap Sekretariat:
                  </span>
                  <p className="font-semibold text-gray-900 leading-relaxed text-xs sm:text-sm">
                    Jl. Pesantren No. 01, Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik, Jawa Timur 61153
                  </p>
                  <a
                    href="https://maps.google.com/?q=Lasem+Sidayu+Gresik"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#1a6b3c] hover:text-[#0d4a28] font-bold pt-1"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      WhatsApp Panitia PPDB:
                    </span>
                    <a 
                      href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Panitia%20PPDB%20PPJM" 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-mono font-bold text-xs sm:text-sm text-emerald-950 hover:underline block"
                    >
                      +62 812-3456-7890
                    </a>
                    <span className="text-[10px] text-emerald-700">Layanan Aktif 07.00 - 20.00 WIB</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      Email Resmi:
                    </span>
                    <a 
                      href="mailto:sekretariat@ppjauharulmaknuun.sch.id"
                      className="font-mono font-bold text-xs text-amber-950 hover:underline block truncate"
                    >
                      sekretariat@ppjauharulmaknuun.sch.id
                    </a>
                    <span className="text-[10px] text-amber-700">Administrasi & Surat Menyurat</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: Academic Calendar */}
            {modalType === 'calendar' && (
              <div className="space-y-3 text-xs sm:text-sm text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900">Tahun Ajaran 2025/2026:</h5>
                  <ul className="mt-2 space-y-1.5 list-disc list-inside text-xs text-emerald-800">
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
              <div className="space-y-2.5 text-xs text-gray-600 max-h-[60vh] overflow-y-auto pr-1">
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
              <div className="space-y-2.5 text-xs text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900">Q: Apa saja syarat pendaftaran santri baru?</p>
                  <p className="mt-1 text-gray-600">A: Mengisi formulir online, fotokopi KK/Akta, ijazah terakhir, dan lulus tes baca Al-Qur&apos;an dasar.</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900">Q: Apakah ada program beasiswa bagi penghafal Al-Qur&apos;an?</p>
                  <p className="mt-1 text-gray-600">A: Ya, tersedia beasiswa penuh khusus santri yang lolos seleksi Tahfidz 30 Juz dan berprestasi.</p>
                </div>
              </div>
            )}

            {/* Footer Modal */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#093a1c] hover:bg-[#072d15] text-white font-bold text-xs transition-colors cursor-pointer"
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
