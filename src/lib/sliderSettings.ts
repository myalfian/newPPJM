import { HeroSlide, initialHeroSlides } from '../data/heroSlides';
import { supabase, isSupabaseConfigured } from './supabase';

export interface SliderSettings {
  autoplayInterval: number; // in seconds (e.g., 2 to 20)
  transitionSpeed: number;  // in milliseconds (e.g., 200 to 1500)
  isAutoplayEnabled: boolean;
}

export const DEFAULT_SLIDER_SETTINGS: SliderSettings = {
  autoplayInterval: 5.5,
  transitionSpeed: 600,
  isAutoplayEnabled: true,
};

const STORAGE_KEY = 'ppjm_slider_settings';
const SLIDES_STORAGE_KEY = 'ppjm_hero_slides';
const SUPABASE_SLIDES_KEY = 'hero_slides';
const SUPABASE_SETTINGS_KEY = 'slider_settings';

export const getSliderSettings = (): SliderSettings => {
  if (typeof window === 'undefined') return DEFAULT_SLIDER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SLIDER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      autoplayInterval: typeof parsed.autoplayInterval === 'number' && parsed.autoplayInterval > 0 
        ? parsed.autoplayInterval 
        : DEFAULT_SLIDER_SETTINGS.autoplayInterval,
      transitionSpeed: typeof parsed.transitionSpeed === 'number' && parsed.transitionSpeed >= 150 
        ? parsed.transitionSpeed 
        : DEFAULT_SLIDER_SETTINGS.transitionSpeed,
      isAutoplayEnabled: typeof parsed.isAutoplayEnabled === 'boolean' 
        ? parsed.isAutoplayEnabled 
        : DEFAULT_SLIDER_SETTINGS.isAutoplayEnabled,
    };
  } catch (e) {
    console.warn('Gagal membaca pengaturan slider:', e);
    return DEFAULT_SLIDER_SETTINGS;
  }
};

export const saveSliderSettings = (settings: SliderSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Dispatch custom event agar HeroSlider di halaman beranda langsung update tanpa refresh
    window.dispatchEvent(new CustomEvent('ppjm-slider-settings-changed', { detail: settings }));
  } catch (e) {
    console.error('Gagal menyimpan pengaturan slider:', e);
  }

  if (isSupabaseConfigured()) {
    supabase
      .from('site_settings')
      .upsert(
        {
          key: SUPABASE_SETTINGS_KEY,
          value: settings as unknown as Record<string, unknown>,
          description: 'Pengaturan kecepatan & autoplay HeroSlider beranda PPJM',
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: 'key' }
      )
      .then(({ error }) => {
        if (error) {
          console.warn('Info sinkronisasi pengaturan slider ke Supabase:', error.message);
        }
      });
  }
};

/**
 * Validasi array HeroSlide agar aman dirender
 */
const sanitizeHeroSlides = (data: unknown): HeroSlide[] | null => {
  if (!Array.isArray(data) || data.length === 0) return null;
  const validSlides = data
    .filter((item): item is Record<string, any> => Boolean(item && typeof item === 'object' && item.image && item.badge))
    .map((item, idx) => ({
      id: typeof item.id === 'string' && item.id.trim() ? item.id : `slide-${Date.now()}-${idx}`,
      badge: String(item.badge).trim(),
      title: typeof item.title === 'string' ? item.title.trim() : '',
      desc: typeof item.desc === 'string' ? item.desc.trim() : '',
      image: String(item.image).trim(),
      fallbackImage: typeof item.fallbackImage === 'string' ? item.fallbackImage : undefined,
      btnText: typeof item.btnText === 'string' && item.btnText.trim() ? item.btnText.trim() : 'Lihat Selengkapnya',
      link: typeof item.link === 'string' ? item.link.trim() : '',
      tag: typeof item.tag === 'string' ? item.tag.trim() : undefined,
      tagline: typeof item.tagline === 'string' ? item.tagline.trim() : undefined,
      website: typeof item.website === 'string' ? item.website : 'https://ppjauharulmaknuun.sch.id/',
      cardTheme: typeof item.cardTheme === 'string' ? item.cardTheme : 'from-[#052817] via-[#094226] to-[#041c10]',
      badgeTheme: typeof item.badgeTheme === 'string' ? item.badgeTheme : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
      tagColor: typeof item.tagColor === 'string' ? item.tagColor : 'text-[#d4af37]',
      btnTheme: typeof item.btnTheme === 'string' ? item.btnTheme : 'from-[#0a6847] via-[#0f5132] to-[#10b981]',
    }));
  return validSlides.length > 0 ? validSlides : null;
};

/**
 * Ambil daftar slide dari LocalStorage cache atau fallback ke initialHeroSlides
 */
export const getHeroSlides = (): HeroSlide[] => {
  if (typeof window === 'undefined') return initialHeroSlides;
  try {
    const raw = localStorage.getItem(SLIDES_STORAGE_KEY);
    if (!raw) return initialHeroSlides;
    const parsed = JSON.parse(raw);
    return sanitizeHeroSlides(parsed) || initialHeroSlides;
  } catch (e) {
    console.warn('Gagal membaca konten hero slides dari localStorage:', e);
    return initialHeroSlides;
  }
};

/**
 * Tarik daftar slide terbaru dari Supabase site_settings (jika terkonfigurasi),
 * lalu perbarui cache LocalStorage & beritahu komponen HeroSlider.
 */
export const fetchHeroSlidesFromSupabase = async (): Promise<HeroSlide[]> => {
  if (!isSupabaseConfigured()) {
    return getHeroSlides();
  }
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SUPABASE_SLIDES_KEY)
      .maybeSingle();

    if (error || !data) {
      return getHeroSlides();
    }

    const rawValue = (data as { value?: unknown }).value;
    const remoteSlides = sanitizeHeroSlides(rawValue);
    if (remoteSlides) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(remoteSlides));
        window.dispatchEvent(new CustomEvent('ppjm-hero-slides-changed', { detail: remoteSlides }));
      }
      return remoteSlides;
    }
  } catch (e) {
    console.warn('Gagal mengambil hero_slides dari Supabase:', e);
  }
  return getHeroSlides();
};

/**
 * Simpan daftar slide ke LocalStorage dan sinkronkan ke tabel site_settings di Supabase
 */
export const saveHeroSlides = async (slides: HeroSlide[]): Promise<{ syncedToCloud: boolean }> => {
  const sanitized = sanitizeHeroSlides(slides) || initialHeroSlides;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(sanitized));
      window.dispatchEvent(new CustomEvent('ppjm-hero-slides-changed', { detail: sanitized }));
    } catch (e) {
      console.error('Gagal menyimpan hero slides ke localStorage:', e);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: SUPABASE_SLIDES_KEY,
            value: sanitized as unknown as Record<string, unknown>,
            description: 'Konten daftar kartu HeroSlider utama beranda PPJM',
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: 'key' }
        );
      if (!error) {
        return { syncedToCloud: true };
      }
      console.warn('Info simpan hero_slides ke Supabase:', error.message);
    } catch (e) {
      console.warn('Gagal sinkronisasi hero_slides ke Supabase:', e);
    }
  }

  return { syncedToCloud: false };
};

/**
 * Kembalikan daftar slide ke 5 Slide Standar PPJM (initialHeroSlides)
 */
export const resetHeroSlidesToDefault = async (): Promise<HeroSlide[]> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SLIDES_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('ppjm-hero-slides-changed', { detail: initialHeroSlides }));
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: SUPABASE_SLIDES_KEY,
            value: initialHeroSlides as unknown as Record<string, unknown>,
            description: 'Konten daftar kartu HeroSlider utama beranda PPJM',
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: 'key' }
        );
    } catch (e) {
      console.warn('Gagal mereset hero_slides di Supabase:', e);
    }
  }

  return initialHeroSlides;
};
