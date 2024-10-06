// theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#2D8E00', 
      light: '#808080' // on focused 
    },
    secondary: {
      main: '#1d5c00', 
      light: '#808080', //on hover
      dark: '#00000036', // default
    },
    background: {
      default: '#fff',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#000',
      disabled: '#000',
    },
    info: {
      main: '#b3b2b2',
    }

  },
  
}); 

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#292D32', 
      light: '#fff',
    },
    secondary: {
      main: '#191B1F', 
      light: '#808080', //on hover
      dark: '#fff', // default
    },
    background: {
      default: '#0C0D0F',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
      disabled: '#fff',
    },
    info: {
      main: '#808080',
    }
  },
  
});

