'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type ActivityItem = {
  at: string;
  who: string;
  action: string;
};

type ReleaseLogDialogProps = {
  releaseId: string;
  releaseName: string;
  activity: ActivityItem[];
  children?: React.ReactNode;
};

export function ReleaseLogDialog({ 
  releaseId, 
  releaseName, 
  activity = [], 
  children 
}: ReleaseLogDialogProps) {
  const [comment, setComment] = useState<string>('');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">Release Log</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>History & Collaboration</DialogTitle>
          <DialogDescription>
            Immutable activity log and comments for {releaseName} ({releaseId})
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="activity" className="mt-4">
          <TabsList>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="mt-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
              <div className="space-y-2 text-sm max-h-[350px] overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
}