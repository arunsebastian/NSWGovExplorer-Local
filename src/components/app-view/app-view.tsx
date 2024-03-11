import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import classNames from 'classnames';

import ToolbarGroup from '../toolbar-group/toolbar-group';
import Toolbar from '../toolbar/toolbar';
import Navigation from '../widgets/navigation/navigation';
import { ENV, MODE } from '@src/utils/constants';

import { getConfig } from '@src/utils/config';
import { waitForFeatureLayersLoad } from '../../utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './app-view.scss';

type AppProps = {
    type?: string;
};

const AppView: React.FC<AppProps> = ({ type = MODE.MAP_VIEW }: AppProps) => {
    const viewRef = useRef();
    const viewNavigationWatchers = useRef({
        map: null,
        scene: null
    }).current;

    const { mapView, sceneView, activeView, setMapView, setSceneView } =
        useAppContext();

    const MapType = type === MODE.SCENE_VIEW ? WebScene : WebMap;
    const ViewType = type === MODE.SCENE_VIEW ? SceneView : MapView;
    const SetViewFunc = type === MODE.SCENE_VIEW ? setSceneView : setMapView;

    const renderMap = () => {
        const config = getConfig(ENV.AGOL).portalInfo;
        console.log(config);
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
                    snapToZoom: false
                }
            });
            reactiveUtils
                .whenOnce(() => view.ready)
                .then(async () => {
                    await waitForFeatureLayersLoad(view);
                    SetViewFunc(view as any);
                });
        }
    };

    useEffect(() => {
        if (viewRef.current) {
            renderMap();
        }
    }, [viewRef.current]);

    useEffect(() => {
        if (mapView && sceneView) {
            if (viewNavigationWatchers.map) {
                //     I AM HERE - MAP SYNC IS NOT FUNCTIONAL YET
                // CHECKING IN FOR A STABLE COMMIT WITH MAP/SCENE SWITCHING COMPLETED
                viewNavigationWatchers.map.remove();
                viewNavigationWatchers.map = reactiveUtils.watch(
                    () => [mapView.interacting, mapView.viewpoint],
                    ([interacting, viewpoint]) => {
                        if (interacting || viewpoint) {
                            mapView.viewpoint = viewpoint as any;
                        }
                    }
                );
            }
            // if (!viewNavigationWatchers.scene) {
            //     console.log('I am here in scene');
            //     viewNavigationWatchers.scene = reactiveUtils.watch(
            //         () => [sceneView.interacting, sceneView.viewpoint],
            //         ([interacting, viewpoint]) => {
            //             if (!interacting) {
            //                 mapView.viewpoint = viewpoint as any;
            //             }
            //         }
            //     );
            // }

            // reactiveUtils.watch(
            //     () => mapView.rotation,
            //     (rotation: number) => {
            //         if (sceneView.camera.heading !== rotation) {
            //             sceneView.camera.heading = rotation;
            //         }
            //     }
            // );

            // reactiveUtils.watch(
            //     () => [sceneView.interacting, sceneView.viewpoint],
            //     ([interacting, viewpoint]) => {
            //         if (interacting || viewpoint) {
            //             mapView.viewpoint = sceneView.viewpoint;
            //         }
            //     }
            // );
            // reactiveUtils.watch(
            //     () => sceneView.camera.heading,
            //     (heading: number) => {
            //         if (mapView.rotation !== heading) {
            //             mapView.rotation = heading;
            //         }
            //     }
            // );
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
