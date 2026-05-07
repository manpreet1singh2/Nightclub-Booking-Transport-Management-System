import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(13,13,43,0.95)',
            color: '#fff',
            border: '1px solid rgba(168,85,247,0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ff2d78', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
