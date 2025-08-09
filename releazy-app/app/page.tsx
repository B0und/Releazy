import { AppShell } from "@/components/app-shell"
import { KpiCard } from "@/components/kpi-card"
import { ChartCard, IssuesBarChart, TrendLineChart, VelocityAreaChart } from "@/components/charts"
import { CalendarDays, Rocket, ShieldCheck, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Page() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Overview of your release health, velocity, and automation coverage"
      action={
        <>
          <Button variant="outline" className="gap-2 bg-transparent">
            <CalendarDays className="h-4 w-4" />
            01.08.2025 – 08.08.2025
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-12 gap-4">
        <KpiCard
          className="col-span-12 sm:col-span-3"
          title="On-time releases"
          value="95%"
          delta="+5%"
          trend="up"
          icon={<Rocket className="h-4 w-4 text-violet-600" />}
        />
        <KpiCard
          className="col-span-12 sm:col-span-3"
          title="Rollback rate"
          value="2%"
          delta="-1%"
          trend="down"
          icon={<ShieldCheck className="h-4 w-4 text-fuchsia-600" />}
        />
        <KpiCard
          className="col-span-12 sm:col-span-3"
          title="Lead time"
          value="3.4d"
          delta="+0.3d"
          trend="down"
          icon={<CalendarDays className="h-4 w-4 text-violet-600" />}
        />
        <KpiCard
          className="col-span-12 sm:col-span-3"
          title="Automation coverage"
          value="78%"
          delta="+4%"
          trend="up"
          icon={<Bot className="h-4 w-4 text-fuchsia-600" />}
        />

        <ChartCard title="Issues created vs closed">
          <IssuesBarChart />
        </ChartCard>
        <ChartCard title="Commits & tests">
          <VelocityAreaChart />
        </ChartCard>

        <div className="col-span-12 rounded-2xl border bg-background p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="h-[260px]">
              <TrendLineChart />
            </div>
            <div>
              <h3 className="text-base font-semibold">Release spotlight</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                MV release v120.4.0 is on track. 15/19 tickets completed. E2E tests are green.
              </p>
              <div className="mt-4 rounded-xl border bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image
                      src="/images/releazy-v1.png"
                      alt="Releazy wireframe"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Sketch to reality</p>
                    <p className="text-muted-foreground">Dashboard evolved from the original concept.</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild>
                  <a href="/releases">Go to Releases</a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="/releases/mv-release-v120-4-0">{"Open MV v120.4.0"}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">
        Images are rendered with Next.js Image component using intrinsic width and height as recommended for optimized
        loading in the App Router. [^2]
      </p>
    </AppShell>
  )
}
