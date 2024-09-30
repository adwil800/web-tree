import {Box, Button, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface ScrapedData {
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}

const sampleScrapedData: ScrapedData[] = 
[
    {
      "tag": "html",
      "content": [
        {
          "tag": "head",
          "content": [
            {
              "tag": "meta",
              "attributes": {
                "name": "viewport",
                "content": "width=device-width, initial-scale=1"
              }
            },
            {
              "tag": "meta",
              "attributes": {
                "name": "Web tree",
                "content": "A simple web scraper"
              }
            },
            {
              "tag": "title",
              "content": "Web Tree"
            }
          ]
        },
        {
          "tag": "body",
          "content": [
            {
              "tag": "section",
              "content": [
                {
                  "tag": "ul",
                  "attributes": {
                    "class": "products"
                  },
                  "content": [
                    {
                      "tag": "li",
                      "attributes": {
                        "Class": "product"
                      },
                      "content": [
                        {
                          "tag": "p",
                          "attributes": {
                            "class": "product-name"
                          },
                          "content": "Laptop"
                        },
                        {
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
]
  

export default function WebScrape () {


    const extractAttributes = ({attributes}: ScrapedData) => {

          //Filter by attr by using #, ., or tag
          const attrs = attributes ? Object.keys(attributes).map((key) => {

            //Replace key with their respective selector
            const includesKey = ['class', 'id'].includes(key.toLowerCase());
            const selector = includesKey ? key.replace(/class/gi, '.').replace('id', '#') : key + '="';

            return `${(!includesKey && ' ') || ''}${selector}${ attributes && attributes[key]}${(!includesKey && '"') || ''}`;
            
        }) : [];

        return attrs

    }

    const renderScrapedJson = (data: ScrapedData[]) => {
        return data.map((item, index) => {

            const itemId = item.tag + '-' + index;
            const attributes = extractAttributes(item);

            //Filter by textContent
            if (typeof item.content === 'string') {
                return (
                    <TreeItem key={index} itemId={itemId} label={item.tag + attributes.join('')}>
                        <TreeItem itemId={itemId + index} label={item.content} />
                    </TreeItem>
                );
            }

            return (
                <TreeItem key={index} itemId={itemId} label={item.tag + attributes.join('')}>
                    { item.content && renderScrapedJson(item.content) }
                </TreeItem>
            );
        }
        );
    }

    IM HERE RENDERING THE TREEVIEW

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

                <Grid sx={{ pl: 10 }} size={{ xs: 6 }}>

                    <TextField
                        label="Website URL"
                        variant="outlined"
                        autoComplete="off"
                        className="WT-text-field"
                        fullWidth
                        size="small"
                    >

                    </TextField>

                    <Box className="tree-container bg-green " color={'white'} p={3} borderRadius={2} mt={1} maxHeight={700} overflow={'auto'}>
                        
                        <SimpleTreeView >
                            { renderScrapedJson(sampleScrapedData) }
                        </SimpleTreeView>
                                
                    </Box>
                    
                </Grid>

                <Grid sx={{ display: "flex", justifyContent: "center", mt: 10}} size={{ xs: 5 }}  >
                </Grid>

            </Grid>
        </Box>
    );

};

