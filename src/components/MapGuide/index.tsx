import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {
    StyledMapGuideButton,
    StyledTooltipTitle,
    MapGuideButton,
    Link,
} from './styled';
import { useState } from 'react';

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
                Welcome to the Global.health monkeypox map!
            </StyledTooltipTitle>
            <Typography
                sx={{
                    marginBottom: '2rem',
                }}
            >
                These geospatial data visualisations allow you to explore data
                produced by the World Health Organization for the 2022 Monkeypox
                outbreak. You can read about our data transition and completing
                a 100 days mission on the{' '}
                <Link
                    href="https://globaldothealth.substack.com/p/tracking-the-2022-monkeypox-outbreak-8c3"
                    target="_blank"
                    rel="noreferrer"
                >
                    G.h blog
                </Link>
                .
            </Typography>
            <Typography>
                <strong>Country View:</strong> Click on a country to see
                available data in that country. You can also use the left-hand
                navigation to search or select a country. Darker colours
                indicate more available data.
            </Typography>
        </>
    );
};

export const MapGuide: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <StyledMapGuideButton>
            <StyledMapGuideTooltip
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                leaveTouchDelay={21000}
                open={isOpen}
                arrow
                title={<StyledMapGuideContext />}
                placement="bottom-end"
            >
                <MapGuideButton
                    disableRipple
                    onClick={() => setIsOpen(!isOpen)}
                    startIcon={<HelpOutlineIcon />}
                >
                    Map guide
                </MapGuideButton>
            </StyledMapGuideTooltip>
        </StyledMapGuideButton>
    );
};

export default MapGuide;
