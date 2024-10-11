import {Box} from "@mui/material";
import WTAppBar from "../components/layout/WTAppBar";

interface MainLayoutProps  { 
    children: React.ReactNode, 
    toggleTheme: () => void,
    isDarkMode: boolean
}

export default function MainLayout({ children, toggleTheme, isDarkMode }: MainLayoutProps) {

    return (
        <Box className={`max-site-width margin-auto transition-bg ${isDarkMode ? 'dark-bg' : 'light-bg'}`} sx={{minHeight: '100vh'}}>
            <WTAppBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
            
            <Box mt={3}>
                {children}
            </Box>
        </Box>
    );

}
