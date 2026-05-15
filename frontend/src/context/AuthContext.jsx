import { createContext, useContext, useState, useEffect } from "react";

// Step 1: Create the Context object
// Think of Context as a "global store" that any component can subscribe to
const AuthContext = createContext(null);

// Step 2: Create the Provider component
// This wraps the entire app and provides auth state to all children
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  // So if user refreshes the page, they stay logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // isAuthenticated is derived state — true if token exists
  const isAuthenticated = !!token;

  // Login function — saves token and user to state AND localStorage
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Logout function — clears everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // The value object — everything components can access
  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Create a custom hook for clean access to the context
// Instead of: const auth = useContext(AuthContext)
// We write:   const auth = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;