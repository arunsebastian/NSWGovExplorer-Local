import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

// import NavigationToggle from '@arcgis/core/widgets/NavigationToggle';

import ToolbarGroup from '../toolbar-group/toolbar-group';
import Toolbar from '../toolbar/toolbar';
import Navigation from '../widgets/navigation/navigation';
import { MODE } from '@src/utils/constants';
// import Search from '../widgets/search/search';

import { getConfig } from '@src/utils/config';
import { waitForFeatureLayersLoad } from '../../utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './app-view.scss';

type AppProps = {
    type?: string;
};

const AppView: React.FC<AppProps> = ({ type = MODE.MAP_VIEW }: AppProps) => {
    const viewRef = useRef();
    const { setMapView, setSceneView } = useAppContext();

    const MapType = type === MODE.SCENE_VIEW ? WebScene : WebMap;
    const ViewType = type === MODE.SCENE_VIEW ? SceneView : MapView;

    const renderMap = () => {
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
                }
            });
            reactiveUtils
                .whenOnce(() => view.ready)
                .then(async () => {
                    await waitForFeatureLayersLoad(view);
                    type === MODE.SCENE_VIEW
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
