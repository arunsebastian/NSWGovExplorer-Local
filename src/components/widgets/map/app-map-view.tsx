import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import ToolbarGroup from '../../toolbar-group/toolbar-group';
import Toolbar from '../../toolbar/toolbar';
import Navigation from '../../widgets/navigation/navigation';
import Search from '../../widgets/search/search';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { getConfig } from '@src/utils/config';
import { waitForFeatureLayersLoad } from '../../../utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './app-map-view.scss';

const AppMapView: React.FC = () => {
    const viewRef = useRef();
    const { setMapView } = useAppContext();

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
            const view = new MapView({
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
                    setMapView(view);
                });
        }
    };
    useEffect(() => {
        if (viewRef.current) {
            renderWebMap();
        }
    }, [viewRef.current]);

    return (
        <div className='app-map-view-content'>
            <ToolbarGroup position='bottom'>
                <Toolbar>
                    <Navigation />
                </Toolbar>
            </ToolbarGroup>
            <ToolbarGroup position='right'>
                <Toolbar>
                    <Search />
                </Toolbar>
            </ToolbarGroup>
            <div ref={viewRef} className='app-map-view'></div>
        </div>
    );
};

export default AppMapView;
