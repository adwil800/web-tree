import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import {ScrapedData} from './models';
import {extractAttributes} from './commonFunctions';
import WTAlert from './WTAlert';

interface WTTableProps {
    selectedData: ScrapedData;
    displaySelectorAttributes: boolean;
}

const headerSX = { backgroundColor: 'secondary.main', transition: 'background-color 0.2s ease' }

export default function WTTable({ selectedData, displaySelectorAttributes }: WTTableProps) {

    const [showAlert, setShowAlert] = React.useState(false);

    const tableCellHover = {
        transition: 'ease 0.2s',
        '&:hover': {
            backgroundColor: 'secondary.main',
            cursor: 'pointer'
        }
    }

    const cellText = {
        '.MuiTableCell-root': {
            color: 'common.white'
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(`document.querySelector('${text}')`);
        setShowAlert(true);
    }

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    const genRows = (data: ScrapedData, selector: string, contentNth = {} as Record<string, {current: number, amount: number}>): React.ReactNode => {

        if( !data ) return;

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

        //When content is a string
        if (typeof data.content === 'string') {
            
            return (
                <TableRow key={data.itemId}>
                    <TableCell>{data.itemId}</TableCell>
                    <TableCell component="th" scope="row">{data.tag}</TableCell>
                    <TableCell sx={tableCellHover} onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
                    <TableCell align="right" >
                        {attributes.length ? attributes.join('') : <CodeOffIcon className='mr-4'/>}
                    </TableCell>
                    <TableCell align="right">String</TableCell>
                    <TableCell align="right">{data.content}</TableCell>
                </TableRow>
            )

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

            return (
                <React.Fragment key={data.itemId}>
                    <TableRow >
                        <TableCell>{data.itemId}</TableCell>
                        <TableCell component="th" scope="row">{data.tag}</TableCell>
                        <TableCell sx={tableCellHover} onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
                        <TableCell align="right" >
                            {attributes.length ? attributes.join('') : <CodeOffIcon className='mr-4'/>}
                        </TableCell>
                        <TableCell align="right">{Object.keys(contentDict).length ? 'Tag' : <CodeOffIcon className='mr-4'/>}</TableCell>
                        <TableCell align="right">
                            { 
                                Object.keys(contentDict).length ?  

                                    <>
                                        {Object.entries(contentDict).map(([key, amount]) => (
                                            <span key={key}>
                                            {key} x{amount} <br />
                                            </span>
                                        ))}
                                    </>
                                
                                : <CodeOffIcon className='mr-4'/>
                            }
                        </TableCell>
                    </TableRow>
                    {data.content.map((item) => genRows(item,  `${currSelector} > `, contentNth))}
                </React.Fragment>
            );
            
        } 

        //When there's no content
        return (
            <TableRow key={data.itemId}>
                <TableCell>{data.itemId}</TableCell>
                <TableCell component="th" scope="row">{data.tag}</TableCell>
                <TableCell sx={tableCellHover} onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
                <TableCell align="right" >
                    {selectorAttributes.length ? selectorAttributes.join('') : <CodeOffIcon className='mr-4'/>}
                </TableCell>
                <TableCell align="right"><CodeOffIcon className='mr-4'/></TableCell>
                <TableCell align="right"><CodeOffIcon className='mr-4'/></TableCell>
            </TableRow>
        );

    }


    return (
        <>
            <TableContainer component={Paper}   sx={{ maxHeight: '70vh' }} >
                <Table aria-label="WebScrape table" id="WTTable"  sx={{ backgroundColor: 'primary.main', ...cellText, transition: 'background-color 0.2s ease' }}  stickyHeader  >

                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerSX}>ItemId</TableCell>
                            <TableCell sx={headerSX}>Tag</TableCell>
                            <TableCell sx={headerSX}>CSS Selector</TableCell>
                            <TableCell sx={headerSX} align="right">Attributes</TableCell>
                            <TableCell sx={headerSX} align="right">Content Type</TableCell>
                            <TableCell sx={headerSX} align="right">Content</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody> 
                        { genRows(selectedData, '') }
                    </TableBody>
                </Table>
            </TableContainer>
           <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} message={'Copied to clipboard'} />
        </>
    );
}