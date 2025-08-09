"use client"

import type React from "react"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ChartCardProps = {
  title?: string
  description?: string
  children?: React.ReactNode
}

export function ChartCard({ title = "Chart", description = "", children }: ChartCardProps) {
  return (
    <Card className="col-span-12 sm:col-span-6">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent className="h-[220px]">{children}</CardContent>
    </Card>
  )
}

export function IssuesBarChart() {
  const data = [
    { name: "Mon", created: 12, closed: 9 },
    { name: "Tue", created: 15, closed: 12 },
    { name: "Wed", created: 9, closed: 8 },
    { name: "Thu", created: 11, closed: 10 },
    { name: "Fri", created: 18, closed: 16 },
    { name: "Sat", created: 7, closed: 6 },
    { name: "Sun", created: 5, closed: 4 },
  ]
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke="currentColor" opacity={0.6} />
        <YAxis stroke="currentColor" opacity={0.4} />
        <Tooltip cursor={{ fill: "hsl(var(--accent))" }} />
        <Bar dataKey="created" fill="hsl(262 83% 58%)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="closed" fill="hsl(292 84% 61%)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function VelocityAreaChart() {
  const data = Array.from({ length: 16 }).map((_, i) => ({
    day: i + 1,
    commits: Math.round(20 + Math.random() * 30),
    tests: Math.round(10 + Math.random() * 20),
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(292 84% 61%)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(292 84% 61%)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="day" stroke="currentColor" opacity={0.6} />
        <YAxis stroke="currentColor" opacity={0.4} />
        <Tooltip />
        <Area type="monotone" dataKey="commits" stroke="hsl(262 83% 58%)" fill="url(#grad1)" strokeWidth={2} />
        <Area type="monotone" dataKey="tests" stroke="hsl(292 84% 61%)" fill="url(#grad2)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function TrendLineChart() {
  const data = Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i}:00`,
    throughput: Math.round(50 + Math.sin(i / 2) * 25 + Math.random() * 10),
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="hour" stroke="currentColor" opacity={0.6} hide />
        <YAxis stroke="currentColor" opacity={0.4} />
        <Tooltip />
        <Line type="monotone" dataKey="throughput" stroke="hsl(262 83% 58%)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
