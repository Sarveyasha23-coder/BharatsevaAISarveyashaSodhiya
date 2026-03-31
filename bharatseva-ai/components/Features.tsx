'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AudioLines,
  Briefcase,
  Camera,
  CloudSun,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Sprout,
} from 'lucide-react'

const features = [
  {
    title: 'Weather intelligence',
    description: 'Live forecasts, crop-friendly planning cues, and better context for rural decision making.',
    href: '/weather',
    icon: CloudSun,
    accent: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Career command',
    description: 'NCS-backed job market signals, employers, qualification lanes, and official actions.',
    href: '/career',
    icon: Briefcase,
    accent: 'from-[#1b5cff] to-indigo-600',
  },
  {
    title: 'Location intelligence',
    description: 'Nearby hospitals, police support, government offices, and regional context from live maps.',
    href: '/location',
    icon: MapPinned,
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Document OCR',
    description: 'Upload an image, extract text, detect document fields, and prepare form-ready values.',
    href: '/ocr',
    icon: Camera,
    accent: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Ayushman assistant',
    description: 'General health guidance, nearby hospital discovery, emergency pathways, and public schemes.',
    href: '/health',
    icon: HeartPulse,
    accent: 'from-rose-500 to-red-600',
  },
  {
    title: 'Fraud shield',
    description: 'Scan suspicious content, flag scam risk, and strengthen digital safety for citizens.',
    href: '/fraud',
    icon: ShieldCheck,
    accent: 'from-violet-500 to-fuchsia-600',
  },
  {
    title: 'Kisan workflows',
    description: 'Agriculture help across crop advice, farm intelligence, and field-facing support flows.',
    href: '/farmer',
    icon: Sprout,
    accent: 'from-lime-500 to-emerald-600',
  },
  {
    title: 'Voice-first access',
    description: 'Natural navigation and assistant-led workflows for users who prefer speaking over typing.',
    href: '/voice',
    icon: AudioLines,
    accent: 'from-slate-700 to-slate-900',
  },
]

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              Product modules
            </div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              The platform is now organized like a real startup product, not a generic feature grid.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Every module is positioned as a launch-ready workflow with faster entry points and clearer
            value for the person using it.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
            >
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              <Link
                href={feature.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-[#1b5cff] transition group-hover:translate-x-1"
              >
                Open module
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
