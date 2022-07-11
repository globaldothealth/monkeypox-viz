import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { StyledMapGuideButton, StyledTooltipTitle } from './styled';

const StyledMapGuideTooltip = styled(
    ({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ),
)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        maxWidth: 1050,
        fontSize: theme.typography.pxToRem(20),
        border: '1px solid #dadde9',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        padding: '0.5rem 2.4rem 2.1rem',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.primary.main,
    },
}));

const StyledMapGuideContext: React.FC = () => {
    return (
        <>
            <StyledTooltipTitle>
                Welcome to Global.health Map!
            </StyledTooltipTitle>
            <Typography
                sx={{
                    marginBottom: '2rem',
                }}
            >
                These geospatial data visualisations allow you to explore our
                Monkeypox line-list dataset.
            </Typography>
            <Typography>
                <strong>Country View:</strong> Click on a country to see
                available line-list data in that country. You can also use the
                left-hand navigation to search or select a country. Darker
                colours indicate more available line-list data.
            </Typography>
        </>
    );
};

export const MapGuide: React.FC = () => {
    return (
        <StyledMapGuideButton>
            <StyledMapGuideTooltip
                arrow
                title={<StyledMapGuideContext />}
                placement="bottom-end"
            >
                <Button disableRipple>
                    <svg
                        className="MuiSvgIcon-root"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
                    </svg>
                    Map guide
                </Button>
            </StyledMapGuideTooltip>
        </StyledMapGuideButton>
    );
};

export default MapGuide;
