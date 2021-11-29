import type { RootState } from 'redux/store';

export const selectIsLoading = (state: RootState) =>
    state.countryView.isLoading;
export const selectError = (state: RootState) => state.countryView.error;
export const selectCountriesData = (state: RootState) =>
    state.countryView.countriesData;
export const selectMapLoaded = (state: RootState) =>
    state.countryView.mapLoaded;
