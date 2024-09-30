import {Box, Button, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';

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
            </main>
        </body>
    </html>
`;

export default function WebSearch () {

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
                        <TextField
                            label="Website URL"
                            variant="outlined"
                            autoComplete="off"
                            className="WT-text-field"
                            fullWidth
                        >

                        </TextField>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ ml: '10px' }}
                        >
                                <SearchIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                        </Button>
                    </Box>

                    <pre>
                        {htmlText}
                    </pre>


                </Grid>

                <Grid sx={{ display: "flex", justifyContent: "center", mt: 10}} size={{ xs: 5 }}  >
                    <img src={"/images/WebSearch.png"} alt="app logo" height={600} />
                </Grid>

            </Grid>
        </Box>
    );

};

