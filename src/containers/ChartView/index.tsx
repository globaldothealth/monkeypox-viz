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
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

type ChartTypeValues = {
    title: string;
    dataKey: string;
    tooltipName: string;
};

interface ChartTypesValues {
    cumulative: ChartTypeValues;
    nDaysAverage: ChartTypeValues;
    nDaysAverageCumulative: ChartTypeValues;
}

const ChartView = () => {
    const chartTypes: ChartTypesValues = {
        cumulative: {
            title: 'Total confirmed cases: ',
            dataKey: 'caseCount',
            tooltipName: 'Case count',
        },
        nDaysAverage: {
            title: '7-day case count moving average: ',
            dataKey: 'caseMovingNDaysCount',
            tooltipName: '7-day case count average',
        },
        nDaysAverageCumulative: {
            title: '7-day case count moving average cumulative: ',
            dataKey: 'caseMovingNDaysCountCumulative',
            tooltipName: '7-day case count average cumulative',
        },
    };

    const dispatch = useAppDispatch();
    const theme = useTheme();

    const chartData = useAppSelector(selectChartData);
    const timeseriesCaseCounts = useAppSelector(selectTimeseriesCaseCounts);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const timeseriesCountryData = useAppSelector(selectTimeseriesCountryData);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);
    const chartDatePeriod = useAppSelector(selectChartDatePeriod);
    const availableDates = useAppSelector(selectAvailableDates);

    const [chartType, setChartType] = useState<
        'cumulative' | 'nDaysAverage' | 'nDaysAverageCumulative'
    >('cumulative');

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

    const handleChartDataChange = (
        event: React.MouseEvent<HTMLElement>, //needs to be here for correct type check
        newChartType: 'cumulative' | 'nDaysAverage' | 'nDaysAverageCumulative',
    ) => {
        if (!newChartType) return;

        setChartType(newChartType);
    };

    return (
        <ChartContainer>
            <Typography
                variant="body1"
                sx={{ width: '100%', textAlign: 'center' }}
            >
                {chartTypes[chartType].title}
                <strong>
                    {selectedCountry
                        ? getCountryName(selectedCountry.name)
                        : `Worldwide`}
                </strong>
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={chartType}
                exclusive
                onChange={handleChartDataChange}
                aria-label="Platform"
            >
                <ToggleButton value="cumulative">Cumulative</ToggleButton>
                <ToggleButton value="nDaysAverage"> 7-day average</ToggleButton>
                <ToggleButton value="nDaysAverageCumulative">
                    {' '}
                    7-day average cumulative
                </ToggleButton>
            </ToggleButtonGroup>
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
                        dataKey={chartTypes[chartType].dataKey}
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#caseCount)"
                    />

                    <Tooltip
                        formatter={(value: string) => [
                            value,
                            chartTypes[chartType].tooltipName,
                        ]}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <ChartSlider />
        </ChartContainer>
    );
};

export default ChartView;
