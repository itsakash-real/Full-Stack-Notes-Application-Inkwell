import { Trash2, AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, noteTitle, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="
        w-full max-w-md bg-bg-surface border border-border
        rounded-2xl shadow-modal animate-fade-in-scale p-6
      ">

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-5">
          <AlertTriangle size={20} className="text-danger" />
        </div>

        {/* Content */}
        <h3 className="font-display text-xl text-ink mb-2">
          Delete this note?
        </h3>
        <p className="text-ink-muted text-sm font-sans leading-relaxed mb-6">
          <span className="text-ink font-medium">"{noteTitle}"</span> will be
          permanently deleted. This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-ghost"
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="
              flex items-center gap-2
              bg-danger/10 text-danger border border-danger/30
              font-semibold px-5 py-2.5 rounded-xl text-sm
              hover:bg-danger/20 active:scale-[0.97]
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 size={14} />
                Delete forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;