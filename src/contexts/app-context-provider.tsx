import React, { createContext, useContext, useState } from 'react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import { MODE } from '@src/utils/constants';

interface AppContextProps {
    loading: boolean;
    setLoading: (active: boolean) => void;
    mapView: MapView;
    setMapView: (view: __esri.MapView) => void;
    sceneView: SceneView;
    setSceneView: (view: __esri.SceneView) => void;
    activeView: string;
    setActiveView: (type: string) => void;
}

type AppContextProviderProps = {
    children: JSX.Element;
};

// AppContext only ever used here, and will always be initialised in the AppContextProvider.
export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export function AppContextProvider(props: AppContextProviderProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [mapView, setMapView] = useState<__esri.MapView>();
    const [sceneView, setSceneView] = useState<__esri.SceneView>();
    const [activeView, setActiveView] = useState<string>(MODE.MAP_VIEW);

    const context = {
        loading,
        setLoading,
        mapView,
        setMapView,
        sceneView,
        setSceneView,
        activeView,
        setActiveView
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
