'use client'

import { useState, useCallback } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      // Simulated submission delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSubmitted(true)
      setLoading(false)
    },
    []
  )

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">
            <span className="gradient-text">Contact Us</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Have a question or need help? We&apos;re here for you. Fill out the form and we&apos;ll
            get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3 card">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-900/20 flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Message sent!</h2>
                <p className="text-text-secondary text-sm mb-6 max-w-xs">
                  Thanks for reaching out, <span className="text-accent">{name}</span>. We&apos;ll
                  reply to <span className="text-accent">{email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage('') }}
                  className="btn-outline text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-text-primary font-bold text-xl mb-6">Send a Message</h2>

                <div className="mb-4">
                  <label htmlFor="contact-name" className="block text-text-secondary text-sm font-medium mb-2">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    required
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contact-email" className="block text-text-secondary text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="contact-message" className="block text-text-secondary text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    required
                    rows={5}
                    className="input-field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !name || !email || !message}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Company Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="card">
              <h3 className="text-text-primary font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: 'Email',
                    value: 'support@imeiinsight.com',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: 'Response time',
                    value: 'Within 24 hours',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    ),
                    label: 'Support',
                    value: 'Monday – Friday, 9am–5pm UTC',
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">{label}</p>
                      <p className="text-text-primary text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <h3 className="text-text-primary font-semibold mb-2">Need instant help?</h3>
              <p className="text-text-secondary text-sm">
                Browse our FAQ or check the documentation for quick answers to common questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
