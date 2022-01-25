import ReactDOM from 'react-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { MapSourceDataEvent, EventData, LngLatLike, Popup } from 'mapbox-gl';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchRegionalData } from 'redux/RegionalView/thunks';
import { selectRegionalData } from 'redux/RegionalView/selectors';
import {
    convertRegionalDataToFeatureSet,
    parseSearchQuery,
} from 'utils/helperFunctions';
import { RegionalViewColors } from 'models/Colors';
import MapPopup from 'components/MapPopup';
import Loader from 'components/Loader';
import Legend from 'components/Legend';
import { LegendRow } from 'models/LegendRow';

import { MapContainer } from 'theme/globalStyles';
import { PopupContentText } from './styled';
import {
    selectCountriesData,
    selectSelectedCountryInSideBar,
} from 'redux/App/selectors';
import { CountryDataRow } from 'models/CountryData';
import { SearchResolution } from 'models/RegionalData';

const dataLayers: LegendRow[] = [
    { label: '< 100', color: RegionalViewColors['<100'] },
    { label: '100-1k', color: RegionalViewColors['100-1k'] },
    { label: '1k-5k', color: RegionalViewColors['1k-5k'] },
    { label: '5k-20k', color: RegionalViewColors['5k-20k'] },
    { label: '20k-100k', color: RegionalViewColors['20k-100k'] },
    { label: '> 100k', color: RegionalViewColors['>100k'] },
];

export const RegionalView: React.FC = () => {
    const dispatch = useAppDispatch();

    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
    const dataPortalUrl = process.env.REACT_APP_DATA_PORTAL_URL || '';

    const [mapLoaded, setMapLoaded] = useState(false);
    const regionalData = useAppSelector(selectRegionalData);
    const countriesData = useAppSelector(selectCountriesData);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    // Fetch regional data
    useEffect(() => {
        dispatch(fetchRegionalData());
    }, []);

    // This variable should be momoized in order to improve performance
    const regionalDataFeatureSet = useMemo(() => {
        if (!regionalData || regionalData.length === 0) return undefined;

        return convertRegionalDataToFeatureSet(regionalData);
    }, [regionalData]);

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
        if (!mapRef) return;

        mapRef.on('load', () => {
            setMapLoaded(true);
        });
    }, []);

    // Visualize regional data
    // It has to be done in separate function because regional data take a lot of time to load
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef || !mapLoaded || !regionalDataFeatureSet) return;

        if (!mapRef.getSource('regionalData')) {
            mapRef.addSource('regionalData', {
                type: 'geojson',
                data: regionalDataFeatureSet,
            });
        }

        if (!mapRef.getSource('adminSource')) {
            mapRef.addSource('adminSource', {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-streets-v8',
            });
        }

        if (!mapRef.getLayer('adminBoundaries')) {
            mapRef.addLayer({
                id: 'adminBoundaries',
                type: 'line',
                source: 'adminSource',
                'source-layer': 'admin',
                paint: {
                    'line-color': 'rgba(0, 131, 191, 1)',
                    'line-opacity': 0.35,
                },
                minzoom: 6,
            });
        }

        if (!mapRef.getLayer('points')) {
            mapRef.addLayer({
                id: 'points',
                type: 'circle',
                source: 'regionalData',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': {
                        property: 'caseCount',
                        stops: [
                            [0, RegionalViewColors['<100']],
                            [100, RegionalViewColors['100-1k']],
                            [1000, RegionalViewColors['1k-5k']],
                            [5000, RegionalViewColors['5k-20k']],
                            [20000, RegionalViewColors['20k-100k']],
                            [100000, RegionalViewColors['>100k']],
                        ],
                    },
                    'circle-stroke-color': {
                        property: 'caseCount',
                        stops: [
                            [0, RegionalViewColors['<100']],
                            [100, RegionalViewColors['100-1k']],
                            [1000, RegionalViewColors['1k-5k']],
                            [5000, RegionalViewColors['5k-20k']],
                            [20000, RegionalViewColors['20k-100k']],
                            [100000, RegionalViewColors['>100k']],
                        ],
                    },
                    'circle-stroke-width': 0.5,
                    'circle-radius': {
                        property: 'caseCount',
                        stops: [
                            [100, 3],
                            [1000, 4],
                            [5000, 6],
                            [20000, 8],
                            [100000, 18],
                        ],
                    },
                    'circle-opacity': 0.55,
                },
            });
        }

        // Display popups after clicking on particular point
        mapRef.on('click', 'points', (e) => {
            if (
                !e.features ||
                !e.features[0].properties ||
                !e.features[0].geometry
            )
                return;

            const country = e.features[0].properties.country;
            const region = e.features[0].properties.region;

            const geometry = e.features[0].geometry as any;
            const lat = geometry.coordinates[1];
            const lng = geometry.coordinates[0];
            const caseCount = e.features[0].properties.caseCount;

            const admin1 = e.features[0].properties.admin1;
            const admin2 = e.features[0].properties.admin2;
            const admin3 = e.features[0].properties.admin3;
            const searchResolution = e.features[0].properties
                .search as SearchResolution;

            const coordinates: LngLatLike = { lng, lat };

            // Prepare search query to always pass all available regional data
            const admin1Query = admin1
                ? `&admin1=${parseSearchQuery(admin1)}`
                : '';
            const admin2Query = admin2
                ? `&admin2=${parseSearchQuery(admin2)}`
                : '';
            const admin3Query = admin3
                ? `&admin3=${parseSearchQuery(admin3)}`
                : '';

            let searchQuery: string;
            if (
                admin1Query !== '' ||
                admin2Query !== '' ||
                admin3Query !== ''
            ) {
                searchQuery = `cases?country=${parseSearchQuery(
                    country,
                )}${admin1Query}${admin2Query}${admin3Query}`;
            } else if (country !== region) {
                searchQuery = `cases?country=${parseSearchQuery(
                    country,
                )}&${searchResolution}=${region}`;
            } else {
                searchQuery = `cases?country=${parseSearchQuery(country)}`;
            }

            const url = `${dataPortalUrl}/${searchQuery}`;

            const popupContent = (
                <PopupContentText>
                    {caseCount.toLocaleString()} case
                    {caseCount > 1 ? 's' : ''}
                </PopupContentText>
            );

            // Fly to the selected country before showing popup
            mapRef.flyTo({
                center: [lng, lat] as LngLatLike,
                zoom: 5,
            });

            // This has to be done this way in order to allow for React components as a content of the popup
            const popupElement = document.createElement('div');
            ReactDOM.render(
                <MapPopup
                    title={`${region}, ${country}`}
                    content={popupContent}
                    buttonText="Explore Regional Data"
                    buttonUrl={url}
                />,
                popupElement,
            );

            new Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupElement)
                .addTo(mapRef);
        });

        // Change the mouse cursor to pointer when hovering above this layer
        mapRef.on('mouseenter', 'points', () => {
            mapRef.getCanvas().style.cursor = 'pointer';
        });

        // Change it back when it leaves.
        mapRef.on('mouseleave', 'points', () => {
            mapRef.getCanvas().style.cursor = '';
        });

        // Setup map listener to check if map has loaded
        const setAfterSourceLoaded = (e: MapSourceDataEvent & EventData) => {
            if (e.sourceID !== 'regionalData' && !e.isSourceLoaded) return;

            setMapLoaded(true);
            mapRef.off('sourcedata', setAfterSourceLoaded);
        };

        if (mapRef.isSourceLoaded('regionalData')) {
            setMapLoaded(true);
        } else {
            mapRef.on('sourcedata', setAfterSourceLoaded);
        }
    }, [mapLoaded, regionalDataFeatureSet]);

    return (
        <>
            {(!mapLoaded || !regionalDataFeatureSet) && <Loader />}
            <MapContainer
                ref={mapContainer}
                isLoading={!mapLoaded || !regionalDataFeatureSet}
            />

            <Legend title="Cases" legendRows={dataLayers} />
        </>
    );
};
