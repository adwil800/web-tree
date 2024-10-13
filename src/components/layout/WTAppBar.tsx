import { Toolbar, Box, IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
 

interface WTAppBarProps {
  toggleTheme: () => void,
  isDarkMode: boolean
}

export default function WTAppBar({ toggleTheme, isDarkMode }: WTAppBarProps){
 
  return (
    <Toolbar sx={{
      backgroundColor: 'primary.main', transition: 'background-color 0.2s ease',
      pl: { xs: 0, md: 2 }, pr: { xs: 1, md: 2 }
    }}>

      <Box sx={{ 
        display: 'flex', mt: 1, flexGrow: 1, justifyContent: 'space-between', alignItems: 'center',  
      }}>
        
        <img src={`/images/${isDarkMode ? 'AppNameDark' : 'AppName'}.svg`} alt="app logo" height={60} />

        <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} enterDelay={500}>
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <LightModeIcon sx={{fontSize: 30, color: 'white'}}/> : <DarkModeIcon sx={{fontSize: 30, color: 'white'}}/>}
          </IconButton>
        </Tooltip>

      </Box>

    </Toolbar> 
  );

}