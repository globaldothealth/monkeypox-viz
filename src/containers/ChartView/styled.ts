import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const ChartContainer = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: '6.4rem',
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 6.4rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '2rem',
}));

export const ChartTitle = styled(Typography)(() => ({
    fontWeight: 'bold',
}));
