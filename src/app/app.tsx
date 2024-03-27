import React, { useLayoutEffect } from 'react';
import MapView from '../components/map-view/map-view';
import Loader from '../components/loader/loader';

import { useAppContext } from '@src/contexts/app-context-provider';
import { MODE } from '@src/utils/constants';

import './app.scss';

const App: React.FC = () => {
    const { mapView, sceneView, setActiveView } = useAppContext();

    useLayoutEffect(() => {
        if (!mapView && sceneView) {
            // if there is only sceneView in the app
            setActiveView(MODE.SCENE_VIEW);
        } else if (mapView && !sceneView) {
            // if there is only mapView in the app
            setActiveView(MODE.MAP_VIEW);
        }
    }, [mapView, sceneView]);

    return (
        <div className='app-content'>
            <div className='app-view'>
                <MapView type={MODE.MAP_VIEW}></MapView>
                <MapView type={MODE.SCENE_VIEW}></MapView>
            </div>
            <Loader />
        </div>
    );
};

export default App;
