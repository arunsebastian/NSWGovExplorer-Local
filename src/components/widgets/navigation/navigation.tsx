import React, { useRef } from 'react';
import { effect } from '@preact/signals-react';
import { useAppContext } from '@src/contexts/app-context-provider';

import PanRotate from './_widgets/pan-rotate/pan-rotate';
import Zoom from './_widgets/zoom/zoom';
import Home from './_widgets/home/home';
import PreviousNext from './_widgets/previous-next/previous-next';
import Locate from './_widgets/locate/locate';
import NorthArrow from './_widgets/compass/compass';

import strings from './strings';
import styles from './dynamic-styles';
import './navigation.scss';

import {
    CalciteButton,
    CalcitePopover,
    CalciteActionBar
} from '@esri/calcite-components-react';

type NavigationProps = {
    isSceneView?: boolean;
};
const Navigation: React.FC<NavigationProps> = ({
    isSceneView = false
}: NavigationProps) => {
    const { mapView, sceneView } = useAppContext();
    const navRef = useRef<HTMLCalciteButtonElement>();
    const popOverRef = useRef<HTMLCalcitePopoverElement>();

    const toggleNavigationTools = () => {
        if (isSceneView ? sceneView : mapView) {
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
        if ((isSceneView ? sceneView : mapView) && navRef.current) {
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
                <CalciteActionBar layout='horizontal' expandDisabled={true}>
                    <PanRotate view={isSceneView ? sceneView : mapView} />
                    <Zoom view={isSceneView ? sceneView : mapView} />
                    <Home view={isSceneView ? sceneView : mapView} />
                    <PreviousNext view={isSceneView ? sceneView : mapView} />
                    <Locate view={isSceneView ? sceneView : mapView} />
                    <NorthArrow view={isSceneView ? sceneView : mapView} />
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
