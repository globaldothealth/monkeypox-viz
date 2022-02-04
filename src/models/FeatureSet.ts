export interface Feature {
    type: 'Feature';
    properties: {
        id: string;
        caseCount: number;
        country: string;
        region: string;
        search: string;
        admin1: string | undefined;
        admin2: string | undefined;
        admin3: string | undefined;
        lastUploadDate: string;
    };
    geometry: {
        type: 'Point';
        coordinates: number[];
    };
}

export interface FeatureSet {
    type: 'FeatureCollection';
    features: Feature[];
}
