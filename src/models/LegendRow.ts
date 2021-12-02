import { CountryViewColors, CoverageViewColors } from 'models/Colors';

export interface LegendRow {
    label: string;
    color: CountryViewColors | CoverageViewColors;
}
