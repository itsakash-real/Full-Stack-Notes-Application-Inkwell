import client from "./client";

export const fetchNotes = () => client.get("/notes");

export const createNote = (data) => client.post("/notes", data);

export const updateNote = (id, data) => client.put(`/notes/${id}`, data);

export const deleteNote = (id) => client.delete(`/notes/${id}`);

export const togglePin = (id) => client.put(`/notes/${id}/pin`);

export const searchNotes = (query) =>
  client.get(`/notes/search?q=${encodeURIComponent(query)}`);
