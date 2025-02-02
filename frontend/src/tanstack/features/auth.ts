import { User } from '@/types/user';
import apiClient from './client';

export const authApi = {
  retrieveUser: () => apiClient.get<User>('/auth/me'),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    re_password: string;
  }) => apiClient.post('/auth/register', userData),

  verify: () => apiClient.post('/jwt/verify/'),

  refreshToken: () => apiClient.post('/auth/refresh'),

  logout: () => apiClient.post('/auth/logout'),

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
