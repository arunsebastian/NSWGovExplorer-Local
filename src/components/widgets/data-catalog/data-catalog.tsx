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
    context?: string;
};

const DataCatalog: React.FC<DataCatalogProps> = ({
    context = MODE.MAP_VIEW
}: DataCatalogProps) => {
    const { mapView, sceneView } = useAppContext();
    const containerRef = useRef<HTMLDivElement>();
    const dataCatalogRef = useRef<__esri.Expand>();
    const [catalogRendered, setCatalogRendered] = useState<boolean>(false);
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const renderDataCatalog = () => {
        if (!(dataCatalogRef as any).current) {
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
                            context={context}
                            onLayerListClosed={closeDataCatalog}
                        />
                        <BaseMapSelector context={context} />
                    </div>,
                    (dataCatalogRef as any).current.content as HTMLElement
                )}
        </>
    );
};
export default DataCatalog;
