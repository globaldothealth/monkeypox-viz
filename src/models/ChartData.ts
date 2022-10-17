export interface ChartDataFormat {
    date: string;
    caseCount: number;
    caseMovingNDaysCount?: number;
    caseMovingNDaysCountCumulative?: number;
}
