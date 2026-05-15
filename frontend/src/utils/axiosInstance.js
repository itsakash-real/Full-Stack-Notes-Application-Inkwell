import axios from "axios";

// Create a custom Axios instance with pre-configured settings
// Instead of writing the full URL every time:
//   axios.get("http://localhost:8000/api/notes")
// We can now write:
//   axiosInstance.get("/notes")

const axiosInstance = axios.create({
  // Base URL — all requests will be prefixed with this
  // In production, we'll change this to our deployed backend URL
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",

  // Request timeout — if server doesn't respond in 10s, fail gracefully
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR ────────────────────────────────────────
// This runs BEFORE every request is sent
// Perfect place to attach the JWT token automatically

axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, attach it to the Authorization header
    // Now we NEVER have to manually add the token in components
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── RESPONSE INTERCEPTOR ───────────────────────────────────────
// This runs AFTER every response comes back
// Perfect place to handle global errors (like expired tokens)

axiosInstance.interceptors.response.use(
  // Success: just return the response as-is
  (response) => response,

  // Error: handle globally
  (error) => {
    // If we get 401 (Unauthorized) — token expired or invalid
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      // We use window.location because we're outside React here
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;