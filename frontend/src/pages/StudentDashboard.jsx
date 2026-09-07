import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="student-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="student-sidebar">

        <div className="brand-section">

          <div className="brand-logo">
            CI
          </div>

          <div>
            <h4>CAMPUSINOX</h4>
            <span>Smart Campus</span>
          </div>

        </div>


        <div className="sidebar-label">
          MAIN MENU
        </div>


        <nav className="sidebar-nav">

          <Link
            to="/student-dashboard"
            className="sidebar-link active"
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </Link>


          <Link
            to="/report-issue"
            className="sidebar-link"
          >
            <span className="nav-icon">⚑</span>
            <span>Report Issue</span>
          </Link>


          <Link
            to="/my-issues"
            className="sidebar-link"
          >
            <span className="nav-icon">▤</span>
            <span>My Issues</span>
          </Link>


          <Link
            to="/issue-status"
            className="sidebar-link"
          >
            <span className="nav-icon">◔</span>
            <span>Issue Status</span>
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>Need Help?</strong>
              <small>Report a campus problem</small>
            </div>

          </div>


          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="student-main">

        {/* TOP BAR */}

        <header className="student-topbar">

          <div>

            <p className="topbar-label">
              STUDENT PORTAL
            </p>

            <h2>
              Dashboard
            </h2>

          </div>


          <div className="student-profile">

            <div className="profile-avatar">
              S
            </div>

            <div className="profile-info">

              <strong>Student</strong>

              <span>
                Active account
              </span>

            </div>

          </div>

        </header>


        {/* WELCOME HERO */}

        <section className="welcome-section">

          <div className="welcome-content">

            <div className="welcome-tag">
              ● CAMPUS STATUS: ONLINE
            </div>

            <h1>
              Welcome back, Student 👋
            </h1>

            <p>
              Report campus problems, track your complaints,
              and help make your campus smarter.
            </p>


            <div className="welcome-actions">

              <Link
                to="/report-issue"
                className="primary-action"
              >
                <span>＋</span>
                Report an Issue
              </Link>


              <Link
                to="/my-issues"
                className="secondary-action"
              >
                View My Issues
                <span>→</span>
              </Link>

            </div>

          </div>


          <div className="welcome-visual">

            <div className="visual-circle circle-one"></div>

            <div className="visual-circle circle-two"></div>

            <div className="campus-icon">
              🏫
            </div>

          </div>

        </section>


        {/* STATISTICS */}

        <section className="stats-section">

          <div className="section-heading">

            <div>
              <h3>
                Your Overview
              </h3>

              <p>
                Track your campus reports at a glance
              </p>
            </div>

          </div>


          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon blue">
                📋
              </div>

              <div className="stat-info">
                <span>Total Reports</span>
                <strong>0</strong>
              </div>

              <div className="stat-arrow">
                →
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon orange">
                ◷
              </div>

              <div className="stat-info">
                <span>Pending Issues</span>
                <strong>0</strong>
              </div>

              <div className="stat-arrow">
                →
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon green">
                ✓
              </div>

              <div className="stat-info">
                <span>Resolved Issues</span>
                <strong>0</strong>
              </div>

              <div className="stat-arrow">
                →
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon purple">
                ⚡
              </div>

              <div className="stat-info">
                <span>Active Issues</span>
                <strong>0</strong>
              </div>

              <div className="stat-arrow">
                →
              </div>

            </div>

          </div>

        </section>


        {/* MAIN GRID */}

        <section className="dashboard-grid">


          {/* QUICK ACTIONS */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Quick Actions
                </h3>

                <p>
                  Manage your campus reports
                </p>
              </div>

            </div>


            <div className="quick-actions">

              <Link
                to="/report-issue"
                className="quick-card report-card"
              >

                <div className="quick-icon">
                  📢
                </div>

                <div className="quick-content">

                  <h4>
                    Report an Issue
                  </h4>

                  <p>
                    Tell us about a problem on campus
                  </p>

                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>


              <Link
                to="/my-issues"
                className="quick-card"
              >

                <div className="quick-icon">
                  📋
                </div>

                <div className="quick-content">

                  <h4>
                    My Issues
                  </h4>

                  <p>
                    View and manage your submitted reports
                  </p>

                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>


              <Link
                to="/issue-status"
                className="quick-card"
              >

                <div className="quick-icon">
                  📊
                </div>

                <div className="quick-content">

                  <h4>
                    Track Issue Status
                  </h4>

                  <p>
                    See how your reported issues are progressing
                  </p>

                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>

            </div>

          </div>


          {/* CAMPUS STATUS */}

          <div className="dashboard-panel campus-status-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Campus Status
                </h3>

                <p>
                  Current platform activity
                </p>
              </div>

              <span className="online-dot">
                ●
              </span>

            </div>


            <div className="campus-status">

              <div className="status-row">

                <div className="status-left">
                  <span className="status-symbol">✓</span>

                  <div>
                    <strong>Issue Reporting</strong>
                    <small>Available</small>
                  </div>
                </div>

                <span className="status-badge success">
                  Online
                </span>

              </div>


              <div className="status-row">

                <div className="status-left">
                  <span className="status-symbol">AI</span>

                  <div>
                    <strong>AI Analysis</strong>
                    <small>Automatic classification</small>
                  </div>
                </div>

                <span className="status-badge success">
                  Active
                </span>

              </div>


              <div className="status-row">

                <div className="status-left">
                  <span className="status-symbol">↗</span>

                  <div>
                    <strong>Issue Tracking</strong>
                    <small>Real-time updates</small>
                  </div>
                </div>

                <span className="status-badge success">
                  Active
                </span>

              </div>

            </div>


            <div className="campus-tip">

              <span>
                💡
              </span>

              <div>
                <strong>
                  Help improve your campus
                </strong>

                <p>
                  Every valid report helps administrators
                  identify and resolve recurring problems.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* BOTTOM INFORMATION */}

        <section className="information-banner">

          <div className="info-symbol">
            ✦
          </div>

          <div>

            <strong>
              CampusInox Smart Issue Intelligence
            </strong>

            <p>
              Your complaints are transformed into actionable
              campus insights using intelligent issue analysis.
            </p>

          </div>

          <Link
            to="/report-issue"
            className="info-button"
          >
            Report Now →
          </Link>

        </section>


        {/* FOOTER */}

        <footer className="student-footer">

          <span>
            © 2026 CAMPUSINOX
          </span>

          <span>
            Smart Campus Issue Intelligence & Resolution Platform
          </span>

        </footer>

      </main>

    </div>
  );
}

export default StudentDashboard;