'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Building2,
  ExternalLink,
  GraduationCap,
  Headphones,
  Search,
} from 'lucide-react'

interface JobTypeStat {
  id: string
  label: string
  vacancies: number
}

interface CareerPayload {
  data: JobTypeStat[]
  educationLevels: string[]
  topEmployers: string[]
  summary: {
    totalVacancies: number
    totalEmployers: number
    totalQualifications: number
    helpline: string
  }
  supportLinks: Array<{ title: string; href: string }>
  lastUpdated: string
  source: string
}

export default function CareerPage() {
  const [careerData, setCareerData] = useState<CareerPayload | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCareerSignals = async () => {
      try {
        const response = await fetch('/api/ncs')
        const data = await response.json()
        setCareerData(data)
      } catch (error) {
        console.error('Failed to fetch NCS data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCareerSignals()
  }, [])

  const filteredEmployers = useMemo(() => {
    if (!careerData) {
      return []
    }

    if (!searchTerm) {
      return careerData.topEmployers
    }

    return careerData.topEmployers.filter((employer) =>
      employer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [careerData, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1e8] pt-20">
        <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-[#1b5cff]" />
      </div>
    )
  }

  if (!careerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1e8] pt-20">
        <p className="text-lg text-slate-700">Live career signals are temporarily unavailable.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8] pt-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="mb-5 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            National Career Service live market pulse
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Track active job demand, qualification signals, and hiring platforms in one place.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            This view pulls live NCS job market metadata and packages it into a cleaner command center
            for citizens, students, and job seekers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>Source: {careerData.source}</span>
            <span>Last updated: {new Date(careerData.lastUpdated).toLocaleString('en-IN')}</span>
          </div>
        </motion.div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-[28px] bg-[#0f172a] p-6 text-white shadow-[0_25px_60px_rgba(15,23,42,0.28)]">
            <Briefcase className="mb-4 h-7 w-7 text-cyan-300" />
            <p className="text-sm text-slate-300">Active openings signal</p>
            <p className="mt-2 text-3xl font-semibold">
              {careerData.summary.totalVacancies.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <Building2 className="mb-4 h-7 w-7 text-[#1b5cff]" />
            <p className="text-sm text-slate-500">Employers in the live directory</p>
            <p className="mt-2 text-3xl font-semibold">{careerData.summary.totalEmployers}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <GraduationCap className="mb-4 h-7 w-7 text-emerald-600" />
            <p className="text-sm text-slate-500">Qualification bands</p>
            <p className="mt-2 text-3xl font-semibold">{careerData.summary.totalQualifications}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <Headphones className="mb-4 h-7 w-7 text-amber-600" />
            <p className="text-sm text-slate-500">NCS helpline</p>
            <p className="mt-2 text-3xl font-semibold">{careerData.summary.helpline}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Job type momentum</h2>
                <p className="text-sm text-slate-500">Live counts surfaced by NCS filters</p>
              </div>
            </div>

            <div className="space-y-4">
              {careerData.data.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-medium">{item.label}</h3>
                    <span className="text-lg font-semibold text-[#1b5cff]">
                      {item.vacancies.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#1b5cff] via-cyan-500 to-emerald-500"
                      style={{
                        width: `${Math.max(
                          12,
                          careerData.summary.totalVacancies
                            ? (item.vacancies / careerData.summary.totalVacancies) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-2xl font-semibold">Qualification lanes</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {careerData.educationLevels.map((level) => (
                  <span
                    key={level}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Featured employers</h2>
                <div className="relative w-full max-w-[220px]">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Filter employers"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none ring-0"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                {filteredEmployers.slice(0, 10).map((employer) => (
                  <div
                    key={employer}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {employer}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-2xl font-semibold">Official actions</h2>
              <div className="mt-5 grid gap-3">
                {careerData.supportLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-800 transition hover:border-[#1b5cff] hover:text-[#1b5cff]"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
