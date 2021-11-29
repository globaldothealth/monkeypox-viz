import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCountriesData } from './thunks';
import { CountryDataRow } from 'models/CountryViewModels';

interface CountryViewState {
    isLoading: boolean;
    error: string | undefined;
    countriesData: CountryDataRow[];
    mapLoaded: boolean;
}

const initialState: CountryViewState = {
    isLoading: false,
    error: undefined,
    countriesData: [],
    mapLoaded: false,
};

export const countryViewSlice = createSlice({
    name: 'countryView',
    initialState,
    reducers: {
        setMapLoaded: (state, action: PayloadAction<boolean>) => {
            state.mapLoaded = action.payload;
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
    },
});

export const { setMapLoaded } = countryViewSlice.actions;

export default countryViewSlice.reducer;
