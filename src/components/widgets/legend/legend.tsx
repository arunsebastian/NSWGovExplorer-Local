import React, { useRef, useEffect } from 'react';
import ESRILegend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';

import strings from './strings';
import './legend.scss';

type LegendProps = {
    view: __esri.MapView | __esri.SceneView;
};

const Legend: React.FC<LegendProps> = ({ view }: LegendProps) => {
    const containerRef = useRef<HTMLDivElement>();
    const legendRendered = useRef<boolean>(false);

    const isLegendRendered = () => {
        return legendRendered.current;
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

    const renderLegend = () => {
        if (!isLegendRendered()) {
            const legendNode = document.createElement('div');
            legendNode.setAttribute('class', 'legend-container');
            const legend = new ESRILegend({
                view: view,
                container: legendNode,
                hideLayersNotInCurrentView: true
            });
            new Expand({
                expandIcon: 'legend',
                content: legend,
                label: strings.legend,
                expandTooltip: strings.legend,
                container: containerRef.current
            });
            legendRendered.current = true;
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
            purgeContainer();
            renderLegend();
            window.setTimeout(() => {
                applyCustomStyles();
            }, 1000);
        }
    }, [view, containerRef.current]);

    return <div className='legend-trigger' ref={containerRef}></div>;
};

export default Legend;
