import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNote, createNote, updateNote, NoteInput } from "../services/api";

const AVAILABLE_COLORS = [
  { id: "lightblue", name: "Light Blue", value: "#e3f2fd" },
  { id: "lightred", name: "Light Red", value: "#ffebee" },
  { id: "lightyellow", name: "Light Yellow", value: "#fffde7" },
  { id: "lightgreen", name: "Light Green", value: "#e8f5e9" },
];

const NoteForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          setLoading(true);
          const note = await getNote(id);
          setTitle(note.title);
          setContent(note.content);
          setColor(note.color || undefined);
          setError(null);
        } catch (err) {
          setError("Failed to fetch note");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    const noteData: NoteInput = {
      title,
      content,
      color,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await updateNote(id, noteData);
      } else {
        await createNote(noteData);
      }
      navigate("/notes/");
    } catch (err) {
      setError(`Failed to ${isEditMode ? "update" : "create"} note`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Create New Note</h2>

      {error && (
        <div className="alert alert-secondary" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-bold">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label fw-bold">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content"
            rows={10}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="color" className="form-label fw-bold">
            Color (optional)
          </label>
          <div className="d-flex flex-wrap align-items-center">
            <div
              className={`rounded-circle me-2 ${
                !color ? "border border-2 border-dark" : ""
              }`}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
              onClick={() => setColor(undefined)}
              title="No color"
            ></div>
            {AVAILABLE_COLORS.map((colorOption) => (
              <div
                key={colorOption.id}
                className={`rounded-circle me-2 ${
                  color === colorOption.value
                    ? "border border-2 border-dark"
                    : ""
                }`}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: colorOption.value,
                  cursor: "pointer",
                }}
                onClick={() => setColor(colorOption.value)}
                title={colorOption.name}
              />
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/notes/")}
            className="btn btn-danger"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : isEditMode ? (
              "Update Note"
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
