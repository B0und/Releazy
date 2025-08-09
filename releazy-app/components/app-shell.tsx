"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ListTree, Layers, Settings, ChevronLeft, GitMerge } from "lucide-react"
import Image from "next/image"

type AppShellProps = {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/releases", label: "Releases", icon: ListTree },
  { href: "/templates", label: "Templates", icon: Layers },
]

export function AppShell({
  children,
  title = "Releazy",
  subtitle = "Streamline and automate product releases",
  action,
}: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-8">
        <aside className="sticky top-4 hidden h-[calc(100dvh-3rem)] w-[250px] shrink-0 rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur md:block">
          <div className="flex items-center gap-2 px-2">
            <div className="relative rounded-md flex gap-2">
              
                <p className="font-semibold tracking-tight">Releazy</p>
                <GitMerge className="size-5 text-emerald-600" />
            
            </div>
          </div>
          <Separator className="my-4" />
          <nav className="grid gap-1">
            {nav.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/releases" && (
                    <Badge variant="outline" className="rounded-full">
                      12
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto">
            <Separator className="my-4" />
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-4 rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-full sm:hidden">
                    <Link href="/releases">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">{"Back"}</span>
                    </Link>
                  </Button>
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">{action}</div>
            </div>
          </header>
          <div className="pb-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
