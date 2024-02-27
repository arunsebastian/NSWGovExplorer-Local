import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import NavigationToggle from '@arcgis/core/widgets/NavigationToggle';

import ToolbarGroup from '../toolbar-group/toolbar-group';
import Toolbar from '../toolbar/toolbar';
import Navigation from '../widgets/navigation/navigation';
import Search from '../widgets/search/search';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { getConfig } from '@src/utils/config';
import { waitForFeatureLayersLoad } from '../../utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './app-view.scss';
enum RENDER_MODE {
    MAPVIEW = '2d',
    SCENEVIEW = '3d'
}

type AppProps = {
    type?: string;
};

const AppView: React.FC<AppProps> = ({
    type = RENDER_MODE.MAPVIEW
}: AppProps) => {
    const viewRef = useRef();
    const { setMapView, setSceneView } = useAppContext();

    const MapType = type === RENDER_MODE.SCENEVIEW ? WebScene : WebMap;
    const ViewType = type === RENDER_MODE.SCENEVIEW ? SceneView : MapView;

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

                    const navigationToggle = new NavigationToggle({
                        //@ts-ignore
                        view: view
                    });

                    // and adds it to the top right of the view
                    view.ui.add(navigationToggle, 'top-left');

                    type === RENDER_MODE.SCENEVIEW
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
                    <Navigation isSceneView={type === RENDER_MODE.SCENEVIEW} />
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
