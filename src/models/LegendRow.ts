import {
    CountryViewColors,
    CoverageViewColors,
    VariantsFillColors,
} from 'models/Colors';

export interface LegendRow {
    label: string;
    color: CountryViewColors | CoverageViewColors | VariantsFillColors;
}
