import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '@src/contexts/app-context-provider';
import Expand from '@arcgis/core/widgets/Expand';
import { MODE } from '@src/utils/constants';

import BaseMapSelector from './_widgets/basemaps/basemap-selector';
import LayerList from './_widgets/layer-list/layer-list';

import strings from './strings';
import './data-catalog.scss';

type DataCatalogProps = {
    context?: string;
};

const DataCatalog: React.FC<DataCatalogProps> = ({
    context = MODE.MAP_VIEW
}: DataCatalogProps) => {
    const { mapView, sceneView } = useAppContext();
    const containerRef = useRef<HTMLDivElement>();
    const dataCatalogRef = useRef<__esri.Expand>();

    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const isDataCatalogRendered = () => {
        return dataCatalogRef.current?.content ? true : false;
    };

    const purgeContainer = () => {
        const children: Array<HTMLElement> = Array.prototype.slice.call(
            containerRef.current.childNodes
        );
        children.forEach((child: HTMLElement) => {
            containerRef.current.removeChild(child);
        });
        containerRef.current.innerHTML = '';
    };

    const contentNode = document.createElement('div');
    contentNode.setAttribute('class', 'data-catalog-wrapper');

    const renderDataCatalog = () => {
        if (!isDataCatalogRendered()) {
            dataCatalogRef.current = new Expand({
                expandIcon: 'layers',
                collapseIcon: 'layers',
                content: contentNode,
                label: strings.title,
                expandTooltip: strings.title,
                collapseTooltip: strings.title,
                container: containerRef.current
            });
        }
    };

    const closeDataCatalog = () => {
        dataCatalogRef.current?.collapse();
    };

    useEffect(() => {
        if (view && containerRef.current) {
            purgeContainer();
            renderDataCatalog();
        }
    }, [view, containerRef.current]);

    return (
        <>
            <div className='data-catalog-trigger' ref={containerRef}></div>
            {dataCatalogRef.current?.content &&
                createPortal(
                    <div className='data-catalog-content'>
                        <LayerList
                            context={context}
                            onLayerListClosed={closeDataCatalog}
                        />
                        <BaseMapSelector context={context} />
                    </div>,
                    dataCatalogRef.current.content as HTMLElement
                )}
        </>
    );
};
export default DataCatalog;
