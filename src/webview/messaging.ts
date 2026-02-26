import { z } from 'zod';
import type { ChatMessage } from '../types/orchestrator';
import { ProviderConfigSchema, type ProviderConfig } from '../types/provider';
import type { WorkspaceSnapshot } from '../types/snapshot';
import type { Stage } from '../types/task';

export const MESSAGE_VERSION = 2 as const;

export const StageSchema = z.enum(['inbox', 'plan', 'code', 'audit', 'completed']);

const TaskCountsSchema = z.object({
  inbox: z.number().int().nonnegative(),
  plan: z.number().int().nonnegative(),
  code: z.number().int().nonnegative(),
  audit: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
}).strict();

// Workspace snapshots are large and evolve over time. Validate required protocol shape and counts.
export const WorkspaceSnapshotSchema: z.ZodType<WorkspaceSnapshot> = z.object({
  config: z.unknown(),
  tasks: z.object({
    inbox: z.array(z.unknown()),
    plan: z.array(z.unknown()),
    code: z.array(z.unknown()),
    audit: z.array(z.unknown()),
    completed: z.array(z.unknown()),
  }).strict(),
  agents: z.array(z.unknown()),
  contexts: z.array(z.unknown()),
  skills: z.array(z.unknown()),
  providers: z.array(z.unknown()),
  metadata: z.object({
    taskCounts: TaskCountsSchema,
    totalTasks: z.number().int().nonnegative(),
    agentCount: z.number().int().nonnegative(),
    contextCount: z.number().int().nonnegative(),
    skillCount: z.number().int().nonnegative(),
    providerCount: z.number().int().nonnegative(),
  }).strict(),
}).strict();

export const ChatMessageSchema: z.ZodType<ChatMessage> = z.object({
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

export const SendMessagePayloadSchema = ChatMessageSchema;
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
}).strict();
export type RunTaskPayload = z.infer<typeof RunTaskPayloadSchema>;

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
  CancelStream: CancelStreamPayload;
};

export type MessageEnvelope<TType extends MessageType = MessageType> = {
  version: typeof MESSAGE_VERSION;
  type: TType;
  payload: MessagePayloadMap[TType];
};

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

export function validateEnvelope<TType extends MessageType = MessageType>(
  data: unknown,
): MessageEnvelope<TType> {
  const result = EnvelopeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid message envelope: ${result.error.message}`);
  }

  return result.data as MessageEnvelope<TType>;
}

export type { Stage };
