import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TemplatesPage() {
  return (
    <AppShell
      title="Templates"
      subtitle="Reusable release checklists and pipelines"
      action={<Button variant="secondary">New template</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Mobile App", "Web API", "Frontend SPA"].map((t) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle className="text-base">{t}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm text-muted-foreground">
                Opinionated steps tailored for {t.toLowerCase()} releases.
              </p>
              <Button variant="outline">Use template</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}
