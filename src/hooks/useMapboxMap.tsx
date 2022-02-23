import React, { useEffect, useRef } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

// Custom hook that configures Mapbox map and displays it in the provided mapContainer ref
export function useMapboxMap(
    mapboxAccessToken: string,
    mapContainer: React.RefObject<HTMLDivElement>,
): React.RefObject<Map | null> {
    mapboxgl.accessToken = mapboxAccessToken;

    const map = useRef<Map | null>(null);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current || '',
            style: process.env.REACT_APP_MAP_THEME_URL,
            renderWorldCopies: false,
            center: [0, 40],
            zoom: 2.5,
            minZoom: 2,
        }).addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    }, []);

    return map;
}
