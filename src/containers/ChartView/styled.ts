import { styled } from '@mui/material/styles';

export const ChartContainer = styled('div')(() => ({
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
