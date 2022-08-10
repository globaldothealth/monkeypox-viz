import { styled } from '@mui/material/styles';

export const ChartContainer = styled('div')(() => ({
    position: 'absolute',
    top: '11.5rem',
    left: '28rem',
    right: '28rem',
    bottom: '4rem',
    width: 'calc(100vw - 56rem)',
    height: 'calc(100vh - 11.5rem - 4rem)',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '2rem',
}));
