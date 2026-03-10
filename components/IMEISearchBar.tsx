'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { validateIMEI } from '@/lib/utils'

interface IMEISearchBarProps {
  size?: 'default' | 'large'
  redirectToCheck?: boolean
  onSearch?: (imei: string) => void
  placeholder?: string
}

export default function IMEISearchBar({
  size = 'default',
  redirectToCheck = false,
  onSearch,
  placeholder = 'Enter 15-digit IMEI number',
}: IMEISearchBarProps) {
  const [imei, setIMEI] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 15)
      setIMEI(value)
      if (error) setError('')
    },
    [error]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const validation = validateIMEI(imei)
      if (!validation.valid) {
        setError(validation.error || 'Invalid IMEI')
        return
      }
      setError('')
      if (redirectToCheck) {
        router.push(`/imei-check?imei=${encodeURIComponent(imei)}`)
      } else if (onSearch) {
        onSearch(imei)
      }
    },
    [imei, redirectToCheck, onSearch, router]
  )

  const isLarge = size === 'large'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                />
              </svg>
            </div>
            <input
              type="text"
              value={imei}
              onChange={handleChange}
              placeholder={placeholder}
              maxLength={15}
              inputMode="numeric"
              pattern="\d{15}"
              className={`input-field pl-12 font-mono ${isLarge ? 'py-4 text-lg' : ''} ${
                error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''
              }`}
              aria-label="IMEI number"
              aria-describedby={error ? 'imei-error' : undefined}
            />
          </div>
          {error && (
            <p id="imei-error" className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`btn-accent shrink-0 ${isLarge ? 'py-4 px-8 text-lg' : ''}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Check IMEI
        </button>
      </div>

      {/* Character counter */}
      <p className="mt-2 text-xs text-muted text-right">
        {imei.length}/15 digits
      </p>
    </form>
  )
}
