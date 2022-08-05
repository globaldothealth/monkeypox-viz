import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { setChartDatePeriod } from 'redux/ChartView/slice';
import { selectChartDatePeriod } from 'redux/ChartView/selectors';
import { selectTimeseriesDates } from 'redux/App/selectors';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';

import Slider from '@mui/material/Slider';

const minDistance = 5;

function getLabel(dates: Date[], selectedDate: number | undefined) {
    if (selectedDate === undefined || !dates || dates.length === 0) return '';

    return format(dates[selectedDate], 'MMM d, yyyy');
}

export default function ChartSlider() {
    const dispatch = useAppDispatch();

    const chartDatePeriod = useAppSelector(selectChartDatePeriod);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);

    useEffect(() => {
        if (!timeseriesDates || timeseriesDates.length === 0) return;

        dispatch(setChartDatePeriod([0, timeseriesDates.length - 1]));
    }, [timeseriesDates]);

    const handleValueChange = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (
            !Array.isArray(newValue) ||
            !timeseriesDates ||
            timeseriesDates.length === 0
        )
            return;

        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(
                    newValue[0],
                    timeseriesDates.length - 1 - minDistance,
                );
                dispatch(setChartDatePeriod([clamped, clamped + minDistance]));
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                dispatch(setChartDatePeriod([clamped - minDistance, clamped]));
            }
        } else {
            dispatch(setChartDatePeriod(newValue as number[]));
        }
    };

    return (
        <Stack sx={{ width: '50%', marginTop: '3rem' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                Current date period:{' '}
                <strong>
                    {getLabel(timeseriesDates, chartDatePeriod[0])} -{' '}
                    {getLabel(timeseriesDates, chartDatePeriod[1])}
                </strong>
            </Typography>

            <Stack
                sx={(theme) => ({
                    width: '100%',
                    marginTop: '1rem',
                    color: theme.palette.gray.main,
                })}
                direction="row"
                alignItems="center"
            >
                <Typography variant="subtitle2">
                    {getLabel(timeseriesDates, 0)}
                </Typography>

                <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={chartDatePeriod}
                    onChange={handleValueChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                        getLabel(timeseriesDates, value)
                    }
                    disableSwap
                    step={1}
                    min={0}
                    max={timeseriesDates.length - 1 || 100}
                    sx={{ width: '100%', marginRight: '2rem' }}
                />

                <Typography variant="subtitle2">
                    {getLabel(timeseriesDates, timeseriesDates.length - 1)}
                </Typography>
            </Stack>
        </Stack>
    );
}
