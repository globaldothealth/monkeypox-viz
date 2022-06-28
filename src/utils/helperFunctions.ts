import iso from 'iso-3166-1';
import {
    TimeseriesCountryDataRow,
    ParsedCountryDataRow,
    TimeseriesCaseCountsDataRow,
} from 'models/CountryData';
import { ChartDataFormat } from 'components/CaseChart';
import { isEqual, format, compareAsc } from 'date-fns';

// Parses search query that takes user to Curator Portal
export const parseSearchQuery = (searchQuery: string): string => {
    const parsedQuery = searchQuery.includes(' ')
        ? `"${searchQuery}"`
        : searchQuery;

    const encodedQuery = encodeURIComponent(parsedQuery);

    return encodedQuery;
};

export const getCountryCode = (countryName: string): string => {
    const countryObj = iso.whereCountry(countryName);

    // Manual overrides
    if (countryName === 'United Kingdom') return 'GB';
    if (countryName === 'England') return 'GB';
    if (countryName === 'Scotland') return 'GB';
    if (countryName === 'Wales') return 'GB';
    if (countryName === 'Northern Ireland') return 'GB';
    if (countryName === 'United States') return 'US';
    if (countryName === 'Kosovo') return 'XK';
    if (countryName === 'Iran') return 'IR';
    if (countryName === 'South Korea') return 'KR';

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

export const getChartDataFromTimeseriesData = (
    timeseriesData: TimeseriesCountryDataRow[],
    country: string,
    endDate: Date | undefined,
): ChartDataFormat[] => {
    let chosenCountry = country;

    // Manual override this for now until timeseries data changes
    if (country === 'United Kingdom') chosenCountry = 'England';

    // Get only data belonging to chosen country
    let countryData = timeseriesData.filter(
        (data) => data.country === chosenCountry,
    );

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

export const getTotalCasesByDate = (
    timeseriesCaseCountsData: TimeseriesCaseCountsDataRow[],
    date: Date,
): number => {
    const dataRow = timeseriesCaseCountsData.find((data) =>
        isEqual(data.date, date),
    );

    return dataRow?.cumulativeCases || 0;
};
