'use client'
import { motion } from 'framer-motion'
import { Activity, Monitor, FileCode, Globe, Cpu, Play, Square } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import { StatusDot } from '@/components/ui/StatusDot'
import { Badge } from '@/components/ui/Badge'
import clsx from 'clsx'

function AgentCard({ agentId, isSelected, onClick }: {
  agentId: string
  isSelected: boolean
  onClick: () => void
}) {
  const { agents } = useCockpitStore()
  const agent = agents.find((a) => a.id === agentId)
  if (!agent) return null

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-3 rounded-xl border transition-all duration-150',
        isSelected
          ? 'border-gold-500/40 bg-gold-500/5'
          : 'border-border bg-panel hover:border-border/80 hover:bg-muted/20'
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-alex-gradient/20 border border-gold-500/20 flex items-center justify-center">
            <Cpu size={14} className="text-gold-400" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5"><StatusDot status={agent.status} /></span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{agent.name}</p>
          <p className="text-xs text-text-muted truncate">{agent.role}</p>
        </div>
        <Badge variant={agent.status === 'online' ? 'green' : agent.status === 'busy' ? 'gold' : 'muted'}>
          {agent.status}
        </Badge>
      </div>
      {agent.currentTask && (
        <p className="text-xs text-text-secondary mt-2 line-clamp-1 pl-10">
          {agent.currentTask}
        </p>
      )}
    </button>
  )
}

function LiveScreen({ agentId }: { agentId: string }) {
  const { agents } = useCockpitStore()
  const agent = agents.find((a) => a.id === agentId)
  if (!agent) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Screen/Screenshot */}
      <div className="relative bg-void rounded-xl border border-border overflow-hidden aspect-video">
        {agent.screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agent.screenshot} alt="Agent screen" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Monitor size={32} className="text-text-muted" />
            <p className="text-sm text-text-muted">
              {agent.status === 'online' ? 'Agent idle — waiting for tasks' : 'No live view available'}
            </p>
            {agent.status === 'online' && (
              <div className="flex items-center gap-2 text-xs text-signal-green">
                <span className="status-dot online" />
                Ready for commands
              </div>
            )}
          </div>
        )}

        {/* Scan line animation when busy */}
        {agent.status === 'busy' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent animate-scan" />
          </div>
        )}

        {/* Live badge */}
        {agent.status === 'busy' && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-void/80 border border-gold-500/30 rounded-full px-2 py-1">
            <span className="status-dot busy" />
            <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider">Live</span>
          </div>
        )}
      </div>

      {/* Context info */}
      <div className="grid grid-cols-2 gap-2">
        {agent.browserUrl && (
          <div className="panel-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={12} className="text-signal-blue" />
              <span className="text-xs font-medium text-text-muted">Browser</span>
            </div>
            <p className="text-xs text-text-primary font-mono truncate">{agent.browserUrl}</p>
          </div>
        )}
        {agent.tokensUsed !== undefined && (
          <div className="panel-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={12} className="text-gold-500" />
              <span className="text-xs font-medium text-text-muted">Tokens Used</span>
            </div>
            <p className="text-xs text-text-primary font-mono">
              {agent.tokensUsed.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Open files */}
      {agent.filesOpen && agent.filesOpen.length > 0 && (
        <div className="panel-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <FileCode size={12} className="text-signal-purple" />
            <span className="text-xs font-medium text-text-muted">Open Files</span>
          </div>
          <div className="space-y-1">
            {agent.filesOpen.map((f) => (
              <p key={f} className="text-xs text-text-primary font-mono truncate">{f}</p>
            ))}
          </div>
        </div>
      )}

      {/* Current task */}
      {agent.currentTask && (
        <div className="panel-card p-3 border-gold-500/15">
          <div className="flex items-center gap-2 mb-1">
            <Play size={12} className="text-signal-green" />
            <span className="text-xs font-medium text-text-muted">Current Task</span>
          </div>
          <p className="text-xs text-text-primary">{agent.currentTask}</p>
        </div>
      )}
    </div>
  )
}

export function AgentMonitor() {
  const { agents, selectedAgentId, setSelectedAgent } = useCockpitStore()

  return (
    <div className="flex h-full gap-0">
      {/* Agent list */}
      <div className="w-72 flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary text-sm flex items-center gap-2">
            <Activity size={15} className="text-gold-500" />
            Agent Monitor
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {agents.filter((a) => a.status !== 'offline').length} active
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {agents.map((a) => (
            <AgentCard
              key={a.id}
              agentId={a.id}
              isSelected={selectedAgentId === a.id}
              onClick={() => setSelectedAgent(a.id)}
            />
          ))}
        </div>
      </div>

      {/* Live view */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedAgentId ? (
          <LiveScreen agentId={selectedAgentId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Monitor size={40} className="text-text-muted" />
            <p className="text-text-muted text-sm">Select an agent to view live activity</p>
          </div>
        )}
      </div>
    </div>
  )
}
