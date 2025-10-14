// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ContactProvider } from './components/ContactContext';
import GlobalContactForm from './components/GlobalContactForm';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContactProvider>
      <App />
      <GlobalContactForm />
    </ContactProvider>
  </StrictMode>
);