// Suppress react-router-bootstrap defaultProps warning
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('defaultProps will be removed')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);