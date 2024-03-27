import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';

import { MODE } from '@src/utils/constants';
import ESRILegend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';

import strings from './strings';
import './legend.scss';

type LegendProps = {
    context?: string;
};

const Legend: React.FC<LegendProps> = ({
    context = MODE.MAP_VIEW
}: LegendProps) => {
    const { mapView, sceneView } = useAppContext();
    const containerRef = useRef<HTMLDivElement>();
    const legendRef = useRef<__esri.Legend>();
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const renderLegend = () => {
        if (!legendRef.current) {
            const legendNode = document.createElement('div');
            legendNode.setAttribute('class', 'legend-container');
            legendRef.current = new ESRILegend({
                view: view,
                container: legendNode,
                hideLayersNotInCurrentView: true
            });
            new Expand({
                expandIcon: 'legend',
                content: legendRef.current,
                label: strings.legend,
                expandTooltip: strings.legend,
                container: containerRef.current
            });
        }
    };

    const applyCustomStyles = () => {
        const node = containerRef.current;
        const button = node.querySelector(`calcite-button`);
        if (button) {
            let textEl = button.querySelector(`:scope > span`) as HTMLElement;
            if (!textEl) {
                textEl = document.createElement('span');
                textEl.className = 'legent-text';
                button.appendChild(textEl);
            }
            textEl.innerText = strings.legend;
        }
    };

    useEffect(() => {
        if (view) {
            renderLegend();
            window.setTimeout(() => {
                applyCustomStyles();
            }, 1000);
        }
    }, [view, containerRef.current]);

    return <div className='legend-trigger' ref={containerRef}></div>;
};

export default Legend;
