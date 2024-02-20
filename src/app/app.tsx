import React, { useState } from 'react';
import { signal } from '@preact/signals-react';
import ToolbarGroup from '../components/toolbar-group/toolbar-group';
import Toolbar from '../components/toolbar/toolbar';
import Navigation from '../components/widgets/navigation/navigation';
import AppMapView from '../components/widgets/map/app-map-view';
import type MapView from '@arcgis/core/views/MapView';

import './app.scss';

const mapView = signal(undefined);

const App: React.FC = () => {
    //const [view, setView] = useState(undefined);
    const handleMapAndLayersLoaded = (view: MapView) => {
        console.log('Call back after view is rendered', view);
        mapView.value = view;
        // setView(view);
    };

    return (
        <div className='app-content'>
            <AppMapView onMapAndLayersLoaded={handleMapAndLayersLoaded} />
            <ToolbarGroup>
                <Toolbar>
                    <Navigation view={mapView.value} />
                </Toolbar>
            </ToolbarGroup>
        </div>
    );
};

export default App;
