'use client'

import { useState } from 'react'
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils'
import Link from 'next/link'

interface OrderResult {
  device_model?: string
  brand?: string
  blacklist_status?: string
  carrier_lock?: string
  warranty?: string
  imei_status?: string
  [key: string]: unknown
}

interface Order {
  id: string
  imei: string
  service_name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  price: number
  created_at: string
  result?: OrderResult | null
}

// Demo placeholder orders (shows structure; empty in login-gated state)
const DEMO_ORDERS: Order[] = []

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const resultFields: { key: keyof OrderResult; label: string }[] = [
    { key: 'device_model', label: 'Device Model' },
    { key: 'brand', label: 'Brand' },
    { key: 'blacklist_status', label: 'Blacklist Status' },
    { key: 'carrier_lock', label: 'Carrier Lock' },
    { key: 'warranty', label: 'Warranty' },
    { key: 'imei_status', label: 'IMEI Status' },
  ]

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-1">Order History</h1>
            <p className="text-text-secondary">Track all your IMEI check orders and results.</p>
          </div>
          <Link href="/imei-check" className="btn-primary shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Check
          </Link>
        </div>

        {/* Login notice */}
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-text-primary text-sm">
            <span className="font-semibold">Login required</span> — sign in to view your full order history.
          </p>
          <div className="flex gap-2 shrink-0">
            <Link href="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {DEMO_ORDERS.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-border flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-text-primary font-bold text-lg mb-2">No orders found</p>
              <p className="text-text-secondary text-sm mb-6 max-w-sm">
                No orders found. Login to view your order history.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="btn-outline">Login</Link>
                <Link href="/imei-check" className="btn-primary">Run a Check</Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">IMEI</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Service</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Price</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Date</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ORDERS.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="border-b border-border/50 hover:bg-surface/60 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-accent">{order.imei}</td>
                        <td className="px-6 py-4 text-text-primary">{order.service_name}</td>
                        <td className="px-6 py-4">
                          <span className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-primary">{formatPrice(order.price)}</td>
                        <td className="px-6 py-4 text-text-secondary">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="btn-outline text-xs py-1.5 px-3"
                          >
                            {expandedId === order.id ? 'Hide' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedId === order.id && (
                        <tr key={`${order.id}-details`} className="bg-background/60">
                          <td colSpan={6} className="px-6 py-4">
                            {order.result ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                {resultFields.map(({ key, label }) => {
                                  const value = order.result?.[key]
                                  return (
                                    <div key={key} className="bg-surface rounded-lg p-3 border border-border">
                                      <p className="text-text-secondary text-xs mb-1">{label}</p>
                                      <p className="text-text-primary font-medium text-sm">
                                        {value ? String(value) : '—'}
                                      </p>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <p className="text-text-secondary text-sm italic">
                                Result not yet available — order is {order.status}.
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
