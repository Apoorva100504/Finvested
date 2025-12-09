// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // change if your backend uses different port
  withCredentials: false,
});

// Attach JWT token from localStorage on every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
