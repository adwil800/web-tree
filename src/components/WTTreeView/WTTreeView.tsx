import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {ScrapedData} from "../models";
import IconButton from '@mui/material/IconButton';
import { useState} from 'react';
import {extractAllIds, extractAttributes} from '../commonFunctions';
import {Box, Button, Tooltip} from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WTTextField from '../WTTextField';
import SearchIcon from '@mui/icons-material/Search';
import {extractIds, filterBySelector} from './functions';

interface WebScrapeProps {
    scrapedData: ScrapedData[];
    selectedIds: Set<string>;
    onClick: (itemId: string, selectionType: 'node' | 'tree') => void;
}
 
export default function WTTreeView ({scrapedData, selectedIds, onClick}: WebScrapeProps) {

    const [expandedItems, setExpandedItems] = useState<string[]>(extractAllIds(scrapedData));


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
                        label={selectionButtons(item.itemId, item.tag + attributes.join('') + ' - ' + item.itemId)}  
                        sx={{ backgroundColor: filteredItemIds.includes(item.itemId) ? 'secondary.main' : 'primary.main'}}
                    >
                        <TreeItem itemId={item.itemId + index} label={item.content} />
                        
                    </TreeItem>
                );
            }

            return (
                <TreeItem key={index} itemId={item.itemId} onClick={() => expandItem(item.itemId)}
                    label={selectionButtons(item.itemId, item.tag + attributes.join('') + ' - ' + item.itemId)} 
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

        } else {
            setNoFilterResults(true);
        }

       
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        searchElements();
      }
    };
  
    return (
        
        <>
            <Box className="flex">
                <WTTextField
                    label="Search elements"
                    variant="outlined"
                    autoComplete="off"
                    className="WT-text-field"
                    fullWidth
                    size="small"
                    helperText="Use css selectors to search elements in the tree view. Ex: #id, .class, tag, etc."
                    onChange={handleTextFieldChange}
                    onKeyDown={(e) => handleKeyDown(e)}
                    id="querySelector"
                />
                    
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

