import { ClickAwayListener, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import {
    StyledDataUpdateInfoButton,
    StyledTooltipTitle,
    DataUpdateInfoButton,
} from './styled';
import { useState, useEffect } from 'react';

const StyledDataUpdateInfoTooltip = styled(
    ({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ),
)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        maxWidth: 1050,
        fontSize: theme.typography.pxToRem(20),
        border: '1px solid #dadde9',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        padding: '0.5rem 2.4rem 2.1rem',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.error.main,
    },
    ['a']: { color: '#fff' },
}));

const StyledDataUpdateInfoContext: React.FC = () => {
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
                Map and data are last updated <strong>2022-09-22</strong>. Our
                team completed a 100 days mission to provide early situational
                awareness through open-access, global line-list data for the
                2022 monkeypox outbreak. Check-out our{' '}
                <a href="https://globaldothealth.substack.com/p/tracking-the-2022-monkeypox-outbreak-8c3">
                    newsletter
                </a>{' '}
                to see what&apos;s happening next with our data. The map will
                remain static as we transition.
            </Typography>
        </>
    );
};

export const DataUpdateInfo: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [disableHoverListenerBoolean, setDisableHoverListenerBoolean] =
        useState(true);

    useEffect(() => {
        setTimeout(() => setDisableHoverListenerBoolean(false), 4000);
        setTimeout(() => setIsOpen(false), 14000);
    }, []);

    return (

        <ClickAwayListener
            mouseEvent={'onMouseDown'}
            onClickAway={() => setIsOpen(false)}
        >
            <StyledDataUpdateInfoButton>
                <StyledDataUpdateInfoTooltip
                    onOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    leaveTouchDelay={14000}
                    open={isOpen}
                    arrow
                    title={<StyledDataUpdateInfoContext />}
                    placement="bottom-end"
                    disableHoverListener={disableHoverListenerBoolean}
                >
                    <DataUpdateInfoButton
                        disableRipple
                        onClick={() => setIsOpen(!isOpen)}
                        startIcon={<WarningAmberOutlinedIcon />}
                    >
                        Update Info
                    </DataUpdateInfoButton>
                </StyledDataUpdateInfoTooltip>
            </StyledDataUpdateInfoButton>
        </ClickAwayListener>
    );
};

export default DataUpdateInfo;
