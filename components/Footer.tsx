import Link from 'next/link'

const footerLinks = {
  Product: [
    { href: '/imei-check', label: 'IMEI Check' },
    { href: '/services', label: 'Services' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/orders', label: 'Order History' },
  ],
  Company: [
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="text-accent">📡</span>
              <span className="gradient-text">IMEI Insight</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Instant IMEI checks with detailed device information. Fast, accurate,
              and reliable mobile device verification.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-text-primary font-semibold mb-4">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} IMEI Insight. All rights reserved.
          </p>
          <p className="text-text-secondary text-sm">
            Powered by{' '}
            <span className="text-accent font-medium">IMEI24 API</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
