import iso from 'iso-3166-1';

// Parses search query that takes user to Curator Portal
export const parseSearchQuery = (searchQuery: string): string => {
    const parsedQuery = searchQuery.includes(' ')
        ? `"${searchQuery}"`
        : searchQuery;

    const encodedQuery = encodeURIComponent(parsedQuery);

    return encodedQuery;
};

export const getCountryCode = (countryName: string): string => {
    const countryObj = iso.whereCountry(countryName);

    // Manual overrides
    if (countryName === 'United Kingdom') return 'GB';
    if (countryName === 'England') return 'GB';
    if (countryName === 'Scotland') return 'GB';
    if (countryName === 'Wales') return 'GB';
    if (countryName === 'Northern Ireland') return 'GB';
    if (countryName === 'United States') return 'US';
    if (countryName === 'Kosovo') return 'XK';
    if (countryName === 'Iran') return 'IR';

    return countryObj ? countryObj.alpha2 : 'N/A';
};

export enum Env {
    Local = 'local',
    Dev = 'dev',
    Prod = 'prod',
    Qa = 'qa',
}

// Get data portal url based on current env
export const getDataPortalUrl = (env: Env) => {
    switch (env) {
        case Env.Local:
            return 'http://localhost:3002';
        case Env.Dev:
            return 'https://dev-data.covid-19.global.health';
        case Env.Qa:
            return 'https://qa-data.covid-19.global.health';
        case Env.Prod:
            return 'https://data.covid-19.global.health';
    }
};
