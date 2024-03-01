import React, { useEffect } from 'react';
import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import HomeVM from '@arcgis/core/widgets/Home/HomeViewModel';

import strings from './strings';
import './home.scss';
import home from '@assets/images/home.svg';

type HomeProps = {
    view: MapView | SceneView;
};

const homeVM = new HomeVM();

const Home: React.FC<HomeProps> = (props: HomeProps) => {
    const { view } = props;

    const handleHomeClicked = () => {
        homeVM.go();
    };

    useEffect(() => {
        if (view) {
            homeVM.set('view', view);
        }
    }, [view]);

    return (
        <CalciteAction
            className='nav-home'
            title={strings.home}
            label={strings.home}
            text={strings.home}
            onClick={handleHomeClicked}
        >
            <img src={home}></img>
        </CalciteAction>
    );
};

export default Home;
