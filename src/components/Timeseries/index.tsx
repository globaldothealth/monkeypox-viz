import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

import {
    selectTimeseriesDates,
    selectTimeseriesCountryData,
    selectCurrentDate,
    selectInitialCountriesData,
    selectDataType,
    selectPopupData,
} from 'redux/App/selectors';
import {
    setCurrentDate,
    setCountriesData,
    DataType,
    setPopup,
} from 'redux/App/slice';
import { getCountryDataFromTimeseriesData } from 'utils/helperFunctions';
import { URLToFilters } from 'utils/helperFunctions';
import { useNavigate } from 'react-router-dom';

function getLabel(dates: Date[], selectedDate: number | undefined) {
    if (selectedDate === undefined || !dates || dates.length === 0) return '';

    return format(dates[selectedDate], 'MMM d, yyyy');
}

// number of seconds per one mark
const animationSpeed = 0.25;

interface TimeseriesProps {
    isHidden: boolean;
}

export default function Timeseries({ isHidden }: TimeseriesProps) {
    const dispatch = useAppDispatch();

    const timeseriesData = useAppSelector(selectTimeseriesCountryData);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);
    const currentDate = useAppSelector(selectCurrentDate);
    const initialCountriesData = useAppSelector(selectInitialCountriesData);
    const dataType = useAppSelector(selectDataType);
    const popupData = useAppSelector(selectPopupData);

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedDate, setSelectedDate] = useState<number>();
    const [animationInterval, setAnimationInterval] = useState<
        NodeJS.Timeout | undefined
    >(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        if (!timeseriesDates || timeseriesDates.length === 0) return;

        const start = timeseriesDates[0];
        const end = timeseriesDates[timeseriesDates.length - 1];

        const countryViewFilters = URLToFilters(location.search);

        const newSelectedDate = currDateFromURLHandler(
            countryViewFilters.currDate,
            timeseriesDates.length - 1,
        );

        setStartDate(start);
        setEndDate(end);

        setSelectedDate(newSelectedDate);

        dispatch(setCurrentDate(timeseriesDates[newSelectedDate]));

        navigate(location.pathname);
    }, [timeseriesDates, location.pathname]);

    useEffect(() => {
        if (
            !timeseriesDates ||
            !currentDate ||
            !startDate ||
            !endDate ||
            selectedDate === undefined ||
            selectedDate === timeseriesDates.length - 1
        )
            return;

        const data = getCountryDataFromTimeseriesData(
            timeseriesData,
            timeseriesDates[selectedDate],
        );

        const sortBy =
            dataType === DataType.Confirmed ? 'confirmed' : 'combined';
        const sortedCountries = [...data].sort((a, b) =>
            a[sortBy] < b[sortBy] ? 1 : -1,
        );

        dispatch(setCountriesData(sortedCountries));
        if (popupData.isOpen) {
            dispatch(setPopup({ isOpen: false, countryName: '' }));
        }
    }, [selectedDate, dataType]);

    // Stop animation and delete interval when completed
    useEffect(() => {
        if (
            selectedDate === undefined ||
            selectedDate < timeseriesDates.length - 1
        )
            return;

        if (animationInterval) {
            clearInterval(animationInterval);
            setAnimationInterval(undefined);
        }
        dispatch(setCountriesData(initialCountriesData));
        // eslint-disable-next-line
    }, [selectedDate]);

    // Update current date when timeseries is changed
    useEffect(() => {
        if (selectedDate === undefined) return;

        dispatch(setCurrentDate(timeseriesDates[selectedDate]));
    }, [selectedDate]);

    const handleChange = (value: number | number[]) => {
        setSelectedDate(typeof value === 'object' ? value[0] : value);
    };

    const currDateFromURLHandler = (
        currDate: number | undefined,
        max: number,
    ) => {
        const properlyFormatedNumber = Number(currDate);

        if (
            !properlyFormatedNumber ||
            properlyFormatedNumber > max ||
            dataType === DataType.Combined
        )
            return max;
        if (properlyFormatedNumber < 0) return 0;
        return Math.floor(properlyFormatedNumber);
    };

    const handleStartAnimationClick = () => {
        if (selectedDate === timeseriesDates.length - 1) setSelectedDate(0);

        const interval = setInterval(() => {
            setSelectedDate((state) => {
                if (state === undefined) return;
                return state < timeseriesDates.length - 1 ? (state += 1) : 0;
            });
        }, animationSpeed * 1000);

        setAnimationInterval(interval);
    };

    const handlePauseAnimation = () => {
        if (!animationInterval) return;

        clearInterval(animationInterval);
        setAnimationInterval(undefined);
    };

    return (
        <>
            {timeseriesData.length > 0 && timeseriesDates.length > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 20,
                        width: '100%',
                        display: isHidden ? 'none' : 'flex',
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
                        <Typography
                            variant="body1"
                            sx={{ marginBottom: '2rem' }}
                        >
                            Showing data for:{' '}
                            <strong>
                                {getLabel(timeseriesDates, selectedDate)}
                            </strong>
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
                                    color: theme.palette.primary.main,
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
                                {getLabel(timeseriesDates, 0)}
                            </Typography>
                            <Slider
                                aria-label="timeseries marks"
                                defaultValue={selectedDate || 0}
                                value={selectedDate || 0}
                                onChange={(e, value) => handleChange(value)}
                                getAriaValueText={(value) =>
                                    getLabel(timeseriesDates, value)
                                }
                                getAriaLabel={(value) =>
                                    getLabel(timeseriesDates, value)
                                }
                                step={1}
                                min={0}
                                max={timeseriesDates.length - 1}
                                valueLabelDisplay="off"
                                sx={{
                                    width: '100%',
                                    marginRight: '2rem',
                                }}
                                disabled={Boolean(animationInterval)}
                            />
                            <Typography variant="subtitle2">
                                {getLabel(
                                    timeseriesDates,
                                    timeseriesDates.length - 1,
                                )}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
}
