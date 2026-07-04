import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename="/admin">
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#1B1B1B',
              color: '#fff',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#2A8C75', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
