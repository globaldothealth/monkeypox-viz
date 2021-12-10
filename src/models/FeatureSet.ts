export interface Feature {
    type: 'Feature';
    properties: {
        id: string;
        caseCount: number;
        country: string;
        region: string;
        search: string;
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
