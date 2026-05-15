import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster
          position="bottom-right"
          gutter={12}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#242220",
              color: "#f0ebe3",
              border: "1px solid #2e2c29",
              borderRadius: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              padding: "12px 16px",
              maxWidth: "360px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            },
            success: {
              duration: 2500,
              iconTheme: { primary: "#e8b86d", secondary: "#242220" },
            },
            error: {
              duration: 4500,
              iconTheme: { primary: "#e87070", secondary: "#242220" },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
