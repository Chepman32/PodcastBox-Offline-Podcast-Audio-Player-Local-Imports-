import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {useColorScheme} from 'react-native';
import {lightTheme, darkTheme, Theme} from './index';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  themeMode: 'light' | 'dark' | 'auto';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');

  const isDark =
    themeMode === 'auto' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider value={{theme, isDark, toggleTheme, setTheme, themeMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
