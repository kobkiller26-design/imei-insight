import Link from 'next/link'
import IMEISearchBar from '@/components/IMEISearchBar'
import ServiceCard from '@/components/ServiceCard'

const features = [
  {
    icon: '🔍',
    title: 'Instant IMEI Lookup',
    description: 'Get comprehensive device information within minutes using our advanced IMEI24 API integration.',
  },
  {
    icon: '🔒',
    title: 'Blacklist Check',
    description: 'Verify if a device has been reported lost or stolen before purchasing a used phone.',
  },
  {
    icon: '📶',
    title: 'Carrier Status',
    description: 'Check if a device is carrier-locked or unlocked, saving you from expensive surprises.',
  },
  {
    icon: '🛡️',
    title: 'Warranty Info',
    description: 'Find out the remaining warranty status and activation details for any device.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Results',
    description: 'Our background polling system checks your order every 3 minutes for instant updates.',
  },
  {
    icon: '📊',
    title: 'Full Dashboard',
    description: 'Track all your IMEI checks with a comprehensive order history and statistics dashboard.',
  },
]

const popularServices = [
  {
    id: 'demo-1',
    name: 'iPhone Full Info Check',
    sell_price: 2.99,
    delivery_time: '1-5 minutes',
    category: 'Info',
    description: 'Complete device information including model, color, storage, and activation status.',
  },
  {
    id: 'demo-2',
    name: 'iPhone Blacklist Check',
    sell_price: 1.99,
    delivery_time: '1-3 minutes',
    category: 'Blacklist',
    description: 'Verify if iPhone is blacklisted or reported as lost/stolen.',
  },
  {
    id: 'demo-3',
    name: 'Samsung Carrier Check',
    sell_price: 3.49,
    delivery_time: '5-15 minutes',
    category: 'Carrier',
    description: 'Check carrier lock status for Samsung devices.',
  },
  {
    id: 'demo-4',
    name: 'iPhone Warranty Check',
    sell_price: 2.49,
    delivery_time: '1-5 minutes',
    category: 'Warranty',
    description: 'Check remaining Apple warranty and coverage details.',
  },
]

const stats = [
  { value: '500K+', label: 'IMEI Checks' },
  { value: '150+', label: 'Services' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<5min', label: 'Avg. Delivery' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Powered by IMEI24 API
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-6 leading-tight tracking-tight">
              Instant{' '}
              <span className="gradient-text">IMEI Check</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed">
              Get detailed device information using your IMEI number. Blacklist status,
              carrier lock, warranty info and more — all in minutes.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto mb-8">
              <IMEISearchBar size="large" redirectToCheck />
            </div>

            <p className="text-text-secondary text-sm">
              No account required for quick checks.{' '}
              <Link href="/register" className="text-primary hover:underline">
                Sign up free
              </Link>{' '}
              for unlimited access.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-text-secondary text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">
              Everything you need to{' '}
              <span className="gradient-text">verify a device</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              IMEI Insight provides comprehensive device intelligence with a
              professional-grade API backend and real-time result delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover">
                <div className="text-3xl mb-4" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-text-primary font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Popular Services</h2>
              <p className="text-text-secondary">
                Most requested IMEI check services
              </p>
            </div>
            <Link href="/services" className="btn-outline hidden sm:flex">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link href="/services" className="btn-outline">
              View all services →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title mb-4">
              Ready to check your{' '}
              <span className="gradient-text">device?</span>
            </h2>
            <p className="text-text-secondary mb-8">
              Join thousands of users who rely on IMEI Insight for accurate,
              fast device verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/imei-check" className="btn-accent">
                Check IMEI Now
              </Link>
              <Link href="/register" className="btn-outline">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
