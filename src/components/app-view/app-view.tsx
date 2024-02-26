import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import ToolbarGroup from '../toolbar-group/toolbar-group';
import Toolbar from '../toolbar/toolbar';
import Navigation from '../widgets/navigation/navigation';
import Search from '../widgets/search/search';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { getConfig } from '@src/utils/config';
import { waitForFeatureLayersLoad } from '../../utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './app-view.scss';

const AppView: React.FC = () => {
    const viewRef = useRef();
    const { setMapView, setSceneView } = useAppContext();
    const isSceneView = false; // temporary

    const MapType = isSceneView ? WebScene : WebMap;
    const ViewType = isSceneView ? SceneView : MapView;

    const renderMap = () => {
        const config = getConfig().portalInfo;
        if (config.itemId) {
            const map = new MapType({
                portalItem: {
                    id: config.itemId,
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
                }
            });
            reactiveUtils
                .whenOnce(() => view.ready)
                .then(async () => {
                    await waitForFeatureLayersLoad(view);
                    isSceneView
                        ? setSceneView(view as SceneView)
                        : setMapView(view as MapView);
                });
        }
    };
    useEffect(() => {
        if (viewRef.current) {
            renderMap();
        }
    }, [viewRef.current]);

    return (
        <div className='app-view-content'>
            <ToolbarGroup position='bottom'>
                <Toolbar>
                    <Navigation isSceneView={isSceneView} />
                </Toolbar>
            </ToolbarGroup>
            <ToolbarGroup position='right'>
                <Toolbar>
                    <Search />
                </Toolbar>
            </ToolbarGroup>
            <div ref={viewRef} className='app-view'></div>
        </div>
    );
};

export default AppView;
