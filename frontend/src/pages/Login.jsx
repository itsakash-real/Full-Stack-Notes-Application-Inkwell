import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import InputField from "../components/InputField";
import PageTransition from "../components/PageTransition";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already logged in, go straight to dashboard
  // No need to show login/signup to authenticated users
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── FORM STATE ───────────────────────────────────────────────
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ── INPUT HANDLER ────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ── VALIDATION ───────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    // Returns true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // ── SUBMIT HANDLER ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent browser's default form refresh

    if (!validate()) return; // Stop if validation fails

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      const { token, user } = response.data;

      // Save to context + localStorage via our login() function
      login(user, token);

      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}!`);

      // Redirect to dashboard after successful login
      navigate("/dashboard");

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      // Show specific field errors if backend provides them
      if (message.toLowerCase().includes("email")) {
        setErrors({ email: message });
      } else if (message.toLowerCase().includes("password")) {
        setErrors({ password: message });
      } else {
        toast.error(message);
      }
    } finally {
      // Always runs — whether success or error
      setIsLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <PageTransition>
    <div className="min-h-screen bg-bg-base flex">

      {/* ── LEFT DECORATIVE PANEL ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-bg-surface border-r border-border flex-col justify-between p-12">

        {/* Ambient background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/3 blur-[120px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#e8b86d 1px, transparent 1px),
                              linear-gradient(90deg, #e8b86d 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top — Brand mark */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent" />
          </div>
          <span className="font-display font-semibold text-ink text-lg">
            Inkwell
          </span>
        </div>

        {/* Middle — Hero content */}
        <div className="relative z-10 space-y-8">
          {/* Decorative line */}
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-accent/60" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
              Your thoughts, organized
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl xl:text-6xl text-ink leading-[1.1]">
            Where ideas
            <br />
            <span className="text-accent italic">find their</span>
            <br />
            home.
          </h1>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Markdown-powered notes",
              "Pin what matters most",
              "Search across everything",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-ink-muted text-sm font-sans">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Testimonial / Quote */}
        <div className="relative z-10">
          <blockquote className="border-l-2 border-accent/40 pl-4">
            <p className="text-ink-muted text-sm font-sans italic leading-relaxed">
              "The palest ink is better than the best memory."
            </p>
            <cite className="text-ink-faint text-xs font-mono mt-2 block not-italic">
              — Chinese Proverb
            </cite>
          </blockquote>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">

        {/* Mobile brand mark */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent" />
          </div>
          <span className="font-display font-semibold text-ink text-lg">
            Inkwell
          </span>
        </div>

        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl text-ink mb-2">
              Welcome back
            </h2>
            <p className="text-ink-muted text-sm font-sans">
              Sign in to continue to your notes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <InputField
                label="Password"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange("password")}
                error={errors.password}
                icon={Lock}
                autoComplete="current-password"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full flex items-center justify-center gap-2.5
                bg-accent text-bg-base font-semibold
                py-3 rounded-xl text-sm
                hover:bg-accent-hover
                active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-accent-glow
                mt-2
              "
            >
              {isLoading ? (
                <>
                  {/* Spinner */}
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-border" />
            <span className="text-ink-faint text-xs font-mono">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Signup link */}
          <p className="text-center text-ink-muted text-sm font-sans">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-ink-faint text-xs font-mono text-center">
          Your notes are private and encrypted
        </p>
      </div>
    </div>
    </PageTransition>
  );
};

export default Login;