import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalUrl = error.config.url;

        if (originalUrl.includes("login/")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            localStorage.setItem('session_expired', 'true');
        }

        return Promise.reject(error);
    }
);


export default api;