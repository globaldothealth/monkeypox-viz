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
}

export interface TotalCasesValues {
    total: number;
}

// Used by Autocomplete in the Sidebar
export interface SelectedCountry {
    name: string;
}
