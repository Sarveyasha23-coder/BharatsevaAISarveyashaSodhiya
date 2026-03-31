'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  AudioLines,
  Briefcase,
  HeartPulse,
  MapPinned,
  Radar,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from 'lucide-react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Chat from '@/components/Chat'

interface QuickStats {
  schemes: number
  healthData: number
  ncsVacancies: number
  weatherLocation: string
  weatherTemp: number
}

const launchpad = [
  {
    title: 'Weather intelligence',
    description: 'Live forecast plus crop-sensitive guidance.',
    href: '/weather',
    icon: SunMedium,
  },
  {
    title: 'Career command',
    description: 'NCS live market metadata and quick actions.',
    href: '/career',
    icon: Briefcase,
  },
  {
    title: 'Location intelligence',
    description: 'Nearby civic services based on where you are.',
    href: '/location',
    icon: MapPinned,
  },
  {
    title: 'Ayushman assistant',
    description: 'Health guidance, schemes, and hospital discovery.',
    href: '/health',
    icon: HeartPulse,
  },
  {
    title: 'Fraud shield',
    description: 'Check suspicious messages, URLs, and scams.',
    href: '/fraud',
    icon: ShieldCheck,
  },
  {
    title: 'Voice-first assistant',
    description: 'Talk to the product instead of typing through forms.',
    href: '/voice',
    icon: AudioLines,
  },
]

export default function Home() {
  const [stats, setStats] = useState<QuickStats>({
    schemes: 0,
    healthData: 0,
    ncsVacancies: 0,
    weatherLocation: 'Loading',
    weatherTemp: 0,
  })

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const [schemesRes, healthRes, ncsRes, weatherRes] = await Promise.all([
          fetch('/api/schemes'),
          fetch('/api/health-data?limit=4'),
          fetch('/api/ncs?limit=5'),
          fetch('/api/weather?location=New Delhi'),
        ])

        const schemesData = await schemesRes.json()
        const healthData = await healthRes.json()
        const ncsData = await ncsRes.json()
        const weatherData = await weatherRes.json()

        setStats({
          schemes: schemesData.total || 0,
          healthData: healthData.total || 0,
          ncsVacancies: ncsData.summary?.totalVacancies || 0,
          weatherLocation: weatherData.location || 'New Delhi',
          weatherTemp: weatherData.temperature || 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchQuickStats()
  }, [])

  return (
    <main className="overflow-x-hidden">
      <div className="fixed right-4 top-24 z-40 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1b5cff] shadow-lg shadow-slate-900/10 backdrop-blur">
        Built by Sarveyasha Sodhiya
      </div>

      <section id="home">
        <Hero />
      </section>

      <section id="signals" className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[34px] border border-slate-200 bg-[#0f172a] p-8 text-white shadow-[0_35px_100px_rgba(15,23,42,0.28)]"
          >
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                  <Radar className="h-4 w-4 text-cyan-300" />
                  Live civic signal board
                </div>
                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Real sources, cleaner signal.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                The homepage now surfaces live weather, live health indicators, and live NCS market
                metadata instead of decorative filler cards.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-[28px] bg-white/8 p-5">
                <p className="text-sm text-slate-300">Official scheme directory</p>
                <p className="mt-2 text-3xl font-semibold">{stats.schemes}</p>
              </div>
              <div className="rounded-[28px] bg-white/8 p-5">
                <p className="text-sm text-slate-300">Health indicators online</p>
                <p className="mt-2 text-3xl font-semibold">{stats.healthData}</p>
              </div>
              <div className="rounded-[28px] bg-white/8 p-5">
                <p className="text-sm text-slate-300">NCS openings signal</p>
                <p className="mt-2 text-3xl font-semibold">{stats.ncsVacancies.toLocaleString()}</p>
              </div>
              <div className="rounded-[28px] bg-white/8 p-5">
                <p className="text-sm text-slate-300">Delhi weather now</p>
                <p className="mt-2 text-3xl font-semibold">{stats.weatherTemp} C</p>
                <p className="mt-2 text-sm text-slate-300">{stats.weatherLocation}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Features />

      <section id="launchpad" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                <Sparkles className="h-4 w-4 text-[#ff7a59]" />
                Exclusive launchpad
              </div>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                One screen to launch the highest-value workflows.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              This is the next-level layer: direct product launches instead of forcing users to browse a
              generic navigation tree.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {launchpad.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1b5cff]"
                >
                  Launch now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="chat" className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Talk to the platform
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              The AI assistant is still here, but now it sits inside a sharper product shell with a much
              better visual hierarchy.
            </p>
          </motion.div>
          <Chat />
        </div>
      </section>
    </main>
  )
}
