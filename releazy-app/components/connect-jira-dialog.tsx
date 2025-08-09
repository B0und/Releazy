"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ShieldQuestion, PlugZap } from "lucide-react"
import { useJiraConfig } from "@/lib/jira-config"

export function ConnectJiraDialog() {
  const { baseUrl, email, apiToken, save, clear } = useJiraConfig()
  const [open, setOpen] = useState(false)
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl)
  const [localEmail, setLocalEmail] = useState(email)
  const [localToken, setLocalToken] = useState(apiToken)

  useEffect(() => {
    setLocalBaseUrl(baseUrl)
    setLocalEmail(email)
    setLocalToken(apiToken)
  }, [baseUrl, email, apiToken])

  const connected = !!baseUrl && !!apiToken

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={connected ? "outline" : "default"} className="gap-2">
          <PlugZap className="size-4" />
          {connected ? "Jira connected" : "Connect Jira"}
          {connected && <Badge variant="secondary">demo</Badge>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Jira</DialogTitle>
          <DialogDescription>
            For demo use, credentials are stored locally and used for requests. For production, set server environment
            variables JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="jira-url">Base URL</Label>
            <Input
              id="jira-url"
              placeholder="https://your-domain.atlassian.net"
              value={localBaseUrl}
              onChange={(e) => setLocalBaseUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="jira-email">Email</Label>
            <Input
              id="jira-email"
              placeholder="you@company.com"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="jira-token">API Token</Label>
            <Input
              id="jira-token"
              placeholder="Jira API token"
              type="password"
              value={localToken}
              onChange={(e) => setLocalToken(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <ShieldQuestion className="size-4" />
            This dialog is for demo. Use server envs for secure production connections.
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => clear()}>
            Clear
          </Button>
          <Button
            onClick={() => {
              save({ baseUrl: localBaseUrl, email: localEmail, apiToken: localToken })
              setOpen(false)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
