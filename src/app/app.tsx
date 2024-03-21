import React from 'react';
import MapView from '../components/map-view/map-view';
import Loader from '../components/loader/loader';
import { MODE } from '@src/utils/constants';
import './app.scss';

const App: React.FC = () => {
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
