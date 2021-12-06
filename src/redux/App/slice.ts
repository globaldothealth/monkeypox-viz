import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCountriesData } from './thunks';
import { fetchVariantsData } from 'redux/VariantsView/thunks';
import { CountryDataRow } from 'models/CountryData';

interface AppState {
    isLoading: boolean;
    isMapLoading: boolean;
    error: string | undefined;
    countriesData: CountryDataRow[];
}

const initialState: AppState = {
    isLoading: false,
    isMapLoading: false,
    error: undefined,
    countriesData: [],
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsMapLoading: (state, action: PayloadAction<boolean>) => {
            state.isMapLoading = action.payload;
        },
    },
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

        // Variants view (error handling)
        builder.addCase(fetchVariantsData.pending, (state) => {
            state.error = undefined;
        });
        builder.addCase(fetchVariantsData.rejected, (state, action) => {
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });
    },
});

export const { setIsMapLoading } = appSlice.actions;

export default appSlice.reducer;
