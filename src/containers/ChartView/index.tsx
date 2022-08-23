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
import { ChartContainer, ChartDataSwitch } from './styled';

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

    const [isTotalConfirmedCases, setIsTotalConfirmedCases] = useState(true);

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

    const handleChartDataChange = () => {
        setIsTotalConfirmedCases(!isTotalConfirmedCases);
    };

    return (
        <ChartContainer>
            <Typography
                variant="body1"
                sx={{ width: '100%', textAlign: 'center' }}
            >
                {isTotalConfirmedCases
                    ? 'Total confirmed cases: '
                    : '7 Days case count moving average: '}
                <strong>
                    {selectedCountry
                        ? getCountryName(selectedCountry.name)
                        : `Worldwide`}
                </strong>
                <ChartDataSwitch
                    onChange={() => handleChartDataChange()}
                    checked={!isTotalConfirmedCases}
                />
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
                        dataKey={
                            isTotalConfirmedCases
                                ? 'caseCount'
                                : 'caseMovingNDaysCount'
                        }
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#caseCount)"
                    />

                    <Tooltip
                        formatter={(value: string) => [
                            value,
                            isTotalConfirmedCases
                                ? 'Case count'
                                : '7 days case count average',
                        ]}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <ChartSlider />
        </ChartContainer>
    );
};

export default ChartView;
