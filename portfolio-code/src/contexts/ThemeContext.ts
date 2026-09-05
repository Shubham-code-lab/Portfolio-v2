import { createContext, useContext } from 'react';
import type { Theme } from '../styles/theme';

interface ThemeContextValue {
  theme:       Theme;
  isDarkMode:  boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
};

export type { ThemeContextValue };
