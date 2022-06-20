import { LineChart, Line, XAxis, YAxis } from 'recharts';

export interface ChartDataFormat {
    date: string;
    caseCount: number;
}

export default function CaseChart() {
    const data: ChartDataFormat[] = [
        { date: '01-02-2022', caseCount: 0 },
        { date: '', caseCount: 50 },
        { date: '', caseCount: 150 },
        { date: '04-02-2022', caseCount: 400 },
    ];

    return (
        <LineChart width={300} height={200} data={data}>
            <Line type="monotone" dataKey="caseCount" stroke="#0094e2" />
            <XAxis dataKey="date" />
            <YAxis />
        </LineChart>
    );
}
