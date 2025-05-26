const isDevelopment = import.meta.env.MODE === 'development';

export const API_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://book-project-backend.onrender.com';

export const SOCKET_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://book-project-backend.onrender.com';

export const API_TIMEOUT = 10000; // 10 seconds

export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
};

export const UPLOADS_URL = 'https://book-project-backend.onrender.com/uploads'; 