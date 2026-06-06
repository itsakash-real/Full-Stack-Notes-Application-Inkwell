import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const safeParse = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const safeGetToken = () => {
  const token = localStorage.getItem("token");
  if (!token || typeof token !== "string" || token.length < 10) {
    localStorage.removeItem("token");
    return null;
  }
  return token;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse("user"));
  const [token, setToken] = useState(() => safeGetToken());

  const isAuthenticated = !!token;

  const login = (userData, authToken) => {
    if (!authToken || !userData) return;
    setUser(userData);
    setToken(authToken);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
    } catch {
      // Storage full or unavailable
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
