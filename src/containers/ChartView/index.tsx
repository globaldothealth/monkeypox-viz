import { useState, useEffect } from 'react';
import { useAppSelector } from 'redux/hooks';
import {
    selectTimeseriesCaseCounts,
    selectSelectedCountryInSideBar,
} from 'redux/App/selectors';
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

import { ChartContainer, ChartTitle } from './styled';

const ChartView = () => {
    const theme = useTheme();
    const timeseriesCaseCounts = useAppSelector(selectTimeseriesCaseCounts);

    const [chartData, setChartData] = useState<ChartDataFormat[]>([]);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);

    useEffect(() => {
        if (!timeseriesCaseCounts) return;

        setChartData(getGlobalChartData(timeseriesCaseCounts));
    }, [timeseriesCaseCounts, selectedCountry]);

    const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <ChartContainer>
            <ChartTitle variant="body1">
                Chart representing total cases number through time
            </ChartTitle>

            <ResponsiveContainer width="70%" height="90%">
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
        </ChartContainer>
    );
};

export default ChartView;
