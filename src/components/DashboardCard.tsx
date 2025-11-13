import React from 'react'


type Props = { title: string; value: string; delta: string }


export default function DashboardCard({ title, value, delta }: Props) {
return (
<div className="card flex items-center justify-between">
<div>
<div className="text-sm text-gray-500">{title}</div>
<div className="text-2xl font-bold">{value}</div>
</div>
<div className="text-sm text-green-600">{delta}</div>
</div>
)
}