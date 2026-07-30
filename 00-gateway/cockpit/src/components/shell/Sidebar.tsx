'use client'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
  LayoutDashboard, Bot, Activity, Terminal, MessageSquare,
  KeyRound, Users, Settings, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react'
import type { PanelId } from '@/types'
import { useCockpitStore } from '@/lib/store'
import { StatusDot } from '@/components/ui/StatusDot'

const NAV_ITEMS: { id: PanelId; icon: React.ElementType; labelKey: string }[] = [
  { id: 'overview',  icon: LayoutDashboard, labelKey: 'Overview'     },
  { id: 'alex',      icon: Bot,             labelKey: 'ALEX Chat'    },
  { id: 'agents',    icon: Activity,        labelKey: 'Agents'       },
  { id: 'terminal',  icon: Terminal,        labelKey: 'Terminal'     },
  { id: 'whatsapp',  icon: MessageSquare,   labelKey: 'WhatsApp'     },
  { id: 'vault',     icon: KeyRound,        labelKey: 'Vault'        },
  { id: 'clients',   icon: Users,           labelKey: 'Clients'      },
  { id: 'settings',  icon: Settings,        labelKey: 'Settings'     },
]

export function Sidebar() {
  const { activePanel, sidebarCollapsed, setActivePanel, toggleSidebar, agents } = useCockpitStore()
  const alex = agents.find((a) => a.id === 'alex-001')

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-panel border-r border-border overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border min-h-[64px]">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-alex-gradient flex items-center justify-center shadow-gold">
            <Zap size={18} className="text-void" />
          </div>
          {alex && (
            <span className="absolute -bottom-0.5 -right-0.5">
              <StatusDot status={alex.status} />
            </span>
          )}
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold text-text-primary whitespace-nowrap">Pauli Cockpit</p>
              <p className="text-[11px] text-gold-500 whitespace-nowrap">ALEX Command Center</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const isActive = activePanel === id
          return (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted/40 border border-transparent'
              )}
            >
              <Icon
                size={17}
                className={clsx('flex-shrink-0', isActive ? 'text-gold-500' : 'text-text-muted group-hover:text-text-secondary')}
              />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap font-medium"
                  >
                    {labelKey}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center py-3 border-t border-border text-text-muted hover:text-text-secondary transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  )
}
