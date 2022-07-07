import ReactDOM from 'react-dom';
import { useRef, useEffect, useState } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import {
    selectIsLoading,
    selectCountriesData,
    selectSelectedCountryInSideBar,
    selectPopupData,
    selectDataType,
    selectTimeseriesCountryData,
    selectCurrentDate,
    selectInitialCountriesData,
} from 'redux/App/selectors';
import {
    setSelectedCountryInSidebar,
    setPopup,
    DataType,
} from 'redux/App/slice';

import countryLookupTable from 'data/admin0-lookup-table.json';
import { CountryViewColors } from 'models/Colors';
import mapboxgl, { MapSourceDataEvent, EventData } from 'mapbox-gl';
import Legend from 'components/Legend';
import { LegendRow } from 'models/LegendRow';
import MapPopup from 'components/MapPopup';

import { MapContainer } from 'theme/globalStyles';
import Loader from 'components/Loader';
import { PopupContentText } from './styled';
import {
    getCountryCode,
    getChartDataFromTimeseriesData,
} from 'utils/helperFunctions';
import CaseChart from 'components/CaseChart';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const dataLayers: LegendRow[] = [
    { label: '0 or no data', color: CountryViewColors['NoData'] },
    { label: '<10', color: CountryViewColors['<10'] },
    { label: '10-50', color: CountryViewColors['10-50'] },
    { label: '51-100', color: CountryViewColors['51-100'] },
    { label: '101-200', color: CountryViewColors['101-200'] },
    { label: '201-500', color: CountryViewColors['201-500'] },
    { label: '>500', color: CountryViewColors['>500'] },
];

const CountryView: React.FC = () => {
    const dispatch = useAppDispatch();

    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const isLoading = useAppSelector(selectIsLoading);
    const countriesData = useAppSelector(selectCountriesData);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const popupData = useAppSelector(selectPopupData);
    const dataType = useAppSelector(selectDataType);
    const timeseriesData = useAppSelector(selectTimeseriesCountryData);
    const currentTimeseriesDate = useAppSelector(selectCurrentDate);
    const initialCountriesData = useAppSelector(selectInitialCountriesData);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup>();
    const [featureStateIds, setFeatureStateIds] = useState<number[]>([]);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const smallScreen = useMediaQuery('(max-width:1400px)');

    const lookupTableData = countryLookupTable.adm0.data.all as {
        [key: string]: any;
    };

    // Fly to country
    useEffect(() => {
        if (!selectedCountry) return;

        const countryCode = getCountryCode(selectedCountry.name);

        const bounds = lookupTableData[countryCode].bounds;
        map.current?.fitBounds(bounds);
    }, [selectedCountry]);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef || isLoading || initialCountriesData.length === 0) return;

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
                displayCountriesOnMap();
                setMapLoaded(true);
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (!mapRef.isSourceLoaded('countriesData')) {
                displayCountriesOnMap();
                setMapLoaded(true);
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, [isLoading, initialCountriesData]);

    // Refresh map when data type changes
    useEffect(() => {
        if (!mapLoaded) return;

        displayCountriesOnMap();
        // eslint-disable-next-line
    }, [dataType]);

    // Refresh map when countries data changes
    useEffect(() => {
        if (!mapLoaded) return;

        updateFeatureState();
        // eslint-disable-next-line
    }, [countriesData]);

    // Display popup on the map
    useEffect(() => {
        const { countryName } = popupData;
        const mapRef = map.current;

        if (!countryName || countryName === '' || !mapRef) return;

        // Close previous popup if it exists
        if (currentPopup) currentPopup.remove();

        const country = countriesData.filter(
            (country) => country.name === countryName,
        )[0];

        const countryCode = getCountryCode(country.name);

        const countryDetails = lookupTableData[countryCode];
        if (!countryDetails) return;

        const confirmedCases = country.confirmed;
        const suspectedCases = country.suspected;
        const lat = countryDetails.centroid[1];
        const lng = countryDetails.centroid[0];
        const coordinates: mapboxgl.LngLatLike = { lng, lat };

        const chartData = getChartDataFromTimeseriesData(
            timeseriesData,
            country.name,
            currentTimeseriesDate,
        );

        const popupContent = (
            <>
                <PopupContentText>
                    {confirmedCases.toLocaleString()} confirmed
                    {confirmedCases > 1 ? ' cases' : ' case'}
                </PopupContentText>

                {dataType === DataType.Combined && (
                    <PopupContentText>
                        {suspectedCases.toLocaleString()} suspected
                        {suspectedCases > 1 ? ' cases' : ' case'}
                    </PopupContentText>
                )}

                <Box sx={{ margin: '4rem 2rem 0 -2rem' }}>
                    <CaseChart data={chartData} />
                </Box>
            </>
        );

        // This has to be done this way in order to allow for React components as a content of the popup
        const popupElement = document.createElement('div');
        ReactDOM.render(
            <MapPopup title={countryName} content={popupContent} />,
            popupElement,
        );

        const popup = new mapboxgl.Popup({
            anchor: smallScreen ? 'center' : undefined,
        })
            .setLngLat(coordinates)
            .setDOMContent(popupElement)
            .addTo(mapRef)
            .on('close', () =>
                dispatch(
                    setPopup({
                        isOpen: false,
                        countryName: '',
                    }),
                ),
            );

        setCurrentPopup(popup);
    }, [popupData]);

    // Display countries data on the map
    const displayCountriesOnMap = () => {
        const mapRef = map.current;
        if (!countriesData || countriesData.length === 0 || !mapRef) return;

        for (const countryRow of countriesData) {
            const { name, confirmed, combined } = countryRow;

            const countryCode = getCountryCode(name);

            if (lookupTableData[countryCode]) {
                setFeatureStateIds((ids) => [
                    ...ids,
                    lookupTableData[countryCode].feature_id,
                ]);

                mapRef.setFeatureState(
                    {
                        source: 'countriesData',
                        sourceLayer: 'country_boundaries',
                        id: lookupTableData[countryCode].feature_id,
                    },
                    {
                        caseCount:
                            dataType === DataType.Confirmed
                                ? confirmed
                                : combined,
                        name,
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
                            ['==', ['feature-state', 'caseCount'], 0],
                            CountryViewColors.Fallback,
                            ['<', ['feature-state', 'caseCount'], 10],
                            CountryViewColors['<10'],
                            ['<=', ['feature-state', 'caseCount'], 50],
                            CountryViewColors['10-50'],
                            ['<=', ['feature-state', 'caseCount'], 100],
                            CountryViewColors['51-100'],
                            ['<=', ['feature-state', 'caseCount'], 200],
                            CountryViewColors['101-200'],
                            ['<=', ['feature-state', 'caseCount'], 500],
                            CountryViewColors['201-500'],
                            ['>', ['feature-state', 'caseCount'], 500],
                            CountryViewColors['>500'],
                            CountryViewColors.Fallback,
                        ],
                        CountryViewColors.Fallback,
                    ],
                    'fill-outline-color': CountryViewColors.Outline,
                },
            },
            'admin-1-boundary',
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
            if (!e.features || !e.features[0].state.name) return;

            const countryName = e.features[0].state.name;

            dispatch(setSelectedCountryInSidebar({ name: countryName }));
            dispatch(setPopup({ isOpen: true, countryName }));
        });
    };

    const updateFeatureState = () => {
        const mapRef = map.current;
        if (!mapRef) return;

        const updatedStateIds: number[] = [];

        for (const countryRow of countriesData) {
            const { name, confirmed, combined } = countryRow;

            const countryCode = getCountryCode(name);

            if (lookupTableData[countryCode]) {
                updatedStateIds.push(lookupTableData[countryCode].feature_id);

                mapRef.setFeatureState(
                    {
                        source: 'countriesData',
                        sourceLayer: 'country_boundaries',
                        id: lookupTableData[countryCode].feature_id,
                    },
                    {
                        caseCount:
                            dataType === DataType.Confirmed
                                ? confirmed
                                : combined,
                        name,
                    },
                );
            }
        }

        // Remove feature ids that weren't updated
        const stateIdsToRemove = featureStateIds.filter(
            (id) => !updatedStateIds.includes(id),
        );
        stateIdsToRemove.forEach((id) => {
            mapRef.removeFeatureState({
                source: 'countriesData',
                sourceLayer: 'country_boundaries',
                id,
            });
        });
    };

    return (
        <>
            {!mapLoaded && <Loader />}
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded}
            />
            <Legend
                title={
                    dataType === DataType.Confirmed
                        ? 'Confirmed Cases'
                        : 'Confirmed and Suspected Cases'
                }
                legendRows={dataLayers}
            />
        </>
    );
};

export default CountryView;
