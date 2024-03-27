import React, { useEffect, useLayoutEffect, useRef } from 'react';
import MapView from '../components/map-view/2d/map-view';
import SceneView from '../components/map-view/3d/scene-view';
import Loader from '../components/loader/loader';

import { useAppContext } from '@src/contexts/app-context-provider';
import { MODE } from '@src/utils/constants';

import './app.scss';

const App: React.FC = () => {
    const appRef = useRef<HTMLDivElement>();
    const { mapView, sceneView, setActiveView } = useAppContext();

    useEffect(() => {
        const appViewNodes = Array.from(
            document.querySelectorAll('.map-view-container')
        ).concat(
            Array.from(document.querySelectorAll('.scene-view-container'))
        );
        if (appViewNodes.length === 1) {
            if (!mapView && sceneView) {
                // if there is only sceneView in the app
                setActiveView(MODE.SCENE_VIEW);
            } else if (mapView && !sceneView) {
                // if there is only mapView in the app
                setActiveView(MODE.MAP_VIEW);
            }
        }
    }, [appRef.current, mapView, sceneView]);

    return (
        <div className='app-content'>
            <div ref={appRef} className='app-view'>
                <MapView></MapView>
                <SceneView></SceneView>
            </div>
            <Loader />
        </div>
    );
};

export default App;
