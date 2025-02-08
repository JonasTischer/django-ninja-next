import { User } from '@/types/user';
import apiClient from './client';
import { setAccessToken, clearAccessToken } from './token';

export const authApi = {
  retrieveUser: () => apiClient.get<User>('/auth/me'),

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    setAccessToken(response.data.access);
    return response;
  },

  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    re_password: string;
  }) => apiClient.post('/auth/register', userData),

  // verify: () => apiClient.post('/token/verify'),

  refreshToken: () => apiClient.post('/auth/refresh'),

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    clearAccessToken();
    return response;
  },

  activation: (uid: string, token: string) =>
    apiClient.post('/users/activation/', { uid, token }),

  resetPassword: (email: string) =>
    apiClient.post('/users/reset_password/', { email }),

  resetPasswordConfirm: (data: {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
  }) => apiClient.post('/users/reset_password_confirm/', data),
};
