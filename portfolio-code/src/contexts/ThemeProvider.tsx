import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';
import { ThemeContext } from './ThemeContext';

const STORAGE_KEY      = 'theme';
const DARK_VALUE       = 'dark';
const LIGHT_VALUE      = 'light';
/** Default to dark mode for first-time visitors. */
const DEFAULT_IS_DARK  = true;

const readPreferredMode = (): boolean => {
  if (typeof window === 'undefined') return DEFAULT_IS_DARK;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved ? saved === DARK_VALUE : DEFAULT_IS_DARK;
};

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(readPreferredMode);

  useEffect(() => {
    const mode = isDarkMode ? DARK_VALUE : LIGHT_VALUE;
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [isDarkMode]);

  const toggleTheme = useCallback((): void => {
    setIsDarkMode(previous => !previous);
  }, []);

  const activeTheme   = isDarkMode ? darkTheme : lightTheme;
  const contextValue  = useMemo(
    () => ({ theme: activeTheme, isDarkMode, toggleTheme }),
    [activeTheme, isDarkMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={activeTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
