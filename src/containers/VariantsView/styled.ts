import { styled } from '@mui/material/styles';

export const PopupContentText = styled('p')(() => ({
    fontSize: '1.6rem',
    marginBottom: '1rem',

    '&:last-of-type()': {
        marginBottom: 0,
    },
}));
