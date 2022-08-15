import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import {
    selectTimeseriesCaseCounts,
    selectSelectedCountryInSideBar,
    selectTimeseriesCountryData,
    selectTimeseriesDates,
} from 'redux/App/selectors';
import {
    selectChartDatePeriod,
    selectChartData,
    selectAvailableDates,
} from 'redux/ChartView/selectors';
import { setChartData } from 'redux/ChartView/slice';
import {
    AreaChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Area,
    CartesianGrid,
} from 'recharts';
import { getGlobalChartData } from 'utils/helperFunctions';
import Typography from '@mui/material/Typography';
import ChartSlider from 'components/ChartSlider';
import { getCountryName } from 'utils/helperFunctions';
import { useTheme } from '@mui/material/styles';
import { ChartContainer } from './styled';
import { URLToFilters } from 'utils/helperFunctions';
import { setPopup, setSelectedCountryInSidebar } from 'redux/App/slice';
import iso from 'iso-3166-1';
import Fab from '@mui/material/Fab';
import LinkIcon from '@mui/icons-material/Link';
import DoneIcon from '@mui/icons-material/Done';

const ChartView = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const chartData = useAppSelector(selectChartData);
    const timeseriesCaseCounts = useAppSelector(selectTimeseriesCaseCounts);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const timeseriesCountryData = useAppSelector(selectTimeseriesCountryData);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);
    const chartDatePeriod = useAppSelector(selectChartDatePeriod);
    const availableDates = useAppSelector(selectAvailableDates);

    const [copyHandler, setCopyHandler] = useState({
        message: 'Copy link to chart',
        isCopying: false,
    });

    useEffect(() => {
        if (
            !timeseriesCaseCounts ||
            !timeseriesDates ||
            !chartDatePeriod ||
            !timeseriesCountryData ||
            !availableDates
        )
            return;

        const data = getGlobalChartData(
            timeseriesCaseCounts,
            selectedCountry,
            timeseriesCountryData,
            availableDates,
            chartDatePeriod,
        );

        dispatch(setChartData(data));
        // eslint-disable-next-line
    }, [
        timeseriesCaseCounts,
        selectedCountry,
        chartDatePeriod,
        availableDates,
    ]);

    useEffect(() => {
        const newChartValues = URLToFilters(location.search);
        if (!newChartValues.name) return;

        const newCountryName = iso.whereAlpha3(newChartValues.name)
            ? newChartValues.name
            : 'worldwide';

        dispatch(setSelectedCountryInSidebar({ name: newCountryName }));
        dispatch(setPopup({ isOpen: true, countryName: newCountryName }));
    }, [location.search]);

    const handleCopyLinkButton = () => {
        if (copyHandler.isCopying) return;

        const countryName = selectedCountry
            ? selectedCountry.name
            : 'worldwide';

        navigator.clipboard.writeText(
            `${window.location.href}?name=${countryName}&startDate=${chartDatePeriod[0]}&endDate=${chartDatePeriod[1]}`,
        );
        setCopyHandler({ message: 'Copied!', isCopying: true });

        setTimeout(() => {
            setCopyHandler({ message: 'Copy link to chart', isCopying: false });
        }, 2000);
    };

    return (
        <>
            <ChartContainer>
                <Typography variant="body1">
                    Total confirmed cases:{' '}
                    <strong>
                        {selectedCountry
                            ? getCountryName(selectedCountry.name)
                            : `Worldwide`}
                    </strong>
                </Typography>

                <ResponsiveContainer width="90%" height="80%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="caseCount"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={theme.palette.primary.main}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={theme.palette.primary.main}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            stroke="rgba(0, 0, 0, 0.1)"
                            strokeDasharray="5 5"
                        />
                        <XAxis
                            dataKey="date"
                            interval="preserveStartEnd"
                            minTickGap={100}
                        />
                        <YAxis />
                        <Area
                            type="monotone"
                            dataKey="caseCount"
                            stroke={theme.palette.primary.main}
                            fillOpacity={1}
                            fill="url(#caseCount)"
                        />
                        <Tooltip
                            formatter={(value: string) => [value, 'Case count']}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <ChartSlider />
            </ChartContainer>
            <Fab
                color="primary"
                variant="extended"
                sx={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    marginBottom: '3.75rem',
                    marginRight: '3.75rem',
                    minWidth: '25ch',
                }}
                onClick={handleCopyLinkButton}
            >
                {' '}
                {copyHandler.isCopying ? <DoneIcon /> : <LinkIcon />}
                {copyHandler.message}
            </Fab>
        </>
    );
};

export default ChartView;
