import React, { useEffect, useRef } from 'react';
import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

import strings from './strings';
import './zoom.scss';
import zoomIn from '@assets/images/zoom-in.svg';
import zoomOut from '@assets/images/zoom-out.svg';

type ZoomProps = {
    view: MapView | SceneView;
};

const Zoom: React.FC<ZoomProps> = (props: ZoomProps) => {
    const { view } = props;
    const zoomVM = useRef<ZoomVM>(new ZoomVM()).current;
    const zoomInRef = useRef<HTMLCalciteActionElement>();
    const zoomOutRef = useRef<HTMLCalciteActionElement>();

    const handleZoomInClicked = () => {
        if (zoomVM.canZoomIn) {
            zoomVM.zoomIn();
        }
    };

    const handleZoomOutClicked = () => {
        if (zoomVM.canZoomOut) {
            zoomVM.zoomOut();
        }
    };

    const enableZoomOut = () => {
        zoomOutRef.current.removeAttribute('disabled');
    };

    const disableZoomOut = () => {
        zoomOutRef.current.setAttribute('disabled', 'true');
    };

    const enableZoomIn = () => {
        zoomInRef.current.removeAttribute('disabled');
    };

    const disableZoomIn = () => {
        zoomInRef.current.setAttribute('disabled', 'true');
    };

    useEffect(() => {
        if (view) {
            zoomVM.set('view', view);
            reactiveUtils.watch(
                () => zoomVM?.canZoomIn,
                (canZoomIn: boolean) => {
                    if (canZoomIn) {
                        enableZoomIn();
                    } else {
                        disableZoomIn();
                    }
                }
            );
            reactiveUtils.watch(
                () => zoomVM?.canZoomOut,
                (canZoomOut: boolean) => {
                    if (canZoomOut) {
                        enableZoomOut();
                    } else {
                        disableZoomOut();
                    }
                }
            );
        }
        if (zoomInRef.current) {
            zoomVM.canZoomIn ? enableZoomIn() : disableZoomIn();
        }
        if (zoomOutRef.current) {
            zoomVM.canZoomOut ? enableZoomOut() : disableZoomOut();
        }
    }, [view, zoomInRef.current, zoomOutRef.current]);

    return (
        <>
            <CalciteAction
                scale='s'
                className='nav-zoom-in'
                ref={zoomInRef}
                title={strings.zoomIn}
                label={strings.zoomIn}
                text={strings.zoomIn}
                onClick={handleZoomInClicked}
            >
                <img src={zoomIn}></img>
            </CalciteAction>
            <CalciteAction
                scale='s'
                className='nav-zoom-out'
                ref={zoomOutRef}
                title={strings.zoomOut}
                label={strings.zoomOut}
                text={strings.zoomOut}
                onClick={handleZoomOutClicked}
            >
                <img src={zoomOut}></img>
            </CalciteAction>
        </>
    );
};

export default Zoom;
