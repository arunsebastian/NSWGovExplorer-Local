import React, { useRef } from 'react';
import { effect } from '@preact/signals-react';
import { useAppContext } from '@src/contexts/app-context-provider';
import './navigation.scss';

import { CalciteButton } from '@esri/calcite-components-react';
const Toolbar: React.FC = () => {
    const { mapView, setMapView } = useAppContext();

    const navRef = useRef<HTMLCalciteButtonElement>();

    effect(() => {
        if (mapView) {
            navRef.current?.removeAttribute('disabled');
        }
    });

    const displayNavigationTools = () => {
        console.log(mapView);
    };

    return (
        <CalciteButton
            disabled
            ref={navRef}
            className='nav-trigger'
            onClick={displayNavigationTools}
            onMouseOver={displayNavigationTools}
        >
            Navigation
        </CalciteButton>
    );
};

export default Toolbar;
