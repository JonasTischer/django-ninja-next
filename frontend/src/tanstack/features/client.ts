import axios from 'axios';
import { Mutex } from 'async-mutex';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from './token';

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensures cookies are sent (for the refresh token)
});

// Request interceptor: attach the access token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    console.log('adding token', token);
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create a mutex instance to avoid multiple simultaneous refresh calls
const mutex = new Mutex();

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('original request', originalRequest);
    // Skip interceptor logic if this request is for refreshing.
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }
    // Check if the error is a 401 response and that we haven't retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('retrying request');
      try {
        // Acquire the mutex so we only refresh once if multiple requests fail
        await mutex.acquire();
        console.log('acquired mutex');
        try {
          console.log('refreshing token');
          const refreshResponse = await apiClient.post(
            '/auth/refresh'
          );
          // Save the new access token
          setAccessToken(refreshResponse.data.access);
          mutex.release();
          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          mutex.release();
          clearAccessToken();
          // Optionally redirect to login if refresh fails
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } catch (mutexError) {
        return Promise.reject(mutexError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
