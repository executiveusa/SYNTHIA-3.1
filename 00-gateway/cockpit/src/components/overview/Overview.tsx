'use client'
import { motion } from 'framer-motion'
import { Activity, MessageSquare, Cpu, Users, TrendingUp, Zap, GitBranch, Globe } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import { StatusDot } from '@/components/ui/StatusDot'
import type { PanelId } from '@/types'

const STATS = [
  { id: 'agents',   label: 'Agents Online',    icon: Cpu,          value: '1',  sub: 'ALEX active',        color: 'text-gold-500' },
  { id: 'messages', label: 'Messages Today',   icon: MessageSquare, value: '24', sub: '3 unread WA',        color: 'text-signal-green' },
  { id: 'tasks',    label: 'Tasks Running',    icon: Activity,     value: '0',  sub: 'All queued',         color: 'text-signal-blue' },
  { id: 'clients',  label: 'Active Clients',   icon: Users,        value: '0',  sub: 'Add first client',   color: 'text-signal-purple' },
]

const QUICK_ACTIONS: { label: string; icon: React.ElementType; panel: PanelId; desc: string }[] = [
  { label: 'Chat with ALEX',   icon: Zap,         panel: 'alex',     desc: 'Ask your AI agent anything' },
  { label: 'Open Terminal',    icon: Activity,    panel: 'terminal', desc: 'Direct shell access' },
  { label: 'WhatsApp',         icon: MessageSquare, panel: 'whatsapp', desc: '3 unread messages' },
  { label: 'Secrets Vault',    icon: GitBranch,   panel: 'vault',    desc: 'Manage API keys' },
  { label: 'Agent Monitor',    icon: Cpu,         panel: 'agents',   desc: 'Watch ALEX in action' },
  { label: 'Clients',          icon: Users,       panel: 'clients',  desc: 'Manage your client base' },
]

export function Overview() {
  const { agents, setActivePanel } = useCockpitStore()
  const alex = agents.find((a) => a.id === 'alex-001')

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-r from-gold-500/5 via-transparent to-transparent p-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusDot status={alex?.status ?? 'offline'} />
                <span className="text-xs text-text-muted font-mono">ALEX — {alex?.status ?? 'offline'}</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Pauli Command Center</h1>
              <p className="text-text-muted text-sm mt-1">
                Your AI ecosystem is running. All systems operational.
              </p>
            </div>
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-alex-gradient shadow-gold-lg flex items-center justify-center">
              <Zap size={24} className="text-void" />
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="mt-4 flex items-center gap-4 pt-4 border-t border-gold-500/10">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Globe size={11} className="text-signal-green" />
              Cloudflare Tunnel Active
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <GitBranch size={11} className="text-gold-500" />
              pauli-vibe_cockpit
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <TrendingUp size={11} className="text-signal-blue" />
              v1.0.0
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="panel-card p-4 hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <s.icon size={16} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs font-medium text-text-secondary mt-0.5">{s.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a, i) => (
              <motion.button
                key={a.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => setActivePanel(a.panel)}
                className="panel-card p-4 text-left hover:border-gold-500/30 hover:bg-gold-500/3 transition-all group"
              >
                <a.icon size={18} className="text-text-muted group-hover:text-gold-500 transition-colors mb-3" />
                <p className="text-sm font-medium text-text-primary">{a.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{a.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ALEX last actions */}
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h2>
          <div className="panel-card divide-y divide-border">
            {[
              { time: 'Just now',     action: 'ALEX initialized and ready for commands',    type: 'info'    },
              { time: '2m ago',       action: 'Cockpit v1.0.0 deployed to pauli-vibe_cockpit', type: 'success' },
              { time: '5m ago',       action: 'Secrets vault synced from master.env',       type: 'success' },
              { time: '1h ago',       action: 'WhatsApp: 3 messages received',              type: 'message' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  item.type === 'success' ? 'bg-signal-green' :
                  item.type === 'message' ? 'bg-signal-blue' : 'bg-gold-500'
                }`} />
                <span className="text-xs text-text-muted w-16 flex-shrink-0">{item.time}</span>
                <span className="text-xs text-text-secondary">{item.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
