import WTTextField from "@/app/components/WTTextField";
import {Box, Button} from "@mui/material";
import ChangeCircleSharpIcon from '@mui/icons-material/ChangeCircleSharp';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import WTConfirmationDialog from "@/app/components/WTConfirmationDialog";


interface WebSearchProps {
    getScrapedData: (url: string) => void;
}
   
export default function WebSearchSection ({ getScrapedData }: WebSearchProps) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [localUrl, setLocalUrl] = useState(searchParams.get('target') || '');

    useEffect(() => {
        getScrapedData(localUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [showExitDialog, setShowExitDialog] = useState(false);
    const exitScraping = () => {
        setShowExitDialog(true);
    }

    const onWTDialogClose = (response: 'yes' | 'no') => {

        setShowExitDialog(false);

        if(response === 'yes') {
        router.push('/');
        }

    }

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // Update parameter in URL
        const params = new URLSearchParams(searchParams.toString())
        params.set('target', event.target.value); 
    
        router.push(pathname + '?' + params.toString());
        setLocalUrl(event.target.value);
    
    }

    const rescanWebsite = () => {
        getScrapedData(localUrl);
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
        rescanWebsite();
    }
    };
    
    return (
        
        <Box className="flex">

            <WTTextField
                label={'Website URL'}
                variant="outlined"
                autoComplete="off"
                className="WT-text-field"
                fullWidth
                value={localUrl}
                onChange={handleTextFieldChange}
                onKeyDown={handleKeyDown}
                helperText="To scrape from a given element, include a space and the element's selector, e.g. https://example.com tag.class#id"
            />
                
            <Button
                variant="contained"
                color="primary"
                sx={{ ml: '10px', maxHeight: 55 }}
                onClick={exitScraping}
            >
                <FastRewindIcon  htmlColor="#fff" sx={{ fontSize: 28 }}/>
            </Button>

            <Button
                variant="contained"
                color="primary"
                sx={{ ml: '10px', maxHeight: 55 }}
                onClick={rescanWebsite} 
            >
                <ChangeCircleSharpIcon  htmlColor="#fff" sx={{ fontSize: 28 }}/>
            </Button>

          <WTConfirmationDialog isOpen={showExitDialog} title="You're about to exit the current scraping session" caption="Any changes made will be lost" onClose={onWTDialogClose} />
        </Box>
        

    );

};

