'use client';
import { Toolbar, Box, IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Image from 'next/image';
import {useWTTheme} from './theme/ThemeContext';
 
export default function WTAppBar(){
  const { isDarkMode, toggleTheme } = useWTTheme();
 
  return (
    <Toolbar sx={{
      backgroundColor: 'primary.main', transition: 'background-color 0.2s ease',
      pl: { xs: 0, md: 2 }, pr: { xs: 1, md: 2 }
    }}>

      <Box sx={{ 
        display: 'flex', mt: 1, flexGrow: 1, justifyContent: 'space-between', alignItems: 'center',  
      }}>
        
        <Image src={`/images/${isDarkMode ? 'AppNameDark' : 'AppName'}.svg`} alt="app logo" height={60} width={200} />

        <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} enterDelay={500}>
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <LightModeIcon sx={{fontSize: 30, color: 'white'}}/> : <DarkModeIcon sx={{fontSize: 30, color: 'white'}}/>}
          </IconButton>
        </Tooltip>

      </Box>

    </Toolbar> 
  );

}