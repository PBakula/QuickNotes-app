import axios from "axios";
import { User } from "../contexts/AuthContext";

const API_URL = process.env.API_URL;

// Konfiguracija za slanje kolačića sa zahtjevima
axios.defaults.withCredentials = true;

export interface Note {
  _id: string;
  title: string;
  content: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface NoteInput {
  title: string;
  content: string;
  color?: string;
}

// Autentikacijske metode
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/auth/current-user`);
    return response.data.user;
  } catch (error) {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Poziv na backend za logout
    await axios.get(`${API_URL}/auth/logout`);

    // Nakon uspješne odjave, preusmjeri korisnika na login stranicu
    window.location.href = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/login`;
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Metode za bilješke
export const getNotes = async (): Promise<Note[]> => {
  const response = await axios.get(`${API_URL}/notes/`);
  return response.data;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await axios.get(`${API_URL}/notes/get/${id}`);
  return response.data;
};

export const createNote = async (note: NoteInput): Promise<Note> => {
  const response = await axios.post(`${API_URL}/notes/new`, note);
  return response.data;
};

export const updateNote = async (
  id: string,
  note: NoteInput
): Promise<Note> => {
  const response = await axios.put(`${API_URL}/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete(`${API_URL}/notes/${id}`);
  return response.data;
};
