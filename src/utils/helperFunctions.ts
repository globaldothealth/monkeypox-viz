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

export const getCountryCode = (countryName: string): string => {
    const countryObj = iso.whereCountry(countryName);

    // Manual overrides
    if (countryName === 'United Kingdom') return 'GBR';
    if (countryName === 'England') return 'GBR';
    if (countryName === 'Scotland') return 'GBR';
    if (countryName === 'Wales') return 'GBR';
    if (countryName === 'Northern Ireland') return 'GBR';
    if (countryName === 'United States') return 'USA';
    if (countryName === 'Iran') return 'IRN';
    if (countryName === 'South Korea') return 'KOR';
    if (countryName === 'Democratic Republic Of The Congo') return 'COD';
    if (countryName === 'Republic of Congo') return 'COG';
    if (countryName === 'Taiwan') return 'TWN';
    if (countryName === 'Russia') return 'RUS';
    if (countryName === 'Venezuela') return 'VEN';

    return countryObj ? countryObj.alpha3 : 'N/A';
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
        let countryData = timeseriesData.filter(
            (data) => data.country === selectedCountry.name,
        );

        // Filter data so that only values from specified time period are returned
        countryData = countryData.filter(
            (data) =>
                compareAsc(data.date, startDate) !== -1 &&
                compareAsc(data.date, endDate) === -1,
        );

        const chartData = countryData.map((data) => {
            return {
                date: format(data.date, 'MMM d, yyyy'),
                caseCount: data.cumulativeCases,
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

    const chartData = filteredData.map((data) => {
        return {
            date: format(data.date, 'MMM d, yyyy'),
            caseCount: data.cumulativeCases,
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
