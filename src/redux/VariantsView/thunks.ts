import { createAsyncThunk } from '@reduxjs/toolkit';
import { VariantsDataRow } from 'models/VariantsData';

export const fetchVariantsData = createAsyncThunk<
    VariantsDataRow[],
    void,
    { rejectValue: string }
>('/variantsView/fetchVariantsData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_VARIANT_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching variants data failed');

        const jsonResponse = (await response.json()) as VariantsDataRow[];
        return jsonResponse;
    } catch (error: any) {
        if (!error.response) throw error;

        return rejectWithValue(error.response.message);
    }
});
