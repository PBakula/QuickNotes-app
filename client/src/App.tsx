import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import NotesList from "./components/NotesList"; // Pretpostavljam da već imate ovu komponentu
import NoteForm from "./components/NoteForm"; // Pretpostavljam da već imate ovu komponentu
import NoteDetail from "./components/NoteDetail";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
// import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
        <div className="container py-4">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/notes/" element={<NotesList />} />
              <Route path="/notes/get/:id" element={<NoteDetail />} />
              <Route path="/notes/new" element={<NoteForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
