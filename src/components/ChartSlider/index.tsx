import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { setChartDatePeriod, setAvailableDates } from 'redux/ChartView/slice';
import {
    selectChartDatePeriod,
    selectAvailableDates,
} from 'redux/ChartView/selectors';
import {
    selectTimeseriesDates,
    selectSelectedCountryInSideBar,
    selectTimeseriesCountryData,
} from 'redux/App/selectors';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';

import Slider from '@mui/material/Slider';
import { useNavigate } from 'react-router-dom';
import {
    getAvailableDatesForCountry,
    URLToFilters,
} from 'utils/helperFunctions';

let minDistance = 5;

function getLabel(dates: Date[], selectedDate: number | undefined) {
    if (selectedDate === undefined || !dates || dates.length === 0) return '';

    return format(dates[selectedDate], 'MMM d, yyyy');
}

export default function ChartSlider() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const chartDatePeriod = useAppSelector(selectChartDatePeriod);
    const allTimeseriesDates = useAppSelector(selectTimeseriesDates);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const timeseriesCountryData = useAppSelector(selectTimeseriesCountryData);
    const availableDates = useAppSelector(selectAvailableDates);
    const [sliderRange, setSliderRange] = useState<number[]>([]);

    // Update slider range when selected country changes
    useEffect(() => {
        if (!timeseriesCountryData || timeseriesCountryData.length === 0)
            return;

        const dates =
            selectedCountry && selectedCountry.name !== 'worldwide'
                ? getAvailableDatesForCountry(
                      timeseriesCountryData,
                      selectedCountry,
                  )
                : allTimeseriesDates;

        minDistance = dates.length > 5 ? 5 : dates.length - 1;

        const newChartValues = URLToFilters(location.search);
        const dateRange = spaceBetweenDatesParams(
            Number(newChartValues.startDate) || 0,
            Number(newChartValues.endDate) || dates.length - 1,
            dates.length - 1,
        );

        setSliderRange(dateRange);
        dispatch(setAvailableDates(dates));
        dispatch(setChartDatePeriod(dateRange));
        navigate(location.pathname);
    }, [selectedCountry, timeseriesCountryData]);

    const handleValueChange = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (
            !Array.isArray(newValue) ||
            !sliderRange ||
            sliderRange.length === 0
        )
            return;

        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(
                    newValue[0],
                    sliderRange[1] - minDistance,
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

    const spaceBetweenDatesParams = (
        start: number,
        end: number,
        max: number,
    ): number[] => {
        start = start > max || start < 0 ? 0 : Math.floor(start);
        end = end > max || end < 0 ? max : Math.floor(end);

        if (start > end) return [0, max];

        const distance = Math.abs(start - end);
        if (distance < minDistance) {
            if (start - distance < 0) end = end + minDistance - distance;
            else start = start - minDistance + distance;
        }

        return [start, end];
    };

    return (
        <Stack sx={{ width: '50%', marginTop: '3rem' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                Current date period:{' '}
                <strong>
                    {getLabel(availableDates, chartDatePeriod[0])} -{' '}
                    {getLabel(availableDates, chartDatePeriod[1])}
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
                    {getLabel(availableDates, 0)}
                </Typography>

                <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={chartDatePeriod}
                    onChange={handleValueChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                        getLabel(availableDates, value)
                    }
                    disableSwap
                    step={1}
                    min={0}
                    max={availableDates.length - 1 || 100}
                    sx={{ width: '100%', marginRight: '2rem' }}
                />

                <Typography variant="subtitle2">
                    {getLabel(availableDates, availableDates.length - 1)}
                </Typography>
            </Stack>
        </Stack>
    );
}
