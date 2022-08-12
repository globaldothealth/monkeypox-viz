import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartDataFormat } from 'models/ChartData';

interface ChartViewState {
    chartDatePeriod: number[];
    chartData: ChartDataFormat[];
    availableDates: Date[];
}

const initialState: ChartViewState = {
    chartDatePeriod: [10, 20],
    chartData: [],
    availableDates: [],
};

const chartViewSlice = createSlice({
    name: 'chartView',
    initialState,
    reducers: {
        setChartDatePeriod: (state, action: PayloadAction<number[]>) => {
            state.chartDatePeriod = action.payload;
        },
        setChartData: (state, action: PayloadAction<ChartDataFormat[]>) => {
            state.chartData = action.payload;
        },
        setAvailableDates: (state, action: PayloadAction<Date[]>) => {
            state.availableDates = action.payload;
        },
    },
});

export const { setChartDatePeriod, setChartData, setAvailableDates } =
    chartViewSlice.actions;

export default chartViewSlice.reducer;
