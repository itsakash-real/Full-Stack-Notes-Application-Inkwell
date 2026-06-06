import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Pin, PinOff, Pencil, Trash2 } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete, onPinToggle }) => {
  const wordCount = useMemo(
    () => (note.content ? note.content.split(/\s+/).filter(Boolean).length : 0),
    [note.content]
  );

  const formattedDate = useMemo(() => {
    if (!note.updatedAt) return "";
    const d = new Date(note.updatedAt);
    const diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, [note.updatedAt]);

  return (
    <article
      onClick={() => onEdit(note)}
      className="group cursor-pointer card p-5 flex flex-col animate-fade-in"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onEdit(note); }}
      aria-label={`Note: ${note.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-text font-semibold text-sm leading-snug line-clamp-2 flex-1">
          {note.title || "Untitled"}
        </h3>
        {note.isPinned && (
          <span className="shrink-0 flex items-center gap-1 text-2xs font-medium text-accent bg-accent-light px-2 py-0.5 rounded-md" aria-label="Pinned">
            <Pin size={10} fill="currentColor" /> Pinned
          </span>
        )}
      </div>

      <div className="markdown-content flex-1 mb-4 line-clamp-4 overflow-hidden">
        {note.content ? (
          <ReactMarkdown>{note.content.slice(0, 300)}</ReactMarkdown>
        ) : (
          <p className="text-text-disabled italic text-xs">No content</p>
        )}
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
          {note.tags.length > 4 && (
            <span className="tag text-text-tertiary">+{note.tags.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-text-tertiary text-2xs flex items-center gap-2">
          <span>{formattedDate}</span>
          <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button onClick={(e) => { e.stopPropagation(); onPinToggle(note._id, note.isPinned); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-accent hover:bg-accent-light transition-colors"
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}>
            {note.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onEdit(note); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-text hover:bg-hover transition-colors"
            aria-label="Edit note">
            <Pencil size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(note._id, note.title); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-danger hover:bg-danger-light transition-colors"
            aria-label="Delete note">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default memo(NoteCard);
