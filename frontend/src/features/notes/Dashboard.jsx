import { useState, useCallback, useEffect, useMemo } from "react";
import { Pin } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";
import ErrorBanner from "../../components/ui/ErrorBanner";
import useNotes from "./useNotes";
import { useAuth } from "../auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    notes,
    pinnedNotes,
    unpinnedNotes,
    isLoading,
    isSaving,
    isDeleting,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
    fetchNotes,
  } = useNotes();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setEditingNote(null);
        setIsNoteModalOpen(true);
      }
      if (e.key === "Escape") {
        setIsNoteModalOpen(false);
        setIsDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleCreateNote = useCallback(() => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  }, []);

  const handleEditNote = useCallback((note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id, title) => {
    setDeletingNote({ id, title });
    setIsDeleteModalOpen(true);
  }, []);

  const handleModalSave = useCallback(async (noteData) => {
    let ok;
    if (editingNote) {
      ok = await updateNote(editingNote._id, noteData);
    } else {
      ok = await createNote(noteData);
    }
    if (ok) setIsNoteModalOpen(false);
  }, [editingNote, updateNote, createNote]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingNote) return;
    const ok = await deleteNote(deletingNote.id);
    if (ok) {
      setIsDeleteModalOpen(false);
      setDeletingNote(null);
    }
  }, [deletingNote, deleteNote]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    searchNotes(query);
  }, [searchNotes]);

  const closeNoteModal = useCallback(() => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingNote(null);
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
  }, []);

  const hasNotes = notes.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar onSearch={handleSearch} onCreateNote={handleCreateNote} />

      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-text text-2xl font-bold tracking-tight">
              {isSearching
                ? <>Results for <span className="text-accent">"{searchQuery}"</span></>
                : <>Good {greeting}, {user?.fullName?.split(" ")[0]}</>
              }
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {isLoading
                ? "Loading..."
                : isSearching
                  ? `${notes.length} note${notes.length !== 1 ? "s" : ""} found`
                  : `${notes.length} note${notes.length !== 1 ? "s" : ""} — ${pinnedNotes.length} pinned`
              }
            </p>
          </div>

          {hasNotes && !isSearching && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg">
                <Pin size={13} className="text-accent" fill="currentColor" />
                <span className="font-medium text-text">{pinnedNotes.length}</span>
                <span>pinned</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg">
                <span className="font-medium text-text">{unpinnedNotes.length}</span>
                <span>unpinned</span>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={fetchNotes} />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && !hasNotes && (
          <EmptyState isSearch={isSearching} query={searchQuery} onCreateNote={handleCreateNote} />
        )}

        {/* Notes */}
        {!isLoading && !error && hasNotes && (
          <div className="space-y-10">
            {pinnedNotes.length > 0 && !isSearching && (
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <Pin size={13} className="text-accent" fill="currentColor" />
                  <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Pinned</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-text-tertiary text-2xs">{pinnedNotes.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note._id} note={note} onEdit={handleEditNote} onDelete={handleDeleteClick} onPinToggle={togglePin} />
                  ))}
                </div>
              </section>
            )}

            {(unpinnedNotes.length > 0 || isSearching) && (
              <section>
                {pinnedNotes.length > 0 && !isSearching && (
                  <div className="flex items-center gap-2.5 mb-4">
                    <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">All notes</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-text-tertiary text-2xs">{unpinnedNotes.length}</span>
                  </div>
                )}

                {unpinnedNotes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(isSearching ? notes : unpinnedNotes).map((note) => (
                      <NoteCard key={note._id} note={note} onEdit={handleEditNote} onDelete={handleDeleteClick} onPinToggle={togglePin} />
                    ))}
                  </div>
                ) : (
                  !isSearching && <p className="text-text-tertiary text-sm text-center py-12">All notes are pinned above.</p>
                )}
              </section>
            )}
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        onSave={handleModalSave}
        editNote={editingNote}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        noteTitle={deletingNote?.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
