import ReactDOM from 'react-dom';
import { useRef, useEffect } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import * as countryViewSelectors from 'redux/CountryView/selectors';
import { fetchCountriesData } from 'redux/CountryView/thunks';
import { setMapLoaded } from 'redux/CountryView/slice';
import countryLookupTable from 'data/admin0-lookup-table.json';
import { CountryViewColors } from 'models/Colors';
import mapboxgl, { MapSourceDataEvent, EventData } from 'mapbox-gl';
import Legend from 'components/Legend';
import { LegendRow } from 'models/LegendRow';
import { parseSearchQuery } from 'utils/helperFunctions';
import MapPopup from 'components/MapPopup';

import { MapContainer } from 'theme/globalStyles';

const dataLayers: LegendRow[] = [
    { label: '< 10k', color: CountryViewColors['10K'] },
    { label: '10k-100k', color: CountryViewColors['100K'] },
    { label: '100k-500k', color: CountryViewColors['500K'] },
    { label: '500k-2M', color: CountryViewColors['2M'] },
    { label: '2M-10M', color: CountryViewColors['10M'] },
    { label: '> 10M', color: CountryViewColors['10M+'] },
];

const CountryView: React.FC = () => {
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
    const dataPortalUrl = process.env.REACT_APP_DATA_PORTAL_URL;

    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(countryViewSelectors.selectIsLoading);
    const error = useAppSelector(countryViewSelectors.selectError);
    const countriesData = useAppSelector(
        countryViewSelectors.selectCountriesData,
    );
    const mapLoaded = useAppSelector(countryViewSelectors.selectMapLoaded);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const lookupTableData = countryLookupTable.adm0.data.all as {
        [key: string]: any;
    };

    // Fetch countries data
    useEffect(() => {
        dispatch(fetchCountriesData());
    }, []);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef) return;

        mapRef.on('load', () => {
            mapRef.addSource('countriesData', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1',
            });

            // Setup map listener to check if map has loaded
            const setAfterSourceLoaded = (
                e: MapSourceDataEvent & EventData,
            ) => {
                if (e.sourceID !== 'countriesData' && !e.isSourceLoaded) return;
                dispatch(setMapLoaded(true));
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (mapRef.isSourceLoaded('countriesData')) {
                dispatch(setMapLoaded(true));
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, []);

    // Display countries data on the map
    useEffect(() => {
        if (isLoading || countriesData.length === 0 || !mapLoaded) return;
        const mapRef = map.current;
        if (!mapRef) return;

        for (const countryRow of countriesData) {
            if (lookupTableData[countryRow.code]) {
                mapRef.setFeatureState(
                    {
                        source: 'countriesData',
                        sourceLayer: 'country_boundaries',
                        id: lookupTableData[countryRow.code].feature_id,
                    },
                    {
                        caseCount: countryRow.casecount,
                        name: countryRow._id,
                        lat: countryRow.lat,
                        long: countryRow.long,
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
                            ['<', ['feature-state', 'caseCount'], 10000],
                            CountryViewColors['10K'],
                            ['<', ['feature-state', 'caseCount'], 100000],
                            CountryViewColors['100K'],
                            ['<', ['feature-state', 'caseCount'], 500000],
                            CountryViewColors['500K'],
                            ['<', ['feature-state', 'caseCount'], 2000000],
                            CountryViewColors['2M'],
                            ['<', ['feature-state', 'caseCount'], 10000000],
                            CountryViewColors['10M'],
                            ['>=', ['feature-state', 'caseCount'], 10000000],
                            CountryViewColors['10M+'],
                            CountryViewColors.Fallback,
                        ],
                        CountryViewColors.Fallback,
                    ],
                    'fill-outline-color': CountryViewColors.Outline,
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
            const countryName = e.features[0].state.name;

            const lat = e.features[0].state.lat;
            const lng = e.features[0].state.long;
            const coordinates: mapboxgl.LngLatLike = { lng, lat };

            const searchQuery = `cases?country=${parseSearchQuery(
                countryName,
            )}`;
            const url = `${dataPortalUrl}/${searchQuery}`;

            const popupContent = (
                <p>
                    {caseCount.toLocaleString()} line list case
                    {caseCount > 1 ? 's' : ''}
                </p>
            );

            // This has to be done this way in order to allow for React components as a content of the popup
            const popupElement = document.createElement('div');
            ReactDOM.render(
                <MapPopup
                    title={countryName}
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
    }, [isLoading, mapLoaded]);

    return (
        <>
            {/* @TODO: add error popup once MUI is configured */}
            {error && <h1>{error}</h1>}
            {/* @TODO: add loading indicator once MUI is configured */}
            {(isLoading || !mapLoaded) && <h1>Loading...</h1>}
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded}
            />
            <Legend title="Line List Cases" legendRows={dataLayers} />
        </>
    );
};

export default CountryView;
