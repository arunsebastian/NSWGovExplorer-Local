import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@src/contexts/app-context-provider';
import search from '@assets/images/zoom-in.svg';

import strings from './strings';
import styles from './dynamic-styles';
import './search.scss';

import { CalciteAction, CalciteInput } from '@esri/calcite-components-react';

const Search: React.FC = () => {
    const { mapView, sceneView } = useAppContext();
    const searchRef = useRef<HTMLCalciteActionElement>();

    const handleSearchClicked = () => {};

    const applyCustomStyles = () => {
        const node = searchRef.current;
        const shadowRoot = node.shadowRoot;
        if (shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(styles.searchButton);
            const elemStyleSheets = node.shadowRoot.adoptedStyleSheets;
            // Append your style to the existing style sheet.
            shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet];
        }
    };

    useEffect(() => {
        if (mapView && searchRef.current) {
            //searchRef.current.removeAttribute('disabled');
            applyCustomStyles();
        }
    }, [(mapView || sceneView) && searchRef.current]);

    return (
        // I AM HERE::::::
        // <Calcite>
        // </>
        <CalciteAction
            // disabled
            ref={searchRef}
            className='search-trigger'
            scale='s'
            title={strings.search}
            label={strings.search}
            text={strings.search}
            onClick={handleSearchClicked}
        >
            <img src={search}></img>
        </CalciteAction>
    );
};

export default Search;
