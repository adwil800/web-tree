import React, { useEffect, useRef, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import {ContentType, ScrapedData} from '../models';
import {extractAttributes} from '../commonFunctions';
import WTAlert from '../layout/WTAlert';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {Box, Button, IconButton} from '@mui/material';
import WTSplitButton from '../WTSplitButton';
import {ItemTransition} from '../Transitions';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import ButtonGroup from '@mui/material/ButtonGroup';

interface WTTableProps {
    scrapedData: ScrapedData | null;
    selectedIds: Set<string>;
    onClearContent: (itemIds: string[], contentType: ContentType) => void;
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

const headerSX = { backgroundColor: 'secondary.main', transition: 'background-color 0.2s ease', }

export default function WTTable({ scrapedData, selectedIds, onClearContent, onRemoveRow }: WTTableProps) {

    const [showAlert, setShowAlert] = useState(false);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(`document.querySelector('${text}')`);
        setShowAlert(true);
    }

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    const rowsCType = useRef<Record<string, ContentType>>({});

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
        let attributes: string[] = [];
        let selectorAttributes:string[] = [];

        if(displayAttributes) {
            attributes = extractAttributes(data.attributes || {}, false);
            selectorAttributes = extractAttributes(data.attributes || {});
        }

        if(displaySelector) {

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
                    <ItemTransition component='tr' delay={0} origin='left' >
                        <TableCell>{data.itemId}</TableCell>
                        
                        <TableCell component="th" scope="row">{data.tag}</TableCell>
                        { displaySelector && <TableCell sx={tableCellHoverSX} onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell> }
                        { displayAttributes && <TableCell>{ itemAttributes }</TableCell> }
                        <TableCell>{ contentType }</TableCell>
                        <TableCell >{ content() }</TableCell>
                        {/* sx={{ maxWidth: 1000 }} */}
                        <TableCell align="center"> 
                            <IconButton onClick={() => removeRow(data.itemId)}>
                                <RemoveCircleIcon htmlColor={'white'} />
                            </IconButton>
                        </TableCell>
                    </ItemTransition>
                </React.Fragment>
            );
        } 

        //When content is a string
        if (typeof data.content === 'string') {
            rowsCType.current[data.itemId] = 'string';
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

            rowsCType.current[data.itemId] = 'tag';
            return [genTableRow(contentDict, attributes)];
            
        } 

        //Append content type
        rowsCType.current[data.itemId] = 'empty';
        
        //When there's no content
        return [genTableRow({}, selectorAttributes)]

    }
    

    useEffect(() => {
        setFoundRows(prevFoundRows => {
            const foundElements: Record<string, React.ReactNode> = { ...prevFoundRows };
    
            for (const itemId of selectedIds) {
                // Verify if the item isn't already in the foundRows
                if (!foundElements[itemId]) {
                    const content = genRows(scrapedData, '', {}, { itemId, isFound: false });
                    if (content && content.length) {
                        foundElements[itemId] = content.filter(item => item !== undefined);
                    }
                }
            }
    
            // Only return a new object if changes are made to avoid unnecessary renders
            if (Object.keys(foundElements).length !== Object.keys(prevFoundRows).length) {
                return foundElements;
            }
            return prevFoundRows;
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIds]);


    const [foundRows, setFoundRows] = useState<Record<string, React.ReactNode>>({});

    const renderTableRows = () => {

        const rows = [];
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

        return rows;

    }

    const handleClearContent = (contentType: ContentType) => {
        
        if(!selectedIds.size || !scrapedData) return;

        const itemIdsToDelete: string[] = [];

        if(contentType !== 'table') {

            const foundRowsCopy = {...foundRows};

            for (const itemId of selectedIds) {
                if(rowsCType.current[itemId] === contentType) {
                    itemIdsToDelete.push(itemId);
                    delete foundRowsCopy[itemId];
                } 
            }

            setFoundRows(foundRowsCopy); 
            onClearContent(itemIdsToDelete, contentType);

            return;
        }

        // Clear foundRows
        setFoundRows({});
        onClearContent(itemIdsToDelete, contentType);

    }

    const removeRow = (itemId: string) => {
        
        setFoundRows((prevRows) => {
            const updatedRows = { ...prevRows };
            delete updatedRows[itemId];
            return updatedRows;
        });

        onRemoveRow(itemId);
    }










    // unchecked ************************************************************************************************


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
        setShowAlert(true);
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
        const domain = 'abc' //localUrl.match(/(?:https?:\/\/)?(?:www\.)?([^/]+)/);
        const docName = `${domain && domain.length ? domain[1] : 'webtree'}_data.csv`;
        a.setAttribute('href', url);
        a.setAttribute('download', docName);
        a.click();
    };

    useEffect(() => {
        handleClearContent('table');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displaySelector, displayAttributes]);

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

            <TableContainer component={Paper}  sx={{ maxHeight: '65vh', }} >
                <Table aria-label="WebScrape table" id="WTTable"  sx={{   backgroundColor: 'primary.main', ...cellTextSX, transition: 'background-color 0.2s ease' }}  stickyHeader  >

                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerSX}>ItemId</TableCell>
                            <TableCell sx={headerSX}>Tag</TableCell>
                            
                            { displaySelector && <TableCell sx={headerSX}>CSS Selector</TableCell> }
                            { displayAttributes && <TableCell sx={headerSX}>Attributes</TableCell> }
                            <TableCell sx={headerSX}>Content Type</TableCell>
                            <TableCell sx={headerSX}>Content</TableCell>
                            <TableCell sx={headerSX}>Remove row</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{maxHeight: 10}}> 
                        { renderTableRows() }
                    </TableBody>
                </Table>
            </TableContainer>
            <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'success'} message={'Copied to clipboard'} position={'top'} />


            <ButtonGroup sx={{ mt: 1 }} variant="contained" color="primary" aria-label="contained primary button group">

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

        </>
    );
}