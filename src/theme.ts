// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#2D8E00', // Change this to your preferred secondary color
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
