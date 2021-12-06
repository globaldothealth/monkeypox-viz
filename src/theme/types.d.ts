import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
    interface Theme {
        primary: {
            main: string;
            contrastText: string;
        };
        navbarLinks: {
            default: string;
            paper: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        primary: {
            main: string;
            contrastText: string;
        };
        navbarLinks: {
            default: string;
            paper: string;
        };
    }

    interface Palette {
        dark: Palette['primary'];
    }
    interface PaletteOptions {
        dark: PaletteOptions['primary'];
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
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // extends React's HTMLAttributes
        country?: string;
    }
}
