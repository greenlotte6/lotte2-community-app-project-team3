// src/api/axios.js
import axios from "axios";

axios.defaults.withCredentials = true;

// ✅ 인터셉터로 Authorization 헤더도 자동 추가 (옵션)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // 또는 쿠키에서 가져와도 됨
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
