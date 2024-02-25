import React, { createContext, useContext, useState } from 'react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
interface AppContextProps {
    loading: boolean;
    setLoading: (active: boolean) => void;
    mapView: MapView;
    setMapView: (view: MapView) => void;
    sceneView: SceneView;
    setSceneView: (view: SceneView) => void;
    activeMapTool: string;
    setActiveMapTool: (tool: string) => void;
}

type AppContextProviderProps = {
    children: JSX.Element;
};

// AppContext only ever used here, and will always be initialised in the AppContextProvider.
export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export function AppContextProvider(props: AppContextProviderProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [mapView, setMapView] = useState<MapView>();
    const [sceneView, setSceneView] = useState<SceneView>();
    const [activeMapTool, setActiveMapTool] = useState<string>();

    const context = {
        loading,
        setLoading,
        mapView,
        setMapView,
        sceneView,
        setSceneView,
        activeMapTool,
        setActiveMapTool
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
