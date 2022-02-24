import { createAsyncThunk } from '@reduxjs/toolkit';
import { CompletenessData } from 'models/CompletenessData';

export const fetchCompletenessData = createAsyncThunk<
    CompletenessData,
    void,
    { rejectValue: string }
>('coverageView/fetchCompletenessData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_COMPLETENESS_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching countries data failed');

        const jsonResponse = (await response.json()) as CompletenessData;

        //Parse completeness data and filter out broken ones
        const completenessData: CompletenessData = {};
        const keys = Object.keys(jsonResponse);

        for (const key of keys) {
            if (jsonResponse[key] !== null) {
                completenessData[key] = jsonResponse[key];
            }
        }

        return completenessData;
    } catch (error: any) {
        if (error.response) return rejectWithValue(error.response.message);

        throw error;
    }
});
