"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Feb",
    total: 16,
  },
  {
    name: "Mar",
    total: 18,
  },
  {
    name: "Apr",
    total: 14,
  },
  {
    name: "May",
    total: 22,
  },
  {
    name: "Jun",
    total: 26,
  },
  {
    name: "Jul",
    total: 24,
  },
  {
    name: "Aug",
    total: 28,
  },
  {
    name: "Sep",
    total: 32,
  },
  {
    name: "Oct",
    total: 30,
  },
  {
    name: "Nov",
    total: 28,
  },
  {
    name: "Dec",
    total: 24,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

