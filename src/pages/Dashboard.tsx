import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import EarningsBarChart from "../components/EarningsBarChart"; // <-- Recharts component

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const [earningsToday, setEarningsToday] = useState(null);
  const [earningsWeek, setEarningsWeek] = useState(null);
  const [earningsMonth, setEarningsMonth] = useState(null);

  const token = localStorage.getItem("authToken");

  // Fetch Dashboard Stats
  useEffect(() => {
    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDashboardData(data.data || data))
      .catch((err) => console.log("Dashboard Error:", err));
  }, []);

  // Fetch Earnings Analytics
  const fetchEarnings = (period, setter) => {
    fetch(
      `/api/admin/earnings-analytics?period=${period}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setter(data.data))
      .catch((err) => console.log(`Error fetching ${period} earnings:`, err));
  };

  useEffect(() => {
    fetchEarnings("day", setEarningsToday);
    fetchEarnings("week", setEarningsWeek);
    fetchEarnings("month", setEarningsMonth);
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  const cards = [
    { title: "Total Active Users", value: dashboardData.activeUsers || 0 },
    { title: "Total Orders", value: dashboardData.totalOrders || 0 },
    { title: "Earnings Today", value: `₹${earningsToday?.total || 0}` },
    { title: "Earnings This Week", value: `₹${earningsWeek?.total || 0}` },
    { title: "Earnings This Month", value: `₹${earningsMonth?.total || 0}` },
    { title: "Total Products", value: dashboardData.totalProducts || 0 },
    { title: "Total Categories", value: dashboardData.totalCategories || 0 },
  ];

  return (
    <div className="space-y-6">

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.slice(0, 4).map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center text-center"
          >
            <DashboardCard title={c.title} value={c.value} />
          </div>
        ))}
      </div>

      {/* Recharts Earnings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Earnings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Weekly Earnings (₹)
          </h3>
          {earningsWeek ? (
            <EarningsBarChart
              labels={earningsWeek.labels}
              values={earningsWeek.earnings}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Monthly Earnings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Monthly Earnings (₹)
          </h3>
          {earningsMonth ? (
            <EarningsBarChart
              labels={earningsMonth.labels}
              values={earningsMonth.earnings}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>

      </div>

    </div>
  );
}
