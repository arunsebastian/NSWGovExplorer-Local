import React from 'react';
import strings from './strings';
import './pan-rotate.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';

import pan from '@assets/images/pan.svg';
import rotate from '@assets/images/rotate.svg';

type PanProps = {
    view: MapView | SceneView;
};
const Pan: React.FC<PanProps> = (props: PanProps) => {
    const { view } = props;
    const handlePanClicked = () => {
        console.log(view);
    };
    const handleRotateClicked = () => {};

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

export default Pan;
