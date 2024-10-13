import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

interface WTAlertProps {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
    position: 'top' | 'bottom';
    CloseAlert: () => void;
}

export default function WTAlert({ isOpen, message, type, position, CloseAlert }: WTAlertProps) {

    React.useEffect(() => {
        const alert = setTimeout(() => {
            CloseAlert();
        }, 2000);

        return () => {
            clearTimeout(alert);
        }
    }, [CloseAlert]);

    const sx: Record<string, string | number> = { position: 'absolute', right: 20}; 

    if(position === 'top') {
        sx.top = 5;
    } else {
        sx.bottom = 5;
    }

  return (
    <Box sx={sx}>
        
      <Collapse in={isOpen}>
        <Alert
            icon={type === 'success' ? <CheckIcon fontSize="inherit" htmlColor='white' /> : <ErrorIcon fontSize="inherit" htmlColor='white' />} 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
        >
          {message}
        </Alert>
      </Collapse>
     
    </Box>
  );
}