'use client'
import { useState } from 'react'
import { MessageSquare, Search, Send, Phone, MoreVertical, CheckCheck, QrCode } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import type { WAMessage } from '@/types'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'

const DEMO_CONTACTS = [
  { id: 'c1', name: 'Carlos Mendoza', phone: '+52 55 1234 5678', lastMessage: 'Gracias, hasta luego!', lastSeen: new Date(Date.now() - 3600000), unread: 2 },
  { id: 'c2', name: 'Maria García',   phone: '+52 33 9876 5432', lastMessage: 'Cuando podemos hablar?', lastSeen: new Date(Date.now() - 7200000), unread: 0 },
  { id: 'c3', name: 'John Smith',     phone: '+1 214 555 0199',  lastMessage: 'The proposal looks great', lastSeen: new Date(Date.now() - 86400000), unread: 1 },
]

const DEMO_MESSAGES: Record<string, WAMessage[]> = {
  c1: [
    { id: 'm1', contactId: 'c1', direction: 'in',  body: 'Hola! Quiero saber más sobre sus servicios.', timestamp: new Date(Date.now() - 7200000), status: 'read' },
    { id: 'm2', contactId: 'c1', direction: 'out', body: 'Hola Carlos! Con gusto te explico. ¿Qué necesitas exactamente?', timestamp: new Date(Date.now() - 7000000), status: 'read' },
    { id: 'm3', contactId: 'c1', direction: 'in',  body: 'Necesito un agente de IA para mi negocio.', timestamp: new Date(Date.now() - 6800000), status: 'read' },
    { id: 'm4', contactId: 'c1', direction: 'out', body: 'Perfecto! ALEX puede ayudarte. Te mando una propuesta ahora mismo.', timestamp: new Date(Date.now() - 3700000), status: 'read' },
    { id: 'm5', contactId: 'c1', direction: 'in',  body: 'Gracias, hasta luego!', timestamp: new Date(Date.now() - 3600000), status: 'read' },
  ],
}

function ContactList({ onSelect, activeId }: { onSelect: (id: string) => void; activeId: string | null }) {
  const [search, setSearch] = useState('')
  const filtered = DEMO_CONTACTS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  return (
    <div className="w-72 flex-shrink-0 border-r border-border flex flex-col">
      <div className="px-4 py-4 border-b border-border space-y-3">
        <h2 className="font-semibold text-text-primary text-sm flex items-center gap-2">
          <MessageSquare size={15} className="text-signal-green" />
          WhatsApp Business
        </h2>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="input-field pl-8 text-xs"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 text-left transition-colors',
              activeId === c.id ? 'bg-gold-500/5' : 'hover:bg-muted/20'
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-signal-green/20 to-signal-blue/20 border border-border flex items-center justify-center text-sm font-semibold text-text-primary flex-shrink-0">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-primary truncate">{c.name}</p>
                <span className="text-[10px] text-text-muted">
                  {formatDistanceToNow(c.lastSeen, { addSuffix: false })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-text-muted truncate">{c.lastMessage}</p>
                {c.unread > 0 && (
                  <span className="ml-2 min-w-[18px] h-[18px] rounded-full bg-signal-green text-void text-[10px] font-bold flex items-center justify-center px-1">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatWindow({ contactId }: { contactId: string }) {
  const contact = DEMO_CONTACTS.find((c) => c.id === contactId)
  const [messages, setMessages] = useState<WAMessage[]>(DEMO_MESSAGES[contactId] ?? [])
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), contactId, direction: 'out', body: text, timestamp: new Date(), status: 'sent' },
    ])
    setInput('')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-panel flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-signal-green/20 to-signal-blue/20 border border-border flex items-center justify-center text-sm font-semibold text-text-primary">
          {contact?.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">{contact?.name}</p>
          <p className="text-xs text-signal-green">Online</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost p-2"><Phone size={15} /></button>
          <button className="btn-ghost p-2"><MoreVertical size={15} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={clsx('flex', m.direction === 'out' ? 'justify-end' : 'justify-start')}>
            <div className={clsx(
              'max-w-[70%] px-3.5 py-2 rounded-2xl text-sm',
              m.direction === 'out'
                ? 'bg-signal-green/20 text-text-primary rounded-br-sm'
                : 'bg-panel border border-border text-text-primary rounded-bl-sm'
            )}>
              <p>{m.body}</p>
              <div className={clsx('flex items-center gap-1 mt-1', m.direction === 'out' ? 'justify-end' : 'justify-start')}>
                <span className="text-[10px] text-text-muted">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {m.direction === 'out' && (
                  <CheckCheck size={12} className={m.status === 'read' ? 'text-signal-blue' : 'text-text-muted'} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border flex-shrink-0 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="input-field"
        />
        <button onClick={send} className="btn-gold flex-shrink-0 !px-3">
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}

function ConnectQR() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-20 h-20 rounded-2xl bg-signal-green/10 border border-signal-green/20 flex items-center justify-center">
        <QrCode size={40} className="text-signal-green" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-text-primary">Connect WhatsApp Business</h3>
        <p className="text-sm text-text-muted mt-2 max-w-sm">
          Add your WhatsApp Business API token in Settings to enable real messaging. Demo mode is active.
        </p>
      </div>
      <div className="flex gap-3">
        <a
          href="https://business.whatsapp.com/products/business-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost border border-border"
        >
          Get API Access
        </a>
      </div>
    </div>
  )
}

export function WhatsAppPanel() {
  const { whatsappToken } = useCockpitStore()
  const [activeId, setActiveId] = useState<string | null>('c1')

  return (
    <div className="flex h-full">
      <ContactList onSelect={setActiveId} activeId={activeId} />
      {activeId ? (
        <ChatWindow contactId={activeId} />
      ) : (
        <ConnectQR />
      )}
    </div>
  )
}
