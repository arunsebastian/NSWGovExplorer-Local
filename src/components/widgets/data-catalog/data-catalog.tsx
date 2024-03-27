import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '@src/contexts/app-context-provider';
import Expand from '@arcgis/core/widgets/Expand';
import { MODE } from '@src/utils/constants';

import BaseMapSelector from './_widgets/basemaps/basemap-selector';
import LayerList from './_widgets/layer-list/layer-list';

import strings from './strings';
import './data-catalog.scss';

type DataCatalogProps = {
    view: __esri.MapView | __esri.SceneView;
};

const DataCatalog: React.FC<DataCatalogProps> = ({
    view
}: DataCatalogProps) => {
    const containerRef = useRef<HTMLDivElement>();
    const dataCatalogRef = useRef<__esri.Expand>();
    const [catalogRendered, setCatalogRendered] = useState<boolean>(false);

    const isDataCatalogRendered = () => {
        return catalogRendered;
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

    const renderDataCatalog = () => {
        if (!isDataCatalogRendered()) {
            const contentNode = document.createElement('div');
            contentNode.setAttribute('class', 'data-catalog-wrapper');

            (dataCatalogRef as any).current = new Expand({
                expandIcon: 'layers',
                collapseIcon: 'layers',
                content: contentNode,
                label: strings.title,
                expandTooltip: strings.title,
                collapseTooltip: strings.title,
                container: containerRef.current
            });
            setCatalogRendered(true);
        }
    };

    const closeDataCatalog = () => {
        (dataCatalogRef as any).current?.collapse();
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
            {catalogRendered &&
                createPortal(
                    <div className='data-catalog-content'>
                        <LayerList
                            view={view}
                            onLayerListClosed={closeDataCatalog}
                        />
                        <BaseMapSelector view={view} />
                    </div>,
                    (dataCatalogRef as any).current.content as HTMLElement
                )}
        </>
    );
};
export default DataCatalog;
