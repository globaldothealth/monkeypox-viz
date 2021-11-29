import { LegendRow } from 'models/LegendRow';
import { LegendContainer, Title, Row, ColorSample, Label } from './styled';

interface LegendProps {
    title: string;
    legendRows: LegendRow[];
}

const Legend: React.FC<LegendProps> = ({ title, legendRows }: LegendProps) => {
    return (
        <LegendContainer>
            <Title>{title}</Title>

            {legendRows.map((row) => (
                <Row key={row.label}>
                    <ColorSample color={row.color} />
                    <Label>{row.label}</Label>
                </Row>
            ))}
        </LegendContainer>
    );
};

export default Legend;
