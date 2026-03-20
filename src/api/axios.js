import axios from 'axios';

const API_URL = 'https://localhost:7126/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original);
      } catch (err) {
        localStorage.clear();
        // ✅ Only redirect to login if on admin page
        const path = window.location.pathname;
        if (path.startsWith('/admin')) {
          window.location.href = '/login';
        }
        // Customer pages stay on home
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;