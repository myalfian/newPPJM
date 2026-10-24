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
};
