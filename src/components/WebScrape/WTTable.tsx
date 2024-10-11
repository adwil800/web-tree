import React, { useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import {contentType, ScrapedData} from '../models';
import {extractAttributes} from '../commonFunctions';
import WTAlert from '../layout/WTAlert';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {Box, IconButton} from '@mui/material';
import WTSplitButton from '../WTSplitButton';

interface WTTableProps {
    scrapedData: ScrapedData | null;
    selectedIds: Set<string>;
    displaySelectorAttributes: boolean;
    onClearContent: (itemIds: string[], contentType: contentType) => void;
    onRemoveRow: (itemId: string) => void;
}

const tableCellHoverSX = {
    transition: 'ease 0.2s',
    '&:hover': {
        backgroundColor: 'secondary.main',
        cursor: 'pointer'
    }
}

const cellTextSX = {
    '.MuiTableCell-root': {
        color: 'white'
    }
}

const headerSX = { backgroundColor: 'secondary.main', transition: 'background-color 0.2s ease' }

export default function WTTable({ scrapedData, selectedIds, displaySelectorAttributes, onClearContent, onRemoveRow }: WTTableProps) {

    const [showAlert, setShowAlert] = useState(false);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(`document.querySelector('${text}')`);
        setShowAlert(true);
    }

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    const genRows = (
        data: ScrapedData | null, 
        selector: string, 
        contentNth = {} as Record<string, {current: number, amount: number}>, 
        itemToFind: {itemId: string, isFound: boolean}
    ): React.ReactNode [] | undefined => {

        if(!data || itemToFind.isFound) return;

        if(data.itemId === itemToFind.itemId) {
            itemToFind.isFound = true;
        } 

        let currSelector = selector + data.tag;

        //Handle selector attributes including nth-child

        const attributes = extractAttributes(data.attributes || {}, false);
        const selectorAttributes = extractAttributes(data.attributes || {});

        if(displaySelectorAttributes) {

            currSelector += selectorAttributes.filter((attr) => attr.startsWith('#') || attr.startsWith('.')).join('');

            //Add nth-child if there are multiple tags of the same type
            if(contentNth[data.tag] && contentNth[data.tag].amount > 1) {
                currSelector += `:nth-child(${contentNth[data.tag].current})`; 

                //Increment the current nth-child
                contentNth[data.tag].current += 1;
            } 

        }
         
        //When the item hasn't been found, wait for the attributes to be extracted for the css selector, skip it and render its children
        if(data.itemId && !itemToFind.isFound) {
           
            if(Array.isArray(data.content)) {

                const contentDict: Record<string, number> = data.content.reduce((acc, item) => {
                    acc[item.tag] = (acc[item.tag] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                // Run through contentDict and create contentNth adding currentNth and the amount of tags
                Object.keys(contentDict).forEach((key) => {
                    contentNth[key] = { current: 1, amount: contentDict[key]};
                });

                return data.content.map((item) => genRows(item, `${currSelector} > `, contentNth, itemToFind)).flat();

            } 

            return;
        }


        const genTableRow = (contentDict: Record<string, number> = {}, attributes: string[]) => {

            const contentType = typeof data.content === 'string' ? 'String' : Array.isArray(data.content) ? 'Tag' : <CodeOffIcon className='mr-4'/>
            const itemAttributes = attributes.length ? attributes.join('') : <CodeOffIcon className='mr-4'/>;
            const content = () => {
                if(typeof data.content === 'string') return data.content;
                if(Object.keys(contentDict).length) {
                    return Object.entries(contentDict).map(([key, amount]) => (
                        <span key={key}>
                        {key} x{amount} <br />
                        </span>
                    ))
                };

                return <CodeOffIcon className='mr-4'/>;
            };

            return (
                <React.Fragment key={data.itemId}>
                    <TableRow>
                        <TableCell>{data.itemId}</TableCell>
                        
                        <TableCell component="th" scope="row">{data.tag}</TableCell>
                        <TableCell sx={tableCellHoverSX} onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
                        <TableCell align="right">{ itemAttributes } </TableCell>
                        <TableCell align="right">{ contentType }</TableCell>
                        <TableCell align="right">{ content() }</TableCell>
                        <TableCell align="center"> 
                            <IconButton onClick={() => onRemoveRow(data.itemId)}>
                                <RemoveCircleIcon htmlColor={'white'} />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </React.Fragment>
            );
        } 

        //When content is a string
        if (typeof data.content === 'string') {
           return [genTableRow({}, attributes)];
        } 

        //When content is an array
        if (Array.isArray(data.content)) {
         
            //Render only the id and class attributes
            const contentDict: Record<string, number> = data.content.reduce((acc, item) => {
                acc[item.tag] = (acc[item.tag] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            // Run through contentDict and create contentNth adding currentNth and the amount of tags
            Object.keys(contentDict).forEach((key) => {
                contentNth[key] = { current: 1, amount: contentDict[key]};
            });

            return [genTableRow(contentDict, attributes)];
            
        } 
        
        //When there's no content
        return [genTableRow({}, selectorAttributes)]

    }

    const handleClearContent = (contentType: contentType) => {
        
        if(!selectedIds.size || !scrapedData) return;

        const itemIds: string[] = [];

        if(contentType !== 'table') {

            const filterByContentType = (data: ScrapedData | null) => {

                if(!data) return;

                if(data.itemId && selectedIds.has(data.itemId) ) {
                    if(contentType === 'tag' && Array.isArray(data.content)) {
                        itemIds.push(data.itemId);
                    } else if(contentType === 'empty' && !data.content) {
                        itemIds.push(data.itemId);
                    } else if(contentType === 'string' && typeof data.content === 'string') {
                        itemIds.push(data.itemId);
                    }
                }

                data.content && Array.isArray(data.content) && data.content.map((item) => filterByContentType(item));
                
            }

            filterByContentType(scrapedData);

        }

        // Clear foundRows
        setFoundRows({});
        onClearContent(itemIds, contentType);

    }
    

    useEffect(() => {
    
        const foundElements: Record<string, React.ReactNode> = foundRows;

        for (const itemId of selectedIds) {
            // Verify if the item isn't already in the foundRows
            if(foundElements[itemId]) {
                console.log('skip', itemId);
                continue;
            };
            console.log('looking for ', itemId);

            const content = genRows(scrapedData, '', {}, {itemId, isFound: false});

            if(content && content.length) {
                const clearedContent = content.filter((item) => item !== undefined);

                foundElements[itemId] = clearedContent;
            }
        }

        console.log(foundElements)

        setFoundRows(foundElements);

    }, [selectedIds]);


    const [foundRows, setFoundRows] = useState<Record<string, React.ReactNode>>({});

    const renderTableRows = () => {

        const rows = [];
        IM HERE RENDERING ROWs, THERES A DELAY WITH THE FIRST CLIck, 
        ALSO HANDLE DELETING ROWS SINCE THE LOADER CHANGED
        for (const key in foundRows) {
            
            const rowContent = foundRows[key];

                // Check if rowContent is an array before spreading
                if (Array.isArray(rowContent)) {
                    rows.push(...rowContent);
                } else if (rowContent !== null && rowContent !== undefined) {
                    // If it's a single ReactNode, add it directly
                    rows.push(rowContent);
                }
        }

            console.log(rows)
            return rows;

    }

    return (
        <>

            <Box sx={{display: 'flex', mb: 4, alignItems: 'center' }}>
                <WTSplitButton 
                    options={[
                        {label: 'Clear table', action: () => handleClearContent('table')},
                        {label: 'Clear TAG content type', action: () => handleClearContent('tag')},
                        {label: 'Clear <\\> content type', action: () => handleClearContent('empty')},
                        {label: 'Clear STRING content type', action: () => handleClearContent('string')},
                    ]}
                />
            </Box>

            <TableContainer component={Paper}  sx={{ maxHeight: '65vh' }} >
                <Table aria-label="WebScrape table" id="WTTable"  sx={{   backgroundColor: 'primary.main', ...cellTextSX, transition: 'background-color 0.2s ease' }}  stickyHeader  >

                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerSX}>ItemId</TableCell>
                            <TableCell sx={headerSX}>Tag</TableCell>
                            <TableCell sx={headerSX}>CSS Selector</TableCell>
                            <TableCell sx={headerSX} align="right">Attributes</TableCell>
                            <TableCell sx={headerSX} align="right">Content Type</TableCell>
                            <TableCell sx={headerSX} align="right">Content</TableCell>
                            <TableCell sx={headerSX} align="right">Remove row</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{maxHeight: 10}}> 
                        { renderTableRows() }
                    </TableBody>
                </Table>
            </TableContainer>
            <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'success'} message={'Copied to clipboard'} />

        </>
    );
}