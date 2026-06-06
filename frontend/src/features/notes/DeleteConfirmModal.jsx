import { AlertTriangle, Loader2 } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, noteTitle, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-modal p-6 animate-fade-in-scale">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center mb-4">
            <AlertTriangle size={20} className="text-danger" />
          </div>

          <h3 id="delete-modal-title" className="text-text font-semibold text-base mb-1.5">
            Delete note?
          </h3>
          <p className="text-text-secondary text-sm mb-5 max-w-xs">
            {noteTitle ? (
              <>Are you sure you want to delete <strong className="text-text font-medium">"{noteTitle}"</strong>? This action cannot be undone.</>
            ) : (
              "Are you sure you want to delete this note? This action cannot be undone."
            )}
          </p>

          <div className="flex gap-2.5 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="btn-danger flex-1"
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Deleting...</>
              ) : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
