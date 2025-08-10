'use client';

import type React from 'react';

import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CreateReleaseDialog } from '@/components/create-release-dialog';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ListFilter, Search } from 'lucide-react';

type Release = {
  id: string;
  name: string;
  status: 'Planned' | 'In progress' | 'Done' | 'Canceled';
  progress: number;
  start: string;
  end?: string;
};

const releasesSeed: Release[] = [
  {
    id: 'mv-release-v120-4-0',
    name: 'MV release v120.4.0',
    status: 'In progress',
    progress: 68,
    start: '2025-08-01',
  },
  {
    id: 'mv-release-v120-3-0',
    name: 'MV release v120.3.0',
    status: 'Done',
    progress: 100,
    start: '2025-07-15',
    end: '2025-07-29',
  },
  {
    id: 'hotfix-ssrm-948',
    name: 'Hotfix SSRM-948',
    status: 'Done',
    progress: 100,
    start: '2025-07-20',
    end: '2025-07-20',
  },
];

const STATUS: Array<Release['status'] | 'All'> = [
  'All',
  'Planned',
  'In progress',
  'Done',
  'Canceled',
];

export default function ReleasesPage() {
  const router = useRouter();
  const [status, setStatus] = useState<(typeof STATUS)[number]>('All');
  const [query, setQuery] = useState('');
  const [releases] = useState<Release[]>(releasesSeed);

  const filtered = useMemo(() => {
    return releases.filter((r) => {
      const matchesStatus = status === 'All' ? true : r.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery = q.length
        ? r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [releases, status, query]);

  const counts = useMemo(() => {
    return {
      total: releases.length,
      planned: releases.filter((r) => r.status === 'Planned').length,
      inProgress: releases.filter((r) => r.status === 'In progress').length,
      done: releases.filter((r) => r.status === 'Done').length,
    };
  }, [releases]);

  return (
    <AppShell
      title="Releases"
      subtitle="Plan, track, and automate release pipelines"
      action={<CreateReleaseDialog />}
    >
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
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
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
                    <span className="whitespace-nowrap">{status}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {STATUS.map((s) => (
                    <DropdownMenuItem 
                      key={s} 
                      onClick={() => setStatus(s)}
                      className={status === s ? "bg-accent font-medium" : ""}
                    >
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2 whitespace-nowrap">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => fakeExport('csv')}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fakeExport('xlsx')}>
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fakeExport('json')}>JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 overflow-auto">
            <Table className="min-w-[720px] border-collapse">
              <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <TableRow className="border-b border-muted">
                  <TableHead className="w-[48%] py-3 font-semibold">Name</TableHead>
                  <TableHead className="py-3 font-semibold">Status</TableHead>
                  <TableHead className="py-3 font-semibold">Progress</TableHead>
                  <TableHead className="py-3 font-semibold">Dates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No releases found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <HoverableRow key={r.id} onClick={() => router.push(`/releases/${r.id}`)}>
                      <TableCell className="py-3 font-medium">
                        <span className="underline-offset-4 hover:underline">{r.name}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant={
                            r.status === 'Done'
                              ? 'default'
                              : r.status === 'Canceled'
                                ? 'destructive'
                                : r.status === 'In progress'
                                  ? 'outline'
                                  : 'secondary'
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ${
                            r.status === 'Done' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : r.status === 'Canceled'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : r.status === 'In progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                          aria-label={`Status: ${r.status}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${
                            r.status === 'Done' 
                              ? 'bg-green-500 dark:bg-green-400'
                              : r.status === 'Canceled'
                                ? 'bg-red-500 dark:bg-red-400'
                                : r.status === 'In progress'
                                  ? 'bg-blue-500 dark:bg-blue-400'
                                  : 'bg-amber-500 dark:bg-amber-400'
                          }`} />
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[220px] py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <div className={`h-2 w-full overflow-hidden rounded-full ${
                              r.status === 'Done'
                                ? 'bg-green-100 dark:bg-green-950/50'
                                : r.status === 'Canceled'
                                  ? 'bg-red-100 dark:bg-red-950/50'
                                  : r.status === 'In progress'
                                    ? 'bg-blue-100 dark:bg-blue-950/50'
                                    : 'bg-amber-100 dark:bg-amber-950/50'
                            }`}>
                              <div 
                                className={`h-full transition-all ${
                                  r.status === 'Done'
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-500'
                                    : r.status === 'Canceled'
                                      ? 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-500'
                                      : r.status === 'In progress'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500'
                                        : 'bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-500'
                                }`}
                                style={{ width: `${r.progress}%` }}
                              />
                            </div>
                            {r.progress > 0 && r.progress < 100 && (
                              <div 
                                className="absolute right-0 top-0 h-3 w-1 animate-pulse rounded-r-full bg-white dark:bg-black" 
                                style={{ 
                                  width: '2px', 
                                  opacity: 0.5,
                                  right: `${100 - r.progress}%` 
                                }}
                              />
                            )}
                          </div>
                          <span className={`w-12 text-right text-xs font-semibold ${
                            r.status === 'Done'
                              ? 'text-green-700 dark:text-green-400'
                              : r.status === 'Canceled'
                                ? 'text-red-700 dark:text-red-400'
                                : r.status === 'In progress'
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-amber-700 dark:text-amber-400'
                          }`}>
                            {r.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {r.end ? `${r.start} → ${r.end}` : `${r.start} →`}
                      </TableCell>
                    </HoverableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <Badge className="rounded-full">{value}</Badge>
    </span>
  );
}

function HoverableRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <TableRow
      onClick={onClick}
      className="cursor-pointer border-b border-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 hover:bg-accent/50"
      tabIndex={0}
      role="button"
      aria-label="Open release details"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </TableRow>
  );
}

/**
 * Demo export handler placeholder.
 */
function fakeExport(fmt: 'csv' | 'xlsx' | 'json') {
  const friendly = fmt === 'xlsx' ? 'Excel' : fmt.toUpperCase();
  // eslint-disable-next-line no-alert
  alert(`Exported as ${friendly}`);
}
