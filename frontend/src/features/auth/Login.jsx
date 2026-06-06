import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { loginUser } from "../../api/auth";
import InputField from "../../components/ui/InputField";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const res = await loginUser({
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.fullName.split(" ")[0]}`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
      else if (msg.toLowerCase().includes("password")) setErrors({ password: msg });
      else toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="#5c5fef" />
              <path d="M7 7h4l3 5-3 5H7l3-5-3-5z" fill="#fff" fillOpacity="0.9" />
              <path d="M13 7h4v2h-4V7zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z" fill="#fff" fillOpacity="0.6" />
            </svg>
            <span className="text-text font-bold text-lg tracking-tight">Inkwell</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl shadow-card p-8">
          <div className="mb-6">
            <h1 className="text-text text-xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-text-secondary text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
              icon={Lock}
              autoComplete="current-password"
            />

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
