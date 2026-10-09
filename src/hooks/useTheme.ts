import { useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky';

interface ThemeState {
  mode: ThemeMode;
  accent: AccentColor;
  resolvedMode: 'light' | 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeState>(() => {
    const saved = localStorage.getItem('imglab-theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          mode: parsed.mode || 'system',
          accent: parsed.accent || 'indigo',
          resolvedMode: 'light',
        };
      } catch { /* fallthrough */ }
    }
    return { mode: 'system' as ThemeMode, accent: 'indigo' as AccentColor, resolvedMode: 'light' as const };
  });

  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }, []);

  useEffect(() => {
    const resolved = theme.mode === 'system' ? getSystemTheme() : theme.mode;
    setThemeState(prev => ({ ...prev, resolvedMode: resolved }));

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('imglab-theme', JSON.stringify({ mode: theme.mode, accent: theme.accent }));
  }, [theme.mode, theme.accent, getSystemTheme]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme.mode === 'system') {
        const resolved = getSystemTheme();
        setThemeState(prev => ({ ...prev, resolvedMode: resolved }));
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme.mode, getSystemTheme]);

  const setMode = (mode: ThemeMode) => setThemeState(prev => ({ ...prev, mode }));
  const setAccent = (accent: AccentColor) => setThemeState(prev => ({ ...prev, accent }));
  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const idx = modes.indexOf(theme.mode);
    setMode(modes[(idx + 1) % modes.length]);
  };

  return { ...theme, setMode, setAccent, toggleMode };
}
