import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { eachDayOfInterval, format } from 'date-fns';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

function getLabel(dates: Date[], selectedDate: number) {
    return format(dates[selectedDate], 'MMM d, yyyy');
}

// number of seconds per one mark
const animationSpeed = 0.25;

export default function Timeseries() {
    const startDate = new Date('05-06-2022');
    const endDate = new Date('06-13-2022');

    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    const [selectedDate, setSelectedDate] = useState(dates.length - 1);
    const [animationInterval, setAnimationInterval] = useState<
        NodeJS.Timeout | undefined
    >(undefined);

    // Stop animation and delete interval when completed
    useEffect(() => {
        if (!animationInterval || selectedDate < dates.length - 1) return;

        clearInterval(animationInterval);
        setAnimationInterval(undefined);
        // eslint-disable-next-line
    }, [selectedDate]);

    const handleChange = (value: number | number[]) => {
        setSelectedDate(typeof value === 'object' ? value[0] : value);
    };

    const handleStartAnimationClick = () => {
        if (selectedDate === dates.length - 1) setSelectedDate(0);

        const interval = setInterval(() => {
            setSelectedDate((state) =>
                state < dates.length - 1 ? (state += 1) : 0,
            );
        }, animationSpeed * 1000);

        setAnimationInterval(interval);
    };

    const handlePauseAnimation = () => {
        if (!animationInterval) return;

        clearInterval(animationInterval);
        setAnimationInterval(undefined);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 20,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: '50%',
                    backgroundColor: '#fff',
                    padding: '2rem 5rem',
                    backdropFilter: 'blur(0.5rem)',
                    borderRadius: '1ex',
                    boxShadow: '0 10px 30px 1px rgb(0 0 0 / 10%)',
                }}
            >
                <Typography variant="body1" sx={{ marginBottom: '2rem' }}>
                    Showing data for:{' '}
                    <strong>{getLabel(dates, selectedDate)}</strong>
                </Typography>

                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: theme.palette.gray.main,
                    })}
                >
                    <IconButton
                        sx={(theme) => ({
                            marginRight: '1rem',
                            color: theme.palette.gray.main,
                        })}
                        onClick={
                            animationInterval
                                ? handlePauseAnimation
                                : handleStartAnimationClick
                        }
                    >
                        {animationInterval ? (
                            <PauseCircleIcon />
                        ) : (
                            <PlayCircleIcon />
                        )}
                    </IconButton>

                    <Typography variant="subtitle2">
                        {getLabel(dates, 0)}
                    </Typography>
                    <Slider
                        aria-label="timeseries marks"
                        defaultValue={selectedDate}
                        value={selectedDate}
                        onChange={(e, value) => handleChange(value)}
                        getAriaValueText={(value) => getLabel(dates, value)}
                        getAriaLabel={(value) => getLabel(dates, value)}
                        step={1}
                        min={0}
                        max={dates.length - 1}
                        valueLabelDisplay="off"
                        sx={{
                            width: '100%',
                            marginRight: '2rem',
                        }}
                        disabled={Boolean(animationInterval)}
                    />
                    <Typography variant="subtitle2">
                        {getLabel(dates, dates.length - 1)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
