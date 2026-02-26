import { z } from 'zod';
import type { Kanban2CodeConfig } from '../types/config';
import { ProviderConfigSchema, type ProviderConfig } from '../types/provider';
import type { WorkspaceSnapshot } from '../types/snapshot';
import type { Stage, Task } from '../types/task';
import type { Agent, ContextFile, ProviderConfigFile, SkillFile } from '../types/workspace-entities';

export const MESSAGE_VERSION = 2 as const;

export const StageSchema = z.enum(['inbox', 'plan', 'code', 'audit', 'completed']);

const TaskCountsSchema = z.object({
  inbox: z.number().int().nonnegative(),
  plan: z.number().int().nonnegative(),
  code: z.number().int().nonnegative(),
  audit: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
}).strict();

const TaskSchema = z.custom<Task>();
const AgentSchema = z.custom<Agent>();
const ContextSchema = z.custom<ContextFile>();
const SkillSchema = z.custom<SkillFile>();
const ProviderFileSchema = z.custom<ProviderConfigFile>();

// Workspace snapshots are large and evolve over time. Validate required protocol shape and counts.
export const WorkspaceSnapshotSchema: z.ZodType<WorkspaceSnapshot> = z.object({
  config: z.custom<Kanban2CodeConfig>(),
  tasks: z.object({
    inbox: z.array(TaskSchema),
    plan: z.array(TaskSchema),
    code: z.array(TaskSchema),
    audit: z.array(TaskSchema),
    completed: z.array(TaskSchema),
  }).strict(),
  agents: z.array(AgentSchema),
  contexts: z.array(ContextSchema),
  skills: z.array(SkillSchema),
  providers: z.array(ProviderFileSchema),
  metadata: z.object({
    taskCounts: TaskCountsSchema,
    totalTasks: z.number().int().nonnegative(),
    agentCount: z.number().int().nonnegative(),
    contextCount: z.number().int().nonnegative(),
    skillCount: z.number().int().nonnegative(),
    providerCount: z.number().int().nonnegative(),
  }).strict(),
}).strict();

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
}).strict();

export const ActiveProviderSchema: z.ZodType<ProviderConfig> = ProviderConfigSchema.strict();

export const InitStatePayloadSchema = z.object({
  kanbanRootExists: z.boolean(),
  workspaceSnapshot: WorkspaceSnapshotSchema,
  activeProvider: ActiveProviderSchema.nullable(),
}).strict();
export type InitStatePayload = z.infer<typeof InitStatePayloadSchema>;

export const StreamChunkPayloadSchema = z.object({
  token: z.string(),
}).strict();
export type StreamChunkPayload = z.infer<typeof StreamChunkPayloadSchema>;

export const MessageCompletePayloadSchema = z.object({}).strict();
export type MessageCompletePayload = z.infer<typeof MessageCompletePayloadSchema>;

export const TaskGeneratedPayloadSchema = z.object({
  path: z.string(),
  title: z.string(),
}).strict();
export type TaskGeneratedPayload = z.infer<typeof TaskGeneratedPayloadSchema>;

export const WorkspaceUpdatedPayloadSchema = z.object({
  workspaceSnapshot: WorkspaceSnapshotSchema,
}).strict();
export type WorkspaceUpdatedPayload = z.infer<typeof WorkspaceUpdatedPayloadSchema>;

export const ErrorPayloadSchema = z.object({
  message: z.string(),
}).strict();
export type ErrorPayload = z.infer<typeof ErrorPayloadSchema>;

export const RequestStatePayloadSchema = z.object({}).strict();
export type RequestStatePayload = z.infer<typeof RequestStatePayloadSchema>;

export const SendMessagePayloadSchema = ChatMessageSchema.extend({
  providerId: z.string().min(1).optional(),
}).strict();
export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;

export const GenerateTaskPayloadSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  stage: StageSchema,
  agent: z.string().optional(),
  tags: z.array(z.string()).optional(),
  project: z.string().optional(),
  phase: z.string().optional(),
  contexts: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
}).strict();
export type GenerateTaskPayload = z.infer<typeof GenerateTaskPayloadSchema>;

export const RunTaskPayloadSchema = z.object({
  taskFilePath: z.string(),
  allRemaining: z.boolean().optional(),
}).strict();
export type RunTaskPayload = z.infer<typeof RunTaskPayloadSchema>;

export const SaveTaskPayloadSchema = z.object({
  taskFilePath: z.string(),
  title: z.string().min(1),
  stage: StageSchema,
  content: z.string(),
  agent: z.string().optional(),
  provider: z.string().optional(),
  tags: z.array(z.string()).optional(),
  contexts: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  project: z.string().optional(),
  phase: z.string().optional(),
}).strict();
export type SaveTaskPayload = z.infer<typeof SaveTaskPayloadSchema>;

export const CancelStreamPayloadSchema = z.object({}).strict();
export type CancelStreamPayload = z.infer<typeof CancelStreamPayloadSchema>;

export const HostToWebviewMessageTypes = [
  'InitState',
  'StreamChunk',
  'MessageComplete',
  'TaskGenerated',
  'WorkspaceUpdated',
  'Error',
] as const;

export const WebviewToHostMessageTypes = [
  'RequestState',
  'SendMessage',
  'GenerateTask',
  'RunTask',
  'SaveTask',
  'CancelStream',
] as const;

export type HostToWebviewMessageType = (typeof HostToWebviewMessageTypes)[number];
export type WebviewToHostMessageType = (typeof WebviewToHostMessageTypes)[number];
export type MessageType = HostToWebviewMessageType | WebviewToHostMessageType;

export type MessagePayloadMap = {
  InitState: InitStatePayload;
  StreamChunk: StreamChunkPayload;
  MessageComplete: MessageCompletePayload;
  TaskGenerated: TaskGeneratedPayload;
  WorkspaceUpdated: WorkspaceUpdatedPayload;
  Error: ErrorPayload;
  RequestState: RequestStatePayload;
  SendMessage: SendMessagePayload;
  GenerateTask: GenerateTaskPayload;
  RunTask: RunTaskPayload;
  SaveTask: SaveTaskPayload;
  CancelStream: CancelStreamPayload;
};

export type MessageEnvelope<TType extends MessageType> = {
  version: typeof MESSAGE_VERSION;
  type: TType;
  payload: MessagePayloadMap[TType];
};

export type AnyMessageEnvelope = {
  [TType in MessageType]: MessageEnvelope<TType>;
}[MessageType];

const InitStateEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('InitState'),
  payload: InitStatePayloadSchema,
}).strict();

const StreamChunkEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('StreamChunk'),
  payload: StreamChunkPayloadSchema,
}).strict();

const MessageCompleteEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('MessageComplete'),
  payload: MessageCompletePayloadSchema,
}).strict();

const TaskGeneratedEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('TaskGenerated'),
  payload: TaskGeneratedPayloadSchema,
}).strict();

const WorkspaceUpdatedEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('WorkspaceUpdated'),
  payload: WorkspaceUpdatedPayloadSchema,
}).strict();

const ErrorEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('Error'),
  payload: ErrorPayloadSchema,
}).strict();

const RequestStateEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('RequestState'),
  payload: RequestStatePayloadSchema,
}).strict();

const SendMessageEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('SendMessage'),
  payload: SendMessagePayloadSchema,
}).strict();

const GenerateTaskEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('GenerateTask'),
  payload: GenerateTaskPayloadSchema,
}).strict();

const RunTaskEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('RunTask'),
  payload: RunTaskPayloadSchema,
}).strict();

const SaveTaskEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('SaveTask'),
  payload: SaveTaskPayloadSchema,
}).strict();

const CancelStreamEnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.literal('CancelStream'),
  payload: CancelStreamPayloadSchema,
}).strict();

export const EnvelopeSchema = z.discriminatedUnion('type', [
  InitStateEnvelopeSchema,
  StreamChunkEnvelopeSchema,
  MessageCompleteEnvelopeSchema,
  TaskGeneratedEnvelopeSchema,
  WorkspaceUpdatedEnvelopeSchema,
  ErrorEnvelopeSchema,
  RequestStateEnvelopeSchema,
  SendMessageEnvelopeSchema,
  GenerateTaskEnvelopeSchema,
  RunTaskEnvelopeSchema,
  SaveTaskEnvelopeSchema,
  CancelStreamEnvelopeSchema,
]);

export function createEnvelope<TType extends MessageType>(
  type: TType,
  payload: MessagePayloadMap[TType],
): MessageEnvelope<TType> {
  return {
    version: MESSAGE_VERSION,
    type,
    payload,
  };
}

export function validateEnvelope(data: unknown): AnyMessageEnvelope {
  const result = EnvelopeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid message envelope: ${result.error.message}`);
  }

  return result.data as AnyMessageEnvelope;
}

export type { Stage };
