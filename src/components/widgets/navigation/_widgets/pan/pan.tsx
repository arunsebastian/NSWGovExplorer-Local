import React from 'react';
import strings from './strings';
import './pan.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';

import pan from '@assets/images/pan.svg';
type PanProps = {
    view: MapView | SceneView;
};
const Pan: React.FC<PanProps> = (props: PanProps) => {
    const { view } = props;
    const handlePanClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-pan'
            title={strings.pan}
            label={strings.pan}
            text={strings.pan}
            onClick={handlePanClicked}
        >
            <img src={pan}></img>
        </CalciteAction>
    );
};

export default Pan;
