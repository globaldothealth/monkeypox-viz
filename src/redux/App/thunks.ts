import { createAsyncThunk } from '@reduxjs/toolkit';
import { CountryDataRow, TotalCasesValues } from 'models/CountryData';
import { FreshnessData, ParsedFreshnessData } from 'models/FreshnessData';
import { setLastUpdateDate } from './slice';
import {
    parseFreshnessData,
    getDataPortalUrl,
    Env,
} from 'utils/helperFunctions';
import { parse } from 'date-fns';

// Fetch countries data from AWS S3 JSON file
export const fetchCountriesData = createAsyncThunk<
    CountryDataRow[],
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

        const lastUpdateDate = Object.keys(jsonResponse)[0];
        const parsedDate = parse(lastUpdateDate, 'MM-dd-yyyy', new Date());
        dispatch(setLastUpdateDate(JSON.stringify(parsedDate)));

        const keys = Object.keys(jsonResponse);
        if (keys.length === 0) throw new Error('Wrong data format');
        const latestKey = keys[0];

        const countriesData = jsonResponse[latestKey] as CountryDataRow[];
        const countriesDataSorted = countriesData
            .filter(
                (item) => item._id != null && item.code && item.code !== 'ZZ',
            )
            .sort((a, b) => (a.casecount < b.casecount ? 1 : -1));
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

export const fetchFreshnessData = createAsyncThunk<
    ParsedFreshnessData,
    void,
    { rejectValue: string }
>('app/fetchFreshnessData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_FRESHNESS_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching freshness data failed');

        const freshnessData = (await response.json()) as FreshnessData;

        const parsedFreshnessData = parseFreshnessData(freshnessData);

        return parsedFreshnessData;
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
