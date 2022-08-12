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
                                Country View
                            </Typography>
                        </NavLink>
                        <NavLink
                            to="/chart"
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' activated' : '')
                            }
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Chart View
                            </Typography>
                        </NavLink>
                        <a
                            href="https://github.com/globaldothealth/monkeypox"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Monkeypox Dataset
                            </Typography>
                        </a>

                        <a href="mailto:info@global.health?subject=Feedback regarding Global.health map">
                            <Typography variant="navbarlink" gutterBottom>
                                Feedback
                            </Typography>
                        </a>
                        <a
                            href="https://www.monkeypox.global.health"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Typography variant="navbarlink" gutterBottom>
                                Briefing Report
                            </Typography>
                        </a>
                    </NavBar>
                </StyledTooolbar>
            </AppBarStyle>
        </Box>
    );
};
export default TopBar;
