import React from 'react';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import { MODE } from '@src/utils/constants';
import { useAppContext } from '@src/contexts/app-context-provider';

import strings from './strings';
import './switch-view.scss';
import image2d from '@assets/images/2d.svg';
import image3d from '@assets/images/3d.svg';

type SwitchViewProps = {
    view: MapView | SceneView;
    onTrigger: (activeView: string) => void;
};

const SwitchView: React.FC<SwitchViewProps> = (props: SwitchViewProps) => {
    const { view, onTrigger } = props;
    const { activeView, setActiveView } = useAppContext();
    const handleSwitchViewClicked = () => {
        const newActiveView =
            activeView === MODE.MAP_VIEW ? MODE.SCENE_VIEW : MODE.MAP_VIEW;
        setActiveView(newActiveView);
        onTrigger(newActiveView);
    };

    return (
        <CalciteAction
            scale='s'
            className='nav-switch-view'
            title={
                view?.type === MODE.MAP_VIEW
                    ? strings.switch3D
                    : strings.switch2D
            }
            label={
                view?.type === MODE.MAP_VIEW
                    ? strings.switch3D
                    : strings.switch2D
            }
            text={
                view?.type === MODE.MAP_VIEW
                    ? strings.switch3D
                    : strings.switch2D
            }
            onClick={handleSwitchViewClicked}
        >
            <img src={view?.type === MODE.MAP_VIEW ? image3d : image2d}></img>
        </CalciteAction>
    );
};

export default SwitchView;
