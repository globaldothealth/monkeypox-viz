import { styled } from '@mui/material/styles';
import { Fab } from '@mui/material';

export const CopyStateLinkButtonContainer = styled(Fab)(({ theme }) => ({
    position: 'absolute',
    bottom: '0',
    right: '0',
    padding: '1rem',
    marginBottom: '3.75rem',
    marginRight: '6vw',
    width: '25ch',
    [theme.breakpoints.down('xl')]: {
        width: '21.5ch',
    },
    [theme.breakpoints.down('lg')]: {
        width: '18ch',
        fontSize: '1.25rem',
        fontWeight: 700,
        padding: '2.5rem',
    },
    [theme.breakpoints.down('md')]: {
        width: '15ch',
        fontSize: '1rem',
        fontWeight: 900,
        padding: '3.5rem',
    },
}));
