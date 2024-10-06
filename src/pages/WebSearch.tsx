import {Box, Button, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import WTTextField from "../components/WTTextField";
import {useRef, useState} from "react";
import WTAlert from "../components/WTAlert";
import {TypeAnimation} from "react-type-animation";

const htmlText = `
    <html> 
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
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

    return (
        <Box >
            <Grid container spacing={2} size={12}>
                
                <Grid sx={{ pl: 10 }} size={{ xs: 6 }}>

                    <Typography variant="h2">
                        Scan a website
                    </Typography>

                    <Typography variant="h5" gutterBottom>
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

                    <pre>
                        <TypeAnimation
                            sequence={[htmlText]} // HTML text sequence
                            wrapper="span"
                            cursor={false}
                            repeat={1}
                            speed={99}
                            style={{ fontSize: '16px', display: 'inline-block' }}
                        /> 
                    </pre>

                    
                </Grid>

                <Grid sx={{ display: "flex", justifyContent: "center", mt: 10}} size={{ xs: 5 }}  >
                    <img src={`/images/${isDarkMode ? 'WebSearchDark' : 'WebSearch'}.png`} alt="app logo" height={600} />
                </Grid>

            </Grid>

            <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'error'} message={'Please enter a valid URL'} />
        </Box>
    );

};

