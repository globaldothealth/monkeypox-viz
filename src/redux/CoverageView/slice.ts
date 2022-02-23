import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompletenessData } from 'models/CompletenessData';
import { fetchCompletenessData } from './thunks';

interface CoverageViewState {
    isLoading: boolean;
    completenessData: CompletenessData;
    chosenCompletenessField: string;
}

const initialState: CoverageViewState = {
    isLoading: false,
    completenessData: {},
    chosenCompletenessField: 'cases',
};

const coverageViewSlice = createSlice({
    name: 'coverageView',
    initialState,
    reducers: {
        setChosenCompletenessField: (state, action: PayloadAction<string>) => {
            state.chosenCompletenessField = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCompletenessData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchCompletenessData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.completenessData = action.payload;
        });
        builder.addCase(fetchCompletenessData.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setChosenCompletenessField } = coverageViewSlice.actions;

export default coverageViewSlice.reducer;
