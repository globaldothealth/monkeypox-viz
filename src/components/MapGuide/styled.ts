import { styled } from '@mui/material/styles';

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
