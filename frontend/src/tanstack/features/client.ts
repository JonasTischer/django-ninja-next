import axios, { AxiosError } from 'axios';
import { Mutex } from 'async-mutex';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError;
  }
}

const mutex = new Mutex();

// Access token functions now use sessionStorage
export const setAccessToken = (token: string) => {
  sessionStorage.setItem('accessToken', token);
};

export const clearAccessToken = () => {
  sessionStorage.removeItem('accessToken');
};

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure cookies (including the refresh token cookie) are included
  withCredentials: true,
});

// Request interceptor to attach the access token from sessionStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          // The refresh call no longer sends the token in the body.
          // The browser will include the HttpOnly refresh token cookie.
          const refreshResponse = await apiClient.post(
            '/token/refresh'
          );
          const newAccessToken = refreshResponse.data.access;
          setAccessToken(newAccessToken);
          // Retry the original request with the new access token
          return apiClient(originalRequest);
        } catch (refreshError) {
          clearAccessToken();
          // Optionally redirect to login on refresh failure
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
