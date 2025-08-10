'use client';

import { AppShell } from '@/components/app-shell';
import { useParams } from 'next/navigation';
import ReleaseDetailsWidgets from '@/components/ReleaseDetailsWidgets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

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
            <DropdownMenuItem onClick={() => console.log('Cancel release clicked')}>
              Cancel Release
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Release log clicked')}>
              Release Log
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
