import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const Home = lazy(() => import("./features/home/Home"));
const Login = lazy(() => import("./features/auth/Login"));
const Signup = lazy(() => import("./features/auth/Signup"));
const Dashboard = lazy(() => import("./features/notes/Dashboard"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-canvas flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster
          position="bottom-right"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#181a24",
              border: "1px solid #e2e4e9",
              borderRadius: "10px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13px",
              padding: "10px 14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            },
            success: {
              duration: 2500,
              iconTheme: { primary: "#0d9e6c", secondary: "#ffffff" },
            },
            error: {
              duration: 4000,
              iconTheme: { primary: "#e0464d", secondary: "#ffffff" },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
