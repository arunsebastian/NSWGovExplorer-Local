import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/app';
import { AppContextProvider } from './contexts/app-context-provider';
import { isMobileOrTablet } from './utils/device';
import { defineCustomElements } from '@esri/calcite-components/dist/loader';

(async () => {
    await defineCustomElements(window);
    // Application to Render
    const app = (
        <AppContextProvider>
            <App />
        </AppContextProvider>
    );
    const target = document.getElementById('app');

    if (isMobileOrTablet()) {
        target.classList.add('app-mobile');
    }
    // Render application in DOM
    createRoot(target).render(app);
})();
