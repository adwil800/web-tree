'use client'

import {Box,  Tab, Tabs, useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Grid2";
import WTTable from "../components/WebScrape/WTTable";
import {useState} from "react";
import {ContentType} from "../components/models";
import {PageTransition} from "../components/Transitions";
import WTTreeView from "../components/WebScrape/WTTreeView/WTTreeView";
import {extractAllIds} from "../components/commonFunctions";
import { useTheme } from '@mui/material/styles';
import WTAlert from "../components/layout/WTAlert";
import {TabPanel} from "../components/WebScrape/TabPanel";
import {ScrapeWebsite} from "../api/scrape/controller";
import WebSearchSection from "./components/WebSearchSection";

interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}

export default function ScrapeLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);

    const getScrapedData = async (url: string) => {

        if(!url) {
        setScrapedData([{itemId: '-1', tag: 'No results'}]); 
        return;
        }

        setScrapedData(await ScrapeWebsite('/scrape', {url}));

    }
    
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

    

    const [showAlert, setShowAlert] = useState(false);

    const onCloseAlert = () => {
        setShowAlert(false);
    }


    // App interaction functions

    const onTreeAddOnSearch = (itemIds: string[]) => {
        setSelectedIds((prevSelectedIds) => {
        return new Set([...prevSelectedIds, ...itemIds]);
        });
    }


    //Tabs

    const [value, setValue] = useState(0);
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <PageTransition transitionKey="WebScrape">
            <Box mb={2}>
            
                <Grid container spacing={2} size={12} justifyContent="center">

                    <Grid size={{ xs: 11, md: 9 }} >

                        <WebSearchSection getScrapedData={getScrapedData} />
                        
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
                            <WTTreeView scrapedData={scrapedData} selectedIds={selectedIds} onClick={handleTreeClick} onAddOnSearch={onTreeAddOnSearch} />
                        </TabPanel>
                        
                    </Grid>

                    <Grid size={{ xs: 11, md: 7 }}  >

                        <TabPanel value={isSmDown ? value : 1} index={1}>
                        <WTTable scrapedData={scrapedData[0]} selectedIds={selectedIds} onRemoveRow={removeSelectedItem} onClearContent={clearTableContent} />
                        </TabPanel>

                    </Grid>

                </Grid>
                {children}
                <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'error'} message={'No data to export'} position={'top'} />
            </Box>	
        </PageTransition>
    );
}
