import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';

import { MODE } from '@src/utils/constants';
import ESRILayerList from '@arcgis/core/widgets/LayerList';
import LayerListVM from '@arcgis/core/widgets/LayerList/LayerListViewModel';
import Slider from '@arcgis/core/widgets/Slider';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { CalciteLabel, CalciteButton } from '@esri/calcite-components-react';

import strings from './strings';
import './layer-list.scss';

type LayerListProps = {
    context?: string;
    onLayerListClosed?: () => void;
};

enum ACTION {
    OPACITY = 'adjust-opacity',
    ZOOM_EXTENT = 'zoom-to',
    REMOVE_LAYER = 'remove-layer'
}

const LayerList: React.FC<LayerListProps> = ({
    context = MODE.MAP_VIEW,
    onLayerListClosed
}: LayerListProps) => {
    const { mapView, sceneView, setLoading } = useAppContext();
    const layerListVM = useRef<LayerListVM>(new LayerListVM()).current;
    const containerRef = useRef<HTMLDivElement>();
    const layerListRendered = useRef<boolean>(false);
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const islayerListRendered = () => {
        return layerListRendered.current;
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

    const renderLayerList = () => {
        setLoading(true);
        layerListVM.set('view', view);
        view.when(() => {
            if (!islayerListRendered()) {
                const layerList = new ESRILayerList({
                    viewModel: layerListVM,
                    listItemCreatedFunction: defineLayerItemActions,
                    dragEnabled: true,
                    collapsed: false,
                    container: containerRef.current
                });
                layerList.when(() => {
                    layerListRendered.current = true;
                    layerList.set('label', strings.title);
                    setLoading(false);
                });
                layerList.on('trigger-action', handleTriggerAction);
                layerListRendered.current = true;
            }
        });
    };

    const defineLayerItemActions = (event: any) => {
        const item = event.item;
        const type = item.layer?.type;
        const actionsSections = [] as any;

        //remove action
        const layerRemove =
            ['group', 'feature', 'map-notes', 'tile', 'map-image'].indexOf(
                type
            ) > -1;

        // zoom to
        const layerZoomTo =
            ['feature', 'map-notes', 'map-image', 'tile'].indexOf(type) > -1;

        //opacity slider
        const layerOpacitySlider =
            ['feature', 'map-notes', 'map-image', 'tile', 'group'].indexOf(
                type
            ) > -1;

        layerRemove &&
            actionsSections.push([
                {
                    title: strings.removeLayer,
                    icon: 'x',
                    id: ACTION.REMOVE_LAYER,
                    type: 'button'
                }
            ]);
        layerZoomTo &&
            actionsSections.push([
                {
                    title: strings.zoomToExtent,
                    icon: 'extent',
                    id: ACTION.ZOOM_EXTENT
                }
            ]);

        if (layerRemove) {
            // I AM HERE
        }

        if (layerOpacitySlider) {
            const slider = new Slider({
                min: 0,
                max: 1,
                steps: 0.05,
                values: [item.layer.opacity],
                snapOnClickEnabled: true,
                visibleElements: { labels: true, rangeLabels: true }
            });
            // Watch the slider's values array and update the layer's opacity
            reactiveUtils.watch(
                () => slider.values.map((value) => value),
                (values) => (item.layer.opacity = values[0])
            );

            item.panel = {
                content: slider,
                title: strings.adjustOpacity
            };
            actionsSections.push([
                {
                    title: strings.adjustOpacity,
                    icon: 'sliders-horizontal',
                    id: ACTION.OPACITY
                }
            ]);
        }
        item.actionsSections = actionsSections;
    };

    const handleTriggerAction = (event: __esri.LayerListTriggerActionEvent) => {
        const { action, item } = event;
        if (action.id === ACTION.OPACITY) {
            // item.open = !item.open;
            item.panel.open = !item.panel.open;
        }
    };

    useEffect(() => {
        if (view) {
            purgeContainer();
            renderLayerList();
        }
    }, [view, containerRef.current]);

    return (
        <div className='data-layer-list'>
            <div className='data-layer-list-heading'>
                <CalciteLabel>{strings.title}</CalciteLabel>
                <CalciteButton
                    iconStart='x'
                    label={strings.close}
                    title={strings.close}
                    kind='neutral'
                    appearance='outline'
                    scale='s'
                    onClick={() => onLayerListClosed && onLayerListClosed()}
                ></CalciteButton>
            </div>
            <div className='data-layer-list-content' ref={containerRef}></div>
        </div>
    );
};
export default LayerList;
