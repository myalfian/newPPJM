import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  Sparkles
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-24 lg:pb-12 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Identity & Crest */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 to-gold-400 shadow-glow-gold flex-shrink-0">
                <img
                  src="/logo-ppjm.svg"
                  alt="PPJM Crest"
                  className="w-full h-full object-contain rounded-full bg-white"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white leading-tight">
                  PP JAUHARUL MAKNUUN
                </h3>
                <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                  Lasem - Sidayu - Gresik
                </p>
              </div>
            </div>
            <p className="text-sm text-emerald-200/80 leading-relaxed">
              Mendidik generasi Qur’ani yang kokoh dalam sanad keilmuan salaf (turats), 
              unggul dalam riset sains teknologi (STEM), serta berwawasan global dengan kemahiran bahasa internasional.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com/@ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                aria-label="YouTube PPJM"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                aria-label="Instagram PPJM"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/ppjauharulmaknuun"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                aria-label="Facebook PPJM"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Tautan JM Center & Program */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-800 pb-2">
              JM Center & Program
            </h4>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link to="/jm-center/sambutan" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <span>Sambutan Pengasuh</span>
                </Link>
              </li>
              <li>
                <Link to="/jm-center/sejarah" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <span>Sejarah Lasem Sidayu</span>
                </Link>
              </li>
              <li>
                <Link to="/jm-center/visi-misi" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <span>Visi & Misi Pesantren</span>
                </Link>
              </li>
              <li>
                <Link to="/program-unggulan/amaliyah-pondok" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <span>Amaliyah & Wirid Rutin</span>
                </Link>
              </li>
              <li>
                <Link to="/program-unggulan/program-madin" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <span>Madrasah Diniyah Salaf</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Modul Smart JM */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-800 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Smart JM Portal</span>
            </h4>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link to="/smart-jm/hafidz/read" className="hover:text-gold-400 transition-colors">
                  Mushaf Digital 30 Juz Online
                </Link>
              </li>
              <li>
                <Link to="/smart-jm/hafidz/murojaah" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <span>Murojaah AI Hafalan Quran</span>
                  <span className="text-[10px] bg-gold-500 text-emerald-950 font-bold px-1.5 py-0.5 rounded-full">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/smart-jm/stem/materi" className="hover:text-gold-400 transition-colors">
                  Laboratorium Sains & STEM
                </Link>
              </li>
              <li>
                <Link to="/smart-jm/mandarin/materi" className="hover:text-gold-400 transition-colors">
                  Mandarin Class & Audio Pinyin
                </Link>
              </li>
              <li>
                <Link to="/smart-jm/mandarin/quiz" className="hover:text-gold-400 transition-colors">
                  Kuis Interaktif Gamifikasi
                </Link>
              </li>
              <li>
                <Link to="/prestasi" className="hover:text-gold-400 transition-colors">
                  Galeri Prestasi Santri
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Lokasi Pesantren */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-800 pb-2">
              Lokasi & Kontak
            </h4>
            <div className="space-y-3 text-sm text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <p>
                  Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik, Jawa Timur 61153
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-gold-400">
                  +62 812-3456-7890 (Sekretariat)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="mailto:info@ppjauharulmaknuun.sch.id" className="hover:text-gold-400">
                  info@ppjauharulmaknuun.sch.id
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Lasem+Sidayu+Gresik"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4"
                >
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-4">
          <p>
            © {new Date().getFullYear()} Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik. Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center gap-1">
            <span>Dirancang dengan cinta & khidmah untuk pesantren</span>
            <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
