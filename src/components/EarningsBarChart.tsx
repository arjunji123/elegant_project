import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function EarningsBarChart({ labels, values }) {
  // Prepare data for Recharts
  const chartData = labels.map((label, index) => ({
    name: label,
    earning: values[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="earning" fill="#6366f1" /> {/* Indigo color */}
      </BarChart>
    </ResponsiveContainer>
  );
}
