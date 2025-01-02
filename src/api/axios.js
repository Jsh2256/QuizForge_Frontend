import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000  // 타임아웃 30초로 증가
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 응답 인터셉터
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(new Error('서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'));
  }
);

export default api;