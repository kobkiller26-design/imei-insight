'use client'

import { useState } from 'react'
import Link from 'next/link'
import IMEISearchBar from '@/components/IMEISearchBar'
import { useRouter } from 'next/navigation'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [checkedIMEI, setCheckedIMEI] = useState('')

  function handleIMEISearch(imei: string) {
    setCheckedIMEI(imei)
    router.push(`/imei-check?imei=${encodeURIComponent(imei)}`)
  }

  const stats = [
    {
      label: 'Total Orders',
      value: 0,
      color: 'bg-primary/10 text-primary',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: 0,
      color: 'bg-green-900/20 text-green-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending',
      value: 0,
      color: 'bg-yellow-900/20 text-yellow-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Failed',
      value: 0,
      color: 'bg-red-900/20 text-red-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-1">Dashboard</h1>
          <p className="text-text-secondary">Welcome back. Manage your IMEI checks and orders.</p>
        </div>

        {/* Login Notice */}
        <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-text-primary text-sm">
              <span className="font-semibold">Login to see your stats</span> — create an account or sign in to track your orders and results.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/login" className="btn-outline text-sm py-2 px-4">
              Login
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">
              Register
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick IMEI Check */}
          <div className="card lg:col-span-1">
            <h2 className="text-text-primary font-bold text-lg mb-1">Quick IMEI Check</h2>
            <p className="text-text-secondary text-sm mb-4">
              Enter an IMEI to get started instantly.
            </p>
            <IMEISearchBar
              onSearch={handleIMEISearch}
              redirectToCheck={false}
              placeholder="Enter IMEI number"
            />
            {checkedIMEI && (
              <p className="mt-2 text-xs text-accent font-mono">Redirecting for: {checkedIMEI}</p>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary font-bold text-lg">Recent Orders</h2>
              <Link href="/orders" className="text-accent text-sm hover:underline">
                View all →
              </Link>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-text-primary font-semibold mb-1">No orders yet</p>
              <p className="text-text-secondary text-sm mb-4">
                Login to view your order history.
              </p>
              <Link href="/login" className="btn-outline text-sm py-2">
                Login to continue
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/imei-check', label: 'New IMEI Check', desc: 'Run a fresh IMEI check', icon: '🔍' },
            { href: '/services', label: 'Browse Services', desc: 'Explore all available checks', icon: '⚡' },
            { href: '/orders', label: 'Order History', desc: 'View past orders and results', icon: '📋' },
          ].map(({ href, label, desc, icon }) => (
            <Link key={href} href={href} className="card-hover flex items-center gap-4 group">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-text-primary font-semibold text-sm group-hover:text-primary transition-colors">{label}</p>
                <p className="text-text-secondary text-xs">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
