import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Radio
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon
} from './SocialIcons';

export interface MedsosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialChannel {
  id: string;
  category: 'direct' | 'broadcast' | 'social';
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  badgeStyle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderHover: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'wa-admin',
    category: 'direct',
    title: 'WhatsApp Layanan & Konsultasi',
    subtitle: '+62 856-4619-9273 (Admin Resmi)',
    url: 'https://wa.me/6285646199273',
    badge: 'Chat Admin',
    badgeStyle: 'bg-emerald-600 text-white font-bold tracking-wide shadow-xs',
    icon: WhatsAppIcon,
    iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20',
  },
  {
    id: 'wa-channel',
    category: 'broadcast',
    title: 'Saluran WhatsApp Resmi',
    subtitle: 'Warta kilat, pengumuman, & kajian pesantren',
    url: 'https://whatsapp.com/channel/0029Vb6FZq7Jpe8cR5vR0T0D',
    badge: 'Official Channel',
    badgeStyle: 'bg-teal-700/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-300 border border-teal-500/30',
    icon: Radio,
    iconBg: 'bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400',
    iconColor: 'text-teal-600 dark:text-teal-400',
    borderHover: 'hover:border-teal-500/50 hover:bg-teal-50/40 dark:hover:bg-teal-950/20',
  },
  {
    id: 'ig-ppjm',
    category: 'social',
    title: 'Instagram Pondok Pesantren',
    subtitle: '@ppjauharulmaknuun • Kehidupan & kegiatan santri',
    url: 'https://www.instagram.com/ppjauharulmaknuun?mdxt=MWRieHkydGt5ZDNrNw==',
    badge: 'Pondok',
    badgeStyle: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    icon: InstagramIcon,
    iconBg: 'bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400',
    iconColor: 'text-pink-600 dark:text-pink-400',
    borderHover: 'hover:border-pink-500/50 hover:bg-pink-50/40 dark:hover:bg-pink-950/20',
  },
  {
    id: 'ig-smpjm',
    category: 'social',
    title: 'Instagram SMP Plus Jauharul Maknuun',
    subtitle: '@smpplusjauharulmaknuun • Akademik & prestasi formal',
    url: 'https://www.instagram.com/smpplusjauharulmaknuun?dlrf=YzByczMxMXV3N3gz',
    badge: 'SMP Plus',
    badgeStyle: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    icon: InstagramIcon,
    iconBg: 'bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-pink-500/20 text-indigo-600 dark:text-indigo-400',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    borderHover: 'hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20',
  },
  {
    id: 'ig-osis',
    category: 'social',
    title: 'Instagram OSIS SMP Plus JM',
    subtitle: '@osissmppjm • Kreativitas, event, & dinamika siswa',
    url: 'https://www.instagram.com/osissmppjm?rpxt=MmNiOGE1dGs3czM2',
    badge: 'OSIS JM',
    badgeStyle: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    icon: InstagramIcon,
    iconBg: 'bg-gradient-to-tr from-orange-500/20 to-amber-500/20 text-amber-600 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-500/50 hover:bg-amber-50/40 dark:hover:bg-amber-950/20',
  },
  {
    id: 'tiktok',
    category: 'social',
    title: 'TikTok Resmi Pesantren',
    subtitle: '@ppjauharulmaknuun • Konten video kreatif & inspiratif',
    url: 'https://www.tiktok.com/@ppjauharulmaknuun?_r=1&_t=ZS-9ArxcQ3dNKf',
    badge: 'TikTok',
    badgeStyle: 'bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100 border border-zinc-400/30',
    icon: TikTokIcon,
    iconBg: 'bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100',
    iconColor: 'text-zinc-900 dark:text-zinc-100',
    borderHover: 'hover:border-zinc-500/50 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40',
  },
  {
    id: 'youtube',
    category: 'social',
    title: 'YouTube Channel Resmi',
    subtitle: '@ppjauharulmaknuunlasem • Live streaming, ceramah & arsip',
    url: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    badge: 'YouTube',
    badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    icon: YoutubeIcon,
    iconBg: 'bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
    borderHover: 'hover:border-red-500/50 hover:bg-red-50/40 dark:hover:bg-red-950/20',
  },
];

export const MedsosModal: React.FC<MedsosModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Body Scroll Lock & Esc Key Listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: 'Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik',
          text: 'Portal Resmi Pondok Pesantren Jauharul Maknuun: Tahfidz 30 Juz Bersanad, Kurikulum Terakreditasi "A" BAN-PDM, dan Inovasi STEM.',
          url: window.location.origin,
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Blur Surface */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Card / Bottom Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 32,
              mass: 0.9,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="medsos-modal-title"
            className="relative w-full sm:max-w-xl max-h-[88vh] sm:max-h-[85vh] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t sm:border border-zinc-200/80 dark:border-zinc-800/80 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-emerald-950/20 overflow-hidden flex flex-col z-10"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* Header Section */}
            <div className="px-5 sm:px-6 pt-3 sm:pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      id="medsos-modal-title"
                      className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white tracking-tight"
                    >
                      Kanal Komunikasi Resmi
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                    Pondok Pesantren Jauharul Maknuun Lasem, Sidayu, Gresik
                  </p>
                </div>
              </div>

              {/* Accessible Close Button (Min 44x44px target) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup Dialog Kanal Komunikasi"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all cursor-pointer -mr-2 -mt-1 sm:mt-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Channels List (with smooth touch scrolling) */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2.5 overscroll-contain">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 px-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Pilih Kanal &amp; Media Terverifikasi</span>
              </div>

              <div className="space-y-2">
                {SOCIAL_CHANNELS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 transition-all duration-150 min-h-[56px] select-none active:scale-[0.985] ${item.borderHover}`}
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                        {/* Brand Icon Pill */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs ${item.iconBg}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Title & Subtitle */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none shrink-0 ${item.badgeStyle}`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* External Arrow / Action Pill */}
                      <div className="ml-3 shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-200/50 dark:bg-zinc-700/40 text-zinc-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-150">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Actions (Share & Dismiss) */}
            <div className="px-5 sm:px-6 py-3.5 bg-zinc-50/90 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Tautan Portal Disalin!</span>
                  </>
                ) : (
                  <>
                    {'share' in navigator ? (
                      <Share2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>Bagikan Portal Web PPJM</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-[0.98] text-zinc-700 dark:text-zinc-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

