import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';

import PanRotate from './_widgets/pan-rotate/pan-rotate';
import Zoom from './_widgets/zoom/zoom';
import Home from './_widgets/home/home';
import PreviousNext from './_widgets/previous-next/previous-next';
import Locate from './_widgets/locate/locate';
import NorthArrow from './_widgets/compass/compass';
import SwitchView from './_widgets/switch-view/switch-view';
import { MODE, TOOL } from '@src/utils/constants';
import { getWidgetConfig } from '@src/config/config';
import { syncMaps } from '@src/utils/map';

import strings from './strings';
import styles from './dynamic-styles';
import './navigation.scss';

import {
    CalciteButton,
    CalcitePopover,
    CalciteActionBar
} from '@esri/calcite-components-react';

type NavigationProps = {
    context?: string;
};

type PinStatus = {
    status: boolean;
};

const Navigation: React.FC<NavigationProps> = ({
    context = MODE.MAP_VIEW
}: NavigationProps) => {
    const { mapView, sceneView } = useAppContext();
    const navRef = useRef<HTMLCalciteButtonElement>();
    const toolsDisplayTimerRef = useRef<any>();
    const popOverRef = useRef<HTMLCalcitePopoverElement>();
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;
    const config = getWidgetConfig(TOOL.NAVIGATION);

    const showNavigationTools = () => {
        toolsDisplayTimerRef.current
            ? window.clearTimeout(toolsDisplayTimerRef.current)
            : null;
        if (context === MODE.SCENE_VIEW ? sceneView : mapView) {
            popOverRef.current.open = true;
        }
    };

    const hideNavigationTools = () => {
        toolsDisplayTimerRef.current = window.setTimeout(() => {
            const currentDoms = Array.from(document.querySelectorAll(':hover'));
            const keepNavtoolOpen = currentDoms.some((dom: HTMLElement) => {
                return (
                    dom.classList.contains('nav-bar') ||
                    dom.classList.contains('nav-trigger') ||
                    (dom.tagName.toLowerCase() === 'calcite-popover' &&
                        dom.getAttribute('label') === strings.navigation)
                );
            });
            if (
                !keepNavtoolOpen &&
                (context === MODE.SCENE_VIEW ? sceneView : mapView)
            ) {
                popOverRef.current.open = false;
                window.clearTimeout(toolsDisplayTimerRef.current);
            }
        }, config.displayTimeOut * 1000);
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

    const onViewSwitch = (activeView: string) => {
        const source = activeView === MODE.MAP_VIEW ? sceneView : mapView;
        const target = activeView === MODE.MAP_VIEW ? mapView : sceneView;
        syncMaps(source, target);
    };

    useEffect(() => {
        view && navRef.current
            ? (navRef.current.removeAttribute('disabled'), applyCustomStyles())
            : navRef.current.setAttribute('disabled', 'true');
    }, [view]);

    return (
        <>
            <CalcitePopover
                label={strings.navigation}
                ref={popOverRef}
                open={false}
                placement='top'
                referenceElement={`nav-trigger-${context}`}
                onMouseLeave={hideNavigationTools}
            >
                <CalciteActionBar
                    layout='horizontal'
                    className='nav-bar'
                    expandDisabled={true}
                >
                    {sceneView && mapView && (
                        <SwitchView
                            view={
                                context === MODE.SCENE_VIEW
                                    ? sceneView
                                    : mapView
                            }
                            onTrigger={onViewSwitch}
                        />
                    )}
                    <PanRotate
                        view={context === MODE.SCENE_VIEW ? sceneView : mapView}
                    />
                    <Zoom
                        view={context === MODE.SCENE_VIEW ? sceneView : mapView}
                    />
                    <Home
                        view={context === MODE.SCENE_VIEW ? sceneView : mapView}
                    />
                    <PreviousNext
                        view={context === MODE.SCENE_VIEW ? sceneView : mapView}
                    />
                    <Locate
                        view={context === MODE.SCENE_VIEW ? sceneView : mapView}
                    />
                    <NorthArrow
                        view={context === MODE.SCENE_VIEW ? sceneView : mapView}
                    />
                </CalciteActionBar>
            </CalcitePopover>
            <CalciteButton
                id={`nav-trigger-${context}`}
                title={strings.navigation}
                label={strings.navigation}
                ref={navRef}
                kind='neutral'
                className='nav-trigger'
                onMouseOver={showNavigationTools}
                onMouseLeave={hideNavigationTools}
            >
                {strings.navigation}
            </CalciteButton>
        </>
    );
};

export default Navigation;
