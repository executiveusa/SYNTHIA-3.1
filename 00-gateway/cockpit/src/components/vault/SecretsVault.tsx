'use client'
import { useState } from 'react'
import { KeyRound, Eye, EyeOff, Copy, Plus, Lock, Unlock, Shield, Check } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import { Badge } from '@/components/ui/Badge'
import type { VaultEntry } from '@/types'
import clsx from 'clsx'
import { toast } from 'sonner'

const DEMO_ENTRIES: VaultEntry[] = [
  { id: 'v1', key: 'ANTHROPIC_API_KEY',    category: 'api',  repo: 'all',               notes: 'Claude API key',         updatedAt: new Date(Date.now() - 86400000) },
  { id: 'v2', key: 'GH_TOKEN',             category: 'api',  repo: 'all',               notes: 'GitHub Personal Access Token', updatedAt: new Date(Date.now() - 172800000) },
  { id: 'v3', key: 'VERCEL_TOKEN',         category: 'api',  repo: 'all',               notes: 'Vercel deployment token',  updatedAt: new Date(Date.now() - 259200000) },
  { id: 'v4', key: 'CLOUDFLARE_API_TOKEN', category: 'api',  repo: 'all',               notes: 'Cloudflare API',           updatedAt: new Date(Date.now() - 345600000) },
  { id: 'v5', key: 'WHATSAPP_TOKEN',       category: 'api',  repo: 'pauli-cockpit',     notes: 'WA Business API',          updatedAt: new Date(Date.now() - 432000000) },
  { id: 'v6', key: 'DATABASE_URL',         category: 'db',   repo: 'pauli-cockpit',     notes: 'Production DB',            updatedAt: new Date(Date.now() - 518400000) },
]

const CAT_COLORS: Record<string, 'gold' | 'green' | 'blue' | 'purple' | 'muted'> = {
  api:   'gold',
  ssh:   'green',
  db:    'blue',
  env:   'purple',
  other: 'muted',
}

function EntryRow({ entry, unlocked }: { entry: VaultEntry; unlocked: boolean }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const value = entry.value || '••••••••••••••••••••'

  const copy = () => {
    if (!unlocked) { toast.error('Unlock vault first'); return }
    navigator.clipboard.writeText(entry.value || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success(`Copied ${entry.key}`)
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50 hover:bg-muted/10 transition-colors group">
      <Badge variant={CAT_COLORS[entry.category] || 'muted'}>{entry.category.toUpperCase()}</Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono font-medium text-text-primary">{entry.key}</p>
        {entry.notes && <p className="text-xs text-text-muted mt-0.5">{entry.notes}</p>}
      </div>
      {entry.repo && (
        <span className="text-xs text-text-muted font-mono hidden sm:block">{entry.repo}</span>
      )}
      <div className="flex items-center gap-1">
        {unlocked && (
          <button
            onClick={() => setVisible(!visible)}
            className="p-1.5 rounded-lg hover:bg-muted/40 text-text-muted hover:text-text-secondary transition-colors opacity-0 group-hover:opacity-100"
          >
            {visible ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
        <button
          onClick={copy}
          className="p-1.5 rounded-lg hover:bg-muted/40 text-text-muted hover:text-gold-400 transition-colors"
        >
          {copied ? <Check size={13} className="text-signal-green" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  )
}

export function SecretsVault() {
  const { vaultLocked, setVaultLocked } = useCockpitStore()
  const [password, setPassword] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const MASTER = 'pauli2024'  // Demo — replace with real auth

  const unlock = () => {
    if (password === MASTER) {
      setVaultLocked(false)
      setPassword('')
      toast.success('Vault unlocked')
    } else {
      toast.error('Incorrect password')
    }
  }

  const filtered = filter === 'all'
    ? DEMO_ENTRIES
    : DEMO_ENTRIES.filter((e) => e.category === filter)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            vaultLocked ? 'bg-text-muted/10' : 'bg-gold-500/10'
          )}>
            {vaultLocked
              ? <Lock size={15} className="text-text-muted" />
              : <Unlock size={15} className="text-gold-500" />}
          </div>
          <div>
            <h2 className="font-semibold text-text-primary text-sm">Secrets Vault</h2>
            <p className="text-xs text-text-muted">
              {vaultLocked ? 'Locked — enter master password' : `${DEMO_ENTRIES.length} secrets unlocked`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!vaultLocked && (
            <button
              onClick={() => setVaultLocked(true)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-signal-red transition-colors px-2 py-1 rounded hover:bg-signal-red/10"
            >
              <Lock size={12} />
              Lock
            </button>
          )}
          <button className="btn-gold flex items-center gap-1.5 text-xs">
            <Plus size={13} />
            Add Secret
          </button>
        </div>
      </div>

      {/* Unlock prompt */}
      {vaultLocked && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Shield size={28} className="text-gold-500" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-text-primary">Vault is Locked</h3>
            <p className="text-sm text-text-muted mt-1">Enter your master password to access secrets</p>
          </div>
          <div className="flex gap-2 w-full max-w-sm">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && unlock()}
              placeholder="Master password..."
              className="input-field"
            />
            <button onClick={unlock} className="btn-gold flex-shrink-0">
              <Unlock size={15} />
            </button>
          </div>
          <p className="text-xs text-text-muted">
            Demo password: <code className="font-mono text-gold-400">pauli2024</code>
          </p>
        </div>
      )}

      {/* Entries */}
      {!vaultLocked && (
        <>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-4 py-3 border-b border-border">
            {['all', 'api', 'ssh', 'db', 'env', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  filter === cat
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((e) => (
              <EntryRow key={e.id} entry={e} unlocked={!vaultLocked} />
            ))}
          </div>

          {/* Footer — env file hint */}
          <div className="px-6 py-3 border-t border-border bg-panel/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <KeyRound size={11} />
              <span>Master env: <code className="font-mono text-gold-400">E:\THE PAULI FILES\master.env</code></span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
