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
    getChartDataFromTimeseriesData,
    getCountryName,
    getTwoLetterCountryCode,
} from 'utils/helperFunctions';
import CaseChart from 'components/CaseChart';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CopyStateLinkButton from 'components/CopyStateLinkButton';

const dataLayers: LegendRow[] = [
    { label: '0 or no data', color: CountryViewColors['NoData'] },
    { label: '<10', color: CountryViewColors['<10'] },
    { label: '10-100', color: CountryViewColors['10-100'] },
    { label: '101-500', color: CountryViewColors['101-500'] },
    { label: '501-2,000', color: CountryViewColors['501-2,000'] },
    { label: '2,001-5,000', color: CountryViewColors['2,001-5,000'] },
    { label: '>5,000', color: CountryViewColors['>5,000'] },
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
    const [dragging, setDragging] = useState(false);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const smallScreen = useMediaQuery('(max-width:1400px)');

    //SS not updating from AWS in json file lookup table for field .all, tmp fix
    const lookupTableData = {
        ...countryLookupTable.adm0.data.all,
        SS: countryLookupTable.adm0.data.US.SS,
    } as {
        [key: string]: any;
    };

    useEffect(() => {
        if (
            !dragging ||
            !selectedCountry ||
            selectedCountry.name === 'worldwide'
        )
            return;

        dispatch(setSelectedCountryInSidebar(null));
        if (currentPopup) currentPopup.remove();
    }, [dragging]);

    // Fly to country
    useEffect(() => {
        if (!selectedCountry) return;

        if (selectedCountry.name === 'worldwide') {
            map.current?.setCenter([0, 40]);
            map.current?.setZoom(2.5);

            return;
        }

        const countryCode = getTwoLetterCountryCode(selectedCountry.name);

        const bounds = lookupTableData[countryCode].bounds;
        map.current?.fitBounds(bounds);

        //on some browsers the blank space is added below the body element when using fitBounds function
        //this is to manually scroll to top of the page where map is located
        setTimeout(() => {
            scrollTo(0, 0);
        }, 100);
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

    // Refresh map when data changes
    useEffect(() => {
        if (!mapLoaded) return;

        updateFeatureState();
        // eslint-disable-next-line
    }, [countriesData, mapLoaded]);

    // Display popup on the map
    useEffect(() => {
        const { countryName } = popupData;
        const mapRef = map.current;

        if (
            !countryName ||
            !mapRef ||
            !timeseriesData ||
            !currentTimeseriesDate
        )
            return;

        if (countryName === '' || countryName === 'worldwide') {
            // Close previous popup if it exists
            if (currentPopup) currentPopup.remove();
            return;
        }

        // Close previous popup if it exists
        if (currentPopup) currentPopup.remove();

        const country = countriesData.filter(
            (country) => country.name === countryName,
        )[0];

        const countryCode = getTwoLetterCountryCode(country.name);

        const countryDetails = lookupTableData[countryCode];
        if (!countryDetails) return;

        const suspectedCases = country.suspected;
        const lat = countryDetails.centroid[1];
        const lng = countryDetails.centroid[0];
        const coordinates: mapboxgl.LngLatLike = { lng, lat };

        const chartData = getChartDataFromTimeseriesData(
            timeseriesData,
            country.name,
            currentTimeseriesDate,
        );

        const confirmedCases = chartData.length
            ? chartData[chartData.length - 1].caseCount
            : 0;

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
            <MapPopup
                title={getCountryName(countryName)}
                content={popupContent}
            />,
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
    }, [popupData, timeseriesData, currentTimeseriesDate]);

    // Display countries data on the map
    const displayCountriesOnMap = () => {
        const mapRef = map.current;
        if (!countriesData || countriesData.length === 0 || !mapRef) return;

        for (const countryRow of countriesData) {
            const { name, confirmed, combined } = countryRow;

            const countryCode = getTwoLetterCountryCode(name);

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
                            ['<=', ['feature-state', 'caseCount'], 100],
                            CountryViewColors['10-100'],
                            ['<=', ['feature-state', 'caseCount'], 500],
                            CountryViewColors['101-500'],
                            ['<=', ['feature-state', 'caseCount'], 2000],
                            CountryViewColors['501-2,000'],
                            ['<=', ['feature-state', 'caseCount'], 5000],
                            CountryViewColors['2,001-5,000'],
                            ['>', ['feature-state', 'caseCount'], 5000],
                            CountryViewColors['>5,000'],
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

        mapRef.on('dragstart', () => {
            setDragging(true);
        });
        mapRef.on('dragend', () => {
            setDragging(false);
        });
    };

    const updateFeatureState = () => {
        const mapRef = map.current;
        if (!mapRef) return;

        const updatedStateIds: number[] = [];

        for (const countryRow of countriesData) {
            const { name, confirmed, combined } = countryRow;

            const countryCode = getTwoLetterCountryCode(name);

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

        //Filter out countries without any data
        mapRef.setFilter('countries-join', [
            'in',
            'iso_3166_1_alpha_3',
            ...countriesData.map((country) => country.name),
        ]);
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
            <CopyStateLinkButton onWhichContainer="view" map={map} />
        </>
    );
};

export default CountryView;
