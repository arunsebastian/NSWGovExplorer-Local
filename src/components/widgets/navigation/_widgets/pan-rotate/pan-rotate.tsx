import React, { useEffect, useRef } from 'react';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import NavigationToggleVM from '@arcgis/core/widgets/NavigationToggle/NavigationToggleViewModel';
import { MODE } from '@src/utils/constants';

import strings from './strings';
import './pan-rotate.scss';
import pan from '@assets/images/pan.svg';
import rotate from '@assets/images/rotate.svg';

type PanRotateProps = {
    view: MapView | SceneView;
};

const PanRotate: React.FC<PanRotateProps> = (props: PanRotateProps) => {
    const { view } = props;
    const rotateHandler = useRef();
    const navToggleVM = useRef<NavigationToggleVM>(
        new NavigationToggleVM()
    ).current;

    const handlePanClicked = () => {
        if (view.type === MODE.MAP_VIEW) {
            if (rotateHandler.current) {
                (rotateHandler.current as any).remove();
                rotateHandler.current = null;
            }
        } else {

            if (navToggleVM.navigationMode !== 'pan') {
                navToggleVM.toggle();
            }
        }
    };

    const handleRotateClicked = () => {
        if (view.type === MODE.MAP_VIEW) {
            if (rotateHandler.current) {
                (rotateHandler.current as any).remove();
                rotateHandler.current = null;
                // allow drag
            } else {
                (rotateHandler as any).current = view.on(
                    'drag',
                    (event: __esri.ViewDragEvent) => {
                        rotateMapView(event);
                    }
                );
            }
        } else {

            if (navToggleVM.navigationMode !== 'rotate') {
                navToggleVM.toggle();
            }
        }
    };

    const rotateMapView = (event: __esri.ViewDragEvent) => {
        const center = { center: { x: event.x, y: event.y } };
        if (event.action === 'start') {
            (view as any).mapViewNavigation.rotate.begin(view, center);
            event.stopPropagation();
        } else if (event.action === 'update') {
            (view as any).mapViewNavigation.rotate.update(view, center);
            event.stopPropagation();
        } else if (event.action === 'end') {
            (view as any).mapViewNavigation.rotate.end();
            event.stopPropagation();
        }
    };

    useEffect(() => {
        if (view) {
            navToggleVM.set('view', view);
        }
    }, [view]);

    return (
        <>
            <CalciteAction
                scale='s'
                className='nav-pan'
                title={strings.pan}
                label={strings.pan}
                text={strings.pan}
                onClick={handlePanClicked}
            >
                <img src={pan}></img>
            </CalciteAction>
            <CalciteAction
                scale='s'
                className='nav-rotate'
                title={strings.rotate}
                label={strings.rotate}
                text={strings.rotate}
                onClick={handleRotateClicked}
            >
                <img src={rotate}></img>
            </CalciteAction>
        </>
    );
};

export default PanRotate;
