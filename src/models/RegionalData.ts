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
    lat: number;
    long: number;
    search: SearchResolution;
}
