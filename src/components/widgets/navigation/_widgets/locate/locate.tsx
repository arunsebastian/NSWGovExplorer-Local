import React from 'react';
import strings from './strings';
import './locate.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import locate from '@assets/images/locate.svg';
type LocateProps = {
    view: MapView | SceneView;
};
const Locate: React.FC<LocateProps> = (props: LocateProps) => {
    const { view } = props;
    const handleLocateClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-locate'
            title={strings.locate}
            label={strings.locate}
            text={strings.locate}
            onClick={handleLocateClicked}
        >
            <img src={locate}></img>
        </CalciteAction>
    );
};

export default Locate;
