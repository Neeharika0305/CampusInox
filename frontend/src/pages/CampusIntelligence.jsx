import { useState } from "react";
import Layout from "../components/Layout";

const buildings = [
  {
    name: "Block A",
    type: "Academic Block",
    x: "18%",
    y: "18%",
    status: "critical",
    issues: {
      Network: 18,
      Electricity: 7,
      Hostel: 4,
    },
  },
  {
    name: "Block B",
    type: "Academic Block",
    x: "58%",
    y: "30%",
    status: "warning",
    issues: {
      Network: 8,
      Electricity: 5,
      Hostel: 2,
    },
  },
  {
    name: "Library",
    type: "Library",
    x: "38%",
    y: "53%",
    status: "normal",
    issues: {
      Network: 4,
      Electricity: 2,
      Hostel: 0,
    },
  },
  {
    name: "Labs",
    type: "Computer Labs",
    x: "68%",
    y: "62%",
    status: "critical",
    issues: {
      Network: 12,
      Electricity: 8,
      Hostel: 1,
    },
  },
  {
    name: "Hostel",
    type: "Student Hostel",
    x: "22%",
    y: "73%",
    status: "normal",
    issues: {
      Network: 6,
      Electricity: 3,
      Hostel: 9,
    },
  },
];

function CampusIntelligence() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <Layout>
      <div className="container-fluid py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">
              Campus Intelligence
            </h1>

            <p className="text-muted mb-0">
              Visual overview of campus issues and hotspots
            </p>
          </div>

          <div className="badge bg-dark px-3 py-2">
            LIVE CAMPUS MAP
          </div>
        </div>

        {/* SUMMARY */}
        <div className="row g-3 mb-4">

          <SummaryCard
            title="Campus Buildings"
            value="5"
            icon="🏫"
          />

          <SummaryCard
            title="Critical Zones"
            value="2"
            icon="🔴"
          />

          <SummaryCard
            title="Warning Zones"
            value="1"
            icon="🟡"
          />

          <SummaryCard
            title="Active Issues"
            value="128"
            icon="📊"
          />

        </div>

        {/* MAP */}
        <div className="card shadow-sm border-0">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <div>
                <h4 className="fw-bold mb-1">
                  Campus Map
                </h4>

                <small className="text-muted">
                  Click a building to view issue intelligence
                </small>
              </div>

              <div className="d-flex gap-3 small">

                <span>
                  🔴 Critical
                </span>

                <span>
                  🟡 Warning
                </span>

                <span>
                  🟢 Normal
                </span>

              </div>

            </div>

            <div
              className="position-relative border rounded-4"
              style={{
                height: "min(500px, 65vh)",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #f8fafc, #eef2f7)",
              }}
            >

              {/* ROAD LINES */}

              <div
                className="position-absolute"
                style={{
                  left: "10%",
                  right: "10%",
                  top: "47%",
                  borderTop: "4px dashed #cbd5e1",
                }}
              />

              <div
                className="position-absolute"
                style={{
                  top: "10%",
                  bottom: "10%",
                  left: "50%",
                  borderLeft: "4px dashed #cbd5e1",
                }}
              />

              {/* BUILDINGS */}

              {buildings.map((building) => (

                <button
                  key={building.name}
                  onClick={() => setSelectedBuilding(building)}
                  className="position-absolute border-0"
                  style={{
                    left: building.x,
                    top: building.y,
                    transform: "translate(-50%, -50%)",
                    width: "140px",
                    padding: "18px 10px",
                    borderRadius: "16px",
                    background: "#ffffff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translate(-50%, -50%) scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translate(-50%, -50%) scale(1)";
                  }}
                >

                  <div style={{ fontSize: "30px" }}>
                    {building.status === "critical"
                      ? "🔴"
                      : building.status === "warning"
                      ? "🟡"
                      : "🟢"}
                  </div>

                  <div className="fw-bold mt-2">
                    {building.name}
                  </div>

                  <small className="text-muted">
                    {building.type}
                  </small>

                </button>

              ))}

            </div>

          </div>

        </div>

        {/* MODAL */}

        {selectedBuilding && (

          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: "rgba(0,0,0,0.55)",
              zIndex: 1050,
            }}
            onClick={() => setSelectedBuilding(null)}
          >

            <div
              className="card shadow-lg border-0"
              style={{
                width: "420px",
                borderRadius: "20px",
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-start">

                  <div>
                    <h3 className="fw-bold mb-1">
                      {selectedBuilding.name}
                    </h3>

                    <p className="text-muted mb-0">
                      {selectedBuilding.type}
                    </p>
                  </div>

                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() => setSelectedBuilding(null)}
                  >
                    ✕
                  </button>

                </div>

                <hr />

                <h5 className="fw-bold mb-3">
                  Issue Breakdown
                </h5>

                <IssueRow
                  name="Network"
                  value={selectedBuilding.issues.Network}
                />

                <IssueRow
                  name="Electricity"
                  value={selectedBuilding.issues.Electricity}
                />

                <IssueRow
                  name="Hostel"
                  value={selectedBuilding.issues.Hostel}
                />

                <div className="mt-4">

                  <div className="alert alert-light border mb-0">
                    <strong>Status:</strong>{" "}
                    {selectedBuilding.status === "critical"
                      ? "Critical attention required"
                      : selectedBuilding.status === "warning"
                      ? "Needs monitoring"
                      : "Operating normally"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </Layout>
  );
}


function SummaryCard({ title, value, icon }) {

  return (
    <div className="col-md-6 col-lg-3">

      <div className="card border-0 shadow-sm h-100">

        <div className="card-body">

          <div className="d-flex justify-content-between">

            <div>
              <p className="text-muted mb-1">
                {title}
              </p>

              <h2 className="fw-bold mb-0">
                {value}
              </h2>
            </div>

            <div style={{ fontSize: "30px" }}>
              {icon}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


function IssueRow({ name, value }) {

  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3">

      <span className="fw-semibold">
        {name}
      </span>

      <span className="badge bg-dark rounded-pill px-3">
        {value}
      </span>

    </div>
  );
}


export default CampusIntelligence;