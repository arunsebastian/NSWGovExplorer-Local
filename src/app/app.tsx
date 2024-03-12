import React from 'react';
import MapView from '../components/map-view/map-view';
import { MODE } from '@src/utils/constants';
import './app.scss';

const App: React.FC = () => {
    return (
        <>
            <MapView type={MODE.MAP_VIEW}></MapView>
            <MapView type={MODE.SCENE_VIEW}></MapView>
        </>
    );
};

export default App;
