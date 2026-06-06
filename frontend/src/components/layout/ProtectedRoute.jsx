import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

// This component acts as a GUARD for pages that require login
// If user is not authenticated → redirect to /login
// If user IS authenticated → render the actual page

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Not logged in? Redirect to login page
  // "replace" replaces the history entry so back button doesn't
  // bring them back to the protected page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in? Render whatever page was requested
  return children;
};

export default ProtectedRoute;