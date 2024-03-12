import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import classNames from 'classnames';

import ToolbarGroup from '../toolbar-group/toolbar-group';
import Toolbar from '../toolbar/toolbar';
import Navigation from '../widgets/navigation/navigation';
import { ENV, MODE } from '@src/utils/constants';

import { getConfig } from '@src/config/config';
import { waitForFeatureLayersLoad } from '@src/utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './app-view.scss';

type AppProps = {
    type?: string;
};

const AppView: React.FC<AppProps> = ({ type = MODE.MAP_VIEW }: AppProps) => {
    const viewRef = useRef();
    const interactedViewRef = useRef<MapView | SceneView>();
    const interactionHandlesRef = useRef<__esri.WatchHandle[]>();

    const { mapView, sceneView, activeView, setMapView, setSceneView } =
        useAppContext();

    const MapType = type === MODE.SCENE_VIEW ? WebScene : WebMap;
    const ViewType = type === MODE.SCENE_VIEW ? SceneView : MapView;
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

    const syncView = (sourceView: MapView | SceneView) => {
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
            className={classNames('app-view-content', {
                inactive: type !== activeView
            })}
        >
            <ToolbarGroup position='bottom'>
                <Toolbar>
                    <Navigation context={type} />
                </Toolbar>
            </ToolbarGroup>
            {/* <ToolbarGroup position='right'>
                <Toolbar>
                    <Search />
                </Toolbar>
            </ToolbarGroup> */}
            <div ref={viewRef} className='app-view'></div>
        </div>
    );
};

export default AppView;
