import React, { createContext, useContext, useState } from 'react';
import type MapView from '@arcgis/core/views/MapView';
interface AppContextProps {
    loading: boolean;
    setLoading: (active: boolean) => void;
    mapView: MapView;
    setMapView: (view: MapView) => void;
}

type AppContextProviderProps = {
    children: JSX.Element;
};

// AppContext only ever used here, and will always be initialised in the AppContextProvider.
export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export function AppContextProvider(props: AppContextProviderProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [mapView, setMapView] = useState<MapView>();

    const context = {
        loading,
        setLoading,
        mapView,
        setMapView
    };

    return (
        <AppContext.Provider value={context}>
            {props.children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext) as AppContextProps;
}
