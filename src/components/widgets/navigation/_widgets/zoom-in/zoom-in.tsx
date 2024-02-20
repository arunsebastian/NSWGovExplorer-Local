import React from 'react';
import strings from './strings';
import './zoom-in.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import zoomIn from '@assets/images/zoom-in.svg';
type ZoomInProps = {
    view: MapView;
};
const ZoomIn: React.FC<ZoomInProps> = (props: ZoomInProps) => {
    const { view } = props;
    const handleZoomInClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-zoom-in'
            title={strings.zoomIn}
            label={strings.zoomIn}
            text={strings.zoomIn}
            onClick={handleZoomInClicked}
        >
            <img src={zoomIn}></img>
        </CalciteAction>
    );
};

export default ZoomIn;
