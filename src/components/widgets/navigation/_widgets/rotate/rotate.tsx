import React from 'react';
import strings from './strings';
import './rotate.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type SceneView from '@arcgis/core/views/SceneView';
import rotate from '@assets/images/rotate.svg';
type RotateProps = {
    view: SceneView;
};
const Rotate: React.FC<RotateProps> = (props: RotateProps) => {
    const { view } = props;
    const handleRotateClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-rotate'
            title={strings.rotate}
            label={strings.rotate}
            text={strings.rotate}
            onClick={handleRotateClicked}
        >
            <img src={rotate}></img>
        </CalciteAction>
    );
};

export default Rotate;
