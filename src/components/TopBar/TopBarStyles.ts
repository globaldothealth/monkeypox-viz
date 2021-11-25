import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { AppBar } from '@mui/material';


export const AppBarStyle = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
    a: {
        textDecoration: 'none'
    }
}));

export const NavBar = styled('nav')(({ theme }) => ({
    a: {
        textDecoration: 'none',
        color: theme.palette.background.paper,
        padding: '3.5ex 2ex 2.5ex',
        '&:hover, &.activated': {
            color: theme.primary.main,
        },
        '&.activated': {
            borderBottom: '4px solid #0094e2'
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