"use client"

import { AppShell } from "@/components/app-shell"
import { useParams } from "next/navigation"
import ReleaseDetailsWidgets from "@/components/ReleaseDetailsWidgets"

export default function ReleaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  
  const name = decodeURIComponent(Array.isArray(id) ? id[0] : id)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase())

  return (
    <AppShell
      title={name}
      subtitle="Manage scope, check automation, and ship with confidence"
    >
      <div className="flex min-h-[60vh] flex-col gap-4 lg:min-h-[calc(100dvh-220px)]">
        <ReleaseDetailsWidgets params={{ id }} />
      </div>
    </AppShell>
  )
}