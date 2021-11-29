import { createAsyncThunk } from '@reduxjs/toolkit';
import { CountryDataRow } from 'models/CountryViewModels';

// Fetch countries data from AWS S3 JSON file
export const fetchCountriesData = createAsyncThunk<
    CountryDataRow[],
    void,
    { rejectValue: string }
>('countryView/fetchCountriesData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_COUNTRY_VIEW_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        const jsonResponse = await response.json();

        const keys = Object.keys(jsonResponse);
        if (keys.length === 0) throw new Error('Wrong data format');
        const latestKey = keys[0];

        const countriesData = jsonResponse[latestKey] as CountryDataRow[];
        return countriesData;
    } catch (err: any) {
        if (err.response.message) return rejectWithValue(err.response.message);

        throw err;
    }
});
