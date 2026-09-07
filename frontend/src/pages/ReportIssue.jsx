import { useState } from "react";
import AIAnalysis from "../components/AIAnalysis";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // AI STATE
  // ==============================

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // ==============================
  // DUPLICATE STATE
  // ==============================

  const [duplicates, setDuplicates] = useState([]);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateChecked, setDuplicateChecked] = useState(false);

  // ==============================
  // MASTER ISSUE
  // ==============================

  const [selectedMasterIssue, setSelectedMasterIssue] =
    useState(null);

  // ==============================
  // EXAMPLE PROMPTS
  // ==============================

  const useExample = (text) => {
    setDescription(text);
    setAiAnalysis(null);
    setDuplicates([]);
    setDuplicateChecked(false);
    setSelectedMasterIssue(null);
    setError("");
    setMessage("");
  };

  // ==============================
  // AI ANALYSIS + DUPLICATE CHECK
  // ==============================

  const analyzeIssue = async () => {
    setError("");
    setMessage("");

    if (!description.trim()) {
      setError(
        "Please describe your campus problem before asking CampusAI to analyze it."
      );
      return;
    }

    setLoadingAI(true);
    setCheckingDuplicate(true);

    setAiAnalysis(null);
    setDuplicates([]);
    setDuplicateChecked(false);
    setSelectedMasterIssue(null);

    try {
      // ==========================================
      // 1. AI ISSUE ANALYSIS
      // ==========================================

      const aiResponse = await fetch(
        "http://localhost:5000/api/ai/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description.trim(),
          }),
        }
      );

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(
          aiData.error || "AI analysis failed."
        );
      }

      setAiAnalysis(aiData);

      // ==========================================
      // 2. DUPLICATE CHECK
      // ==========================================

      const duplicateResponse = await fetch(
        "http://localhost:5000/api/ai/check-duplicate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description.trim(),
          }),
        }
      );

      const duplicateData =
        await duplicateResponse.json();

      if (!duplicateResponse.ok) {
        throw new Error(
          duplicateData.error ||
            "Duplicate detection failed."
        );
      }

      setDuplicates(
        duplicateData.possible_duplicates || []
      );

      setDuplicateChecked(true);

    } catch (error) {
      console.error(
        "AI / Duplicate detection error:",
        error
      );

      setError(
        error.message ||
          "AI analysis failed. Please make sure the backend is running."
      );
    } finally {
      setLoadingAI(false);
      setCheckingDuplicate(false);
    }
  };

  // ==============================
  // JOIN EXISTING ISSUE
  // ==============================

  const handleJoinExisting = (issue) => {
    setSelectedMasterIssue(issue);

    setMessage(
      `✓ Master Issue CI-${String(
        issue.issue_id
      ).padStart(4, "0")} selected. Submit the issue to join it.`
    );
  };

  // ==============================
  // CREATE NEW ISSUE
  // ==============================

  const handleCreateNew = () => {
    setSelectedMasterIssue(null);

    setMessage(
      "✓ You chose to create a new issue."
    );
  };

  // ==============================
  // SUBMIT ISSUE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !title.trim() ||
      !description.trim() ||
      !category ||
      !location.trim() ||
      !severity
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setError(
        "You are not logged in. Please login again."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "location",
        location.trim()
      );

      formData.append(
        "severity",
        severity
      );

      // ==============================
      // MASTER ISSUE DATA
      // ==============================

      if (selectedMasterIssue) {
        formData.append(
          "master_issue_id",
          selectedMasterIssue.issue_id
        );

        formData.append(
          "duplicate_similarity",
          selectedMasterIssue.similarity
        );
      }

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      // ==============================
      // SUBMIT TO BACKEND
      // ==============================

      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to report issue."
        );
        return;
      }

      // ==============================
      // SUCCESS MESSAGE
      // ==============================

      if (selectedMasterIssue) {
        setMessage(
          `✓ Issue submitted and linked to Master Issue CI-${String(
            selectedMasterIssue.issue_id
          ).padStart(4, "0")} 🎉`
        );
      } else {
        setMessage(
          "Issue reported successfully! 🎉 Issue #" +
            data.issue_id
        );
      }

      // ==============================
      // RESET FORM
      // ==============================

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setSeverity("MEDIUM");
      setImage(null);

      setAiAnalysis(null);

      setDuplicates([]);
      setDuplicateChecked(false);

      setSelectedMasterIssue(null);

      e.target.reset();

    } catch (error) {
      console.error(
        "Submit issue error:",
        error
      );

      setError(
        "Cannot connect to the CampusInox backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5 mb-5"
      style={{
        maxWidth: "1050px",
      }}
    >

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="mb-4">

        <div
          className="text-muted"
          style={{
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          STUDENT PORTAL
        </div>

        <h1
          className="fw-bold mb-2"
          style={{
            color: "#111827",
          }}
        >
          Report a Campus Issue
        </h1>

        <p className="text-muted mb-0">
          Describe your problem and let CampusInox AI
          help understand and prioritize it.
        </p>

      </div>


      {/* ========================================= */}
      {/* AI ASSISTANT CARD */}
      {/* ========================================= */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >

        <div
          className="card-body p-4"
          style={{
            background:
              "linear-gradient(135deg, #111827, #1f2937)",
            color: "#ffffff",
          }}
        >

          <div className="d-flex align-items-start">

            <div
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: "52px",
                height: "52px",
                minWidth: "52px",
                borderRadius: "14px",
                background:
                  "rgba(255,255,255,0.10)",
                fontSize: "25px",
              }}
            >
              🤖
            </div>

            <div>

              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#cbd5e1",
                  marginBottom: "4px",
                }}
              >
                CAMPUSINOX AI
              </div>

              <h3
                className="fw-bold mb-2"
                style={{
                  fontSize: "22px",
                }}
              >
                Smart Issue Analysis
              </h3>

              <p
                className="mb-0"
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              >
                Tell us what happened. CampusInox AI
                analyzes your complaint to identify the
                category, severity, impact, department,
                and priority.
              </p>

            </div>

          </div>


          {/* AI CAPABILITIES */}

          <div
            className="d-flex flex-wrap gap-2 mt-4"
          >

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                color: "#e5e7eb",
              }}
            >
              🧠 Issue Understanding
            </span>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                color: "#e5e7eb",
              }}
            >
              🎯 Severity Detection
            </span>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                color: "#e5e7eb",
              }}
            >
              🏢 Department Prediction
            </span>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                color: "#e5e7eb",
              }}
            >
              🔍 Duplicate Detection
            </span>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* MAIN FORM */}
      {/* ========================================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          {/* SUCCESS */}

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* TITLE */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                Issue Title
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Example: WiFi outage in Block B hostel"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="mb-3">

              <label className="form-label fw-bold">
                What happened?
              </label>

              <div
                className="text-muted mb-2"
                style={{
                  fontSize: "12px",
                }}
              >
                Describe the problem in your own words.
                You don't need to know the category or
                severity — CampusInox AI can help determine
                them.
              </div>


              <textarea
                className="form-control"
                rows="6"
                placeholder="Example: WiFi has completely stopped working in Block B hostel. More than 100 students are affected."
                value={description}
                onChange={(e) => {
                  setDescription(
                    e.target.value
                  );

                  setAiAnalysis(null);
                  setDuplicates([]);
                  setDuplicateChecked(false);
                  setSelectedMasterIssue(null);
                }}
                required
              />


              {/* CHARACTER INFO */}

              <div
                className="d-flex justify-content-between mt-2"
              >

                <small className="text-muted">
                  Be specific about what happened,
                  where it happened, and who is affected.
                </small>

                <small className="text-muted">
                  {description.length} characters
                </small>

              </div>


              {/* EXAMPLES */}

              <div className="mt-3">

                <small
                  className="fw-bold"
                  style={{
                    color: "#6b7280",
                  }}
                >
                  💡 Try an example:
                </small>

                <div
                  className="d-flex flex-wrap gap-2 mt-2"
                >

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      useExample(
                        "WiFi has completely stopped working in Block B hostel. More than 100 students are affected."
                      )
                    }
                  >
                    📶 Block B WiFi outage
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      useExample(
                        "There is water leakage near Room 204 in the hostel corridor and the floor is becoming slippery."
                      )
                    }
                  >
                    🚰 Water leakage
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      useExample(
                        "The lights in the computer lab are not working and students are having difficulty attending lab sessions."
                      )
                    }
                  >
                    ⚡ Electrical problem
                  </button>

                </div>

              </div>


              {/* AI BUTTON */}

              <div className="mt-4">

                <button
                  type="button"
                  className="btn btn-dark px-4 py-2"
                  onClick={analyzeIssue}
                  disabled={
                    !description.trim() ||
                    loadingAI
                  }
                >

                  {loadingAI
                    ? "🤖 CampusAI is analyzing..."
                    : "🤖 Analyze with CampusAI"}

                </button>

                <div
                  className="text-muted mt-2"
                  style={{
                    fontSize: "11px",
                  }}
                >
                  CampusAI will analyze your description
                  and check for similar existing campus issues.
                </div>

              </div>

            </div>


            {/* ===================================== */}
            {/* AI ANALYSIS */}
            {/* ===================================== */}

            <AIAnalysis
              analysis={aiAnalysis}
              onApprove={() => {
                setMessage(
                  "✓ AI recommendation approved. You can now submit the issue."
                );
              }}
              onModify={() => {
                setMessage(
                  "✎ You can modify the Category and Severity fields before submitting."
                );
              }}
            />


            {/* ===================================== */}
            {/* DUPLICATE CHECKING */}
            {/* ===================================== */}

            {checkingDuplicate && (
              <div className="alert alert-info mt-4">

                <strong>
                  🔍 CampusAI Duplicate Detection
                </strong>

                <div className="mt-1">
                  Checking whether another student has
                  already reported a similar problem...
                </div>

              </div>
            )}


            {/* ===================================== */}
            {/* POSSIBLE DUPLICATES */}
            {/* ===================================== */}

            {duplicateChecked &&
              duplicates.length > 0 && (

                <div
                  className="card border-warning mt-4"
                  style={{
                    borderRadius: "14px",
                  }}
                >

                  <div className="card-body">

                    <h4 className="fw-bold text-warning">
                      ⚠ POSSIBLE DUPLICATE
                    </h4>

                    <p className="text-muted">
                      CampusAI found an existing issue
                      that may describe the same campus
                      problem.
                    </p>


                    {duplicates.map(
                      (duplicate) => {

                        const percentage =
                          Math.round(
                            duplicate.similarity * 100
                          );

                        const isSelected =
                          selectedMasterIssue &&
                          selectedMasterIssue.issue_id ===
                            duplicate.issue_id;

                        return (

                          <div
                            key={
                              duplicate.issue_id
                            }
                            className="border rounded p-3 mb-3"
                          >

                            <div className="row">

                              <div className="col-md-8">

                                <h5 className="fw-bold">
                                  {duplicate.title}
                                </h5>

                                <p className="mb-1">
                                  <strong>
                                    Issue ID:
                                  </strong>{" "}
                                  CI-
                                  {String(
                                    duplicate.issue_id
                                  ).padStart(
                                    4,
                                    "0"
                                  )}
                                </p>

                                <p className="mb-1">
                                  <strong>
                                    Existing Issue:
                                  </strong>{" "}
                                  {duplicate.description}
                                </p>


                                {isSelected && (
                                  <div className="alert alert-success mt-3 mb-0">
                                    ✓ This issue is
                                    selected as the
                                    Master Issue.
                                  </div>
                                )}

                              </div>


                              <div className="col-md-4 text-md-end">

                                <div className="mb-3">

                                  <span className="badge bg-warning text-dark fs-6">
                                    Similarity:{" "}
                                    {percentage}%
                                  </span>

                                </div>


                                <button
                                  type="button"
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() =>
                                    handleJoinExisting(
                                      duplicate
                                    )
                                  }
                                >
                                  ✓ Join Existing Issue
                                </button>


                                <button
                                  type="button"
                                  className="btn btn-outline-secondary btn-sm mt-2"
                                  onClick={
                                    handleCreateNew
                                  }
                                >
                                  Create New Issue
                                </button>

                              </div>

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

              )}


            {/* ===================================== */}
            {/* NO DUPLICATE */}
            {/* ===================================== */}

            {duplicateChecked &&
              duplicates.length === 0 && (

                <div className="alert alert-success mt-4">

                  ✓ CampusAI found no similar existing
                  issues. You can create a new issue.

                </div>

              )}


            {/* ===================================== */}
            {/* MASTER ISSUE */}
            {/* ===================================== */}

            {selectedMasterIssue && (

              <div className="alert alert-success mt-4">

                <h5 className="fw-bold">
                  ✓ MASTER ISSUE SELECTED
                </h5>

                <p className="mb-1">
                  <strong>
                    Master Issue:
                  </strong>{" "}
                  CI-
                  {String(
                    selectedMasterIssue.issue_id
                  ).padStart(4, "0")}
                </p>

                <p className="mb-1">
                  <strong>
                    Title:
                  </strong>{" "}
                  {selectedMasterIssue.title}
                </p>

                <p className="mb-1">
                  <strong>
                    Similarity:
                  </strong>{" "}
                  {Math.round(
                    selectedMasterIssue.similarity *
                      100
                  )}
                  %
                </p>

                <p className="mb-0">
                  Submit this report to link it to
                  the selected Master Issue.
                </p>

              </div>

            )}


            {/* ===================================== */}
            {/* CATEGORY */}
            {/* ===================================== */}

            <div className="mb-3 mt-4">

              <label className="form-label fw-bold">
                Category
              </label>

              <select
                className="form-select"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select category
                </option>

                <option value="PLUMBING">
                  🚰 Plumbing
                </option>

                <option value="ELECTRICAL">
                  ⚡ Electrical
                </option>

                <option value="NETWORK_WIFI">
                  📶 Network / WiFi
                </option>

                <option value="CLEANLINESS">
                  🧹 Cleanliness
                </option>

                <option value="HOSTEL">
                  🏠 Hostel
                </option>

                <option value="INFRASTRUCTURE">
                  🏗️ Infrastructure
                </option>

                <option value="SECURITY">
                  🔐 Security
                </option>

                <option value="ACADEMIC">
                  📚 Academic
                </option>

                <option value="TRANSPORT">
                  🚌 Transport
                </option>

                <option value="FOOD_CAFETERIA">
                  🍽️ Food / Cafeteria
                </option>

              </select>

            </div>


            {/* ===================================== */}
            {/* LOCATION */}
            {/* ===================================== */}

            <div className="mb-3">

              <label className="form-label fw-bold">
                Location
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Example: Block B Hostel, Room 204"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* ===================================== */}
            {/* SEVERITY */}
            {/* ===================================== */}

            <div className="mb-3">

              <label className="form-label fw-bold">
                Severity
              </label>

              <select
                className="form-select"
                value={severity}
                onChange={(e) =>
                  setSeverity(
                    e.target.value
                  )
                }
                required
              >

                <option value="LOW">
                  🟢 Low
                </option>

                <option value="MEDIUM">
                  🟡 Medium
                </option>

                <option value="HIGH">
                  🟠 High
                </option>

                <option value="CRITICAL">
                  🔴 Critical
                </option>

              </select>

            </div>


            {/* ===================================== */}
            {/* IMAGE */}
            {/* ===================================== */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                📷 Evidence Image
              </label>

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {

                  const selectedFile =
                    e.target.files[0];

                  setImage(
                    selectedFile || null
                  );

                }}
              />

              <small className="text-muted">
                Optional — upload a photo of the campus
                issue.
              </small>

            </div>


            {/* ===================================== */}
            {/* SUBMIT */}
            {/* ===================================== */}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >

              {loading
                ? "Submitting..."
                : selectedMasterIssue
                ? "✓ Submit & Join Existing Issue"
                : "📢 Submit Issue"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ReportIssue;