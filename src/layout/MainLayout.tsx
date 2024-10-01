import {Box} from "@mui/material";
import WTAppBar from "../components/WTAppBar";

interface MainLayoutProps  { 
    children: React.ReactNode, 
    toggleTheme: () => void,
    isDarkMode: boolean
}

export default function MainLayout({ children, toggleTheme, isDarkMode }: MainLayoutProps) {

    return (
        <Box className="max-site-width margin-auto">
            <WTAppBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
            
            <Box mt={3}>
                {children}
            </Box>
        </Box>
    );

}
