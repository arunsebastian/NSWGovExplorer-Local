import React, { useRef, useEffect, useState } from 'react';
import { default as View2D } from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';

import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Layer from '@arcgis/core/layers/Layer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import classNames from 'classnames';

import MapToolbar from '../../map-toolbar/map-toolbar';
import Navigation from '../../widgets/navigation/navigation';
import Legend from '../../widgets/legend/legend';
import DataCatalog from '../../widgets/data-catalog/data-catalog';

import { ENV, MODE } from '@src/utils/constants';

import { getConfig } from '@src/config/config';
import { parseURL } from '@src/utils/url';
import { isPortalItemId, isRestServiceUrl } from '@src/utils/map';
import { useAppContext } from '@src/contexts/app-context-provider';

import './map-view.scss';

const MapView: React.FC = () => {
    const viewRef = useRef();
    const { activeView, loading, setMapView } = useAppContext();
    const [view, setView] = useState<__esri.MapView>();

    const renderMap = async () => {
        console.log('Rendering map vue');
        const config = getConfig(ENV.AGOL).portalInfo;
        let layers = [];
        if (config) {
            const urlLayerParams: string = parseURL('layers');
            if (urlLayerParams?.length > 0) {
                const layerIdentifiers = urlLayerParams.split(',');
                layers = await Promise.all(
                    layerIdentifiers.map((item: string) => {
                        item = decodeURI(item);
                        if (isPortalItemId(item)) {
                            return Layer.fromPortalItem({
                                portalItem: {
                                    id: item
                                }
                            } as __esri.LayerFromPortalItemParams).catch(
                                () => null
                            );
                        } else if (isRestServiceUrl(item)) {
                            if (item.toLowerCase().includes('mapserver')) {
                                return new MapImageLayer({
                                    url: item
                                })
                                    .load()
                                    .catch(() => null);
                            } else if (
                                item.toLowerCase().includes('featureserver')
                            ) {
                                return new FeatureLayer({ url: item })
                                    .load()
                                    .catch(() => null);
                            }
                        }
                    })
                );
            }
            const map = new WebMap({
                portalItem: {
                    id: config.mapId,
                    portal: {
                        url: config.url
                    }
                }
            });
            map.addMany(layers.filter((layer) => layer));
            await map.loadAll();

            const view2d = new View2D({
                container: viewRef.current,
                map: map,
                ui: {
                    components: ['attribution']
                }
            }) as any;

            // The scale bar displays both metric and non-metric units.
            // not suppored in 3d scenes at this point
            const scaleBar = new ScaleBar({
                view: view,
                unit: 'dual'
            });

            // Add the widget to the bottom left corner of the view
            view2d.ui.add(scaleBar, {
                position: 'bottom-left'
            });

            setView(view2d);
            setMapView(view2d);
        }
    };

    useEffect(() => {
        if (!view) viewRef.current && renderMap();
    }, [viewRef.current]);

    return (
        <div
            className={classNames('map-view-container', {
                inactive: MODE.MAP_VIEW !== activeView,
                masked: loading
            })}
        >
            <div ref={viewRef} className='map-view'></div>
            <MapToolbar position='bottom'>
                <Navigation view={view}></Navigation>
            </MapToolbar>
            <MapToolbar position='right' stack='horizontal'>
                <DataCatalog view={view}></DataCatalog>
                <Legend view={view}></Legend>
            </MapToolbar>
        </div>
    );
};

export default MapView;
