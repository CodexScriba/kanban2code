import React, { useEffect, useMemo, useState } from 'react';
import type { WorkspaceSnapshot } from '../../types/snapshot';
import type { Task } from '../../types/task';
import type { TaskProposal } from '../../types/task-proposal';
import type { ProviderConfigFile } from '../../types/workspace-entities';
import { createEnvelope, validateEnvelope } from '../messaging';
import { EmptyState } from './components/EmptyState';
import { Chat } from './components/Chat';
import { BoardPanel } from './components/BoardPanel';
import { TaskEditorPanel } from './components/TaskEditorPanel';
import { useChat, type VsCodePoster } from './hooks/useChat';
import type { TaskEditorSavePayload } from './hooks/useTaskEditor';

interface AppProps {
  vscode?: VsCodePoster;
}

function findTask(snapshot: WorkspaceSnapshot, filePath: string): Task | null {
  for (const stage of ['inbox', 'plan', 'code', 'audit', 'completed'] as const) {
    const found = snapshot.tasks[stage].find((task) => task.filePath === filePath);
    if (found) return found;
  }
  return null;
}

export const App: React.FC<AppProps> = ({ vscode }) => {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot | null>(null);
  const [kanbanRootExists, setKanbanRootExists] = useState(true);
  const [providers, setProviders] = useState<ProviderConfigFile[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [editorTask, setEditorTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const chat = useChat(vscode);

  useEffect(() => {
    vscode?.postMessage(createEnvelope('RequestState', {}));
  }, [vscode]);

  useEffect(() => {
    const listener = (event: MessageEvent<unknown>) => {
      try {
        const envelope = validateEnvelope(event.data);
        switch (envelope.type) {
          case 'InitState': {
            setKanbanRootExists(envelope.payload.kanbanRootExists);
            setSnapshot(envelope.payload.workspaceSnapshot);
            setProviders(envelope.payload.workspaceSnapshot.providers);
            if (envelope.payload.activeProvider) {
              const selected = envelope.payload.workspaceSnapshot.providers.find(
                (provider) =>
                  provider.config?.cli === envelope.payload.activeProvider?.cli
                  && provider.config?.model === envelope.payload.activeProvider?.model,
              );
              if (selected) setSelectedProvider(selected.id);
            }
            break;
          }
          case 'WorkspaceUpdated':
            setSnapshot(envelope.payload.workspaceSnapshot);
            setProviders(envelope.payload.workspaceSnapshot.providers);
            break;
          case 'StreamChunk':
            chat.handleStreamChunk(envelope.payload.token);
            break;
          case 'MessageComplete':
            chat.handleMessageComplete();
            break;
          case 'Error':
            chat.handleError(envelope.payload.message);
            break;
          case 'TaskGenerated':
            chat.handleMessageComplete();
            break;
          default:
            break;
        }
      } catch {
        // Ignore unrecognized messages from VS Code internals
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [chat]);

  useEffect(() => {
    if (!snapshot || !editorTask) return;
    const latest = findTask(snapshot, editorTask.filePath);
    if (latest) {
      setEditorTask(latest);
    }
  }, [editorTask, snapshot]);

  const hasProvider = useMemo(() => {
    if (!selectedProvider) return false;
    return providers.some((provider) => provider.id === selectedProvider);
  }, [providers, selectedProvider]);

  const handleGenerateTask = (proposal: TaskProposal) => {
    vscode?.postMessage(createEnvelope('GenerateTask', {
      title: proposal.title,
      description: proposal.description,
      stage: proposal.stage,
      agent: proposal.agent,
      tags: proposal.tags,
      project: proposal.project,
      phase: proposal.phase,
      contexts: proposal.contexts,
      skills: proposal.skills,
    }));
  };

  const handleRunTask = (task: Task, allRemaining: boolean) => {
    vscode?.postMessage(createEnvelope('RunTask', { taskFilePath: task.filePath, allRemaining }));
  };

  const handleSaveTask = (payload: TaskEditorSavePayload) => {
    vscode?.postMessage(createEnvelope('SaveTask', payload));
    setIsEditorOpen(false);
  };

  if (!kanbanRootExists || !snapshot) {
    return (
      <EmptyState
        onCreateKanban={() => {
          window.alert('Create a .kanban2code workspace in your project root, then reopen the sidebar.');
        }}
      />
    );
  }

  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateColumns: 'minmax(300px, 36%) 1fr', minWidth: 0 }}>
      <Chat
        snapshot={snapshot}
        messages={chat.messages}
        providers={providers}
        selectedProvider={selectedProvider}
        hasProvider={hasProvider}
        isStreaming={chat.isStreaming}
        error={chat.error}
        onProviderChange={setSelectedProvider}
        onSend={(message) => chat.sendMessage(message, selectedProvider || undefined)}
        onCancel={chat.cancelStream}
        onGenerateTask={handleGenerateTask}
      />
      <BoardPanel
        snapshot={snapshot}
        onRunTask={(task, allRemaining) => handleRunTask(task, allRemaining)}
        onEditTask={(task) => {
          setEditorTask(task);
          setIsEditorOpen(true);
        }}
      />
      <TaskEditorPanel
        task={editorTask}
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};
