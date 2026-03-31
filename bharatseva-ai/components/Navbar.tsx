'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bot, LogOut, Menu, User, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Modules', href: '/#features' },
  { name: 'Signals', href: '/#signals' },
  { name: 'Launchpad', href: '/#launchpad' },
  { name: 'Weather', href: '/weather' },
  { name: 'Career', href: '/career' },
  { name: 'Schemes', href: '/live-schemes' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-[#f8f5ed]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white shadow-lg shadow-slate-900/20">
            <Bot className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1b5cff]">
              Built by Sarveyasha Sodhiya
            </p>
            <Link href="/" className="block truncate text-lg font-semibold text-slate-900">
              Bharat Seva AI
            </Link>
          </div>
        </motion.div>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#1b5cff]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 transition hover:text-[#1b5cff]">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#1b5cff] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#1249d1]"
              >
                Start free
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-[#f8f5ed] px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-2 border-t border-slate-200 pt-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-2 block rounded-2xl bg-[#1b5cff] px-4 py-3 text-center text-sm font-semibold text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Start free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
