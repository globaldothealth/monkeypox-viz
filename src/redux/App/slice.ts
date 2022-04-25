import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchCountriesData,
    fetchTotalCases,
    fetchFreshnessData,
    fetchAppVersion,
} from './thunks';
import { fetchVariantsData } from 'redux/VariantsView/thunks';
import { fetchRegionalData } from 'redux/RegionalView/thunks';
import { fetchCompletenessData } from 'redux/CoverageView/thunks';
import { CountryDataRow, SelectedCountry } from 'models/CountryData';
import { ParsedFreshnessData } from 'models/FreshnessData';

interface IPopup {
    isOpen: boolean;
    countryCode: string;
}

interface AppState {
    isLoading: boolean;
    isMapLoading: boolean;
    error: string | undefined;
    countriesData: CountryDataRow[];
    totalNumberOfCases: number;
    selectedCountryInSideBar: SelectedCountry | undefined;
    lastUpdateDate: string;
    freshnessData: ParsedFreshnessData;
    freshnessLoading: boolean;
    appVersion: string | undefined;
    popup: IPopup;
}

const initialState: AppState = {
    isLoading: false,
    isMapLoading: false,
    error: undefined,
    countriesData: [],
    totalNumberOfCases: 0,
    selectedCountryInSideBar: undefined,
    lastUpdateDate: '',
    freshnessData: {},
    freshnessLoading: true,
    appVersion: undefined,
    popup: {
        isOpen: false,
        countryCode: '',
    },
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsMapLoading: (state, action: PayloadAction<boolean>) => {
            state.isMapLoading = action.payload;
        },
        setSelectedCountryInSidebar: (
            state,
            action: PayloadAction<SelectedCountry>,
        ) => {
            state.selectedCountryInSideBar = action.payload;
        },
        setLastUpdateDate: (state, action: PayloadAction<string>) => {
            state.lastUpdateDate = action.payload;
        },
        setPopup: (state, action: PayloadAction<IPopup>) => {
            state.popup = action.payload;
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

        // Freshness data
        builder.addCase(fetchFreshnessData.pending, (state) => {
            state.freshnessLoading = true;
            state.error = undefined;
        });
        builder.addCase(fetchFreshnessData.fulfilled, (state, { payload }) => {
            state.freshnessLoading = false;
            state.freshnessData = payload;
        });
        builder.addCase(fetchFreshnessData.rejected, (state, action) => {
            state.freshnessLoading = false;
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

        // Variants view (error handling)
        builder.addCase(fetchCompletenessData.pending, (state) => {
            state.error = undefined;
        });
        builder.addCase(fetchCompletenessData.rejected, (state, action) => {
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });

        builder.addCase(fetchAppVersion.fulfilled, (state, action) => {
            state.appVersion = action.payload;
        });
    },
});

export const {
    setIsMapLoading,
    setSelectedCountryInSidebar,
    setLastUpdateDate,
    setPopup,
} = appSlice.actions;

export default appSlice.reducer;
