import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, BookOpen, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import InputField from "../components/InputField";
import PageTransition from "../components/PageTransition";

// Password strength checker — shows user how strong their password is
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "",         color: "" },
    { label: "Weak",     color: "bg-danger" },
    { label: "Fair",     color: "bg-warning" },
    { label: "Good",     color: "bg-success/70" },
    { label: "Strong",   color: "bg-success" },
    { label: "Very strong", color: "bg-success" },
  ];

  return { score, ...levels[score] };
};

const Signup = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already logged in, go straight to dashboard
  // No need to show login/signup to authenticated users
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── FORM STATE ───────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  // ── INPUT HANDLER ────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ── VALIDATION ───────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreed) {
      newErrors.agreed = "Please accept to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── SUBMIT HANDLER ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      const { token, user } = response.data;

      login(user, token);
      toast.success("Account created! Welcome to Inkwell 🎉");
      navigate("/dashboard");

    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";

      if (message.toLowerCase().includes("email")) {
        setErrors({ email: message });
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <PageTransition>
    <div className="min-h-screen bg-bg-base flex">

      {/* ── LEFT DECORATIVE PANEL ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-bg-surface border-r border-border flex-col justify-between p-12">

        {/* Ambient glow */}
        <div className="absolute top-[10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-accent/4 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-10%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#e8b86d 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent" />
          </div>
          <span className="font-display font-semibold text-ink text-lg">
            Inkwell
          </span>
        </div>

        {/* What you get section */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-2">
            <p className="font-mono text-xs text-accent tracking-widest uppercase">
              Everything you need
            </p>
            <h2 className="font-display text-4xl xl:text-5xl text-ink leading-[1.15]">
              Start capturing
              <br />
              <span className="italic text-accent">your best</span>
              <br />
              thoughts today.
            </h2>
          </div>

          {/* Feature cards */}
          <div className="space-y-3">
            {[
              {
                icon: "✦",
                title: "Markdown support",
                desc: "Format notes with headings, lists, and code blocks",
              },
              {
                icon: "◈",
                title: "Pin & organize",
                desc: "Keep important notes always at the top",
              },
              {
                icon: "⌕",
                title: "Instant search",
                desc: "Find any note in milliseconds",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-bg-base/50 border border-border/50 animate-fade-in"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="text-accent text-lg leading-none mt-0.5 font-mono">
                  {item.icon}
                </span>
                <div>
                  <p className="text-ink text-sm font-medium font-sans">
                    {item.title}
                  </p>
                  <p className="text-ink-muted text-xs font-sans mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-ink-faint text-xs font-mono px-3">
            Free forever
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in overflow-y-auto">

        {/* Mobile brand */}
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
              Create account
            </h2>
            <p className="text-ink-muted text-sm font-sans">
              Join and start writing in seconds
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <InputField
              label="Full Name"
              type="text"
              placeholder="Akash Maurya"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
              icon={User}
              autoComplete="name"
            />

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

            {/* Password with strength meter */}
            <div className="space-y-2">
              <InputField
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange("password")}
                error={errors.password}
                icon={Lock}
                autoComplete="new-password"
              />

              {/* Password strength bar */}
              {formData.password && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-ink-muted text-xs font-mono">
                      Strength:{" "}
                      <span className="text-ink">{passwordStrength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              icon={Lock}
              autoComplete="new-password"
            />

            {/* Terms checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => {
                    setAgreed(!agreed);
                    if (errors.agreed) {
                      setErrors((prev) => ({ ...prev, agreed: "" }));
                    }
                  }}
                  className={`
                    w-4 h-4 mt-0.5 rounded flex-shrink-0 border
                    flex items-center justify-center
                    transition-all duration-200 cursor-pointer
                    ${
                      agreed
                        ? "bg-accent border-accent"
                        : "bg-transparent border-border group-hover:border-accent/50"
                    }
                  `}
                >
                  {agreed && <Check size={10} className="text-bg-base" strokeWidth={3} />}
                </div>
                <span className="text-ink-muted text-xs font-sans leading-relaxed">
                  I agree to the{" "}
                  <span className="text-accent cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-accent cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-danger text-xs font-sans animate-fade-in flex items-center gap-1.5 pl-7">
                  <span className="w-1 h-1 rounded-full bg-danger inline-block" />
                  {errors.agreed}
                </p>
              )}
            </div>

            {/* Submit */}
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
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create free account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-ink-faint text-xs font-mono">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login link */}
          <p className="text-center text-ink-muted text-sm font-sans">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Signup;