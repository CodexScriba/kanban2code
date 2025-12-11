import { useState, useEffect } from 'react';
import type { Task } from '../../../types/task';
import type { MessageEnvelope } from '../../messaging';

interface InitStatePayload {
  tasks: Task[];
  workspaceRoot: string;
}

interface TaskUpdatedPayload {
  tasks: Task[];
}

interface UseTaskDataResult {
  tasks: Task[];
  workspaceRoot: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useTaskData(): UseTaskDataResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaceRoot, setWorkspaceRoot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<MessageEnvelope>) => {
      const message = event.data;
      if (!message?.type) return;

      switch (message.type) {
        case 'InitState': {
          const payload = message.payload as InitStatePayload;
          setTasks(payload.tasks || []);
          setWorkspaceRoot(payload.workspaceRoot || null);
          setIsLoading(false);
          setError(null);
          break;
        }
        case 'TaskUpdated': {
          const payload = message.payload as TaskUpdatedPayload;
          if (payload.tasks) {
            setTasks(payload.tasks);
          }
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Set a timeout for loading state
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('Timeout waiting for task data');
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return {
    tasks,
    workspaceRoot,
    isLoading,
    error,
  };
}
