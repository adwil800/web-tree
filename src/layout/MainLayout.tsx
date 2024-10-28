import {Box} from "@mui/material";
import WTAppBar from "../components/layout/WTAppBar";
import {ComponentChildren} from "../components/models";


export default function MainLayout({ children }: ComponentChildren) {

    return (
        <>
            <WTAppBar />
            
            <Box mt={2}>
                {children}
            </Box>
        </>
    );

}
