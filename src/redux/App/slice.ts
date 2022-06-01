import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCountriesData, fetchTotalCases, fetchAppVersion } from './thunks';
import { SelectedCountry, ParsedCountryDataRow } from 'models/CountryData';

interface IPopup {
    isOpen: boolean;
    countryName: string;
}

export enum DataType {
    Confirmed,
    Suspected,
}

interface AppState {
    isLoading: boolean;
    isMapLoading: boolean;
    error: string | undefined;
    countriesData: ParsedCountryDataRow[];
    totalNumberOfCases: number;
    selectedCountryInSideBar: SelectedCountry | null;
    lastUpdateDate: string;
    appVersion: string | undefined;
    popup: IPopup;
    dataType: DataType;
}

const initialState: AppState = {
    isLoading: false,
    isMapLoading: false,
    error: undefined,
    countriesData: [],
    totalNumberOfCases: 0,
    selectedCountryInSideBar: null,
    lastUpdateDate: '',
    appVersion: undefined,
    popup: {
        isOpen: false,
        countryName: '',
    },
    dataType: DataType.Confirmed,
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
            action: PayloadAction<SelectedCountry | null>,
        ) => {
            state.selectedCountryInSideBar = action.payload;
        },
        setLastUpdateDate: (state, action: PayloadAction<string>) => {
            state.lastUpdateDate = action.payload;
        },
        setPopup: (state, action: PayloadAction<IPopup>) => {
            state.popup = action.payload;
        },
        setDataType: (state, action: PayloadAction<DataType>) => {
            state.dataType = action.payload;
        },
        setCountriesData: (
            state,
            action: PayloadAction<ParsedCountryDataRow[]>,
        ) => {
            state.countriesData = action.payload;
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
    setDataType,
    setCountriesData,
} = appSlice.actions;

export default appSlice.reducer;
