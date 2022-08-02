import type { RootState } from 'redux/store';

export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectIsCaseCountsLoading = (state: RootState) =>
    state.app.isCaseCountsLoading;
export const selectError = (state: RootState) => state.app.error;
export const selectCountriesData = (state: RootState) =>
    state.app.countriesData;
export const selectInitialCountriesData = (state: RootState) =>
    state.app.initialCountriesData;
export const selectTotalCasesNumber = (state: RootState) =>
    state.app.totalCasesNumber;
export const selectSelectedCountryInSideBar = (state: RootState) =>
    state.app.selectedCountryInSideBar;
export const selectLastUpdateDate = (state: RootState) =>
    state.app.lastUpdateDate;
export const selectAppVersion = (state: RootState) => state.app.appVersion;
export const selectPopupData = (state: RootState) => state.app.popup;
export const selectDataType = (state: RootState) => state.app.dataType;
export const selectTimeseriesCountryData = (state: RootState) =>
    state.app.timeseriesCountryData;
export const selectTimeseriesDates = (state: RootState) =>
    state.app.timeseriesDates;
export const selectCurrentDate = (state: RootState) => state.app.currentDate;
export const selectTimeseriesCaseCounts = (state: RootState) =>
    state.app.timeseriesCaseCounts;
