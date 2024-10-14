import {Box, Button, Dialog, DialogTitle, Typography} from "@mui/material";

interface WTConfirmationDialogProps {
    isOpen: boolean;
    onClose: (response: 'yes' | 'no') => void;
    title: string;
    caption: string;

}

export default function WTConfirmationDialog ({ isOpen, title, caption, onClose }: WTConfirmationDialogProps) {

    const closeDialog = (response: 'yes' | 'no') => {
        onClose(response);
    }
    
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="simple-dialog"
            aria-describedby="simple-dialog"
            sx={{ 

                '& .MuiDialog-paper': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }
                
             }}
        >

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', justifyContent: 'center', maxWidth: '90vw', p: 2, borderRadius: 2, backgroundColor: 'secondary.main' }}  >
                
                <DialogTitle>{title}</DialogTitle>

                <Typography pb={3}>
                    {caption}
                </Typography>


                <Box sx={{ display: 'flex'}}>

                    <Button
                        variant="contained"
                        color="error"
                        sx={{ ml: '10px' }}
                        onClick={() => closeDialog('yes')}
                    >   
                        Continue
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: '10px' }}
                        onClick={() => closeDialog('no')}
                    >
                        Cancel 
                    </Button>
                    
                </Box>

            </Box>

                
        </Dialog>
    );

}