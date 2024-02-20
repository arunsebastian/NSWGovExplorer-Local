import React from 'react';
import strings from './strings';
import './zoom-out.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import zoomOut from '@assets/images/zoom-out.svg';
type ZoomOutProps = {
    view: MapView;
};
const ZoomOut: React.FC<ZoomOutProps> = (props: ZoomOutProps) => {
    const { view } = props;
    const handleZoomOutClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-zoom-out'
            title={strings.zoomOut}
            label={strings.zoomOut}
            text={strings.zoomOut}
            onClick={handleZoomOutClicked}
        >
            <img src={zoomOut}></img>
        </CalciteAction>
    );
};

export default ZoomOut;
