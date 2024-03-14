import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';

import { MODE } from '@src/utils/constants';

import strings from './strings';
import './basemap-selector.scss';

import { CalcitePanel, CalciteBlock } from '@esri/calcite-components-react';

type BasemapSelectorProps = { context?: string };

const Navigation: React.FC<BasemapSelectorProps> = ({
    context = MODE.MAP_VIEW
}: BasemapSelectorProps) => {
    const { mapView, sceneView } = useAppContext();
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    return (
        // <CalciteBlock></CalciteBlock>
        <></>
    );
};

export default Navigation;
