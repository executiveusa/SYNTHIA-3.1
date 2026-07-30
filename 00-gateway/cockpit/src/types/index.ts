// ─── Agent ───────────────────────────────────────────────────────────────────
export type AgentStatus = 'online' | 'busy' | 'offline' | 'error'

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  model: string
  lastAction?: string
  currentTask?: string
  screenshot?: string   // base64 or URL — live view of what agent sees
  browserUrl?: string
  filesOpen?: string[]
  tokensUsed?: number
  startedAt?: Date
}

// ─── Message ─────────────────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  toolName?: string
  toolInput?: Record<string, unknown>
  toolOutput?: string
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
export interface WAContact {
  id: string
  name: string
  phone: string
  lastMessage?: string
  lastSeen?: Date
  unread: number
  avatar?: string
}

export interface WAMessage {
  id: string
  contactId: string
  direction: 'in' | 'out'
  body: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'failed'
}

// ─── Secrets Vault ────────────────────────────────────────────────────────────
export interface VaultEntry {
  id: string
  key: string
  value?: string        // only shown when unlocked
  category: 'api' | 'ssh' | 'db' | 'env' | 'other'
  repo?: string
  notes?: string
  updatedAt: Date
}

// ─── Client (GoHighLevel-style) ───────────────────────────────────────────────
export interface Client {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  plan: 'starter' | 'pro' | 'enterprise'
  agents: string[]   // agent IDs
  status: 'active' | 'paused' | 'trial'
  createdAt: Date
}

// ─── Panel IDs ────────────────────────────────────────────────────────────────
export type PanelId =
  | 'overview'
  | 'alex'
  | 'agents'
  | 'terminal'
  | 'whatsapp'
  | 'vault'
  | 'clients'
  | 'settings'

// ─── i18n ─────────────────────────────────────────────────────────────────────
export type Locale = 'en' | 'es'
