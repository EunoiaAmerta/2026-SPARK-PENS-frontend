import axios from "axios";

// Selalu gunakan URL Render untuk kedua environment (lokal & Vercel)
// Karena backend sudah di-deploy di Render
const API_BASE_URL = "https://spark-pens-api.onrender.com/api";

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
