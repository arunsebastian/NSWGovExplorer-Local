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
    const { activeView, mapView, sceneView, setLoading } = useAppContext();
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
        if (activeView === context) setLoading(true);
        layerListVM.set('view', view);
        view.when(() => {
            if (!islayerListRendered()) {
                const layerList = new ESRILayerList({
                    viewModel: layerListVM,
                    listItemCreatedFunction: (event: any) => {
                        //defineLayerItemActions(event, layerList);
                    },
                    dragEnabled: true,
                    collapsed: false,
                    container: containerRef.current
                });
                layerList.when(() => {
                    layerList.set('label', strings.title);
                    if (activeView === context) setLoading(false);
                });
                layerList.on('trigger-action', handleTriggerAction);
                layerListRendered.current = true;
            }
        });
    };

    const defineLayerItemActions = (
        event: any,
        layerList: __esri.LayerList
    ) => {
        const item = event.item;
        const type = item.layer?.type;
        const actionsSections = [] as any;

        //################### Zoom To Layer Full Extent   ####################//
        /*
                            ----Temporarily disabling----

        const layerZoomTo =
            ['feature', 'map-notes', 'map-image', 'tile'].indexOf(type) > -1;

        layerZoomTo &&
            actionsSections.push([
                {
                    title: strings.zoomToExtent,
                    icon: 'extent',
                    id: ACTION.ZOOM_EXTENT
                }
            ]);
        */

        //####################  Adjust Opacity Action ###############################//

        const layerOpacitySlider =
            ['feature', 'map-notes', 'map-image', 'tile', 'group'].indexOf(
                type
            ) > -1;

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

            if (actionsSections.length > 0) {
                // this is so that the opacity control falls in the menu
                actionsSections.push([
                    {
                        title: strings.adjustOpacity,
                        icon: 'sliders-horizontal',
                        id: ACTION.OPACITY
                    }
                ]);
            }
            item.panel = {
                content: slider,
                title: strings.adjustOpacity,
                icon: 'sliders-horizontal',
                id: ACTION.OPACITY,
                visible:
                    actionsSections.findIndex(
                        (section: any) =>
                            section.findIndex(
                                (sec: any) => sec.id === ACTION.OPACITY
                            ) > -1
                    ) === -1
            };
        }

        //##################### Remove Layer Action#####################################//

        //
        const layerRemove =
            ['group', 'feature', 'map-notes', 'tile', 'map-image'].indexOf(
                type
            ) > -1;

        if (layerRemove) {
            layerList.when(() => {
                deferredRenderActionLayerRemove(item, layerList);
            });
        }

        //####################################################################//

        item.actionsSections = actionsSections;
    };

    const handleTriggerAction = (event: __esri.LayerListTriggerActionEvent) => {
        const { action, item } = event;
        if (action.id === ACTION.OPACITY) {
            const currentState = item.panel.open;
            item.panel.open = !currentState;
            item.panel.visible = !currentState;
        } else if (action.id === ACTION.ZOOM_EXTENT) {
            //console.log(item);
        }
    };

    const deferredRenderActionLayerRemove = (
        item: any,
        layerList: __esri.LayerList
    ) => {
        const node = (layerList.container as HTMLElement).querySelector(
            `calcite-list-item[title='${item.title}']`
        );

        let removeLayerAction = node.querySelector(
            `calcite-action[id='${item.layer.id}']`
        ) as HTMLCalciteActionElement;

        if (!removeLayerAction) {
            removeLayerAction = document.createElement('calcite-action');
            removeLayerAction.icon = 'x';
            removeLayerAction.slot = 'actions-end';
            removeLayerAction.appearance = 'transparent';
            removeLayerAction.scale = 's';
            removeLayerAction.id = `${item.layer.id}`;
            removeLayerAction.title = strings.removeLayer;
            removeLayerAction.addEventListener('click', () => {
                node.removeChild(removeLayerAction);
                const removableLayer = view.map.layers.find(
                    (layer) => layer.id === item.layer.id
                );
                if (removableLayer) {
                    view.map.remove(removableLayer);
                } else {
                    item.layer.parent.remove(item.layer);
                }
            });
            node.insertBefore(
                removeLayerAction,
                (node.lastChild as HTMLElement).tagName.toLowerCase() ===
                    'calcite-action-menu'
                    ? node.lastChild
                    : node.lastChild.nextSibling
            );
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
