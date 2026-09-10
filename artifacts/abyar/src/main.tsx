import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from './lib/clerk';
import { App } from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <AppProvider>
        <App />
      </AppProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
