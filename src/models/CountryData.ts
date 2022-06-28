export interface CountryDataRow {
    [key: string]: {
        suspected: number;
        confirmed: number;
    };
}

export interface ParsedCountryDataRow {
    name: string;
    suspected: number;
    confirmed: number;
    combined: number;
}

export interface TotalCasesValues {
    total: number;
    confirmed: number;
}

// Used by Autocomplete in the Sidebar
export interface SelectedCountry {
    name: string;
}

/**
 * Timeseries
 */
export interface TimeseriesCountryDataRow {
    date: Date;
    cases: number;
    cumulativeCases: number;
    country: string;
}

export interface TimeseriesCaseCountsDataRow {
    date: Date;
    cases: number;
    cumulativeCases: number;
}
