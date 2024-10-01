import {Box, Button, Tooltip} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import WTTable from "../components/WTTable";
import WTTreeView from "../components/WTTreeView";
import {useState} from "react";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import WTTextField from "../components/WTTextField";

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
                    "id": "ProductList",
                    "class": "products"
                  },
                  "content": [
                    {
                      "itemId": "8",
                      "tag": "li",
                      "attributes": {
                        "Class": "product listItem"
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
                        "Class": "product listItem"
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
      "attributes": {
        "className": "body1",
        "name": "body11"
      },
      "content": [
        {
      "itemId": "6",
      "tag": "section",
      "attributes": {
        "class": "section111",
        "className": "sampleSection",
        "id": "section1",
      },
          "content": [
            {
              "itemId": "7",
              "tag": "ul",
              "attributes": {
                "id": "ProductList",
                "class": "products"
              },
              "content": [
                {
                  "itemId": "8",
                  "tag": "li",
                  "attributes": {
                    "Class": "product listItem"
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
                    "Class": "product listItem"
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

  const [includeSelectorAttributes, setIncludeSelectorAttributes] = useState(true);

  const toggleSelectorAttributes = () => {
      setIncludeSelectorAttributes(!includeSelectorAttributes);
  };

  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      // Escape double quotes by replacing each " with ""
      value = value.replace(/"/g, '""');
      // Enclose the field in double quotes
      return `"${value}"`;
    }
    return value;
  };
  
  const downloadCSV = () => {
    const table = document.getElementById('WTTable');

    if(!table) return;

    const rows = table.querySelectorAll('tr');

    let csvContent = '';
    rows.forEach((row) => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols)
        .map(col => escapeCSV(col.textContent || ''))
        .join(',');
      csvContent += rowData + '\n';
    });

    // Create a blob for the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'mui_table_data.csv');
    a.click();
  };

  return (
      <Box>
          <Grid container spacing={2} size={12} justifyContent="center">

              <Grid size={{ xs: 9 }} >

                  <Box className="flex">
                    <WTTextField
                      label="Website URL"
                      variant="outlined"
                      autoComplete="off"
                      className="WT-text-field"
                      fullWidth
                    />
                      
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: '10px' }}
                    >
                        <SearchIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                    </Button>
                  </Box>
                  
              </Grid>

              <Grid size={{ xs: 4 }}>
                  <WTTextField
                    label="Website URL"
                    variant="outlined"
                    autoComplete="off"
                    className="WT-text-field"
                    fullWidth
                    size="small"
                  />

                  <Box className="tree-container" sx={{ backgroundColor: 'primary.main', transition: 'background-color 0.2s ease' }} color={'white'} p={3} borderRadius={2} mt={1} maxHeight={'71vh'} overflow={'auto'}>
                      
                      <WTTreeView scrapedData={sampleScrapedData} onClick={handleTreeClick}/>
                              
                  </Box>
                  
              </Grid>

              <Grid container spacing={2}  sx={{ display: "flex",  justifyContent: "end",}} size={{ xs: 7 }}  >

                <Grid size={12} >
                  <WTTable selectedData={sampleSelectedData} displaySelectorAttributes={includeSelectorAttributes}/>
                </Grid>

                <Grid size={12} sx={{ display: "flex",  justifyContent: "end",}}>
                  
                  <Tooltip enterDelay={500} title="Export to csv">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: '10px', textTransform: 'none'  }}
                      onClick={downloadCSV}
                    > 
                      Download CSV &nbsp;
                      <FileDownloadIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                    </Button>
                  </Tooltip>

                  <Tooltip enterDelay={500} title="Include selector attributes">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: '10px', textTransform: 'none'  }}
                      onClick={toggleSelectorAttributes}
                    > 
                      Selector attributes &nbsp;
                      {includeSelectorAttributes ? 
                          <CheckBoxIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                        :
                          <CheckBoxOutlineBlankIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                      }

                    </Button>
                  </Tooltip>
                </Grid>

              </Grid>

          </Grid>
      </Box>
  );

};

