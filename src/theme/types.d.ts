import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
    interface Theme {
        primary: {
            main: string;
            contrastText: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        primary: {
            main: string;
            contrastText: string;
        };
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
