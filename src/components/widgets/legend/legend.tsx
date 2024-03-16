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

    const renderLegend = () => {
        const legend = new ESRILegend({
            view: view,
            container: document.createElement('div'),
            hideLayersNotInCurrentView: true
        });

        const expandWidget = new Expand({
            expandIcon: 'legend',
            content: legend,
            container: document.createElement('div'),
            label: strings.legend,
            expandTooltip: strings.legend
        });

        containerRef.current.appendChild(expandWidget.container as HTMLElement);
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
            purgeContainer();
            renderLegend();
            window.setTimeout(() => {
                applyCustomStyles();
            }, 1000);
            applyCustomStyles();
        }
    }, [view, containerRef.current]);

    return <div className='legend-content' ref={containerRef}></div>;
};

export default Legend;
