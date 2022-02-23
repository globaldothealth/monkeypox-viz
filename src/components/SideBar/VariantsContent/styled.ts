import { styled } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const SelectTitle = styled('p')(({ theme }) => ({
    fontFamily: 'Mabry Pro',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: theme.palette.dark.main,
    marginBottom: '1.5rem',
}));

export const SelectContainer = styled(Box)(() => ({
    marginTop: '2rem',
}));

export const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: theme.palette.dark.main,
}));

export const SelectTitleSkeleton = styled(Skeleton)(() => ({
    width: '80%',
}));

export const SelectSkeleton = styled(Skeleton)(() => ({
    width: '100%',
    height: '5.6rem',
}));