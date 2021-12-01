import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { AppBar } from '@mui/material';

export const AppBarStyle = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    backgroundColor: theme.navbarLinks.default,
    boxShadow: 'none',
    zIndex: 999,
    a: {
        textDecoration: 'none',
    },
}));

export const NavBar = styled('nav')(({ theme }) => ({
    a: {
        textDecoration: 'none',
        color: theme.navbarLinks.paper,
        padding: '3.5ex 2ex 2.5ex',
        '&:hover, &.activated': {
            color: theme.primary.main,
        },
        '&.activated': {
            borderBottom: '4px solid #0094e2',
        },
    },
}));

export const StyledTooolbar = styled(Toolbar)`
    display: flex;
    justify-content: space-between;

    & nav {
        display: flex;
        justify-content: space-between;
    }
`;
