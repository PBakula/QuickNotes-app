import mongoose, { Document } from "mongoose";

export interface INote extends Document {
  _id: string;
  title: string;
  content: string;
  color?: string;
  user: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
