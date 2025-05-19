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
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { API_URL } from './config/config';
import App from './App.jsx';
import './App.css';

// Set default base URL for axios
axios.defaults.baseURL = API_URL;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);