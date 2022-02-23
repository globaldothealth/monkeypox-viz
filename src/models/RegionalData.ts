export enum SearchResolution {
    Country = 'country',
    Admin1 = 'admin1',
    Admin2 = 'admin2',
    Admin3 = 'admin3',
}

export interface RegionalData {
    _id: string;
    casecount: number;
    country: string;
    country_code: string;
    lat: number;
    long: number;
    admin1: string | undefined;
    admin2: string | undefined;
    admin3: string | undefined;
    search: SearchResolution;
}
