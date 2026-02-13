import axios from "axios";

// Mengambil base URL dari file .env.example yang sudah kita buat tadi
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5151/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
