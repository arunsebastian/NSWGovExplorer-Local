import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';

import { MODE } from '@src/utils/constants';
import ESRILayerList from '@arcgis/core/widgets/LayerList';
import Expand from '@arcgis/core/widgets/Expand';
import LayerListVM from '@arcgis/core/widgets/LayerList/LayerListViewModel';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

import strings from './strings';
import './layer-list.scss';

// import {

// } from '@esri/calcite-components-react';

type LayerListProps = {
    context?: string;
};

const LayerList: React.FC<LayerListProps> = ({
    context = MODE.MAP_VIEW
}: LayerListProps) => {
    const { mapView, sceneView } = useAppContext();
    const layerListVM = useRef<LayerListVM>(new LayerListVM()).current;
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

    const renderLayerList = () => {
        layerListVM.set('view', view);
        const layerList = new ESRILayerList({
            viewModel: layerListVM,
            visibleElements: {
                closeButton: true,
                collapseButton: false,
                errors: true,
                // filter: false,
                heading: true,
                statusIndicators: true
            },
            //listItemCreatedFunction: defineActions,
            dragEnabled: true,
            collapsed: false,
            container: document.createElement('div')
        });

        reactiveUtils
            .whenOnce(() => (layerList as any).messages)
            .then(() => {
                (layerList as any).messages
                    ? ((layerList as any).messages.widgetLabel = strings.title)
                    : null;
                layerList.set('label', strings.title);
            });
        reactiveUtils.watch(
            () => layerList.visible,
            (visible) => {
                if (!visible) {
                    expandWidget.collapse();
                    window.setTimeout(() => {
                        layerList.visible = true;
                    }, 100);
                }
            }
        );

        const expandWidget = new Expand({
            expandIcon: 'layers',
            collapseIcon: 'layers',
            expandTooltip: strings.title,
            content: layerList,
            container: document.createElement('div')
        });
        reactiveUtils.watch(
            () => expandWidget.expanded,
            (expanded) => {
                if (expanded) {
                    layerList.visible = true;
                }
            }
        );
        containerRef.current.appendChild(expandWidget.container as HTMLElement);
    };

    useEffect(() => {
        //view &&
        if (view) {
            purgeContainer();
            renderLayerList();
        }
    }, [view, containerRef.current]);

    return (
        <div className='layer-list-content'>
            <div ref={containerRef} className='layer-list-content-item'></div>
            <div className='layer-list-content-item'></div>
        </div>
    );
};

export default LayerList;
