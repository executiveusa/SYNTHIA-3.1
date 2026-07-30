'use client'
import { useEffect } from 'react'
import '@/lib/i18n'
import { Sidebar } from '@/components/shell/Sidebar'
import { TopBar } from '@/components/shell/TopBar'
import { Overview } from '@/components/overview/Overview'
import { AlexChat } from '@/components/agents/AlexChat'
import { AgentMonitor } from '@/components/agents/AgentMonitor'
import { TerminalPanel } from '@/components/terminal/TerminalPanel'
import { WhatsAppPanel } from '@/components/whatsapp/WhatsAppPanel'
import { SecretsVault } from '@/components/vault/SecretsVault'
import { ClientsPanel } from '@/components/clients/ClientsPanel'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { useCockpitStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'

const PANELS = {
  overview: Overview,
  alex:     AlexChat,
  agents:   AgentMonitor,
  terminal: TerminalPanel,
  whatsapp: WhatsAppPanel,
  vault:    SecretsVault,
  clients:  ClientsPanel,
  settings: SettingsPanel,
} as const

export default function CockpitPage() {
  const { activePanel } = useCockpitStore()
  const Panel = PANELS[activePanel as keyof typeof PANELS] ?? Overview

  useEffect(() => {
    document.title = `Pauli Cockpit — ${activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}`
  }, [activePanel])

  return (
    <div className="flex h-screen overflow-hidden bg-void">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
