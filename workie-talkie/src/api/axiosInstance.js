// src/api/axiosInstance.js
import axios from "axios";

// 🔥 환경에 따른 서버 주소 결정 함수
const getServerURL = () => {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    // 로컬 개발 환경
    return "http://localhost:8080";
  } else {
    // 운영 환경 - 실제 서버 IP
    return "https://3.36.66.1.site";
  }
};

const axiosInstance = axios.create({
  baseURL: getServerURL(), // 🔥 이 부분이 핵심 변경사항!
  withCredentials: true, // credentials: "include" 효과
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // 또는 sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
