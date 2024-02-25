import React, { useRef } from 'react';
import { effect } from '@preact/signals-react';
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
import styles from './dynamic-styles';
import './navigation.scss';

import {
    CalciteButton,
    CalcitePopover,
    CalciteActionBar
} from '@esri/calcite-components-react';

const Navigation: React.FC = () => {
    const { mapView } = useAppContext();

    const navRef = useRef<HTMLCalciteButtonElement>();
    const popOverRef = useRef<HTMLCalcitePopoverElement>();

    const toggleNavigationTools = () => {
        if (mapView) {
            popOverRef.current.open = !popOverRef.current.open;
        }
    };

    const applyCustomStyles = () => {
        const node = navRef.current;
        const shadowRoot = node.shadowRoot;
        if (shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(styles.contentButton);
            const elemStyleSheets = node.shadowRoot.adoptedStyleSheets;
            // Append your style to the existing style sheet.
            shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet];
        }
    };

    effect(() => {
        if (mapView && navRef.current) {
            navRef.current.removeAttribute('disabled');
            applyCustomStyles();
        }
    });

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
