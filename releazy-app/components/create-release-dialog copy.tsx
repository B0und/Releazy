'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReleaseStore } from '@/lib/store';
import { nanoid } from 'nanoid';

export function CreateReleaseDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Q3 Web Release');
  const [version, setVersion] = useState('1.2.3');
  const [jql, setJql] = useState('fixVersion = 1.2.3 ORDER BY priority DESC');
  const { addRelease } = useReleaseStore();

  const onCreate = () => {
    const id = nanoid(10);
    addRelease({
      id,
      name,
      version,
      jql,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children ?? <Button>Create release</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Release</DialogTitle>
          <DialogDescription>
            Define a new release and optionally prefill with a JQL query.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="rel-name">Name</Label>
            <Input
              id="rel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., API Monolith"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rel-version">Version</Label>
            <Input
              id="rel-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 2.5.0"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rel-jql">JQL (optional)</Label>
            <Input
              id="rel-jql"
              value={jql}
              onChange={(e) => setJql(e.target.value)}
              placeholder="e.g., fixVersion = 2.5.0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
