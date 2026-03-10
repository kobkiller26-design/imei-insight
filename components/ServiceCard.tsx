import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface Service {
  id: string
  name: string
  sell_price: number
  delivery_time: string
  category: string
  description?: string | null
}

interface ServiceCardProps {
  service: Service
  onSelect?: (service: Service) => void
  selected?: boolean
}

export default function ServiceCard({ service, onSelect, selected }: ServiceCardProps) {
  const categoryColors: Record<string, string> = {
    Unlock: 'text-blue-400 bg-blue-900/20',
    Blacklist: 'text-red-400 bg-red-900/20',
    Warranty: 'text-green-400 bg-green-900/20',
    Carrier: 'text-purple-400 bg-purple-900/20',
    Info: 'text-cyan-400 bg-cyan-900/20',
  }
  const categoryStyle =
    categoryColors[service.category] || 'text-gray-400 bg-gray-900/20'

  const content = (
    <div
      className={`card-hover group transition-all duration-200 ${
        onSelect ? 'cursor-pointer' : ''
      } ${selected ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' : ''}`}
      onClick={onSelect ? () => onSelect(service) : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(service)
              }
            }
          : undefined
      }
      aria-pressed={onSelect ? selected : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`badge text-xs px-2 py-1 rounded-md font-medium ${categoryStyle}`}>
          {service.category}
        </span>
        {selected && (
          <svg
            className="w-5 h-5 text-primary shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <h3 className="text-text-primary font-semibold text-sm mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
        {service.name}
      </h3>

      {service.description && (
        <p className="text-text-secondary text-xs mb-3 line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {service.delivery_time}
        </div>
        <span className="text-accent font-bold text-sm">
          {formatPrice(service.sell_price)}
        </span>
      </div>
    </div>
  )

  if (!onSelect) {
    return (
      <Link href={`/imei-check?service=${service.id}`} className="block">
        {content}
      </Link>
    )
  }

  return content
}
