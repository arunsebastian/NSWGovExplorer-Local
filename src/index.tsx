import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/app';
import { isMobile } from './utils/device';

// Say something
console.log('[Explorer] : Renderer execution started');

// Application to Render
const app = <App />;
const target = document.getElementById('app');

if (isMobile()) {
    target.classList.add('app-mobile');
}
// Render application in DOM
createRoot(target).render(app);
