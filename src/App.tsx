import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme } from '@mui/material';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import GHListLogo from './components/GHListLogo';
import TopBar from './components/TopBar';

declare module '@mui/material/styles' {
    interface Theme {
        Typography: {
            palette: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        custom?: any;
    }

    interface TypographyVariants {
        poster: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        poster?: React.CSSProperties;
    }
}
// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        poster: true;
    }
}
export const theme = createTheme({
    typography: {
        fontFamily: 'Mabry Pro, sans-serif',
        poster: {
            color: 'red',
        },
    },
    // palette: {
    //     background: {
    //         default: '#ecf3f0',
    //         paper: '#fff',
    //     },
    //     primary: {
    //         main: '#0E7569',
    //         contrastText: '#fff',
    //     },
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

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar variant="dense">
                            <GHListLogo />
                            <TopBar />
                        </Toolbar>
                    </AppBar>
                </Box>
                <p>it is working</p>
            </div>
        </ThemeProvider>
    );
};

export default App;
