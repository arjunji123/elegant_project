import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'


const data = [
{ name: 'Jan', TeamA: 40, TeamB: 50 },
{ name: 'Feb', TeamA: 30, TeamB: 60 },
{ name: 'Mar', TeamA: 20, TeamB: 45 },
{ name: 'Apr', TeamA: 60, TeamB: 40 },
{ name: 'May', TeamA: 30, TeamB: 70 }
]


export default function ChartBar() {
return (
<div style={{ width: '100%', height: 320 }}>
<ResponsiveContainer>
<BarChart data={data}>
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Bar dataKey="TeamA" fill="#2563EB" />
<Bar dataKey="TeamB" fill="#F59E0B" />
</BarChart>
</ResponsiveContainer>
</div>
)
}