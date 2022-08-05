import { RootState } from 'redux/store';

export const selectChartDatePeriod = (state: RootState) =>
    state.chartView.chartDatePeriod;
