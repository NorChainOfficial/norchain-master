import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { AIAssistant } from '@/components/ai/AIAssistant'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NorChain PM Dashboard',
  description: 'Product Manager Dashboard for NorChain Ecosystem',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto gradient-bg grid-pattern relative">
                <div className="relative z-10">
                  {children}
                </div>
              </main>
              <AIAssistant />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
