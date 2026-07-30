'use client'
import { Globe, Bell, Wifi, WifiOff } from 'lucide-react'
import { useCockpitStore } from '@/lib/store'
import { useState } from 'react'
import clsx from 'clsx'

export function TopBar() {
  const { locale, setLocale, agents } = useCockpitStore()
  const [connected] = useState(true)
  const alex = agents.find((a) => a.id === 'alex-001')

  return (
    <header className="h-14 border-b border-border bg-panel flex items-center justify-between px-6 flex-shrink-0">
      {/* Left — breadcrumb / status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {connected
            ? <Wifi size={14} className="text-signal-green" />
            : <WifiOff size={14} className="text-signal-red" />}
          <span className="text-xs text-text-muted font-mono">
            {connected ? 'Cloudflare Tunnel Active' : 'Tunnel Offline'}
          </span>
        </div>
        {alex?.currentTask && (
          <>
            <span className="text-border">|</span>
            <span className="text-xs text-gold-500 font-mono animate-thinking">
              ALEX: {alex.currentTask}
            </span>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:border-gold-500/30 hover:bg-muted/30 transition-all text-xs text-text-secondary"
        >
          <Globe size={13} />
          <span className="font-medium uppercase">{locale}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted/40 transition-colors text-text-secondary hover:text-text-primary">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold-500" />
        </button>

        {/* ALEX avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className={clsx(
            'w-7 h-7 rounded-full bg-alex-gradient flex items-center justify-center text-xs font-bold text-void',
            alex?.status === 'online' && 'shadow-gold'
          )}>
            A
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary leading-none">ALEX</p>
            <p className={clsx('text-[10px] leading-none mt-0.5', {
              'text-signal-green': alex?.status === 'online',
              'text-gold-500':     alex?.status === 'busy',
              'text-text-muted':   alex?.status === 'offline',
            })}>
              {alex?.status ?? 'offline'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
