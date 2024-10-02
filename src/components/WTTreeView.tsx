import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {ScrapedData} from "./models";
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from 'react';
import {extractAllIds, extractAttributes} from './commonFunctions';
import {Box, Tooltip} from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface WebScrapeProps {
    scrapedData: ScrapedData[];
    selectedIds: Set<string>;
    querySelectorFilter: string;
    onClick: (itemId: string, selectionType: 'node' | 'tree') => void;
}
 
export default function WTTreeView ({scrapedData, selectedIds, querySelectorFilter, onClick}: WebScrapeProps) {

    const [expandedItems, setExpandedItems] =  useState<string[]>(extractAllIds(scrapedData));


    const expandItem = (itemId: string) => {
        console.log(itemId)

        setExpandedItems((prevExpandedItems) =>
            prevExpandedItems.includes(itemId)
              ? prevExpandedItems.filter((item) => item !== itemId) 
              : [...prevExpandedItems, itemId]
          );

    }

    const selectionButtons = (itemId: string, content: string) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {content} 

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
                    >
                        <TreeItem itemId={item.itemId + index} label={item.content} />
                        
                    </TreeItem>
                );
            }

            return (
                <TreeItem key={index} itemId={item.itemId} label={selectionButtons(item.itemId, item.tag + attributes.join(''))} onClick={() => expandItem(item.itemId)}>
                    { item.content && renderScrapedJson(item.content) }
                </TreeItem>
            );
        }
        );
    }


    useEffect(() => {
        console.log(querySelectorFilter)

        // Decompose the querySelectorFilter into #id, .class, tag
        // and filter the tree view based on the querySelectorFilter
        IM HERE FILTER THE TREE BY QUERY SELECTOR FILTER : EXAMPLE
        const [tag, id, className] = querySelectorFilter
        console.log({tag, id, className})

    }, [querySelectorFilter])

    return (
      
        <SimpleTreeView expandedItems={expandedItems}  >
            { renderScrapedJson(scrapedData) }
        </SimpleTreeView>
            
    );

};

