import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCountriesData, fetchTotalCases, fetchAppVersion } from './thunks';
import { SelectedCountry, ParsedCountryDataRow } from 'models/CountryData';

interface IPopup {
    isOpen: boolean;
    countryName: string;
}

interface AppState {
    isLoading: boolean;
    isMapLoading: boolean;
    error: string | undefined;
    countriesData: ParsedCountryDataRow[];
    totalNumberOfCases: number;
    selectedCountryInSideBar: SelectedCountry | undefined;
    lastUpdateDate: string;
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
    appVersion: undefined,
    popup: {
        isOpen: false,
        countryName: '',
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
        // Country view data
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

        // App version
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
