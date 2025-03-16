import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../services/api";

const NavBar: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await checkAuth();
    navigate("/login");
  };

  const location = useLocation();
  const isDetailsPage =
    location.pathname.startsWith("/notes/get") ||
    location.pathname === "/notes/new";

  const isLoginPage = location.pathname.startsWith("/login");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <header className="pb-3 mb-4 border-bottom d-flex justify-content-between w-100 mt-3">
          {isDetailsPage ? (
            <Link
              to="/notes/"
              className="text-decoration-none d-flex align-items-center"
            >
              <h1
                className="arrow bi bi-arrow-left-square"
                style={{ color: "grey" }}
              ></h1>
            </Link>
          ) : isLoginPage ? (
            <h1 className="fw-bold text-secondary">Quick Notes</h1>
          ) : null}

          {user ? (
            <div className="d-flex align-items-center ms-auto">
              {user.profileImage && (
                <img
                  src={user.profileImage}
                  className="rounded-circle me-2"
                  width="30"
                  height="30"
                  alt={user.displayName}
                />
              )}
              <span className="me-3">{user.displayName}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLogout}
              >
                Odjava
              </button>
            </div>
          ) : (
            <Link to="/login"></Link>
          )}
        </header>
      </div>
    </nav>
  );
};

export default NavBar;
