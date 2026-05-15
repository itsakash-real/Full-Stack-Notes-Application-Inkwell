import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Pin, PinOff, Pencil, Trash2 } from "lucide-react";

// Format date nicely: "Jan 15, 2024"
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Truncate content for preview (max 180 chars)
const truncateContent = (text, max = 180) => {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
};

const NoteCard = ({ note, onEdit, onDelete, onPinToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        group relative flex flex-col
        bg-bg-card border border-border rounded-2xl
        p-5 cursor-pointer
        hover:border-border-light hover:shadow-card-hover
        transition-all duration-300 animate-fade-in
      "
      onClick={() => onEdit(note)}  // Click anywhere on card to edit
    >

      {/* ── PIN INDICATOR ───────────────────────────────── */}
      {note.isPinned && (
        <div className="absolute top-3.5 right-3.5">
          <div className="
            w-6 h-6 rounded-lg bg-accent/10 border border-accent/30
            flex items-center justify-center
          ">
            <Pin size={11} className="text-accent" fill="currentColor" />
          </div>
        </div>
      )}

      {/* ── TITLE ───────────────────────────────────────── */}
      <h3 className="
        font-display text-base font-semibold text-ink
        leading-snug mb-2.5
        pr-8  /* padding to avoid overlap with pin icon */
        line-clamp-2
      ">
        {note.title}
      </h3>

      {/* ── CONTENT PREVIEW (rendered markdown) ─────────── */}
      <div className="markdown-content flex-1 mb-4 overflow-hidden">
        <ReactMarkdown>
          {truncateContent(note.content)}
        </ReactMarkdown>
      </div>

      {/* ── TAGS ────────────────────────────────────────── */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="tag">
              #{tag}
            </span>
          ))}
          {/* Show "+N more" if too many tags */}
          {note.tags.length > 4 && (
            <span className="tag">+{note.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* ── FOOTER: date + actions ───────────────────────── */}
      <div className="flex items-center justify-between pt-3.5 border-t border-border/60">
        {/* Date */}
        <span className="text-ink-faint text-xs font-mono">
          {formatDate(note.updatedAt)}
        </span>

        {/* Action buttons — visible on hover */}
        <div className={`
          flex items-center gap-0.5
          transition-all duration-200
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
        `}>

          {/* Pin / Unpin */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from firing
              onPinToggle(note._id, note.isPinned);
            }}
            title={note.isPinned ? "Unpin note" : "Pin note"}
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-ink-faint hover:text-accent hover:bg-accent/8
              transition-all duration-150
            "
          >
            {note.isPinned
              ? <PinOff size={14} />
              : <Pin size={14} />
            }
          </button>

          {/* Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            title="Edit note"
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-ink-faint hover:text-ink hover:bg-bg-hover
              transition-all duration-150
            "
          >
            <Pencil size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id, note.title);
            }}
            title="Delete note"
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-ink-faint hover:text-danger hover:bg-danger/8
              transition-all duration-150
            "
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;