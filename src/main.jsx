import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/css/main.css';
import App from './routes/AppRoutes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
