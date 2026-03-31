'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, AudioLines, Orbit, Radar, Sparkles } from 'lucide-react'

const pulseMetrics = [
  { label: 'Live weather intelligence', value: 'Open-Meteo' },
  { label: 'Health indicators', value: 'World Bank' },
  { label: 'Career market pulse', value: 'NCS' },
]

export default function Hero() {
  return (
    <section className="section-shell relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_20%_0%,rgba(27,92,255,0.24),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(255,122,89,0.24),transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg shadow-slate-900/5"
          >
            <Sparkles className="h-4 w-4 text-[#ff7a59]" />
            Startup-grade citizen platform with live public data
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="headline-balance max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
          >
            Government services, citizen intelligence, and AI workflows in one sharp command center.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl"
          >
            Bharat Seva AI is redesigned as a launch-ready public-tech product: faster navigation,
            cleaner workflows, live signals where public sources exist, and richer service discovery
            across weather, health, jobs, location support, OCR, and schemes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/#launchpad"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f172a] px-7 py-4 text-base font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.28)] transition hover:bg-slate-800"
            >
              Explore the platform
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/voice"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-800 transition hover:border-[#1b5cff] hover:text-[#1b5cff]"
            >
              <AudioLines className="h-4 w-4" />
              Open voice assistant
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {pulseMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[24px] border border-white/70 bg-white/78 p-4 shadow-lg shadow-slate-900/5 backdrop-blur"
              >
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="relative z-10"
        >
          <div className="glass-panel rounded-[36px] p-6 shadow-[0_35px_90px_rgba(15,23,42,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#1b5cff]">
                  National pulse
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">AI civic cockpit</h2>
              </div>
              <div className="rounded-2xl bg-slate-900 p-3 text-white">
                <Orbit className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] bg-[#0f172a] p-5 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                    Exclusive layer
                  </p>
                  <Radar className="h-5 w-5 text-cyan-300" />
                </div>
                <p className="text-2xl font-semibold">
                  Mission-control homepage with live civic signals and quick-launch flows.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Designed for</p>
                  <p className="mt-2 text-lg font-semibold">Citizens, students, farmers, families</p>
                </div>
                <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Working modes</p>
                  <p className="mt-2 text-lg font-semibold">Voice, OCR, location, web data</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Why it feels different</p>
                <p className="mt-2 text-base leading-7 text-slate-700">
                  Instead of another flat government portal clone, the experience behaves like a modern
                  startup product with bold hierarchy, faster launches, and cleaner decision support.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
