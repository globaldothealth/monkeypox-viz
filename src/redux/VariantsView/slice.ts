import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VariantsDataRow, VariantType } from 'models/VariantsData';
import { fetchVariantsData } from './thunks';

interface VariantsViewState {
    isLoading: boolean;
    variantsData: VariantsDataRow[];
    chosenVariantType: VariantType;
    chosenVariant: string;
}

const initialState: VariantsViewState = {
    isLoading: false,
    variantsData: [],
    chosenVariantType: VariantType.Voc,
    chosenVariant: '',
};

const variantsViewSlice = createSlice({
    name: 'variantsView',
    initialState,
    reducers: {
        setChosenVariantType: (state, action: PayloadAction<VariantType>) => {
            state.chosenVariantType = action.payload;
        },
        setChosenVariant: (state, action: PayloadAction<string>) => {
            state.chosenVariant = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVariantsData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchVariantsData.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.variantsData = payload;
        });
        builder.addCase(fetchVariantsData.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setChosenVariant, setChosenVariantType } =
    variantsViewSlice.actions;

export default variantsViewSlice.reducer;
