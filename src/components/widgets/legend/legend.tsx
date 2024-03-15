import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';
import { MODE } from '@src/utils/constants';

import strings from './strings';
import styles from './dynamic-styles';
import './legend.scss';

import { CalciteButton } from '@esri/calcite-components-react';

type LegendProps = {
    context?: string;
};

const Legend: React.FC<LegendProps> = ({
    context = MODE.MAP_VIEW
}: LegendProps) => {
    const { mapView, sceneView } = useAppContext();
    const legendRef = useRef<HTMLCalciteButtonElement>();
    const view = context === MODE.SCENE_VIEW ? sceneView : mapView;

    const applyCustomStyles = () => {
        const node = legendRef.current;
        const shadowRoot = node.shadowRoot;
        if (shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(styles.contentButton);
            const elemStyleSheets = node.shadowRoot.adoptedStyleSheets;
            // Append your style to the existing style sheet.
            shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet];
        }
    };

    useEffect(() => {
        view && legendRef.current
            ? (legendRef.current.removeAttribute('disabled'),
              applyCustomStyles())
            : legendRef.current.setAttribute('disabled', 'true');
    }, [view]);

    return (
        <CalciteButton
            id={`legend-trigger-${context}`}
            title={strings.legend}
            label={strings.legend}
            ref={legendRef}
            kind='neutral'
            className='legend-trigger'
            onClick={() => {}}
        >
            {strings.legend}
        </CalciteButton>
    );
};

export default Legend;
