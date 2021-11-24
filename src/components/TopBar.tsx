import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const TopBar = () => {
    return (
        <Container maxWidth="sm">
            <Typography variant="body1" gutterBottom>
                Country view
            </Typography>
            <Typography variant="body1" gutterBottom>
                Regional view
            </Typography>
            <Typography variant="body1" gutterBottom>
                Coverage
            </Typography>
            <Typography variant="body1" gutterBottom>
                G.h Data
            </Typography>
        </Container>
    );
};
export default TopBar;
