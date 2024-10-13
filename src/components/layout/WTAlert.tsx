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
    CloseAlert: () => void;
}

export default function WTAlert({ isOpen, message, type, CloseAlert }: WTAlertProps) {

    React.useEffect(() => {
        const alert = setTimeout(() => {
            CloseAlert();
        }, 2000);

        return () => {
            clearTimeout(alert);
        }
    }, [CloseAlert]);

  return (
    <Box sx={{ position: 'absolute', top: 5, right: 20,  }}>
        
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