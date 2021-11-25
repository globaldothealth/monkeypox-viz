import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme } from '@mui/material';
import TopBar from './components/TopBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CountryView } from './components/CountryView/CountryView';
import { RegionalView } from './components/RegionalView/RegionalView';
import { CoverageView } from './components/CoverageView/CoverageView';

declare module '@mui/material/styles' {
    interface Theme {
        // Typography: {
        //     palette: string;
        // };
        primary: {
            main: string;
        }
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        primary?: any;
    }

    interface TypographyVariants {
        navbarlink: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        navbarlink?: React.CSSProperties;
    }
}
// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        navbarlink: true;
    }
}
export const theme = createTheme({
    typography: {
        fontFamily: 'Mabry Pro, sans-serif',
        navbarlink: {
            fontWeight: 500,
            textShadow:
                '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            margin: 0,
            padding: '3.5ex 2ex 2.5ex',
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

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <TopBar />
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate replace to="/country" />}
                    />
                    <Route path="/country" element={<CountryView />} />
                    <Route path="/region" element={<RegionalView />} />
                    <Route path="/coverage" element={<CoverageView />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
};

export default App;
