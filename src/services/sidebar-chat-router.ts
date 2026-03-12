import type { TaskSnapshotItem } from '../types/task';
import type { AlibabaService } from './alibaba-service';

export const getMockSidebarResponse = (
  provider: string,
  selectedTask: TaskSnapshotItem | null
): string => {
  const scopeLabel = selectedTask ? `${selectedTask.stage} • ${selectedTask.title}` : 'general chat';
  return `Context received (${scopeLabel}) via provider ${provider}.`;
};

export const resolveSidebarChatResponse = async (
  provider: string,
  message: string,
  selectedTask: TaskSnapshotItem | null,
  alibabaService: Pick<AlibabaService, 'sendMessage'>
): Promise<string> => {
  if (provider !== 'alibaba') {
    return getMockSidebarResponse(provider, selectedTask);
  }

  try {
    return await alibabaService.sendMessage(
      {
        message,
        selectedTask
      },
      selectedTask?.project
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Alibaba error: ${errorMessage}`;
  }
};
