import React from 'react';

import AppView from '../components/app-view/app-view';
import { AppContextProvider } from '../contexts/app-context-provider';
import { MODE } from '@src/utils/constants';

import './app.scss';

const App: React.FC = () => {
    return (
        <AppContextProvider>
            <>
                <AppView test-id={MODE.MAP_VIEW} type={MODE.MAP_VIEW}></AppView>
                <AppView
                    test-id={MODE.SCENE_VIEW}
                    type={MODE.SCENE_VIEW}
                ></AppView>
            </>
        </AppContextProvider>
    );
};

export default App;
