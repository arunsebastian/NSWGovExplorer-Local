import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';

import { MODE } from '@src/utils/constants';
import ESRILayerList from '@arcgis/core/widgets/LayerList';
import LayerListVM from '@arcgis/core/widgets/LayerList/LayerListViewModel';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { CalciteLabel, CalciteButton } from '@esri/calcite-components-react';

import strings from './strings';
import './layer-list.scss';

type LayerListProps = {
    context?: string;
    onLayerListClosed?: () => void;
};

const LayerList: React.FC<LayerListProps> = ({
    context = MODE.MAP_VIEW,
    onLayerListClosed
}: LayerListProps) => {
    const { mapView, sceneView } = useAppContext();
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
        if (!islayerListRendered()) {
            layerListVM.set('view', view);
            const layerList = new ESRILayerList({
                viewModel: layerListVM,
                visibleElements: {
                    closeButton: false,
                    collapseButton: false,
                    errors: true,
                    // filter: false,
                    heading: false,
                    statusIndicators: true
                },
                //listItemCreatedFunction: defineActions,
                dragEnabled: true,
                collapsed: false,
                container: containerRef.current
            });
            reactiveUtils
                .whenOnce(() => (layerList as any).messages)
                .then(() => {
                    (layerList as any).messages
                        ? ((layerList as any).messages.widgetLabel =
                              strings.title)
                        : null;
                    layerList.set('label', strings.title);
                });
            layerListRendered.current = true;
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
