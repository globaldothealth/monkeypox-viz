import { RootState } from 'redux/store';

export const selectIsLoading = (state: RootState) =>
    state.variantsView.isLoading;
export const selectVariantsData = (state: RootState) =>
    state.variantsView.variantsData;
export const selectChosenVariant = (state: RootState) =>
    state.variantsView.chosenVariant;
export const selectChosenVariantType = (state: RootState) =>
    state.variantsView.chosenVariantType;
