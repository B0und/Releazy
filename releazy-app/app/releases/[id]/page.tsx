'use client';

import { AppShell } from '@/components/app-shell';
import { useParams } from 'next/navigation';
import ReleaseDetailsWidgets from '@/components/ReleaseDetailsWidgets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ClipboardList, XCircle } from 'lucide-react';
import { ReleaseLogDialog } from '@/components/release-log-dialog';

export default function ReleaseDetailPage() {
  const { id } = useParams<{ id: string }>();

  const name = decodeURIComponent(Array.isArray(id) ? id[0] : id)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (s) => s.toUpperCase());

  return (
    <AppShell 
      title={name} 
      subtitle="Manage scope, check automation, and ship with confidence"
      action={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              variant="destructive"
              onClick={() => console.log('Cancel release clicked')}
              className="hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <div className="flex items-center gap-2 w-full">
                <XCircle className="h-4 w-4" />
                <span>Cancel Release</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ReleaseLogDialog 
                releaseId={Array.isArray(id) ? id[0] : id}
                releaseName={name}
                activity={[
                  { at: 'Aug 07, 10:21', who: 'SecOps Bot', action: 'Security checks queued (SAST, DAST).' },
                  { at: 'Aug 06, 16:03', who: 'Alex Kim', action: 'Moved Testing to In Progress.' },
                  { at: 'Aug 05, 09:47', who: 'QA Payments', action: 'Attached test plan v2.' },
                  { at: 'Aug 04, 11:20', who: 'Release Eng', action: `Created release ${Array.isArray(id) ? id[0] : id}.` },
                ]}
              >
                <div className="flex items-center gap-2 w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-sm px-2 py-1.5">
                  <ClipboardList className="h-4 w-4 text-blue-500" />
                  <span>Release Log</span>
                </div>
              </ReleaseLogDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <div className="flex min-h-[60vh] flex-col gap-4 lg:min-h-[calc(100dvh-220px)]">
        <ReleaseDetailsWidgets params={{ id }} />
      </div>
    </AppShell>
  );
}
