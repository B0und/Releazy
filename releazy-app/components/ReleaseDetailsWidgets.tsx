'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

const initialSuggestionData = [
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

// Activity data moved to release-log-dialog component

export default function ReleaseDetailsWidgets({ params }: { params: { id: string } }) {
  const [release, setRelease] = useState<Release>(() => {
    const releaseId = Array.isArray(params.id) ? params.id[0] : params.id;
    return releaseId === MOCK_RELEASE.id ? MOCK_RELEASE : MOCK_RELEASE;
  });
  const [suggestions, setSuggestions] = useState(initialSuggestionData);
  const [activeStep, setActiveStep] = useState<string>(
    release?.steps.find((s) => s.status === 'in-progress')?.id ?? 'ticket'
  );

  if (!release) return notFound();

  const active = release.steps.find((s) => s.id === activeStep) ?? release.steps[0];

  return (
    <div className="grid gap-6 grid-cols-12">
      {/* Workflow Card - minimal width */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
          <CardDescription>Stages of this release</CardDescription>
        </CardHeader>
        <CardContent>
          <ReleaseStepper steps={release.steps} activeId={activeStep} onSelect={setActiveStep} />
        </CardContent>
      </Card>

      {/* Dynamic Details & Actions - takes remaining space */}
      <Card className="col-span-8">
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
              {suggestions.length > 0 && (
                <div className="rounded-lg border bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <div className="text-sm font-medium">AI Suggestions</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {suggestions.map((s) => (
                      <AISuggestionCard
                        key={s.id}
                        id={s.id}
                        summary={s.summary}
                        why={s.why}
                        onAdd={() => {
                          // Add to tickets
                          setRelease((prev) => ({
                            ...prev,
                            tickets: [
                              ...prev.tickets,
                              { id: s.id, summary: s.summary, status: 'To Do' }
                            ]
                          }));
                          
                          // Remove from suggestions
                          setSuggestions((prev) => 
                            prev.filter((suggestion) => suggestion.id !== s.id)
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

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

      {/* Release Log Dialog is now accessed via dropdown in the releases page */}
    </div>
  );
}
