"use client"

import { CheckCircle2, Clock4, PlayCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ReleaseStep = {
  id: string
  name: string
  owner: string
  status: "todo" | "in-progress" | "done" | "blocked"
}

export function ReleaseStepper({
  steps,
  activeId,
  onSelect,
}: {
  steps: ReleaseStep[]
  activeId: string
  onSelect?: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {steps.map((s, idx) => {
        const isActive = s.id === activeId
        const Icon =
          s.status === "done"
            ? CheckCircle2
            : s.status === "in-progress"
              ? PlayCircle
              : s.status === "blocked"
                ? XCircle
                : Clock4

        const ring =
          s.status === "done"
            ? "ring-emerald-500/40"
            : s.status === "in-progress"
              ? "ring-sky-500/40"
              : s.status === "blocked"
                ? "ring-rose-500/40"
                : "ring-muted"
        const bg = isActive ? "bg-muted/60" : "bg-background"

        return (
          <button
            key={s.id}
            onClick={() => onSelect?.(s.id)}
            className={cn(
              "w-full text-left rounded-md border p-3 transition hover:bg-muted/60 focus:outline-none focus:ring-2",
              bg,
              isActive && "ring-2",
              isActive && ring,
            )}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={cn(
                  "h-5 w-5 mt-0.5",
                  s.status === "done"
                    ? "text-emerald-600"
                    : s.status === "in-progress"
                      ? "text-sky-600"
                      : s.status === "blocked"
                        ? "text-rose-600"
                        : "text-muted-foreground",
                )}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {idx + 1}. {s.name}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{s.status.replace("-", " ")}</div>
                </div>
                <div className="text-xs text-muted-foreground">Owner: {s.owner}</div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
