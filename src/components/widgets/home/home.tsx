import React from 'react';
import strings from './strings';
import './home.scss';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import home from '@assets/images/home.svg';
type HomeProps = {
    view: MapView;
};
const Home: React.FC<HomeProps> = (props: HomeProps) => {
    const { view } = props;
    const handleHomeClicked = () => {
        console.log(view);
    };

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
