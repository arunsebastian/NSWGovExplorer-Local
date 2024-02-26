import React from 'react';
import strings from './strings';
import './north-arrow.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import northArrow from '@assets/images/north-arrow.svg';

type NorthArrowProps = {
    view: MapView | SceneView;
};
const NorthArrow: React.FC<NorthArrowProps> = (props: NorthArrowProps) => {
    const { view } = props;
    const handleNorthArrowClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-north-arrow'
            title={strings.northArrow}
            label={strings.northArrow}
            text={strings.northArrow}
            onClick={handleNorthArrowClicked}
        >
            <img src={northArrow}></img>
        </CalciteAction>
    );
};

export default NorthArrow;
