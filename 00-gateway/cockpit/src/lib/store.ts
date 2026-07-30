import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent, ChatMessage, WAContact, WAMessage, VaultEntry, Client, PanelId } from '@/types'

interface CockpitState {
  // Layout
  activePanel: PanelId
  sidebarCollapsed: boolean
  setActivePanel: (id: PanelId) => void
  toggleSidebar: () => void

  // ALEX Chat
  alexMessages: ChatMessage[]
  alexThinking: boolean
  addAlexMessage: (msg: ChatMessage) => void
  setAlexThinking: (v: boolean) => void
  clearAlexChat: () => void

  // Agents
  agents: Agent[]
  selectedAgentId: string | null
  setAgents: (agents: Agent[]) => void
  setSelectedAgent: (id: string | null) => void
  updateAgent: (id: string, patch: Partial<Agent>) => void

  // WhatsApp
  waContacts: WAContact[]
  waMessages: WAMessage[]
  activeContactId: string | null
  setWAContacts: (c: WAContact[]) => void
  addWAMessage: (m: WAMessage) => void
  setActiveContact: (id: string | null) => void

  // Vault
  vaultLocked: boolean
  vaultEntries: VaultEntry[]
  setVaultLocked: (v: boolean) => void
  setVaultEntries: (e: VaultEntry[]) => void

  // Clients
  clients: Client[]
  setClients: (c: Client[]) => void

  // Settings
  locale: 'en' | 'es'
  cloudflareUrl: string
  githubToken: string
  anthropicKey: string
  whatsappToken: string
  setLocale: (l: 'en' | 'es') => void
  setSetting: (key: string, value: string) => void
}

export const useCockpitStore = create<CockpitState>()(
  persist(
    (set, get) => ({
      // Layout
      activePanel: 'overview',
      sidebarCollapsed: false,
      setActivePanel: (id) => set({ activePanel: id }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

      // ALEX Chat
      alexMessages: [],
      alexThinking: false,
      addAlexMessage: (msg) => set({ alexMessages: [...get().alexMessages, msg] }),
      setAlexThinking: (v) => set({ alexThinking: v }),
      clearAlexChat: () => set({ alexMessages: [] }),

      // Agents
      agents: [
        {
          id: 'alex-001',
          name: 'ALEX',
          role: 'Lead AI Agent',
          status: 'online',
          model: 'claude-sonnet-4-6',
          lastAction: 'Waiting for instructions',
          tokensUsed: 0,
        },
      ],
      selectedAgentId: 'alex-001',
      setAgents: (agents) => set({ agents }),
      setSelectedAgent: (id) => set({ selectedAgentId: id }),
      updateAgent: (id, patch) =>
        set({ agents: get().agents.map((a) => (a.id === id ? { ...a, ...patch } : a)) }),

      // WhatsApp
      waContacts: [],
      waMessages: [],
      activeContactId: null,
      setWAContacts: (c) => set({ waContacts: c }),
      addWAMessage: (m) => set({ waMessages: [...get().waMessages, m] }),
      setActiveContact: (id) => set({ activeContactId: id }),

      // Vault
      vaultLocked: true,
      vaultEntries: [],
      setVaultLocked: (v) => set({ vaultLocked: v }),
      setVaultEntries: (e) => set({ vaultEntries: e }),

      // Clients
      clients: [],
      setClients: (c) => set({ clients: c }),

      // Settings
      locale: 'en',
      cloudflareUrl: '',
      githubToken: '',
      anthropicKey: '',
      whatsappToken: '',
      setLocale: (l) => set({ locale: l }),
      setSetting: (key, value) => set({ [key]: value } as Partial<CockpitState>),
    }),
    {
      name: 'pauli-cockpit',
      partialize: (s) => ({
        locale: s.locale,
        sidebarCollapsed: s.sidebarCollapsed,
        cloudflareUrl: s.cloudflareUrl,
        githubToken: s.githubToken,
        anthropicKey: s.anthropicKey,
        whatsappToken: s.whatsappToken,
      }),
    }
  )
)
