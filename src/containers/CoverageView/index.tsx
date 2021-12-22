import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, { MapSourceDataEvent, EventData, LngLatLike } from 'mapbox-gl';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { MapContainer } from 'theme/globalStyles';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import {
    selectCountriesData,
    selectIsLoading,
    selectSelectedCountryInSideBar,
} from 'redux/App/selectors';
import {
    selectCompletenessData,
    selectChosenCompletenessField,
    selectIsLoading as selectCoverageViewLoading,
} from 'redux/CoverageView/selectors';
import { fetchCompletenessData } from 'redux/CoverageView/thunks';
import Loader from 'components/Loader';
import { parseSearchQuery, getCoveragePercentage } from 'utils/helperFunctions';
import countryLookupTable from 'data/admin0-lookup-table.json';
import { CoverageViewColors } from 'models/Colors';
import MapPopup from 'components/MapPopup';
import { LegendRow } from 'models/LegendRow';
import { CountryDataRow } from 'models/CountryData';
import Legend from 'components/Legend';
import iso from 'iso-3166-1';

import { PopupContentText, BorderLinearProgress } from './styled';

const dataLayers: LegendRow[] = [
    { label: '< 20%', color: CoverageViewColors['20%'] },
    { label: '20-40%', color: CoverageViewColors['40%'] },
    { label: '40-60%', color: CoverageViewColors['60%'] },
    { label: '60-80%', color: CoverageViewColors['80%'] },
    { label: '> 80%', color: CoverageViewColors['>80%'] },
];

const CoverageView: React.FC = () => {
    const dispatch = useAppDispatch();
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
    const dataPortalUrl = process.env.REACT_APP_DATA_PORTAL_URL;

    const countriesData = useAppSelector(selectCountriesData);
    const isLoading = useAppSelector(selectIsLoading);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const isCoverageViewLoading = useAppSelector(selectCoverageViewLoading);
    const completenessData = useAppSelector(selectCompletenessData);
    const chosenCompletenessField = useAppSelector(
        selectChosenCompletenessField,
    );

    const [mapLoaded, setMapLoaded] = useState(false);
    const [featureIds, setFeatureIds] = useState<number[]>([]);

    const chosenCompletenessFieldRef = useRef('cases');
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const lookupTableData = countryLookupTable.adm0.data.all as {
        [key: string]: any;
    };

    useEffect(() => {
        dispatch(fetchCompletenessData());
    }, []);

    // Fly to country
    useEffect(() => {
        if (selectedCountry) {
            const getCountryCoordinates = (contriesList: CountryDataRow[]) => {
                const finalCountry = contriesList.filter(
                    (el) => el.code === selectedCountry,
                );
                return {
                    center: [
                        finalCountry[0].long,
                        finalCountry[0].lat,
                    ] as LngLatLike,
                    zoom: 5,
                };
            };
            map.current?.flyTo(getCountryCoordinates(countriesData));
        }
    }, [selectedCountry]);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef || isLoading) return;

        mapRef.on('load', () => {
            if (mapRef.getSource('countriesData')) {
                mapRef.removeSource('countriesData');
            }

            mapRef.addSource('countriesData', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1',
            });

            // Setup map listener to check if map has loaded
            const setAfterSourceLoaded = (
                e: MapSourceDataEvent & EventData,
            ) => {
                if (e.sourceID !== 'countriesData' && !e.isSourceLoaded) return;
                setMapLoaded(true);
                displayCoverageData();
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (mapRef.isSourceLoaded('countriesData')) {
                setMapLoaded(true);
                displayCoverageData();
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, [isLoading]);

    const setMapState = () => {
        const mapRef = map.current;
        if (!mapRef) return;

        if (featureIds.length > 0) {
            for (const id of featureIds) {
                mapRef.removeFeatureState({
                    source: 'countriesData',
                    sourceLayer: 'country_boundaries',
                    id,
                });
            }
        }

        setTimeout(() => {
            const ids: number[] = [];
            if (chosenCompletenessField === 'cases') {
                for (const countryRow of countriesData) {
                    if (lookupTableData[countryRow.code]) {
                        const coveragePercentage =
                            getCoveragePercentage(countryRow);

                        mapRef.setFeatureState(
                            {
                                source: 'countriesData',
                                sourceLayer: 'country_boundaries',
                                id: lookupTableData[countryRow.code].feature_id,
                            },
                            {
                                caseCount: countryRow.casecount,
                                totalCases: countryRow.jhu,
                                name: countryRow._id,
                                lat: countryRow.lat,
                                long: countryRow.long,
                                coverage: coveragePercentage,
                            },
                        );

                        ids.push(lookupTableData[countryRow.code].feature_id);
                    }
                }
            } else {
                for (const row of completenessData) {
                    const country = iso.whereCountry(
                        row.country.replace('_', ' '),
                    );
                    const countryCode = country?.alpha2;

                    if (countryCode && lookupTableData[countryCode]) {
                        const coverage = Math.round(
                            row[chosenCompletenessField] as number,
                        );

                        mapRef.setFeatureState(
                            {
                                source: 'countriesData',
                                sourceLayer: 'country_boundaries',
                                id: lookupTableData[countryCode].feature_id,
                            },
                            {
                                name: country.country,
                                lat: lookupTableData[countryCode].centroid[1],
                                long: lookupTableData[countryCode].centroid[0],
                                coverage,
                            },
                        );

                        ids.push(lookupTableData[countryCode].feature_id);
                    }
                }
            }

            setFeatureIds(ids);
        });
    };

    const mapClickListener = useCallback((e: any) => {
        const mapRef = map.current;
        if (
            !e.features ||
            !e.features[0].properties ||
            !e.features[0].state.name ||
            !mapRef
        )
            return;

        const caseCount = e.features[0].state.caseCount || 0;
        const totalCases = e.features[0].state.totalCases;
        const countryName = e.features[0].state.name;
        const coverage = e.features[0].state.coverage;

        const lat = e.features[0].state.lat;
        const lng = e.features[0].state.long;
        const coordinates: mapboxgl.LngLatLike = { lng, lat };

        const searchQuery = `cases?country=${parseSearchQuery(countryName)}`;
        const url = `${dataPortalUrl}/${searchQuery}`;

        const popupContent = (
            <>
                {chosenCompletenessFieldRef.current === 'cases' && (
                    <PopupContentText>
                        ({caseCount.toLocaleString()} out of{' '}
                        {totalCases.toLocaleString()})
                    </PopupContentText>
                )}

                <BorderLinearProgress variant="determinate" value={coverage} />
            </>
        );

        // This has to be done this way in order to allow for React components as a content of the popup
        const popupElement = document.createElement('div');
        ReactDOM.render(
            <MapPopup
                title={`${countryName} ${coverage}%`}
                content={popupContent}
                buttonText="Explore Country Data"
                buttonUrl={url}
            />,
            popupElement,
        );

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(popupElement)
            .addTo(mapRef);
    }, []);

    const mouseEnterHandler = useCallback(() => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
    }, []);

    const mouseLeaveHandler = useCallback(() => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
    }, []);

    // Display countries data on the map
    const displayCoverageData = () => {
        const mapRef = map.current;
        if (!countriesData || countriesData.length === 0 || !mapRef) return;

        setMapState();

        // This fixes console errors when hot reloading app
        if (mapRef.getLayer('countries-join')) {
            mapRef.off('click', 'countries-join', mapClickListener);
            mapRef.off('mouseenter', 'countries-join', mouseEnterHandler);
            mapRef.off('mouseleave', 'countries-join', mouseLeaveHandler);
            mapRef.removeLayer('countries-join');
        }

        mapRef.addLayer(
            {
                id: 'countries-join',
                type: 'fill',
                source: 'countriesData',
                'source-layer': 'country_boundaries',
                paint: {
                    'fill-color': [
                        'case',
                        ['!=', ['feature-state', 'coverage'], null],
                        [
                            'case',
                            ['<', ['feature-state', 'coverage'], 20],
                            CoverageViewColors['20%'],
                            ['<', ['feature-state', 'coverage'], 40],
                            CoverageViewColors['40%'],
                            ['<', ['feature-state', 'coverage'], 60],
                            CoverageViewColors['60%'],
                            ['<', ['feature-state', 'coverage'], 80],
                            CoverageViewColors['80%'],
                            ['>=', ['feature-state', 'coverage'], 80],
                            CoverageViewColors['>80%'],
                            CoverageViewColors.Fallback,
                        ],
                        CoverageViewColors.Fallback,
                    ],
                    'fill-outline-color': CoverageViewColors.Outline,
                },
            },
            'waterway-label',
        );

        // Change the mouse cursor to pointer when hovering above this layer
        mapRef.on('mouseenter', 'countries-join', mouseEnterHandler);

        // Change it back when it leaves.
        mapRef.on('mouseleave', 'countries-join', mouseLeaveHandler);

        mapRef.on('click', 'countries-join', mapClickListener);
    };

    // Update map whenever chosenCompletenessField changes
    useEffect(() => {
        if (!chosenCompletenessField || !mapLoaded) return;

        chosenCompletenessFieldRef.current = chosenCompletenessField;
        displayCoverageData();
    }, [chosenCompletenessField]);

    return (
        <>
            {(!mapLoaded || isCoverageViewLoading) && <Loader />}
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded || isCoverageViewLoading}
            />
            <Legend title="Coverage" legendRows={dataLayers} />
        </>
    );
};

export default CoverageView;
