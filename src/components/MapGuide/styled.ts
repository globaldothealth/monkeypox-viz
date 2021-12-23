import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

export const StyledMapGuideButton = styled('div')`
    margin-left: 15px;
    margin-top: 7px;
    button {
        text-decoration: none;
        cursor: pointer;
        user-select: none;
        background-color: transparent;
        display: flex;
        min-width: 6.4rem;
        box-sizing: border-box;
        font-family: 'Mabry Pro', sans-serif;
        font-weight: 500;
        border-radius: 0.4rem;
        text-transform: uppercase;
        border: 0.1rem solid #0094e2;
        align-items: center;
        gap: 1rem;
        line-height: unset;
        svg {
             {
                fill: #0094e2;
                width: 1em;
                height: 1em;
                display: inline-block;
                font-size: 1.5rem;
                transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                flex-shrink: 0;
                user-select: none;
            }
        }
    }
`;

export const StyledMapGuideDialog = styled(Dialog)`
    .MuiDialog-paperScrollPaper {
        background: #0094e2;
        font-family: 'Mabry Pro';
        color: #fff;
    }
    h1,
    p,
    a {
        color: #fff;
    }
    p {
        margin: 1rem auto;
        font-family: Inter, Helvetica, Arial, sans-serif;
    }
    h1 {
        font-weight: 400;
        text-align: center;
    }
    .MuiButton-text {
        color: #fff;
    }
`;

export const StyledDialogTitle = styled(DialogTitle)(() => ({
    cursor: 'move',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2.8rem',
    textAlign: 'center',
    width: '100%',
    position: 'relative',
}));

export const CloseButton = styled(IconButton)(() => ({
    color: '#fff',
    position: 'absolute',
    right: '2rem',
}));
