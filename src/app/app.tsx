import React from 'react';
import AppView from '../components/app-view/app-view';
import { MODE } from '@src/utils/constants';
import './app.scss';

const App: React.FC = () => {
    return (
        <>
            <AppView type={MODE.MAP_VIEW}></AppView>
            <AppView type={MODE.SCENE_VIEW}></AppView>
        </>
    );
};

export default App;
