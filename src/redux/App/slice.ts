import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCountriesData, fetchTotalCases } from './thunks';
import { fetchVariantsData } from 'redux/VariantsView/thunks';
import { fetchRegionalData } from 'redux/RegionalView/thunks';
import { CountryDataRow } from 'models/CountryData';

interface AppState {
    isLoading: boolean;
    isMapLoading: boolean;
    error: string | undefined;
    countriesData: CountryDataRow[];
    totalNumberOfCases: number;
    selectedCountryInSideBar: string;
    lastUpdateDate: string;
}

const initialState: AppState = {
    isLoading: false,
    isMapLoading: false,
    error: undefined,
    countriesData: [],
    totalNumberOfCases: 0,
    selectedCountryInSideBar: '',
    lastUpdateDate: '',
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsMapLoading: (state, action: PayloadAction<boolean>) => {
            state.isMapLoading = action.payload;
        },
        setSelectedCountryInSidebar: (state, action: PayloadAction<string>) => {
            state.selectedCountryInSideBar = action.payload;
        },
        setLastUpdateDate: (state, action: PayloadAction<string>) => {
            state.lastUpdateDate = action.payload;
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

        // Total Cases Count
        builder.addCase(fetchTotalCases.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        });
        builder.addCase(fetchTotalCases.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.totalNumberOfCases = payload.total;
        });
        builder.addCase(fetchTotalCases.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
            ? action.payload
            : action.error.message;
        });


        // Regional view (error handling)
        builder.addCase(fetchRegionalData.pending, (state) => {
            state.error = undefined;
        });
        builder.addCase(fetchRegionalData.rejected, (state, action) => {
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });
    }
});

export const { setIsMapLoading, setSelectedCountryInSidebar, setLastUpdateDate } =
    appSlice.actions;

export default appSlice.reducer;
