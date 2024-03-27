import React, { useRef, useEffect, useState } from 'react';
import { default as View3D } from '@arcgis/core/views/SceneView';
import WebScene from '@arcgis/core/WebScene';
import classNames from 'classnames';

import MapToolbar from '../../map-toolbar/map-toolbar';
import Navigation from '../../widgets/navigation/navigation';
import Legend from '../../widgets/legend/legend';
import DataCatalog from '../../widgets/data-catalog/data-catalog';

import { ENV, MODE } from '@src/utils/constants';

import { getConfig } from '@src/config/config';

import { useAppContext } from '@src/contexts/app-context-provider';

import './scene-view.scss';

const SceneView: React.FC = () => {
    const viewRef = useRef();
    const { activeView, loading, setSceneView } = useAppContext();
    const [view, setView] = useState<__esri.SceneView>();

    const renderMap = async () => {
        const config = getConfig(ENV.AGOL).portalInfo;
        if (config) {
            const scene = new WebScene({
                portalItem: {
                    id: config.sceneId,
                    portal: {
                        url: config.url
                    }
                }
            });

            await scene.loadAll();

            const view3d = new View3D({
                container: viewRef.current,
                map: scene,
                ui: {
                    components: ['attribution']
                },
                constraints: {
                    // Disable zoom snapping to get the best synchronization
                    snapToZoom: true
                }
            } as any);

            setView(view3d);
            setSceneView(view3d);
        }
    };

    useEffect(() => {
        if (!view) viewRef.current && renderMap();
    }, [viewRef.current]);

    return (
        <div
            className={classNames('scene-view-container', {
                inactive: MODE.SCENE_VIEW !== activeView,
                masked: loading
            })}
        >
            <div ref={viewRef} className='scene-view'></div>
            <MapToolbar position='bottom'>
                <Navigation view={view}></Navigation>
            </MapToolbar>
            <MapToolbar position='right' stack='horizontal'>
                <DataCatalog view={view}></DataCatalog>
                <Legend view={view}></Legend>
            </MapToolbar>
        </div>
    );
};

export default SceneView;
