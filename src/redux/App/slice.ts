import { createSlice } from '@reduxjs/toolkit';
import { fetchCountriesData } from './thunks';
import { CountryDataRow } from 'models/CountryData';

interface AppState {
    isLoading: boolean;
    error: string | undefined;
    countriesData: CountryDataRow[];
}

const initialState: AppState = {
    isLoading: false,
    error: undefined,
    countriesData: [],
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCountriesData.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        });
        builder.addCase(fetchCountriesData.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.countriesData = payload;
        });
        builder.addCase(fetchCountriesData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });
    },
});

export default appSlice.reducer;
