// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#2D8E00', 
    },
    background: {
      default: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#000',
      disabled: '#000',
    },
  },
});

export default theme;
