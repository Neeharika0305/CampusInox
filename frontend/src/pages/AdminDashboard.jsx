import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =====================================================
  // GET ALL ISSUES
  // =====================================================

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    setError("");

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setError("Admin login required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/issues",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            data.message ||
              data.msg ||
              "Failed to load issues."
          );
        }

        setLoading(false);
        return;
      }

      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        "Cannot connect to CampusInox backend. Make sure the Flask server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE ISSUE STATUS
  // =====================================================

  const updateStatus = async (issueId, newStatus) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setError("Admin login required.");
      return;
    }

    setUpdatingId(issueId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/issues/${issueId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            data.message ||
              data.msg ||
              "Failed to update status."
          );
        }

        return;
      }

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status: newStatus,
              }
            : issue
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        "Cannot connect to CampusInox backend."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const reportedCount = issues.filter(
    (issue) => issue.status === "REPORTED"
  ).length;

  const inProgressCount = issues.filter(
    (issue) => issue.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status === "RESOLVED"
  ).length;

  const resolutionRate =
    issues.length > 0
      ? Math.round((resolvedCount / issues.length) * 100)
      : 0;

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(issue.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(issue.title || "")
          .toLowerCase()
          .includes(searchText) ||
        String(issue.location || "")
          .toLowerCase()
          .includes(searchText) ||
        String(issue.reported_by || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issues, search, statusFilter]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    window.location.href = "/login";
  };

  // =====================================================
  // STATUS UI
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "RESOLVED") {
      return {
        background: "#dcfce7",
        color: "#166534",
        dot: "#22c55e",
      };
    }

    if (status === "IN_PROGRESS") {
      return {
        background: "#fef3c7",
        color: "#92400e",
        dot: "#f59e0b",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      dot: "#3b82f6",
    };
  };

  return (
    <div style={styles.page}>

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside style={styles.sidebar}>

        <div>
          <div style={styles.logo}>
            CAMPUS<span>INOX</span>
          </div>

          <div style={styles.logoSubtitle}>
            SMART CAMPUS PLATFORM
          </div>
        </div>

        <div style={styles.navSection}>
          <div style={styles.navTitle}>
            MAIN MENU
          </div>

          <Link
            to="/admin-dashboard"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            to="/analytics"
            style={styles.navItem}
          >
            <span>◫</span>
            Analytics
          </Link>

          <Link
            to="/campus-intelligence"
            style={styles.navItem}
          >
            <span>⌖</span>
            Campus Intelligence
          </Link>

          <Link
            to="/my-issues"
            style={styles.navItem}
          >
            <span>☷</span>
            Issues
          </Link>
        </div>

        <div style={styles.navSection}>
          <div style={styles.navTitle}>
            QUICK ACTIONS
          </div>

          <Link
            to="/report-issue"
            style={styles.navItem}
          >
            <span>＋</span>
            Report Issue
          </Link>
        </div>

        <div style={styles.sidebarBottom}>

          <div style={styles.adminBox}>
            <div style={styles.avatar}>
              A
            </div>

            <div>
              <div style={styles.adminName}>
                Administrator
              </div>

              <div style={styles.adminRole}>
                Campus Admin
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            ⇥ Logout
          </button>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main style={styles.main}>

        {/* TOP NAVBAR */}

        <header style={styles.topbar}>

          <div>
            <div style={styles.breadcrumb}>
              CAMPUSINOX / ADMIN
            </div>

            <h1 style={styles.pageTitle}>
              Admin Dashboard
            </h1>
          </div>

          <div style={styles.topActions}>

            <div style={styles.onlineBadge}>
              <span style={styles.onlineDot}></span>
              System Online
            </div>

            <button
              onClick={fetchIssues}
              style={styles.refreshButton}
            >
              ↻ Refresh
            </button>

          </div>

        </header>

        <div style={styles.content}>

          {/* ERROR */}

          {error && (
            <div style={styles.errorBox}>

              <div style={styles.errorIcon}>
                !
              </div>

              <div style={{ flex: 1 }}>
                <strong>
                  {error.includes("expired")
                    ? "Session Expired"
                    : "Something went wrong"}
                </strong>

                <div style={styles.errorText}>
                  {error}
                </div>
              </div>

              {error.includes("expired") && (
                <button
                  onClick={() =>
                    (window.location.href = "/login")
                  }
                  style={styles.loginButton}
                >
                  Login Again
                </button>
              )}

            </div>
          )}

          {/* ================================================= */}
          {/* WELCOME */}
          {/* ================================================= */}

          <div style={styles.welcomeCard}>

            <div>
              <div style={styles.welcomeSmall}>
                GOOD DAY, ADMIN 👋
              </div>

              <h2 style={styles.welcomeTitle}>
                Campus Overview
              </h2>

              <p style={styles.welcomeText}>
                Monitor, manage and resolve campus issues
                from one central dashboard.
              </p>
            </div>

            <div style={styles.welcomeIcon}>
              🏫
            </div>

          </div>

          {/* ================================================= */}
          {/* KPI CARDS */}
          {/* ================================================= */}

          <div style={styles.statsGrid}>

            <StatCard
              title="Total Issues"
              value={issues.length}
              icon="▣"
              subtitle="All reported issues"
              iconBackground="#eff6ff"
              iconColor="#2563eb"
            />

            <StatCard
              title="Reported"
              value={reportedCount}
              icon="◷"
              subtitle="Awaiting action"
              iconBackground="#fef3c7"
              iconColor="#d97706"
            />

            <StatCard
              title="In Progress"
              value={inProgressCount}
              icon="↻"
              subtitle="Currently being handled"
              iconBackground="#ede9fe"
              iconColor="#7c3aed"
            />

            <StatCard
              title="Resolved"
              value={resolvedCount}
              icon="✓"
              subtitle="Successfully resolved"
              iconBackground="#dcfce7"
              iconColor="#16a34a"
            />

          </div>

          {/* ================================================= */}
          {/* PERFORMANCE ROW */}
          {/* ================================================= */}

          <div style={styles.performanceGrid}>

            <div style={styles.performanceCard}>

              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardLabel}>
                    RESOLUTION PERFORMANCE
                  </div>

                  <h3 style={styles.cardTitle}>
                    Resolution Rate
                  </h3>
                </div>

                <div style={styles.rateCircle}>
                  {resolutionRate}%
                </div>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${resolutionRate}%`,
                  }}
                />
              </div>

              <div style={styles.progressLabels}>
                <span>
                  {resolvedCount} resolved
                </span>

                <span>
                  {issues.length - resolvedCount} remaining
                </span>
              </div>

            </div>

            <div style={styles.quickCard}>

              <div style={styles.cardLabel}>
                QUICK ACCESS
              </div>

              <h3 style={styles.cardTitle}>
                Campus Intelligence
              </h3>

              <p style={styles.quickText}>
                View campus hotspots, building issues
                and location intelligence.
              </p>

              <Link
                to="/campus-intelligence"
                style={styles.primaryAction}
              >
                Open Campus Map →
              </Link>

            </div>

            <div style={styles.quickCard}>

              <div style={styles.cardLabel}>
                ANALYTICS
              </div>

              <h3 style={styles.cardTitle}>
                Issue Analytics
              </h3>

              <p style={styles.quickText}>
                Explore issue categories, locations
                and resolution statistics.
              </p>

              <Link
                to="/analytics"
                style={styles.secondaryAction}
              >
                View Analytics →
              </Link>

            </div>

          </div>

          {/* ================================================= */}
          {/* ISSUES TABLE */}
          {/* ================================================= */}

          <div style={styles.tableCard}>

            <div style={styles.tableHeader}>

              <div>
                <div style={styles.cardLabel}>
                  ISSUE MANAGEMENT
                </div>

                <h2 style={styles.tableTitle}>
                  All Campus Issues
                </h2>

                <p style={styles.tableSubtitle}>
                  Manage and track reported campus issues
                </p>
              </div>

              <div style={styles.issueCount}>
                {filteredIssues.length} issues
              </div>

            </div>

            {/* SEARCH */}

            <div style={styles.filters}>

              <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search by title, location, reporter..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  style={styles.searchInput}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={styles.select}
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="REPORTED">
                  Reported
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>
              </select>

            </div>

            {/* LOADING */}

            {loading && (
              <div style={styles.loadingState}>

                <div style={styles.spinner}></div>

                <h3>
                  Loading campus issues...
                </h3>

                <p>
                  Connecting to CampusInox backend
                </p>

              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              filteredIssues.length === 0 && (
                <div style={styles.emptyState}>

                  <div style={styles.emptyIcon}>
                    📭
                  </div>

                  <h3>
                    No issues found
                  </h3>

                  <p>
                    {issues.length === 0
                      ? "No campus issues have been reported yet."
                      : "Try changing your search or status filter."}
                  </p>

                </div>
              )}

            {/* TABLE */}

            {!loading &&
              filteredIssues.length > 0 && (
                <div style={styles.tableWrapper}>

                  <table style={styles.table}>

                    <thead>
                      <tr>
                        <th style={styles.th}>
                          ISSUE
                        </th>

                        <th style={styles.th}>
                          LOCATION
                        </th>

                        <th style={styles.th}>
                          REPORTED BY
                        </th>

                        <th style={styles.th}>
                          STATUS
                        </th>

                        <th style={styles.th}>
                          ACTION
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredIssues.map((issue) => {

                        const statusStyle =
                          getStatusStyle(
                            issue.status
                          );

                        return (
                          <tr
                            key={issue.id}
                            style={styles.tr}
                          >

                            {/* ISSUE */}

                            <td style={styles.td}>

                              <div style={styles.issueTitle}>
                                {issue.title}
                              </div>

                              <div style={styles.issueDescription}>
                                {issue.description
                                  ? issue.description.length >
                                    70
                                    ? issue.description.slice(
                                        0,
                                        70
                                      ) + "..."
                                    : issue.description
                                  : "No description"}
                              </div>

                              <div style={styles.issueId}>
                                #{issue.id}
                              </div>

                            </td>

                            {/* LOCATION */}

                            <td style={styles.td}>

                              <div style={styles.location}>
                                📍 {issue.location || "Unknown"}
                              </div>

                            </td>

                            {/* REPORTER */}

                            <td style={styles.td}>

                              <div style={styles.reporter}>
                                <div style={styles.smallAvatar}>
                                  {String(
                                    issue.reported_by ||
                                      "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span>
                                  {issue.reported_by ||
                                    "Unknown"}
                                </span>
                              </div>

                            </td>

                            {/* STATUS */}

                            <td style={styles.td}>

                              <span
                                style={{
                                  ...styles.statusBadge,
                                  background:
                                    statusStyle.background,
                                  color:
                                    statusStyle.color,
                                }}
                              >
                                <span
                                  style={{
                                    ...styles.statusDot,
                                    background:
                                      statusStyle.dot,
                                  }}
                                />

                                {formatStatus(
                                  issue.status
                                )}
                              </span>

                            </td>

                            {/* ACTION */}

                            <td style={styles.td}>

                              <div style={styles.actions}>

                                {issue.status !==
                                  "IN_PROGRESS" &&
                                  issue.status !==
                                    "RESOLVED" && (
                                    <button
                                      disabled={
                                        updatingId ===
                                        issue.id
                                      }
                                      onClick={() =>
                                        updateStatus(
                                          issue.id,
                                          "IN_PROGRESS"
                                        )
                                      }
                                      style={
                                        styles.progressButton
                                      }
                                    >
                                      {updatingId ===
                                      issue.id
                                        ? "..."
                                        : "Start"}
                                    </button>
                                  )}

                                {issue.status !==
                                  "RESOLVED" && (
                                  <button
                                    disabled={
                                      updatingId ===
                                      issue.id
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        issue.id,
                                        "RESOLVED"
                                      )
                                    }
                                    style={
                                      styles.resolveButton
                                    }
                                  >
                                    {updatingId ===
                                    issue.id
                                      ? "..."
                                      : "Resolve"}
                                  </button>
                                )}

                              </div>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>
              )}

          </div>

        </div>

      </main>

    </div>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
  subtitle,
  iconBackground,
  iconColor,
}) {
  return (
    <div style={styles.statCard}>

      <div
        style={{
          ...styles.statIcon,
          background: iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div style={styles.statContent}>

        <div style={styles.statTitle}>
          {title}
        </div>

        <div style={styles.statValue}>
          {value}
        </div>

        <div style={styles.statSubtitle}>
          {subtitle}
        </div>

      </div>

    </div>
  );
}


// =====================================================
// HELPERS
// =====================================================

function formatStatus(status) {
  if (status === "IN_PROGRESS") {
    return "In Progress";
  }

  if (status === "REPORTED") {
    return "Reported";
  }

  if (status === "RESOLVED") {
    return "Resolved";
  }

  return status || "Unknown";
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  sidebar: {
    width: "250px",
    minWidth: "250px",
    background: "#111827",
    color: "#ffffff",
    padding: "28px 18px",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    boxSizing: "border-box",
  },

  logo: {
    fontSize: "25px",
    fontWeight: "800",
    letterSpacing: "-0.8px",
  },

  logoSubtitle: {
    color: "#64748b",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    marginTop: "5px",
  },

  navSection: {
    marginTop: "45px",
  },

  navTitle: {
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    padding: "0 12px",
    marginBottom: "10px",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    marginBottom: "5px",
    borderRadius: "9px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

  activeNav: {
    background: "#2563eb",
    color: "#ffffff",
  },

  sidebarBottom: {
    marginTop: "auto",
  },

  adminBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "#1f2937",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  adminName: {
    fontSize: "12px",
    fontWeight: "700",
  },

  adminRole: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "2px",
  },

  logoutButton: {
    width: "100%",
    border: "1px solid #374151",
    background: "transparent",
    color: "#cbd5e1",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "22px 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  breadcrumb: {
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "5px",
  },

  pageTitle: {
    fontSize: "25px",
    margin: 0,
    fontWeight: "750",
    color: "#111827",
  },

  topActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  onlineBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 12px",
    borderRadius: "20px",
    background: "#f0fdf4",
    color: "#15803d",
    fontSize: "12px",
    fontWeight: "600",
  },

  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  refreshButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  content: {
    padding: "30px 35px",
    maxWidth: "1500px",
    margin: "0 auto",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#9a3412",
    borderRadius: "12px",
    padding: "15px 18px",
    marginBottom: "22px",
  },

  errorIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#ffedd5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  errorText: {
    fontSize: "12px",
    marginTop: "3px",
    color: "#c2410c",
  },

  loginButton: {
    border: 0,
    background: "#ea580c",
    color: "#ffffff",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  welcomeCard: {
    background:
      "linear-gradient(120deg, #172554, #1e40af)",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "27px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
    overflow: "hidden",
  },

  welcomeSmall: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#bfdbfe",
  },

  welcomeTitle: {
    margin: "7px 0 5px",
    fontSize: "25px",
  },

  welcomeText: {
    margin: 0,
    color: "#dbeafe",
    fontSize: "13px",
  },

  welcomeIcon: {
    fontSize: "65px",
    opacity: 0.9,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.04)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "700",
  },

  statContent: {
    minWidth: 0,
  },

  statTitle: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "2px 0",
    color: "#111827",
  },

  statSubtitle: {
    color: "#94a3b8",
    fontSize: "10px",
  },

  performanceGrid: {
    display: "grid",
    gridTemplateColumns:
      "1.4fr 1fr 1fr",
    gap: "16px",
    marginBottom: "22px",
  },

  performanceCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "22px",
  },

  quickCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "22px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    fontSize: "9px",
    color: "#94a3b8",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  cardTitle: {
    fontSize: "17px",
    margin: "5px 0 0",
    color: "#111827",
  },

  rateCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
  },

  progressTrack: {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "20px",
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px",
    transition: "width 0.4s ease",
  },

  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "9px",
    color: "#64748b",
    fontSize: "11px",
  },

  quickText: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.6,
    margin: "10px 0 15px",
  },

  primaryAction: {
    display: "inline-block",
    background: "#2563eb",
    color: "#ffffff",
    padding: "9px 13px",
    borderRadius: "7px",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "700",
  },

  secondaryAction: {
    display: "inline-block",
    background: "#f1f5f9",
    color: "#334155",
    padding: "9px 13px",
    borderRadius: "7px",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "700",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    overflow: "hidden",
  },

  tableHeader: {
    padding: "23px 25px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  tableTitle: {
    fontSize: "20px",
    margin: "5px 0",
    color: "#111827",
  },

  tableSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
  },

  issueCount: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  filters: {
    display: "flex",
    gap: "10px",
    padding: "0 25px 18px",
  },

  searchWrapper: {
    flex: 1,
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "9px",
    color: "#94a3b8",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 12px 10px 35px",
    outline: "none",
    fontSize: "12px",
  },

  select: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "9px 12px",
    background: "#ffffff",
    color: "#475569",
    fontSize: "12px",
    minWidth: "145px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    padding: "13px 20px",
    borderTop: "1px solid #eef2f7",
    borderBottom: "1px solid #eef2f7",
  },

  td: {
    padding: "17px 20px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },

  tr: {
    transition: "background 0.2s",
  },

  issueTitle: {
    fontWeight: "700",
    fontSize: "13px",
    color: "#1e293b",
    marginBottom: "4px",
  },

  issueDescription: {
    color: "#94a3b8",
    fontSize: "10px",
    maxWidth: "260px",
    lineHeight: 1.4,
  },

  issueId: {
    color: "#cbd5e1",
    fontSize: "9px",
    marginTop: "4px",
  },

  location: {
    fontSize: "12px",
    color: "#475569",
    whiteSpace: "nowrap",
  },

  reporter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#475569",
  },

  smallAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "11px",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  actions: {
    display: "flex",
    gap: "6px",
  },

  progressButton: {
    border: 0,
    background: "#fef3c7",
    color: "#92400e",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },

  resolveButton: {
    border: 0,
    background: "#dcfce7",
    color: "#166534",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },

  loadingState: {
    textAlign: "center",
    padding: "70px 20px",
    color: "#475569",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 15px",
    animation: "spin 1s linear infinite",
  },

  emptyState: {
    textAlign: "center",
    padding: "70px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },
};

export default AdminDashboard;