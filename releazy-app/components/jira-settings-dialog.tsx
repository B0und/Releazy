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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings } from 'lucide-react';

type JiraSettingsDialogProps = {
  trigger?: React.ReactNode;
};

export function JiraSettingsDialog({ trigger }: JiraSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  const handleProjectSelect = (value: string) => {
    if (!selectedProjects.includes(value)) {
      setSelectedProjects([...selectedProjects, value]);
    }
  };
  
  // Mock projects - in a real app, these would be fetched from the Jira API
  const availableProjects = [
    { id: 'PROJ1', name: 'Project One' },
    { id: 'PROJ2', name: 'Project Two' },
    { id: 'PROJ3', name: 'Project Three' },
  ];

  function handleSave() {
    // In a real app, save the settings to localStorage or backend
    console.log('Saving Jira settings:', { apiKey, selectedProjects });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Jira Settings</DialogTitle>
          <DialogDescription>Configure your Jira integration settings.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">Jira API Key</Label>
            <Input 
              id="apiKey" 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Jira API key"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="projects">Projects</Label>
            <Select onValueChange={handleProjectSelect}>
              <SelectTrigger id="projects">
                <SelectValue placeholder="Select projects to work with" />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProjects.map(projectId => {
                  const project = availableProjects.find(p => p.id === projectId);
                  return (
                    <div key={projectId} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center">
                      {project?.name}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setSelectedProjects(selectedProjects.filter(id => id !== projectId))}
                      >
                        ×
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Select the Jira projects you want to work with in Releazy.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}