import {Box, Button, Tab, Tabs, useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Grid2";
import WTTable from "../components/WebScrape/WTTable";
import {useEffect, useState} from "react";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import WTTextField from "../components/WTTextField";
import {ContentType} from "../components/models";
import ButtonGroup from '@mui/material/ButtonGroup';
import WTConfirmationDialog from "../components/layout/WTConfirmationDialog";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import {PageTransition} from "../components/Transitions";
import WTTreeView from "../components/WebScrape/WTTreeView/WTTreeView";
import {extractAllIds} from "../components/commonFunctions";
import {TabPanel} from "../components/layout/TabPanel";
import { useTheme } from '@mui/material/styles'; 
import axios from 'axios';
import ChangeCircleSharpIcon from '@mui/icons-material/ChangeCircleSharp';
import {useWTAlert} from "../components/context/AlertContext";

interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}

interface WebScrapeProps {
  webUrl: string;
  onSearch: (url: string) => void;
  backToSearch: () => void;
}
   
export default function WebScrape ({ webUrl, onSearch, backToSearch, }: WebScrapeProps) {

  const { CWTAlert } = useWTAlert();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);

  const fetchScrapedData = async (url: string) => {
      try { 
          // Make a GET request to your local server
          const response = await axios.post(`http://localhost:3001/api/scrape?`, { url });

          if (response.data.success) {
            setScrapedData([response.data.data.data]);
          } else {
            setScrapedData([{itemId: '-1', tag: 'No results'}]);
          }

      } catch (error) {
          // console.log('Error fetching scraped data:', error);
      }
  }; 

  useEffect(() => {
    fetchScrapedData(webUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webUrl]);

 
  const handleTreeClick = (itemId: string, selectionType: 'node' | 'tree') => {

    let itemsToAdd = new Set<string>([itemId]);

    if(selectionType === 'tree') {

      const currentItem = findCurrentItem(itemId, scrapedData[0]);
        
      if(currentItem === null) return;
        itemsToAdd = new Set([...itemsToAdd, ...extractAllIds([currentItem])]);
      
    } 
    
    // Add items to the selectedIds state if they are not already present
    const newItemsToAdd = [...itemsToAdd].filter((itemId) => !selectedIds.has(itemId));

    if(newItemsToAdd.length > 0) {
      setSelectedIds((prevSelectedIds) => {
        return new Set([...prevSelectedIds, ...newItemsToAdd]);
      });
    }
    
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

  const clearTableContent = (itemIds: string[], contentType: ContentType ) => {
    
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

  const [rescanClearer, setRescanClearer] = useState(false);

  const toggleRescanClearer = () => {
    setRescanClearer(!rescanClearer);
  }

  const [displaySelector, setDisplaySelector] = useState(false);

  const toggleDisplaySelector = () => {
    setDisplaySelector(!displaySelector);
  };

  const [displayAttributes, setDisplayAttributes] = useState(false);

  const toggleDisplayAttributes = () => {
    setDisplayAttributes(!displayAttributes);
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

    if(!table || !selectedIds.size) {
      CWTAlert('No data to export');
      
      return;
    };

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
    const domain = webUrl.match(/(?:https?:\/\/)?(?:www\.)?([^/]+)/);
    const docName = `${domain && domain.length ? domain[1] : 'webtree'}_data.csv`;
    a.setAttribute('href', url);
    a.setAttribute('download', docName);
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

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  //Tabs

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [localUrl, setLocalUrl] = useState(webUrl);

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUrl(event.target.value);
  }

  const rescanWebsite = () => {
    onSearch(localUrl);
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      rescanWebsite();
    }
  };

  return (
    <PageTransition transitionKey="WebScrape">
      <Box mb={2}>
        
          <Grid container spacing={2} size={12} justifyContent="center">

              <Grid size={{ xs: 11, md: 9 }} >

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

                  </Box>
                  
              </Grid>

              {
                isSmDown && 
                <Grid size={{ xs: 11,  }} >
            
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="HTML Tree"/>
                    <Tab label="Selection table"/>
                  </Tabs>
                    
                </Grid>
              }

              <Grid size={{ xs: 11, md: 4 }}>
                  
                <TabPanel value={isSmDown ? value : 0} index={0}>
                  <WTTreeView scrapedData={scrapedData} selectedIds={selectedIds} onClick={handleTreeClick} onAddOnSearch={onTreeAddOnSearch} clearSelection={toggleRescanClearer}/>
                </TabPanel>
                
              </Grid>

                <Grid container spacing={2}  sx={{ display: "flex", flexDirection: 'column',  justifyContent: "space-between" }} size={{ xs: 11, md: 7 }}  >


                  <Grid size={12} >
                    <TabPanel value={isSmDown ? value : 1} index={1}>
                      <WTTable scrapedData={scrapedData[0]} selectedIds={selectedIds} onRemoveRow={removeSelectedItem} onClearContent={clearTableContent}  displaySelector={displaySelector} displayAttributes={displayAttributes} rescanClearer={rescanClearer}/>
                    </TabPanel>
                  </Grid>

                  <Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>

                    <TabPanel value={isSmDown ? value : 1} index={1}>
                      <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">

                        <Button
                          sx={{ textTransform: 'none' }}
                          onClick={downloadCSV}
                        > 
                          Download CSV &nbsp;
                          <FileDownloadIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                        </Button>

                          <Button
                            sx={{ textTransform: 'none' }}
                            onClick={toggleDisplayAttributes}
                          > 
                            Include attributes &nbsp;
                            {displayAttributes ? 
                                <CheckBoxIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                              :
                                <CheckBoxOutlineBlankIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                            }

                          </Button>
                        

                          <Button
                            sx={{ textTransform: 'none' }}
                            onClick={toggleDisplaySelector}
                          > 
                            Include CSS selector &nbsp;
                            {displaySelector ? 
                                <CheckBoxIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                              :
                                <CheckBoxOutlineBlankIcon  htmlColor="#fff" sx={{ fontSize: 20 }}/>
                            }

                          </Button>

                      </ButtonGroup>
                    </TabPanel>

                  </Grid>

                </Grid>

          </Grid>

          <WTConfirmationDialog isOpen={showExitDialog} title="You're about to exit the current scraping session" caption="Any changes made will be lost" onClose={onWTDialogClose} />
         
        </Box>	
    </PageTransition>
  );

};

