import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

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

export const ChartDataSwitch = styled(Switch)(({ theme, checked }) => ({
    width: 62,
    padding: 7,
    position: 'absolute',
    right: '6rem',
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.light,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: checked
            ? theme.palette.primary.light
            : theme.palette.primary.main,

        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 20 / 2,
    },
}));
