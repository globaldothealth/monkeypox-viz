import type { RootState } from 'redux/store';

export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectError = (state: RootState) => state.app.error;
export const selectCountriesData = (state: RootState) =>
    state.app.countriesData;
export const selectTotalCases = (state: RootState) =>
    state.app.totalNumberOfCases;
export const selectTotalCasesIsLoading = (state: RootState) =>
    state.app.isLoading;
export const selectSelectedCountryInSideBar = (state: RootState) =>
    state.app.selectedCountryInSideBar;
export const selectLastUpdateDate = (state: RootState) =>
    state.app.lastUpdateDate;
export const selectFreshnessData = (state: RootState) =>
    state.app.freshnessData;
export const selectFreshnessLoading = (state: RootState) =>
    state.app.freshnessLoading;
