import { RootState } from 'redux/store';

export const selectChartDatePeriod = (state: RootState) =>
    state.chartView.chartDatePeriod;

export const selectChartData = (state: RootState) => state.chartView.chartData;
export const selectAvailableDates = (state: RootState) =>
    state.chartView.availableDates;
