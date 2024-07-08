import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = (credentials) => api.post('/users/token/', credentials);
export const logout = (credentials) => api.post('/users/logout/', credentials);
export const register = (userData) => api.post('/users/register/', userData);
export const getVideos = () => api.get('/videos/');
export const uploadVideo = (videoData) => api.post('/videos/', videoData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const getVideoById = (id) => api.get(`/videos/${id}/`);

export default api;
