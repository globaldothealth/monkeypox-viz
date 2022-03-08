import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

export const ErrorContainer = styled('div')(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

export const RefreshButton = styled(Button)(() => ({
    marginTop: '2rem',
}));
