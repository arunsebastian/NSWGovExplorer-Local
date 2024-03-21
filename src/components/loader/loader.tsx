import React from 'react';
import { CalciteLoader } from '@esri/calcite-components-react/dist/components';
import { useAppContext } from '@src/contexts/app-context-provider';

import './loader.scss';

const Loader = () => {
    const { loading } = useAppContext();

    return (
        <div
            style={{ display: loading ? 'block' : 'none' }}
            className='masked-loader'
        >
            <CalciteLoader
                style={{ display: loading ? 'flex' : 'none' }}
                className='calci-loader'
                scale='s'
                label='Loader'
            ></CalciteLoader>
        </div>
    );
};

export default Loader;
