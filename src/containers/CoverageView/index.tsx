import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, { MapSourceDataEvent, EventData, LngLatLike } from 'mapbox-gl';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { MapContainer } from 'theme/globalStyles';
import { useAppSelector } from 'redux/hooks';
import {
    selectCountriesData,
    selectIsLoading,
    selectSelectedCountryInSideBar,
} from 'redux/App/selectors';
import Loader from 'components/Loader';
import { parseSearchQuery, getCoveragePercentage } from 'utils/helperFunctions';
import countryLookupTable from 'data/admin0-lookup-table.json';
import { CoverageViewColors } from 'models/Colors';
import MapPopup from 'components/MapPopup';
import { LegendRow } from 'models/LegendRow';
import { CountryDataRow } from 'models/CountryData';
import Legend from 'components/Legend';

import { PopupContentText, BorderLinearProgress } from './styled';

const dataLayers: LegendRow[] = [
    { label: '< 20%', color: CoverageViewColors['20%'] },
    { label: '20-40%', color: CoverageViewColors['40%'] },
    { label: '40-60%', color: CoverageViewColors['60%'] },
    { label: '60-80%', color: CoverageViewColors['80%'] },
    { label: '> 80%', color: CoverageViewColors['>80%'] },
];

const CoverageView: React.FC = () => {
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
    const dataPortalUrl = process.env.REACT_APP_DATA_PORTAL_URL;

    const countriesData = useAppSelector(selectCountriesData);
    const isLoading = useAppSelector(selectIsLoading);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);

    const [mapLoaded, setMapLoaded] = useState(false);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const lookupTableData = countryLookupTable.adm0.data.all as {
        [key: string]: any;
    };

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

    // Display countries data on the map
    const displayCoverageData = () => {
        const mapRef = map.current;
        if (!countriesData || countriesData.length === 0 || !mapRef) return;

        for (const countryRow of countriesData) {
            if (lookupTableData[countryRow.code]) {
                const coveragePercentage = getCoveragePercentage(countryRow);

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
            }
        }

        // This fixes console errors when hot reloading app
        if (mapRef.getLayer('countries-join')) {
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
                        ['!=', ['feature-state', 'caseCount'], null],
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
        mapRef.on('mouseenter', 'countries-join', () => {
            mapRef.getCanvas().style.cursor = 'pointer';
        });

        // Change it back when it leaves.
        mapRef.on('mouseleave', 'countries-join', () => {
            mapRef.getCanvas().style.cursor = '';
        });

        // Add click listener and show popups
        mapRef.on('click', 'countries-join', (e) => {
            if (
                !e.features ||
                !e.features[0].properties ||
                !e.features[0].state.name
            )
                return;

            const caseCount = e.features[0].state.caseCount || 0;
            const totalCases = e.features[0].state.totalCases;
            const countryName = e.features[0].state.name;
            const coverage = e.features[0].state.coverage;

            const lat = e.features[0].state.lat;
            const lng = e.features[0].state.long;
            const coordinates: mapboxgl.LngLatLike = { lng, lat };

            const searchQuery = `cases?country=${parseSearchQuery(
                countryName,
            )}`;
            const url = `${dataPortalUrl}/${searchQuery}`;

            const popupContent = (
                <>
                    <PopupContentText>
                        ({caseCount.toLocaleString()} out of{' '}
                        {totalCases.toLocaleString()})
                    </PopupContentText>

                    <BorderLinearProgress
                        variant="determinate"
                        value={coverage}
                    />
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
        });
    };

    return (
        <>
            {!mapLoaded && <Loader />}
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded}
            />
            <Legend title="Coverage" legendRows={dataLayers} />
        </>
    );
};

export default CoverageView;
