import {
    CountryViewColors,
    CoverageViewColors,
    VariantsFillColors,
    RegionalViewColors,
} from 'models/Colors';

export interface LegendRow {
    label: string;
    color:
        | CountryViewColors
        | CoverageViewColors
        | VariantsFillColors
        | RegionalViewColors;
}
