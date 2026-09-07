import { useState } from "react";
import { loginUser } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      // ==========================================
      // SAVE JWT TOKEN
      // ==========================================

      localStorage.setItem("token", data.access_token);

      // Keep this too for compatibility with
      // older pages/components
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // ==========================================
      // SAVE USER ROLE
      // ==========================================

      localStorage.setItem("role", data.role);

      setMessage("Login successful!");

      // ==========================================
      // REDIRECT BASED ON ROLE
      // ==========================================

      if (data.role === "STUDENT") {
        window.location.href = "/student-dashboard";
        return;
      }

      if (data.role === "ADMIN") {
        window.location.href = "/admin-dashboard";
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
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body p-4">

              {/* CAMPUSINOX */}

              <h2 className="text-center fw-bold mb-2">
                CAMPUSINOX
              </h2>

              <p className="text-center text-muted mb-4">
                Smart Campus Issue Intelligence
              </p>

              <h4 className="text-center mb-4">
                Login
              </h4>


              {/* LOGIN FORM */}

              <form onSubmit={handleLogin}>

                {/* EMAIL */}

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>


                {/* PASSWORD */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                  />

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </button>

              </form>


              {/* MESSAGE */}

              {message && (
                <div className="alert alert-info mt-3">
                  {message}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;