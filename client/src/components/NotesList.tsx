import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotes, deleteNote, Note } from "../services/api";

const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const getUniqueColors = (notesData: Note[]) => {
    const colorSet = new Set<string>();

    notesData.forEach((note) => {
      if (note.color) {
        colorSet.add(note.color);
      }
    });

    return Array.from(colorSet);
  };
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
      setFilteredNotes(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (selectedColor === null) {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter((note) => note.color === selectedColor));
    }
  }, [selectedColor, notes]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        const updatedNotes = notes.filter((note) => note._id !== id);
        setNotes(updatedNotes);
        // Filtered notes will update automatically via useEffect
      } catch (err) {
        setError("Failed to delete note");
        console.error(err);
      }
    }
  };

  const handleColorFilter = (color: string | null) => {
    setSelectedColor(color);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );

  const uniqueColors = getUniqueColors(notes);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Color Filter */}

        <div className="d-flex align-items-center">
          <div className="d-flex gap-2">
            <button
              className={`btn ${
                selectedColor === null
                  ? "btn btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => handleColorFilter(null)}
            >
              All
            </button>
            {uniqueColors.map((color) => (
              <button
                key={color}
                className={`btn ${
                  selectedColor === color
                    ? "btn-outline-secondary"
                    : "btn-secondary"
                }`}
                style={{
                  backgroundColor: color,
                }}
                onClick={() => handleColorFilter(color)}
              >
                &nbsp;&nbsp;&nbsp;
              </button>
            ))}
          </div>
        </div>

        <Link to="/notes/new" className="btn btn-secondary">
          Add New Note
        </Link>
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-center py-5">
          {notes.length === 0
            ? "No notes yet. Create your first note!"
            : "No notes match the selected filter."}
        </p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredNotes.map((note) => (
            <div className="col" key={note._id}>
              <div className="card h-100">
                <Link
                  to={`/notes/get/${note._id}`}
                  className="card-body d-flex flex-column text-decoration-none text-dark"
                  style={note.color ? { backgroundColor: note.color } : {}}
                >
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.content.substring(0, 100)}</p>
                  <p className="card-text text-muted mt-auto">
                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
