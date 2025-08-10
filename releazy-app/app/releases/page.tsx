"use client"

import type React from "react"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CreateReleaseDialog } from "@/components/create-release-dialog"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Filter, ListFilter, Search } from "lucide-react"

type Release = {
  id: string
  name: string
  status: "Planned" | "In progress" | "Done" | "Canceled"
  progress: number
  start: string
  end?: string
}

const releasesSeed: Release[] = [
  {
    id: "mv-release-v120-4-0",
    name: "MV release v120.4.0",
    status: "In progress",
    progress: 68,
    start: "2025-08-01",
  },
  {
    id: "mv-release-v120-3-0",
    name: "MV release v120.3.0",
    status: "Done",
    progress: 100,
    start: "2025-07-15",
    end: "2025-07-29",
  },
  {
    id: "hotfix-ssrm-948",
    name: "Hotfix SSRM-948",
    status: "Done",
    progress: 100,
    start: "2025-07-20",
    end: "2025-07-20",
  },
]

const STATUS: Array<Release["status"] | "All"> = ["All", "Planned", "In progress", "Done", "Canceled"]

export default function ReleasesPage() {
  const router = useRouter()
  const [status, setStatus] = useState<(typeof STATUS)[number]>("All")
  const [query, setQuery] = useState("")
  const [releases] = useState<Release[]>(releasesSeed)

  const filtered = useMemo(() => {
    return releases.filter((r) => {
      const matchesStatus = status === "All" ? true : r.status === status
      const q = query.trim().toLowerCase()
      const matchesQuery = q.length ? r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) : true
      return matchesStatus && matchesQuery
    })
  }, [releases, status, query])

  const counts = useMemo(() => {
    return {
      total: releases.length,
      planned: releases.filter((r) => r.status === "Planned").length,
      inProgress: releases.filter((r) => r.status === "In progress").length,
      done: releases.filter((r) => r.status === "Done").length,
    }
  }, [releases])

  return (
    <AppShell title="Releases" subtitle="Plan, track, and automate release pipelines" action={<CreateReleaseDialog />}>
      <div className="flex min-h-[60vh] flex-col gap-4 lg:min-h-[calc(100dvh-220px)]">
        {/* Top Section: stats + controls */}
        <Card className="border-none bg-gradient-to-tr from-violet-50 to-fuchsia-50 p-0 shadow-sm dark:from-violet-950/30 dark:to-fuchsia-950/20">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {counts.total} total
              </Badge>
              <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
              <StatPill label="In progress" value={counts.inProgress} />
              <StatPill label="Done" value={counts.done} />
              <StatPill label="Planned" value={counts.planned} />
            </div>

          </div>
        </Card>

        {/* Main content: full-height table area */}
        <Card className="flex h-full min-h-0 flex-col overflow-hidden px-4">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search releases"
                placeholder="Search releases..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ListFilter className="h-4 w-4" />
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUS.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setStatus(s)}>
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => fakeExport("csv")}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fakeExport("xlsx")}>Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fakeExport("json")}>JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 overflow-auto">
            <Table className="min-w-[720px]">
              <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <TableRow>
                  <TableHead className="w-[48%]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Dates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <HoverableRow key={r.id} onClick={() => router.push(`/releases/${r.id}`)}>
                    <TableCell className="font-medium">
                      <span className="underline-offset-4 hover:underline">{r.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === "Done" ? "default" : r.status === "Canceled" ? "destructive" : "secondary"
                        }
                        className="rounded-full"
                        aria-label={`Status: ${r.status}`}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <Progress value={r.progress} className="h-2" aria-label="Progress" />
                        <span className="w-12 text-right text-xs text-muted-foreground">{r.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.end ? `${r.start} → ${r.end}` : r.start}
                    </TableCell>
                  </HoverableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <Badge className="rounded-full">{value}</Badge>
    </span>
  )
}

function HoverableRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <TableRow
      onClick={onClick}
      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 hover:bg-accent"
      tabIndex={0}
      role="button"
      aria-label="Open release details"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {children}
    </TableRow>
  )
}

/**
 * Demo export handler placeholder.
 */
function fakeExport(fmt: "csv" | "xlsx" | "json") {
  const friendly = fmt === "xlsx" ? "Excel" : fmt.toUpperCase()
  // eslint-disable-next-line no-alert
  alert(`Exported as ${friendly}`)
}
