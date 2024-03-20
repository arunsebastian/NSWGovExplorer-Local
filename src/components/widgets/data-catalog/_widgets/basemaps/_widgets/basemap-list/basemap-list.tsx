import React from 'react';
import BasemapItem from '../basemap-item/basemap-item';
import { MODE } from '@src/utils/constants';
import classNames from 'classnames';

import {
    CalciteAccordion,
    CalciteAccordionItem
} from '@esri/calcite-components-react';

import strings from './strings';
import './basemap-list.scss';

type BasemapListProps = {
    context?: string;
    items: __esri.Basemap[];
    onBasemapChangeRequested: (bmap: __esri.Basemap) => void;
};

const BasemapList: React.FC<BasemapListProps> = ({
    context = MODE.MAP_VIEW,
    items,
    onBasemapChangeRequested
}: BasemapListProps) => {
    const handleBasemapChangeRequest = (item: __esri.Basemap) => {
        onBasemapChangeRequested && onBasemapChangeRequested(item);
    };

    return (
        <CalciteAccordion
            selection-mode='single-persist'
            className='basemap-list'
        >
            <CalciteAccordionItem
                className='basemap-list-item'
                expanded={true}
                heading={
                    context === MODE.MAP_VIEW
                        ? strings.titleNSWBasemaps
                        : strings.titleESRI3DBasemaps
                }
            >
                {items.map((item, index) => (
                    <BasemapItem
                        item={item}
                        key={String(index)}
                        onBasemapItemClicked={handleBasemapChangeRequest}
                    ></BasemapItem>
                ))}
            </CalciteAccordionItem>
            <CalciteAccordionItem
                className={classNames('basemap-list-item', {
                    disabled: true
                })}
                heading={
                    context === MODE.MAP_VIEW
                        ? strings.titleESRI3DBasemaps
                        : strings.titleNSWBasemaps
                }
            ></CalciteAccordionItem>
        </CalciteAccordion>
    );
};
export default BasemapList;
