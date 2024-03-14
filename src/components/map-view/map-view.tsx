import React, { useRef, useEffect } from 'react';
import { default as View2D } from '@arcgis/core/views/MapView';
import { default as View3D } from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import classNames from 'classnames';

import MapToolbar from '../map-toolbar/map-toolbar';
import Navigation from '../widgets/navigation/navigation';
import LayerList from '../widgets/layer-list/layer-list';
import { ENV, MODE } from '@src/utils/constants';

import { getConfig } from '@src/config/config';
import { useAppContext } from '@src/contexts/app-context-provider';

import './map-view.scss';

type MapViewProps = {
    type?: string;
};

const MapView: React.FC<MapViewProps> = ({
    type = MODE.MAP_VIEW
}: MapViewProps) => {
    const viewRef = useRef();
    const { activeView, setMapView, setSceneView } = useAppContext();

    const MapType = type === MODE.SCENE_VIEW ? WebScene : WebMap;
    const ViewType = type === MODE.SCENE_VIEW ? View3D : View2D;
    const SetViewFunc = type === MODE.SCENE_VIEW ? setSceneView : setMapView;

    const renderMap = () => {
        const config = getConfig(ENV.AGOL).portalInfo;
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
                    snapToZoom: type === MODE.SCENE_VIEW ? true : false
                }
            }) as any;
            SetViewFunc(view);
        }
    };

    useEffect(() => {
        viewRef.current && renderMap();
    }, [viewRef.current]);

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
            <MapToolbar position='right'>
                <LayerList context={type}></LayerList>
            </MapToolbar>
        </div>
    );
};

export default MapView;
