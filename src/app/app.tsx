import React from 'react';

import AppView from '../components/app-view/app-view';
import { AppContextProvider } from '../contexts/app-context-provider';

import './app.scss';

const App: React.FC = () => {
    return (
        <AppContextProvider>
            <AppView></AppView>
        </AppContextProvider>
    );
};

export default App;
