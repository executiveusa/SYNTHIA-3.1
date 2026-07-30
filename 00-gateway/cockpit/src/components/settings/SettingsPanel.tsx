'use client'
import { useState } from 'react'
import { Settings, Globe, KeyRound, CloudLightning, Github, MessageSquare, Zap, Save, Eye, EyeOff } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import { toast } from 'sonner'

function Section({ title, icon: Icon, children }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="panel-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <Icon size={15} className="text-gold-500" />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text', hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  hint?: string
}) {
  const [show, setShow] = useState(false)
  const isSecret = type === 'password'

  return (
    <div>
      <label className="text-xs font-medium text-text-secondary block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isSecret && !show ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field pr-9"
        />
        {isSecret && (
          <button
            onClick={() => setShow(!show)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-text-muted mt-1">{hint}</p>}
    </div>
  )
}

export function SettingsPanel() {
  const store = useCockpitStore()
  const [local, setLocal] = useState({
    anthropicKey: store.anthropicKey,
    githubToken: store.githubToken,
    cloudflareUrl: store.cloudflareUrl,
    whatsappToken: store.whatsappToken,
  })

  const save = () => {
    store.setSetting('anthropicKey',  local.anthropicKey)
    store.setSetting('githubToken',   local.githubToken)
    store.setSetting('cloudflareUrl', local.cloudflareUrl)
    store.setSetting('whatsappToken', local.whatsappToken)
    toast.success('Settings saved!')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Settings size={15} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary text-sm">Settings</h2>
        </div>
        <button onClick={save} className="btn-gold flex items-center gap-1.5 text-xs">
          <Save size={13} />
          Save Changes
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Language */}
        <Section title="Language & Region" icon={Globe}>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Interface Language</label>
            <div className="flex gap-2">
              {(['en', 'es'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => store.setLocale(l)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    store.locale === l
                      ? 'border-gold-500/40 bg-gold-500/10 text-gold-400'
                      : 'border-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {l === 'en' ? '🇺🇸 English' : '🇲🇽 Español (MX)'}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ALEX / Anthropic */}
        <Section title="ALEX — Anthropic API" icon={Zap}>
          <Field
            label="Anthropic API Key"
            value={local.anthropicKey}
            onChange={(v) => setLocal({ ...local, anthropicKey: v })}
            placeholder="sk-ant-..."
            type="password"
            hint="Get yours at console.anthropic.com — powers ALEX chat"
          />
          <div className="text-xs text-text-muted bg-muted/20 border border-border rounded-lg px-3 py-2">
            <p className="font-medium text-text-secondary mb-1">Or set in master.env:</p>
            <code className="font-mono text-gold-400">ANTHROPIC_API_KEY=sk-ant-...</code>
          </div>
        </Section>

        {/* GitHub */}
        <Section title="GitHub Integration" icon={Github}>
          <Field
            label="GitHub Personal Access Token"
            value={local.githubToken}
            onChange={(v) => setLocal({ ...local, githubToken: v })}
            placeholder="ghp_..."
            type="password"
            hint="Needs repo + workflow scopes"
          />
        </Section>

        {/* Cloudflare */}
        <Section title="Cloudflare Tunnel" icon={CloudLightning}>
          <Field
            label="Tunnel URL (WebSocket)"
            value={local.cloudflareUrl}
            onChange={(v) => setLocal({ ...local, cloudflareUrl: v })}
            placeholder="wss://your-tunnel.trycloudflare.com"
            hint="Run: cloudflared tunnel --url http://localhost:7681"
          />
          <div className="text-xs text-text-muted space-y-1">
            <p className="font-medium text-text-secondary">Setup:</p>
            <code className="block font-mono text-gold-400 bg-void/60 px-2 py-1 rounded">
              brew install cloudflare/cloudflare/cloudflared
            </code>
            <code className="block font-mono text-gold-400 bg-void/60 px-2 py-1 rounded">
              cloudflared tunnel --url http://localhost:7681
            </code>
            <p>Use ttyd or gotty to expose your terminal on port 7681.</p>
          </div>
        </Section>

        {/* WhatsApp */}
        <Section title="WhatsApp Business API" icon={MessageSquare}>
          <Field
            label="WhatsApp Cloud API Token"
            value={local.whatsappToken}
            onChange={(v) => setLocal({ ...local, whatsappToken: v })}
            placeholder="EAAxxxx..."
            type="password"
            hint="Meta Business Suite → WhatsApp → API Setup"
          />
          <Field
            label="Phone Number ID"
            value=""
            onChange={() => {}}
            placeholder="1234567890"
            hint="Found in WhatsApp Business API settings"
          />
        </Section>

        {/* Repos */}
        <Section title="Connected Repositories" icon={Github}>
          {[
            { repo: 'executiveusa/pauli-vibe_cockpit',  desc: 'This cockpit app',         status: 'connected' },
            { repo: 'executiveusa/pauli-sercets-vault-', desc: 'Secrets & env management', status: 'connected' },
            { repo: 'executiveusa/paulis-pope-bot',      desc: 'ALEX / Pope Bot core',     status: 'connected' },
            { repo: 'executiveusa/pauli-Uncodixfy',      desc: 'Design system',            status: 'connected' },
          ].map((r) => (
            <div key={r.repo} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-xs font-mono text-text-primary">{r.repo}</p>
                <p className="text-xs text-text-muted">{r.desc}</p>
              </div>
              <span className="text-xs text-signal-green">{r.status}</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  )
}
