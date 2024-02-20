import React from 'react';
import strings from './strings';
import './next.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import next from '@assets/images/next.svg';
type NextProps = {
    view: MapView;
};
const Next: React.FC<NextProps> = (props: NextProps) => {
    const { view } = props;
    const handleNextClicked = () => {
        console.log(view);
    };

    return (
        <CalciteAction
            className='nav-next'
            title={strings.next}
            label={strings.next}
            text={strings.next}
            onClick={handleNextClicked}
        >
            <img src={next}></img>
        </CalciteAction>
    );
};

export default Next;
