'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import IMEISearchBar from '@/components/IMEISearchBar'
import ServiceCard from '@/components/ServiceCard'
import { formatPrice, getStatusColor } from '@/lib/utils'

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

interface CheckResult {
  orderId: string
  status: string
  result?: {
    device_model?: string
    brand?: string
    blacklist_status?: string
    carrier_lock?: string
    warranty?: string
    imei_status?: string
    [key: string]: unknown
  }
}

function IMEICheckContent() {
  const searchParams = useSearchParams()
  const [imei, setIMEI] = useState(searchParams.get('imei') || '')
  const [selectedServiceId, setSelectedServiceId] = useState(
    searchParams.get('service') || ''
  )
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services')
        if (!res.ok) throw new Error('Failed to load services')
        const data = await res.json()
        setServices(data)
      } catch {
        setError('Failed to load services. Please refresh.')
      } finally {
        setServicesLoading(false)
      }
    }
    loadServices()
  }, [])

  const handleSearch = useCallback((value: string) => {
    setIMEI(value)
    setResult(null)
    setError('')
  }, [])

  const handleServiceSelect = useCallback((service: { id: string }) => {
    setSelectedServiceId(service.id)
    setResult(null)
    setError('')
  }, [])

  const handleCheck = useCallback(async () => {
    if (!imei) {
      setError('Please enter an IMEI number.')
      return
    }
    if (!selectedServiceId) {
      setError('Please select a service.')
      return
    }
    setError('')
    setChecking(true)
    setResult(null)
    try {
      const res = await fetch('/api/imei-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei, serviceId: selectedServiceId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Check failed')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setChecking(false)
    }
  }, [imei, selectedServiceId])

  const selectedService = services.find((s) => s.id === selectedServiceId)

  const resultFields: { key: keyof NonNullable<CheckResult['result']>; label: string; icon: string }[] = [
    { key: 'device_model', label: 'Device Model', icon: '📱' },
    { key: 'brand', label: 'Brand', icon: '🏷️' },
    { key: 'blacklist_status', label: 'Blacklist Status', icon: '🚫' },
    { key: 'carrier_lock', label: 'Carrier Lock', icon: '🔒' },
    { key: 'warranty', label: 'Warranty', icon: '🛡️' },
    { key: 'imei_status', label: 'IMEI Status', icon: '✅' },
  ]

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title mb-3">
            <span className="gradient-text">IMEI Check</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Enter your device IMEI, select a service, and get instant results.
          </p>
        </div>

        {/* IMEI Search Bar */}
        <div className="card mb-8">
          <h2 className="text-text-primary font-semibold mb-4">Step 1 — Enter IMEI</h2>
          <IMEISearchBar
            onSearch={handleSearch}
            redirectToCheck={false}
            placeholder="Enter 15-digit IMEI number"
          />
          {imei && (
            <p className="mt-3 text-sm text-text-secondary">
              IMEI entered:{' '}
              <span className="font-mono text-accent">{imei}</span>
            </p>
          )}
        </div>

        {/* Service Selector */}
        <div className="card mb-8">
          <h2 className="text-text-primary font-semibold mb-4">Step 2 — Select a Service</h2>

          {servicesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-border/40 animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="text-text-secondary text-sm">No services available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                  selected={service.id === selectedServiceId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary + Check Button */}
        {selectedService && imei && (
          <div className="card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-text-secondary text-sm mb-1">Order Summary</p>
              <p className="text-text-primary font-semibold">{selectedService.name}</p>
              <p className="text-text-secondary text-sm">
                IMEI: <span className="font-mono text-accent">{imei}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-accent">
                {formatPrice(selectedService.sell_price)}
              </p>
              <p className="text-text-secondary text-xs">{selectedService.delivery_time}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/40 text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={!imei || !selectedServiceId || checking}
          className="btn-primary w-full text-lg py-4 mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checking ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check IMEI Now
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="card border-primary/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text-primary font-bold text-xl">Check Results</h2>
              <span className={`${getStatusColor(result.status)} text-sm px-3 py-1 rounded-full font-medium`}>
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </span>
            </div>

            <p className="text-text-secondary text-sm mb-6">
              Order ID:{' '}
              <span className="font-mono text-accent">{result.orderId}</span>
            </p>

            {result.result ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resultFields.map(({ key, label, icon }) => {
                  const value = result.result?.[key]
                  if (!value) return null
                  return (
                    <div key={key} className="bg-background rounded-lg p-4 border border-border">
                      <p className="text-text-secondary text-xs mb-1 flex items-center gap-1">
                        <span>{icon}</span>
                        {label}
                      </p>
                      <p className="text-text-primary font-semibold text-sm">
                        {String(value)}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-yellow-900/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-text-primary font-semibold mb-1">Order Submitted</p>
                <p className="text-text-secondary text-sm">
                  Your order is being processed. Results will be available shortly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default function IMEICheckPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <IMEICheckContent />
    </Suspense>
  )
}
