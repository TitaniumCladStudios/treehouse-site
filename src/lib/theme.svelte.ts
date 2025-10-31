import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
  let theme = $state<Theme>('light');

  // Initialize theme from localStorage or system preference
  if (browser) {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      theme = stored;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);
  }

  function applyTheme(newTheme: Theme) {
    if (!browser) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  }

  function setTheme(newTheme: Theme) {
    theme = newTheme;
    if (browser) {
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  }

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  return {
    get current() {
      return theme;
    },
    setTheme,
    toggleTheme
  };
}

export const themeStore = createThemeStore();
