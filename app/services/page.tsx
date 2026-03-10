'use client'

import { useState, useEffect, useMemo } from 'react'
import ServiceCard from '@/components/ServiceCard'

interface Service {
  id: string
  name: string
  api_service_id: string
  api_price: number
  sell_price: number
  delivery_time: string
  category: string
  description?: string | null
}

const CATEGORIES = ['All', 'Info', 'Blacklist', 'Carrier', 'Warranty', 'Unlock']

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-5 w-16 rounded bg-border/60 mb-3" />
      <div className="h-4 w-3/4 rounded bg-border/60 mb-2" />
      <div className="h-3 w-full rounded bg-border/40 mb-1" />
      <div className="h-3 w-2/3 rounded bg-border/40 mb-4" />
      <div className="flex justify-between items-center pt-3 border-t border-border">
        <div className="h-3 w-20 rounded bg-border/40" />
        <div className="h-4 w-14 rounded bg-border/60" />
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/services')
        if (!res.ok) throw new Error('Failed to fetch services')
        const data = await res.json()
        setServices(data)
      } catch {
        setError('Unable to load services. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [services, activeCategory, search])

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title mb-3">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Professional IMEI check services for device verification, blacklist status,
            carrier unlock, warranty information, and more.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services…"
                className="input-field pl-10"
                aria-label="Search services"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-background border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-text-secondary text-sm mb-4">
            Showing{' '}
            <span className="text-text-primary font-medium">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'service' : 'services'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/40 text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
            ? filtered.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            : !error && (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-text-primary font-semibold mb-1">No services found</p>
                  <p className="text-text-secondary text-sm">Try adjusting your search or filter.</p>
                </div>
              )}
        </div>
      </div>
    </main>
  )
}
