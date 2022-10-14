import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    CountryDataRow,
    TotalCasesValues,
    ParsedCountryDataRow,
    TimeseriesCountryDataRow,
    TimeseriesCaseCountsDataRow,
} from 'models/CountryData';
import { DataType, setLastUpdateDate } from './slice';
import {
    getDataPortalUrl,
    Env,
    sortCountriesData,
} from 'utils/helperFunctions';
import enUSLocale from 'date-fns/locale/en-US';
import { formatInTimeZone } from 'date-fns-tz';
import { isBefore } from 'date-fns';

// Fetch countries data from AWS S3 JSON file
export const fetchCountriesData = createAsyncThunk<
    ParsedCountryDataRow[],
    void,
    { rejectValue: string }
>('app/fetchCountriesData', async (_, { rejectWithValue, dispatch }) => {
    const dataUrl = process.env.REACT_APP_COUNTRY_VIEW_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching countries data failed');

        const jsonResponse = await response.json();

        const keys = Object.keys(jsonResponse);
        if (keys.length === 0) throw new Error('Wrong data format');

        const lastUpdateDate = new Date(keys[0]);
        const parsedDate = formatInTimeZone(
            lastUpdateDate,
            'Europe/Berlin',
            'E LLL d yyyy',
            {
                locale: enUSLocale,
            },
        );
        dispatch(setLastUpdateDate(parsedDate));

        const latestKey = keys[0];

        const countriesData = jsonResponse[latestKey] as CountryDataRow[];

        // parse json that comes from S3 to a better format
        const parsedCountriesData: ParsedCountryDataRow[] = countriesData.map(
            (row) => {
                const countryName = Object.keys(row)[0];

                return {
                    name: countryName,
                    suspected: row[countryName].suspected,
                    confirmed: row[countryName].confirmed,
                    combined:
                        row[countryName].confirmed + row[countryName].suspected,
                };
            },
        );

        // remove duplicated United Kingdom
        // parsedCountriesData = parsedCountriesData.filter(
        //     (countryData) => countryData.name !== 'United Kingdom',
        // );

        // combine England, Scotland, Wales and Northern Ireland cases together as United Kingdom
        // this has to be done this way, as Mapbox source files that we use
        // doesn't differentiate those places
        // let ukConfirmedCases = 0;
        // let ukSuspectedCases = 0;
        // let ukCombinedCases = 0;

        // const countryIdx = parsedCountriesData.findIndex(
        //     (row) => row.name === 'IRL',
        // );

        // const countryCases = {
        //     confirmed:
        //         countryIdx !== -1
        //             ? parsedCountriesData[countryIdx].confirmed
        //             : 0,
        //     suspected:
        //         countryIdx !== -1
        //             ? parsedCountriesData[countryIdx].suspected
        //             : 0,
        // };

        // ukConfirmedCases += countryCases.confirmed;
        // ukSuspectedCases += countryCases.suspected;
        // ukCombinedCases += countryCases.confirmed + countryCases.suspected;

        // // delete country from the array
        // parsedCountriesData = parsedCountriesData.filter(
        //     (row) => row.name !== 'IRL',
        // );

        // parsedCountriesData.push({
        //     name: 'GBR',
        //     confirmed: ukConfirmedCases,
        //     suspected: ukSuspectedCases,
        //     combined: ukCombinedCases,
        // });

        // sort the data based on confirmed cases by default
        const countriesDataSorted = sortCountriesData(
            parsedCountriesData,
            DataType.Confirmed,
        );

        return countriesDataSorted;
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});

export const fetchTotalCases = createAsyncThunk<
    TotalCasesValues,
    void,
    { rejectValue: string }
>('app/fetchTotalCases', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_TOTAL_CASES_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching total cases number failed');

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});

export const fetchAppVersion = createAsyncThunk<
    string,
    void,
    { rejectValue: string }
>('app/fetchAppVersion', async (_, { rejectWithValue }) => {
    const env = process.env.REACT_APP_ENV as Env;
    const dataPortalUrl = getDataPortalUrl(env);

    try {
        const response = await fetch(`${dataPortalUrl}/version`);

        const versionBlob = await response.blob();
        const version = await versionBlob.text();

        return version;
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});

// Timesries data

// This is how the data is structured in json file
// it will be parsed to another format
interface TimeseriesDataRow {
    Date: string;
    Cases: number;
    Cumulative_cases: number;
    Country_ISO3: string;
}

interface TimeseriesCountsDataRow {
    Date: string;
    Cases: number;
    Cumulative_cases: number;
}

export const fetchTimeseriesData = createAsyncThunk<
    { data: TimeseriesCountryDataRow[]; dates: Date[] },
    void,
    { rejectValue: string }
>('app/fetchTimeseriesData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_TIMESERIES_COUNTRY_DATA;

    try {
        if (!dataUrl) throw new Error('Timeseries data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching timeseries country data failed');

        const jsonResponse = (await response.json()) as TimeseriesDataRow[];

        const allDates = jsonResponse.map((row) => row.Date);
        // get only unique dates
        let dates: string[] | Date[] = [...new Set(allDates)];
        // convert to array of dates
        dates = dates.map((date) => new Date(date));
        // sort dates
        dates.sort((date1, date2) => (isBefore(date1, date2) ? -1 : 1));

        const parsedTimeseriesData: TimeseriesCountryDataRow[] =
            jsonResponse.map((row) => {
                return {
                    date: new Date(row.Date),
                    country: row.Country_ISO3,
                    cases: row.Cases,
                    cumulativeCases: row.Cumulative_cases,
                };
            });

        return { data: parsedTimeseriesData, dates };
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});

export const fetchTimeseriesCountData = createAsyncThunk<
    TimeseriesCaseCountsDataRow[],
    void,
    { rejectValue: string }
>('app/fetchTimeseriesCountData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_TIMESERIES_COUNT_DATA;

    try {
        if (!dataUrl) throw new Error('Timeseries count data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching timeseries case counts data failed');

        const jsonResponse =
            (await response.json()) as TimeseriesCountsDataRow[];

        const parsedTimeseriesData: TimeseriesCaseCountsDataRow[] =
            jsonResponse.map((row) => {
                return {
                    date: new Date(row.Date),
                    cases: row.Cases,
                    cumulativeCases: row.Cumulative_cases,
                };
            });

        return parsedTimeseriesData;
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});
