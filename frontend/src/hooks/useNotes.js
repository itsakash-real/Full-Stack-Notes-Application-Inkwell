import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── FETCH ALL NOTES ──────────────────────────────────────────
  // useCallback prevents this function from being re-created
  // on every render — important for useEffect dependency arrays
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/notes");
      setNotes(res.data.notes);
    } catch (error) {
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch notes when hook is first used
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ── CREATE NOTE ───────────────────────────────────────────────
  const createNote = async (noteData) => {
    try {
      setIsSaving(true);
      const res = await axiosInstance.post("/notes", noteData);
      // Add new note to the TOP of our local state
      // No need to re-fetch everything — optimistic update
      setNotes((prev) => [res.data.note, ...prev]);
      toast.success("Note created!");
      return true; // Signal success to the component
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ── UPDATE NOTE ───────────────────────────────────────────────
  const updateNote = async (id, noteData) => {
    try {
      setIsSaving(true);
      const res = await axiosInstance.put(`/notes/${id}`, noteData);
      // Update just the changed note in local state
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? res.data.note : n))
      );
      toast.success("Note saved!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update note");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ── DELETE NOTE ───────────────────────────────────────────────
  const deleteNote = async (id) => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/notes/${id}`);
      // Remove note from local state immediately
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
      return true;
    } catch (error) {
      toast.error("Failed to delete note");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // ── TOGGLE PIN ────────────────────────────────────────────────
  const togglePin = async (id, currentPinState) => {
    try {
      const res = await axiosInstance.put(`/notes/${id}/pin`);
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? res.data.note : n))
      );
      toast.success(
        res.data.note.isPinned ? "Note pinned!" : "Note unpinned"
      );
    } catch (error) {
      toast.error("Failed to update pin");
    }
  };

  // ── SEARCH NOTES ──────────────────────────────────────────────
  const searchNotes = async (query) => {
    if (!query.trim()) {
      fetchNotes(); // Reset to all notes
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/notes/search?q=${encodeURIComponent(query)}`);
      setNotes(res.data.notes);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Derived state — split notes into pinned and unpinned
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return {
    notes,
    pinnedNotes,
    unpinnedNotes,
    isLoading,
    isSaving,
    isDeleting,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
  };
};

export default useNotes;