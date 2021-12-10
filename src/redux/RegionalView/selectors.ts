import { RootState } from 'redux/store';

export const selectIsRegionalViewLoading = (state: RootState) =>
    state.regionalView.isLoading;
export const selectRegionalData = (state: RootState) =>
    state.regionalView.regionalData;
