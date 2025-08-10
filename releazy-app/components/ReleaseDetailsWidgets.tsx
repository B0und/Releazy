'use client';

import { useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Sparkles } from 'lucide-react';
import { AISuggestionCard } from '@/components/ai-suggestion-card';
import { ReleaseStepper, type ReleaseStep } from '@/components/release-stepper';

type Release = {
  id: string;
  name: string;
  product: string;
  owner: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  start: string;
  target: string;
  risk: 'Low Risk' | 'Medium Risk' | 'High Risk';
  steps: ReleaseStep[];
  tickets: { id: string; summary: string; status: 'To Do' | 'In Progress' | 'Done' }[];
};

const MOCK_RELEASE: Release = {
  id: 'REL-2381',
  name: 'Payments v3.2',
  product: 'Payments',
  owner: 'Alex Kim',
  status: 'In Progress',
  start: 'Jul 12, 2025',
  target: 'Aug 10, 2025',
  risk: 'Medium Risk',
  steps: [
    { id: 'ticket', name: 'Jira Ticket Selection', owner: 'Alex Kim', status: 'done' },
    { id: 'dev', name: 'Development', owner: 'Team Payments', status: 'done' },
    { id: 'test', name: 'Testing', owner: 'QA Payments', status: 'in-progress' },
    { id: 'sec', name: 'Security Review', owner: 'SecOps', status: 'blocked' },
    { id: 'stage', name: 'Staging', owner: 'DevOps', status: 'todo' },
    { id: 'deploy', name: 'Deploy', owner: 'Release Eng', status: 'todo' },
  ],
  tickets: [
    { id: 'PAY-9812', summary: 'Add 3DS2 fallback for EU markets', status: 'In Progress' },
    { id: 'PAY-9731', summary: 'Refactor chargeback pipeline', status: 'To Do' },
    { id: 'PAY-9689', summary: 'Optimize ACH retry window', status: 'Done' },
  ],
};

const suggestionData = [
  {
    id: 'PAY-9841',
    summary: 'Handle network retries for issuer timeouts',
    why: 'Frequent failures observed in last 7 days; related to current 3DS work.',
  },
  {
    id: 'PAY-9823',
    summary: 'Add observability for risk-scoring anomalies',
    why: 'Spikes in anomaly rate after last deployment; low effort, high impact.',
  },
];

const activity = [
  { at: 'Aug 07, 10:21', who: 'SecOps Bot', action: 'Security checks queued (SAST, DAST).' },
  { at: 'Aug 06, 16:03', who: 'Alex Kim', action: 'Moved Testing to In Progress.' },
  { at: 'Aug 05, 09:47', who: 'QA Payments', action: 'Attached test plan v2.' },
  { at: 'Aug 04, 11:20', who: 'Release Eng', action: 'Created release REL-2381.' },
];

export default function ReleaseDetailsWidgets({ params }: { params: { id: string } }) {
  const release = useMemo(() => {
    const releaseId = Array.isArray(params.id) ? params.id[0] : params.id;
    return releaseId === MOCK_RELEASE.id ? MOCK_RELEASE : MOCK_RELEASE;
  }, [params.id]);
  const [activeStep, setActiveStep] = useState<string>(
    release?.steps.find((s) => s.status === 'in-progress')?.id ?? 'ticket'
  );
  const [comment, setComment] = useState<string>('');

  if (!release) return notFound();

  const completed = release.steps.filter((s) => s.status === 'done').length;
  const pct = Math.round((completed / release.steps.length) * 100);

  const active = release.steps.find((s) => s.id === activeStep) ?? release.steps[0];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Workflow Card */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
          <CardDescription>Stages of this release</CardDescription>
        </CardHeader>
        <CardContent>
          <ReleaseStepper steps={release.steps} activeId={activeStep} onSelect={setActiveStep} />
        </CardContent>
      </Card>

      {/* Dynamic Details & Actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{active.name}</CardTitle>
              <CardDescription>Owner: {active.owner}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {active.id === 'ticket' ? (
            <>
              {/* Included Tickets */}
              <div>
                <div className="font-medium mb-2">Included Tickets</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Remove</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {release.tickets.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.id}</TableCell>
                        <TableCell>{t.summary}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{t.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* AI Suggestions */}
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <div className="text-sm font-medium">AI Suggestions</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {suggestionData.map((s) => (
                    <AISuggestionCard
                      key={s.id}
                      id={s.id}
                      summary={s.summary}
                      why={s.why}
                      onAdd={() => {}}
                    />
                  ))}
                </div>
              </div>

              {/* Manual Search */}
              <Collapsible>
                <div className="flex items-center">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-0">
                      Manual Search
                      <ChevronDown className="h-4 w-4 ml-1 transition-transform data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input placeholder="Search by keyword or JQL" className="md:col-span-2" />
                    <Input placeholder="Assignee" />
                    <Input placeholder="Status (e.g., In Progress)" />
                    <Input placeholder="JQL (advanced)" className="md:col-span-3" />
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Add</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            id: 'PAY-9901',
                            summary: 'Retry logic for 3DS challenge',
                            status: 'To Do',
                          },
                          {
                            id: 'PAY-9903',
                            summary: 'Alert on chargeback anomalies',
                            status: 'In Progress',
                          },
                        ].map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium">{r.id}</TableCell>
                            <TableCell>{r.summary}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{r.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm">Add</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Select "Jira Ticket Selection" to manage tickets for this release. Other steps will
              show their respective details here.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity & Comments */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>History & Collaboration</CardTitle>
          <CardDescription>Immutable activity log and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity">
            <TabsList>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="mt-4">
              <div className="space-y-3">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-foreground/70 mt-1.5" />
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">{a.who}</span>{' '}
                        <span className="text-muted-foreground">{a.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{a.at}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (comment.trim()) {
                        alert('Comment posted (demo)');
                        setComment('');
                      }
                    }}
                  >
                    Post
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Alex Kim:</span> Please prioritize SAST results
                    today.
                  </div>
                  <div>
                    <span className="font-medium">QA Payments:</span> Test plan updated with
                    negative cases.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
