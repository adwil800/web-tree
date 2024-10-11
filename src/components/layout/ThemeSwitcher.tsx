import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {darkTheme, lightTheme} from '../../theme';

interface ThemeSwitcherProps {
    children: React.ReactNode,
    isDarkMode: boolean
}


const ThemeSwitcher = ({ children, isDarkMode }: ThemeSwitcherProps) => {

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />  
      {children}
    </ThemeProvider>
  );
};

export default ThemeSwitcher;
