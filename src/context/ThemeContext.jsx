import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newVal = !prev;
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  };

  const theme = {
    isDark,
    bg: isDark ? '#05000f' : '#f8f5ff',
    bgSecondary: isDark ? 'rgba(1, 78, 58, 0.03)' : 'rgba(0,0,0,0.03)',
    bgCard: isDark ? 'rgba(10,0,20,0.85)' : 'rgba(255,255,255,0.95)',
    text: isDark ? 'white' : '#1a0030',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    navBg: isDark ? 'rgba(5,0,15,0.95)' : 'rgba(255,255,255,0.95)',
    accent: '#e04472',
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);