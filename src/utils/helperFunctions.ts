import { CountryDataRow } from 'models/CountryData';

// Parses search query that takes user to Curator Portal
export const parseSearchQuery = (searchQuery: string): string => {
    const parsedQuery = searchQuery.includes(' ')
        ? `"${searchQuery}"`
        : searchQuery;

    const encodedQuery = encodeURIComponent(parsedQuery);

    return encodedQuery;
};

export const getCoveragePercentage = (countryData: CountryDataRow): number => {
    if (!countryData._id) return 0;

    const percentage = Math.floor(
        (countryData.casecount / countryData.jhu) * 100,
    );

    return percentage > 100 ? 100 : percentage;
};
