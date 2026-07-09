import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'hallaqi' | 'classic' | 'modern' | 'digital' | 'red' | 'blue' | 'gradient';
export type AnimationPreset = 'simple' | 'modern' | 'digital';

interface ThemeConfig {
  primary: string;
  bgBase: string;
  accent: string;
  cardBg: string;
  textMain: string;
  secondary: string;
}

export const themeConfigs: Record<ThemeName, ThemeConfig> = {
  hallaqi: {
    primary: '#0F766E',
    bgBase: '#F0FDFA',
    accent: '#F59E0B',
    cardBg: '#FFFFFF',
    textMain: '#0F172A',
    secondary: '#164E63',
  },
  classic: {
    primary: '#D4463A',
    bgBase: '#F8F6F3',
    accent: '#E87A5D',
    cardBg: '#FFFFFF',
    textMain: '#1E1C1A',
    secondary: '#B83A30',
  },
  modern: {
    primary: '#2A2A2E',
    bgBase: '#FFFFFF',
    accent: '#4A4A4E',
    cardBg: '#FFFFFF',
    textMain: '#1A1A1E',
    secondary: '#3A3A3E',
  },
  digital: {
    primary: '#00D4AA',
    bgBase: '#0D1117',
    accent: '#00FFB3',
    cardBg: '#161B22',
    textMain: '#E6EDF3',
    secondary: '#00B894',
  },
  red: {
    primary: '#FF2D55',
    bgBase: '#FFF5F5',
    accent: '#FF6B8A',
    cardBg: '#FFFFFF',
    textMain: '#1A0A0A',
    secondary: '#E11D48',
  },
  blue: {
    primary: '#007AFF',
    bgBase: '#F0F7FF',
    accent: '#5AC8FA',
    cardBg: '#FFFFFF',
    textMain: '#0A1628',
    secondary: '#0055B3',
  },
  gradient: {
    primary: '#FF6B35',
    bgBase: '#1A1A2E',
    accent: '#F7931E',
    cardBg: '#252540',
    textMain: '#F0F0F5',
    secondary: '#E55A2B',
  },
};

interface ThemeState {
  theme: ThemeName;
  animationPreset: AnimationPreset;
  isDarkMode: boolean;
  setTheme: (theme: ThemeName) => void;
  setAnimationPreset: (preset: AnimationPreset) => void;
  toggleDarkMode: () => void;
  getThemeConfig: () => ThemeConfig;
  applyThemeCSS: () => void;
}

function applyThemeToDOM(theme: ThemeName, isDarkMode: boolean) {
  const config = themeConfigs[theme];
  const root = document.documentElement;

  root.style.setProperty('--primary-500', config.primary);
  root.style.setProperty('--border-focus', config.primary);
  root.style.setProperty('--bg-base', config.bgBase);
  root.style.setProperty('--bg-card', config.cardBg);
  root.style.setProperty('--text-primary', config.textMain);
  root.style.setProperty('--gradient-card', `linear-gradient(135deg, ${config.primary} 0%, ${config.accent} 100%)`);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDarkMode ? '#0C4A6E' : config.bgBase);
  }

  document.body.style.backgroundColor = isDarkMode ? '#0C4A6E' : config.bgBase;
  document.body.style.color = isDarkMode ? '#F0FDFA' : config.textMain;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'hallaqi',
      animationPreset: 'modern',
      isDarkMode: false,
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDOM(theme, get().isDarkMode);
      },
      setAnimationPreset: (preset) => set({ animationPreset: preset }),
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });
        applyThemeToDOM(get().theme, newMode);
      },
      getThemeConfig: () => themeConfigs[get().theme],
      applyThemeCSS: () => applyThemeToDOM(get().theme, get().isDarkMode),
    }),
    {
      name: 'hallaqi-theme',
    }
  )
);
