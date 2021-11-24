import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import GHListLogo from './GHListLogo';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const TopBarContainerStyle = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
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
        <TopBarContainerStyle>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <StyledTooolbar variant="regular" className="toolbar">
                        <GHListLogo />
                        <nav>
                            <Link to="/country">
                                <Typography variant="poster" gutterBottom>
                                    Country view
                                </Typography>
                            </Link>
                            <Link to="/region">
                                <Typography variant="body1" gutterBottom>
                                    Regional view
                                </Typography>
                            </Link>
                            <Link to="/coverage">
                                <Typography variant="body1" gutterBottom>
                                    Coverage
                                </Typography>
                            </Link>
                            <a
                                href="https://data.covid-19.global.health/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Typography variant="body1" gutterBottom>
                                    G.h Data
                                </Typography>
                            </a>
                        </nav>
                    </StyledTooolbar>
                </AppBar>
            </Box>
        </TopBarContainerStyle>
    );
};
export default TopBar;
