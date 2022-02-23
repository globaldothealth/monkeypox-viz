import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    Typography,
} from '@mui/material';

const PopupSmallScreens = () => {
    const theme = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
    @name matches - value of the current browser window in pixels
     **/

    const matches = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        setDialogOpen(matches);
    }, [matches]);

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <Dialog
            open={dialogOpen}
            onClose={handleClose}
            sx={{ height: '40%' }}
            className="popup-small-screens"
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                }}
            >
                Important
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                    className="small-screens-popup-close-btn"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    For a better experience please visit this website using a
                    device with a larger screen
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default PopupSmallScreens;
