import {Box, Button, Typography, useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import WTTextField from "../components/WTTextField";
import {useRef, useState} from "react";
import WTAlert from "../components/layout/WTAlert";
import {TypeAnimation} from "react-type-animation";
import {PageTransition} from "../components/Transitions";

import { useTheme } from '@mui/material/styles';

const htmlText = `
    <html> 
        <head>
            <meta 
                name="viewport" 
                content="width=device-width, initial-scale=1" 
            />
            <meta
                name="Web tree"
                content="A simple web scraper"
            />
            <title>Web Tree</title>
        </head>
        <body>
            <section>
                <ul class="products">
                    <li class="product">
                        <p class="product-name"> Laptop </p> 
                        <p class="product-price"> $200 </p> 
                    </li> 
                </ul>
            </section>
        </body>
    </html>
`;

interface WebSearchProps {
    onSearch: (url: string) => void;
    isDarkMode: boolean;
}

export default function WebSearch ({ onSearch, isDarkMode }: WebSearchProps) {

    
    const [webUrl, setWebUrl] = useState('');
    const searchBarRef = useRef<HTMLElement>(null);

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebUrl(event.target.value);
    }


    const beginScraping = () => {
    
        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(webUrl)) {

            setShowAlert(true);

            if(searchBarRef.current) {
                searchBarRef.current.focus();
            }

            return;
            
        }
    
        onSearch(webUrl);
        
    }

    const [showAlert, setShowAlert] = useState(false);

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    // Define breakpoints
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <PageTransition transitionKey="WebSearch">
            <Box>
                <Grid container spacing={2} size={12}>
                    
                    <Grid sx={{ pl: { xs: 2, md: 10 }, pr: { xs: 2, md: 0 } }} size={{ xs: 12, md: 6 }}>

                        <Typography 
                            variant="h3"
                            sx={{
                              fontSize: {
                                xs: '2rem',  
                                md: '3rem', 
                              }
                            }}
                        >
                            Scan a website
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            Find what you need
                        </Typography>

                        <Box className="flex">

                            <WTTextField
                                label="Website URL"
                                variant="outlined"
                                autoComplete="off"
                                className="WT-text-field"
                                fullWidth
                                onChange={handleTextFieldChange}
                                inputRef={searchBarRef}
                            />
                            
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ ml: '10px' }}
                                onClick={beginScraping}
                            >
                                <SearchIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                            </Button>
                            
                        </Box>
                        
                        {
                            isMdUp && 
                            <pre>
                                <TypeAnimation
                                    sequence={[htmlText]} // HTML text sequence
                                    wrapper="span"
                                    cursor={false}
                                    repeat={1}
                                    speed={99}
                                    style={{ fontSize: '15px', display: 'inline-block' }}
                                /> 
                            </pre>
                        }

                        
                    </Grid>

                    <Grid sx={{ display: 'flex', position: 'relative',  justifyContent: "center", mt: { xs: 2, md: 11}, pr: { md: 10 }}} size={{ xs: 12, md: 6 }}  >
                        
                        <img src={`/images/${isDarkMode ? 'WebSearchDark' : 'WebSearch'}.png`} alt="app logo" style={{ maxWidth: '90vw', objectFit: 'contain' }} width={550} />
                        
                        { 
                            isMdDown &&
                            <Typography variant="h3"  
                                sx={{
                                    position: 'absolute',
                                    top: '58%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontWeight: 'bold',
                                    fontSize: isSmDown ? '10vw' : '8vw',
                                    color: 'white'
                                }}
                            >
                                HTTP
                            </Typography>
                        }

                    </Grid>

                </Grid>

                <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'error'} message={'Please enter a valid URL'} />
            </Box>
        </PageTransition>
    );

};

