import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Layout({ children }: { children: ReactNode }) {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-navy-800 bg-navy-950 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-gold-500" />
            <span className="text-lg font-semibold tracking-tight text-white">
              Empire Projects
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                location.pathname === '/'
                  ? 'bg-electric-500/20 text-electric-300'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                to="/settings"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  location.pathname === '/settings'
                    ? 'bg-electric-500/20 text-electric-300'
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                Settings
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">
                {user?.user_metadata?.full_name ?? user?.email}
              </p>
              <p className="text-xs text-navy-400">
                {isAdmin ? 'Admin' : 'Subcontractor'}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isAdmin
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'bg-electric-500/20 text-electric-300'
              }`}
            >
              {isAdmin ? 'Admin' : 'Sub'}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="rounded-md border border-navy-700 px-3 py-1.5 text-sm text-navy-300 transition hover:border-navy-600 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
