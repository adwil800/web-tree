import {Box, Button, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import WTTable from "../components/WTTable";
import WTTreeView from "../components/WTTreeView";

interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}

const sampleScrapedData: ScrapedData[] = 
[
    { 
      "itemId": "0",
      "tag": "html",
      "content": [
        {
          "itemId": "1",
          "tag": "head",
          "content": [
            {
              "itemId": "2",
              "tag": "meta",
              "attributes": {
                "name": "viewport",
                "content": "width=device-width, initial-scale=1"
              }
            },
            {
              "itemId": "3",
              "tag": "meta",
              "attributes": {
                "name": "Web tree",
                "content": "A simple web scraper"
              }
            },
            {
              "itemId": "4",
              "tag": "title",
              "content": "Web Tree"
            }
          ]
        },
        {
          "itemId": "5",
          "tag": "body",
          "content": [
            {
          "itemId": "6",
          "tag": "section",
              "content": [
                {
                  "itemId": "7",
                  "tag": "ul",
                  "attributes": {
                    "class": "products"
                  },
                  "content": [
                    {
                      "itemId": "8",
                      "tag": "li",
                      "attributes": {
                        "Class": "product"
                      },
                      "content": [
                        {
                        "itemId": "9",
                        "tag": "p",
                          "attributes": {
                            "class": "product-name"
                          },
                          "content": "Laptop"
                        },
                        {
                        "itemId": "10",
                        "tag": "p",
                          "attributes": {
                            "class": "product-price"
                          },
                          "content": "$200"
                        }
                      ]
                    },
                    {
                        "itemId": "11",
                      "tag": "li",
                      "attributes": {
                        "Class": "product"
                      },
                      "content": [
                        {
                        "itemId": "12",
                        "tag": "p",
                          "attributes": {
                            "class": "product-name"
                          },
                          "content": "Laptop"
                        },
                        {
                        "itemId": "13",
                        "tag": "p",
                          "attributes": {
                            "class": "product-price"
                          },
                          "content": "$200"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
];

const sampleSelectedData: ScrapedData =  { 
  "itemId": "0",
  "tag": "html",
  "content": [
    {
      "itemId": "1",
      "tag": "head",
      "content": [
        {
          "itemId": "2",
          "tag": "meta",
          "attributes": {
            "name": "viewport",
            "content": "width=device-width, initial-scale=1"
          }
        },
        {
          "itemId": "3",
          "tag": "meta",
          "attributes": {
            "name": "Web tree",
            "content": "A simple web scraper"
          }
        },
        {
          "itemId": "4",
          "tag": "title",
          "content": "Web Tree"
        }
      ]
    },
    {
      "itemId": "5",
      "tag": "body",
      "content": [
        {
      "itemId": "6",
      "tag": "section",
          "content": [
            {
              "itemId": "7",
              "tag": "ul",
              "attributes": {
                "class": "products"
              },
              "content": [
                {
                  "itemId": "8",
                  "tag": "li",
                  "attributes": {
                    "Class": "product"
                  },
                  "content": [
                    {
                    "itemId": "9",
                    "tag": "p",
                      "attributes": {
                        "class": "product-name"
                      },
                      "content": "Laptop"
                    },
                    {
                    "itemId": "10",
                    "tag": "p",
                      "attributes": {
                        "class": "product-price"
                      },
                      "content": "$200"
                    }
                  ]
                },
                {
                    "itemId": "11",
                  "tag": "li",
                  "attributes": {
                    "Class": "product"
                  },
                  "content": [
                    {
                    "itemId": "12",
                    "tag": "p",
                      "attributes": {
                        "class": "product-name"
                      },
                      "content": "Laptop"
                    },
                    {
                    "itemId": "13",
                    "tag": "p",
                      "attributes": {
                        "class": "product-price"
                      },
                      "content": "$200"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

  

export default function WebScrape () {

  const handleTreeClick = (item: ScrapedData) => {
    console.log('Tree clicked: ', item);
  }

    return (
        <Box>
            <Grid container spacing={2} size={12} justifyContent="center">

                <Grid size={{ xs: 9 }} >

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
                    
                </Grid>

                <Grid size={{ xs: 4 }}>

                    <TextField
                        label="Website URL"
                        variant="outlined"
                        autoComplete="off"
                        className="WT-text-field"
                        fullWidth
                        size="small"
                    >

                    </TextField>

                    <Box className="tree-container bg-secondary " color={'white'} p={3} borderRadius={2} mt={1} maxHeight={'71vh'} overflow={'auto'}>
                        
                        <WTTreeView scrapedData={sampleScrapedData} onClick={handleTreeClick}/>
                                
                    </Box>
                    
                </Grid>

                <Grid container spacing={2}  sx={{ display: "flex",  justifyContent: "end",}} size={{ xs: 7 }}  >

                  <Grid size={12} maxHeight={'70vh'} overflow={'auto'}>
                    <WTTable selectedData={sampleSelectedData}/>
                  </Grid>

                  <Grid size={1}>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ ml: '10px' }}
                    >
                        <SearchIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                    </Button>
                  </Grid>

                </Grid>

            </Grid>
        </Box>
    );

};

