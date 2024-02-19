import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/app';
import { isMobile } from './utils/device';
import { defineCustomElements } from '@esri/calcite-components/dist/loader';

(async () => {
    await defineCustomElements(window);
    // Application to Render
    const app = <App />;
    const target = document.getElementById('app');

    if (isMobile()) {
        target.classList.add('app-mobile');
    }
    // Render application in DOM
    createRoot(target).render(app);
})();
