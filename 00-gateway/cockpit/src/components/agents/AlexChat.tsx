'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Bot, User, Zap, Copy, Check } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import type { ChatMessage } from '@/types'
import clsx from 'clsx'
import { toast } from 'sonner'

const ALEX_SYSTEM = `You are ALEX, a world-class AI business agent built for the Pauli ecosystem. You are bilingual (English and Mexican Spanish), highly capable, direct, and professional. You help manage workflows, code, clients, and communications. You have access to terminal, WhatsApp, GitHub, Cloudflare, and client management tools. Be concise and powerful.`

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('flex gap-3 group', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
        isUser ? 'bg-muted' : 'bg-alex-gradient shadow-gold'
      )}>
        {isUser ? <User size={13} className="text-text-secondary" /> : <Zap size={13} className="text-void" />}
      </div>

      {/* Bubble */}
      <div className={clsx(
        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative',
        isUser
          ? 'bg-muted text-text-primary rounded-tr-sm'
          : 'bg-panel border border-border text-text-primary rounded-tl-sm'
      )}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        <div className={clsx(
          'flex items-center gap-2 mt-1',
          isUser ? 'justify-start flex-row-reverse' : 'justify-start'
        )}>
          <span className="text-[10px] text-text-muted">
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-secondary"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-alex-gradient shadow-gold flex items-center justify-center flex-shrink-0">
        <Zap size={13} className="text-void" />
      </div>
      <div className="bg-panel border border-gold-500/20 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold-500"
              style={{ animation: `thinking 1.5s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AlexChat() {
  const { alexMessages, alexThinking, addAlexMessage, setAlexThinking, clearAlexChat, anthropicKey } = useCockpitStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [alexMessages, alexThinking])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || alexThinking) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    addAlexMessage(userMsg)
    setInput('')
    setAlexThinking(true)

    try {
      const response = await fetch('/api/alex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...alexMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          apiKey: anthropicKey,
          systemPrompt: ALEX_SYSTEM,
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      addAlexMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content || 'No response.',
        timestamp: new Date(),
      })
    } catch (err) {
      addAlexMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error connecting to ALEX. Check your Anthropic API key in Settings.\n\n_Hint: Go to Settings → ALEX Configuration and add your key._`,
        timestamp: new Date(),
      })
    } finally {
      setAlexThinking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-alex-gradient shadow-gold flex items-center justify-center">
            <Zap size={16} className="text-void" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary text-sm">ALEX — AI Agent</h2>
            <p className="text-xs text-signal-green">Online & Ready</p>
          </div>
        </div>
        <button
          onClick={clearAlexChat}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-signal-red transition-colors px-2 py-1 rounded-lg hover:bg-signal-red/10"
        >
          <Trash2 size={13} />
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {alexMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-alex-gradient/10 border border-gold-500/20 flex items-center justify-center">
              <Bot size={28} className="text-gold-500" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">ALEX is ready</p>
              <p className="text-sm text-text-muted mt-1">
                Ask me anything — code, clients, WhatsApp, GitHub, or anything you need.
              </p>
            </div>
            {[
              'Deploy my latest code to Vercel',
              'Send WhatsApp update to all active clients',
              'Show me what agents are running',
            ].map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); inputRef.current?.focus() }}
                className="text-xs text-text-muted hover:text-gold-400 border border-border hover:border-gold-500/30 px-3 py-1.5 rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {alexMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {alexThinking && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border flex-shrink-0">
        <div className="flex items-end gap-2 bg-surface border border-border rounded-xl px-3 py-2 focus-within:border-gold-500/40 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ALEX anything... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || alexThinking}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-alex-gradient flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-gold"
          >
            <Send size={14} className="text-void" />
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-1.5 px-1">
          ALEX can make mistakes. Verify important actions.
        </p>
      </div>
    </div>
  )
}
