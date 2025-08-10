"use client"

import type React from "react"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  ClipboardList,
  GitBranchPlus,
  History,
  Pencil,
  Play,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Ship,
  Trash2,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { ReleaseStepper } from "@/components/release-stepper"
import ReleaseDetailsWidgets from "@/components/ReleaseDetailsWidgets"

type Ticket = {
  id: string
  title: string
  status: "todo" | "doing" | "done"
}

const sampleTickets: Ticket[] = [
  { id: "AV-123", title: "Add payments", status: "done" },
  { id: "AV-456", title: "Fix # year numbers", status: "done" },
  { id: "AV-798", title: "Add SSRM", status: "done" },
  { id: "AV-999", title: "Refactor checkout", status: "doing" },
  { id: "AV-111", title: "i18n strings", status: "todo" },
  { id: "AV-222", title: "Optimize image pipeline", status: "todo" },
  { id: "AV-333", title: "E2E coverage: payments", status: "doing" },
]

type StepId = "freeze" | "tickets" | "tests" | "staging" | "uat" | "prod"

const STEPS: Array<{ id: StepId; label: string; icon: React.ReactNode }> = [
  { id: "freeze", label: "Requirements frozen", icon: <ShieldCheck className="h-4 w-4" /> },
  { id: "tickets", label: "Jira tickets selection", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "tests", label: "Automated testing", icon: <Play className="h-4 w-4" /> },
  { id: "staging", label: "Staging deployment", icon: <Server className="h-4 w-4" /> },
  { id: "uat", label: "UAT sign-off", icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: "prod", label: "Production release", icon: <Ship className="h-4 w-4" /> },
]

export default function ReleaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Ticket["status"]>("all")
  const [included, setIncluded] = useState<Ticket[]>(sampleTickets.slice(0, 4))
  const [selectedIncluded, setSelectedIncluded] = useState<Record<string, boolean>>({})
  const [activeStep, setActiveStep] = useState<StepId>("tickets")

  const name = decodeURIComponent(Array.isArray(id) ? id[0] : id)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase())

  const stats = useMemo(() => {
    const done = included.filter((t) => t.status === "done").length
    const percent = included.length ? Math.round((done / included.length) * 100) : 0
    return {
      status: "In progress",
      ticketsCount: included.length,
      doneCount: done,
      progressPct: percent,
      branch: "release/2025-08-08",
    }
  }, [included])

  const activeIndex = STEPS.findIndex((s) => s.id === activeStep)

  const includedFiltered = useMemo(() => {
    const q = query.toLowerCase()
    return included.filter((t) => {
      const matchesQ = t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter
      return matchesQ && matchesStatus
    })
  }, [included, query, statusFilter])

  return (
    <AppShell
      title={name}
      subtitle="Manage scope, check automation, and ship with confidence"
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <History className="h-4 w-4" />
            Audit log
          </Button>
          <Button variant="secondary" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit details
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      }
    >
      <div className="flex min-h-[60vh] flex-col gap-4 lg:min-h-[calc(100dvh-220px)]">
        {/* Consolidated top section (no search here anymore) */}
        <Card className="border-none bg-gradient-to-tr from-violet-50 to-fuchsia-50 p-0 shadow-sm dark:from-violet-950/30 dark:to-fuchsia-950/20">
          <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {stats.status}
              </Badge>
              <Pill icon={<ClipboardList className="h-3.5 w-3.5" />} label="Tickets" value={`${stats.ticketsCount}`} />
              <Pill icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Done" value={`${stats.doneCount}`} />
              <Pill icon={<Rocket className="h-3.5 w-3.5" />} label="Progress" value={`${stats.progressPct}%`} />
              <Pill icon={<GitBranchPlus className="h-3.5 w-3.5" />} label="Branch" value={stats.branch} />
            </div>
            {/* <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:justify-end">
              <div className="flex gap-2">
                <Button variant="secondary">Sync from Jira</Button>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Run E2E
                </Button>
              </div>
            </div> */}
          </div>
        </Card>

        {/* Main grid: Pipeline | Jira selection workbench (single list) */}
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[280px_1fr]">
        <ReleaseDetailsWidgets params={{
            id: "123"
          }}  />
        <div />
      
      </div>
    </AppShell>
  )
}

function Pill({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
      {icon}
      <span className="text-muted-foreground">{label}</span>
      <Badge className="rounded-full">{value}</Badge>
    </span>
  )
}

function PipelineStep({
  label,
  icon,
  active = false,
  done = false,
  onClick,
}: {
  label: string
  icon?: React.ReactNode
  active?: boolean
  done?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
        active ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10" : "hover:bg-accent",
        done ? "opacity-80" : "",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
      ].join(" ")}
      aria-current={active ? "step" : undefined}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      {done ? (
        <Badge variant="outline" className="rounded-full">
          Done
        </Badge>
      ) : active ? (
        <Badge className="rounded-full">Active</Badge>
      ) : (
        <Badge variant="secondary" className="rounded-full">
          {"Queued"}
        </Badge>
      )}
    </button>
  )
}

function TicketRow({
  ticket,
  action,
  checkbox,
}: {
  ticket: Ticket
  action?: React.ReactNode
  checkbox?: { checked: boolean; onChange: (v: boolean) => void; label: string }
}) {
  return (
    <div
      className="group flex items-center justify-between gap-3 rounded-md border p-2 focus-within:ring-2 focus-within:ring-violet-500"
      role="row"
    >
      <div className="flex min-w-0 items-center gap-3">
        {checkbox && (
          <div className="flex items-center gap-2">
            <Checkbox id={`cb-${ticket.id}`} checked={checkbox.checked} onCheckedChange={checkbox.onChange} />
            <Label htmlFor={`cb-${ticket.id}`} className="sr-only">
              {checkbox.label}
            </Label>
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{ticket.id}</p>
          <p className="truncate text-xs text-muted-foreground">{ticket.title}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={ticket.status === "done" ? "default" : ticket.status === "doing" ? "secondary" : "outline"}
          className="rounded-full"
        >
          {ticket.status}
        </Badge>
        {action}
      </div>
    </div>
  )
}

function EmptyList({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
