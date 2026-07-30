'use client'
import { useState } from 'react'
import { Users, Plus, Search, Building2, Mail, Phone, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Client } from '@/types'
import clsx from 'clsx'

const DEMO_CLIENTS: Client[] = [
  {
    id: 'cl1',
    name: 'Carlos Mendoza',
    company: 'TechMex Solutions',
    email: 'carlos@techmex.com',
    phone: '+52 55 1234 5678',
    plan: 'pro',
    agents: ['alex-001'],
    status: 'active',
    createdAt: new Date(Date.now() - 2592000000),
  },
  {
    id: 'cl2',
    name: 'Maria García',
    company: 'García & Asociados',
    email: 'maria@garcia.mx',
    phone: '+52 33 9876 5432',
    plan: 'starter',
    agents: ['alex-001'],
    status: 'trial',
    createdAt: new Date(Date.now() - 604800000),
  },
]

const PLAN_COLOR: Record<string, 'gold' | 'green' | 'blue'> = {
  starter:    'blue',
  pro:        'gold',
  enterprise: 'green',
}

const STATUS_COLOR: Record<string, 'green' | 'gold' | 'muted'> = {
  active:  'green',
  trial:   'gold',
  paused:  'muted',
}

export function ClientsPanel() {
  const [clients] = useState<Client[]>(DEMO_CLIENTS)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Users size={15} className="text-signal-purple" />
          <div>
            <h2 className="font-semibold text-text-primary text-sm">Client Management</h2>
            <p className="text-xs text-text-muted">{clients.length} clients — GoHighLevel replacement</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-gold flex items-center gap-1.5 text-xs"
        >
          <Plus size={13} />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-border flex-shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="input-field pl-8 text-xs"
          />
        </div>
      </div>

      {/* Client grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <Users size={40} className="text-text-muted" />
            <div>
              <p className="font-semibold text-text-primary">No clients yet</p>
              <p className="text-sm text-text-muted mt-1">Add your first client to get started.</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-gold">Add First Client</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <div key={client.id} className="panel-card p-5 hover:border-border/80 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-signal-purple/10 border border-signal-purple/20 flex items-center justify-center text-sm font-bold text-signal-purple">
                    {client.name[0]}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={STATUS_COLOR[client.status]}>{client.status}</Badge>
                    <Badge variant={PLAN_COLOR[client.plan]}>{client.plan}</Badge>
                  </div>
                </div>

                <h3 className="font-semibold text-text-primary text-sm">{client.name}</h3>
                {client.company && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 size={11} className="text-text-muted" />
                    <span className="text-xs text-text-muted">{client.company}</span>
                  </div>
                )}

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Mail size={11} className="text-text-muted" />
                    <span className="text-xs text-text-secondary">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={11} className="text-text-muted" />
                      <span className="text-xs text-text-secondary">{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Zap size={11} className="text-gold-500" />
                    <span className="text-xs text-text-secondary">{client.agents.length} agent(s)</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 btn-ghost text-xs border border-border">View</button>
                  <button className="flex-1 btn-ghost text-xs border border-border text-gold-400 hover:border-gold-500/30">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add client modal placeholder */}
      {showAdd && (
        <div className="fixed inset-0 bg-void/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="panel-card w-full max-w-md p-6 space-y-4">
            <h3 className="font-semibold text-text-primary">Add New Client</h3>
            {['Name', 'Company', 'Email', 'Phone'].map((f) => (
              <div key={f}>
                <label className="text-xs text-text-muted mb-1 block">{f}</label>
                <input className="input-field" placeholder={f} />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 btn-ghost border border-border">Cancel</button>
              <button className="flex-1 btn-gold">Save Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
