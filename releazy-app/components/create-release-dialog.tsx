'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CreateReleaseDialogProps = {
  defaultName?: string;
};

export function CreateReleaseDialog({
  defaultName = 'MV release v120.4.0',
}: CreateReleaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const router = useRouter();

  function handleCreate() {
    // In a real app, call a Server Action to persist and return the new id.
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setOpen(false);
    router.push(`/releases/${encodeURIComponent(id)}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow hover:from-violet-600/90 hover:to-fuchsia-600/90">
          <Plus className="mr-2 h-4 w-4" />
          Create new release
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create a new release</DialogTitle>
          <DialogDescription>Define the basic details to get started.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">{'Release name'}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">{'Target date'}</Label>
            <div className="flex items-center gap-2">
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">{'Description'}</Label>
            <Textarea
              id="desc"
              rows={4}
              placeholder="What is included in this release?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
