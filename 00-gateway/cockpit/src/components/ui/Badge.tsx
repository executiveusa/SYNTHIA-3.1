import clsx from 'clsx'

type BadgeVariant = 'gold' | 'green' | 'red' | 'blue' | 'purple' | 'muted'

export function Badge({ children, variant = 'muted' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span
      className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', {
        'bg-gold-500/15 text-gold-400 border border-gold-500/25':     variant === 'gold',
        'bg-signal-green/15 text-signal-green border border-signal-green/25': variant === 'green',
        'bg-signal-red/15 text-signal-red border border-signal-red/25':       variant === 'red',
        'bg-signal-blue/15 text-signal-blue border border-signal-blue/25':    variant === 'blue',
        'bg-signal-purple/15 text-signal-purple border border-signal-purple/25': variant === 'purple',
        'bg-muted/60 text-text-secondary border border-border':               variant === 'muted',
      })}
    >
      {children}
    </span>
  )
}
