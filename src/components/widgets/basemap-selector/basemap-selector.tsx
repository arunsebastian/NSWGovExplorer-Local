import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Portal from '@arcgis/core/portal/Portal';
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource';

import { MODE, ENV } from '@src/utils/constants';
import { getConfig } from '@src/config/config';

import strings from './strings';
import './basemap-selector.scss';

// import { CalcitePanel, CalciteBlock } from '@esri/calcite-components-react';

type BasemapSelectorProps = { context?: string };

const BaseMapSelector: React.FC<BasemapSelectorProps> = ({
    context = MODE.MAP_VIEW
}: BasemapSelectorProps) => {
    const { mapView, sceneView } = useAppContext();
    const containerRef = useRef<HTMLDivElement>();
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const purgeContainer = () => {
        const children: Array<HTMLElement> = Array.prototype.slice.call(
            containerRef.current.childNodes
        );
        children.forEach((child: HTMLElement) => {
            containerRef.current.removeChild(child);
        });
        containerRef.current.innerHTML = '';
    };

    const renderBasemapGallery = () => {
        const config = getConfig(ENV.DEV);
        const groupIdentifier =
            context === MODE.SCENE_VIEW
                ? config.portalInfo.basemapGroup3d
                : config.portalInfo.basemapGroup2d;

        // I AM HERE:: Investigate why portal search is not happening
        const basemapGallery = new BasemapGallery({
            view: view,
            source: {
                portal: { url: config.portalInfo.url },
                query: `(title:'${groupIdentifier}' OR id:'${groupIdentifier})' AND type:web map`
            } as __esri.PortalBasemapsSourceProperties
        });

        const expandWidget = new Expand({
            expandIcon: 'basemap',
            content: basemapGallery,
            container: document.createElement('div')
        });
        containerRef.current.appendChild(expandWidget.container as HTMLElement);
    };

    useEffect(() => {
        //view &&
        if (view) {
            purgeContainer();
            renderBasemapGallery();
        }
    }, [view, containerRef.current]);

    return <div ref={containerRef} className='basemap-gallery'></div>;
};

export default BaseMapSelector;

// const basemapGallery = new BasemapGallery({
//     view: view,
//     source: new Portal({ url: 'https://www.yourportal.arcgis.com' }) // autocasts to PortalBasemapsSource
// });
