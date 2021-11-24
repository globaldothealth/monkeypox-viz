import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme } from '@mui/material';
import TopBar from './components/TopBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CountryView } from './components/CountryView/CountryView';
import { RegionalView } from './components/RegionalView/RegionalView';
import { CoverageView } from './components/CoverageView/CoverageView';

declare module '@mui/material/styles' {
    // interface Theme {
    //     Typography: {
    //         palette: string;
    //     };
    // }

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
    palette: {
        background: {
            default: '#edf3f1',
            paper: '#333',
        },
    }
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
