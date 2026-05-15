import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-ink-muted uppercase tracking-widest font-mono">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative group">
        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-accent transition-colors duration-200">
            <Icon size={15} />
          </div>
        )}

        {/* The actual input */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`
            w-full bg-bg-surface border rounded-xl py-3 text-sm text-ink
            placeholder:text-ink-faint font-sans
            transition-all duration-200
            focus:outline-none focus:ring-1
            ${Icon ? "pl-10" : "pl-4"}
            ${isPassword ? "pr-11" : "pr-4"}
            ${
              error
                ? "border-danger/60 focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-accent focus:ring-accent/20"
            }
          `}
        />

        {/* Password toggle button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-danger text-xs font-sans animate-fade-in flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-danger inline-block" />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;