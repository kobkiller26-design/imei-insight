import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'IMEI Insight – Instant IMEI Check',
    template: '%s | IMEI Insight',
  },
  description:
    'Get detailed device information using your IMEI number. Instant results, comprehensive device data including blacklist status, carrier lock, and warranty information.',
  keywords: ['IMEI check', 'IMEI lookup', 'device information', 'blacklist check', 'carrier unlock'],
  openGraph: {
    type: 'website',
    title: 'IMEI Insight – Instant IMEI Check',
    description: 'Get detailed device information using your IMEI number.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-text-primary flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
