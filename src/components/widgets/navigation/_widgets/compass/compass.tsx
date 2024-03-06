import React, { useEffect, useRef } from 'react';

import { CalciteAction, CalciteIcon } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import CompassVM from '@arcgis/core/widgets/Compass/CompassViewModel';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { MODE } from '@src/utils/constants';

import strings from './strings';
import './compass.scss';

type CompassProps = {
    view: MapView | SceneView;
};

const Compass: React.FC<CompassProps> = (props: CompassProps) => {
    const { view } = props;
    const compassVM = useRef<CompassVM>(new CompassVM()).current;
    const compassRef = useRef<HTMLCalciteIconElement>();

    const handleCompassClicked = () => {
        compassVM.reset();
    };

    const updateCompass = (rotation: number) => {
        if (typeof rotation === 'number' && compassRef.current) {
            const needle = compassRef.current.shadowRoot.querySelector('svg');
            if (needle) {
                needle.setAttribute(
                    'style',
                    `transform:rotate(${rotation}deg)`
                );
            }
        }
    };

    useEffect(() => {
        if (view) {
            compassVM.set('view', view);
            reactiveUtils.watch(
                () =>
                    (view as SceneView).camera?.heading ??
                    (view as MapView).rotation,
                (rotation) =>
                    updateCompass(
                        view.type === MODE.MAP_VIEW ? rotation : 360 - rotation
                    )
            );
        }
    }, [view]);

    return (
        <CalciteAction
            scale='s'
            className='nav-compass'
            title={strings.compass}
            label={strings.compass}
            text={strings.compass}
            onClick={handleCompassClicked}
        >
            <CalciteIcon
                ref={compassRef}
                icon='compass-needle'
                text-label={strings.compass}
            ></CalciteIcon>
        </CalciteAction>
    );
};

export default Compass;
