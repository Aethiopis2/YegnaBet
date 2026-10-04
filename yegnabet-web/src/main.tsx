import { createRoot } from 'react-dom/client'
import './index.css'

import App from './app/App.tsx'
import Providers from './app/Providers.tsx'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import { AuthProvider } from './types/auth/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Providers>
          <App />
        </Providers>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);