import { RootState } from 'redux/store';

export const selectIsLoading = (state: RootState) =>
    state.coverageView.isLoading;

export const selectCompletenessData = (state: RootState) =>
    state.coverageView.completenessData;

export const selectChosenCompletenessField = (state: RootState) =>
    state.coverageView.chosenCompletenessField;
