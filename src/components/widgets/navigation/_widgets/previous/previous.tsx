import React from 'react';
import strings from './strings';
import './previous.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import previous from '@assets/images/previous.svg';
type PreviousProps = {
    view: MapView;
};
const Previous: React.FC<PreviousProps> = (props: PreviousProps) => {
    const { view } = props;
    const handlePreviousClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-previous'
            title={strings.previous}
            label={strings.previous}
            text={strings.previous}
            onClick={handlePreviousClicked}
        >
            <img src={previous}></img>
        </CalciteAction>
    );
};

export default Previous;
