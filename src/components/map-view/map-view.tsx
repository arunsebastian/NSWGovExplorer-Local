import React, { useRef, useEffect } from 'react';
import { default as View2D } from '@arcgis/core/views/MapView';
import { default as View3D } from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import classNames from 'classnames';

import MapToolbar from '../map-toolbar/map-toolbar';
import Navigation from '../widgets/navigation/navigation';
import { ENV, MODE } from '@src/utils/constants';

import { getConfig } from '@src/config/config';
import { waitForFeatureLayersLoad } from '@src/utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './map-view.scss';

type MapViewProps = {
    type?: string;
};

const MapView: React.FC<MapViewProps> = ({
    type = MODE.MAP_VIEW
}: MapViewProps) => {
    const viewRef = useRef();
    const interactedViewRef = useRef<__esri.MapView | __esri.SceneView>();
    const interactionHandlesRef = useRef<__esri.WatchHandle[]>();

    const { mapView, sceneView, activeView, setMapView, setSceneView } =
        useAppContext();

    const MapType = type === MODE.SCENE_VIEW ? WebScene : WebMap;
    const ViewType = type === MODE.SCENE_VIEW ? View3D : View2D;
    const SetViewFunc = type === MODE.SCENE_VIEW ? setSceneView : setMapView;

    const renderMap = () => {
        //ENV.AGOL
        const config = getConfig().portalInfo;
        if (config) {
            const map = new MapType({
                portalItem: {
                    id:
                        type === MODE.SCENE_VIEW
                            ? config.sceneId
                            : config.mapId,
                    portal: {
                        url: config.url
                    }
                }
            });
            map.loadAll();
            const view = new ViewType({
                container: viewRef.current,
                map: map,
                ui: {
                    components: ['attribution']
                },
                constraints: {
                    // Disable zoom snapping to get the best synchronization
                    snapToZoom: MODE.SCENE_VIEW ? true : false
                }
            }) as any;
            reactiveUtils
                .whenOnce(() => view.ready)
                .then(async () => {
                    await waitForFeatureLayersLoad(view);
                    SetViewFunc(view);
                });
        }
    };

    const observeViewInteractions = () => {
        const views = [mapView, sceneView];
        (interactionHandlesRef.current ?? []).forEach(
            (handle: __esri.WatchHandle) => {
                handle.remove();
            }
        );
        interactionHandlesRef.current = [];
        for (const view of views) {
            const handle = reactiveUtils.watch(
                () => [view.interacting, view.viewpoint],
                ([interacting, viewpoint]) => {
                    // Only print the new zoom value when the view is stationary
                    if (interacting) {
                        interactedViewRef.current = view;
                        syncView(interactedViewRef.current);
                    }
                    if (viewpoint) {
                        syncView(view);
                    }
                }
            );
            interactionHandlesRef.current.push(handle);
        }
    };

    const syncView = (sourceView: __esri.MapView | __esri.SceneView) => {
        const views = [mapView, sceneView];
        const currentActiveView = interactedViewRef.current;
        if (
            !currentActiveView ||
            !currentActiveView.viewpoint ||
            currentActiveView !== sourceView
        ) {
            return;
        }

        for (const view of views) {
            if (view !== currentActiveView) {
                view.viewpoint = currentActiveView.viewpoint;
            }
        }
    };

    useEffect(() => {
        if (viewRef.current) {
            renderMap();
        }
    }, [viewRef.current]);

    useEffect(() => {
        if (mapView && sceneView) {
            observeViewInteractions();
        }
    }, [mapView, sceneView]);

    return (
        <div
            className={classNames('map-view-container', {
                inactive: type !== activeView
            })}
        >
            <div ref={viewRef} className='map-view'></div>
            <MapToolbar position='bottom'>
                <Navigation context={type}></Navigation>
            </MapToolbar>
        </div>
    );
};

export default MapView;
