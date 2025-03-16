import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getNote, deleteNote, updateNote, Note } from "../services/api";

const NoteDetail: React.FC = () => {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState<string | undefined>(undefined);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const AVAILABLE_COLORS = [
    { id: "none", name: "No Color", value: "#FFFFFF" },
    { id: "lightblue", name: "Light Blue", value: "#e3f2fd" },
    { id: "lightred", name: "Light Red", value: "#ffebee" },
    { id: "lightyellow", name: "Light Yellow", value: "#fffde7" },
    { id: "lightgreen", name: "Light Green", value: "#e8f5e9" },
  ];

  useEffect(() => {
    if (note) {
      setColor(note.color);
    }
  }, [note]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const data = await getNote(id!);
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
        setError(null);
      } catch (err) {
        setError("Failed to fetch note");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSave = async () => {
    // Validate that title and content are not empty
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      await updateNote(id!, {
        title,
        content,
        color,
      });
      navigate("/notes/");
    } catch (err) {
      setError("Failed to save note");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id!);
        navigate("/notes/");
      } catch (err) {
        setError("Failed to delete note");
        console.error(err);
      }
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (!note)
    return (
      <div className="alert alert-warning" role="alert">
        Note not found
      </div>
    );

  return (
    <div className="shadow-sm p-4 border rounded">
      {error && (
        <div
          className="alert alert-secondary"
          role="alert"
          style={note.color ? { backgroundColor: note.color } : {}}
        >
          {error}
        </div>
      )}

      <div
        className="card-header bg-transparent border-bottom pb-3 mb-3"
        style={note.color ? { backgroundColor: note.color } : {}}
      >
        <input
          type="text"
          className="form-control form-control-lg border-0 p-0fw-bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
      </div>

      <div className="card-body p-0">
        <textarea
          className="form-control border-0 p-0 bg-transparent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content"
          rows={10}
          style={{
            resize: "none",
          }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Color</label>
        <div className="d-flex flex-wrap">
          {AVAILABLE_COLORS.map((colorOption) => (
            <div
              key={colorOption.id}
              className={`rounded-circle me-2 ${
                color === colorOption.value ? "border border-2 border-dark" : ""
              }`}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: colorOption.value,
                cursor: "pointer",
              }}
              onClick={() => setColor(colorOption.value)}
            />
          ))}
        </div>
      </div>

      <div className="card-footer bg-transparent text-muted mt-4 pt-3 border-top">
        <p className="mb-1">
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>
        <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button
          onClick={handleSave}
          className="btn btn-success"
          disabled={saving}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>

        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteDetail;
