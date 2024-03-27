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
    view: __esri.MapView | __esri.SceneView;
    items: __esri.Basemap[];
    onBasemapChangeRequested: (bmap: __esri.Basemap) => void;
};

const BasemapList: React.FC<BasemapListProps> = ({
    view,
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
                    view.type === MODE.MAP_VIEW
                        ? strings.titleNSWBasemaps
                        : strings.titleESRI3DBasemaps
                }
            >
                {items.map((item, index) => (
                    <BasemapItem
                        item={item}
                        key={String(index)}
                        view={view}
                        onBasemapItemClicked={handleBasemapChangeRequest}
                    ></BasemapItem>
                ))}
            </CalciteAccordionItem>
            <CalciteAccordionItem
                className={classNames('basemap-list-item', {
                    disabled: true
                })}
                heading={
                    view.type === MODE.MAP_VIEW
                        ? strings.titleESRI3DBasemaps
                        : strings.titleNSWBasemaps
                }
            ></CalciteAccordionItem>
        </CalciteAccordion>
    );
};
export default BasemapList;
