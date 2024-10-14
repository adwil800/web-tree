'use client';
import {darkTheme, lightTheme} from './theme';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {Box, CssBaseline} from '@mui/material';

interface ThemeContextType {
  isDarkMode: boolean | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useWTTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const WTThemeProvider = ({ children }: ThemeProviderProps) => {
  
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); 
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('isDarkMode');
    if (currentTheme) {
      setIsDarkMode(JSON.parse(currentTheme));
    } else {
      // No theme was set, so let's set the default theme
      localStorage.setItem('isDarkMode', JSON.stringify(false));
      setIsDarkMode(false);
    }
  }, []);


  // Render nothing while isDarkMode is null (loading state)
  if (isDarkMode === null) {
    return null; // Or you can render a loading spinner here if preferred
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />  
        <Box className={`max-site-width margin-auto transition-bg ${isDarkMode ? 'dark-bg' : 'light-bg'}`} sx={{minHeight: '100vh'}}>
          {children}
        </Box>
        </ThemeProvider>
    </ThemeContext.Provider>
  );
  
};
