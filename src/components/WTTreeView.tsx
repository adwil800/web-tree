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

interface CSSFilterItem { 
    tag: string; 
    combinatorSelector?: string; 
    id: string; 
    className: string; 
}


const mergeFilteredData = (filteredData: ScrapedData[]) => {
    for (let i = 0; i < filteredData.length; i++) {

        const currEl = filteredData[i];
        const futureEl = filteredData[i + 1];

        if(futureEl) {
            futureEl.content = [currEl];
        } else {
           return [currEl];
        }
        
    }
    return [];
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

    const [filteredScrapedData, setFilteredScrapedData] = useState<ScrapedData[]>([]);

    // html .products p

    useEffect(() => {

            // const query = querySelectorFilter.toLowerCase().replace(/\s*>\s*/g, ' > ');
            // IM HERE TESTING THE FILTERING, MAKE IT WORK WITH A BUTTON, and try to make it work, if anything then try to somehow 
            //TODO: Enable skipping items if > is included
            const query = 'html > body > section#section1.section111 > ul#ProductList.products > li.product.listItem'.toLowerCase().replace(/\s*>\s*/g, ' > ');

            // combinatorSelector: cs record: parentIndex: combinatorDepth (index)
            const csTracker: Record <number, { depth: number, skip: boolean, }> = {};

            //Extract tags, ids, classes from each part of the query
            const formattedFilter: CSSFilterItem[] = [];
            const splittedQuery = query.split(' ');

            for (let i = 0; i < splittedQuery.length; i++) {
                const part = splittedQuery[i];
                
                const combinatorSelector = part.match(/\s*>\s*/g) || []      // TODO: May be removed and tracking adjusted to csTracker to match the currentDepth in filterScrapedData      
                const tag = part.match(/^[a-z]+/gi) || [];
                const id = part.match(/#[a-z0-9-_]+/gi) || [];
                const className = part.match(/\.[a-z0-9-_]+/gi) || [];


                if(combinatorSelector.length > 0) {
                    csTracker[i-1] = { depth: i-1, skip: false, };
                } else {
                    const queryObj = { tag: tag.join(', '), id: id.join(', '),  className: className.join(', ')};
                    formattedFilter.push(queryObj);
                }

            }

            console.table(formattedFilter)
            console.table(csTracker)
            
            const filterScrapedData = (data: ScrapedData[], accumulatedData: ScrapedData[], currentDepth = 0): ScrapedData[] => {

                for (let i = 0; i < data.length; i++) {

                    const dataContent = data[i];
    
                    for (let j = 0; j < formattedFilter.length; j++) {
                        const { tag, id, className } = formattedFilter[j];

                    //    if(csTracker[currentDepth]?.skip) {
                    //         // If the element has been found, skip the rest of the iterations
                    //         continue;
                    //     }

                        const { tag: dataTag, attributes } = dataContent; 

                        // Format the required classes data
                        
                        const fAttrClasses = (attributes?.class?.toLowerCase().split(' ') || []);
                        const fFilterClasses = className.replace(/\./g, '').split(/\s*,\s*/g);
                        const classesMatch = fAttrClasses.every(element => fFilterClasses.includes(element));

                        // Filter by all the filters
                        const isAMatch = (tag === dataTag.toLowerCase() || !tag) &&
                                        (id.replace(/#/g, '') === (attributes?.id || '').toLowerCase() || !id) &&
                                        (classesMatch || !className);


                        if (isAMatch) {
                            console.log(dataContent.itemId) ALTERNATIVE: GET ALL ITEM IDS AND CREATE THE SCRAPED DATA BASED ON THEM INSTEAD OF HANDLING THX AMOUNT INTO THE ARRAY
                            accumulatedData.push(dataContent);

                            if(Array.isArray(dataContent.content)) {
                                return filterScrapedData(dataContent.content, accumulatedData, currentDepth + 1);
                            }

                        }

                        // if(csTracker[currentDepth]?.skip === false) {
                        //     // Check if theres a combinator selector for the previous element, if so, search for the current element only in this depth, skip the rest
                        //     // The element has been found and is to be skipped in the next iterations
                        //     csTracker[currentDepth].skip = true;
                        // } 
                        

                    }   
                    //TODO: enable this so that if the item isnt found it returns normally
                    // console.log("Upper: ", dataContent)
                    // if(Array.isArray(dataContent.content)) {
                    //     return filterScrapedData(dataContent.content, accumulatedData, currentDepth);
                    // }

                }
    
                return accumulatedData;

            }

            const fData = filterScrapedData([...scrapedData], []).reverse();

            const mergedFData = mergeFilteredData(fData)
            setFilteredScrapedData(mergedFData);

            console.log(mergedFData)
    }, [querySelectorFilter, scrapedData])

    return (
      
        <SimpleTreeView expandedItems={expandedItems}  >
            { renderScrapedJson(scrapedData) }
        </SimpleTreeView>
            
    );

};

