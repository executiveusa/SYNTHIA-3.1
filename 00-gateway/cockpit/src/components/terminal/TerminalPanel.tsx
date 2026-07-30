'use client'
import { useEffect, useRef, useState } from 'react'
import { Terminal as TermIcon, Wifi, WifiOff, Trash2, ExternalLink } from 'lucide-react'

/* xterm.js is loaded dynamically to avoid SSR issues */
export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<unknown>(null)
  const fitRef = useRef<unknown>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')

  useEffect(() => {
    let term: import('@xterm/xterm').Terminal
    let fitAddon: import('@xterm/addon-fit').FitAddon

    async function init() {
      if (!containerRef.current) return

      // Dynamic import for client-side only
      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')
      const { WebLinksAddon } = await import('@xterm/addon-web-links')

      term = new Terminal({
        theme: {
          background:    '#08080A',
          foreground:    '#F8F8FC',
          cursor:        '#F5A623',
          cursorAccent:  '#08080A',
          black:         '#1E1E28',
          red:           '#EF4444',
          green:         '#22C55E',
          yellow:        '#F5A623',
          blue:          '#3B82F6',
          magenta:       '#8B5CF6',
          cyan:          '#06B6D4',
          white:         '#F8F8FC',
          brightBlack:   '#3A3A50',
          brightRed:     '#F87171',
          brightGreen:   '#4ADE80',
          brightYellow:  '#FCD34D',
          brightBlue:    '#60A5FA',
          brightMagenta: '#A78BFA',
          brightCyan:    '#22D3EE',
          brightWhite:   '#FFFFFF',
        },
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 13,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 5000,
      })

      fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.loadAddon(new WebLinksAddon())
      term.open(containerRef.current)
      fitAddon.fit()
      termRef.current = term
      fitRef.current = fitAddon

      // Welcome banner
      term.writeln('\x1b[33m ╔═══════════════════════════════════════╗\x1b[0m')
      term.writeln('\x1b[33m ║  Pauli Cockpit — ALEX Terminal        ║\x1b[0m')
      term.writeln('\x1b[33m ║  Powered by Ghostty shell integration ║\x1b[0m')
      term.writeln('\x1b[33m ╚═══════════════════════════════════════╝\x1b[0m')
      term.writeln('')
      term.writeln('\x1b[90mTo connect to your local machine, run:\x1b[0m')
      term.writeln('\x1b[36m  cloudflared tunnel run pauli-cockpit\x1b[0m')
      term.writeln('')
      term.writeln('\x1b[90mOr configure WebSocket terminal server URL in Settings.\x1b[0m')
      term.writeln('')

      // Handle keyboard input
      term.onKey(({ key, domEvent }) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'input', data: key }))
        } else {
          // Local echo for demo
          if (domEvent.key === 'Enter') {
            term.writeln('')
          } else if (domEvent.key === 'Backspace') {
            term.write('\b \b')
          } else {
            term.write(key)
          }
        }
      })

      // Resize handler
      const resizeObs = new ResizeObserver(() => {
        fitAddon.fit()
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'resize',
            cols: term.cols,
            rows: term.rows,
          }))
        }
      })
      if (containerRef.current.parentElement) {
        resizeObs.observe(containerRef.current.parentElement)
      }

      return () => resizeObs.disconnect()
    }

    init()

    return () => {
      wsRef.current?.close()
      ;(termRef.current as import('@xterm/xterm').Terminal | null)?.dispose()
    }
  }, [])

  const connect = (wsUrl: string) => {
    if (!wsUrl) return
    setStatus('connecting')
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      setStatus('connected')
      ;(termRef.current as import('@xterm/xterm').Terminal | null)?.writeln('\x1b[32m✓ Connected to terminal server\x1b[0m\r\n')
    }

    ws.onmessage = (e) => {
      const msg = typeof e.data === 'string' ? JSON.parse(e.data) : null
      if (msg?.type === 'output') {
        ;(termRef.current as import('@xterm/xterm').Terminal | null)?.write(msg.data)
      }
    }

    ws.onclose = () => {
      setConnected(false)
      setStatus('idle')
      ;(termRef.current as import('@xterm/xterm').Terminal | null)?.writeln('\r\n\x1b[33m⚠ Connection closed\x1b[0m')
    }

    ws.onerror = () => {
      setStatus('error')
      ;(termRef.current as import('@xterm/xterm').Terminal | null)?.writeln('\r\n\x1b[31m✗ Connection error\x1b[0m')
    }
  }

  const clearTerminal = () => {
    ;(termRef.current as import('@xterm/xterm').Terminal | null)?.clear()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border flex-shrink-0 bg-panel">
        <div className="flex items-center gap-3">
          <TermIcon size={15} className="text-gold-500" />
          <span className="text-sm font-semibold text-text-primary">Terminal</span>
          <div className="flex items-center gap-1.5">
            {connected
              ? <Wifi size={12} className="text-signal-green" />
              : <WifiOff size={12} className="text-text-muted" />}
            <span className={`text-xs font-mono ${connected ? 'text-signal-green' : 'text-text-muted'}`}>
              {status === 'connecting' ? 'Connecting...' : connected ? 'Connected' : 'Local Mode'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://ghostty.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <ExternalLink size={11} />
            Ghostty
          </a>
          <button
            onClick={clearTerminal}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-signal-red transition-colors px-2 py-1 rounded hover:bg-signal-red/10"
          >
            <Trash2 size={12} />
            Clear
          </button>
        </div>
      </div>

      {/* xterm container */}
      <div className="flex-1 overflow-hidden bg-void p-2">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  )
}
