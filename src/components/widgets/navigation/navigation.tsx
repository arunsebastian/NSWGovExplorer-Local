import React, { useRef } from 'react';
import { effect, signal } from '@preact/signals-react';
import { useAppContext } from '@src/contexts/app-context-provider';

import Rotate from '../rotate/rotate';
import Pan from '../pan/pan';
import ZoomIn from '../zoom-in/zoom-in';
import ZoomOut from '../zoom-out/zoom-out';
import Home from '../home/home';

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
                    {/* <CalciteAction text='Save' icon='save'></CalciteAction>
                    <CalciteAction text='Undo' icon='undo'></CalciteAction>
                    <CalciteAction text='Redo' icon='redo'></CalciteAction> */}
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
