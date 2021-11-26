import ThemeProvider from '@mui/material/styles/ThemeProvider';
import TopBar from '../TopBar/TopBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CountryView } from '../CountryView/CountryView';
import { RegionalView } from '../RegionalView/RegionalView';
import { CoverageView } from '../CoverageView/CoverageView';
import { theme } from './AppTheme';
import SideBar from '../SideBar/SideBar';
declare module '@mui/material/styles' {
    interface Theme {
        // Typography: {
        //     palette: string;
        // };
        primary: {
            main: string;
        };
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

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <TopBar />
                <SideBar />
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
