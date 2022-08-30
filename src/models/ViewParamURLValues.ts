import { ChartTypeNames } from 'containers/ChartView/index';
import { DataType } from '../redux/App/slice';
export interface ViewParamURLValues {
    name?: string;
    startDate?: number;
    endDate?: number;
    currDate?: number;
    lng?: number;
    lat?: number;
    zoom?: number;
    chartType?: ChartTypeNames;
    dataType?: DataType;
}
