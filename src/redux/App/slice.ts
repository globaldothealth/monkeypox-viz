import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchCountriesData,
    fetchTotalCases,
    fetchAppVersion,
    fetchTimeseriesData,
    fetchTimeseriesCountData,
} from './thunks';
import {
    SelectedCountry,
    ParsedCountryDataRow,
    TotalCasesValues,
    TimeseriesCountryDataRow,
    TimeseriesCaseCountsDataRow,
} from 'models/CountryData';

interface IPopup {
    isOpen: boolean;
    countryName: string;
}

export enum DataType {
    Confirmed,
    Combined,
}

interface AppState {
    isLoading: boolean;
    isCaseCountsLoading: boolean;
    isMapLoading: boolean;
    error: string | undefined;
    countriesData: ParsedCountryDataRow[];
    initialCountriesData: ParsedCountryDataRow[];
    timeseriesCountryData: TimeseriesCountryDataRow[];
    timeseriesDates: Date[];
    timeseriesCaseCounts: TimeseriesCaseCountsDataRow[];
    currentDate: Date | undefined;
    totalCasesNumber: TotalCasesValues;
    selectedCountryInSideBar: SelectedCountry | null;
    lastUpdateDate: string;
    appVersion: string | undefined;
    popup: IPopup;
    dataType: DataType;
}

const initialState: AppState = {
    isLoading: false,
    isCaseCountsLoading: false,
    isMapLoading: false,
    error: undefined,
    countriesData: [],
    initialCountriesData: [],
    timeseriesCountryData: [],
    timeseriesDates: [],
    timeseriesCaseCounts: [],
    currentDate: undefined,
    totalCasesNumber: { total: 0, confirmed: 0 },
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
        setCurrentDate: (state, action: PayloadAction<Date>) => {
            state.currentDate = action.payload;
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
            state.initialCountriesData = payload;
        });
        builder.addCase(fetchCountriesData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });

        // Total Cases Count
        builder.addCase(fetchTotalCases.pending, (state) => {
            state.isCaseCountsLoading = true;
            state.error = undefined;
        });
        builder.addCase(fetchTotalCases.fulfilled, (state, { payload }) => {
            state.isCaseCountsLoading = false;
            state.totalCasesNumber = payload;
        });
        builder.addCase(fetchTotalCases.rejected, (state, action) => {
            state.isCaseCountsLoading = false;
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });

        // App version
        builder.addCase(fetchAppVersion.fulfilled, (state, action) => {
            state.appVersion = action.payload;
        });

        // Timeseries country data
        builder.addCase(fetchTimeseriesData.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        });
        builder.addCase(fetchTimeseriesData.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.timeseriesCountryData = payload.data;
            state.timeseriesDates = payload.dates;
        });
        builder.addCase(fetchTimeseriesData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });

        // Timeseries case counts data
        builder.addCase(fetchTimeseriesCountData.pending, (state) => {
            state.isCaseCountsLoading = true;
            state.error = undefined;
        });
        builder.addCase(
            fetchTimeseriesCountData.fulfilled,
            (state, { payload }) => {
                state.isCaseCountsLoading = false;
                state.timeseriesCaseCounts = payload;
            },
        );
        builder.addCase(fetchTimeseriesCountData.rejected, (state, action) => {
            state.isCaseCountsLoading = false;
            state.error = action.payload
                ? action.payload
                : action.error.message;
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
    setCurrentDate,
} = appSlice.actions;

export default appSlice.reducer;
