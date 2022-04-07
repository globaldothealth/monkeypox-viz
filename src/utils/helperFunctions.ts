import { parse, isAfter, format, parseISO } from 'date-fns';
import { CountryDataRow } from 'models/CountryData';
import { VariantsDataRow, VariantsLabels } from 'models/VariantsData';
import { statesList, StatesData, DataStatus } from 'data/statesData';
import { RegionalData } from 'models/RegionalData';
import { Feature, FeatureSet } from 'models/FeatureSet';
import { FreshnessData, ParsedFreshnessData } from 'models/FreshnessData';
import iso from 'iso-3166-1';

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

// Regional data has to be converted to GeoJson type in order to be displayed on the map
export const convertRegionalDataToFeatureSet = (
    data: RegionalData[],
    freshnessData: ParsedFreshnessData,
): FeatureSet => {
    const featureSet: FeatureSet = { type: 'FeatureCollection', features: [] };

    for (const dataRow of data) {
        const feature: Feature = {
            type: 'Feature',
            properties: {
                id: dataRow._id,
                caseCount: dataRow.casecount,
                country: dataRow.country_code,
                region: dataRow._id,
                search: dataRow.search,
                admin1: dataRow.admin1,
                admin2: dataRow.admin2,
                admin3: dataRow.admin3,
                lastUploadDate:
                    freshnessData[dataRow.country_code] || 'unknown',
            },
            geometry: {
                type: 'Point',
                coordinates: [dataRow.long, dataRow.lat],
            },
        };

        featureSet.features.push(feature);
    }

    return featureSet;
};

/**
 * Variant Reporting helper functions
 */
export enum BreakthroughStatus {
    Yes = 1,
    No = 0,
    ToBeDetemined = '',
}

export const getNonUsData = (data: VariantsDataRow[]): VariantsDataRow[] => {
    return data.filter((row) => row.code !== 'USA');
};

// Get only the most recent data for each country from the list
export const getMostRecentCountryData = (data: VariantsDataRow[]) => {
    const dataWithAnyInfo = getNonUsData(data);

    const locations: string[] = [];
    dataWithAnyInfo.forEach((row) => {
        locations.push(row.location);
    });

    // Remove all duplicates from locations array
    const uniqueLocations = Array.from(new Set(locations));

    // For each unique location get the most recent data
    const recentData: VariantsDataRow[] = [];

    uniqueLocations.forEach((location) => {
        const locationArray = dataWithAnyInfo.filter(
            (row) => row.location === location,
        );
        let mostRecentDate = parse(
            locationArray[0].epi_date,
            'dd.MM.yyyy',
            new Date(),
        );
        let mostRecentRowIndex = 0;

        locationArray.forEach((item, idx) => {
            const date = parse(item.epi_date, 'dd.MM.yyyy', new Date());
            if (isAfter(date, mostRecentDate)) {
                mostRecentDate = date;
                mostRecentRowIndex = idx;
            }
        });

        recentData.push(locationArray[mostRecentRowIndex]);
    });

    return recentData;
};

// Get only the most recent data for each US state from the list
export const getMostRecentStatesData = (
    data: VariantsDataRow[],
): VariantsDataRow[] => {
    // Get states data with any info
    const statesNames = statesList.map((state) => state.name);
    const stateRowsWithVocData = data.filter(
        (row) => statesNames.includes(row.location) && row.code === 'USA',
    );

    // Get the most recent data
    const recentData: VariantsDataRow[] = [];

    statesNames.forEach((name) => {
        const locationArray = stateRowsWithVocData.filter(
            (row) => row.location === name,
        );

        if (locationArray.length > 0) {
            let mostRecentDate = parse(
                locationArray[0].epi_date,
                'dd.MM.yyyy',
                new Date(),
            );
            let mostRecentRowIndex = 0;

            locationArray.forEach((item, idx) => {
                const date = parse(item.epi_date, 'dd.MM.yyyy', new Date());
                if (isAfter(date, mostRecentDate)) {
                    mostRecentDate = date;
                    mostRecentRowIndex = idx;
                }
            });

            recentData.push(locationArray[mostRecentRowIndex]);
        }
    });

    return recentData;
};

// Get list of all available VOC's from the spreadsheet (hardcoded for now)
export const getVocList = (data: VariantsDataRow[]) => {
    const keys = Object.keys(data[0]);
    const vocList = keys.slice(12, 65);

    return vocList;
};

// Get list of country codes
export const getCountryCodes = (countries: VariantsDataRow[]) => {
    return countries.map((country) => country.code);
};

// Sort data based on VOC info availability and variant name
export const sortData = (
    data: VariantsDataRow[],
    variantName: string,
): {
    countriesWithData: string[];
    countriesWithoutData: string[];
    countriesNotChecked: string[];
} => {
    let filteredCountries = data.filter(
        (dataRow) => dataRow[variantName] === DataStatus.CheckedHasData,
    );
    const countriesWithData = filteredCountries.map((country) => country.code);

    filteredCountries = data.filter(
        (dataRow) => dataRow[variantName] === DataStatus.CheckedNoData,
    );
    const countriesWithoutData = filteredCountries.map(
        (country) => country.code,
    );

    filteredCountries = data.filter(
        (dataRow) => dataRow[variantName] === DataStatus.NotChecked,
    );
    const countriesNotChecked = filteredCountries.map(
        (country) => country.code,
    );

    return { countriesWithData, countriesWithoutData, countriesNotChecked };
};

export const getBreakthroughStatusName = (
    status: BreakthroughStatus,
): string => {
    switch (status) {
        case BreakthroughStatus.Yes:
            return 'Yes';

        case BreakthroughStatus.No:
            return 'No';

        case BreakthroughStatus.ToBeDetemined:
            return 'To be determined';

        default:
            return '-';
    }
};

// Get source URL and date for specific country
export const getDetailedData = (
    dataList: VariantsDataRow[],
    location: string,
): {
    countryName: string;
    sourceUrl: string;
    dateChecked: string;
    breakthrough: string;
} => {
    const chosenCountry = dataList.filter(
        (dataRow) => dataRow.code === location || dataRow.location === location,
    );

    const breakthroughStatus = chosenCountry[0]
        .breakthrough_status as BreakthroughStatus;
    const breakthrough = getBreakthroughStatusName(breakthroughStatus);

    return {
        sourceUrl: chosenCountry[0].source_url,
        countryName: chosenCountry[0].location,
        dateChecked: chosenCountry[0].epi_date,
        breakthrough,
    };
};

// Prepare data from spreadsheet to display US states on the map
export const sortStatesData = (
    data: VariantsDataRow[],
    variantName: string,
): {
    statesWithData: string[];
    statesWithoutData: string[];
    statesNotChecked: string[];
} => {
    // Prepare states data in correct format for Mapbox data join
    const statesData: StatesData[] = [];
    data.forEach((row) => {
        const state = statesList.find((state) => state.name === row.location);
        const stateId = (state && state.stateId) || '00';

        switch (row[variantName]) {
            case DataStatus.CheckedHasData:
                statesData.push({
                    stateId,
                    status: DataStatus.CheckedHasData,
                });
                break;

            case DataStatus.CheckedNoData:
                statesData.push({
                    stateId,
                    status: DataStatus.CheckedNoData,
                });
                break;

            case DataStatus.NotChecked:
                statesData.push({
                    stateId,
                    status: DataStatus.NotChecked,
                });
                break;

            default:
                break;
        }
    });

    let filteredStates = statesData.filter(
        (dataRow) => dataRow.status === DataStatus.CheckedHasData,
    );
    const statesWithData = filteredStates.map((row) => row.stateId);

    filteredStates = statesData.filter(
        (dataRow) => dataRow.status === DataStatus.CheckedNoData,
    );
    const statesWithoutData = filteredStates.map((row) => row.stateId);

    filteredStates = statesData.filter(
        (dataRow) => dataRow.status === DataStatus.NotChecked,
    );
    const statesNotChecked = filteredStates.map((row) => row.stateId);

    return { statesWithData, statesWithoutData, statesNotChecked };
};

// Parse variant data from Google spreadsheet
export const parseVariantData = (
    data: VariantsLabels[],
): {
    vocList: { pango: string; whoLabel: string }[];
    voiList: { pango: string; whoLabel: string }[];
} => {
    const voc = data.filter((el) => el['is VoI'].trim() === '0');
    const voi = data.filter((el) => el['is VoI'].trim() === '1');

    const vocList = voc.map((vocEl) => {
        return {
            pango: vocEl['Pango lineage'].trim(),
            whoLabel: vocEl['WHO label'].trim(),
        };
    });
    const voiList = voi.map((voiEl) => {
        return {
            pango: voiEl['Pango lineage'].trim(),
            whoLabel: voiEl['WHO label'].trim(),
        };
    });

    return { vocList, voiList };
};

export const parseFreshnessData = (
    freshnessData: FreshnessData,
): ParsedFreshnessData => {
    const countries = Object.keys(freshnessData);
    const parsedData: ParsedFreshnessData = {};

    for (const country of countries) {
        const uploads = freshnessData[country];
        const filteredUploads = uploads.filter((el) => el.last_upload !== null);

        if (filteredUploads.length !== 0) {
            // Find the most recent uload date for each country
            let mostRecentDate = Date.parse(
                filteredUploads[0].last_upload || '',
            );

            for (const upload of filteredUploads) {
                const parsedDate = Date.parse(upload.last_upload || '');

                if (isAfter(parsedDate, mostRecentDate)) {
                    mostRecentDate = parsedDate;
                }
            }

            parsedData[country] = format(mostRecentDate, 'dd MMM yyyy');
        }
    }

    return parsedData;
};

export const convertStringDateToDate = (date: string) => {
    let finalDate;
    try {
        finalDate = JSON.parse(date);
        finalDate = format(parseISO(finalDate), 'E LLL d yyyy');
    } catch (e) {
        finalDate = 'loading date';
    }

    return finalDate;
};

export const getCountryName = (countryCode: string): string => {
    const countryObj = iso.whereAlpha2(countryCode);

    // Kosovo is not available in the library
    if (countryCode === 'XK') return 'Kosovo';
    if (countryCode === 'TW') return 'Taiwan';

    return countryObj ? countryObj.country : countryCode;
};
