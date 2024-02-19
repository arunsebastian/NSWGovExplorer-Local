import React from 'react';
import { signal } from '@preact/signals-react';
import ToolbarGroup from '../components/toolbar-group/toolbar-group';
import Toolbar from '../components/toolbar/toolbar';
import Navigation from '../components/widgets/navigation/navigation';
import type MapView from '@arcgis/core/views/MapView';

import './app.scss';

const mapView = signal(undefined);

const App: React.FC = () => {
    const onMapLoaded = (view: MapView) => {
        mapView.value = view;
    };

    return (
        <div className='app-content'>
            <ToolbarGroup>
                <Toolbar>
                    <Navigation view={mapView.value} />
                </Toolbar>
            </ToolbarGroup>
        </div>
    );
};

export default App;
