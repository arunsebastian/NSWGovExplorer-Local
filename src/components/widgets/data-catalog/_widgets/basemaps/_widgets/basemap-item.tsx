import React, { useRef, useEffect } from 'react';
import { MODE, ENV } from '@src/utils/constants';
import { CalciteCard } from '@esri/calcite-components-react';

import './basemap-item.scss';

type BasemapItemProps = { context?: string; item: __esri.Basemap };

const BasemapItem: React.FC<BasemapItemProps> = ({
    context = MODE.MAP_VIEW,
    item
}: BasemapItemProps) => {
    console.log('Item', item);
    return (
        item && (
            <CalciteCard
                className='basemap-item'
                thumbnail-position='inline-start'
                title={item.title}
            >
                <img
                    slot='thumbnail'
                    src={item.thumbnailUrl}
                    alt={item.title}
                />
                <span slot='title' className='basemap-item-title'>
                    {item.title}
                </span>
                {/* <span className='basemap-item-sub-title'>
                {item && item.portalItem && item.portalItem.description}
            </span> */}
            </CalciteCard>
        )
    );
};
export default BasemapItem;

{
    /*  */
}
