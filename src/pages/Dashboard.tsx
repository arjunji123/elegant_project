import React, { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import ChartPie from '../components/ChartPie';
import ChartBar from '../components/ChartBar';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const token = localStorage.getItem('authToken'); // or pass via context

  useEffect(() => {
    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setDashboardData(data.data || data))
      .catch(err => console.log(err.message));
  }, [token]);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const cards = [
    { title: 'Total Active Users', value: dashboardData.activeUsers || 0, delta: '' },
    { title: 'Total Orders', value: dashboardData.totalOrders || 0, delta: '' },
    { title: 'Earnings Today', value: `₹${dashboardData.earningToday || '0.00'}`, delta: '' },
    { title: 'Earnings This Week', value: `₹${dashboardData.earningWeek || '0.00'}`, delta: '' },
    { title: 'Earnings This Month', value: `₹${dashboardData.earningMonth || '0.00'}`, delta: '' },
    { title: 'Total Products', value: dashboardData.totalProducts || 0, delta: '' },
    { title: 'Total Categories', value: dashboardData.totalCategories || 0, delta: '' },
  ];

return (
  <div className="space-y-6">

    {/* Cards with background and rounded box */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.slice(0, 4).map((c) => (
        <div 
          key={c.title}
          className="bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center text-center"
          style={{ minHeight: '120px' }} // optional, consistent height
        >
          <DashboardCard title={c.title} value={c.value} delta={c.delta} />
        </div>
      ))}
    </div>

    {/* Charts section with card styling and alignment */}
    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card bg-white rounded-lg shadow p-6 flex flex-col">
        <h3 className="font-semibold mb-4 text-gray-700">Current visits</h3>
        <div className="flex-1">
          <ChartPie />
        </div>
      </div>

      <div className="card bg-white rounded-lg shadow p-6 flex flex-col">
        <h3 className="font-semibold mb-4 text-gray-700">Website visits</h3>
        <div className="flex-1">
          <ChartBar />
        </div>
      </div>
    </div> */}

  </div>
);

}
