import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ReportIssue from "./pages/ReportIssue";
import MyIssues from "./pages/MyIssues";
import IssueStatus from "./pages/IssueStatus";
import IssueDetails from "./pages/IssueDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CampusIntelligence from "./pages/CampusIntelligence";


function Home() {
  const navigate = useNavigate();

  return (
    <div className="campus-home">

      {/* Background decoration */}
      <div className="home-orb home-orb-one"></div>
      <div className="home-orb home-orb-two"></div>

      {/* NAVBAR */}
      <nav className="home-navbar">

        <div className="brand">
          <div className="brand-mark">
            C
          </div>

          <div>
            <div className="brand-name">
              CAMPUSINOX
            </div>

            <div className="brand-subtitle">
              Smart Campus Intelligence
            </div>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className="nav-login"
            onClick={() => navigate("/login/student")}
          >
            Student Login
          </button>

          <button
            className="nav-admin"
            onClick={() => navigate("/login/admin")}
          >
            Admin Portal
          </button>
        </div>

      </nav>


      {/* HERO */}
      <main className="home-main">

        <section className="hero-section">

          {/* LEFT */}
          <div className="hero-content">

            <div className="hero-badge">
              <span className="status-dot"></span>
              Intelligent Campus Management
            </div>

            <h1>
              Turn Campus Issues
              <span> Into Intelligent Solutions.</span>
            </h1>

            <p className="hero-description">
              CampusInox helps students report campus problems,
              track resolutions, and gives administrators intelligent
              insights to resolve issues faster.
            </p>


            {/* CTA */}
            <div className="hero-actions">

              <button
                className="primary-cta"
                onClick={() => navigate("/login/student")}
              >
                <span>👩‍🎓</span>
                Student Portal
                <span className="arrow">→</span>
              </button>

              <button
                className="secondary-cta"
                onClick={() => navigate("/login/admin")}
              >
                <span>🛡️</span>
                Admin Portal
                <span className="arrow">→</span>
              </button>

            </div>


            {/* QUICK TRUST */}
            <div className="hero-trust">

              <div className="trust-item">
                <strong>AI</strong>
                <span>Powered Analysis</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>24/7</strong>
                <span>Issue Tracking</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>Smart</strong>
                <span>Campus Insights</span>
              </div>

            </div>

          </div>


          {/* RIGHT VISUAL */}
          <div className="hero-visual">

            <div className="dashboard-preview">

              {/* Preview Header */}
              <div className="preview-header">

                <div className="preview-brand">
                  <div className="mini-logo">
                    C
                  </div>

                  <div>
                    <strong>Campus Intelligence</strong>
                    <small>Live overview</small>
                  </div>
                </div>

                <div className="live-status">
                  <span></span>
                  Live
                </div>

              </div>


              {/* Main metric */}
              <div className="main-metric">

                <div>
                  <small>Total Campus Issues</small>

                  <div className="metric-number">
                    128
                  </div>

                  <div className="metric-change">
                    ↑ 12.4% this month
                  </div>
                </div>

                <div className="metric-icon">
                  📊
                </div>

              </div>


              {/* Mini Cards */}
              <div className="preview-grid">

                <div className="mini-card">

                  <div className="mini-card-top">
                    <span>Resolved</span>
                    <span className="green-icon">✓</span>
                  </div>

                  <strong>91</strong>

                  <div className="progress">
                    <div
                      className="progress-fill progress-green"
                      style={{ width: "71%" }}
                    ></div>
                  </div>

                  <small>71.1% resolution rate</small>

                </div>


                <div className="mini-card">

                  <div className="mini-card-top">
                    <span>Critical</span>
                    <span className="red-icon">!</span>
                  </div>

                  <strong>13</strong>

                  <div className="progress">
                    <div
                      className="progress-fill progress-red"
                      style={{ width: "42%" }}
                    ></div>
                  </div>

                  <small>Requires attention</small>

                </div>

              </div>


              {/* AI Insight */}
              <div className="ai-insight">

                <div className="ai-icon">
                  ✦
                </div>

                <div>
                  <strong>AI Insight</strong>

                  <p>
                    Block B WiFi issues show a
                    <b> 91% similarity</b> pattern.
                  </p>
                </div>

                <span className="insight-arrow">
                  →
                </span>

              </div>


              {/* Bottom activity */}
              <div className="activity-row">

                <div className="activity-label">
                  Recent activity
                </div>

                <div className="activity-bars">

                  <span style={{ height: "35%" }}></span>
                  <span style={{ height: "60%" }}></span>
                  <span style={{ height: "45%" }}></span>
                  <span style={{ height: "80%" }}></span>
                  <span style={{ height: "65%" }}></span>
                  <span style={{ height: "92%" }}></span>
                  <span style={{ height: "72%" }}></span>

                </div>

              </div>

            </div>


            {/* Floating cards */}

            <div className="floating-card floating-card-one">
              <div className="floating-icon">
                ✓
              </div>

              <div>
                <strong>Issue Resolved</strong>
                <small>Network • Block B</small>
              </div>
            </div>


            <div className="floating-card floating-card-two">

              <div className="floating-ai">
                ✦
              </div>

              <div>
                <strong>AI Analysis</strong>
                <small>98% confidence</small>
              </div>

            </div>

          </div>

        </section>


        {/* FEATURES */}
        <section className="features-section">

          <div className="section-heading">
            <span>WHY CAMPUSINOX</span>

            <h2>
              One platform for a smarter campus
            </h2>

            <p>
              From reporting an issue to understanding campus-wide
              patterns, everything works together.
            </p>
          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-number">
                01
              </div>

              <div className="feature-icon blue">
                📝
              </div>

              <h3>
                Smart Issue Reporting
              </h3>

              <p>
                Students can report problems with structured
                categories, descriptions, and supporting details.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                02
              </div>

              <div className="feature-icon purple">
                ✦
              </div>

              <h3>
                AI-Powered Intelligence
              </h3>

              <p>
                Identify patterns, categories, priority levels,
                and potential duplicate issues automatically.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                03
              </div>

              <div className="feature-icon green">
                📈
              </div>

              <h3>
                Actionable Analytics
              </h3>

              <p>
                Administrators get meaningful insights into issue
                trends, resolution performance, and campus hotspots.
              </p>

            </div>

          </div>

        </section>


        {/* REGISTER CTA */}
        <section className="bottom-cta">

          <div>
            <span className="cta-label">
              GET STARTED
            </span>

            <h2>
              Make your campus better,
              <br />
              one issue at a time.
            </h2>

            <p>
              Join CampusInox and bring intelligent issue
              management to your campus.
            </p>
          </div>

          <button
            onClick={() => navigate("/register")}
            className="bottom-cta-button"
          >
            Create Account
            <span>→</span>
          </button>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="home-footer">

        <div>
          © 2026 CampusInox
        </div>

        <div>
          Smart Campus Issue Intelligence & Resolution Platform
        </div>

        <div>
          Built for a better campus.
        </div>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/login/student"
          element={<Login role="STUDENT" />}
        />

        <Route
          path="/login/admin"
          element={<Login role="ADMIN" />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* STUDENT */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/report-issue"
          element={<ReportIssue />}
        />

        <Route
          path="/my-issues"
          element={<MyIssues />}
        />

        <Route
          path="/issue-status"
          element={<IssueStatus />}
        />

        <Route
          path="/issue/:id"
          element={<IssueDetails />}
        />


        {/* ADMIN */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />


        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={<AnalyticsDashboard />}
        />


        {/* CAMPUS INTELLIGENCE */}

        <Route
          path="/campus-intelligence"
          element={<CampusIntelligence />}
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;