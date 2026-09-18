import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";


function Login({ role }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const selectedRole = role || "STUDENT";

  const isAdmin = selectedRole === "ADMIN";


  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });


      // ------------------------------------------
      // CHECK SELECTED ROLE
      // ------------------------------------------

      if (data.role !== selectedRole) {
        setMessage(
          `This account is registered as ${data.role}, not ${selectedRole}.`
        );

        setLoading(false);
        return;
      }


      // ------------------------------------------
      // SAVE JWT TOKEN
      // ------------------------------------------

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );


      // ------------------------------------------
      // SAVE ROLE
      // ------------------------------------------

      localStorage.setItem(
        "role",
        data.role
      );


      // ------------------------------------------
      // REDIRECT
      // ------------------------------------------

      if (data.role === "STUDENT") {
        navigate("/student-dashboard");
        return;
      }


      if (data.role === "ADMIN") {
        navigate("/admin-dashboard");
        return;
      }


      setMessage(
        "Login successful, but role is not recognized."
      );

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc, #eef2ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 15px",
      }}
    >

      <div
        className="card border-0"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "22px",
          boxShadow:
            "0 20px 60px rgba(15, 23, 42, 0.12)",
        }}
      >

        <div className="card-body p-4 p-md-5">

          {/* BRAND */}

          <div className="text-center mb-4">

            <h2
              className="fw-bold"
              style={{
                letterSpacing: "1.5px",
              }}
            >
              CAMPUSINOX
            </h2>

            <p
              className="text-muted mb-0"
              style={{
                fontSize: "14px",
              }}
            >
              Smart Campus Issue Intelligence
            </p>

          </div>


          {/* ROLE */}

          <div
            className="text-center mb-4"
            style={{
              background: isAdmin
                ? "#f5f3ff"
                : "#eff6ff",
              borderRadius: "14px",
              padding: "16px",
            }}
          >

            <div
              style={{
                fontSize: "32px",
                marginBottom: "5px",
              }}
            >
              {isAdmin ? "🛡️" : "👩‍🎓"}
            </div>

            <h4
              className="fw-bold mb-1"
              style={{
                color: isAdmin
                  ? "#6d28d9"
                  : "#1d4ed8",
              }}
            >
              {isAdmin
                ? "Admin Login"
                : "Student Login"}
            </h4>

            <small className="text-muted">
              Sign in to your CampusInox account
            </small>

          </div>


          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="btn w-100 btn-lg"
              disabled={loading}
              style={{
                background: isAdmin
                  ? "#7c3aed"
                  : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
              }}
            >
              {loading
                ? "Signing in..."
                : `Login as ${
                    isAdmin ? "Admin" : "Student"
                  }`}
            </button>

          </form>


          {/* MESSAGE */}

          {message && (
            <div
              className="alert alert-danger mt-3"
              role="alert"
            >
              {message}
            </div>
          )}


          {/* LINKS */}

          <div className="text-center mt-4">

            <p className="mb-2 text-muted">
              Don't have an account?
            </p>

            <Link
              to="/register"
              style={{
                color: "#2563eb",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Create an account
            </Link>

            <div className="mt-3">

              <Link
                to="/"
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                ← Back to CampusInox
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Login;