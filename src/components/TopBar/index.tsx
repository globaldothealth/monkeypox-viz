import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import GHListLogo from 'components/GHListLogo';
import Typography from '@mui/material/Typography';
import { AppBarStyle, NavBar, StyledTooolbar } from './styled';

const TopBar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBarStyle position="static" className="navbar">
                <StyledTooolbar variant="regular" className="toolbar">
                    <GHListLogo />
                    <NavBar>
                        <NavLink
                            to="/country"
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' activated' : '')
                            }
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Country view
                            </Typography>
                        </NavLink>
                        <NavLink
                            to="/region"
                            className={({ isActive }) =>
                                'nav-link regionalViewNavButton' +
                                (isActive ? ' activated' : '')
                            }
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Regional view
                            </Typography>
                        </NavLink>
                        <NavLink
                            to="/coverage"
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' activated' : '')
                            }
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Coverage
                            </Typography>
                        </NavLink>
                        <NavLink
                            to="/variant-reporting"
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' activated' : '')
                            }
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Variant Reporting
                            </Typography>
                        </NavLink>
                        <a
                            href={process.env.REACT_APP_DATA_PORTAL_URL || ''}
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
