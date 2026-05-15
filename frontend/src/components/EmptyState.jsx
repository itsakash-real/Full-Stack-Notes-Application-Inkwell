import { BookOpen, Search } from "lucide-react";

const EmptyState = ({ isSearch, query, onCreateNote }) => {

  // Two modes — no notes at all, or search returned nothing
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="
          w-16 h-16 rounded-2xl bg-bg-surface border border-border
          flex items-center justify-center mb-5
        ">
          <Search size={24} className="text-ink-faint" />
        </div>
        <h3 className="font-display text-xl text-ink mb-2">
          No results found
        </h3>
        <p className="text-ink-muted text-sm font-sans max-w-xs">
          Nothing matched{" "}
          <span className="font-mono text-accent">"{query}"</span>.
          Try a different keyword or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      {/* Decorative graphic */}
      <div className="relative mb-8">
        <div className="
          w-20 h-20 rounded-3xl bg-bg-surface border border-border
          flex items-center justify-center
        ">
          <BookOpen size={32} className="text-ink-faint" />
        </div>
        {/* Floating dot decorations */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent/20 border border-accent/40" />
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-accent/15 border border-accent/30" />
      </div>

      <h3 className="font-display text-2xl text-ink mb-3">
        Your notebook is empty
      </h3>
      <p className="text-ink-muted text-sm font-sans max-w-xs mb-8 leading-relaxed">
        Capture your first thought, idea, or task. Notes support full markdown formatting.
      </p>
      <button
        onClick={onCreateNote}
        className="btn-primary flex items-center gap-2"
      >
        Write your first note
      </button>
    </div>
  );
};

export default EmptyState;