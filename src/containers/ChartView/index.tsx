import { useState, useEffect } from 'react';
import { useAppSelector } from 'redux/hooks';
import {
    selectTimeseriesCaseCounts,
    selectSelectedCountryInSideBar,
    selectTimeseriesCountryData,
    selectTimeseriesDates,
} from 'redux/App/selectors';
import { selectChartDatePeriod } from 'redux/ChartView/selectors';
import { ChartDataFormat } from 'models/ChartData';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ChartSlider from 'components/ChartSlider';
import { getCountryName } from 'utils/helperFunctions';

import { ChartContainer } from './styled';

const ChartView = () => {
    const theme = useTheme();

    const [chartData, setChartData] = useState<ChartDataFormat[]>([]);
    const timeseriesCaseCounts = useAppSelector(selectTimeseriesCaseCounts);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const timeseriesCountryData = useAppSelector(selectTimeseriesCountryData);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);
    const chartDatePeriod = useAppSelector(selectChartDatePeriod);

    useEffect(() => {
        if (!timeseriesCaseCounts || !timeseriesDates || !chartDatePeriod)
            return;

        setChartData(
            getGlobalChartData(
                timeseriesCaseCounts,
                selectedCountry,
                timeseriesCountryData,
                timeseriesDates,
                chartDatePeriod,
            ),
        );
        // eslint-disable-next-line
    }, [timeseriesCaseCounts, selectedCountry, chartDatePeriod]);

    const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <ChartContainer>
            <Typography variant="body1">
                Total confirmed cases:{' '}
                <strong>
                    {selectedCountry
                        ? getCountryName(selectedCountry.name)
                        : `worldwide`}
                </strong>
            </Typography>

            <ResponsiveContainer width="70%" height="80%">
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
                                stopColor="#0094e2"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#0094e2"
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
                        stroke="#0094e2"
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
    );
};

export default ChartView;
