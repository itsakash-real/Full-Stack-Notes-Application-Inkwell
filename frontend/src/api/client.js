import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && typeof token === "string" && token.length > 10) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {
        // Storage unavailable
      }
      const isLoginPage = window.location.pathname === "/login";
      if (!isLoginPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
