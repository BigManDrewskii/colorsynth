import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ColorSynth',
  description: 'Create harmonious color schemes from a single base color.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen overflow-x-hidden`}>
        <div className="relative z-10">
          {children}
        </div>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="w-[800px] h-[800px] rounded-full bg-[#6366F1] opacity-10 blur-[200px] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 animate-pulse"></div>
        </div>
      </body>
    </html>
  )
}