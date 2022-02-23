import { createSlice } from '@reduxjs/toolkit';
import { RegionalData } from 'models/RegionalData';
import { fetchRegionalData } from './thunks';

interface RegionalViewState {
    isLoading: boolean;
    regionalData: RegionalData[];
}

const initialState: RegionalViewState = {
    isLoading: false,
    regionalData: [],
};

const regionalViewSlice = createSlice({
    name: 'regionalView',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRegionalData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchRegionalData.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.regionalData = payload;
        });
        builder.addCase(fetchRegionalData.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default regionalViewSlice.reducer;
