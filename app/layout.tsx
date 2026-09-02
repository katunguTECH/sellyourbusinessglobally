import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TopBar } from '@/components/layout/TopBar'
import { Sidebar } from '@/components/layout/Sidebar'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sellyourbusinessglobally - Lead Generation Platform',
  description: 'Find verified emails, phone numbers, WhatsApp contacts for any business owner.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-background text-foreground antialiased`}>
        <TopBar />
        <Sidebar />
        <main className="pt-16 pl-64 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}