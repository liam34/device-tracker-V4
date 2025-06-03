import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Device Tracker',
  description: 'Track and manage your devices efficiently',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
