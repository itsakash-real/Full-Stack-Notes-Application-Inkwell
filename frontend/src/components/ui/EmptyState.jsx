import { memo } from "react";
import { StickyNote, Search, Plus } from "lucide-react";

const EmptyState = ({ isSearch, query, onCreateNote }) => {
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in-up">
        <div className="w-14 h-14 rounded-2xl bg-canvas border border-border flex items-center justify-center mb-5">
          <Search size={22} className="text-text-tertiary" />
        </div>
        <h3 className="text-text font-semibold text-base mb-1">No results found</h3>
        <p className="text-text-secondary text-sm max-w-sm">
          No notes match <span className="font-mono text-accent bg-accent-light px-1.5 py-0.5 rounded text-xs">"{query}"</span>. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-accent-light border border-accent-subtle flex items-center justify-center mb-6">
        <StickyNote size={26} className="text-accent" />
      </div>
      <h2 className="text-text font-semibold text-lg mb-1.5">No notes yet</h2>
      <p className="text-text-secondary text-sm max-w-sm mb-6">
        Start capturing your ideas. Create your first note and it will appear here.
      </p>
      <button onClick={onCreateNote} className="btn-primary">
        <Plus size={16} strokeWidth={2} />
        Create your first note
      </button>
    </div>
  );
};

export default memo(EmptyState);
