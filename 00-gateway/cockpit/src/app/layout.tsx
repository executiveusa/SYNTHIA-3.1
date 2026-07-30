import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Pauli Cockpit — ALEX Command Center',
  description: 'AI Agent Command Center powered by ALEX. Manage agents, terminal, WhatsApp, and clients in one place.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#14141A',
              border: '1px solid #1E1E28',
              color: '#F8F8FC',
            },
          }}
        />
      </body>
    </html>
  )
}
