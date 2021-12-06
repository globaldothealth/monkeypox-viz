import ReactDOM from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { Popup, MapSourceDataEvent, EventData, LngLatLike } from 'mapbox-gl';
import { fetchVariantsData } from 'redux/VariantsView/thunks';
import {
    selectIsLoading,
    selectVariantsData,
    selectChosenVariant,
} from 'redux/VariantsView/selectors';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    sortData,
    sortStatesData,
    getDetailedData,
    getMostRecentCountryData,
    getMostRecentStatesData,
} from 'utils/helperFunctions';
import { VariantsFillColors, VariantsOutlineColors } from 'models/Colors';
import MapPopup from 'components/MapPopup';
import { VariantsDataRow } from 'models/VariantsData';
import Legend from 'components/Legend';

import { MapContainer } from 'theme/globalStyles';
import { PopupContentText } from './styled';
import { LegendRow } from 'models/LegendRow';

// Layers to be displayed on map
const layers = [
    {
        id: 'checked-has-data',
        color: VariantsFillColors.CheckedHasData,
        outline: VariantsOutlineColors.CheckedHasData,
        label: 'Reporting',
    },
    {
        id: 'checked-no-data',
        color: VariantsFillColors.CheckedNoData,
        outline: VariantsOutlineColors.CheckedNoData,
        label: 'Not reporting',
    },
    {
        id: 'not-checked',
        color: VariantsFillColors.NotChecked,
        outline: VariantsOutlineColors.NotChecked,
        label: 'To be determined',
    },
];

const ANIMATION_DURATION = 500; // map animation duration in ms

const VariantsView: React.FC = () => {
    const dispatch = useAppDispatch();
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const [mapLoaded, setMapLoaded] = useState(false);
    const [variantsCountryData, setVariantsCountryData] = useState<
        VariantsDataRow[]
    >([]);
    const [variantsStateData, setVariantsStateData] = useState<
        VariantsDataRow[]
    >([]);
    const [popupState, setPopupState] = useState<{
        stateResolution: boolean;
        lngLat: LngLatLike;
        location: string;
    }>();

    const variantsData = useAppSelector(selectVariantsData);
    const isLoading = useAppSelector(selectIsLoading);
    const chosenVariant = useAppSelector(selectChosenVariant);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    // Fetch variants data
    useEffect(() => {
        dispatch(fetchVariantsData());
    }, []);

    // Prepare data
    useEffect(() => {
        if (!variantsData || variantsData.length === 0) return;

        const mostRecentCountryData = getMostRecentCountryData(variantsData);
        const mostRecentVocStateData = getMostRecentStatesData(variantsData);

        setVariantsCountryData(mostRecentCountryData);
        setVariantsStateData(mostRecentVocStateData);
    }, [variantsData]);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;

        if (!mapRef || isLoading) return;

        mapRef.on('load', () => {
            if (!mapRef.getSource('countriesData')) {
                mapRef.addSource('countriesData', {
                    type: 'vector',
                    url: 'mapbox://mapbox.country-boundaries-v1',
                });
            }
            if (!mapRef.getSource('statesData')) {
                mapRef.addSource('statesData', {
                    type: 'geojson',
                    data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson',
                });
            }

            // Add layers to the map
            layers.forEach((layer) => {
                // Layer for countries
                if (!mapRef.getLayer(layer.id)) {
                    mapRef.addLayer(
                        {
                            id: layer.id,
                            source: 'countriesData',
                            'source-layer': 'country_boundaries',
                            type: 'fill',
                            paint: {
                                'fill-color': layer.color,
                                'fill-outline-color': layer.outline,
                                'fill-opacity': 0,
                                'fill-opacity-transition': {
                                    duration: ANIMATION_DURATION,
                                },
                            },
                        },
                        'country-label',
                    );
                }

                if (!mapRef.getLayer(`statesData-${layer.id}`)) {
                    // Layer for US statesData
                    mapRef.addLayer(
                        {
                            id: `statesData-${layer.id}`,
                            source: 'statesData',
                            type: 'fill',
                            paint: {
                                'fill-color': layer.color,
                                'fill-outline-color': layer.outline,
                                'fill-opacity': 0,
                                'fill-opacity-transition': {
                                    duration: ANIMATION_DURATION,
                                },
                            },
                        },
                        'waterway-label',
                    );
                }

                // Display a popup with selected data details
                mapRef.on('click', layer.id, (e) => {
                    const { lngLat, features } = e;
                    if (
                        !features ||
                        features.length === 0 ||
                        !features[0].properties
                    )
                        return;

                    const locationCode = features[0].properties
                        .iso_3166_1_alpha_3 as string;

                    setPopupState({
                        stateResolution: false,
                        lngLat,
                        location: locationCode,
                    });
                });

                // Display a popup with selected data details when clicking on individual state
                mapRef.on('click', `statesData-${layer.id}`, (e) => {
                    const { lngLat, features } = e;
                    if (
                        !features ||
                        features.length === 0 ||
                        !features[0].properties
                    )
                        return;

                    const locationCode = features[0].properties
                        .STATE_NAME as string;

                    setPopupState({
                        stateResolution: true,
                        lngLat,
                        location: locationCode,
                    });
                });

                // Change cursor to pointer when hovering above countries
                mapRef.on('mouseenter', layer.id, () => {
                    mapRef.getCanvas().style.cursor = 'pointer';
                });

                mapRef.on('mouseleave', layer.id, () => {
                    mapRef.getCanvas().style.cursor = '';
                });

                // Change cursor to pointer when hovering above US statesData
                mapRef.on('mouseenter', `statesData-${layer.id}`, () => {
                    mapRef.getCanvas().style.cursor = 'pointer';
                });

                mapRef.on('mouseleave', `statesData-${layer.id}`, () => {
                    mapRef.getCanvas().style.cursor = '';
                });
            });

            // Setup map listener to check if map has loaded
            const setAfterSourceLoaded = (
                e: MapSourceDataEvent & EventData,
            ) => {
                if (e.sourceID !== 'statesData' && !e.isSourceLoaded) return;
                setMapLoaded(true);
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (
                mapRef.isSourceLoaded('countriesData') &&
                mapRef.isSourceLoaded('statesData')
            ) {
                setMapLoaded(true);
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, [isLoading]);

    // Display countries and statesData on the map
    useEffect(() => {
        const mapRef = map.current;
        if (!variantsCountryData || !variantsStateData || !mapRef || !mapLoaded)
            return;

        const { countriesWithData, countriesWithoutData, countriesNotChecked } =
            sortData(variantsCountryData, chosenVariant);

        const { statesWithData, statesWithoutData, statesNotChecked } =
            sortStatesData(variantsStateData, chosenVariant);

        setLayersOpacity(0);

        setTimeout(() => {
            mapRef.setFilter('checked-has-data', [
                'in',
                'iso_3166_1_alpha_3',
                ...countriesWithData,
            ]);

            mapRef.setFilter('checked-no-data', [
                'in',
                'iso_3166_1_alpha_3',
                ...countriesWithoutData,
            ]);

            mapRef.setFilter('not-checked', [
                'in',
                'iso_3166_1_alpha_3',
                ...countriesNotChecked,
            ]);

            mapRef.setFilter('statesData-checked-has-data', [
                'in',
                'STATE_ID',
                ...statesWithData,
            ]);

            mapRef.setFilter('statesData-checked-no-data', [
                'in',
                'STATE_ID',
                ...statesWithoutData,
            ]);

            mapRef.setFilter('statesData-not-checked', [
                'in',
                'STATE_ID',
                ...statesNotChecked,
            ]);

            setLayersOpacity(1);
        }, ANIMATION_DURATION);
    }, [variantsCountryData, variantsStateData, mapLoaded, chosenVariant]);

    // Display popups on the map
    useEffect(() => {
        const mapRef = map.current;
        if (!popupState || !mapRef) return;

        const { stateResolution, lngLat, location } = popupState;

        // Get source url and date checked based on clicked location
        const { sourceUrl, countryName, dateChecked, breakthrough } =
            getDetailedData(
                stateResolution ? variantsStateData : variantsCountryData,
                location,
            );

        const popupContent = (
            <>
                <PopupContentText>
                    <strong>Date checked:</strong> {dateChecked}
                </PopupContentText>
                <PopupContentText>
                    <strong>
                        Breakthrough infections by variant reported:{' '}
                    </strong>
                    {breakthrough}
                </PopupContentText>
            </>
        );

        // This has to be done this way in order to allow for React components as a content of the popup
        const popupElement = document.createElement('div');
        ReactDOM.render(
            <MapPopup
                title={countryName}
                content={popupContent}
                buttonText={sourceUrl ? 'Go To Public Source' : ''}
                buttonUrl={sourceUrl}
            />,
            popupElement,
        );

        new Popup().setLngLat(lngLat).setDOMContent(popupElement).addTo(mapRef);
    }, [popupState]);

    const setLayersOpacity = (opacity: number) => {
        layers.forEach((layer) => {
            map.current?.setPaintProperty(layer.id, 'fill-opacity', opacity);
            map.current?.setPaintProperty(
                `statesData-${layer.id}`,
                'fill-opacity',
                opacity,
            );
        });
    };

    const renderedLegendRows = (): LegendRow[] => {
        return layers.map((layer) => {
            return { label: layer.label, color: layer.color };
        });
    };

    return (
        <>
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded}
            />
            <Legend
                title="Variant Reporting"
                legendRows={renderedLegendRows()}
            />
        </>
    );
};

export default VariantsView;
