import { LineChart, Line, XAxis, YAxis } from 'recharts';

export interface ChartDataFormat {
    date: string;
    caseCount: number;
}

interface CaseChartProps {
    data: ChartDataFormat[];
}

export default function CaseChart({ data }: CaseChartProps) {
    return (
        <LineChart width={300} height={200} data={data}>
            <Line
                type="monotone"
                dataKey="caseCount"
                stroke="#0094e2"
                dot={false}
            />
            <XAxis
                dataKey="date"
                tickLine={false}
                interval="preserveStartEnd"
            />
            <YAxis />
        </LineChart>
    );
}
