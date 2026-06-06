import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import * as notesApi from "../../api/notes";

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await notesApi.fetchNotes();
      setNotes(res.data.notes);
    } catch (err) {
      setError("Failed to load notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async (data) => {
    try {
      setIsSaving(true);
      const res = await notesApi.createNote(data);
      setNotes((prev) => [res.data.note, ...prev]);
      toast.success("Note created");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create note");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateNote = useCallback(async (id, data) => {
    try {
      setIsSaving(true);
      const res = await notesApi.updateNote(id, data);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data.note : n)));
      toast.success("Note saved");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      setIsDeleting(true);
      await notesApi.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
      return true;
    } catch (err) {
      toast.error("Failed to delete note");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const togglePin = useCallback(async (id) => {
    try {
      const res = await notesApi.togglePin(id);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data.note : n)));
      toast.success(res.data.note.isPinned ? "Pinned" : "Unpinned");
    } catch (err) {
      toast.error("Failed to toggle pin");
    }
  }, []);

  const searchNotes = useCallback(async (query) => {
    if (!query.trim()) {
      fetchNotes();
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await notesApi.searchNotes(query);
      setNotes(res.data.notes);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotes]);

  const pinnedNotes = useMemo(() => notes.filter((n) => n.isPinned), [notes]);
  const unpinnedNotes = useMemo(() => notes.filter((n) => !n.isPinned), [notes]);

  return {
    notes, pinnedNotes, unpinnedNotes,
    isLoading, isSaving, isDeleting, error,
    fetchNotes, createNote, updateNote, deleteNote, togglePin, searchNotes,
  };
};

export default useNotes;
