import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

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

  return (

    <div className="container mt-5 text-center">

      <h1 className="fw-bold">
        CAMPUSINOX
      </h1>

      <p className="lead">
        Smart Campus Issue Intelligence & Resolution Platform
      </p>


      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <h3>
            Campus Issue Intelligence
          </h3>

          <p className="text-muted">
            Transforming individual complaints into
            intelligent campus issues.
          </p>


          <div className="mt-3">

            <Link
              to="/login"
              className="btn btn-primary me-2"
            >
              Login
            </Link>


            <Link
              to="/register"
              className="btn btn-success"
            >
              Register
            </Link>

          </div>

        </div>

      </div>

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