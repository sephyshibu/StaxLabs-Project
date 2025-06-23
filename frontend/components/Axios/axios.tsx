// axios/axiosInstance.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store, persistor } from '../app/store';
import { setCredentials, clearCredentials } from '../features/AuthSlice';
import { toast } from 'react-toastify';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const { token, role, id } = store.getState().auth;

    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    if (role) config.headers['x-user-role'] = role;
    if (id) config.headers['x-user-id'] = id;

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = response.data;

        store.dispatch(
          setCredentials({
            token: accessToken,
            role: user.role,
            id: user.id,
          })
        );

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired. Please login again.');
        await persistor.purge();
        localStorage.removeItem('userId');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      const data = error.response.data as { message?: string; action?: string };
      if (data?.action === 'blocked') {
        toast.error(data.message || 'You are blocked by admin!');
        localStorage.removeItem('userId');
        await persistor.purge();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
