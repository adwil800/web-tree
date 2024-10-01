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
}

export default function WTTable({ selectedData }: WTTableProps) {

    const genRows = (data: ScrapedData): React.ReactNode => {

        if( !data ) return;

        //When content is a string
        if (typeof data.content === 'string') {
            
            const attributes = extractAttributes(data.attributes || {}, false);
            return (
                <TableRow key={data.itemId}>
                    <TableCell component="th" scope="row">{data.tag}</TableCell>
                    <TableCell>Le parent</TableCell>
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
            
            const attributes = extractAttributes(data.attributes || {}, false);

            const contentDict: Record<string, number> = data.content.reduce((acc, item) => {
                acc[item.tag] = (acc[item.tag] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

            return (
                <React.Fragment key={data.itemId}>
                    <TableRow >
                        <TableCell component="th" scope="row">{data.tag}</TableCell>
                        <TableCell>Le parent</TableCell>
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
                    {data.content.map((item) => genRows(item))}
                </React.Fragment>
            );
            
        } 

        //When there's no content
        const attributes = extractAttributes(data.attributes || {});
        return (
            <TableRow key={data.itemId}>
                <TableCell component="th" scope="row">{data.tag}</TableCell>
                <TableCell>Le parent</TableCell>
                <TableCell align="right" >
                    {attributes.length ? attributes.join('') : <CodeOffIcon className='mr-4'/>}
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
                        <TableCell>Tag</TableCell>
                        <TableCell>Parent Tag or index?</TableCell>
                        <TableCell align="right">Attributes</TableCell>
                        <TableCell align="right">Content Type</TableCell>
                        <TableCell align="right">Content</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody> 
                    { genRows(selectedData) }
                </TableBody>
            </Table>
        </TableContainer>
    );
}