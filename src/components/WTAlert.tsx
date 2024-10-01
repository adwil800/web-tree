import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CheckIcon from '@mui/icons-material/Check';

interface WTAlertProps {
    isOpen: boolean;
    message: string;
    CloseAlert: () => void;
}

export default function WTAlert({ isOpen, message, CloseAlert }: WTAlertProps) {

    React.useEffect(() => {
        const alert = setTimeout(() => {
            CloseAlert();
        }, 2000);

        return () => {
            clearTimeout(alert);
        }
    }, [CloseAlert]);

  return (
    <Box sx={{ position: 'absolute', bottom: 5, right: 20,  }}>
        
      <Collapse in={isOpen}>
        <Alert
            icon={<CheckIcon fontSize="inherit" htmlColor='white' />} 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
        >
          {message}
        </Alert>
      </Collapse>
     
    </Box>
  );
}