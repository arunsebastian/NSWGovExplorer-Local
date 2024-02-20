import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { getConfig } from '../../../utils/config';
import { waitForFeatureLayersLoad } from '../../../utils/map';
import './app-map-view.scss';

type AppMapViewProps = {
    onMapAndLayersLoaded: (mapView: MapView) => void;
};

const AppMapView: React.FC<AppMapViewProps> = (props: AppMapViewProps) => {
    const viewRef = useRef();
    const { onMapAndLayersLoaded } = props;

    const renderWebMap = () => {
        const config = getConfig().portalInfo;
        if (config.itemId) {
            const map = new WebMap({
                portalItem: {
                    id: config.itemId,
                    portal: {
                        url: config.url
                    }
                }
            });
            map.loadAll();
            const mapView = new MapView({
                container: viewRef.current,
                map: map
            });
            reactiveUtils
                .whenOnce(() => mapView.ready)
                .then(async () => {
                    await waitForFeatureLayersLoad(mapView);
                    onMapAndLayersLoaded && onMapAndLayersLoaded(mapView);
                });
        }
    };

    useEffect(() => {
        if (viewRef.current) {
            renderWebMap();
        }
    }, [viewRef.current]);
    return <div ref={viewRef} className='app-map-view'></div>;
};

export default AppMapView;
