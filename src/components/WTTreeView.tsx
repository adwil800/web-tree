import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {ScrapedData} from "./models";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import {useState} from 'react';
import {extractAttributes} from './commonFunctions';

interface WebScrapeProps {
    scrapedData: ScrapedData[];
    onClick: (item: ScrapedData) => void;
}

const extractAllIds = (data: ScrapedData[]) => {
    return data.reduce((acc, item) => {
        acc.push(item.itemId);
        if (item.content && Array.isArray(item.content)) {
            acc.push(...extractAllIds(item.content));
        }
        return acc;
    }, [] as string[]);
}

 

export default function WTTreeView ({scrapedData, onClick}: WebScrapeProps) {

    const [expandedItems, setExpandedItems] =  useState<string[]>(extractAllIds(scrapedData));


    const expandItem = (itemId: string) => {
        console.log(itemId)

        setExpandedItems((prevExpandedItems) =>
            prevExpandedItems.includes(itemId)
              ? prevExpandedItems.filter((item) => item !== itemId) 
              : [...prevExpandedItems, itemId]
          );

    }


    const renderScrapedJson = (data: ScrapedData[]) => {
        return data.map((item, index) => {

            const attributes = extractAttributes(item.attributes || {});

            //Filter by textContent
            if (typeof item.content === 'string') {
                return (
                    <TreeItem key={index} itemId={item.itemId}  onClick={() => expandItem(item.itemId)}
                        label={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {item.tag + attributes.join('')} 
                            <IconButton onClick={(e) => { e.stopPropagation(); onClick(item); }}>
                                <AddCircleIcon htmlColor='white'/>
                            </IconButton>
                        </div>
                        }  
                    >
                        <TreeItem itemId={item.itemId + index} label={item.content} />
                        
                    </TreeItem>
                );
            }

            return (
                <TreeItem key={index} itemId={item.itemId} label={item.tag + attributes.join('')} onClick={() => expandItem(item.itemId)}>
                    { item.content && renderScrapedJson(item.content) }
                </TreeItem>
            );
        }
        );
    }

    return (
      
        <SimpleTreeView expandedItems={expandedItems}  >
            { renderScrapedJson(scrapedData) }
        </SimpleTreeView>
            
    );

};

