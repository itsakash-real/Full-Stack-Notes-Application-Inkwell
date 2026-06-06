import { useState, useEffect } from "react";
import { X, Eye, Edit3, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const NoteModal = ({ isOpen, onClose, onSave, editNote, isLoading }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [errors, setErrors] = useState({});

  const isEditing = !!editNote;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(editNote.title || "");
        setContent(editNote.content || "");
        setTagsInput(editNote.tags?.join(", ") || "");
      } else {
        setTitle("");
        setContent("");
        setTagsInput("");
      }
      setErrors({});
      setActiveTab("write");
    }
  }, [isOpen, editNote]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!content.trim()) errs.content = "Content is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ title: title.trim(), content: content.trim(), tags });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-modal flex flex-col max-h-[85vh] animate-fade-in-scale">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
              <Edit3 size={14} className="text-accent" />
            </div>
            <h2 id="modal-title" className="text-text font-semibold text-base">
              {isEditing ? "Edit note" : "New note"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text hover:bg-hover transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-2xs font-semibold text-text-secondary uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: "" })); }}
              className={`w-full bg-canvas border rounded-lg px-4 py-2.5 text-base font-medium text-text placeholder:text-text-disabled outline-none transition-colors ${
                errors.title ? "border-danger focus:border-danger" : "border-border focus:border-accent"
              }`}
            />
            {errors.title && (
              <p className="text-danger text-2xs flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-danger" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Content tabs */}
          <div className="space-y-3">
            <div className="flex gap-1 bg-canvas border border-border rounded-lg p-1 w-fit">
              {[
                { id: "write", icon: Edit3, label: "Write" },
                { id: "preview", icon: Eye, label: "Preview" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? "bg-surface text-text shadow-sm border border-border"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "write" ? (
              <div className="space-y-2">
                <textarea
                  placeholder="Start writing... Markdown is supported."
                  value={content}
                  onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors((p) => ({ ...p, content: "" })); }}
                  rows={14}
                  className={`w-full bg-canvas border rounded-lg px-4 py-3 text-sm text-text leading-relaxed placeholder:text-text-disabled font-mono resize-none outline-none transition-colors ${
                    errors.content ? "border-danger focus:border-danger" : "border-border focus:border-accent"
                  }`}
                />
                {errors.content && (
                  <p className="text-danger text-2xs flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-danger" />
                    {errors.content}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-canvas border border-border rounded-lg px-5 py-4 min-h-[320px] markdown-content overflow-y-auto">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-text-disabled text-sm italic">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-2xs font-semibold text-text-secondary uppercase tracking-wider">
              Tags
            </label>
            <input
              type="text"
              placeholder="work, ideas, personal"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-canvas border border-border rounded-lg px-4 py-2 text-sm text-text placeholder:text-text-disabled font-mono outline-none focus:border-accent transition-colors"
            />
            {tagsInput && (
              <div className="flex flex-wrap gap-1.5">
                {tagsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <span className="text-text-tertiary text-2xs font-mono">
            {content.split(/\s+/).filter(Boolean).length} words
          </span>
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} disabled={isLoading} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isLoading} className="btn-primary min-w-[120px]">
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : isEditing ? "Save changes" : "Create note"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoteModal;
