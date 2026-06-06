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
  id,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-2xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Icon size={15} />
          </span>
        )}

        <input
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full bg-surface border rounded-lg text-sm text-text placeholder:text-text-disabled outline-none transition-colors duration-150
            ${Icon ? "pl-10" : "pl-3.5"}
            ${isPassword ? "pr-11" : "pr-3.5"}
            py-2.5
            ${error
              ? "border-danger focus:border-danger"
              : "border-border hover:border-border-hover focus:border-accent"
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-danger text-2xs flex items-center gap-1.5 animate-fade-in">
          <span className="w-1 h-1 rounded-full bg-danger shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
