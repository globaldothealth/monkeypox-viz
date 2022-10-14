import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

export const StyledMapGuideButton = styled('div')`
    margin-left: 15px;
    margin-top: 7px;
`;

export const MapGuideButton = styled(Button)(({ theme }) => ({
    textDecoration: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    minWidth: '6.4rem',
    boxSizing: 'border-box',
    fontWeight: 500,
    borderRadius: '0.4rem',
    textRransform: 'uppercase',
    border: `0.1rem solid ${theme.palette.primary.main}`,
    alignItems: 'center',
    lineHeight: 'unset',
}));

export const StyledTooltipTitle = styled('h2')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2.8rem',
    textAlign: 'center',
    width: '100%',
    position: 'relative',
    padding: '1.6rem 2.4rem',
    fontWeight: 450,
}));

export const Link = styled('a')(() => ({
    color: '#fff',
    fontWeight: 'bold',

    '&:hover': {
        color: '#fff',
    },
}));
