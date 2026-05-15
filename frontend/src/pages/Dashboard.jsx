import { useState, useCallback, useEffect } from "react";
import { Pin, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import useNotes from "../hooks/useNotes";
import { useAuth } from "../context/AuthContext";

// Skeleton loader card — shown while notes are fetching
const SkeletonCard = () => (
  <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
    <div className="h-4 bg-bg-hover rounded-lg w-3/4 animate-shimmer
      bg-gradient-to-r from-bg-hover via-bg-surface to-bg-hover
      bg-[length:200%_100%]" />
    <div className="space-y-2">
      <div className="h-3 bg-bg-hover rounded-lg w-full animate-shimmer
        bg-gradient-to-r from-bg-hover via-bg-surface to-bg-hover
        bg-[length:200%_100%]" />
      <div className="h-3 bg-bg-hover rounded-lg w-4/5 animate-shimmer
        bg-gradient-to-r from-bg-hover via-bg-surface to-bg-hover
        bg-[length:200%_100%]" />
      <div className="h-3 bg-bg-hover rounded-lg w-2/3 animate-shimmer
        bg-gradient-to-r from-bg-hover via-bg-surface to-bg-hover
        bg-[length:200%_100%]" />
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-5 w-16 bg-bg-hover rounded-full animate-shimmer
        bg-gradient-to-r from-bg-hover via-bg-surface to-bg-hover
        bg-[length:200%_100%]" />
      <div className="h-5 w-12 bg-bg-hover rounded-full animate-shimmer
        bg-gradient-to-r from-bg-hover via-bg-surface to-bg-hover
        bg-[length:200%_100%]" />
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  // All notes state and API operations from our custom hook
  const {
    notes,
    pinnedNotes,
    unpinnedNotes,
    isLoading,
    isSaving,
    isDeleting,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
  } = useNotes();

  // ── MODAL STATE ───────────────────────────────────────────────
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create mode

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null); // { id, title }

  // ── SEARCH STATE ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ── KEYBOARD SHORTCUTS ───────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K opens new note modal
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleCreateNote();
      }
      // Escape closes any open modal
      if (e.key === "Escape") {
        setIsNoteModalOpen(false);
        setIsDeleteModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── HANDLERS ─────────────────────────────────────────────────

  const handleCreateNote = () => {
    setEditingNote(null);      // null = create mode
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);      // pass note = edit mode
    setIsNoteModalOpen(true);
  };

  const handleDeleteClick = (id, title) => {
    setDeletingNote({ id, title });
    setIsDeleteModalOpen(true);
  };

  const handleModalSave = async (noteData) => {
    let success;
    if (editingNote) {
      success = await updateNote(editingNote._id, noteData);
    } else {
      success = await createNote(noteData);
    }
    if (success) setIsNoteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;
    const success = await deleteNote(deletingNote.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setDeletingNote(null);
    }
  };

  // useCallback so this function reference is stable
  // prevents Navbar from re-rendering unnecessarily
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    searchNotes(query);
  }, [searchNotes]);

  // ── RENDER ───────────────────────────────────────────────────

  const hasNotes = notes.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-bg-base">

      {/* Navbar */}
      <Navbar
        onSearch={handleSearch}
        onCreateNote={handleCreateNote}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── PAGE HEADER ───────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-ink mb-1">
              {isSearching
                ? `Results for "${searchQuery}"`
                : `Good ${getTimeOfDay()}, ${user?.fullName?.split(" ")[0]}`
              }
            </h1>
            <p className="text-ink-muted text-sm font-sans flex items-center gap-2">
              {isLoading ? (
                "Loading your notes..."
              ) : (
                <>
                  <span>
                    {isSearching
                      ? `${notes.length} note${notes.length !== 1 ? "s" : ""} found`
                      : `${notes.length} note${notes.length !== 1 ? "s" : ""} total`
                    }
                  </span>
                  {/* Pinned count badge */}
                  {!isSearching && pinnedNotes.length > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-ink-faint" />
                      <span className="text-accent font-mono text-xs">
                        {pinnedNotes.length} pinned
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Quick stats on desktop */}
          {!isLoading && hasNotes && !isSearching && (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="font-display text-2xl text-ink">{notes.length}</p>
                <p className="text-ink-faint text-xs font-mono">notes</p>
              </div>
            </div>
          )}
        </div>

        {/* ── LOADING SKELETON ──────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ───────────────────────────────── */}
        {!isLoading && !hasNotes && (
          <EmptyState
            isSearch={isSearching}
            query={searchQuery}
            onCreateNote={handleCreateNote}
          />
        )}

        {/* ── NOTES CONTENT ─────────────────────────────── */}
        {!isLoading && hasNotes && (
          <div className="space-y-10">

            {/* PINNED SECTION */}
            {pinnedNotes.length > 0 && !isSearching && (
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <Pin size={13} className="text-accent" fill="currentColor" />
                  <h2 className="font-mono text-xs text-accent uppercase tracking-widest">
                    Pinned
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteClick}
                      onPinToggle={togglePin}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ALL / UNPINNED SECTION */}
            {(unpinnedNotes.length > 0 || isSearching) && (
              <section>
                {/* Section header — only show when there are also pinned notes */}
                {pinnedNotes.length > 0 && !isSearching && (
                  <div className="flex items-center gap-2.5 mb-4">
                    <h2 className="font-mono text-xs text-ink-muted uppercase tracking-widest">
                      All notes
                    </h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}

                {unpinnedNotes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(isSearching ? notes : unpinnedNotes).map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteClick}
                        onPinToggle={togglePin}
                      />
                    ))}
                  </div>
                ) : (
                  // All notes are pinned — show message
                  !isSearching && (
                    <p className="text-ink-faint text-sm font-sans text-center py-8">
                      All your notes are pinned above.
                    </p>
                  )
                )}
              </section>
            )}
          </div>
        )}
      </main>

      {/* ── MODALS ────────────────────────────────────────── */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleModalSave}
        editNote={editingNote}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingNote(null);
        }}
        onConfirm={handleDeleteConfirm}
        noteTitle={deletingNote?.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

// Helper — personalized greeting based on time of day
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

export default Dashboard;