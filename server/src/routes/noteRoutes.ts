import express, { Request, Response, Router } from "express";
import Note from "../models/Note";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

// Tip za Request koji uključuje korisnika
interface AuthRequest extends Request {
  user?: any;
}

// GET bilješke trenutnog korisnika
router.get("/", isAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET bilješku po ID-u (provjerava i vlasništvo)
router.get(
  "/get/:id",
  isAuthenticated,
  async (req: AuthRequest, res: Response) => {
    try {
      const note = await Note.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// CREATE bilješka za trenutnog korisnika
router.post(
  "/new",
  isAuthenticated,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, content, color } = req.body;
      if (!title || !content) {
        res.status(400).json({ message: "Title and content are required" });
        return;
      }

      const newNote = new Note({
        title,
        content,
        color,
        user: req.user._id,
      });

      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// UPDATE bilješka (provjerava vlasništvo)
router.put("/:id", isAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, color } = req.body;

    // Prvo provjerimo pripada li bilješka ovom korisniku
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      res.status(404).json({ message: "Note not found or not authorized" });
      return;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, color },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE bilješka (provjerava vlasništvo)
router.delete(
  "/:id",
  isAuthenticated,
  async (req: AuthRequest, res: Response) => {
    try {
      // Prvo provjerimo pripada li bilješka ovom korisniku
      const note = await Note.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!note) {
        res.status(404).json({ message: "Note not found or not authorized" });
        return;
      }

      const deletedNote = await Note.findByIdAndDelete(req.params.id);
      res.json(deletedNote);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
