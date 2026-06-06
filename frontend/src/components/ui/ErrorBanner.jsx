import { memo } from "react";
import { AlertCircle } from "lucide-react";

const ErrorBanner = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 p-4 bg-danger-light border border-danger/15 rounded-xl animate-fade-in">
      <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry}
          className="text-sm font-medium text-danger hover:text-danger-hover shrink-0 transition-colors">
          Retry
        </button>
      )}
    </div>
  );
};

export default memo(ErrorBanner);
