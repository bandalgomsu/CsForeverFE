// src/api.ts 또는 src/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // 필요 시 수정
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터로 Authorization 헤더 자동 설정
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            //@ts-ignore
            if (!window.ReactNativeWebView) {
                alert("로그인이 필요합니다.")
            }

            //@ts-ignore
            if (window.ReactNativeWebView?.postMessage) {
                //@ts-ignore
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'login-required'}));
            }
            
            console.log(error)
            localStorage.removeItem("token");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
