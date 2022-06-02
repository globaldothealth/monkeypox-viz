import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    CountryDataRow,
    TotalCasesValues,
    ParsedCountryDataRow,
} from 'models/CountryData';
import { setLastUpdateDate } from './slice';
import { getDataPortalUrl, Env } from 'utils/helperFunctions';
import { format } from 'date-fns';

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
        const parsedDate = format(lastUpdateDate, 'E LLL d yyyy');
        dispatch(setLastUpdateDate(parsedDate));

        const latestKey = keys[0];

        const countriesData = jsonResponse[latestKey] as CountryDataRow[];

        // parse json that comes from S3 to a better format
        let parsedCountriesData: ParsedCountryDataRow[] = countriesData.map(
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
        parsedCountriesData = parsedCountriesData.filter(
            (countryData) => countryData.name !== 'United Kingdom',
        );

        // combine England and Scotland cases together as United Kingdom
        // this has to be done this way, as Mapbox source files that we use
        // doesn't differentiate Scotland and England
        const englandIdx = parsedCountriesData.findIndex(
            (country) => country.name === 'England',
        );
        const scotlandIdx = parsedCountriesData.findIndex(
            (country) => country.name === 'Scotland',
        );

        if (englandIdx !== -1 && scotlandIdx !== -1) {
            const combinedConfirmedCases =
                parsedCountriesData[englandIdx].confirmed +
                parsedCountriesData[scotlandIdx].confirmed;
            const combinedSuspectedCases =
                parsedCountriesData[englandIdx].suspected +
                parsedCountriesData[scotlandIdx].suspected;

            parsedCountriesData.push({
                name: 'United Kingdom',
                confirmed: combinedConfirmedCases,
                suspected: combinedSuspectedCases,
                combined: combinedConfirmedCases + combinedSuspectedCases,
            });

            // delete England and Scotland from the array
            parsedCountriesData = parsedCountriesData.filter(
                (country) =>
                    country.name !== 'England' && country.name !== 'Scotland',
            );
        }

        // sort the data based on confirmed cases
        const countriesDataSorted = parsedCountriesData.sort((a, b) =>
            a.confirmed < b.confirmed ? 1 : -1,
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
