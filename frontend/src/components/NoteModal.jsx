import { useState, useEffect } from "react";
import { X, Tag, Eye, Edit3, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const NoteModal = ({ isOpen, onClose, onSave, editNote, isLoading }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // Comma-separated string
  const [activeTab, setActiveTab] = useState("write"); // "write" | "preview"
  const [errors, setErrors] = useState({});

  // Determine mode based on whether editNote is provided
  const isEditing = !!editNote;

  // When modal opens — populate fields if editing
  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(editNote.title || "");
        setContent(editNote.content || "");
        setTagsInput(editNote.tags?.join(", ") || "");
      } else {
        // Reset for new note
        setTitle("");
        setContent("");
        setTagsInput("");
      }
      setErrors({});
      setActiveTab("write");
    }
  }, [isOpen, editNote]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Parse comma-separated tags into array, clean whitespace
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0); // Remove empty strings

    onSave({ title: title.trim(), content: content.trim(), tags });
  };

  // Handle Tab key inside textarea to insert spaces (not lose focus)
  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = "  "; // 2 spaces for tab
      setContent(content.slice(0, start) + spaces + content.slice(end));
      // Move cursor after inserted spaces
      setTimeout(() => {
        e.target.selectionStart = start + 2;
        e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop — clicking it closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Panel */}
      <div className="
        w-full max-w-2xl bg-bg-surface border border-border
        rounded-2xl shadow-modal flex flex-col
        animate-fade-in-scale
        max-h-[90vh]
      ">

        {/* ── MODAL HEADER ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Edit3 size={13} className="text-accent" />
            </div>
            <h2 className="font-display text-lg text-ink">
              {isEditing ? "Edit note" : "New note"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              w-8 h-8 rounded-xl flex items-center justify-center
              text-ink-faint hover:text-ink hover:bg-bg-hover
              transition-all duration-150
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* ── MODAL BODY ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 min-h-0">

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ink-muted uppercase tracking-widest">
              Title
            </label>
            <input
              type="text"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: "" }));
              }}
              className={`
                w-full bg-bg-base border rounded-xl px-4 py-3
                font-display text-lg text-ink placeholder:text-ink-faint
                focus:outline-none focus:ring-1 transition-all duration-200
                ${errors.title
                  ? "border-danger/60 focus:border-danger focus:ring-danger/20"
                  : "border-border focus:border-accent focus:ring-accent/20"
                }
              `}
            />
            {errors.title && (
              <p className="text-danger text-xs font-sans animate-fade-in flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-danger inline-block" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Tags Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ink-muted uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={10} />
              Tags
              <span className="normal-case text-ink-faint">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="work, ideas, urgent"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="
                w-full bg-bg-base border border-border rounded-xl px-4 py-2.5
                font-mono text-sm text-accent placeholder:text-ink-faint
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20
                transition-all duration-200
              "
            />
            {/* Live tag preview */}
            {tagsInput && (
              <div className="flex flex-wrap gap-1.5 pt-1 animate-fade-in">
                {tagsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                  ))}
              </div>
            )}
          </div>

          {/* Content — Write / Preview tabs */}
          <div className="space-y-2">
            {/* Tab switcher */}
            <div className="flex items-center gap-1 bg-bg-base border border-border rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveTab("write")}
                className={`
                  flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm
                  font-sans transition-all duration-200
                  ${activeTab === "write"
                    ? "bg-bg-surface text-ink shadow-sm border border-border"
                    : "text-ink-muted hover:text-ink"
                  }
                `}
              >
                <Edit3 size={13} />
                Write
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`
                  flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm
                  font-sans transition-all duration-200
                  ${activeTab === "preview"
                    ? "bg-bg-surface text-ink shadow-sm border border-border"
                    : "text-ink-muted hover:text-ink"
                  }
                `}
              >
                <Eye size={13} />
                Preview
              </button>
            </div>

            {/* Write tab */}
            {activeTab === "write" && (
              <div className="space-y-1.5 animate-fade-in">
                <textarea
                  placeholder={`Write your note in Markdown...\n\n# Heading\n**Bold**, *italic*, \`code\`\n- List items`}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors((p) => ({ ...p, content: "" }));
                  }}
                  onKeyDown={handleTabKey}
                  rows={12}
                  className={`
                    w-full bg-bg-base border rounded-xl px-4 py-3.5
                    font-mono text-sm text-ink leading-relaxed
                    placeholder:text-ink-faint resize-none
                    focus:outline-none focus:ring-1 transition-all duration-200
                    ${errors.content
                      ? "border-danger/60 focus:border-danger focus:ring-danger/20"
                      : "border-border focus:border-accent focus:ring-accent/20"
                    }
                  `}
                />
                {errors.content && (
                  <p className="text-danger text-xs font-sans animate-fade-in flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-danger inline-block" />
                    {errors.content}
                  </p>
                )}
                {/* Markdown hint */}
                <p className="text-ink-faint text-xs font-mono">
                  Markdown supported — # h1, **bold**, *italic*, `code`, - list
                </p>
              </div>
            )}

            {/* Preview tab */}
            {activeTab === "preview" && (
              <div className="
                bg-bg-base border border-border rounded-xl px-5 py-4
                min-h-[300px] animate-fade-in overflow-y-auto
                markdown-content
              ">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-ink-faint text-sm font-sans italic">
                    Nothing to preview yet. Switch to Write and add some content.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL FOOTER ──────────────────────────────── */}
        <div className="
          flex items-center justify-between
          px-6 py-4 border-t border-border flex-shrink-0
        ">
          {/* Word count */}
          <span className="text-ink-faint text-xs font-mono">
            {content.split(/\s+/).filter(Boolean).length} words
          </span>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="
                flex items-center gap-2
                bg-accent text-bg-base font-semibold
                px-5 py-2.5 rounded-xl text-sm
                hover:bg-accent-hover active:scale-[0.97]
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? "Save changes" : "Create note"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;