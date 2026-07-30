'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Root() {
  const router = useRouter()
  useEffect(() => { router.replace('/cockpit') }, [router])
  return (
    <div className="h-screen flex items-center justify-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-alex-gradient animate-pulse-gold" />
        <p className="text-text-muted text-sm font-mono">Initializing ALEX...</p>
      </div>
    </div>
  )
}
