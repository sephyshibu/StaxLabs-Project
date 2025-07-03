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
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }

//  Request Interceptor
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

//  Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("Axios response error interceptor triggered:", error?.response?.status);
    
    const originalRequest = error.config as CustomAxiosRequestConfig;

     if (error.response) {
      // const status = error.response.status;
      const message = (error.response.data as any)?.message;

      if (message === 'User is blocked or invalid') {
        toast.error(message); // ✅ show toast in frontend
        store.dispatch(clearCredentials());
        await persistor.purge();
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 error detected:', error.response); // ← MUST REACH HERE
      originalRequest._retry = true;

      try {
        console.log('Triggering token refresh...');
        const res = await axiosInstance.post<{ accessToken: string; user: { id: string; role: 'admin' | 'vendor' | 'customer' } }>(
          'http://localhost:3000/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = res.data;

        store.dispatch(setCredentials({
          token: accessToken,
          role: user.role,
          id: user.id,
        }));

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired. Please login again.');
        store.dispatch(clearCredentials());
        await persistor.purge();
        localStorage.removeItem('userId');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
     if (message) toast.error(message);
    }


    // Fallback: 403, 500 etc.
    console.log("Non-401 error handled:", error?.response?.status);

    return Promise.reject(error);
  }
);


export default axiosInstance;
