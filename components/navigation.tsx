'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3, Zap, Shield, Settings } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/simulator', label: 'Strategy Simulator', icon: BarChart3 },
    { href: '/orchestrator', label: 'Skill Orchestrator', icon: Zap },
    { href: '/business', label: 'Business', icon: Shield },
  ]

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">SSO-TS</h1>
        <p className="text-xs text-muted-foreground mt-1">Trading Strategy Simulator</p>
      </div>

      <div className="flex-1 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link flex items-center gap-3 ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      <div className="space-y-2 border-t border-border pt-4 mt-4">
        <Link href="/about" className="nav-link flex items-center gap-3 text-xs">
          <Settings className="w-4 h-4" />
          <span>About</span>
        </Link>
        <p className="text-xs text-muted-foreground px-4 py-2">
          ⚠️ Simulation Only - Not Financial Advice
        </p>
      </div>
    </nav>
  )
}
