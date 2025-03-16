import React from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="mb-3">Welcome</h2>
                <p className="text-muted">Log in to continue</p>
              </div>

              <button
                className="btn btn-light w-100 mb-3 py-2 d-flex align-items-center justify-content-center"
                onClick={handleGoogleLogin}
              >
                <i className="bi bi-google me-2"></i>
                <span>Log in with Google account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
