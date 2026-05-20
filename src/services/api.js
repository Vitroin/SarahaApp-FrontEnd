import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    // Only redirect to login if the user is already logged in
    // and an authenticated request fails with 401.
    // Do NOT redirect when login itself fails.
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyAccount: (data) => api.post('/auth/verify', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  logout: () => api.post('/auth/logout'),
};

// ── User Endpoints ──
export const userAPI = {
  getMe: () => api.get('/user/me'),
  uploadProfileCloud: (formData) =>
    api.post('/user/upload-profile-cloud', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;