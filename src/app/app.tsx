import React, { useState } from 'react';
import { signal } from '@preact/signals-react';
import ToolbarGroup from '../components/toolbar-group/toolbar-group';
import Toolbar from '../components/toolbar/toolbar';
import Navigation from '../components/widgets/navigation/navigation';
import AppMapView from '../components/widgets/map/app-map-view';
import { AppContextProvider } from '../contexts/app-context-provider';

import './app.scss';

const App: React.FC = () => {
    return (
        <AppContextProvider>
            <div className='app-content'>
                <AppMapView />
                <ToolbarGroup>
                    <Toolbar>
                        <Navigation />
                    </Toolbar>
                </ToolbarGroup>
            </div>
        </AppContextProvider>
    );
};

export default App;
