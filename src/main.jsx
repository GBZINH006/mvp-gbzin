// index.js (ou main.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext'; // Importe o provedor aqui

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider> {/* Envolvemos o App inteiro */}
      <App />
    </CartProvider>
  </React.StrictMode>
);
