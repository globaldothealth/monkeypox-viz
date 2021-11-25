import { createTheme } from '@mui/material';

export const theme = createTheme({
    typography: {
        fontFamily: 'Mabry Pro, sans-serif',
        navbarlink: {
            fontWeight: 500,
            fontSize: '17px',
            textShadow:
                '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            margin: 0,
            padding: '3.5ex 1ex 2.5ex',
            cursor: 'pointer',
            textDecoration: 'none',
        },
    },
    palette: {
        background: {
            default: '#edf3f1',
            paper: '#333',
        },
    },
        primary: {
            main: '#0094e2',
            contrastText: '#fff',
        },
    //     secondary: {
    //         main: '#00C6AF',
    //         contrastText: '#fff',
    //     },
    //     error: {
    //         main: '#FD685B',
    //         contrastText: '#454545',
    //     },
    // },
    // shape: {
    //     borderRadius: 4,
    // },
    // custom: {
    //     palette: {
    //         button: {
    //             buttonCaption: '#ECF3F0',
    //             customizeButtonColor: '#ECF3F0',
    //         },
    //         tooltip: {
    //             backgroundColor: '#FEEFC3',
    //             textColor: 'rgba(0, 0, 0, 0.87)',
    //         },
    //         appBar: {
    //             backgroundColor: '#31A497',
    //         },
    //         landingPage: {
    //             descriptionTextColor: '#838D89',
    //         },
    //     },
    // },
});