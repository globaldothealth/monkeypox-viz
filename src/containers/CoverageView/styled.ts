import { styled } from '@mui/material/styles';
import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress';

export const PopupContentText = styled('p')(() => ({
    fontSize: '1.2rem',
}));

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    margin: '1.5rem 0',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
