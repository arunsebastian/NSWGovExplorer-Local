import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/app';

// Say something
console.log('[ERWT] : Renderer execution started');

// Application to Render
const app = <App />;

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
