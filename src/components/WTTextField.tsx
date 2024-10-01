
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/system';

const WTTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.secondary.dark,
    transition: 'ease 0.2s',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.secondary.light,
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
  },
}));

// Export the styled component and theme
export default WTTextField;
