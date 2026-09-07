function AIAnalysis({ analysis, onApprove, onModify }) {

  if (!analysis) {
    return null;
  }

  const confidence = Math.round(
    Number(analysis.confidence) * 100
  );

  return (
    <div
      className="card shadow-sm mb-4"
      style={{
        border: "2px solid #0d6efd",
        borderRadius: "12px"
      }}
    >

      <div className="card-body">

        {/* HEADER */}

        <h4 className="fw-bold mb-3">
          🤖 AI Issue Analysis
        </h4>


        {/* AI RESULTS */}

        <div className="row g-3">

          <div className="col-md-6">
            <div className="p-3 border rounded">
              <small className="text-muted">
                Category
              </small>

              <div className="fw-bold mt-1">
                {analysis.category}
              </div>
            </div>
          </div>


          <div className="col-md-6">
            <div className="p-3 border rounded">
              <small className="text-muted">
                Severity
              </small>

              <div className="fw-bold mt-1">
                {analysis.severity}
              </div>
            </div>
          </div>


          <div className="col-md-6">
            <div className="p-3 border rounded">
              <small className="text-muted">
                Department
              </small>

              <div className="fw-bold mt-1">
                {analysis.department}
              </div>
            </div>
          </div>


          <div className="col-md-6">
            <div className="p-3 border rounded">
              <small className="text-muted">
                Urgency
              </small>

              <div className="fw-bold mt-1">
                {analysis.urgency}
              </div>
            </div>
          </div>


          <div className="col-md-6">
            <div className="p-3 border rounded">
              <small className="text-muted">
                Confidence
              </small>

              <div className="fw-bold mt-1">
                {confidence}%
              </div>
            </div>
          </div>

        </div>


        {/* SUMMARY */}

        <div className="mt-4">

          <h5 className="fw-bold">
            AI Summary
          </h5>

          <p className="text-muted">
            {analysis.summary}
          </p>

        </div>


        {/* SUGGESTED RESOLUTION */}

        <div className="mt-3">

          <h5 className="fw-bold">
            Suggested Resolution
          </h5>

          <p className="text-muted">
            {analysis.suggested_resolution}
          </p>

        </div>


        {/* ACTION BUTTONS */}

        <div className="mt-4 d-flex gap-2">

          <button
            type="button"
            className="btn btn-success"
            onClick={onApprove}
          >
            ✓ Approve
          </button>


          <button
            type="button"
            className="btn btn-warning"
            onClick={onModify}
          >
            ✎ Modify
          </button>

        </div>

      </div>

    </div>
  );
}


// IMPORTANT:
// ReportIssue.jsx imports this component
// as a default import.

export default AIAnalysis;