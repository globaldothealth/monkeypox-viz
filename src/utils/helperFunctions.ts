import iso from 'iso-3166-1';
import {
    TimeseriesCountryDataRow,
    ParsedCountryDataRow,
    TimeseriesCaseCountsDataRow,
    SelectedCountry,
} from 'models/CountryData';
import { DataType } from 'redux/App/slice';
import { ChartDataFormat } from 'models/ChartData';
import { isEqual, format, compareAsc, isBefore } from 'date-fns';
import { ViewParamURLValues } from 'models/ViewParamURLValues';

// Parses search query that takes user to Curator Portal
export const parseSearchQuery = (searchQuery: string): string => {
    const parsedQuery = searchQuery.includes(' ')
        ? `"${searchQuery}"`
        : searchQuery;

    const encodedQuery = encodeURIComponent(parsedQuery);

    return encodedQuery;
};

export const getCountryName = (code: string) => {
    if (code === 'worldwide') return 'Worldwide';

    const countryObj = iso.whereAlpha3(code);

    if (code === 'COD') return 'The Democratic Republic of the Congo';
    if (code === 'COG') return 'The Congo';

    return countryObj ? countryObj.country : 'N/A';
};

// Returns two letter country code based on three letter code
export const getTwoLetterCountryCode = (code: string) => {
    const countryObj = iso.whereAlpha3(code);
    return countryObj ? countryObj.alpha2 : 'N/A';
};

export enum Env {
    Local = 'local',
    Dev = 'dev',
    Prod = 'prod',
    Qa = 'qa',
}

// Get data portal url based on current env
export const getDataPortalUrl = (env: Env) => {
    switch (env) {
        case Env.Local:
            return 'http://localhost:3002';
        case Env.Dev:
            return 'https://dev-data.covid-19.global.health';
        case Env.Qa:
            return 'https://qa-data.covid-19.global.health';
        case Env.Prod:
            return 'https://data.covid-19.global.health';
    }
};

// Timeseries
export const getCountryDataFromTimeseriesData = (
    timeseriesData: TimeseriesCountryDataRow[],
    date: Date,
): ParsedCountryDataRow[] => {
    const filteredTimeseriesData = timeseriesData.filter((dataRow) =>
        isEqual(dataRow.date, date),
    );

    const countryData: ParsedCountryDataRow[] = filteredTimeseriesData.map(
        (dataRow) => {
            return {
                name: dataRow.country,
                confirmed: dataRow.cumulativeCases,
                combined: dataRow.cumulativeCases,
                suspected: dataRow.cumulativeCases,
            };
        },
    );

    return countryData;
};

// This gets number of cases through time for a particular country
export const getChartDataFromTimeseriesData = (
    timeseriesData: TimeseriesCountryDataRow[],
    country: string,
    endDate: Date | undefined,
): ChartDataFormat[] => {
    // Get only data belonging to chosen country
    let countryData = timeseriesData.filter((data) => data.country === country);

    // Get only data before or at a chosen date
    if (endDate) {
        countryData = countryData.filter(
            (data) => compareAsc(data.date, endDate) !== 1,
        );
    }

    const chartData = countryData.map((data, idx) => {
        const formattedDate = format(data.date, 'MMM d, yyyy');

        return {
            // Only first and last date should be added to the chart
            date:
                idx === 0 || idx === countryData.length - 1
                    ? formattedDate
                    : '',
            caseCount: data.cumulativeCases,
        };
    });

    return chartData;
};

const getNDaysAverage = (
    data: TimeseriesCountryDataRow[] | TimeseriesCaseCountsDataRow[],
    idx: number,
    nDays: number,
    timeseriesCountData:
        | TimeseriesCaseCountsDataRow[]
        | TimeseriesCountryDataRow[],
    cumulative = false,
): number | undefined => {
    //if first 7 days return undefined

    if (!timeseriesCountData[8]) return;

    if (
        nDays >= idx + 1 &&
        compareAsc(data[0].date, timeseriesCountData[8].date) === -1
    )
        return undefined;

    const initialValue = 0;
    const indexOfdateInTimeSeries = timeseriesCountData.findIndex(
        (element) => element.date === data[idx].date,
    );

    //add 7 days prior to first date shown in chart
    const newData = [
        ...timeseriesCountData.slice(
            indexOfdateInTimeSeries - 7,
            indexOfdateInTimeSeries,
        ),
        ...data,
    ];

    //update index to return average of 7 days instead of more
    const newIdx = idx + 7;

    return (
        Math.round(
            (newData
                .slice(newIdx - nDays, newIdx)
                .reduce(
                    (previousValue, currentValue) =>
                        previousValue +
                        (cumulative
                            ? currentValue.cumulativeCases
                            : currentValue.cases),
                    initialValue,
                ) /
                nDays) *
                100,
        ) / 100
    );
};

// This gets global case counts for the chart
export const getGlobalChartData = (
    timeseriesCountData: TimeseriesCaseCountsDataRow[],
    selectedCountry: SelectedCountry | null,
    timeseriesData: TimeseriesCountryDataRow[],
    availableDates: Date[],
    chartDatePeriod: number[],
): ChartDataFormat[] => {
    const startDate = availableDates[chartDatePeriod[0]];
    const endDate = availableDates[chartDatePeriod[1]];

    // If there is a selected country specified get count data just for this country
    if (selectedCountry && selectedCountry.name !== 'worldwide') {
        const countryData = timeseriesData.filter(
            (data) => data.country === selectedCountry.name,
        );

        // Filter data so that only values from specified time period are returned
        const newCountryData = countryData.filter(
            (data) =>
                compareAsc(data.date, startDate) !== -1 &&
                compareAsc(data.date, endDate) === -1,
        );

        const chartData = newCountryData.map((data, idx) => {
            return {
                date: format(data.date, 'MMM d, yyyy'),
                caseCount: data.cumulativeCases,
                caseMovingNDaysCount: getNDaysAverage(
                    newCountryData,
                    idx,
                    7,
                    countryData, // sending countryData as timeseries because first dates of countries starts much later compared to worlds
                ),
                caseMovingNDaysCountCumulative: getNDaysAverage(
                    newCountryData,
                    idx,
                    7,
                    countryData,
                    true,
                ),
            };
        });

        return chartData;
    }

    // If there isn't any country selected get count data for global case count

    // Filter data so that only values from specified time period are returned

    const filteredData = timeseriesCountData.filter(
        (data) =>
            compareAsc(data.date, startDate) !== -1 &&
            compareAsc(data.date, endDate) === -1,
    );

    const chartData = filteredData.map((data, idx) => {
        return {
            date: format(data.date, 'MMM d, yyyy'),
            caseCount: data.cumulativeCases,
            caseMovingNDaysCount: getNDaysAverage(
                filteredData,
                idx,
                7,
                timeseriesCountData,
            ),
            caseMovingNDaysCountCumulative: getNDaysAverage(
                filteredData,
                idx,
                7,
                timeseriesCountData,
                true,
            ),
        };
    });

    return chartData;
};

export const getTotalCasesByDate = (
    timeseriesCaseCountsData: TimeseriesCaseCountsDataRow[],
    date: Date,
): number => {
    const dataRow = timeseriesCaseCountsData.find((data) =>
        isEqual(data.date, date),
    );

    return dataRow?.cumulativeCases || 0;
};

export const sortCountriesData = (
    countriesData: ParsedCountryDataRow[],
    sortBy: DataType,
) => {
    if (sortBy === DataType.Confirmed) {
        return [...countriesData].sort((a, b) =>
            a.confirmed < b.confirmed ? 1 : -1,
        );
    } else {
        return [...countriesData].sort((a, b) =>
            a.combined < b.combined ? 1 : -1,
        );
    }
};

export const getAvailableDatesForCountry = (
    timeseriesCountryData: TimeseriesCountryDataRow[],
    country: SelectedCountry,
): Date[] => {
    // Get data only for selected country
    const filteredData = timeseriesCountryData.filter(
        (data) => data.country === country.name,
    );

    // Get all available dates for this country
    const dates = filteredData.map((data) => new Date(data.date));

    // sort dates
    dates.sort((date1, date2) => (isBefore(date1, date2) ? -1 : 1));

    return dates;
};

export const URLToFilters = (url: string): ViewParamURLValues => {
    const isQuery = url.includes('?q=');

    if (isQuery) return {};

    const searchParams = new URLSearchParams(url);
    let filters: ViewParamURLValues = {};

    searchParams.forEach((value, key) => {
        const parsedValue = value.includes('"')
            ? value.replaceAll('"', '')
            : value;

        filters = {
            ...filters,
            [key]: parsedValue,
        };
    });

    return filters;
};
