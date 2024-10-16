'use client';

import {Box, Button, Tooltip, Typography, useMediaQuery} from '@mui/material';

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import WTTextField from '@/app/components/WTTextField';
import { useTheme } from '@mui/material/styles';
import {useState} from 'react';

interface TreeSearchProps {
    searchElements: (querySelector: string) => void;
}

export default function TreeSearch({searchElements}: TreeSearchProps) {
    
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const [querySelector, setQuerySelector] = useState('');

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuerySelector(event.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          searchElements(querySelector);
        }
    };


    const [addOnSearch, setAddOnSearch] = useState(false);
    const handleAddSearchedElements = () => {
        setAddOnSearch(!addOnSearch);
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
                        onKeyDown={handleKeyDown}
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
                    onClick={() => searchElements(querySelector)}
                >
                    <SearchIcon  htmlColor="#fff" sx={{ fontSize: 30 }}/>
                </Button> 

            </Box>

            <Typography fontSize={13} mt={0.2} ml={0.3}>
                Use css selectors to search elements. e.g. #id, .class, tag and  "string content"
            </Typography>
        </>
    );

};

