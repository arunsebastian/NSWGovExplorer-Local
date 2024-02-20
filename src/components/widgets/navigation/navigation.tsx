import React, { useRef } from 'react';
import { effect, signal } from '@preact/signals-react';
import { useAppContext } from '@src/contexts/app-context-provider';

import Rotate from './_widgets/rotate/rotate';
import Pan from './_widgets/pan/pan';
import ZoomIn from './_widgets/zoom-in/zoom-in';
import ZoomOut from './_widgets/zoom-out/zoom-out';
import Home from './_widgets/home/home';
import Previous from './_widgets/previous/previous';
import Next from './_widgets/next/next';
import Locate from './_widgets/locate/locate';
import NorthArrow from './_widgets/north-arrow/north-arrow';

import strings from './strings';
import './navigation.scss';

import {
    CalciteButton,
    CalcitePopover,
    CalciteActionBar
} from '@esri/calcite-components-react';

const isDisplaying = signal(false);

const Navigation: React.FC = () => {
    const { mapView, setMapView } = useAppContext();

    const navRef = useRef<HTMLCalciteButtonElement>();
    const popOverRef = useRef<HTMLCalcitePopoverElement>();

    effect(() => {
        mapView ? navRef.current?.removeAttribute('disabled') : null;
        if (popOverRef.current) {
            popOverRef.current.open = isDisplaying.value;
        }
    });

    const toggleNavigationTools = () => {
        if (!popOverRef.current.open) {
            isDisplaying.value = !isDisplaying.value;
        }
    };

    return (
        <>
            <CalcitePopover
                label={strings.navigationToolbar}
                ref={popOverRef}
                referenceElement='nav-trigger'
            >
                <CalciteActionBar layout='horizontal'>
                    <Rotate view={mapView} />
                    <Pan view={mapView} />
                    <ZoomIn view={mapView} />
                    <ZoomOut view={mapView} />
                    <Home view={mapView} />
                    <Previous view={mapView} />
                    <Next view={mapView} />
                    <Locate view={mapView} />
                    <NorthArrow view={mapView} />
                </CalciteActionBar>
            </CalcitePopover>
            <CalciteButton
                disabled
                id='nav-trigger'
                title={strings.navigation}
                label={strings.navigation}
                ref={navRef}
                kind='neutral'
                className='nav-trigger'
                onMouseOver={toggleNavigationTools}
            >
                {strings.navigation}
            </CalciteButton>
        </>
    );
};

export default Navigation;
