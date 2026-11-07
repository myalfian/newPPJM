import { HeroSlide, initialHeroSlides } from '../data/heroSlides';
import { supabase, isSupabaseConfigured } from './supabase';
import { useEffect, useState } from 'react';

export type TransitionEffect = 'slide' | 'fade' | 'zoom';

export interface SliderSettings {
  autoplayInterval: number; // in seconds (2 to 20)
  transitionSpeed: number;  // in milliseconds (150 to 2000)
  transitionEffect: TransitionEffect;
  isAutoplayEnabled: boolean;
  pauseOnHover: boolean;
}

export const DEFAULT_SLIDER_SETTINGS: SliderSettings = {
  autoplayInterval: 5.0,
  transitionSpeed: 500,
  transitionEffect: 'slide',
  isAutoplayEnabled: true,
  pauseOnHover: true,
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
    const validEffect: TransitionEffect =
      parsed.transitionEffect === 'fade' || parsed.transitionEffect === 'zoom'
        ? parsed.transitionEffect
        : 'slide';

    return {
      autoplayInterval: typeof parsed.autoplayInterval === 'number' && parsed.autoplayInterval >= 2 && parsed.autoplayInterval <= 20
        ? parsed.autoplayInterval 
        : DEFAULT_SLIDER_SETTINGS.autoplayInterval,
      transitionSpeed: typeof parsed.transitionSpeed === 'number' && parsed.transitionSpeed >= 150 && parsed.transitionSpeed <= 2000
        ? parsed.transitionSpeed 
        : DEFAULT_SLIDER_SETTINGS.transitionSpeed,
      transitionEffect: validEffect,
      isAutoplayEnabled: typeof parsed.isAutoplayEnabled === 'boolean' 
        ? parsed.isAutoplayEnabled 
        : DEFAULT_SLIDER_SETTINGS.isAutoplayEnabled,
      pauseOnHover: typeof parsed.pauseOnHover === 'boolean'
        ? parsed.pauseOnHover
        : DEFAULT_SLIDER_SETTINGS.pauseOnHover,
    };
  } catch (e) {
    console.warn('Gagal membaca pengaturan slider:', e);
    return DEFAULT_SLIDER_SETTINGS;
  }
};

export const fetchSliderSettingsFromSupabase = async (): Promise<SliderSettings> => {
  if (!isSupabaseConfigured()) return getSliderSettings();
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SUPABASE_SETTINGS_KEY)
      .maybeSingle();

    if (!error && data && data.value && typeof data.value === 'object') {
      const parsed = data.value as any;
      const validEffect: TransitionEffect =
        parsed.transitionEffect === 'fade' || parsed.transitionEffect === 'zoom'
          ? parsed.transitionEffect
          : 'slide';

      const validated: SliderSettings = {
        autoplayInterval: typeof parsed.autoplayInterval === 'number' && parsed.autoplayInterval >= 2 && parsed.autoplayInterval <= 20
          ? parsed.autoplayInterval
          : DEFAULT_SLIDER_SETTINGS.autoplayInterval,
        transitionSpeed: typeof parsed.transitionSpeed === 'number' && parsed.transitionSpeed >= 150 && parsed.transitionSpeed <= 2000
          ? parsed.transitionSpeed
          : DEFAULT_SLIDER_SETTINGS.transitionSpeed,
        transitionEffect: validEffect,
        isAutoplayEnabled: typeof parsed.isAutoplayEnabled === 'boolean'
          ? parsed.isAutoplayEnabled
          : DEFAULT_SLIDER_SETTINGS.isAutoplayEnabled,
        pauseOnHover: typeof parsed.pauseOnHover === 'boolean'
          ? parsed.pauseOnHover
          : DEFAULT_SLIDER_SETTINGS.pauseOnHover,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
        window.dispatchEvent(new CustomEvent('ppjm-slider-settings-changed', { detail: validated }));
      }
      return validated;
    }
  } catch (err) {
    console.warn('Gagal sinkronisasi slider_settings dari Supabase:', err);
  }
  return getSliderSettings();
};

export const saveSliderSettings = async (settings: SliderSettings): Promise<{ ok: boolean; error?: string }> => {
  if (typeof window === 'undefined') return { ok: true };

  // Strict range validations
  const clamped: SliderSettings = {
    autoplayInterval: Math.max(2, Math.min(20, Number(settings.autoplayInterval) || 5.0)),
    transitionSpeed: Math.max(150, Math.min(2000, Number(settings.transitionSpeed) || 500)),
    transitionEffect: settings.transitionEffect === 'fade' || settings.transitionEffect === 'zoom' ? settings.transitionEffect : 'slide',
    isAutoplayEnabled: Boolean(settings.isAutoplayEnabled),
    pauseOnHover: Boolean(settings.pauseOnHover),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clamped));
    window.dispatchEvent(new CustomEvent('ppjm-slider-settings-changed', { detail: clamped }));
  } catch (e) {
    console.error('Gagal menyimpan pengaturan slider ke localStorage:', e);
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: SUPABASE_SETTINGS_KEY,
            value: clamped as unknown as Record<string, unknown>,
            description: 'Pengaturan kecepatan, durasi transisi, dan autoplay slider global website PPJM',
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: 'key' }
        );

      if (error) {
        return { ok: false, error: error.message };
      }
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Gagal menyimpan ke database' };
    }
  }

  return { ok: true };
};

/**
 * React Hook untuk membaca pengaturan slider global yang reaktif di seluruh komponen.
 */
export const useSliderSettings = (): SliderSettings => {
  const [settings, setSettings] = useState<SliderSettings>(getSliderSettings);

  useEffect(() => {
    // Initial fetch from remote
    fetchSliderSettingsFromSupabase().then((latest) => {
      setSettings(latest);
    });

    const handler = (e: Event) => {
      const customDetail = (e as CustomEvent<SliderSettings>).detail;
      if (customDetail) {
        setSettings(customDetail);
      }
    };

    window.addEventListener('ppjm-slider-settings-changed', handler);
    return () => window.removeEventListener('ppjm-slider-settings-changed', handler);
  }, []);

  return settings;
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
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SLIDES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return sanitizeHeroSlides(parsed) || [];
  } catch (e) {
    console.warn('Gagal membaca konten hero slides dari localStorage:', e);
    return [];
  }
};

/**
 * Tarik daftar slide terbaru dari Supabase site_settings (jika terkonfigurasi),
 * lalu perbarui cache LocalStorage & beritahu komponen HeroSlider.
 */
export const fetchHeroSlidesFromSupabase = async (): Promise<HeroSlide[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    // 1. Coba baca dari tabel utama 'sliders'
    const { data: tableSliders, error: tableErr } = await supabase
      .from('sliders')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (!tableErr && tableSliders && tableSliders.length > 0) {
      const mappedFromTable: HeroSlide[] = tableSliders.map((s) => ({
        id: s.id,
        badge: s.badge_tag || 'Unggulan',
        title: s.title || '',
        desc: s.description || '',
        image: s.image_url || '',
        btnText: s.cta_text || 'Lihat Selengkapnya',
        link: s.cta_link || '/program',
        website: 'https://ppjauharulmaknuun.sch.id/',
      }));

      const sanitized = sanitizeHeroSlides(mappedFromTable);
      if (sanitized) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(sanitized));
          window.dispatchEvent(new CustomEvent('ppjm-hero-slides-changed', { detail: sanitized }));
        }
        return sanitized;
      }
    }

    // 2. Fallback baca dari site_settings
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SUPABASE_SLIDES_KEY)
      .maybeSingle();

    if (error || !data) {
      return [];
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
  return [];
};

/**
 * Simpan daftar slide ke LocalStorage dan sinkronkan ke tabel site_settings di Supabase
 */
export const saveHeroSlides = async (slides: HeroSlide[]): Promise<{ syncedToCloud: boolean }> => {
  const sanitized = sanitizeHeroSlides(slides) || [];

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
      // 1. Simpan ke site_settings
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

      // 2. Sinkronkan juga ke tabel 'sliders'
      for (let i = 0; i < sanitized.length; i++) {
        const sl = sanitized[i];
        // Cek format uuid valid
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sl.id);
        const payload: any = {
          title: sl.title || sl.badge,
          description: sl.desc || '',
          badge_tag: sl.badge,
          image_url: sl.image,
          cta_text: sl.btnText || 'Pelajari Kurikulum',
          cta_link: sl.link || '/program',
          order_index: i + 1,
          is_active: true,
          updated_at: new Date().toISOString(),
        };
        if (isUuid) {
          payload.id = sl.id;
        }
        await supabase.from('sliders').upsert(payload);
      }

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
    window.dispatchEvent(new CustomEvent('ppjm-hero-slides-changed', { detail: [] }));
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: SUPABASE_SLIDES_KEY,
            value: [] as unknown as Record<string, unknown>,
            description: 'Konten daftar kartu HeroSlider utama beranda PPJM',
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: 'key' }
        );
    } catch (e) {
      console.warn('Gagal mereset hero_slides di Supabase:', e);
    }
  }

  return [];
};
