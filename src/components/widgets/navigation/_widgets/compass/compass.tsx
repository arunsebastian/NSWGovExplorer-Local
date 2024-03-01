import React, { useEffect, useRef, useState } from 'react';

import { CalciteAction, CalciteIcon } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import CompassVM from '@arcgis/core/widgets/Compass/CompassViewModel';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

import strings from './strings';
import './compass.scss';

type CompassProps = {
    view: MapView | SceneView;
};

const compassVM = new CompassVM();

const Compass: React.FC<CompassProps> = (props: CompassProps) => {
    const { view } = props;
    const [rotation, setRotation] = useState<number>(0);
    const compassRef = useRef<HTMLCalciteIconElement>();

    const handleCompassClicked = () => {
        compassVM.reset();
    };

    useEffect(() => {
        if (view) {
            compassVM.set('view', view);
            reactiveUtils.watch(
                () => (view as MapView).rotation,
                (rotation: number) => {
                    setRotation(rotation);
                }
            );
        }
    }, [view]);

    useEffect(() => {
        if (typeof rotation === 'number' && compassRef.current) {
            const needle = compassRef.current.shadowRoot.querySelector('svg');
            if (needle) {
                needle.setAttribute(
                    'style',
                    `transform:rotate(${rotation}deg)`
                );
            }
        }
    }, [rotation, compassRef.current]);

    return (
        <CalciteAction
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
