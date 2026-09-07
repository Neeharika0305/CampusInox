import { useEffect, useState } from "react";

function IssueStatus() {

  const [status, setStatus] = useState({
    reported: 0,
    in_progress: 0,
    resolved: 0,
    total: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchStatus = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      try {

        const response = await fetch(
          "http://localhost:5000/api/issues/status",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load status.");
          return;
        }

        setStatus(data);

      } catch (err) {

        setError(
          "Cannot connect to the CampusInox backend."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchStatus();

  }, []);


  return (
    <div className="container mt-5">

      <h2 className="fw-bold">
        📊 Issue Status
      </h2>

      <p className="text-muted">
        Track the status of your reported issues
      </p>


      {loading && (
        <div className="alert alert-info mt-4">
          Loading status...
        </div>
      )}


      {error && (
        <div className="alert alert-danger mt-4">
          {error}
        </div>
      )}


      {!loading && !error && (

        <div className="row mt-4">

          {/* Reported */}

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm text-center">

              <div className="card-body">

                <h1 className="fw-bold">
                  {status.reported}
                </h1>

                <h5>
                  Reported
                </h5>

                <p className="text-muted mb-0">
                  Issues submitted
                </p>

              </div>

            </div>

          </div>


          {/* In Progress */}

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm text-center">

              <div className="card-body">

                <h1 className="fw-bold">
                  {status.in_progress}
                </h1>

                <h5>
                  In Progress
                </h5>

                <p className="text-muted mb-0">
                  Issues being resolved
                </p>

              </div>

            </div>

          </div>


          {/* Resolved */}

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm text-center">

              <div className="card-body">

                <h1 className="fw-bold">
                  {status.resolved}
                </h1>

                <h5>
                  Resolved
                </h5>

                <p className="text-muted mb-0">
                  Issues completed
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default IssueStatus;