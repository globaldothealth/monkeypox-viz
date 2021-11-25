import { AppBar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import GHListLogo from './GHListLogo';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const AppBarStyle = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const NavBar = styled('nav')(({ theme }) => ({
    a: {
        textDecoration: 'none',
        color: theme.palette.background.paper,
        '&:hover': {
            color: theme.primary.main,
        },
    },
}));

const StyledTooolbar = styled(Toolbar)`
    display: flex;
    justify-content: space-between;

    & nav {
        display: flex;
        justify-content: space-between;
        gap: 25px;
    }
`;

const TopBar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBarStyle position="static">
                <StyledTooolbar variant="regular" className="toolbar">
                    <GHListLogo />
                    <NavBar>
                        <NavLink to="/country" activeClassName="selected">
                            <Typography variant="navbarlink" gutterBottom>
                                Country view
                            </Typography>
                        </NavLink>
                        <NavLink to="/region" activeClassName="selected">
                            <Typography variant="navbarlink" gutterBottom>
                                Regional view
                            </Typography>
                        </NavLink>
                        <NavLink to="/coverage" activeClassName="selected">
                            <Typography variant="navbarlink" gutterBottom>
                                Coverage
                            </Typography>
                        </NavLink>
                        <a
                            href="https://data.covid-19.global.health/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                G.h Data
                            </Typography>
                        </a>
                    </NavBar>
                </StyledTooolbar>
            </AppBarStyle>
        </Box>
    );
};
export default TopBar;
