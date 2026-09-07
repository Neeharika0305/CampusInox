import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: "📊",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📈",
    },
    {
      name: "Campus Intelligence",
      path: "/campus-intelligence",
      icon: "🗺️",
    },
    {
      name: "Report Issue",
      path: "/report-issue",
      icon: "📝",
    },
    {
      name: "My Issues",
      path: "/my-issues",
      icon: "📋",
    },
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* SIDEBAR */}
      <aside
        className="bg-dark text-white p-3"
        style={{
          width: "240px",
          minWidth: "240px",
        }}
      >

        <h3 className="fw-bold mb-4">
          CAMPUSINOX
        </h3>

        <small className="text-secondary">
          SMART CAMPUS
        </small>

        <div className="mt-3">

          {links.map((link) => (

            <Link
              key={link.path}
              to={link.path}
              className={`d-flex align-items-center gap-2 text-decoration-none rounded p-3 mb-2 ${
                location.pathname === link.path
                  ? "bg-primary text-white"
                  : "text-white"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>

          ))}

        </div>

      </aside>

      {/* MAIN */}
      <div className="flex-grow-1">

        {/* NAVBAR */}
        <nav className="navbar bg-white shadow-sm px-4">

          <div>
            <span className="fw-semibold">
              Campus Issue Intelligence
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">

            <span className="badge bg-success">
              ● System Online
            </span>

            <span>
              👤 Admin
            </span>

          </div>

        </nav>

        {/* CONTENT */}
        <main className="p-3 p-md-4">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;