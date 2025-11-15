import axios from "axios";
import store from "../store";

// Cambia esta URL al endpoint de tu LoopBack (p.ej. http://localhost:3000)
export const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Agregar token en cada petición si existe
api.interceptors.request.use(
  (config) => {
    const token = store.getters.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
