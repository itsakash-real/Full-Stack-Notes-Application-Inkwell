import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { User, Mail, Lock, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { signupUser } from "../../api/auth";
import InputField from "../../components/ui/InputField";

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: "", color: "" },
    { label: "Weak", color: "bg-danger" },
    { label: "Fair", color: "bg-warning" },
    { label: "Good", color: "bg-success/60" },
    { label: "Strong", color: "bg-success" },
    { label: "Very strong", color: "bg-success" },
  ];
  return { score, ...levels[score] };
};

const Signup = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2) errs.fullName = "At least 2 characters";

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";

    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = "Need uppercase, lowercase, and a number";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";

    if (!agreed) errs.agreed = "You must accept the terms";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const res = await signupUser({
        fullName: form.fullName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      login(res.data.user, res.data.token);
      toast.success("Account created — welcome!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
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
            <h1 className="text-text text-xl font-bold tracking-tight">Create your account</h1>
            <p className="text-text-secondary text-sm mt-1">Start capturing your ideas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              label="Full name"
              type="text"
              placeholder="Your name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
              icon={User}
              autoComplete="name"
            />

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

            <div className="space-y-2">
              <InputField
                label="Password"
                type="password"
                placeholder="Min. 8 characters — letters, number"
                value={form.password}
                onChange={handleChange("password")}
                error={errors.password}
                icon={Lock}
                autoComplete="new-password"
              />

              {form.password && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          lvl <= strength.score ? strength.color : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-text-tertiary text-2xs">
                      Strength: <span className="text-text font-medium">{strength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <InputField
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              icon={Lock}
              autoComplete="new-password"
            />

            {/* Terms */}
            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <span
                  onClick={() => { setAgreed(!agreed); if (errors.agreed) setErrors((p) => ({ ...p, agreed: "" })); }}
                  className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-all duration-150 ${
                    agreed ? "bg-accent border-accent" : "border-border group-hover:border-border-hover"
                  }`}
                  role="checkbox"
                  aria-checked={agreed}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); setAgreed(!agreed); } }}
                >
                  {agreed && <Check size={10} className="text-white" strokeWidth={3} />}
                </span>
                <span className="text-text-secondary text-xs leading-relaxed">
                  I agree to the{" "}
                  <span className="text-accent font-medium">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-accent font-medium">Privacy Policy</span>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-danger text-2xs flex items-center gap-1.5 pl-7 animate-fade-in">
                  <span className="w-1 h-1 rounded-full bg-danger shrink-0" />
                  {errors.agreed}
                </p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
