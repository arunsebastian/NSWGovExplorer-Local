import React, { useRef } from 'react';
import type MapView from '@arcgis/core/views/MapView';
import { effect } from '@preact/signals-react';
import './navigation.scss';

export type NavigationProps = {
    view?: MapView;
};
import { CalciteButton } from '@esri/calcite-components-react';
const Toolbar: React.FC<NavigationProps> = (props: NavigationProps) => {
    const { view } = props;
    const navRef = useRef<HTMLCalciteButtonElement>();

    effect(() => {
        console.log(view);
        if (view) {
            navRef.current?.removeAttribute('disabled');
        }
    });

    const displayNavigationTools = () => {
        console.log(view);
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
