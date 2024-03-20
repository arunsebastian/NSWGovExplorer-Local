import React, { useRef, useEffect } from 'react';
import { MODE, ENV } from '@src/utils/constants';
import { CalciteCard } from '@esri/calcite-components-react';

import styles from './dynamic-styles';
import './basemap-item.scss';

type BasemapItemProps = { context?: string; item: __esri.Basemap };

const BasemapItem: React.FC<BasemapItemProps> = ({
    context = MODE.MAP_VIEW,
    item
}: BasemapItemProps) => {
    const basemapItemRef = useRef<HTMLCalciteCardElement>();

    const applyCustomStyles = () => {
        const node = basemapItemRef.current;
        const shadowRoot = node.shadowRoot;
        if (shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(styles.basemapCard);
            console.log('styles.basemapCard', styles.basemapCard);
            const elemStyleSheets = node.shadowRoot.adoptedStyleSheets;
            // Append the style to the existing style sheet.
            shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet];
        }
    };

    useEffect(() => {
        item && applyCustomStyles();
    }, [item, basemapItemRef.current]);

    return (
        item && (
            <CalciteCard
                className='basemap-item'
                thumbnail-position='inline-start'
                title={item.title}
                selected={true}
                ref={basemapItemRef}
            >
                <img
                    slot='thumbnail'
                    src={item.thumbnailUrl}
                    alt={item.title}
                />
                <span slot='title' className='basemap-item-title'>
                    {item.title}
                </span>
                {/* <span className='basemap-item-sub-title'>
                {item && item.portalItem && item.portalItem.description}
            </span> */}
            </CalciteCard>
        )
    );
};
export default BasemapItem;

{
    /*  */
}
