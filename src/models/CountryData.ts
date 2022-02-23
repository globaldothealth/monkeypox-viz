export interface CountryDataRow {
    _id: string;
    casecount: number;
    jhu: number;
    code: string;
    lat: number;
    long: number;
}

export interface TotalCasesValues {
    total: number;
}

// Used by Autocomplete in the Sidebar
export interface SelectedCountry {
    _id: string;
    code: string;
}
