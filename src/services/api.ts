import axios from "axios";

// Gunakan environment variable untuk API URL
// Untuk Vite, environment variable harus dimulai dengan VITE_
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5151/api";

console.log("[api] Using API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("[api] Request:", config.method?.toUpperCase(), config.url);
  return config;
});

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log("[api] Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("[api] Error:", error.message, error.config?.url);
    return Promise.reject(error);
  },
);

export default api;
