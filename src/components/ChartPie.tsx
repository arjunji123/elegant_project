import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'


const data = [
{ name: 'Team A', value: 400 },
{ name: 'Team B', value: 300 },
{ name: 'Team C', value: 100 },
{ name: 'Team D', value: 200 }
]
const COLORS = ['#2563EB', '#FBBF24', '#0ea5a7', '#ef4444']


export default function ChartPie() {
return (
<div style={{ width: '100%', height: 300 }}>
<ResponsiveContainer>
<PieChart>
<Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
{data.map((entry, index) => (
<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
<Tooltip />
</PieChart>
</ResponsiveContainer>
</div>
)
}