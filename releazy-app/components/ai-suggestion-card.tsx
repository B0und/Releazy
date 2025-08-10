'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

import { useState } from 'react';

export function AISuggestionCard({
  id = 'TCK-0000',
  summary = 'Suggested ticket summary',
  why = 'Because it relates to the current stage and has high value.',
  onAddAction = () => {},
}: {
  id?: string;
  summary?: string;
  why?: string;
  onAddAction?: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleAdd = () => {
    setIsRemoving(true);
    // Wait for animation to complete before calling onAddAction
    setTimeout(() => {
      onAddAction();
    }, 300);
  };
  
  return (
    <Card 
      className={`border-dashed border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        isRemoving ? 'animate-out fade-out slide-out-to-right-4 duration-300' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          <span className="text-purple-600 dark:text-purple-400">{id}</span> — {summary}
        </div>
        <div className="text-xs text-muted-foreground mt-2 bg-purple-50 dark:bg-purple-950/30 p-2 rounded-md">
          <span className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-300 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Why suggested:
          </span>{' '}
          {why}
        </div>
        <div className="mt-2">
          <Button 
            size="sm" 
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
            disabled={isRemoving}
          >
            + Add to Release
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
