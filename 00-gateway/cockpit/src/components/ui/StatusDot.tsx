import clsx from 'clsx'
import type { AgentStatus } from '@/types'

export function StatusDot({ status }: { status: AgentStatus }) {
  return (
    <span
      className={clsx('status-dot', {
        online:  status === 'online',
        busy:    status === 'busy',
        offline: status === 'offline',
        error:   status === 'error',
      })}
    />
  )
}
