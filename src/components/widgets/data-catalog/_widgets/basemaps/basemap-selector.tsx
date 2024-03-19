import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';
import Portal from '@arcgis/core/portal/Portal';
import BasemapGalleryVM from '@arcgis/core/widgets/BasemapGallery/BasemapGalleryViewModel';
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import BasemapItem from './_widgets/basemap-item';

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
    const [basemaps, setBasemaps] = useState<any[]>([]);
    const basemapGalleryVM = useRef(new BasemapGalleryVM()).current;

    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const fetchBasemaps = useCallback(async () => {
        const config = getConfig(ENV.DEV);
        const groupIdentifier =
            context === MODE.SCENE_VIEW
                ? config.portalInfo.basemapGroup3d
                : config.portalInfo.basemapGroup2d;

        const source = new PortalBasemapsSource({
            portal: new Portal({ url: config.portalInfo.url }),
            query: `(title:${groupIdentifier} OR id:${groupIdentifier})`,
            updateBasemapsCallback: (bmaps: any) => {
                const currentBasemap = view.map.basemap;
                const currentIndex = bmaps.findIndex((bmap: __esri.Basemap) =>
                    basemapGalleryVM.basemapEquals(currentBasemap, bmap)
                );
                if (!(currentIndex > -1) && currentBasemap) {
                    (currentBasemap as any).selected = true;
                    bmaps.push(currentBasemap);
                } else {
                    (bmaps[currentIndex] as any).selected = true;
                }
                return bmaps;
            }
        });
        (source as any).load();
        basemapGalleryVM.set('source', source);

        return reactiveUtils
            .whenOnce(() => source.basemaps.length > 0)
            .then(() =>
                Promise.all(
                    source.basemaps.toArray().map((basemap) => basemap.load())
                )
            )
            .then((basemaps) => setBasemaps(basemaps));
    }, [view]);

    useEffect(() => {
        if (view) {
            view.when(() => {
                basemapGalleryVM.set('view', view);
                fetchBasemaps();
            });
        }
    }, [view]);

    return (
        <div className='basemap-layer-list'>
            <div className='basemap-layer-list-heading'>{strings.title}</div>
            <BasemapItem
                context={context}
                item={basemaps.filter((bmap) => bmap.selected)[0]}
            />
        </div>
    );
};
export default BaseMapSelector;
