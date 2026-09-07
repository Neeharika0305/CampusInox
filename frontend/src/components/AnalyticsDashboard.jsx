import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const API = "http://127.0.0.1:5000/api/analytics";

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState({});
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [resolution, setResolution] = useState({});

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [
          summaryRes,
          categoriesRes,
          locationsRes,
          resolutionRes
        ] = await Promise.all([
          fetch(`${API}/summary`),
          fetch(`${API}/categories`),
          fetch(`${API}/locations`),
          fetch(`${API}/resolution`)
        ]);

        setSummary(await summaryRes.json());
        setCategories(await categoriesRes.json());
        setLocations(await locationsRes.json());
        setResolution(await resolutionRes.json());
      } catch (error) {
        console.error("Analytics error:", error);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>CampusInox Analytics</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        <Card title="Issues" value={summary.issues} />
        <Card title="Pending" value={summary.pending} />
        <Card title="Resolved" value={summary.resolved} />
        <Card title="Critical" value={summary.critical} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "40px"
        }}
      >
        <ChartCard title="Issues by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Issues by Location">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ marginTop: "40px" }}>
        <ChartCard title="Resolution Statistics">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px"
            }}
          >
            <Card
              title="Average Resolution Time"
              value={`${resolution.average_resolution_time || 0} hrs`}
            />

            <Card
              title="Resolution Rate"
              value={`${resolution.resolution_rate || 0}%`}
            />

            <Card
              title="Pending Issues"
              value={resolution.pending_issues || 0}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fff"
      }}
    >
      <h3>{title}</h3>
      <h1>{value ?? 0}</h1>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div
      style={{
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fff"
      }}
    >
      <h2>{title}</h2>
      {children}
    </div>
  );
}