import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";


function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {

      const data = await registerUser({
        name,
        email,
        password,
        role,
      });


      setMessage(
        data.message ||
        "Registration successful!"
      );

      setSuccess(true);

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Registration failed"
      );

      setSuccess(false);

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
          maxWidth: "500px",
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

            <p className="text-muted">
              Create your CampusInox account
            </p>

          </div>


          {/* ROLE SELECTION */}

          <h5 className="fw-bold mb-3">
            Choose account type
          </h5>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "25px",
            }}
          >

            {/* STUDENT */}

            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              style={{
                padding: "18px 10px",
                borderRadius: "14px",
                border:
                  role === "STUDENT"
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background:
                  role === "STUDENT"
                    ? "#eff6ff"
                    : "#ffffff",
                cursor: "pointer",
              }}
            >

              <div style={{ fontSize: "30px" }}>
                👩‍🎓
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontWeight: "700",
                  color:
                    role === "STUDENT"
                      ? "#1d4ed8"
                      : "#475569",
                }}
              >
                Student
              </div>

            </button>


            {/* ADMIN */}

            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              style={{
                padding: "18px 10px",
                borderRadius: "14px",
                border:
                  role === "ADMIN"
                    ? "2px solid #7c3aed"
                    : "2px solid #e2e8f0",
                background:
                  role === "ADMIN"
                    ? "#f5f3ff"
                    : "#ffffff",
                cursor: "pointer",
              }}
            >

              <div style={{ fontSize: "30px" }}>
                🛡️
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontWeight: "700",
                  color:
                    role === "ADMIN"
                      ? "#6d28d9"
                      : "#475569",
                }}
              >
                Admin
              </div>

            </button>

          </div>


          {/* FORM */}

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Full Name
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                required
              />

            </div>


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
                placeholder="Create a password"
                required
                minLength={6}
              />

            </div>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="btn btn-lg w-100"
              disabled={loading}
              style={{
                background:
                  role === "ADMIN"
                    ? "#7c3aed"
                    : "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
              }}
            >
              {loading
                ? "Creating account..."
                : `Register as ${
                    role === "ADMIN"
                      ? "Admin"
                      : "Student"
                  }`}
            </button>

          </form>


          {/* MESSAGE */}

          {message && (
            <div
              className={`alert ${
                success
                  ? "alert-success"
                  : "alert-danger"
              } mt-3`}
            >
              {message}
            </div>
          )}


          {/* LOGIN */}

          <div className="text-center mt-4">

            <p className="text-muted mb-2">
              Already have an account?
            </p>

            <Link
              to={
                role === "ADMIN"
                  ? "/login/admin"
                  : "/login/student"
              }
              style={{
                color: "#2563eb",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Login as{" "}
              {role === "ADMIN"
                ? "Admin"
                : "Student"}
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


export default Register;