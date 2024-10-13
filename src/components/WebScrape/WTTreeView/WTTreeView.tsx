import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import IconButton from '@mui/material/IconButton';
import { useState} from 'react';
import {Box, Button, Tooltip, Typography, useMediaQuery} from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import {extractIds, filterBySelector} from './functions';
import {ScrapedData} from '../../models';
import {extractAttributes} from '../../commonFunctions';
import WTTextField from '../../WTTextField';
import { useTheme } from '@mui/material/styles';

interface WebScrapeProps {
    scrapedData: ScrapedData[];
    selectedIds: Set<string>;
    onClick: (itemId: string, selectionType: 'node' | 'tree') => void;
    onAddOnSearch: (itemIds: string[]) => void;
}
 
export default function WTTreeView ({scrapedData, selectedIds, onClick, onAddOnSearch}: WebScrapeProps) {

    const [expandedItems, setExpandedItems] = useState<string[]>(scrapedData && scrapedData.length ? [scrapedData[0].itemId] : []);


    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    
    const expandItem = (itemId: string) => {

        setExpandedItems((prevExpandedItems) =>
            prevExpandedItems.includes(itemId)
              ? prevExpandedItems.filter((item) => item !== itemId) 
              : [...prevExpandedItems, itemId]
          );

    }

    const selectionButtons = (itemId: string, content: string) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {content} 
            { itemId.trim() !== '-1' && 
                <Box sx={{ display: 'flex'}}>
                    <Tooltip title="Add node" PopperProps={{placement:'left'}}>
                        <IconButton onClick={(e) => { e.stopPropagation(); onClick(itemId, 'node'); }}>

                            {selectedIds.has(itemId) ? 
                                <CheckCircleIcon htmlColor={'white'} />
                                :
                                <CircleIcon htmlColor={'white'} />
                            }
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Add tree" PopperProps={{placement:'right'}}>
                        <IconButton onClick={(e) => { e.stopPropagation(); onClick(itemId, 'tree'); }}>
                            <DeviceHubIcon htmlColor={'white'} sx={{ fontSize: 30 }}/>
                        </IconButton>
                    </Tooltip>
                </Box>
            }
        </div>
    )

    const renderScrapedJson = (data: ScrapedData[]) => {
        return data.map((item, index) => {

            const attributes = extractAttributes(item.attributes || {});

            //Filter by textContent
            if (typeof item.content === 'string') {
                return (
                    <TreeItem key={index} itemId={item.itemId}  onClick={() => expandItem(item.itemId)}
                        label={selectionButtons(item.itemId, item.tag + attributes.join(''))}  
                        sx={{ backgroundColor: filteredItemIds.includes(item.itemId) ? 'secondary.main' : 'primary.main'}}
                    >
                        <TreeItem itemId={item.itemId + index} label={item.content} />
                        
                    </TreeItem>
                );
            }

            return (
                <TreeItem key={index} itemId={item.itemId} onClick={() => expandItem(item.itemId)}
                    label={selectionButtons(item.itemId, item.tag + attributes.join(''))} 
                    sx={{ backgroundColor: filteredItemIds.includes(item.itemId) ? 'secondary.main' : 'primary.main'}}
                >
                    { item.content && renderScrapedJson(item.content) }
                </TreeItem>
            );
        }
        );
    }


    // Filter the tree
    const [querySelector, setQuerySelector] = useState('');
    const [filteredItemIds, setFilteredItemIds] = useState<string[]>([]);
    const [noFilterResults, setNoFilterResults] = useState<boolean>(false);
    const noResultsTemplate =  [{ tag: 'No results', itemId: '-1', }];

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuerySelector(event.target.value);
    }

    const [cachedResults, setCachedResults] = useState<{ querySelector: string, filteredResults: { path: string[], itemId: string }[] } | null>(null);

    // Sample query:  
    /*
        body p"laptop": Finds all p tags with the text "laptop" in the body
        body p "laptop": Finds all the children of p tags with the text "laptop" in the body
        p: Finds all p tags
        body#section: Finds the body tag with the id "section"
        body.section: Finds the body tag with the class "section"
        body #section: Finds all the children of the body tag with the id "section"
        body .section: Finds all the children of the body tag with the class "section"
        body p: Finds all p tags that are children of the body tag
        body #section.section1: Finds the children of the body tag with the id "section" and class "section1"
        body p.product: Finds all p tags with the class "laptop" that are children of the body tag
    */
    const searchElements = () => {
        
        if(!querySelector) {
            setNoFilterResults(false);
            setFilteredItemIds([]);
            return;
        };
        
        
        // Check if the current query matches the last one
        if (cachedResults && cachedResults?.querySelector === querySelector) {
            // Use cached results
            if (cachedResults?.filteredResults && cachedResults?.filteredResults.length) {
                const [pathIds, itemIds] = extractIds(cachedResults?.filteredResults);

                setExpandedItems(pathIds);
                setFilteredItemIds(itemIds);
                setNoFilterResults(false);

                if(addOnSearch) {
                    onAddOnSearch(itemIds);
                }
                
            } else {
                setNoFilterResults(true);
            }
            return;
        }
        
        const filteredResults = filterBySelector(scrapedData, querySelector.trim().toLowerCase());

        setCachedResults({querySelector, filteredResults});

        if (filteredResults.length) {
            const [pathIds, itemIds] = extractIds(filteredResults);

            setExpandedItems(pathIds);
            setFilteredItemIds(itemIds);
            setNoFilterResults(false);

            if(addOnSearch) {
                onAddOnSearch(itemIds);
            }

        } else {
            setNoFilterResults(true);
        }

       
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        searchElements();
      }
    };


    const [addOnSearch, setAddOnSearch] = useState(false);
    const handleAddSearchedElements = () => {
        setAddOnSearch(!addOnSearch);
        console.log('onclick')
    }
  
    const iconProps = {
        htmlColor: addOnSearch ? 'white' : 'info'
    };

    return (
        
        <>
            <Box className="flex">
                <Tooltip title={`Example query: body p "laptop"`} enterDelay={1000} PopperProps={{placement:'top'}}>
                    <WTTextField
                        label="Search elements"
                        variant="outlined"
                        autoComplete="off"
                        className="WT-text-field"
                        fullWidth
                        size="small"
                        onChange={handleTextFieldChange}
                        onKeyDown={(e) => handleKeyDown(e)}
                        id="querySelector"
                    />
                </Tooltip>
                    
                <Tooltip title={"Select items on search"} sx={{fontSize: 14}} PopperProps={{placement:'top'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: '10px', height: '40px'}}
                        size="small"
                        onClick={handleAddSearchedElements}
                    >
                        <Box sx={{ display: 'flex', pl: 2, pr: 2}}>
                            <AccountTreeOutlinedIcon {...iconProps} sx={{ fontSize: isSmDown ? 25 : 30 }} />
                            <ArrowRightAltIcon {...iconProps} sx={{ fontSize: isSmDown ? 25 : 30 }} />
                            <BackupTableIcon {...iconProps} sx={{ fontSize: isSmDown ? 25 : 30 }} />
                        </Box>
                    </Button>
                </Tooltip>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ ml: '10px', height: '40px'}}
                    size="small"
                    onClick={searchElements}
                >
                    <SearchIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                </Button> 
            </Box>

            <Typography fontSize={13} mt={0.2} ml={0.3}>
                Use css selectors to search elements. Ex: #id, .class, tag and  "string content"
            </Typography>
                
            <Box 
                sx={{ 
                backgroundColor: 'primary.main', transition: 'background-color 0.2s ease',
                }} 
                color={'white'} p={3} borderRadius={2} mt={1} maxHeight={'67vh'} overflow={'auto'}
            >
                <SimpleTreeView expandedItems={expandedItems}  >
                    { renderScrapedJson(noFilterResults ? noResultsTemplate : scrapedData) }
                </SimpleTreeView>
            </Box>
        </>
            
    );

};

