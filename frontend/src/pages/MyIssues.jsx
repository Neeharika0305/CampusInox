import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/issues/my`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load issues.");
        return;
      }

      setIssues(data);

    } catch (err) {
      console.error(err);
      setError("Cannot connect to CampusInox backend.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "RESOLVED") {
      return "badge bg-success";
    }

    if (status === "IN_PROGRESS") {
      return "badge bg-warning text-dark";
    }

    return "badge bg-primary";
  };

  return (
    <div className="container mt-5">

      <h2 className="fw-bold">
        📋 My Issues
      </h2>

      <p className="text-muted">
        Issues reported by you
      </p>

      {loading && (
        <div className="alert alert-info">
          Loading your issues...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && issues.length === 0 && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <p className="text-muted mb-0">
              You have not reported any issues yet.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && issues.length > 0 && (
        <div className="mt-4">

          {issues.map((issue) => (
            <div
              className="card shadow-sm mb-3"
              key={issue.id}
            >

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <div>

                    <h5 className="fw-bold">
                      #{issue.id} — {issue.title}
                    </h5>

                    <p className="text-muted">
                      {issue.description}
                    </p>

                  </div>

                  <span className={getStatusClass(issue.status)}>
                    {issue.status}
                  </span>

                </div>

                <p className="mb-2">
                  📍 <strong>Location:</strong>{" "}
                  {issue.location}
                </p>

                {issue.category && (
                  <p className="mb-2">
                    <strong>Category:</strong>{" "}
                    {issue.category}
                  </p>
                )}

                {issue.severity && (
                  <p className="mb-3">
                    <strong>Severity:</strong>{" "}
                    {issue.severity}
                  </p>
                )}

                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate(`/issue/${issue.id}`)
                  }
                >
                  👁️ View Details
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyIssues;