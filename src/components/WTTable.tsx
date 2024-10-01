import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {ScrapedData} from './models';
import {extractAttributes} from './commonFunctions';
import CodeOffIcon from '@mui/icons-material/CodeOff';

interface WTTableProps {
    selectedData: ScrapedData;
    displaySelectorAttributes: boolean;
}

export default function WTTable({ selectedData, displaySelectorAttributes }: WTTableProps) {

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        IM HERE TRIGGER ALERT ON COPY
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
                    <TableCell className="clickable-tablecell" onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
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
                        <TableCell className="clickable-tablecell" onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
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
                <TableCell className="clickable-tablecell" onClick={() => copyToClipboard(currSelector)}>{currSelector}</TableCell>
                <TableCell align="right" >
                    {selectorAttributes.length ? selectorAttributes.join('') : <CodeOffIcon className='mr-4'/>}
                </TableCell>
                <TableCell align="right"><CodeOffIcon className='mr-4'/></TableCell>
                <TableCell align="right"><CodeOffIcon className='mr-4'/></TableCell>
            </TableRow>
        );

    }

    return (
        <TableContainer component={Paper} >
            <Table aria-label="WebScrape table">

                <TableHead>
                    <TableRow>
                        <TableCell>ItemId</TableCell>
                        <TableCell>Tag</TableCell>
                        <TableCell>CSS Selector</TableCell>
                        <TableCell align="right">Attributes</TableCell>
                        <TableCell align="right">Content Type</TableCell>
                        <TableCell align="right">Content</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody> 
                    { genRows(selectedData, '') }
                </TableBody>
            </Table>
        </TableContainer>
    );
}