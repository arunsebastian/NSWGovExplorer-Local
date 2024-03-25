import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '@src/contexts/app-context-provider';
import Portal from '@arcgis/core/portal/Portal';
import BasemapGalleryVM from '@arcgis/core/widgets/BasemapGallery/BasemapGalleryViewModel';
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { CalcitePopover } from '@esri/calcite-components-react';

import BasemapItem from './_widgets/basemap-item/basemap-item';
import BasemapList from './_widgets/basemap-list/basemap-list';

import { MODE, ENV } from '@src/utils/constants';
import { getConfig } from '@src/config/config';

import strings from './strings';
import './basemap-selector.scss';

type BasemapSelectorProps = { context?: string };

const BaseMapSelector: React.FC<BasemapSelectorProps> = ({
    context = MODE.MAP_VIEW
}: BasemapSelectorProps) => {
    const { mapView, sceneView } = useAppContext();
    const [basemaps, setBasemaps] = useState<any[]>([]);
    const basemapGalleryVM = useRef(new BasemapGalleryVM()).current;

    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const fetchBasemaps = useCallback(async () => {
        const config = getConfig(ENV.AGOL);
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

                if (currentIndex === -1 && currentBasemap) {
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

    const handleBasemapChangeRequested = (bmap: __esri.Basemap) => {
        if (!(bmap as any).selected) {
            const currentBmap = basemaps.find((bmap) => bmap.selected);
            currentBmap.selected = false;
            (bmap as any).selected = true;
            setBasemaps([...basemaps]);
        }
        view.map.set('basemap', bmap);
    };

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
            {basemapGalleryVM.view &&
                createPortal(
                    <CalcitePopover
                        label={strings.title}
                        open={false}
                        autoClose={false}
                        focusTrapDisabled={true}
                        triggerDisabled={false}
                        placement='right'
                        referenceElement={`selected-basemap-${context}`}
                    >
                        <BasemapList
                            context={context}
                            items={basemaps}
                            onBasemapChangeRequested={
                                handleBasemapChangeRequested
                            }
                        />
                    </CalcitePopover>,
                    basemapGalleryVM.view.container
                )}

            <div className='basemap-layer-list-heading'>{strings.title}</div>
            <div
                id={`selected-basemap-${context}`}
                className='selected-basemap'
            >
                <BasemapItem
                    context={context}
                    item={basemaps.filter((bmap) => bmap.selected)[0]}
                />
            </div>
        </div>
    );
};
export default BaseMapSelector;
