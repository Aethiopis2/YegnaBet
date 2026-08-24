import { createRoot } from 'react-dom/client'
import './index.css'

import App from './app/App.tsx'
import Providers from './app/Providers.tsx'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);