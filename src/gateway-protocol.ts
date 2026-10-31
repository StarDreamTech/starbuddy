// 星搭子本地网关协议（第 0 期草案）：守护进程只监听 127.0.0.1，外壳、CLI、星笺都是客户端。
// 帧分 req / res / event 三种，设计参考 OpenClaw（MIT）网关；详见 docs/architecture.md。

export const protocolVersion = 1;

export type Role = 'shell' | 'cli' | 'starclip' | 'hook';
export type Scope = 'tasks' | 'pet' | 'approvals' | 'memory';
export type TaskStatus = 'queued' | 'thinking' | 'working' | 'waiting' | 'success' | 'error';
export type AgentId = 'claude-code' | 'codex' | 'acp';

export interface ConnectParams { role: Role; scopes: Scope[]; token: string; protocol: number }
export interface TaskCreateParams { text: string; project?: string }
export interface Dispatch {
  project: string;
  agent: AgentId;
  model: string;
  effort: 'low' | 'medium' | 'high';
  session: { mode: 'new' } | { mode: 'resume'; id: string };
  skills: string[];
  permission: 'read-only' | 'edit-files' | 'full-auto';
  reason: string;
}

export type Request =
  | { type: 'req'; id: number; method: 'connect'; params: ConnectParams }
  | { type: 'req'; id: number; method: 'task.create'; params: TaskCreateParams }
  | { type: 'req'; id: number; method: 'approval.answer'; params: { approval: string; allow: boolean } };

export type Response =
  | { type: 'res'; id: number; ok: true; result?: unknown }
  | { type: 'res'; id: number; ok: false; error: { code: string; message: string } };

export type Event =
  | { type: 'event'; event: 'task.status'; data: { task: string; status: TaskStatus; agent?: AgentId; message?: string } }
  | { type: 'event'; event: 'task.dispatch'; data: { task: string; dispatch: Dispatch } }
  | { type: 'event'; event: 'approval.request'; data: { approval: string; task: string; action: string } };

export type Frame = Request | Response | Event;

const methods = new Set(['connect', 'task.create', 'approval.answer']);
const roles = new Set<Role>(['shell', 'cli', 'starclip', 'hook']);
const scopes = new Set<Scope>(['tasks', 'pet', 'approvals', 'memory']);

/** 解析客户端发来的一行 JSON；不认识的方法、角色或范围一律拒绝，不做宽松兼容。 */
export function parseRequest(line: string): Request | null {
  let value: unknown;
  try { value = JSON.parse(line); } catch { return null; }
  if (!value || typeof value !== 'object') return null;
  const frame = value as Record<string, unknown>;
  if (frame.type !== 'req' || !Number.isSafeInteger(frame.id) || typeof frame.method !== 'string' || !methods.has(frame.method)) return null;
  const params = frame.params as Record<string, unknown> | undefined;
  if (!params || typeof params !== 'object') return null;
  if (frame.method === 'connect') {
    if (!roles.has(params.role as Role) || typeof params.token !== 'string' || params.protocol !== protocolVersion) return null;
    if (!Array.isArray(params.scopes) || !params.scopes.every(scope => scopes.has(scope as Scope))) return null;
  }
  if (frame.method === 'task.create' && (typeof params.text !== 'string' || !params.text.trim())) return null;
  if (frame.method === 'approval.answer' && (typeof params.approval !== 'string' || typeof params.allow !== 'boolean')) return null;
  return value as Request;
}
