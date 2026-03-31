'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Download,
  ExternalLink,
  IndianRupee,
  MapPin,
  Search,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Scheme {
  id: string
  title: string
  ministry: string
  category: string
  state: string
  targetGroup: string
  incomeGroup: string
  ageGroup: string
  description: string
  benefits: string
  applicationDeadline: string
  totalBeneficiaries: string
  budgetAllocated: string
  status: string
  applicationUrl: string
  lastUpdated: string
}

interface SchemesPayload {
  schemes: Scheme[]
  filters: {
    states: string[]
    categories: string[]
    targetGroups: string[]
  }
  source: string
  lastUpdated: string
}

export default function LiveSchemesDashboard() {
  const [payload, setPayload] = useState<SchemesPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: 'All India',
    category: 'All',
    targetGroup: 'All',
  })

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/schemes/live')
        const data = await response.json()
        setPayload(data)
      } catch (error) {
        toast.error('Failed to load schemes')
      } finally {
        setLoading(false)
      }
    }

    fetchSchemes()
  }, [])

  const filteredSchemes = useMemo(() => {
    if (!payload) {
      return []
    }

    return payload.schemes.filter((scheme) => {
      const matchesSearch =
        !searchQuery ||
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesState =
        filters.state === 'All India' ||
        scheme.state === filters.state ||
        scheme.state === 'All India'

      const matchesCategory =
        filters.category === 'All' || scheme.category === filters.category

      const matchesTarget =
        filters.targetGroup === 'All' || scheme.targetGroup === filters.targetGroup

      return matchesSearch && matchesState && matchesCategory && matchesTarget
    })
  }, [filters, payload, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-[#1b5cff]" />
      </div>
    )
  }

  if (!payload) {
    return <p className="text-center text-slate-600">Scheme explorer is temporarily unavailable.</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Official Government Schemes Explorer</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Verified official scheme portals with cleaner filtering and direct application access.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
              Verified Official Links
            </span>
            <span>Last updated: {new Date(payload.lastUpdated).toLocaleDateString('en-IN')}</span>
            <span>Source: {payload.source}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes, ministry, or description"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filters.state}
                onChange={(event) => setFilters((current) => ({ ...current, state: event.target.value }))}
                className="rounded-lg border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {payload.filters.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                className="rounded-lg border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {payload.filters.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filters.targetGroup}
                onChange={(event) => setFilters((current) => ({ ...current, targetGroup: event.target.value }))}
                className="rounded-lg border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {payload.filters.targetGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredSchemes.length} of {payload.schemes.length} schemes</span>
            <span className="flex items-center gap-2 text-blue-600">
              <Download className="h-4 w-4" />
              Official portal mode
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{scheme.title}</h3>
                  <p className="text-sm text-gray-600">{scheme.ministry}</p>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {scheme.status}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-700">{scheme.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{scheme.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target group</span>
                  <span className="font-medium text-gray-900">{scheme.targetGroup}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Benefits</span>
                  <span className="max-w-[170px] text-right font-medium text-gray-900">{scheme.benefits}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{scheme.state}</span>
                </div>
                <a
                  href={scheme.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open portal</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No schemes found</h3>
            <p className="text-gray-600">Try broadening the search or clearing the filters.</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4"
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">{payload.schemes.length}</div>
            <div className="text-sm text-gray-600">Official schemes</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <IndianRupee className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">{Math.max(payload.filters.categories.length - 1, 0)}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Users className="mx-auto mb-2 h-8 w-8 text-purple-600" />
            <div className="text-2xl font-bold text-gray-900">{Math.max(payload.filters.targetGroups.length - 1, 0)}</div>
            <div className="text-sm text-gray-600">Target groups</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-orange-600" />
            <div className="text-2xl font-bold text-gray-900">
              {new Date(payload.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </div>
            <div className="text-sm text-gray-600">Last updated</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
