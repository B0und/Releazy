'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function AISuggestionCard({
  id = 'TCK-0000',
  summary = 'Suggested ticket summary',
  why = 'Because it relates to the current stage and has high value.',
  onAdd = () => {},
}: {
  id?: string;
  summary?: string;
  why?: string;
  onAdd?: () => void;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-3">
        <div className="text-sm font-medium">
          {id} — {summary}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Why suggested:
          </span>{' '}
          {why}
        </div>
        <div className="mt-2">
          <Button size="sm" onClick={onAdd}>
            + Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
