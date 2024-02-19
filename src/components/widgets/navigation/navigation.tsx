import React from 'react';
import type MapView from '@arcgis/core/views/MapView';
import './navigation.scss';

export type NavigationProps = {
    view: MapView;
};
import { CalciteButton } from '@esri/calcite-components-react';
const Toolbar: React.FC<NavigationProps> = (props: NavigationProps) => {
    const displayNavigationTools = () => {
        console.log(props.view);
    };
    return (
        <CalciteButton
            class='nav-trigger'
            onClick={displayNavigationTools}
            onMouseOver={displayNavigationTools}
        >
            Navigation
        </CalciteButton>
    );
};

export default Toolbar;
