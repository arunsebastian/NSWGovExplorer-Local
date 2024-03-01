import React, { useEffect } from 'react';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import LocateVM from '@arcgis/core//widgets/Locate/LocateViewModel';

import strings from './strings';
import './locate.scss';
import locate from '@assets/images/locate.svg';

type LocateProps = {
    view: MapView | SceneView;
};

const locateVM = new LocateVM();

const Locate: React.FC<LocateProps> = (props: LocateProps) => {
    const { view } = props;

    const handleLocateClicked = () => {
        locateVM.locate();
    };

    useEffect(() => {
        if (view) {
            locateVM.set('view', view);
        }
    }, [view]);

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
