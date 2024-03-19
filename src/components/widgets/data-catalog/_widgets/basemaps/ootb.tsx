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

    useEffect(() => {
        if (view && containerRef.current) {
            purgeContainer();
            renderBasemapGallery();
        }
    }, [view, containerRef.current]);

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

        const basemapGallery = new BasemapGallery({
            view: view,
            source: new PortalBasemapsSource({
                portal: new Portal({ url: config.portalInfo.url }),
                query: `(title:${groupIdentifier} OR id:${groupIdentifier})`
            }) as __esri.PortalBasemapsSourceProperties
        });

        const expandWidget = new Expand({
            expandIcon: 'basemap',
            content: basemapGallery,
            container: document.createElement('div')
        });
        containerRef.current.appendChild(expandWidget.container as HTMLElement);
    };

    return <div ref={containerRef} className='selected-basemap'></div>;
};

export default BaseMapSelector;
