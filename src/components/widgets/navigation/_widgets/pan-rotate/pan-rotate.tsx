import React, { useEffect, useRef } from 'react';
import strings from './strings';
import './pan-rotate.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import NavigationToggleVM from '@arcgis/core/widgets/NavigationToggle/NavigationToggleViewModel';

import pan from '@assets/images/pan.svg';
import rotate from '@assets/images/rotate.svg';

type PanRotateProps = {
    view: MapView | SceneView;
};

const navToggleVM = new NavigationToggleVM();

const PanRotate: React.FC<PanRotateProps> = (props: PanRotateProps) => {
    const { view } = props;
    const rotateHandler = useRef();

    const handlePanClicked = () => {
        if (view.declaredClass.toLowerCase().includes('mapview')) {
            if (rotateHandler.current) {
                (rotateHandler.current as any).remove();
                rotateHandler.current = null;
            }
        } else {
            navToggleVM.set('navigationMode', 'pan');
        }
    };

    const handleRotateClicked = () => {
        if (view.declaredClass.toLowerCase().includes('mapview')) {
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
            navToggleVM.set('navigationMode', 'rotate');
        }
    };

    const rotateMapView = (event: __esri.ViewDragEvent) => {
        const center = { x: event.x, y: event.y };
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
                className='nav-pan'
                title={strings.pan}
                label={strings.pan}
                text={strings.pan}
                onClick={handlePanClicked}
            >
                <img src={pan}></img>
            </CalciteAction>
            <CalciteAction
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
