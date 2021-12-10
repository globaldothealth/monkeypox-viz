import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegionalData } from 'models/RegionalData';

export const fetchRegionalData = createAsyncThunk<
    RegionalData[],
    void,
    { rejectValue: string }
>('regionalView/fetchRegionalData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_REGIONAL_VIEW_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching regional data failed');

        const jsonResponse = await response.json();

        const keys = Object.keys(jsonResponse);
        if (keys.length === 0) throw new Error('Wrong data format');
        const latestKey = keys[0];

        const regionalData = jsonResponse[latestKey] as RegionalData[];
        return regionalData;
    } catch (error: any) {
        if (!error.response) throw error;

        return rejectWithValue(error.response.message);
    }
});
