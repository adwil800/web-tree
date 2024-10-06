import {Box, Button,  Tooltip} from "@mui/material";
import Grid from "@mui/material/Grid2";
import WTTable from "../components/WTTable";
import WTTreeView from "../components/WTTreeView/WTTreeView";
import {useState} from "react";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import WTTextField from "../components/WTTextField";
import {extractAllIds} from "../components/commonFunctions";
import {contentType} from "../components/models";
import ButtonGroup from '@mui/material/ButtonGroup';
import WTConfirmationDialog from "../components/WTConfirmationDialog";
import FastRewindIcon from '@mui/icons-material/FastRewind';

interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}
//TODO  Make sure that every key is set to lower case
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
          "attributes": {
            "class": "section111" ,
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
                        "class": "product listItem"
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
                          "content": "$3220"
                        }
                      ]
                    },
                    {
                        "itemId": "11",
                      "tag": "li",
                      // "attributes": {
                      //   "Class": "product listItem"
                      // },
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
                },
                {
                  "itemId": "117",
                  "tag": "ul",
                  "attributes": {
                    "id": "AAAAAAAAAAAAAAAA",
                  },
                  "content": [
                    {
                      "itemId": "82",
                      "tag": "li",
                      "attributes": {
                        "class": "Puroducto Liasto"
                      },
                      "content": [
                        {
                        "itemId": "29",
                        "tag": "p",
                        "attributes": {
                          "class": "product-nomme"
                        },
                        "content": "laptop"
                        }
                      ]
                    },
                  ]
                },
                {
                "itemId": "130",
                "tag": "p",
                  "content":   [
                    {
                      "itemId": "13021",
                      "tag": "span",
                      "content": "$200"
                    },
                    {
                      "itemId": "1301",
                      "tag": "span",
                      "content": "laptop"
                    },
                    {
                      "itemId": "13320121",
                      "tag": "span",
                        "content": [
                          {
                            "itemId": "14130211",
                            "tag": "div",
                            "content": "laptop"
                          },
                        ]
                      }
                  ]
                }
              ]
            },
            {
              "itemId": "1171",
              "tag": "ul",
              "attributes": {
                "id": "BBBBBBBBBBBBBBBBB",
              },
              "content": [
                {
                  "itemId": "812",
                  "tag": "li",
                  "attributes": {
                    "class": "ITEMMMM"
                  },
                  "content": [
                    {
                    "itemId": "129",
                    "tag": "p",
                      "attributes": {
                        "class": ""
                      },
                      "content": "SUPHA"
                    },
                    {
                    "itemId": "1310",
                    "tag": "p",
                      "attributes": {
                        "class": ""
                      },
                      "content": "$34000"
                    }
                  ]
                },
              ]
            },
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
      "attributes": {
        "class": "section111" ,
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
                    "class": "product listItem"
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
                      "content": "$3220"
                    }
                  ]
                },
                {
                    "itemId": "11",
                  "tag": "li",
                  // "attributes": {
                  //   "Class": "product listItem"
                  // },
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
            },
            {
              "itemId": "117",
              "tag": "ul",
              "attributes": {
                "id": "AAAAAAAAAAAAAAAA",
              },
              "content": [
                {
                  "itemId": "82",
                  "tag": "li",
                  "attributes": {
                    "class": "Puroducto Liasto"
                  },
                  "content": [
                    {
                    "itemId": "29",
                    "tag": "p",
                    "attributes": {
                      "class": "product-nomme"
                    },
                    "content": "laptop"
                    }
                  ]
                },
              ]
            },
            {
            "itemId": "130",
            "tag": "p",
              "content":   [
                {
                  "itemId": "13021",
                  "tag": "span",
                  "content": "$200"
                },
                {
                  "itemId": "1301",
                  "tag": "span",
                  "content": "laptop"
                },
                {
                  "itemId": "13320121",
                  "tag": "span",
                    "content": [
                      {
                        "itemId": "14130211",
                        "tag": "div",
                        "content": "laptop"
                      },
                    ]
                  }
              ]
            }
          ]
        },
        {
          "itemId": "1171",
          "tag": "ul",
          "attributes": {
            "id": "BBBBBBBBBBBBBBBBB",
          },
          "content": [
            {
              "itemId": "812",
              "tag": "li",
              "attributes": {
                "class": "ITEMMMM"
              },
              "content": [
                {
                "itemId": "129",
                "tag": "p",
                  "attributes": {
                    "class": ""
                  },
                  "content": "SUPHA"
                },
                {
                "itemId": "1310",
                "tag": "p",
                  "attributes": {
                    "class": ""
                  },
                  "content": "$34000"
                }
              ]
            },
          ]
        },
      ]
    }
  ]
}

interface WebScrapeProps {
  webUrl: string;
  backToSearch: () => void;
}
   
export default function WebScrape ({ webUrl, backToSearch }: WebScrapeProps) {

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
 
  const handleTreeClick = (itemId: string, selectionType: 'node' | 'tree') => {

    let itemsToAdd = new Set<string>([itemId]);

    if(selectionType === 'tree') {

      const currentItem = findCurrentItem(itemId, sampleScrapedData[0]);
        
      if(currentItem === null) return;
        itemsToAdd = new Set([...itemsToAdd, ...extractAllIds([currentItem])]);
      
    } 
  
    setSelectedIds((prevSelectedIds) => {
      return new Set([...prevSelectedIds, ...itemsToAdd]); 
    });
    
  }

  const findCurrentItem = (itemId: string, data: ScrapedData): ScrapedData | null => {
    if(data.itemId === itemId) return data;

    if(Array.isArray(data.content)) {
      for(const child of data.content) {
        const result = findCurrentItem(itemId, child);
        if(result) return result;
      }
    }

    return null;
  }
 
  const removeSelectedItem = (itemId: string) => {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      newSelectedIds.delete(itemId);
      return newSelectedIds;
    });
  }

  const clearTableContent = (itemIds: string[], contentType: contentType ) => {

    if(contentType === 'table') {
      setSelectedIds(new Set());
    } else {
      setSelectedIds((prevSelectedIds) => {
        const newSelectedIds = new Set(prevSelectedIds);
        itemIds.forEach((itemId) => newSelectedIds.delete(itemId));
        return newSelectedIds;
      });
    }
    
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



  // App interaction functions
  
  const [showExitDialog, setShowExitDialog] = useState(false);
  const exitScraping = () => {
    setShowExitDialog(true);
  }

  const onWTDialogClose = (response: 'yes' | 'no') => {

    setShowExitDialog(false);

    if(response === 'yes') {
      backToSearch();
    }

  }

  const onTreeAddOnSearch = (itemIds: string[]) => {
    setSelectedIds((prevSelectedIds) => {
      return new Set([...prevSelectedIds, ...itemIds]);
    });
  }

  return (
      <Box mb={2}>
          <Grid container spacing={2} size={12} justifyContent="center">

              <Grid size={{ xs: 9 }} >

                  <Box className="flex">

                    <WTTextField
                      label={'Website URL'}
                      variant="outlined"
                      autoComplete="off"
                      className="WT-text-field"
                      fullWidth
                      value={webUrl}
                    />
                      
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: '10px' }}
                      onClick={exitScraping}
                    >
                      <FastRewindIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                    </Button>

                  </Box>
                  
              </Grid>

              <Grid size={{ xs: 4 }}>
                  
                <WTTreeView scrapedData={sampleScrapedData} selectedIds={selectedIds} onClick={handleTreeClick} onAddOnSearch={onTreeAddOnSearch}/>
                              
              </Grid>

              <Grid container spacing={2}  sx={{ display: "flex", flexDirection: 'column',  justifyContent: "space-between" }} size={{ xs: 7 }}  >

                <Grid size={12} >
                  <WTTable scrapedData={sampleSelectedData} selectedIds={selectedIds} onRemoveRow={removeSelectedItem} onClearContent={clearTableContent}  displaySelectorAttributes={includeSelectorAttributes}/>
                </Grid>

                <Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>

                  <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">

                    <Button
                      sx={{ textTransform: 'none' }}
                      onClick={downloadCSV}
                    > 
                      Download CSV &nbsp;
                      <FileDownloadIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                    </Button>

                    <Tooltip enterDelay={500} title="Include selector attributes">
                      <Button
                        sx={{ textTransform: 'none' }}
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

                  </ButtonGroup>

                </Grid>

              </Grid>

          </Grid>

          <WTConfirmationDialog isOpen={showExitDialog} title="You're about to exit the current scraping session" caption="Any changes made will be lost" onClose={onWTDialogClose} />
      </Box>
  );

};

