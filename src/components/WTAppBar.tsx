import { Toolbar, Box } from '@mui/material';


export default function WTAppBar() {

  return (
    <Toolbar sx={{backgroundColor: 'secondary.main', }}>

      <Box sx={{ display: 'flex', mt: 1,  }}>
        
        <img src={'/images/AppName.svg'} alt="app logo" height={70} />

      </Box>

    </Toolbar>
  );

}