import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChartViewState {
    chartDatePeriod: number[];
}

const initialState: ChartViewState = {
    chartDatePeriod: [10, 20],
};

const chartViewSlice = createSlice({
    name: 'chartView',
    initialState,
    reducers: {
        setChartDatePeriod: (state, action: PayloadAction<number[]>) => {
            state.chartDatePeriod = action.payload;
        },
    },
});

export const { setChartDatePeriod } = chartViewSlice.actions;

export default chartViewSlice.reducer;
