import {Box} from "@mui/material";
import WTAppBar from "../components/WTAppBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <Box className="max-site-width margin-auto">
            <WTAppBar/>
            
            <Box mt={3}>
                {children}
            </Box>
        </Box>
    );

}
