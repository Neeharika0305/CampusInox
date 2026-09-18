import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/issues/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load issue."
          );
          return;
        }

        setIssue(data);

      } catch (err) {
        console.error(err);
        setError(
          "Cannot connect to the CampusInox backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h4>Loading issue...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Issue not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">

      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate("/my-issues")}
      >
        ← Back to My Issues
      </button>

      <div className="card shadow">

        <div className="card-body p-4">

          <h2 className="fw-bold mb-3">
            📋 Issue #{issue.id}
          </h2>

          <h4 className="fw-bold">
            {issue.title}
          </h4>

          <hr />

          <p>
            <strong>Description:</strong>
          </p>

          <p className="text-muted">
            {issue.description}
          </p>

          <div className="row mt-4">

            <div className="col-md-6 mb-3">
              <strong>Category</strong>
              <p>{issue.category || "Not specified"}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Location</strong>
              <p>📍 {issue.location}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Severity</strong>
              <p>{issue.severity || "Not specified"}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Status</strong>
              <p>
                <span className="badge bg-primary">
                  {issue.status}
                </span>
              </p>
            </div>

          </div>

          {issue.image_url && (
            <div className="mt-4">

              <h5 className="fw-bold">
                📷 Evidence Image
              </h5>

              <img
                src={`${import.meta.env.VITE_API_URL}${issue.image_url}`}
                alt="Issue evidence"
                className="img-fluid rounded border mt-2"
                style={{
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default IssueDetails;