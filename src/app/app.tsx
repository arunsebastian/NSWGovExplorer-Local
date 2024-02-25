import React from 'react';

import AppMapView from '../components/widgets/map/app-map-view';
import { AppContextProvider } from '../contexts/app-context-provider';

import './app.scss';

const App: React.FC = () => {
    return (
        <AppContextProvider>
            <AppMapView></AppMapView>
        </AppContextProvider>
    );
};

export default App;
